import { FsLoc } from '#fs-loc'
import { Schema as S } from 'effect'
import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { type ExportDeclaration, type ModuleDeclaration, Node, type SourceFile } from 'ts-morph'
import {
  Docs,
  DocsProvenance,
  JSDocProvenance,
  MdFileProvenance,
  type Module,
  SourceLocation,
  TypeSignatureModel,
  ValueExport,
} from '../../schema.js'
import { absoluteToRelative } from '../path-utils.js'
import { extractExport } from './export.js'
import { type JSDocInfo, parseJSDoc } from './jsdoc.js'

/**
 * Find external markdown documentation file path for a module file.
 *
 * Supports two naming conventions (checked in order):
 * 1. Sibling .md file with same base name (e.g., `kind.ts` → `kind.md`)
 * 2. README.md in same directory (applies to any module in that directory)
 *
 * @param sourceFilePath - Absolute path to the source file
 * @returns Absolute path to markdown file if found, undefined otherwise
 */
const findModuleReadmePath = (sourceFilePath: string): string | undefined => {
  const dir = dirname(sourceFilePath)
  const base = basename(sourceFilePath, extname(sourceFilePath))

  // Convention 1: Sibling .md file
  const siblingMd = join(dir, `${base}.md`)
  if (existsSync(siblingMd)) {
    return siblingMd
  }

  // Convention 2: README.md in same directory
  const readmeMd = join(dir, 'README.md')
  if (existsSync(readmeMd)) {
    return readmeMd
  }

  return undefined
}

/**
 * Find external markdown documentation content for a module file.
 *
 * Supports two naming conventions (checked in order):
 * 1. Sibling .md file with same base name (e.g., `kind.ts` → `kind.md`)
 * 2. README.md in same directory (applies to any module in that directory)
 *
 * @param sourceFilePath - Absolute path to the source file
 * @returns Markdown content if found, undefined otherwise
 */
const findModuleReadme = (sourceFilePath: string): string | undefined => {
  const path = findModuleReadmePath(sourceFilePath)
  return path ? readFileSync(path, 'utf-8') : undefined
}

/**
 * Create a namespace export from an export declaration and its nested module.
 *
 * This helper consolidates the common logic for creating namespace exports
 * from `export * as Name from './path'` declarations.
 *
 * Supports the TypeScript namespace shadow pattern where a TypeScript namespace
 * declaration with the same name provides JSDoc that overrides the module-level JSDoc.
 *
 * @param exportDecl - The export declaration node
 * @param nsName - The namespace name
 * @param nestedModule - The extracted nested module
 * @param overrideJsdoc - Optional JSDoc from a TypeScript namespace shadow
 * @returns A ValueExport representing the namespace
 */
const createNamespaceExport = (
  exportDecl: ExportDeclaration,
  nsName: string,
  nestedModule: Module,
  overrideJsdoc?: JSDocInfo,
  isWrapperMarkdown?: boolean,
): ValueExport => {
  const jsdoc = overrideJsdoc ?? parseJSDoc(exportDecl)

  // Build docs and docsProvenance for namespace export
  let docs: typeof Docs.Type | undefined
  let docsProvenance: typeof DocsProvenance.Type | undefined

  if (overrideJsdoc) {
    // Shadow namespace or wrapper markdown override
    const description = overrideJsdoc.description || nestedModule.docs?.description
    const guide = overrideJsdoc.guide || nestedModule.docs?.guide

    docs = description || guide ? Docs.make({ description, guide }) : undefined

    // Track provenance
    const descriptionProv = overrideJsdoc.description
      ? JSDocProvenance.make({ shadowNamespace: true })
      : nestedModule.docsProvenance?.description

    const guideProv = overrideJsdoc.guide
      ? isWrapperMarkdown
        ? MdFileProvenance.make({
          filePath: S.decodeSync(FsLoc.RelFile.String)(
            absoluteToRelative(exportDecl.getSourceFile().getFilePath().replace(/\.ts$/, '.md')),
          ),
        })
        : JSDocProvenance.make({ shadowNamespace: true })
      : nestedModule.docsProvenance?.guide

    docsProvenance = descriptionProv || guideProv
      ? DocsProvenance.make({ description: descriptionProv, guide: guideProv })
      : undefined
  } else {
    // No override - use nested module's docs
    docs = nestedModule.docs
    docsProvenance = nestedModule.docsProvenance
  }

  return ValueExport.make({
    _tag: 'value',
    name: nsName,
    type: 'namespace',
    signature: TypeSignatureModel.make({
      text: `export * as ${nsName}`,
    }),
    ...(docs ? { docs } : {}),
    ...(docsProvenance ? { docsProvenance } : {}),
    examples: jsdoc.examples,
    deprecated: jsdoc.deprecated,
    category: jsdoc.category,
    tags: jsdoc.tags,
    sourceLocation: SourceLocation.make({
      file: S.decodeSync(FsLoc.RelFile.String)(
        absoluteToRelative(exportDecl.getSourceFile().getFilePath()),
      ),
      line: exportDecl.getStartLineNumber(),
    }),
    module: nestedModule,
  })
}

/**
 * Find documentation override for an ESM namespace re-export.
 *
 * Supports two patterns (checked in order):
 * 1. TypeScript namespace shadow: `export namespace X {}` with JSDoc
 * 2. Wrapper file markdown: External .md file for a pure wrapper file
 *    (file with EXACTLY ONE namespace export and NO other exports)
 *
 * @param sourceFile - The source file to search in
 * @param nsName - The namespace name to look for
 * @returns JSDoc override and flag indicating if from wrapper markdown
 */
const findNamespaceOverrideJSDoc = (
  sourceFile: SourceFile,
  nsName: string,
): { jsdoc: JSDocInfo; isWrapperMarkdown: boolean } | undefined => {
  // First: Check for TypeScript namespace shadow (existing pattern)
  for (const statement of sourceFile.getStatements()) {
    if (Node.isModuleDeclaration(statement)) {
      if (statement.getName() === nsName) {
        // Found a TypeScript namespace with the same name
        return { jsdoc: parseJSDoc(statement), isWrapperMarkdown: false }
      }
    }
  }

  // Second: Check if this is a pure wrapper file
  // A pure wrapper has exactly 1 namespace export and no other exports
  const exportDecls = sourceFile.getExportDeclarations()
  const exports = sourceFile.getExportedDeclarations()

  const namespaceExports = exportDecls.filter(d => d.getNamespaceExport())
  const isPureWrapper = namespaceExports.length === 1 && exports.size === 0

  if (isPureWrapper) {
    // Check for external markdown documentation
    const markdown = findModuleReadme(sourceFile.getFilePath())
    if (markdown) {
      // Convert markdown to JSDocInfo structure with guide field
      return {
        jsdoc: {
          description: undefined,
          guide: markdown,
          examples: [],
          deprecated: undefined,
          category: undefined,
          tags: {},
          params: {},
          returns: undefined,
          throws: [],
        },
        isWrapperMarkdown: true,
      }
    }
  }

  return undefined
}

/**
 * Options for module extraction.
 */
export type ModuleExtractionOptions = {
  /** Filter exports marked with @internal */
  filterInternal?: boolean
  /** Filter exports starting with underscore _ prefix */
  filterUnderscoreExports?: boolean
}

/**
 * Check if an export should be filtered based on JSDoc and naming conventions.
 */
const shouldFilterExport = (exportName: string, jsdoc: JSDocInfo, options: ModuleExtractionOptions): boolean => {
  // Filter if marked as @internal
  if (options.filterInternal && jsdoc.internal) {
    return true
  }

  // Filter if starts with underscore and option is enabled
  if (options.filterUnderscoreExports && exportName.startsWith('_')) {
    return true
  }

  return false
}

/**
 * Extract a module from a source file.
 *
 * @param sourceFile - The source file to extract from
 * @param location - Relative file path from project root
 * @param options - Extraction options for filtering
 * @returns Module with all exports
 */
export const extractModuleFromFile = (
  sourceFile: SourceFile,
  location: FsLoc.RelFile,
  options: ModuleExtractionOptions = {},
): Module => {
  const { filterInternal = true, filterUnderscoreExports = false } = options
  const exports = sourceFile.getExportedDeclarations()
  const moduleExports = []

  // Also check for namespace re-exports: export * as Name from './path'
  const exportDeclarations = sourceFile.getExportDeclarations()

  for (const exportDecl of exportDeclarations) {
    const namespaceExport = exportDecl.getNamespaceExport()

    if (namespaceExport) {
      // This is a namespace re-export: export * as Name from './path'
      const nsName = namespaceExport.getName()
      const referencedFile = exportDecl.getModuleSpecifierSourceFile()

      if (referencedFile) {
        // Extract the referenced module with its file location
        const nestedLocation = S.decodeSync(FsLoc.RelFile.String)(
          absoluteToRelative(referencedFile.getFilePath()),
        )
        const nestedModule = extractModuleFromFile(referencedFile, nestedLocation, options)

        // Check if this namespace export should be filtered
        const jsdoc = parseJSDoc(exportDecl)
        if (shouldFilterExport(nsName, jsdoc, options)) {
          continue
        }

        // Look for documentation override (TypeScript namespace shadow or wrapper markdown)
        const override = findNamespaceOverrideJSDoc(sourceFile, nsName)

        // Create namespace export using helper
        moduleExports.push(
          createNamespaceExport(
            exportDecl,
            nsName,
            nestedModule,
            override?.jsdoc,
            override?.isWrapperMarkdown,
          ),
        )
      }
    } else if (!exportDecl.getModuleSpecifier()) {
      // Skip export declarations without module specifier (not re-exports)
      continue
    } else {
      // This is a wildcard re-export: export * from './path'
      // Process namespace exports from the referenced file
      const referencedFile = exportDecl.getModuleSpecifierSourceFile()
      if (referencedFile) {
        const nestedExportDecls = referencedFile.getExportDeclarations()
        for (const nestedExportDecl of nestedExportDecls) {
          const nestedNsExport = nestedExportDecl.getNamespaceExport()
          if (nestedNsExport) {
            const nsName = nestedNsExport.getName()
            const nsFile = nestedExportDecl.getModuleSpecifierSourceFile()
            if (nsFile) {
              const nsLocation = S.decodeSync(FsLoc.RelFile.String)(
                absoluteToRelative(nsFile.getFilePath()),
              )
              const nestedModule = extractModuleFromFile(nsFile, nsLocation, options)

              // Check if this namespace export should be filtered
              const jsdoc = parseJSDoc(nestedExportDecl)
              if (shouldFilterExport(nsName, jsdoc, options)) {
                continue
              }

              // Look for documentation override (TypeScript namespace shadow or wrapper markdown)
              const override = findNamespaceOverrideJSDoc(referencedFile, nsName)

              // Create namespace export using helper
              moduleExports.push(
                createNamespaceExport(
                  nestedExportDecl,
                  nsName,
                  nestedModule,
                  override?.jsdoc,
                  override?.isWrapperMarkdown,
                ),
              )
            }
          }
        }
      }
    }
  }

  // Process regular exported declarations
  for (const [exportName, declarations] of exports) {
    // Skip default exports and type-only exports without declarations
    if (exportName === 'default' || declarations.length === 0) {
      continue
    }

    // Skip namespace re-exports (they contain '* as' in the name)
    if (exportName.includes('* as')) {
      continue
    }

    // Skip if already processed as namespace re-export
    if (moduleExports.some((e) => e.name === exportName)) {
      continue
    }

    // Process ALL declarations (can be multiple with declaration merging)
    for (const decl of declarations) {
      // Skip if this is a source file (namespace re-export from another file)
      if (Node.isSourceFile(decl)) {
        // This is a namespace re-exported from another file - skip it
        // It should have been processed in the namespace re-export section
        continue
      }

      // Check if this export should be filtered
      const jsdoc = parseJSDoc(decl)
      if (shouldFilterExport(exportName, jsdoc, options)) {
        continue
      }

      moduleExports.push(extractExport(exportName, decl))
    }
  }

  // Extract module-level documentation
  // Get module-level JSDoc
  const statements = sourceFile.getStatements()
  let moduleJSDoc: JSDocInfo | undefined
  if (statements.length > 0) {
    moduleJSDoc = parseJSDoc(statements[0]!)
  }

  // Build docs and docsProvenance
  const sourceFilePath = sourceFile.getFilePath()
  const markdownFilePath = findModuleReadmePath(sourceFilePath)

  const docDescription = moduleJSDoc?.description
  const docDescriptionProv = docDescription
    ? JSDocProvenance.make({ shadowNamespace: false })
    : undefined

  let docGuide: string | undefined
  let docGuideProv: typeof JSDocProvenance.Type | typeof MdFileProvenance.Type | undefined

  // Check for @guide tag in JSDoc
  const jsdocGuide = moduleJSDoc?.guide

  // Markdown file takes precedence over @guide tag
  if (markdownFilePath) {
    docGuide = readFileSync(markdownFilePath, 'utf-8')
    docGuideProv = MdFileProvenance.make({
      filePath: S.decodeSync(FsLoc.RelFile.String)(absoluteToRelative(markdownFilePath)),
    })

    // Warn if both exist
    if (jsdocGuide) {
      console.warn(
        `Warning: Both @guide tag and ${markdownFilePath} found for module. Using .md file. `
          + `Remove @guide tag or delete .md file.`,
      )
    }
  } else if (jsdocGuide) {
    docGuide = jsdocGuide
    docGuideProv = JSDocProvenance.make({ shadowNamespace: false })
  }

  const docs = docDescription || docGuide
    ? Docs.make({ description: docDescription, guide: docGuide })
    : undefined

  const docsProvenance = docDescriptionProv || docGuideProv
    ? DocsProvenance.make({ description: docDescriptionProv, guide: docGuideProv })
    : undefined

  const category = moduleJSDoc?.category

  return {
    location,
    ...(docs ? { docs } : {}),
    ...(docsProvenance ? { docsProvenance } : {}),
    ...(category ? { category } : {}),
    exports: moduleExports,
  }
}

/**
 * Extract a module from a namespace declaration.
 *
 * @param moduleDecl - The module/namespace declaration
 * @param location - Relative file path from project root
 * @param options - Extraction options for filtering
 * @returns Module with all namespace exports
 */
export const extractModule = (
  moduleDecl: ModuleDeclaration,
  location: FsLoc.RelFile,
  options: ModuleExtractionOptions = {},
): Module => {
  const body = moduleDecl.getBody()

  if (!body || !Node.isModuleBlock(body)) {
    return {
      location,
      exports: [],
    }
  }

  const exports = []

  // Get all exported declarations from the namespace
  for (const statement of body.getStatements()) {
    // Check for export keyword
    const hasExportModifier = statement.getCombinedModifierFlags() & 1 // ts.ModifierFlags.Export = 1
    if (!hasExportModifier) {
      continue
    }

    let exportName: string | undefined
    let declNode: Node | undefined

    if (Node.isFunctionDeclaration(statement)) {
      exportName = statement.getName()
      declNode = statement
    } else if (Node.isVariableStatement(statement)) {
      const decl = statement.getDeclarations()[0]
      exportName = decl?.getName()
      declNode = decl
    } else if (Node.isClassDeclaration(statement)) {
      exportName = statement.getName()
      declNode = statement
    } else if (Node.isInterfaceDeclaration(statement)) {
      exportName = statement.getName()
      declNode = statement
    } else if (Node.isTypeAliasDeclaration(statement)) {
      exportName = statement.getName()
      declNode = statement
    } else if (Node.isEnumDeclaration(statement)) {
      exportName = statement.getName()
      declNode = statement
    } else if (Node.isModuleDeclaration(statement)) {
      exportName = statement.getName()
      declNode = statement
    }

    if (exportName && declNode) {
      // Check if this export should be filtered
      const jsdoc = parseJSDoc(declNode)
      if (!shouldFilterExport(exportName, jsdoc, options)) {
        exports.push(extractExport(exportName, declNode as any))
      }
    }
  }

  // Get namespace description and category from JSDoc
  const jsdoc = parseJSDoc(moduleDecl)
  const description = jsdoc.description
  const guide = jsdoc.guide
  const category = jsdoc.category

  const docs = description || guide
    ? Docs.make({ description, guide })
    : undefined

  const docsProvenance = description || guide
    ? DocsProvenance.make({
      description: description ? JSDocProvenance.make({ shadowNamespace: true }) : undefined,
      guide: guide ? JSDocProvenance.make({ shadowNamespace: true }) : undefined,
    })
    : undefined

  return {
    location,
    ...(docs ? { docs } : {}),
    ...(docsProvenance ? { docsProvenance } : {}),
    ...(category ? { category } : {}),
    exports,
  }
}
