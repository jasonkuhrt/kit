/**
 * Negative number brand and operations.
 * A negative number is less than zero.
 */

import type { Brand } from 'effect'

/**
 * Negative number (< 0).
 */
export type Negative = number & Brand.Brand<'Negative'>

/**
 * Type predicate to check if value is negative (< 0).
 */
export const is = (value: unknown): value is Negative => {
  return typeof value === 'number' && value < 0
}

/**
 * Construct a Negative number.
 * Throws if the value is not negative.
 */
export const from = (value: number): Negative => {
  if (value >= 0) {
    throw new Error(`Value must be negative (< 0), got: ${value}`)
  }
  return value as Negative
}

/**
 * Try to construct a Negative number.
 * Returns null if the value is not negative.
 */
export const tryFrom = (value: number): Negative | null => {
  return value < 0 ? (value as Negative) : null
}

/**
 * Negate a positive number to make it negative.
 */
export const negate = (value: number): Negative => {
  return from(-Math.abs(value))
}
