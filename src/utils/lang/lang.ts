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
 *
 * @typeParam $Type - The type to narrow to.
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
 *
 * @typeParam $Type - The type to exclude.
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
 *
 * @typeParam $Value - The resolved value type.
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
 * @typeParam T - The type guard function type.
 *
 * @example
 * ```ts
 * type Guard = (x: unknown) => x is string
 * type Narrowed = ExtractPredicateType<Guard> // string
 * ```
 */
export type ExtractPredicateType<T> = T extends (x: any) => x is infer U ? U : never

// Type comparability

/**
 * Classify how the SECOND type parameter relates to the FIRST type parameter.
 *
 * @typeParam A - The reference type (first parameter)
 * @typeParam B - The type being compared to A (second parameter)
 *
 * Returns one of:
 * - 'covariant' - B is a subtype of A (B extends A, B is narrower than A)
 * - 'contravariant' - B is a supertype of A (A extends B, B is wider than A)
 * - 'invariant' - Neither extends the other but they share structure
 * - 'bivariant' - Both A extends B and B extends A (identical types)
 * - 'disjoint' - No relationship between A and B
 *
 * @example
 * ```ts
 * // Read as: "How does the second type relate to the first?"
 * type T1 = GetVariance<string, string> // 'bivariant'
 * type T2 = GetVariance<1, 1> // 'bivariant'
 * type T3 = GetVariance<string, number> // 'disjoint'
 * type T4 = GetVariance<{a: 1}, {b: 2}> // 'invariant' (objects can have both properties)
 * type T5 = GetVariance<{a: 1, id: 1}, {b: 2, id: 1}> // 'invariant'
 * type T6 = GetVariance<{a: 1}, {a: 1}> // 'bivariant'
 * type T7 = GetVariance<'a' | 'b', 'a'> // 'covariant' ('a' is narrower than 'a' | 'b')
 * type T8 = GetVariance<'a', 'a' | 'b'> // 'contravariant' ('a' | 'b' is wider than 'a')
 * ```
 */
// dprint-ignore
export type GetVariance<A, B> =
  // Check if types are identical (bivariant)
  [A] extends [B] ? [B] extends [A] ?
    'bivariant' // Both extend each other - identical types
  // A extends B but B doesn't extend A - contravariant
  : 'contravariant'
  // A doesn't extend B, check if B extends A
  : [B] extends [A] ? 'covariant'
  // Neither extends the other - check special cases
  : A extends Primitive ?
      B extends Primitive ?
        [A & B] extends [never] ? 'disjoint' : 'invariant'  // Both primitives
      : 'disjoint'  // Primitive vs non-primitive = always disjoint
    : B extends Primitive ? 'disjoint'  // Non-primitive vs primitive = always disjoint
    : [A & B] extends [never] ? 'disjoint' : 'invariant' // Both non-primitives

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
