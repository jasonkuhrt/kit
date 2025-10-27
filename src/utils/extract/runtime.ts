/**
 * Runtime extractor implementations.
 *
 * Extractors combine runtime extraction functions with type-level Kind metadata,
 * enabling both runtime value transformation and type-level type transformation.
 *
 * @module
 *
 * @example
 * ```ts
 * import { Extract } from '@wollybeard/kit'
 *
 * // Use awaited extractor
 * const promise = Promise.resolve(42)
 * const value = Extract.awaited(promise) // Runtime: identity (assumes resolved)
 *
 * // Use in Ts.Assert
 * Ts.Assert.extract(Extract.awaited).exact.of(42).on(promise)
 * ```
 */

import type { Fn } from '#fn'
import type * as Path from '../ts/path.js'

/**
 * Awaited extractor - extracts the resolved type of a Promise.
 *
 * **Runtime behavior**: Identity function (assumes promise is already resolved).
 * **Type behavior**: Extracts `Awaited<T>` type.
 *
 * @category Extractors
 *
 * @example
 * ```ts
 * // Type-level extraction
 * type T = Promise<number>
 * type Extracted = Awaited<T> // number
 *
 * // Runtime usage (identity)
 * const promise = Promise.resolve(42)
 * awaited(promise) // Returns the same promise
 * ```
 */
export const awaited: Fn.Extractor<Promise<any>, any> = Object.assign(
  (value: Promise<any>) => value, // Identity - assumes caller handles awaiting
  { kind: {} as Path.Awaited$ },
)

/**
 * Returned extractor - extracts the return type of a function.
 *
 * **Runtime behavior**: Calls the function with no arguments.
 * **Type behavior**: Extracts `ReturnType<T>`.
 *
 * @category Extractors
 *
 * @example
 * ```ts
 * // Type-level extraction
 * type Fn = () => string
 * type Extracted = ReturnType<Fn> // string
 *
 * // Runtime usage
 * const fn = () => 'hello'
 * returned(fn) // 'hello'
 * ```
 */
export const returned: Fn.Extractor<(...args: any[]) => any, any> = Object.assign(
  (fn: (...args: any[]) => any) => fn(),
  { kind: {} as Path.Returned },
)

/**
 * Array extractor - extracts the element type from an array.
 *
 * **Runtime behavior**: Returns the first element.
 * **Type behavior**: Extracts element type from `T[]`.
 *
 * @category Extractors
 *
 * @example
 * ```ts
 * // Type-level extraction
 * type Arr = string[]
 * type Extracted = string
 *
 * // Runtime usage
 * array(['a', 'b', 'c']) // 'a'
 * ```
 */
export const array: Fn.Extractor<any[], any> = Object.assign(
  (arr: any[]) => arr[0],
  { kind: {} as Path.ArrayElement },
)

/**
 * Property extractor factory - creates an extractor for a specific property.
 *
 * **Runtime behavior**: Accesses the property by key.
 * **Type behavior**: Extracts `T[K]` type.
 *
 * @param key - Property key to extract
 * @returns Extractor that accesses the property
 *
 * @category Extractors
 *
 * @example
 * ```ts
 * // Create a property extractor
 * const getName = prop('name')
 *
 * // Runtime usage
 * getName({ name: 'Alice', age: 30 }) // 'Alice'
 *
 * // Type-level extraction
 * type User = { name: string; age: number }
 * type Name = User['name'] // string
 * ```
 */
export const prop = <$Key extends PropertyKey>(key: $Key): Fn.Extractor<any, any> =>
  Object.assign(
    (obj: any) => obj[key],
    { kind: {} as Path.Indexed },
  )

/**
 * Type-only extractor for first function parameter.
 *
 * **Runtime behavior**: Not callable - throws error if invoked.
 * **Type behavior**: Extracts `Parameters<T>[0]`.
 *
 * @category Type-Only Extractors
 */
export const parameter1 = {
  kind: {} as Path.Parameter1,
}

/**
 * Type-only extractor for second function parameter.
 *
 * **Runtime behavior**: Not callable - throws error if invoked.
 * **Type behavior**: Extracts `Parameters<T>[1]`.
 *
 * @category Type-Only Extractors
 */
export const parameter2 = {
  kind: {} as Path.Parameter2,
}

/**
 * Type-only extractor for third function parameter.
 *
 * **Runtime behavior**: Not callable - throws error if invoked.
 * **Type behavior**: Extracts `Parameters<T>[2]`.
 *
 * @category Type-Only Extractors
 */
export const parameter3 = {
  kind: {} as Path.Parameter3,
}

/**
 * Type-only extractor for fourth function parameter.
 *
 * **Runtime behavior**: Not callable - throws error if invoked.
 * **Type behavior**: Extracts `Parameters<T>[3]`.
 *
 * @category Type-Only Extractors
 */
export const parameter4 = {
  kind: {} as Path.Parameter4,
}

/**
 * Type-only extractor for fifth function parameter.
 *
 * **Runtime behavior**: Not callable - throws error if invoked.
 * **Type behavior**: Extracts `Parameters<T>[4]`.
 *
 * @category Type-Only Extractors
 */
export const parameter5 = {
  kind: {} as Path.Parameter5,
}
