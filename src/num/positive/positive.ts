/**
 * Positive number brand and operations.
 * A positive number is greater than zero.
 */

import type { Brand } from 'effect'

/**
 * Positive number (> 0).
 *
 * Positive numbers are all numbers greater than zero. They represent
 * quantities, counts, and measurements in the real world.
 *
 * @example
 * // Valid positive numbers:
 * // 0.1, 1, 2.5, 100, 1000.5, Infinity
 *
 * // Invalid (not positive):
 * // 0 (zero is not positive)
 * // -1 (negative)
 * // -0.5 (negative)
 * // NaN (not a number)
 */
export type Positive = number & Brand.Brand<'Positive'>

/**
 * Type predicate to check if value is positive (> 0).
 *
 * @param value - The value to check
 * @returns True if value is a positive number
 *
 * @example
 * is(5) // true
 * is(0.1) // true
 * is(0) // false (zero is not positive)
 * is(-5) // false
 * is(NaN) // false
 * is('5') // false (not a number)
 */
export const is = (value: unknown): value is Positive => {
  return typeof value === 'number' && value > 0
}

/**
 * Construct a Positive number.
 * Throws if the value is not positive.
 *
 * @param value - The number to convert to Positive
 * @returns The value as a Positive number
 * @throws Error if value is not positive (> 0)
 *
 * @example
 * from(5) // 5 as Positive
 * from(0.1) // 0.1 as Positive
 *
 * // These throw errors:
 * from(0) // Error: Value must be positive (> 0)
 * from(-5) // Error: Value must be positive (> 0)
 */
export const from = (value: number): Positive => {
  if (value <= 0) {
    throw new Error(`Value must be positive (> 0), got: ${value}`)
  }
  return value as Positive
}

/**
 * Try to construct a Positive number.
 * Returns null if the value is not positive.
 *
 * @param value - The number to try converting
 * @returns The Positive number or null
 *
 * @example
 * tryFrom(5) // 5 as Positive
 * tryFrom(0.1) // 0.1 as Positive
 * tryFrom(0) // null
 * tryFrom(-5) // null
 */
export const tryFrom = (value: number): Positive | null => {
  return value > 0 ? (value as Positive) : null
}
