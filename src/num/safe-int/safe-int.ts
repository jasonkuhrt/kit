/**
 * Safe integer brand and operations.
 * A safe integer is within Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER.
 */

import type { Int } from '../int/$$.ts'

declare const SafeIntBrand: unique symbol

/**
 * Safe integer (within Number.MAX_SAFE_INTEGER).
 */
export type SafeInt = number & { [SafeIntBrand]: true }

/**
 * Type predicate to check if value is a safe integer.
 */
export const is = (value: unknown): value is SafeInt => {
  return typeof value === 'number' && Number.isSafeInteger(value)
}

/**
 * Construct a SafeInt.
 * Throws if the value is not a safe integer.
 */
export const from = (value: number): SafeInt & Int => {
  if (!Number.isSafeInteger(value)) {
    throw new Error(`Value must be a safe integer, got: ${value}`)
  }
  return value as SafeInt & Int
}

/**
 * Try to construct a SafeInt.
 * Returns null if the value is not a safe integer.
 */
export const tryFrom = (value: number): (SafeInt & Int) | null => {
  return Number.isSafeInteger(value) ? (value as SafeInt & Int) : null
}

/**
 * The maximum safe integer constant.
 */
export const MAX_SAFE_INT: SafeInt & Int = Number.MAX_SAFE_INTEGER as SafeInt & Int

/**
 * The minimum safe integer constant.
 */
export const MIN_SAFE_INT: SafeInt & Int = Number.MIN_SAFE_INTEGER as SafeInt & Int
