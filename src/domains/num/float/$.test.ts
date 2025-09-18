import { expect, test } from 'vitest'
import { Float } from './$.js'

test('isFloat', () => {
  // TODO: Add comprehensive tests
  expect(Float.is(0)).toBe(false)
})

test('float', () => {
  // TODO: Add comprehensive tests
  expect(() => Float.from(0)).toThrow()
})

test('tryFloat', () => {
  // TODO: Add comprehensive tests
  expect(Float.tryFrom(0)).toBe(null)
})
