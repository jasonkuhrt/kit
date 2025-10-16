import { FsLoc } from '#fs-loc'
import { Schema as S } from 'effect'
import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { type ExportDeclaration, type ModuleDeclaration, Node, type SourceFile } from 'ts-morph'
import { type Module, SourceLocation, TypeSignatureModel, ValueExport } from '../../schema.js'
import { absoluteToRelative } from '../path-utils.js'
import { extractExport } from './export.js'
import { type JSDocInfo, parseJSDoc } from './jsdoc.js'

/**
 * Find external markdown documentation for a module file.
 *
 * Supports two naming conventions (checked in order):
 * 1. Sibling .md file with same base name (e.g., `kind.ts` → `kind.md`)
 * 2. README.md in same directory (applies to any module in that directory)
 *
 * @param sourceFilePath - Absolute path to the source file
 * @returns Markdown content if found, undefined otherwise
 */
const findModuleReadme = (sourceFilePath: string): string | undefined => {
  const dir = dirname(sourceFilePath)
  const base = basename(sourceFilePath, extname(sourceFilePath))

  // Convention 1: Sibling .md file
  const siblingMd = join(dir, `${base}.md`)
  if (existsSync(siblingMd)) {
    return readFileSync(siblingMd, 'utf-8')
  }

  // Convention 2: README.md in same directory
  const readmeMd = join(dir, 'README.md')
  if (existsSync(readmeMd)) {
    return readFileSync(readmeMd, 'utf-8')
  }

  return undefined
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
): ValueExport => {
  const jsdoc = overrideJsdoc ?? parseJSDoc(exportDecl)

  return ValueExport.make({
    _tag: 'value',
    name: nsName,
    type: 'namespace',
    signature: TypeSignatureModel.make({
      text: `export * as ${nsName}`,
    }),
    description: jsdoc.description || nestedModule.description,
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
 * @returns JSDoc override if found, undefined otherwise
 */
const findNamespaceOverrideJSDoc = (
  sourceFile: SourceFile,
  nsName: string,
): JSDocInfo | undefined => {
  // First: Check for TypeScript namespace shadow (existing pattern)
  for (const statement of sourceFile.getStatements()) {
    if (Node.isModuleDeclaration(statement)) {
      if (statement.getName() === nsName) {
        // Found a TypeScript namespace with the same name
        return parseJSDoc(statement)
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
      // Convert markdown to JSDocInfo structure
      return {
        description: markdown,
        examples: [],
        deprecated: undefined,
        category: undefined,
        tags: {},
        params: {},
        returns: undefined,
        throws: [],
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
        const overrideJsdoc = findNamespaceOverrideJSDoc(sourceFile, nsName)

        // Create namespace export using helper
        moduleExports.push(createNamespaceExport(exportDecl, nsName, nestedModule, overrideJsdoc))
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
              const overrideJsdoc = findNamespaceOverrideJSDoc(referencedFile, nsName)

              // Create namespace export using helper
              moduleExports.push(createNamespaceExport(nestedExportDecl, nsName, nestedModule, overrideJsdoc))
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

  // Get module-level description from external markdown or JSDoc fallback
  let description = ''
  let descriptionSource: 'jsdoc' | 'md-file' | undefined
  let category: string | undefined

  // First: Check for external markdown documentation
  const sourceFilePath = sourceFile.getFilePath()
  const markdownContent = findModuleReadme(sourceFilePath)

  if (markdownContent) {
    // Use markdown content directly
    description = markdownContent
    descriptionSource = 'md-file'
    // Category would need to be parsed from frontmatter (future enhancement)
  } else {
    // Fallback: Use JSDoc from first statement
    const statements = sourceFile.getStatements()
    if (statements.length > 0) {
      const firstStatement = statements[0]!
      const jsdoc = parseJSDoc(firstStatement)
      description = jsdoc.description || ''
      descriptionSource = description ? 'jsdoc' : undefined
      category = jsdoc.category
    }
  }

  return {
    location,
    description,
    ...(descriptionSource ? { descriptionSource } : {}),
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
      description: '',
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
  const description = jsdoc.description || ''
  const category = jsdoc.category

  return {
    location,
    description,
    ...(description ? { descriptionSource: 'jsdoc' as const } : {}),
    ...(category ? { category } : {}),
    exports,
  }
}
