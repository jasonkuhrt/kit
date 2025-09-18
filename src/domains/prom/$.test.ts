import { property } from '#test/test'
import fc from 'fast-check'
import { expect, test } from 'vitest'
import { Prom } from './$.js'

test('isShape detects promises and thenables', () => {
  expect(Prom.isShape(Promise.resolve(42))).toBe(true)
  // eslint-disable-next-line unicorn/no-thenable
  expect(Prom.isShape({ then: () => {}, catch: () => {}, finally: () => {} })).toBe(true)
  // eslint-disable-next-line unicorn/no-thenable
  expect(Prom.isShape({ then: () => {} })).toBe(false)
  // eslint-disable-next-line unicorn/no-thenable
  expect(Prom.isShape({ then: 'not a function', catch: () => {}, finally: () => {} })).toBe(false)
})

property(
  'isShape rejects non-promise values',
  fc.oneof(
    fc.integer(),
    fc.string(),
    fc.boolean(),
    fc.constant(null),
    fc.constant(undefined),
    fc.object(),
  ),
  (value) => {
    expect(Prom.isShape(value)).toBe(false)
  },
)
