import { type ExportedDeclarations, Node } from 'ts-morph'
import type { Export, Module, SourceLocation } from '../../schema.js'
import { categorize } from './categorize.js'
import { parseJSDoc } from './jsdoc.js'
import { extractModule } from './module.js'

/**
 * Simplify TypeScript type text by removing verbose import paths.
 *
 * Converts:
 *   import("/Users/.../kit/src/domains/num/non-zero/non-zero").NonZero
 * To:
 *   NonZero
 */
const simplifyTypeText = (typeText: string): string => {
  // Remove absolute import paths, keeping only the type name
  // Pattern: import("...").TypeName -> TypeName
  typeText = typeText.replace(/import\("[^"]+"\)\./g, '')

  // Also handle node_modules paths for external packages
  // Pattern: import("...node_modules/.../package").TypeName -> TypeName
  typeText = typeText.replace(/import\("[^"]*node_modules[^"]+"\)\./g, '')

  // Remove leading semicolons (TypeScript type separator quirk)
  typeText = typeText.replace(/^;\s*/, '')

  return typeText
}

/**
 * Extract just the type signature from a declaration, without implementation details.
 */
const extractSignature = (decl: ExportedDeclarations): string => {
  // Type aliases - these are already just signatures
  if (Node.isTypeAliasDeclaration(decl)) {
    return decl.getText()
  }

  // Interfaces - these are already just signatures
  if (Node.isInterfaceDeclaration(decl)) {
    return decl.getText()
  }

  // Enums - keep full text
  if (Node.isEnumDeclaration(decl)) {
    return decl.getText()
  }

  // Function declarations - get signature without body
  if (Node.isFunctionDeclaration(decl)) {
    const name = decl.getName() || 'anonymous'
    const typeParams = decl.getTypeParameters().map(tp => tp.getText()).join(', ')
    const params = decl.getParameters().map(p => p.getText()).join(', ')
    const returnType = simplifyTypeText(decl.getReturnType().getText())

    const typeParamsStr = typeParams ? `<${typeParams}>` : ''
    return `export function ${name}${typeParamsStr}(${params}): ${returnType}`
  }

  // Variable declarations (const, let, var)
  if (Node.isVariableDeclaration(decl)) {
    const type = decl.getType()
    const typeText = simplifyTypeText(type.getText())

    // Return just the type signature - the name is already shown separately in docs
    return typeText
  }

  // Class declarations - get signature without method bodies
  if (Node.isClassDeclaration(decl)) {
    // For now, just get the full text - we can improve this later
    return decl.getText()
  }

  // Namespace/module declarations
  if (Node.isModuleDeclaration(decl)) {
    return decl.getText()
  }

  // Fallback - get full text
  return decl.getText()
}

/**
 * Extract export information from a declaration node.
 *
 * @param name - The export name
 * @param decl - The declaration node
 * @returns Export object with all metadata
 */
export const extractExport = (name: string, decl: ExportedDeclarations): Export => {
  // Get category (level and type)
  const { level, type } = categorize(decl)

  // Extract signature - type signature only, no implementation
  const signature = extractSignature(decl)

  // Parse JSDoc
  const jsdoc = parseJSDoc(decl)

  // Get source location
  const sourceLocation: SourceLocation = {
    file: decl.getSourceFile().getFilePath().replace(process.cwd() + '/', ''),
    line: decl.getStartLineNumber(),
  }

  // Base export properties
  const baseExport = {
    name,
    signature,
    description: jsdoc.description,
    examples: jsdoc.examples,
    deprecated: jsdoc.deprecated,
    tags: jsdoc.tags,
    sourceLocation,
  }

  // Handle namespace exports (extract nested module)
  if (level === 'value' && type === 'namespace' && Node.isModuleDeclaration(decl)) {
    const nestedModule = extractModule(name, decl)

    return {
      ...baseExport,
      _tag: 'value',
      type: 'namespace',
      module: nestedModule,
    } as any
  }

  // Value export (non-namespace)
  if (level === 'value') {
    return {
      ...baseExport,
      _tag: 'value',
      type,
    } as any
  }

  // Type export
  return {
    ...baseExport,
    _tag: 'type',
    type,
  } as any
}
