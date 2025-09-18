import { expect, test } from 'vitest'
import { NonNegative } from './$.js'

test('isNonNegative', () => {
  // Valid cases - non-negative numbers (>= 0)
  expect(NonNegative.is(0)).toBe(true)
  expect(NonNegative.is(1)).toBe(true)
  expect(NonNegative.is(100)).toBe(true)
  expect(NonNegative.is(0.5)).toBe(true)
  expect(NonNegative.is(Number.MAX_VALUE)).toBe(true)
  expect(NonNegative.is(Infinity)).toBe(true)

  // Invalid cases - negative numbers
  expect(NonNegative.is(-1)).toBe(false)
  expect(NonNegative.is(-0.1)).toBe(false)
  expect(NonNegative.is(-100)).toBe(false)
  expect(NonNegative.is(-Infinity)).toBe(false)
  expect(NonNegative.is(NaN)).toBe(false)
  expect(NonNegative.is('0')).toBe(false)
  expect(NonNegative.is(null)).toBe(false)
})

test('tryNonNegative', () => {
  // Valid cases
  expect(NonNegative.tryFrom(0)).toBe(0)
  expect(NonNegative.tryFrom(1)).toBe(1)
  expect(NonNegative.tryFrom(100)).toBe(100)
  expect(NonNegative.tryFrom(0.5)).toBe(0.5)
  expect(NonNegative.tryFrom(Number.MAX_VALUE)).toBe(Number.MAX_VALUE)
  expect(NonNegative.tryFrom(Infinity)).toBe(Infinity)

  // Invalid cases - should return null
  expect(NonNegative.tryFrom(-1)).toBe(null)
  expect(NonNegative.tryFrom(-0.1)).toBe(null)
  expect(NonNegative.tryFrom(-100)).toBe(null)
  expect(NonNegative.tryFrom(-Infinity)).toBe(null)
  expect(NonNegative.tryFrom(NaN)).toBe(null)
})
