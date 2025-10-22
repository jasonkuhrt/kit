/**
 * Degrees angle brand and operations.
 * Represents an angle measured in degrees.
 */

import type { Finite } from '../finite/$$.js'
import { is as isFinite } from '../finite/$$.js'

import type { Brand } from 'effect'

/**
 * Angle in degrees.
 */
export type Degrees = number & Brand.Brand<'Degrees'>

/**
 * Type predicate to check if value is a valid degree angle.
 * Note: Any finite number can represent an angle in degrees.
 */
export const is = (value: unknown): value is Degrees => {
  return isFinite(value)
}

/**
 * Construct a Degrees angle.
 * Throws if the value is not finite.
 */
export const from = (value: number): Degrees & Finite => {
  if (!Number.isFinite(value)) {
    throw new Error(`Value must be finite, got: ${value}`)
  }
  return value as Degrees & Finite
}

/**
 * Try to construct a Degrees angle.
 * Returns null if the value is not finite.
 */
export const tryFrom = (value: number): (Degrees & Finite) | null => {
  return Number.isFinite(value) ? (value as Degrees & Finite) : null
}

/**
 * Convert radians to degrees.
 */
export const fromRadians = (radians: number): Degrees & Finite => {
  return from(radians * (180 / Math.PI))
}

/**
 * Convert degrees to radians.
 */
export const toRadians = (deg: Degrees): number => {
  return deg * (Math.PI / 180)
}

/**
 * Normalize degrees to the range [0, 360).
 */
export const normalize = (deg: Degrees): Degrees & Finite => {
  let normalized = deg % 360
  if (normalized < 0) normalized += 360
  return normalized as Degrees & Finite
}
