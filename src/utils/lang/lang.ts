import type { Prom } from '#prom'
import * as fc from 'fast-check'

// typeof

/**
 * Enumeration of JavaScript typeof operator results.
 */
export const TypeofTypesEnum = {
  string: 'string',
  number: 'number',
  bigint: 'bigint',
  boolean: 'boolean',
  symbol: 'symbol',
  undefined: 'undefined',
  object: 'object',
  function: 'function',
}

/**
 * Union type of all possible typeof operator results.
 */
export type TypeofTypes = keyof typeof TypeofTypesEnum

// Type Guard

/**
 * A function that narrows the type of a value.
 */
export type TypeGuard<$Type> = (value: unknown) => value is $Type

/**
 * A function that checks if a value matches a type (without type narrowing).
 */
export type TypeGuardImplementation = (value: unknown) => boolean

/**
 * Input type for creating type guards - either a guard function or a primitive value to check against.
 */
export type TypeGuardImplementationInput = TypeGuardImplementation | Primitive

/**
 * Create a type guard from a guard function or primitive value.
 *
 * @param typeGuard - A guard function or primitive value to check against.
 * @returns A type guard function.
 *
 * @example
 * ```ts
 * const isString = typeGuard<string>('string')
 * const isCustom = typeGuard<MyType>(value => value instanceof MyType)
 * ```
 */
export const typeGuard = <type>(typeGuard: TypeGuardImplementationInput): TypeGuard<type> => {
  if (typeof typeGuard === TypeofTypesEnum.function) return typeGuard as any
  return (value): value is type => value === typeGuard
}

/**
 * A type guard that excludes a specific type.
 */
export type NegatedTypeGuard<$Type> = (value: unknown) => value is Exclude<typeof value, $Type>

/**
 * Create a negated type guard that excludes a specific type.
 *
 * @param typeGuard - The guard function to negate.
 * @returns A negated type guard function.
 *
 * @example
 * ```ts
 * const isNotString = negatedTypeGuard<string>(value => typeof value === 'string')
 * ```
 */
export const negatedTypeGuard = <type>(typeGuard: TypeGuardImplementation): NegatedTypeGuard<type> => {
  if (typeof typeGuard === TypeofTypesEnum.function) return typeGuard as any
  return (value): value is Exclude<typeof value, type> => value !== typeGuard
}

// Async

/**
 * Alias for Promise type.
 */
export type Async<$Value> = Promise<$Value>

/**
 * An async operation that performs side effects without returning a value.
 */
export type SideEffectAsync = Promise<void>

/**
 * A synchronous operation that performs side effects without returning a value.
 */
export type SideEffect = void

/**
 * An operation that may be synchronous or asynchronous, performing side effects without returning a value.
 */
export type SideEffectAsyncMaybe = Prom.Maybe<void>

// Workflow

// Value

/**
 * Any JavaScript value (primitive or object).
 */
export type Value = Primitive | object

/**
 * JavaScript primitive types.
 */
export type Primitive = string | number | bigint | boolean | symbol | null | undefined

/**
 * Check if a value is a JavaScript primitive.
 *
 * @param value - The value to check.
 * @returns True if the value is a primitive.
 *
 * @example
 * ```ts
 * isPrimitive('hello') // true
 * isPrimitive({}) // false
 * isPrimitive(null) // true
 * ```
 */
export const isPrimitive = (value: unknown): value is Primitive => {
  const type = typeof value
  // todo: use Obj.is
  return (type !== TypeofTypesEnum.object || value === null) && type !== TypeofTypesEnum.function
}

/**
 * Extract the narrowed type from a type guard function.
 *
 * @example
 * ```ts
 * type Guard = (x: unknown) => x is string
 * type Narrowed = ExtractPredicateType<Guard> // string
 * ```
 */
export type ExtractPredicateType<T> = T extends (x: any) => x is infer U ? U : never

// Testing utilities

/**
 * Fast-check arbitrary for generating Language.Value types.
 *
 * Generates all possible primitive types and object types that
 * make up the Language.Value union.
 *
 * @example
 * ```ts
 * import * as fc from 'fast-check'
 * import { Language } from '#language'
 *
 * fc.assert(fc.property(Language.ValueArb, (value) => {
 *   // value is Language.Value (Primitive | object)
 *   const isPrim = Language.isPrimitive(value)
 *   return typeof isPrim === 'boolean'
 * }))
 * ```
 */
export const ValueArb = fc.oneof(
  // Primitives
  fc.string(),
  fc.integer(),
  fc.bigInt(),
  fc.boolean(),
  fc.constant(null),
  fc.constant(undefined),
  // For symbols, just create simple ones
  fc.constant(Symbol('test')),
  // Reference types - keep them simple to avoid hanging tests
  fc.object({ maxDepth: 2 }), // Shallow objects
  fc.func(fc.constant(42)), // Simple functions that return constants
  fc.array(fc.oneof(fc.string(), fc.integer()), { maxLength: 10 }), // Small arrays of primitives
)

/**
 * Fast-check arbitrary for generating reference types only.
 * Useful for testing reference equality operations.
 */
export const ReferenceArb = fc.oneof(
  fc.object({ maxDepth: 2 }),
  fc.array(fc.oneof(fc.string(), fc.integer()), { maxLength: 10 }),
  fc.func(fc.constant(42)),
  fc.date(),
  // fc.set(fc.integer(), { maxLength: 5 }), // set is not available in fast-check
  fc.dictionary(fc.string(), fc.integer(), { maxKeys: 5 }),
)

/**
 * Fast-check arbitrary for generating primitive types only.
 */
export const PrimitiveArb = fc.oneof(
  fc.string(),
  fc.integer(),
  fc.bigInt(),
  fc.boolean(),
  fc.constant(null),
  fc.constant(undefined),
  fc.constant(Symbol('test')),
)
