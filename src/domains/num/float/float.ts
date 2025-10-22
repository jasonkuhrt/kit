/**
 * Float (non-integer) number brand and operations.
 * A float is a finite number that is not an integer.
 */

import type { Finite } from '../finite/$$.js'

import type { Brand } from 'effect'

/**
 * Float (non-integer finite number).
 */
export type Float = number & Brand.Brand<'Float'>

/**
 * Type predicate to check if value is a float (non-integer number).
 */
export const is = (value: unknown): value is Float => {
  return typeof value === 'number' && Number.isFinite(value) && !Number.isInteger(value)
}

/**
 * Construct a Float.
 * Throws if the value is not a float.
 */
export const from = (value: number): Float & Finite => {
  if (!Number.isFinite(value)) {
    throw new Error(`Value must be finite, got: ${value}`)
  }
  if (Number.isInteger(value)) {
    throw new Error(`Value must not be an integer, got: ${value}`)
  }
  return value as Float & Finite
}

/**
 * Try to construct a Float.
 * Returns null if the value is not a float.
 */
export const tryFrom = (value: number): (Float & Finite) | null => {
  return Number.isFinite(value) && !Number.isInteger(value) ? (value as Float & Finite) : null
}

/**
 * Convert an integer to a float by adding a small decimal.
 */
export const toFloat = (value: number): Float & Finite => {
  if (!Number.isFinite(value)) {
    throw new Error(`Value must be finite, got: ${value}`)
  }
  // Add a tiny amount to ensure it's not an integer
  return (value + 0.000001) as Float & Finite
}
