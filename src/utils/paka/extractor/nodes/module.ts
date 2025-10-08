import { type ModuleDeclaration, Node, type SourceFile } from 'ts-morph'
import type { Module } from '../../schema.js'
import { extractExport } from './export.js'
import { parseJSDoc } from './jsdoc.js'

/**
 * Extract a module from a source file.
 *
 * @param name - Module name
 * @param sourceFile - The source file to extract from
 * @returns Module with all exports
 */
export const extractModuleFromFile = (name: string, sourceFile: SourceFile): Module => {
  const exports = sourceFile.getExportedDeclarations()
  const moduleExports = []

  // Also check for namespace re-exports: export * as Name from './path'
  const exportDeclarations = sourceFile.getExportDeclarations()

  for (const exportDecl of exportDeclarations) {
    const namespaceExport = exportDecl.getNamespaceExport()

    if (namespaceExport) {
      // This is a namespace re-export
      const nsName = namespaceExport.getName()
      const referencedFile = exportDecl.getModuleSpecifierSourceFile()

      if (referencedFile) {
        // Extract the referenced module
        const nestedModule = extractModuleFromFile(nsName, referencedFile)

        // Create a namespace export with the nested module
        moduleExports.push({
          _tag: 'value',
          name: nsName,
          type: 'namespace',
          signature: `export * as ${nsName}`,
          description: nestedModule.description || '',
          examples: [],
          deprecated: undefined,
          tags: {},
          sourceLocation: {
            file: exportDecl.getSourceFile().getFilePath().replace(process.cwd() + '/', ''),
            line: exportDecl.getStartLineNumber(),
          },
          module: nestedModule,
        } as any)
      }
    }
  }

  // Process regular exported declarations
  for (const [exportName, declarations] of exports) {
    // Skip default exports and type-only exports without declarations
    if (exportName === 'default' || declarations.length === 0) {
      continue
    }

    // Skip if already processed as namespace re-export
    if (moduleExports.some((e) => e.name === exportName)) {
      continue
    }

    // Use first declaration (typically there's only one)
    const decl = declarations[0]!
    moduleExports.push(extractExport(exportName, decl))
  }

  // Try to get module-level JSDoc from first statement (could be a comment or export)
  const firstExportDecl = exportDeclarations[0]
  const description = firstExportDecl ? parseJSDoc(firstExportDecl).description || '' : ''

  return {
    name,
    description,
    exports: moduleExports,
  }
}

/**
 * Extract a module from a namespace declaration.
 *
 * @param name - Namespace name
 * @param moduleDecl - The module/namespace declaration
 * @returns Module with all namespace exports
 */
export const extractModule = (name: string, moduleDecl: ModuleDeclaration): Module => {
  const body = moduleDecl.getBody()

  if (!body || !Node.isModuleBlock(body)) {
    return {
      name,
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
      exports.push(extractExport(exportName, declNode as any))
    }
  }

  // Get namespace description from JSDoc
  const description = parseJSDoc(moduleDecl).description || ''

  return {
    name,
    description,
    exports,
  }
}
