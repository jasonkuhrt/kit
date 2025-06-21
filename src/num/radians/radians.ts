/**
 * Radians angle brand and operations.
 * Represents an angle measured in radians.
 */

import type { Finite } from '../finite/$$.ts'
import { is as isFinite } from '../finite/$$.ts'

declare const RadiansBrand: unique symbol

/**
 * Angle in radians.
 */
export type Radians = number & { [RadiansBrand]: true }

/**
 * Type predicate to check if value is a valid radian angle.
 * Note: Any finite number can represent an angle in radians.
 */
export const is = (value: unknown): value is Radians => {
  return isFinite(value)
}

/**
 * Construct a Radians angle.
 * Throws if the value is not finite.
 */
export const from = (value: number): Radians & Finite => {
  if (!Number.isFinite(value)) {
    throw new Error(`Value must be finite, got: ${value}`)
  }
  return value as Radians & Finite
}

/**
 * Try to construct a Radians angle.
 * Returns null if the value is not finite.
 */
export const tryFrom = (value: number): (Radians & Finite) | null => {
  return Number.isFinite(value) ? (value as Radians & Finite) : null
}

/**
 * Convert degrees to radians.
 */
export const fromDegrees = (degrees: number): Radians & Finite => {
  return from(degrees * (Math.PI / 180))
}

/**
 * Convert radians to degrees.
 */
export const toDegrees = (rad: Radians): number => {
  return rad * (180 / Math.PI)
}

/**
 * Normalize radians to the range [0, 2π).
 */
export const normalize = (rad: Radians): Radians & Finite => {
  const TWO_PI = 2 * Math.PI
  let normalized = rad % TWO_PI
  if (normalized < 0) normalized += TWO_PI
  return normalized as Radians & Finite
}
