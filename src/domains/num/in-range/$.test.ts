import { expect, test } from 'vitest'
import { InRange } from './$.js'

test('tryRanged', () => {
  // TODO: Add comprehensive tests
  expect(InRange.tryFrom(0, 1, 10)).toBe(null)
  expect(InRange.tryFrom(5, 1, 10)).toBe(5)
  expect(InRange.tryFrom(11, 1, 10)).toBe(null)
})
