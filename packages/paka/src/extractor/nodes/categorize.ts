import { Node } from 'ts-morph'
import type { ExportLevel, TypeExportType, ValueExportType } from '../../schema.js'

/**
 * Categorization result for a declaration node.
 */
export type Category = {
  level: ExportLevel
  type: ValueExportType | TypeExportType
}

/**
 * Categorize a TypeScript declaration node into export level and type.
 *
 * @param decl - The declaration node to categorize
 * @returns Category with level (value/type) and specific type
 */
export const categorize = (decl: Node): Category => {
  // Value exports - runtime constructs
  if (Node.isFunctionDeclaration(decl)) {
    return { level: 'value', type: 'function' }
  }

  if (Node.isVariableDeclaration(decl)) {
    const init = decl.getInitializer()
    if (init && (Node.isArrowFunction(init) || Node.isFunctionExpression(init))) {
      return { level: 'value', type: 'function' }
    }
    return { level: 'value', type: 'const' }
  }

  if (Node.isClassDeclaration(decl)) {
    return { level: 'value', type: 'class' }
  }

  if (Node.isModuleDeclaration(decl)) {
    return { level: 'value', type: 'namespace' }
  }

  // Type exports - TypeScript type system only
  if (Node.isInterfaceDeclaration(decl)) {
    return { level: 'type', type: 'interface' }
  }

  if (Node.isTypeAliasDeclaration(decl)) {
    const typeNode = decl.getTypeNode()
    if (typeNode) {
      if (Node.isUnionTypeNode(typeNode)) {
        return { level: 'type', type: 'union' }
      }
      if (Node.isIntersectionTypeNode(typeNode)) {
        return { level: 'type', type: 'intersection' }
      }
    }
    return { level: 'type', type: 'type-alias' }
  }

  if (Node.isEnumDeclaration(decl)) {
    return { level: 'type', type: 'enum' }
  }

  // Default fallback
  return { level: 'value', type: 'const' }
}
