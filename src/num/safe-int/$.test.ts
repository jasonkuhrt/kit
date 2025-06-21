import { expect, test } from 'vitest'
import { SafeInt } from './$.ts'

test('isSafeInt', () => {
  // Valid cases - safe integers
  expect(SafeInt.is(0)).toBe(true)
  expect(SafeInt.is(1)).toBe(true)
  expect(SafeInt.is(-1)).toBe(true)
  expect(SafeInt.is(100)).toBe(true)
  expect(SafeInt.is(-100)).toBe(true)
  expect(SafeInt.is(Number.MAX_SAFE_INTEGER)).toBe(true)
  expect(SafeInt.is(Number.MIN_SAFE_INTEGER)).toBe(true)

  // Invalid cases - unsafe integers
  expect(SafeInt.is(Number.MAX_SAFE_INTEGER + 1)).toBe(false)
  expect(SafeInt.is(Number.MIN_SAFE_INTEGER - 1)).toBe(false)

  // Invalid cases - non-integers
  expect(SafeInt.is(1.5)).toBe(false)
  expect(SafeInt.is(-1.5)).toBe(false)
  expect(SafeInt.is(Infinity)).toBe(false)
  expect(SafeInt.is(-Infinity)).toBe(false)
  expect(SafeInt.is(NaN)).toBe(false)
  expect(SafeInt.is('1')).toBe(false)
  expect(SafeInt.is(null)).toBe(false)
})

test('trySafeInt', () => {
  // Valid cases
  expect(SafeInt.tryFrom(0)).toBe(0)
  expect(SafeInt.tryFrom(1)).toBe(1)
  expect(SafeInt.tryFrom(-1)).toBe(-1)
  expect(SafeInt.tryFrom(100)).toBe(100)
  expect(SafeInt.tryFrom(-100)).toBe(-100)
  expect(SafeInt.tryFrom(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
  expect(SafeInt.tryFrom(Number.MIN_SAFE_INTEGER)).toBe(Number.MIN_SAFE_INTEGER)

  // Invalid cases - should return null
  expect(SafeInt.tryFrom(Number.MAX_SAFE_INTEGER + 1)).toBe(null)
  expect(SafeInt.tryFrom(Number.MIN_SAFE_INTEGER - 1)).toBe(null)
  expect(SafeInt.tryFrom(1.5)).toBe(null)
  expect(SafeInt.tryFrom(-1.5)).toBe(null)
  expect(SafeInt.tryFrom(Infinity)).toBe(null)
  expect(SafeInt.tryFrom(-Infinity)).toBe(null)
  expect(SafeInt.tryFrom(NaN)).toBe(null)
})
