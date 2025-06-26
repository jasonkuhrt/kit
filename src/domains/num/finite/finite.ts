/**
 * Finite number brand and operations.
 * A finite number excludes NaN, Infinity, and -Infinity.
 */

declare const FiniteBrand: unique symbol

/**
 * Finite number (excludes NaN, Infinity, -Infinity).
 */
export type Finite = number & { [FiniteBrand]: true }

/**
 * Type predicate to check if value is a finite number.
 * Excludes NaN, Infinity, and -Infinity.
 */
export const is = (value: unknown): value is Finite => {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Construct a Finite number.
 * Throws if the value is not finite.
 */
export const from = (value: number): Finite => {
  if (!Number.isFinite(value)) {
    throw new Error(`Value must be finite, got: ${value}`)
  }
  return value as Finite
}

/**
 * Try to construct a Finite number.
 * Returns null if the value is not finite.
 */
export const tryFrom = (value: number): Finite | null => {
  return Number.isFinite(value) ? (value as Finite) : null
}
