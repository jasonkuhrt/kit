//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Type
//
//

export type Unknown = readonly unknown[]

export type Any = readonly any[]

export type Empty = readonly []

// Note: UnionToTuple is exported from Union namespace as Union.ToTuple

/**
 * Check if all booleans in a tuple are true.
 *
 * @example
 * ```ts
 * type T1 = All<[true, true, true]>  // true
 * type T2 = All<[true, false, true]>  // false
 * ```
 */
export type All<$Tuple extends [...boolean[]]> = $Tuple[number] extends true ? true : false

/**
 * Check if a tuple has multiple elements.
 *
 * @example
 * ```ts
 * type T1 = IsTupleMultiple<[1, 2]>  // true
 * type T2 = IsTupleMultiple<[1]>  // false
 * ```
 */
export type IsTupleMultiple<$T> = $T extends [unknown, unknown, ...unknown[]] ? true : false

/**
 * Push a value onto a tuple.
 *
 * @example
 * ```ts
 * type T = Push<[1, 2], 3>  // [1, 2, 3]
 * ```
 */
export type Push<$T extends any[], $V> = [...$T, $V]

/**
 * Get the first non-unknown, non-never element from a tuple.
 */
export type FirstNonUnknownNever<$T extends any[]> = $T extends [infer __first__, ...infer __rest__]
  ? unknown extends __first__ ? 0 extends 1 & __first__ ? FirstNonUnknownNever<__rest__> // is any
    : FirstNonUnknownNever<__rest__> // is unknown
  : __first__ extends never ? FirstNonUnknownNever<__rest__>
  : __first__
  : never

/**
 * Empty array constant.
 * @deprecated Use `Array.empty` from Effect instead
 *
 * @example
 * ```ts
 * import { Arr } from '@wollybeard/kit'
 *
 * const emptyArray = Arr.empty
 * console.log(emptyArray) // []
 * ```
 */
export const empty: Empty = []

/**
 * Empty array constant (frozen).
 * Useful as a default value or sentinel.
 *
 * @example
 * ```ts
 * const arr = items ?? Arr.emptyArray
 * ```
 */
export const emptyArray = Object.freeze([] as const)

/**
 * Type for the empty array constant.
 */
export type EmptyArray = typeof emptyArray

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Implementation
//
//

/**
 * Assert that a value is an array.
 * Throws a TypeError if the value is not an array.
 *
 * @param value - The value to check
 * @throws {TypeError} If the value is not an array
 *
 * @example
 * ```ts
 * function process(value: unknown) {
 *   Arr.assert(value)
 *   // value is now typed as unknown[]
 *   value.forEach(item => console.log(item))
 * }
 * ```
 */
export function assert(value: unknown): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new TypeError(`Expected array but got ${typeof value}`)
  }
}

/**
 * Type-safe array includes check that narrows the type of the value.
 * Unlike the standard `includes`, this provides proper type narrowing.
 *
 * @param array - The array to search in
 * @param value - The unknown value to search for
 * @returns True if the value is in the array, with type narrowing
 * @example
 * ```ts
 * const fruits = ['apple', 'banana', 'orange'] as const
 * const value: unknown = 'apple'
 *
 * if (Arr.includes(fruits, value)) {
 *   // value is now typed as 'apple' | 'banana' | 'orange'
 * }
 * ```
 */
export const includes = <$T>(array: $T[], value: unknown): value is $T => {
  return array.includes(value as any)
}

// Note: partitionErrors is exported from ArrMut module (creates new arrays)

/**
 * Ensure a value is an array.
 * If the value is already an array, return it as-is.
 * Otherwise, wrap it in an array.
 *
 * @param value - The value to ensure as array
 * @returns An array containing the value(s)
 * @example
 * ```ts
 * Arr.ensure('hello')  // ['hello']
 * Arr.ensure(['a', 'b'])  // ['a', 'b']
 * Arr.ensure(42)  // [42]
 * ```
 */
export const ensure = <$T>(value: $T | $T[]): $T[] => {
  return Array.isArray(value) ? value : [value]
}

// TODO: Add immutable array operations that wrap ArrMut with copy semantics
