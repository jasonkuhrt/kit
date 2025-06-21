import { expect, test } from 'vitest'
import { Negative } from './$.ts'

test('isNegative', () => {
  // TODO: Add comprehensive tests
  expect(Negative.is(0)).toBe(false)
})

test('negative', () => {
  // TODO: Add comprehensive tests
  expect(() => Negative.from(0)).toThrow()
})

test('tryNegative', () => {
  // TODO: Add comprehensive tests
  expect(Negative.tryFrom(0)).toBe(null)
})
