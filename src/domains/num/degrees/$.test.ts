import { expect, test } from 'vitest'
import { Degrees } from './$.js'

test('isDegrees', () => {
  // Valid cases - any finite number is a valid degree
  expect(Degrees.is(0)).toBe(true)
  expect(Degrees.is(90)).toBe(true)
  expect(Degrees.is(180)).toBe(true)
  expect(Degrees.is(360)).toBe(true)
  expect(Degrees.is(-90)).toBe(true)
  expect(Degrees.is(45.5)).toBe(true)

  // Invalid cases - non-finite numbers
  expect(Degrees.is(Infinity)).toBe(false)
  expect(Degrees.is(-Infinity)).toBe(false)
  expect(Degrees.is(NaN)).toBe(false)
  expect(Degrees.is('90')).toBe(false)
  expect(Degrees.is(null)).toBe(false)
  expect(Degrees.is(undefined)).toBe(false)
})

test('degrees', () => {
  // Valid cases
  expect(Degrees.from(0)).toBe(0)
  expect(Degrees.from(90)).toBe(90)
  expect(Degrees.from(180)).toBe(180)
  expect(Degrees.from(360)).toBe(360)
  expect(Degrees.from(-90)).toBe(-90)
  expect(Degrees.from(45.5)).toBe(45.5)

  // Invalid cases - should throw
  expect(() => Degrees.from(Infinity)).toThrow('Value must be finite')
  expect(() => Degrees.from(-Infinity)).toThrow('Value must be finite')
  expect(() => Degrees.from(NaN)).toThrow('Value must be finite')
})

test('tryDegrees', () => {
  // Valid cases
  expect(Degrees.tryFrom(0)).toBe(0)
  expect(Degrees.tryFrom(90)).toBe(90)
  expect(Degrees.tryFrom(180)).toBe(180)
  expect(Degrees.tryFrom(360)).toBe(360)
  expect(Degrees.tryFrom(-90)).toBe(-90)
  expect(Degrees.tryFrom(45.5)).toBe(45.5)

  // Invalid cases - should return null
  expect(Degrees.tryFrom(Infinity)).toBe(null)
  expect(Degrees.tryFrom(-Infinity)).toBe(null)
  expect(Degrees.tryFrom(NaN)).toBe(null)
})
