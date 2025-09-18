import { expect, test } from 'vitest'
import { NonPositive } from './$.js'

test('isNonPositive', () => {
  // Valid cases - non-positive numbers (<= 0)
  expect(NonPositive.is(0)).toBe(true)
  expect(NonPositive.is(-1)).toBe(true)
  expect(NonPositive.is(-100)).toBe(true)
  expect(NonPositive.is(-0.5)).toBe(true)
  expect(NonPositive.is(-Number.MAX_VALUE)).toBe(true)
  expect(NonPositive.is(-Infinity)).toBe(true)

  // Invalid cases - positive numbers
  expect(NonPositive.is(1)).toBe(false)
  expect(NonPositive.is(0.1)).toBe(false)
  expect(NonPositive.is(100)).toBe(false)
  expect(NonPositive.is(Infinity)).toBe(false)
  expect(NonPositive.is(NaN)).toBe(false)
  expect(NonPositive.is('0')).toBe(false)
  expect(NonPositive.is(null)).toBe(false)
})

test('tryNonPositive', () => {
  // Valid cases
  expect(NonPositive.tryFrom(0)).toBe(0)
  expect(NonPositive.tryFrom(-1)).toBe(-1)
  expect(NonPositive.tryFrom(-100)).toBe(-100)
  expect(NonPositive.tryFrom(-0.5)).toBe(-0.5)
  expect(NonPositive.tryFrom(-Number.MAX_VALUE)).toBe(-Number.MAX_VALUE)
  expect(NonPositive.tryFrom(-Infinity)).toBe(-Infinity)

  // Invalid cases - should return null
  expect(NonPositive.tryFrom(1)).toBe(null)
  expect(NonPositive.tryFrom(0.1)).toBe(null)
  expect(NonPositive.tryFrom(100)).toBe(null)
  expect(NonPositive.tryFrom(Infinity)).toBe(null)
  expect(NonPositive.tryFrom(NaN)).toBe(null)
})
