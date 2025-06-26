import { expect, test } from 'vitest'
import { Odd } from './$.ts'

test('is', () => {
  // TODO: Add comprehensive tests
  expect(Odd.is(0)).toBe(false)
})

test('from', () => {
  // TODO: Add comprehensive tests
  expect(() => Odd.from(0)).toThrow()
})

test('tryFrom', () => {
  // TODO: Add comprehensive tests
  expect(Odd.tryFrom(0)).toBe(null)
})
