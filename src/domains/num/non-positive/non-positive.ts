/**
 * Non-positive number brand and operations.
 * A non-positive number is less than or equal to zero.
 */

import type { Brand } from 'effect'

/**
 * Non-positive number (<= 0).
 */
export type NonPositive = number & Brand.Brand<'NonPositive'>

/**
 * Type predicate to check if value is non-positive (<= 0).
 */
export const is = (value: unknown): value is NonPositive => {
  return typeof value === 'number' && value <= 0
}

/**
 * Construct a NonPositive number.
 * Throws if the value is positive.
 */
export const from = (value: number): NonPositive => {
  if (value > 0) {
    throw new Error(`Value must be non-positive (<= 0), got: ${value}`)
  }
  return value as NonPositive
}

/**
 * Try to construct a NonPositive number.
 * Returns null if the value is positive.
 */
export const tryFrom = (value: number): NonPositive | null => {
  return value <= 0 ? (value as NonPositive) : null
}
