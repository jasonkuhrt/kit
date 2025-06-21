import { expect, test } from 'vitest'
import { NonZero } from './$.ts'

test('isNonZero', () => {
  // TODO: Add comprehensive tests
  expect(NonZero.is(0)).toBe(false)
})

test('tryNonZero', () => {
  // TODO: Add comprehensive tests
  expect(NonZero.tryFrom(0)).toBe(null)
})
