import { expect, test } from 'vitest'
import { Finite } from './$.ts'

test('isFinite', () => {
  // Valid cases - finite numbers
  expect(Finite.is(0)).toBe(true)
  expect(Finite.is(1)).toBe(true)
  expect(Finite.is(-1)).toBe(true)
  expect(Finite.is(1.5)).toBe(true)
  expect(Finite.is(-1.5)).toBe(true)
  expect(Finite.is(Number.MAX_SAFE_INTEGER)).toBe(true)
  expect(Finite.is(Number.MIN_SAFE_INTEGER)).toBe(true)

  // Invalid cases - non-finite numbers
  expect(Finite.is(Infinity)).toBe(false)
  expect(Finite.is(-Infinity)).toBe(false)
  expect(Finite.is(NaN)).toBe(false)
  expect(Finite.is('0')).toBe(false)
  expect(Finite.is(null)).toBe(false)
  expect(Finite.is(undefined)).toBe(false)
})

test('finite', () => {
  // Valid cases
  expect(Finite.from(0)).toBe(0)
  expect(Finite.from(1)).toBe(1)
  expect(Finite.from(-1)).toBe(-1)
  expect(Finite.from(1.5)).toBe(1.5)
  expect(Finite.from(-1.5)).toBe(-1.5)
  expect(Finite.from(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
  expect(Finite.from(Number.MIN_SAFE_INTEGER)).toBe(Number.MIN_SAFE_INTEGER)

  // Invalid cases - should throw
  expect(() => Finite.from(Infinity)).toThrow('Value must be finite')
  expect(() => Finite.from(-Infinity)).toThrow('Value must be finite')
  expect(() => Finite.from(NaN)).toThrow('Value must be finite')
})

test('tryFinite', () => {
  // Valid cases
  expect(Finite.tryFrom(0)).toBe(0)
  expect(Finite.tryFrom(1)).toBe(1)
  expect(Finite.tryFrom(-1)).toBe(-1)
  expect(Finite.tryFrom(1.5)).toBe(1.5)
  expect(Finite.tryFrom(-1.5)).toBe(-1.5)
  expect(Finite.tryFrom(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
  expect(Finite.tryFrom(Number.MIN_SAFE_INTEGER)).toBe(Number.MIN_SAFE_INTEGER)

  // Invalid cases - should return null
  expect(Finite.tryFrom(Infinity)).toBe(null)
  expect(Finite.tryFrom(-Infinity)).toBe(null)
  expect(Finite.tryFrom(NaN)).toBe(null)
})
