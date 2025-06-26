import { expect, test } from 'vitest'
import { Percentage } from './$.ts'

test('isPercentage', () => {
  // Valid cases - values between 0 and 1 inclusive
  expect(Percentage.is(0)).toBe(true)
  expect(Percentage.is(0.5)).toBe(true)
  expect(Percentage.is(1)).toBe(true)
  expect(Percentage.is(0.25)).toBe(true)
  expect(Percentage.is(0.75)).toBe(true)
  expect(Percentage.is(0.001)).toBe(true)
  expect(Percentage.is(0.999)).toBe(true)

  // Invalid cases - values outside 0-1 range
  expect(Percentage.is(-0.1)).toBe(false)
  expect(Percentage.is(1.1)).toBe(false)
  expect(Percentage.is(2)).toBe(false)
  expect(Percentage.is(-1)).toBe(false)
  expect(Percentage.is(100)).toBe(false)
  expect(Percentage.is(Infinity)).toBe(false)
  expect(Percentage.is(NaN)).toBe(false)
  expect(Percentage.is('0.5')).toBe(false)
  expect(Percentage.is(null)).toBe(false)
})

test('percentage', () => {
  // Valid cases
  expect(Percentage.from(0)).toBe(0)
  expect(Percentage.from(0.5)).toBe(0.5)
  expect(Percentage.from(1)).toBe(1)
  expect(Percentage.from(0.25)).toBe(0.25)
  expect(Percentage.from(0.75)).toBe(0.75)
  expect(Percentage.from(0.001)).toBe(0.001)
  expect(Percentage.from(0.999)).toBe(0.999)

  // Invalid cases - should throw
  expect(() => Percentage.from(-0.1)).toThrow('Value must be between 0 and 1')
  expect(() => Percentage.from(1.1)).toThrow('Value must be between 0 and 1')
  expect(() => Percentage.from(2)).toThrow('Value must be between 0 and 1')
  expect(() => Percentage.from(-1)).toThrow('Value must be between 0 and 1')
  expect(() => Percentage.from(100)).toThrow('Value must be between 0 and 1')
})

test('tryPercentage', () => {
  // Valid cases
  expect(Percentage.tryFrom(0)).toBe(0)
  expect(Percentage.tryFrom(0.5)).toBe(0.5)
  expect(Percentage.tryFrom(1)).toBe(1)
  expect(Percentage.tryFrom(0.25)).toBe(0.25)
  expect(Percentage.tryFrom(0.75)).toBe(0.75)
  expect(Percentage.tryFrom(0.001)).toBe(0.001)
  expect(Percentage.tryFrom(0.999)).toBe(0.999)

  // Invalid cases - should return null
  expect(Percentage.tryFrom(-0.1)).toBe(null)
  expect(Percentage.tryFrom(1.1)).toBe(null)
  expect(Percentage.tryFrom(2)).toBe(null)
  expect(Percentage.tryFrom(-1)).toBe(null)
  expect(Percentage.tryFrom(100)).toBe(null)
})
