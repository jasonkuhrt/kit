import { type ExportedDeclarations, Node } from 'ts-morph'

/**
 * Simplify TypeScript type text by removing verbose import paths and artifacts.
 *
 * Converts:
 *   import("/Users/.../kit/src/domains/num/non-zero/non-zero").NonZero
 * To:
 *   NonZero
 *
 * Also removes TypeScript's type separator artifacts (leading semicolons).
 */
export const simplifyTypeText = (typeText: string): string => {
  // Remove absolute import paths, keeping only the type name
  // Pattern: import("...").TypeName -> TypeName
  typeText = typeText.replace(/import\("[^"]+"\)\./g, '')

  // Also handle node_modules paths for external packages
  // Pattern: import("...node_modules/.../package").TypeName -> TypeName
  typeText = typeText.replace(/import\("[^"]*node_modules[^"]+"\)\./g, '')

  // Remove ALL leading semicolons - TypeScript adds these as type separators
  // This handles cases like:
  //   ;((type) => type)
  //   ;(<const T>(value: T) => T)
  //   ;(string)
  // We remove ALL leading semicolons and optional whitespace before the actual type
  typeText = typeText.replace(/^;\s*/, '')

  // Remove unnecessary outer parentheses from function types
  // Transform: ((frame: StackFrame) => string) -> (frame: StackFrame) => string
  // But keep: (<T>(value: T) => T) as is (has generics)
  typeText = typeText.replace(/^\((\([^<][^)]*\)\s*=>)/, '$1')

  return typeText
}

/**
 * Extract just the type signature from a declaration, without implementation details.
 */
export const extractSignature = (decl: ExportedDeclarations): string => {
  // Type aliases - remove export keyword
  if (Node.isTypeAliasDeclaration(decl)) {
    return decl.getText().replace(/^export\s+/, '')
  }

  // Interfaces - remove export keyword
  if (Node.isInterfaceDeclaration(decl)) {
    return decl.getText().replace(/^export\s+/, '')
  }

  // Enums - keep full text
  if (Node.isEnumDeclaration(decl)) {
    return decl.getText()
  }

  // Function declarations - get signature without body
  if (Node.isFunctionDeclaration(decl)) {
    const name = decl.getName() || 'anonymous'
    const typeParams = decl.getTypeParameters().map((tp) => tp.getText()).join(', ')
    const params = decl.getParameters().map((p) => p.getText()).join(', ')
    const returnType = simplifyTypeText(decl.getReturnType().getText())

    const typeParamsStr = typeParams ? `<${typeParams}>` : ''
    return `function ${name}${typeParamsStr}(${params}): ${returnType}`
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
