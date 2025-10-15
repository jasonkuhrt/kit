import { FsLoc } from '#fs-loc'
import { Schema as S } from 'effect'
import { type ExportDeclaration, type ModuleDeclaration, Node, type SourceFile } from 'ts-morph'
import { type Module, SourceLocation, TypeSignatureModel, ValueExport } from '../../schema.js'
import { absoluteToRelative } from '../path-utils.js'
import { extractExport } from './export.js'
import { type JSDocInfo, parseJSDoc } from './jsdoc.js'

/**
 * Create a namespace export from an export declaration and its nested module.
 *
 * This helper consolidates the common logic for creating namespace exports
 * from `export * as Name from './path'` declarations.
 *
 * @param exportDecl - The export declaration node
 * @param nsName - The namespace name
 * @param nestedModule - The extracted nested module
 * @returns A ValueExport representing the namespace
 */
const createNamespaceExport = (
  exportDecl: ExportDeclaration,
  nsName: string,
  nestedModule: Module,
): ValueExport => {
  const jsdoc = parseJSDoc(exportDecl)

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

        // Create namespace export using helper
        moduleExports.push(createNamespaceExport(exportDecl, nsName, nestedModule))
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

              // Create namespace export using helper
              moduleExports.push(createNamespaceExport(nestedExportDecl, nsName, nestedModule))
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

    // Use first declaration (typically there's only one)
    const decl = declarations[0]!

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

  // Get module-level JSDoc from the first statement (typically an export declaration)
  // The JSDoc comment above the first export is considered the module-level documentation
  let description = ''
  let category: string | undefined

  const statements = sourceFile.getStatements()
  if (statements.length > 0) {
    const firstStatement = statements[0]!
    const jsdoc = parseJSDoc(firstStatement)
    description = jsdoc.description || ''
    category = jsdoc.category
  }

  return {
    location,
    description,
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
    ...(category ? { category } : {}),
    exports,
  }
}
