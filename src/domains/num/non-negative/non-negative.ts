/**
 * Non-negative number brand and operations.
 * A non-negative number is greater than or equal to zero.
 */

import type { Brand } from 'effect'

/**
 * Non-negative number (>= 0).
 */
export type NonNegative = number & Brand.Brand<'NonNegative'>

/**
 * Type predicate to check if value is non-negative (>= 0).
 */
export const is = (value: unknown): value is NonNegative => {
  return typeof value === 'number' && value >= 0
}

/**
 * Construct a NonNegative number.
 * Throws if the value is negative.
 */
export const from = (value: number): NonNegative => {
  if (value < 0) {
    throw new Error(`Value must be non-negative (>= 0), got: ${value}`)
  }
  return value as NonNegative
}

/**
 * Try to construct a NonNegative number.
 * Returns null if the value is negative.
 */
export const tryFrom = (value: number): NonNegative | null => {
  return value >= 0 ? (value as NonNegative) : null
}
