import { Fn } from '#fn/index.js'

export * from './type.js'

// Strict Equality Operator

/**
 * Check if two values are strictly equal using the === operator.
 *
 * @param value1 - The first value to compare.
 * @param value2 - The second value to compare.
 * @returns True if the values are strictly equal, false otherwise.
 *
 * @example
 * ```ts
 * Eq.is(5, 5) // true
 * Eq.is('hello', 'hello') // true
 * Eq.is(5, '5') // false
 * Eq.is(null, undefined) // false
 * Eq.is(NaN, NaN) // false
 * ```
 */
export const is = (value1: unknown, value2: unknown): boolean => {
  return value1 === value2
}

/**
 * Curried version of `is` that takes the first value and returns a function that checks equality with it.
 *
 * @param value1 - The value to compare against.
 * @returns A function that takes a second value and returns true if it equals the first value.
 *
 * @example
 * ```ts
 * const isThree = Eq.isWith(3)
 * isThree(3) // true
 * isThree(4) // false
 *
 * // useful for array filtering
 * [1, 2, 3, 3, 4].filter(Eq.isWith(3)) // [3, 3]
 * ```
 */
export const isWith = Fn.curry(is)

/**
 * Check if two values are not strictly equal using the !== operator.
 *
 * @param value1 - The first value to compare.
 * @param value2 - The second value to compare.
 * @returns True if the values are not strictly equal, false otherwise.
 *
 * @example
 * ```ts
 * Eq.isnt(5, 6) // true
 * Eq.isnt('hello', 'world') // true
 * Eq.isnt(5, '5') // true
 * Eq.isnt(null, undefined) // true
 * Eq.isnt(5, 5) // false
 * ```
 */
export const isnt = (value1: unknown, value2: unknown): boolean => {
  return value1 !== value2
}

/**
 * Curried version of `isnt` that takes the first value and returns a function that checks inequality with it.
 *
 * @param value1 - The value to compare against.
 * @returns A function that takes a second value and returns true if it does not equal the first value.
 *
 * @example
 * ```ts
 * const isNotThree = Eq.isntWith(3)
 * isNotThree(3) // false
 * isNotThree(4) // true
 *
 * // useful for array filtering
 * [1, 2, 3, 3, 4].filter(Eq.isntWith(3)) // [1, 2, 4]
 * ```
 */
export const isntWith = Fn.curry(isnt)
