/**
 * Range-constrained number brand and operations.
 * Represents a number within a specific min/max range.
 */

declare const InRangeBrand: unique symbol

/**
 * Range-constrained number.
 */
export type InRange<Min extends number, Max extends number> = number & {
  [InRangeBrand]: { min: Min; max: Max }
}

/**
 * Type predicate to check if value is within a specific range.
 */
export const is = <Min extends number, Max extends number>(
  value: unknown,
  min: Min,
  max: Max,
): value is InRange<Min, Max> => {
  return typeof value === 'number' && value >= min && value <= max
}

/**
 * Construct an InRange number.
 * Throws if the value is outside the range.
 */
export const from = <Min extends number, Max extends number>(
  value: number,
  min: Min,
  max: Max,
): InRange<Min, Max> => {
  if (value < min || value > max) {
    throw new Error(`Value must be between ${min} and ${max}, got: ${value}`)
  }
  return value as InRange<Min, Max>
}

/**
 * Try to construct an InRange number.
 * Returns null if the value is outside the range.
 */
export const tryFrom = <Min extends number, Max extends number>(
  value: number,
  min: Min,
  max: Max,
): InRange<Min, Max> | null => {
  return value >= min && value <= max ? (value as InRange<Min, Max>) : null
}

/**
 * Type-level clamp transformation.
 * Ensures the result type is within the specified range.
 */
export type Clamp<T extends number, Min extends number, Max extends number> = InRange<Min, Max>

/**
 * Clamp a number to a range.
 * Forces the value to be within the specified minimum and maximum bounds.
 */
export const clamp = <T extends number, Min extends number, Max extends number>(
  value: T,
  min: Min,
  max: Max,
): Clamp<T, Min, Max> => {
  if (min > max) {
    throw new Error(`Min (${min}) must be <= max (${max})`)
  }
  return Math.max(min, Math.min(max, value)) as Clamp<T, Min, Max>
}

export const clampOn = <T extends number>(value: T) =>
<Min extends number, Max extends number>(
  min: Min,
  max: Max,
): Clamp<T, Min, Max> => {
  return clamp(value, min, max)
}

export const clampWith = <Min extends number, Max extends number>(
  min: Min,
  max: Max,
) =>
<T extends number>(value: T): Clamp<T, Min, Max> => {
  return clamp(value, min, max)
}

export const isOn = (value: unknown) =>
<Min extends number, Max extends number>(
  min: Min,
  max: Max,
): boolean => {
  return is(value, min, max)
}

export const isWith = <Min extends number, Max extends number>(
  min: Min,
  max: Max,
) =>
(value: unknown): value is InRange<Min, Max> => {
  return is(value, min, max)
}
