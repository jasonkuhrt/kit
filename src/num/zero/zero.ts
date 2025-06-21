/**
 * Zero brand and operations.
 * Represents the exact value zero.
 */

declare const ZeroBrand: unique symbol

/**
 * Zero.
 */
export type Zero = 0 & { [ZeroBrand]: true }

/**
 * Type predicate to check if value is zero.
 */
export const is = (value: unknown): value is Zero => {
  return value === 0
}

/**
 * Construct a Zero.
 * Throws if the value is not zero.
 */
export const from = (value: number): Zero => {
  if (value !== 0) {
    throw new Error(`Value must be zero, got: ${value}`)
  }
  return value as Zero
}

/**
 * Try to construct a Zero.
 * Returns null if the value is not zero.
 */
export const tryFrom = (value: number): Zero | null => {
  return value === 0 ? (value as Zero) : null
}

/**
 * The zero constant.
 */
export const ZERO: Zero = 0 as Zero
