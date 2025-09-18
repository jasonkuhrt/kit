import { expect, test } from 'vitest'
import { Even } from './$.js'

test('is', () => {
  // Valid cases - even integers
  expect(Even.is(0)).toBe(true)
  expect(Even.is(2)).toBe(true)
  expect(Even.is(4)).toBe(true)
  expect(Even.is(-2)).toBe(true)
  expect(Even.is(-4)).toBe(true)
  expect(Even.is(100)).toBe(true)

  // Invalid cases - odd integers
  expect(Even.is(1)).toBe(false)
  expect(Even.is(3)).toBe(false)
  expect(Even.is(-1)).toBe(false)
  expect(Even.is(-3)).toBe(false)

  // Invalid cases - non-integers
  expect(Even.is(2.5)).toBe(false)
  expect(Even.is(2.1)).toBe(false)
  expect(Even.is(Infinity)).toBe(false)
  expect(Even.is(NaN)).toBe(false)
  expect(Even.is('2')).toBe(false)
  expect(Even.is(null)).toBe(false)
})

test('from', () => {
  // Valid cases
  expect(Even.from(0)).toBe(0)
  expect(Even.from(2)).toBe(2)
  expect(Even.from(4)).toBe(4)
  expect(Even.from(-2)).toBe(-2)
  expect(Even.from(-4)).toBe(-4)
  expect(Even.from(100)).toBe(100)

  // Invalid cases - odd integers should throw
  expect(() => Even.from(1)).toThrow('Value must be even')
  expect(() => Even.from(3)).toThrow('Value must be even')
  expect(() => Even.from(-1)).toThrow('Value must be even')
  expect(() => Even.from(-3)).toThrow('Value must be even')

  // Invalid cases - non-integers should throw
  expect(() => Even.from(2.5)).toThrow('Value must be an integer')
  expect(() => Even.from(2.1)).toThrow('Value must be an integer')
  expect(() => Even.from(Infinity)).toThrow('Value must be an integer')
  expect(() => Even.from(NaN)).toThrow('Value must be an integer')
})

test('tryFrom', () => {
  // Valid cases
  expect(Even.tryFrom(0)).toBe(0)
  expect(Even.tryFrom(2)).toBe(2)
  expect(Even.tryFrom(4)).toBe(4)
  expect(Even.tryFrom(-2)).toBe(-2)
  expect(Even.tryFrom(-4)).toBe(-4)
  expect(Even.tryFrom(100)).toBe(100)

  // Invalid cases - should return null
  expect(Even.tryFrom(1)).toBe(null)
  expect(Even.tryFrom(3)).toBe(null)
  expect(Even.tryFrom(-1)).toBe(null)
  expect(Even.tryFrom(-3)).toBe(null)
  expect(Even.tryFrom(2.5)).toBe(null)
  expect(Even.tryFrom(2.1)).toBe(null)
  expect(Even.tryFrom(Infinity)).toBe(null)
  expect(Even.tryFrom(NaN)).toBe(null)
})
