/**
 * Ratio (rational number) brand and operations.
 * A ratio represents a number that can be expressed as a fraction p/q where q ≠ 0.
 */

import type { Int } from '../int/$$.ts'
import { gcd } from '../math.ts'
import type { NonZero } from '../non-zero/$$.ts'

declare const RatioBrand: unique symbol

/**
 * Ratio (rational number) - a number expressible as p/q where q ≠ 0.
 *
 * Ratios provide exact arithmetic without floating-point errors, making them ideal for:
 * - Financial calculations (no lost pennies)
 * - Music theory (frequency ratios like 3:2 for perfect fifth)
 * - Aspect ratios and proportions
 * - Probability calculations
 * - Any domain requiring exact fractional values
 *
 * @example
 * // Valid ratios:
 * // 1/2, -3/4, 5/1 (integers), 22/7 (approximates π)
 *
 * // Automatically simplified:
 * // 4/8 → 1/2, 10/5 → 2/1
 */
export type Ratio = {
  readonly numerator: Int
  readonly denominator: NonZero
} & { [RatioBrand]: true }

/**
 * Type predicate to check if value is a Ratio.
 *
 * @param value - The value to check
 * @returns True if value is a Ratio
 *
 * @example
 * is({ numerator: 1, denominator: 2 }) // true
 * is({ numerator: -3, denominator: 4 }) // true
 * is({ numerator: 1, denominator: 0 }) // false (zero denominator)
 * is(0.5) // false (not a Ratio object)
 */
export const is = (value: unknown): value is Ratio => {
  return (
    typeof value === 'object'
    && value !== null
    && 'numerator' in value
    && 'denominator' in value
    && typeof value.numerator === 'number'
    && Number.isInteger(value.numerator)
    && typeof value.denominator === 'number'
    && Number.isInteger(value.denominator)
    && value.denominator !== 0
  )
}

/**
 * Construct a Ratio from numerator and denominator.
 * Automatically simplifies to lowest terms and normalizes sign.
 *
 * @param numerator - The top number
 * @param denominator - The bottom number (non-zero)
 * @returns The simplified ratio
 *
 * @example
 * from(1, 2) // 1/2
 * from(4, 8) // 1/2 (simplified)
 * from(-3, 4) // -3/4
 * from(3, -4) // -3/4 (sign normalized to numerator)
 * from(5, 1) // 5/1 (integer as ratio)
 *
 * // Financial: $12.34 as cents
 * from(1234, 100) // 1234/100 (keeps exact value)
 */
export const from = (numerator: Int, denominator: NonZero): Ratio => {
  // Simplify and normalize sign
  const divisor = gcd(numerator, denominator as unknown as Int)
  let n = numerator / divisor
  let d = denominator / divisor

  // Ensure denominator is positive (move sign to numerator)
  if (d < 0) {
    n = -n
    d = -d
  }

  return {
    numerator: n as Int,
    denominator: d as NonZero,
  } as Ratio
}

/**
 * Convert a decimal number to a Ratio with specified precision.
 * Useful for converting floats to exact ratios.
 *
 * @param value - The decimal number
 * @param maxDenominator - Maximum denominator to use (default: 10000)
 * @returns The ratio approximation
 *
 * @example
 * fromDecimal(0.5) // 1/2
 * fromDecimal(0.333333) // 1/3 (recognizes repeating decimals)
 * fromDecimal(0.125) // 1/8
 * fromDecimal(3.14159, 100) // 22/7 (pi approximation with max denominator 100)
 *
 * // Converting percentages
 * fromDecimal(0.08) // 2/25 (8%)
 * fromDecimal(0.075) // 3/40 (7.5%)
 */
export const fromDecimal = (value: number, maxDenominator: number = 10000): Ratio => {
  if (!Number.isFinite(value)) {
    throw new Error('Value must be finite')
  }

  const sign = value < 0 ? -1 : 1
  value = Math.abs(value)

  // Handle integers
  if (Number.isInteger(value)) {
    return from((sign * value) as Int, 1 as NonZero)
  }

  // Simple approach for common decimals
  const str = value.toString()
  const decimalPlaces = (str.split('.')[1] || '').length
  const denominator = Math.pow(10, decimalPlaces)

  if (denominator <= maxDenominator) {
    const numerator = Math.round(value * denominator)
    return from((sign * numerator) as Int, denominator as NonZero)
  }

  // Continued fraction for complex cases
  let bestN = 0
  let bestD = 1
  let bestError = Math.abs(value)

  for (let d = 1; d <= maxDenominator; d++) {
    const n = Math.round(value * d)
    const error = Math.abs(n / d - value)

    if (error < bestError) {
      bestN = n
      bestD = d
      bestError = error

      // If we found an exact match, stop
      if (error < 1e-10) break
    }
  }

  return from((sign * bestN) as Int, bestD as NonZero)
}

/**
 * Simplify a ratio to lowest terms.
 * Note: from() already does this, but this is useful for ratios from other sources.
 *
 * @param ratio - The ratio to simplify
 * @returns The simplified ratio
 *
 * @example
 * simplify({ numerator: 4, denominator: 8 }) // 1/2
 * simplify({ numerator: 10, denominator: 5 }) // 2/1
 * simplify({ numerator: 7, denominator: 7 }) // 1/1
 */
export const simplify = (ratio: Ratio): Ratio => {
  return from(ratio.numerator, ratio.denominator)
}

/**
 * Convert ratio to decimal number.
 * Note: This may lose precision for ratios like 1/3.
 *
 * @param ratio - The ratio to convert
 * @returns The decimal representation
 *
 * @example
 * toDecimal(from(1, 2)) // 0.5
 * toDecimal(from(1, 3)) // 0.3333333333333333
 * toDecimal(from(22, 7)) // 3.142857142857143
 * toDecimal(from(-3, 4)) // -0.75
 */
export const toDecimal = (ratio: Ratio): number => {
  return ratio.numerator / ratio.denominator
}

/**
 * Add two ratios.
 * Result is automatically simplified.
 *
 * @param a - First ratio
 * @param b - Second ratio
 * @returns The sum as a simplified ratio
 *
 * @example
 * add(from(1, 2), from(1, 3)) // 5/6 (1/2 + 1/3)
 * add(from(1, 4), from(1, 4)) // 1/2 (1/4 + 1/4)
 * add(from(2, 3), from(3, 4)) // 17/12
 *
 * // Money: $12.50 + $3.75
 * const sum = add(from(1250, 100), from(375, 100)) // $16.25
 */
export const add = (a: Ratio, b: Ratio): Ratio => {
  const numerator = (a.numerator * b.denominator + b.numerator * a.denominator) as Int
  const denominator = (a.denominator * b.denominator) as NonZero
  return from(numerator, denominator)
}

/**
 * Subtract two ratios.
 * Result is automatically simplified.
 *
 * @param a - First ratio
 * @param b - Second ratio
 * @returns The difference as a simplified ratio
 *
 * @example
 * subtract(from(3, 4), from(1, 2)) // 1/4 (3/4 - 1/2)
 * subtract(from(1, 2), from(1, 3)) // 1/6 (1/2 - 1/3)
 * subtract(from(5, 6), from(1, 2)) // 1/3 (5/6 - 1/2)
 */
export const subtract = (a: Ratio, b: Ratio): Ratio => {
  const numerator = (a.numerator * b.denominator - b.numerator * a.denominator) as Int
  const denominator = (a.denominator * b.denominator) as NonZero
  return from(numerator, denominator)
}

/**
 * Multiply two ratios.
 * Result is automatically simplified.
 *
 * @param a - First ratio
 * @param b - Second ratio
 * @returns The product as a simplified ratio
 *
 * @example
 * multiply(from(2, 3), from(3, 4)) // 1/2 (2/3 × 3/4)
 * multiply(from(1, 2), from(1, 2)) // 1/4 (1/2 × 1/2)
 *
 * // Music: Combining intervals
 * const perfectFifth = from(3, 2)
 * const perfectFourth = from(4, 3)
 * multiply(perfectFifth, perfectFourth) // 2/1 (octave)
 */
export const multiply = (a: Ratio, b: Ratio): Ratio => {
  const numerator = (a.numerator * b.numerator) as Int
  const denominator = (a.denominator * b.denominator) as NonZero
  return from(numerator, denominator)
}

/**
 * Divide two ratios.
 * Result is automatically simplified.
 *
 * @param a - First ratio (dividend)
 * @param b - Second ratio (divisor, must be non-zero)
 * @returns The quotient as a simplified ratio
 * @throws Error if b is zero
 *
 * @example
 * divide(from(1, 2), from(1, 3)) // 3/2 (1/2 ÷ 1/3)
 * divide(from(3, 4), from(1, 2)) // 3/2 (3/4 ÷ 1/2)
 *
 * // Scaling: If recipe serves 4, how much for 6?
 * const scaleFactor = divide(from(6, 1), from(4, 1)) // 3/2
 */
export const divide = (a: Ratio, b: Ratio): Ratio => {
  if (b.numerator === 0) {
    throw new Error('Cannot divide by zero ratio')
  }
  const numerator = (a.numerator * b.denominator) as Int
  const denominator = (a.denominator * b.numerator) as NonZero
  return from(numerator, denominator)
}

/**
 * Compare two ratios.
 * Returns -1 if a < b, 0 if a = b, 1 if a > b.
 *
 * @param a - First ratio
 * @param b - Second ratio
 * @returns -1, 0, or 1
 *
 * @example
 * compare(from(1, 2), from(2, 3)) // -1 (1/2 < 2/3)
 * compare(from(3, 4), from(3, 4)) // 0 (equal)
 * compare(from(4, 5), from(3, 4)) // 1 (4/5 > 3/4)
 */
export const compare = (a: Ratio, b: Ratio): -1 | 0 | 1 => {
  // Cross multiply to avoid floating point
  const left = a.numerator * b.denominator
  const right = b.numerator * a.denominator

  if (left < right) return -1
  if (left > right) return 1
  return 0
}

/**
 * Get the reciprocal (inverse) of a ratio.
 *
 * @param ratio - The ratio to invert
 * @returns The reciprocal
 * @throws Error if ratio is zero
 *
 * @example
 * reciprocal(from(2, 3)) // 3/2
 * reciprocal(from(5, 1)) // 1/5
 * reciprocal(from(-4, 7)) // -7/4
 */
export const reciprocal = (ratio: Ratio): Ratio => {
  if (ratio.numerator === 0) {
    throw new Error('Cannot take reciprocal of zero')
  }
  return from(ratio.denominator as unknown as Int, ratio.numerator as unknown as NonZero)
}

/**
 * Convert ratio to mixed number representation.
 * Returns whole part and fractional part.
 *
 * @param ratio - The ratio to convert
 * @returns Object with whole and fractional parts
 *
 * @example
 * toMixedNumber(from(7, 3)) // { whole: 2, fraction: from(1, 3) } (2⅓)
 * toMixedNumber(from(9, 4)) // { whole: 2, fraction: from(1, 4) } (2¼)
 * toMixedNumber(from(3, 4)) // { whole: 0, fraction: from(3, 4) } (¾)
 * toMixedNumber(from(-7, 3)) // { whole: -2, fraction: from(-1, 3) }
 */
export const toMixedNumber = (ratio: Ratio): { whole: Int; fraction: Ratio } => {
  const whole = Math.trunc(ratio.numerator / ratio.denominator) as Int
  const remainderNum = (ratio.numerator - whole * ratio.denominator) as Int

  return {
    whole,
    fraction: from(remainderNum, ratio.denominator),
  }
}
