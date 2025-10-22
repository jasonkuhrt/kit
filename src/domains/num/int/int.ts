/**
 * Integer number brand and operations.
 * An integer is a whole number without decimal places.
 */

import type { Brand } from 'effect'

/**
 * Integer number.
 *
 * Integers are whole numbers without fractional parts. They can be
 * positive, negative, or zero. In JavaScript, integers are represented
 * as floating-point numbers but are guaranteed to have no decimal part.
 *
 * @example
 * // Valid integers:
 * // -100, -1, 0, 1, 2, 100, 1000
 *
 * // Invalid (not integers):
 * // 1.5 (has decimal part)
 * // 0.1 (has decimal part)
 * // Infinity (not finite)
 * // NaN (not a number)
 */
export type Int = number & Brand.Brand<'Int'>

/**
 * Type predicate to check if value is an integer.
 *
 * @param value - The value to check
 * @returns True if value is an integer
 *
 * @example
 * is(5) // true
 * is(0) // true
 * is(-10) // true
 * is(5.5) // false (has decimal)
 * is(0.1) // false (has decimal)
 * is(Infinity) // false
 * is('5') // false (not a number)
 */
export const is = (value: unknown): value is Int => {
  return typeof value === 'number' && Number.isInteger(value)
}

/**
 * Construct an Int.
 * Throws if the value is not an integer.
 *
 * @param value - The number to convert to Int
 * @returns The value as an Int
 * @throws Error if value is not an integer
 *
 * @example
 * from(5) // 5 as Int
 * from(0) // 0 as Int
 * from(-10) // -10 as Int
 *
 * // These throw errors:
 * from(5.5) // Error: Value must be an integer
 * from(0.1) // Error: Value must be an integer
 * from(Infinity) // Error: Value must be an integer
 */
export const from = (value: number): Int => {
  if (!Number.isInteger(value)) {
    throw new Error(`Value must be an integer, got: ${value}`)
  }
  return value as Int
}

/**
 * Try to construct an Int.
 * Returns null if the value is not an integer.
 *
 * @param value - The number to try converting
 * @returns The Int or null
 *
 * @example
 * tryFrom(5) // 5 as Int
 * tryFrom(0) // 0 as Int
 * tryFrom(5.5) // null
 * tryFrom(0.1) // null
 * tryFrom(Infinity) // null
 */
export const tryFrom = (value: number): Int | null => {
  return Number.isInteger(value) ? (value as Int) : null
}

/**
 * Parse a string to an Int.
 * Uses parseInt with base 10.
 *
 * @param value - The string to parse
 * @returns The parsed Int or null
 *
 * @example
 * parse('5') // 5 as Int
 * parse('-10') // -10 as Int
 * parse('0') // 0 as Int
 *
 * // Returns null for invalid strings:
 * parse('5.5') // null (parseInt stops at decimal)
 * parse('abc') // null
 * parse('') // null
 * parse('Infinity') // null
 */
export const parse = (value: string): Int | null => {
  const parsed = parseInt(value, 10)
  return Number.isInteger(parsed) ? (parsed as Int) : null
}

/**
 * Round a number to the nearest integer.
 * Uses standard rounding rules (0.5 rounds up).
 *
 * @param value - The number to round
 * @returns The rounded integer
 *
 * @example
 * round(5.4) // 5
 * round(5.5) // 6
 * round(5.6) // 6
 * round(-5.4) // -5
 * round(-5.5) // -5 (rounds towards positive infinity)
 * round(-5.6) // -6
 */
export const round = (value: number): Int => {
  return Math.round(value) as Int
}
