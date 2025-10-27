/**
 * Builder pattern infrastructure for TypeScript code generation.
 *
 * Provides:
 * - Builder interface for imperative construction
 * - Template function for declarative construction with auto-expansion
 * - Factory pattern for reusable generators
 * - Raw type for pre-formatted code
 *
 * @module
 */

import type { TermObject } from './term-object.js'
import * as TermObjectModule from './term-object.js'
import type { FieldOptions, FunctionDeclOptions, InterfaceOptions, TypeAliasOptions } from './ts.js'
import * as TS from './ts.js'

// ============================================================================
// Raw Type
// ============================================================================

/**
 * Type brand for pre-formatted TypeScript code that should be inserted as-is.
 *
 * Use this to mark strings that are already formatted TypeScript code
 * and should not be processed further.
 *
 * @example
 * ```ts
 * const userInterface: Raw = interface$({
 *   name: 'User',
 *   block: { id: 'string' },
 *   export: true
 * })
 * // userInterface can now be interpolated in template strings
 * ```
 */
export interface Raw {
  __raw: true
  code: string
}

/**
 * Create a Raw value from a string.
 *
 * @internal
 */
export const raw = (code: string): Raw => ({ __raw: true, code })

/**
 * Check if a value is Raw.
 *
 * @internal
 */
export const isRaw = (value: unknown): value is Raw =>
  typeof value === 'object' && value !== null && '__raw' in value

// ============================================================================
// Builder
// ============================================================================

/**
 * Fluent API for building TypeScript code imperatively.
 *
 * Supports:
 * - Interface declarations
 * - Type aliases
 * - Const declarations
 * - Function declarations
 * - Namespace declarations with nested builders
 * - Template string injection for custom code
 *
 * @example
 * ```ts
 * const code = builder()
 * code.interface({
 *   name: 'User',
 *   block: { id: 'string', name: 'string' },
 *   export: true
 * })
 * code.const('defaultUser', object({ id: '"0"', name: '"Guest"' }), { export: true })
 * code.build()
 * // export interface User {
 * //   id: string
 * //   name: string
 * // }
 * // export const defaultUser = {
 * //   id: "0"
 * //   name: "Guest"
 * // }
 * ```
 */
export interface Builder {
  /**
   * Add a custom line of code.
   * Can also be called as tagged template literal.
   *
   * @example
   * ```ts
   * code`// Custom comment`
   * code('const x = 1')
   * ```
   */
  (strings: TemplateStringsArray, ...values: unknown[]): void
  (code: string): void

  /**
   * Add an interface declaration.
   */
  interface(options: InterfaceOptions & { block?: string | TermObject | [string, string][] }): void

  /**
   * Add a type alias.
   */
  type(options: TypeAliasOptions & { type: string | TermObject }): void

  /**
   * Add a const declaration.
   */
  const(name: string, value: string | TermObject, options?: { export?: boolean }): void

  /**
   * Add a typed const declaration.
   */
  constTyped(name: string, type: string, value: string | TermObject, options?: { export?: boolean }): void

  /**
   * Add a function declaration.
   */
  function(options: FunctionDeclOptions): void

  /**
   * Add a namespace declaration with nested builder.
   */
  namespace(name: string, callback: (builder: Builder) => void): void

  /**
   * Build and return the final code string.
   */
  build(): string
}

/**
 * Create a new code builder.
 *
 * @example
 * ```ts
 * const code = builder()
 * code.interface({ name: 'User', block: { id: 'string' }, export: true })
 * code.build()
 * ```
 */
export const builder = (): Builder => {
  const lines: string[] = []

  const builderFn = ((stringsOrCode: TemplateStringsArray | string, ...values: unknown[]) => {
    if (typeof stringsOrCode === 'string') {
      lines.push(stringsOrCode)
    } else {
      // Tagged template literal
      const result = stringsOrCode.reduce((acc, str, i) => {
        return acc + str + (i < values.length ? String(expand(values[i]!)) : '')
      }, '')
      lines.push(result)
    }
  }) as Builder

  builderFn.interface = (options) => {
    const interfaceOptions: TS.InterfaceOptions = options.block
      ? {
          ...options,
          block: typeof options.block === 'string'
            ? options.block
            : Array.isArray(options.block)
            ? TermObjectModule.termObject(Object.fromEntries(options.block))
            : TermObjectModule.termObject(options.block),
        }
      : { ...options }
    lines.push(TS.interfaceDecl(interfaceOptions))
  }

  builderFn.type = (options) => {
    const type = typeof options.type === 'string' ? options.type : TermObjectModule.termObject(options.type)
    lines.push(TS.typeAliasWithOptions({ ...options, type }))
  }

  builderFn.const = (name, value, options) => {
    const value_ = expand(value)
    const decl = TS.constDecl(name, value_)
    lines.push(options?.export ? TS.exportDecl(decl) : decl)
  }

  builderFn.constTyped = (name, type, value, options) => {
    const value_ = expand(value)
    const decl = TS.constDeclTyped(name, type, value_)
    lines.push(options?.export ? TS.exportDecl(decl) : decl)
  }

  builderFn.function = (options) => {
    lines.push(TS.functionDecl(options))
  }

  builderFn.namespace = (name, callback) => {
    const nested = builder()
    callback(nested)
    lines.push(TS.namespace(name, nested.build()))
  }

  builderFn.build = () => lines.join('\n')

  return builderFn
}

// ============================================================================
// Template Function
// ============================================================================

/**
 * Create TypeScript code using template literals with auto-expansion.
 *
 * Interpolated values are automatically expanded:
 * - Raw values are inserted as-is
 * - TermObject values are converted to object literals
 * - Builders are built and inserted
 * - Strings are inserted as-is
 *
 * @example
 * ```ts
 * const userType = interface$({ name: 'User', block: { id: 'string' }, export: true })
 * const result = template`
 *   ${userType}
 *
 *   export const defaultUser: User = { id: "0" }
 * `
 * ```
 */
export const template = (strings: TemplateStringsArray, ...values: unknown[]): string => {
  return strings.reduce((acc, str, i) => {
    return acc + str + (i < values.length ? expand(values[i]!) : '')
  }, '')
}

// ============================================================================
// Factory Pattern
// ============================================================================

/**
 * Create a reusable code generator function.
 *
 * The factory receives a builder and your custom parameters,
 * and returns the generated code as a string.
 *
 * @example
 * ```ts
 * const generateInterface = factory<[name: string, fields: Record<string, string>]>(
 *   (b, name, fields) => {
 *     b.interface({ name, block: fields, export: true })
 *   }
 * )
 *
 * generateInterface('User', { id: 'string', name: 'string' })
 * // export interface User {
 * //   id: string
 * //   name: string
 * // }
 * ```
 */
export const factory = <$Args extends unknown[]>(
  fn: (builder: Builder, ...args: $Args) => void,
): (...args: $Args) => string => {
  return (...args: $Args) => {
    const b = builder()
    fn(b, ...args)
    return b.build()
  }
}

// ============================================================================
// Expansion Helper
// ============================================================================

/**
 * Expand a value to a string.
 *
 * @internal
 */
export const expand = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (isRaw(value)) return value.code
  if (typeof value === 'object' && value !== null && 'build' in value && typeof value.build === 'function') {
    return (value as Builder).build()
  }
  // Assume it's a TermObject
  return TermObjectModule.termObject(value as TermObject)
}
