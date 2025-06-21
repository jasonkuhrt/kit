import { expect, test } from 'vitest'
import { Radians } from './$.ts'

test('isRadians', () => {
  // Valid cases - any finite number is a valid radian
  expect(Radians.is(0)).toBe(true)
  expect(Radians.is(Math.PI)).toBe(true)
  expect(Radians.is(Math.PI / 2)).toBe(true)
  expect(Radians.is(2 * Math.PI)).toBe(true)
  expect(Radians.is(-Math.PI)).toBe(true)
  expect(Radians.is(1.5708)).toBe(true)

  // Invalid cases - non-finite numbers
  expect(Radians.is(Infinity)).toBe(false)
  expect(Radians.is(-Infinity)).toBe(false)
  expect(Radians.is(NaN)).toBe(false)
  expect(Radians.is('3.14')).toBe(false)
  expect(Radians.is(null)).toBe(false)
  expect(Radians.is(undefined)).toBe(false)
})

test('radians', () => {
  // Valid cases
  expect(Radians.from(0)).toBe(0)
  expect(Radians.from(Math.PI)).toBe(Math.PI)
  expect(Radians.from(Math.PI / 2)).toBe(Math.PI / 2)
  expect(Radians.from(2 * Math.PI)).toBe(2 * Math.PI)
  expect(Radians.from(-Math.PI)).toBe(-Math.PI)
  expect(Radians.from(1.5708)).toBe(1.5708)

  // Invalid cases - should throw
  expect(() => Radians.from(Infinity)).toThrow('Value must be finite')
  expect(() => Radians.from(-Infinity)).toThrow('Value must be finite')
  expect(() => Radians.from(NaN)).toThrow('Value must be finite')
})

test('tryRadians', () => {
  // Valid cases
  expect(Radians.tryFrom(0)).toBe(0)
  expect(Radians.tryFrom(Math.PI)).toBe(Math.PI)
  expect(Radians.tryFrom(Math.PI / 2)).toBe(Math.PI / 2)
  expect(Radians.tryFrom(2 * Math.PI)).toBe(2 * Math.PI)
  expect(Radians.tryFrom(-Math.PI)).toBe(-Math.PI)
  expect(Radians.tryFrom(1.5708)).toBe(1.5708)

  // Invalid cases - should return null
  expect(Radians.tryFrom(Infinity)).toBe(null)
  expect(Radians.tryFrom(-Infinity)).toBe(null)
  expect(Radians.tryFrom(NaN)).toBe(null)
})
