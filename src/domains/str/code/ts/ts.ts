/**
 * TypeScript code generation utilities.
 *
 * Provides functions for generating TypeScript syntax elements like
 * types, interfaces, imports, exports, and object literals.
 *
 * @module
 */

import * as TSDoc from '../tsdoc/$.js'

// ============================================================================
// Literals
// ============================================================================

/**
 * Quote a string value for TypeScript code.
 *
 * @example
 * ```ts
 * string('hello')
 * // '"hello"'
 * ```
 */
export const string = (str: string): string => `"${str}"`

/**
 * Generate an array literal.
 *
 * @example
 * ```ts
 * list(['a', 'b', 'c'])
 * // '[a, b, c]'
 * ```
 */
export const list = (items: string[]): string => `[${items.join(`, `)}]`

/**
 * Wrap content in curly braces.
 *
 * @example
 * ```ts
 * block('a: string')
 * // '{\na: string\n}'
 * ```
 */
export const block = (content: string): string => `{\n${content}\n}`

/**
 * Generate an object literal from entries.
 *
 * @example
 * ```ts
 * object([['name', '"Alice"'], ['age', '30']])
 * // '{\nname: "Alice",\nage: 30\n}'
 * ```
 */
export const object = (entries: readonly (readonly [string, string])[]): string => {
  if (entries.length === 0) return `{}`
  const fields = entries.map(([key, value]) => `${key}: ${value}`).join(`,\n`)
  return block(fields)
}

/**
 * Generate a boolean literal.
 *
 * @example
 * ```ts
 * boolean(true)
 * // 'true'
 *
 * boolean(false)
 * // 'false'
 * ```
 */
export const boolean = (value: boolean): string => value ? `true` : `false`

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Generate a type alias.
 *
 * @param name - Type name
 * @param type - Type expression
 * @returns Type alias declaration
 *
 * @example
 * ```ts
 * typeAlias('UserId', 'string')
 * // 'type UserId = string'
 *
 * typeAlias('Point', '{ x: number; y: number }')
 * // 'type Point = { x: number; y: number }'
 * ```
 */
export const typeAlias = (name: string, type: string): string => {
  return `type ${name} = ${type}`
}

/**
 * Options for generating a type alias with metadata.
 */
export interface TypeAliasOptions {
  /**
   * Type name
   */
  name: string

  /**
   * Type expression
   */
  type: string

  /**
   * Optional JSDoc comment content (will be formatted automatically)
   */
  tsDoc?: string | null

  /**
   * Optional type parameters (e.g., `['T', 'U extends string']`)
   */
  parameters?: string[] | null

  /**
   * Whether to export the type (default: true)
   */
  export?: boolean
}

/**
 * Generate a type alias with optional JSDoc and type parameters.
 *
 * @example
 * ```ts
 * typeAliasWithOptions({
 *   name: 'Result',
 *   type: 'T | Error',
 *   parameters: ['T'],
 *   tsDoc: 'A result that may be successful or an error',
 *   export: true
 * })
 * // /**
 * //  * A result that may be successful or an error
 * //  *\/
 * // export type Result<T> = T | Error
 * ```
 */
export const typeAliasWithOptions = (options: TypeAliasOptions): string => {
  const {
    name,
    type,
    tsDoc = null,
    parameters = null,
    export: shouldExport = true,
  } = options

  const tsDocFormatted = tsDoc ? TSDoc.format(tsDoc) + `\n` : ``
  const exportKeyword = shouldExport ? `export ` : ``
  const typeParams = parameters && parameters.length > 0 ? `<${parameters.join(`, `)}>` : ``

  return `${tsDocFormatted}${exportKeyword}type ${name}${typeParams} = ${type}`
}

/**
 * Options for generating an interface.
 */
export interface InterfaceOptions {
  /**
   * Interface name
   */
  name: string

  /**
   * Interface body (fields)
   */
  block?: string

  /**
   * Optional JSDoc comment content (will be formatted automatically)
   */
  tsDoc?: string | null

  /**
   * Optional type parameters (e.g., `['T', 'U extends string']`)
   */
  parameters?: string[] | null

  /**
   * Optional extends clause (e.g., `['Base', 'Mixin']`)
   */
  extends?: string[] | null

  /**
   * Whether to export the interface (default: true)
   */
  export?: boolean
}

/**
 * Generate an interface declaration.
 *
 * @example
 * ```ts
 * interfaceDecl({
 *   name: 'User',
 *   block: 'id: string\nname: string',
 *   tsDoc: 'Represents a user',
 *   export: true
 * })
 * // /**
 * //  * Represents a user
 * //  *\/
 * // export interface User {
 * //   id: string
 * //   name: string
 * // }
 * ```
 */
export const interfaceDecl = (options: InterfaceOptions): string => {
  const {
    name,
    block: blockContent = '',
    tsDoc = null,
    parameters = null,
    extends: extendsClause = null,
    export: shouldExport = true,
  } = options

  const tsDocFormatted = tsDoc ? TSDoc.format(tsDoc) + `\n` : ``
  const exportKeyword = shouldExport ? `export ` : ``
  const typeParams = parameters && parameters.length > 0 ? `<${parameters.join(`, `)}>` : ``
  const extendsStr = extendsClause && extendsClause.length > 0 ? ` extends ${extendsClause.join(`, `)}` : ``
  const blockFormatted = blockContent ? block(blockContent) : `{}`

  return `${tsDocFormatted}${exportKeyword}interface ${name}${typeParams}${extendsStr} ${blockFormatted}`
}

/**
 * Generate a union type alias.
 *
 * @example
 * ```ts
 * union('Status', ['Active', 'Inactive', 'Pending'])
 * // 'type Status =\n| Active\n| Inactive\n| Pending'
 * ```
 */
export const union = (name: string, types: string[]): string =>
  `type ${name} =\n| ${types.filter(Boolean).join(`\n| `)}`

/**
 * Generate union items without the type wrapper.
 *
 * @example
 * ```ts
 * unionItems(['string', 'number', null])
 * // 'string\n| number'
 * ```
 */
export const unionItems = (types: (string | null)[]): string => types.filter(t => t !== null).join(`\n| `)

/**
 * Generate a tuple type.
 *
 * @example
 * ```ts
 * tuple(['string', 'number', 'boolean'])
 * // '[string, number, boolean]'
 * ```
 */
export const tuple = (types: string[]): string => `[${types.join(`, `)}]`

/**
 * Make a type nullable.
 *
 * @example
 * ```ts
 * nullable('string')
 * // 'string | null'
 * ```
 */
export const nullable = (type: string): string => `${type} | null`

/**
 * Create an intersection type.
 *
 * @example
 * ```ts
 * intersection('Base', 'Mixin')
 * // 'Base & Mixin'
 * ```
 */
export const intersection = (a: string, b: string): string => `${a} & ${b}`

// ============================================================================
// Exports
// ============================================================================

/**
 * Generate an export declaration.
 *
 * @example
 * ```ts
 * exportDecl('const foo = 1')
 * // 'export const foo = 1'
 * ```
 */
export const exportDecl = (declaration: string): string => {
  return `export ${declaration}`
}

/**
 * Re-export all exports from a module.
 *
 * @example
 * ```ts
 * reexportAll({ from: './path' })
 * // 'export * from './path''
 *
 * reexportAll({ from: './path', type: true })
 * // 'export type * from './path''
 * ```
 */
export const reexportAll = (input: {
  from: string
  type?: boolean
}): string => {
  const typePrefix = input.type ? 'type ' : ''
  return `export ${typePrefix}* from '${input.from}'`
}

/**
 * Re-export all exports as a namespace.
 *
 * @example
 * ```ts
 * reexportNamespace({ as: 'Name', from: './path' })
 * // 'export * as Name from './path''
 *
 * reexportNamespace({ as: 'Name', from: './path', type: true })
 * // 'export type * as Name from './path''
 * ```
 */
export const reexportNamespace = (input: {
  as: string
  from: string
  type?: boolean
}): string => {
  const typePrefix = input.type ? 'type ' : ''
  return `export ${typePrefix}* as ${input.as} from '${input.from}'`
}

/**
 * Re-export named exports from a module.
 * Supports simple names, arrays, and aliased names.
 *
 * @example
 * ```ts
 * // export { Name } from './path'
 * reexportNamed({ names: 'Name', from: './path' })
 *
 * // export { a, b, c } from './path'
 * reexportNamed({ names: ['a', 'b', 'c'], from: './path' })
 *
 * // export { oldName as newName } from './path'
 * reexportNamed({ names: { oldName: 'newName' }, from: './path' })
 *
 * // export type { Name } from './path'
 * reexportNamed({ names: 'Name', from: './path', type: true })
 * ```
 */
export const reexportNamed = (input: {
  names: string | string[] | Record<string, string>
  from: string
  type?: boolean
}): string => {
  const typePrefix = input.type ? 'type ' : ''

  let namesStr: string
  if (typeof input.names === 'string') {
    namesStr = input.names
  } else if (Array.isArray(input.names)) {
    namesStr = input.names.join(', ')
  } else {
    // Object format: { oldName: 'newName' }
    namesStr = Object.entries(input.names)
      .map(([oldName, newName]) => `${oldName} as ${newName}`)
      .join(', ')
  }

  return `export ${typePrefix}{ ${namesStr} } from '${input.from}'`
}

// ============================================================================
// Namespaces
// ============================================================================

/**
 * Generate a namespace declaration.
 *
 * @example
 * ```ts
 * namespace('Utils', 'export const foo = 1')
 * // 'namespace Utils {\nexport const foo = 1\n}'
 * ```
 */
export const namespace = (name: string, content: string): string => `namespace ${name} {\n${content}\n}`

// ============================================================================
// Expressions
// ============================================================================

/**
 * Generate a property access expression.
 *
 * @example
 * ```ts
 * propertyAccess('Math', 'PI')
 * // 'Math.PI'
 * ```
 */
export const propertyAccess = (object: string, property: string): string => `${object}.${property}`

// ============================================================================
// Variable Declarations
// ============================================================================

/**
 * Generate a const declaration.
 *
 * @example
 * ```ts
 * constDecl('foo', '1')
 * // 'const foo = 1'
 * ```
 */
export const constDecl = (name: string, value: string): string => `const ${name} = ${value}`

/**
 * Generate a typed const declaration.
 *
 * @example
 * ```ts
 * constDeclTyped('foo', 'number', '1')
 * // 'const foo: number = 1'
 * ```
 */
export const constDeclTyped = (name: string, type: string, value: string): string => `const ${name}: ${type} = ${value}`

// ============================================================================
// Object Members
// ============================================================================

/**
 * Options for generating a field/property in an interface or type.
 */
export interface FieldOptions {
  /**
   * Optional JSDoc comment content (will be formatted automatically)
   */
  tsDoc?: string | null

  /**
   * Whether the field is optional (adds `?`)
   */
  optional?: boolean

  /**
   * Whether the field is readonly (adds `readonly `)
   */
  readonly?: boolean
}

/**
 * Generate a field/property for an interface or object type.
 *
 * @param name - Field name
 * @param type - Field type
 * @param options - Optional modifiers and documentation
 * @returns Formatted field declaration
 *
 * @example
 * ```ts
 * field('id', 'string')
 * // 'id: string'
 *
 * field('name', 'string', { optional: true })
 * // 'name?: string'
 *
 * field('data', 'Data', { readonly: true })
 * // 'readonly data: Data'
 *
 * field('value', 'number', {
 *   readonly: true,
 *   optional: true,
 *   tsDoc: 'The current value'
 * })
 * // /**
 * //  * The current value
 * //  *\/
 * // readonly value?: number
 * ```
 */
export const field = (
  name: string,
  type: string,
  options?: FieldOptions,
): string => {
  const tsDocFormatted = options?.tsDoc ? TSDoc.format(options.tsDoc) + `\n` : ``
  const readonlyModifier = options?.readonly ? `readonly ` : ``
  const optionalModifier = options?.optional ? `?` : ``
  return `${tsDocFormatted}${readonlyModifier}${name}${optionalModifier}: ${type}`
}

/**
 * Wrap fields string in object braces.
 *
 * @example
 * ```ts
 * objectFromFields('a: string\nb: number')
 * // '{\na: string\nb: number\n}'
 * ```
 */
export const objectFromFields = (fields: string): string => `{\n${fields}\n}`

/**
 * Join field declarations with newlines.
 *
 * @example
 * ```ts
 * fields(['a: string', 'b: number'])
 * // 'a: string\nb: number'
 * ```
 */
export const fields = (fieldDecls: string[]): string => fieldDecls.join(`\n`)

// ============================================================================
// Imports
// ============================================================================

/**
 * Import all exports as a namespace.
 *
 * @example
 * ```ts
 * importAll({ as: 'Name', from: './path' })
 * // 'import * as Name from './path''
 *
 * importAll({ as: 'Name', from: './path', type: true })
 * // 'import type * as Name from './path''
 * ```
 */
export const importAll = (input: {
  as: string
  from: string
  type?: boolean
}): string => {
  const typePrefix = input.type ? 'type ' : ''
  return `import ${typePrefix}* as ${input.as} from '${input.from}'`
}

/**
 * Import named exports from a module.
 * Supports simple names, arrays, and aliased names.
 *
 * @example
 * ```ts
 * // import { Name } from './path'
 * importNamed({ names: 'Name', from: './path' })
 *
 * // import { a, b, c } from './path'
 * importNamed({ names: ['a', 'b', 'c'], from: './path' })
 *
 * // import { oldName as newName } from './path'
 * importNamed({ names: { oldName: 'newName' }, from: './path' })
 *
 * // import type { Name } from './path'
 * importNamed({ names: 'Name', from: './path', type: true })
 * ```
 */
export const importNamed = (input: {
  names: string | string[] | Record<string, string>
  from: string
  type?: boolean
}): string => {
  const typePrefix = input.type ? 'type ' : ''

  let namesStr: string
  if (typeof input.names === 'string') {
    namesStr = input.names
  } else if (Array.isArray(input.names)) {
    namesStr = input.names.join(', ')
  } else {
    // Object format: { oldName: 'newName' }
    namesStr = Object.entries(input.names)
      .map(([oldName, newName]) => `${oldName} as ${newName}`)
      .join(', ')
  }

  return `import ${typePrefix}{ ${namesStr} } from '${input.from}'`
}
