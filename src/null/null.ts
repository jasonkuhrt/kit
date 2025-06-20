import { isntTypeWith } from '#eq/type'
import { isTypeWith } from '#eq/type'

/**
 * Checks if a value is null.
 *
 * @param value - The value to check.
 * @returns True if the value is null, false otherwise.
 *
 * @example
 * // checking null value
 * is(null) // true
 *
 * @example
 * // checking non-null values
 * is(undefined) // false
 * is(0) // false
 * is('') // false
 */
export const is = isTypeWith(null)

/**
 * Checks if a value is not null.
 *
 * @param value - The value to check.
 * @returns True if the value is not null, false otherwise.
 *
 * @example
 * // checking non-null values
 * isnt(undefined) // true
 * isnt(0) // true
 * isnt('') // true
 *
 * @example
 * // checking null value
 * isnt(null) // false
 */
export const isnt = isntTypeWith(null)
