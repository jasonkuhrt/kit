/**
 * Percentage brand and operations.
 * A percentage is a number between 0 and 1 (inclusive).
 */

import type { InRange } from '../in-range/$$.js'

declare const PercentageBrand: unique symbol

/**
 * Percentage (0-1).
 * Represents a value between 0% (0.0) and 100% (1.0).
 */
export type Percentage = InRange<0, 1> & { [PercentageBrand]: true }

/**
 * Type predicate for percentage (0-1).
 */
export const is = (value: unknown): value is Percentage => {
  return typeof value === 'number' && value >= 0 && value <= 1
}

/**
 * Construct a Percentage.
 * Throws if the value is not between 0 and 1.
 */
export const from = (value: number): Percentage => {
  if (value < 0 || value > 1) {
    throw new Error(`Value must be between 0 and 1, got: ${value}`)
  }
  return value as Percentage
}

/**
 * Try to construct a Percentage.
 * Returns null if the value is not between 0 and 1.
 */
export const tryFrom = (value: number): Percentage | null => {
  return value >= 0 && value <= 1 ? (value as Percentage) : null
}

/**
 * Convert a percentage value (0-100) to a decimal (0-1).
 */
export const fromPercent = (value: number): Percentage => {
  return from(value / 100)
}

/**
 * Convert a decimal (0-1) to a percentage value (0-100).
 */
export const toPercent = (value: Percentage): number => {
  return value * 100
}

/**
 * Clamp a value to percentage range (0-1).
 */
export const clamp = (value: number): Percentage => {
  return Math.max(0, Math.min(1, value)) as Percentage
}
