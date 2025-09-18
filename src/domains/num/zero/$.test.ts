import { expect, test } from 'vitest'
import { Zero } from './$.js'

test('isZero', () => {
  // Valid cases - only 0 is zero
  expect(Zero.is(0)).toBe(true)
  expect(Zero.is(-0)).toBe(true) // -0 === 0 in JavaScript

  // Invalid cases - any non-zero value
  expect(Zero.is(1)).toBe(false)
  expect(Zero.is(-1)).toBe(false)
  expect(Zero.is(0.1)).toBe(false)
  expect(Zero.is(-0.1)).toBe(false)
  expect(Zero.is(Infinity)).toBe(false)
  expect(Zero.is(-Infinity)).toBe(false)
  expect(Zero.is(NaN)).toBe(false)
  expect(Zero.is('0')).toBe(false)
  expect(Zero.is(null)).toBe(false)
  expect(Zero.is(undefined)).toBe(false)
})

test('zero', () => {
  // Valid cases
  expect(Zero.from(0)).toBe(0)
  expect(Zero.from(-0)).toBe(-0)

  // Invalid cases - should throw
  expect(() => Zero.from(1)).toThrow('Value must be zero')
  expect(() => Zero.from(-1)).toThrow('Value must be zero')
  expect(() => Zero.from(0.1)).toThrow('Value must be zero')
  expect(() => Zero.from(-0.1)).toThrow('Value must be zero')
  expect(() => Zero.from(Infinity)).toThrow('Value must be zero')
  expect(() => Zero.from(NaN)).toThrow('Value must be zero')
})

test('tryZero', () => {
  // Valid cases
  expect(Zero.tryFrom(0)).toBe(0)
  expect(Zero.tryFrom(-0)).toBe(-0)

  // Invalid cases - should return null
  expect(Zero.tryFrom(1)).toBe(null)
  expect(Zero.tryFrom(-1)).toBe(null)
  expect(Zero.tryFrom(0.1)).toBe(null)
  expect(Zero.tryFrom(-0.1)).toBe(null)
  expect(Zero.tryFrom(Infinity)).toBe(null)
  expect(Zero.tryFrom(NaN)).toBe(null)
})
