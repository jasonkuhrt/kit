import { expect, test } from 'vitest'
import { Int } from './$.ts'

test('isInt', () => {
  // Valid cases - integers
  expect(Int.is(0)).toBe(true)
  expect(Int.is(1)).toBe(true)
  expect(Int.is(-1)).toBe(true)
  expect(Int.is(100)).toBe(true)
  expect(Int.is(-100)).toBe(true)
  expect(Int.is(Number.MAX_SAFE_INTEGER)).toBe(true)
  expect(Int.is(Number.MIN_SAFE_INTEGER)).toBe(true)

  // Invalid cases - non-integers
  expect(Int.is(1.5)).toBe(false)
  expect(Int.is(-1.5)).toBe(false)
  expect(Int.is(0.1)).toBe(false)
  expect(Int.is(Infinity)).toBe(false)
  expect(Int.is(-Infinity)).toBe(false)
  expect(Int.is(NaN)).toBe(false)
  expect(Int.is('1')).toBe(false)
  expect(Int.is(null)).toBe(false)
  expect(Int.is(undefined)).toBe(false)
})

test('int', () => {
  // Valid cases
  expect(Int.from(0)).toBe(0)
  expect(Int.from(1)).toBe(1)
  expect(Int.from(-1)).toBe(-1)
  expect(Int.from(100)).toBe(100)
  expect(Int.from(-100)).toBe(-100)
  expect(Int.from(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
  expect(Int.from(Number.MIN_SAFE_INTEGER)).toBe(Number.MIN_SAFE_INTEGER)

  // Invalid cases - should throw
  expect(() => Int.from(1.5)).toThrow('Value must be an integer')
  expect(() => Int.from(-1.5)).toThrow('Value must be an integer')
  expect(() => Int.from(0.1)).toThrow('Value must be an integer')
  expect(() => Int.from(Infinity)).toThrow('Value must be an integer')
  expect(() => Int.from(-Infinity)).toThrow('Value must be an integer')
  expect(() => Int.from(NaN)).toThrow('Value must be an integer')
})

test('tryInt', () => {
  // Valid cases
  expect(Int.tryFrom(0)).toBe(0)
  expect(Int.tryFrom(1)).toBe(1)
  expect(Int.tryFrom(-1)).toBe(-1)
  expect(Int.tryFrom(100)).toBe(100)
  expect(Int.tryFrom(-100)).toBe(-100)
  expect(Int.tryFrom(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
  expect(Int.tryFrom(Number.MIN_SAFE_INTEGER)).toBe(Number.MIN_SAFE_INTEGER)

  // Invalid cases - should return null
  expect(Int.tryFrom(1.5)).toBe(null)
  expect(Int.tryFrom(-1.5)).toBe(null)
  expect(Int.tryFrom(0.1)).toBe(null)
  expect(Int.tryFrom(Infinity)).toBe(null)
  expect(Int.tryFrom(-Infinity)).toBe(null)
  expect(Int.tryFrom(NaN)).toBe(null)
})
