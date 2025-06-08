import { Fn } from '#fn/index.js'
import { property } from '#test/test.js'
import fc from 'fast-check'
import { expect, expectTypeOf, test } from 'vitest'

property('returns input unchanged for any value', fc.anything(), (value) => {
  expect(Fn.identity(value)).toBe(value)
})

property('preserves object references', fc.oneof(fc.object(), fc.array(fc.anything())), (value) => {
  expect(Fn.identity(value)).toBe(value)
})

test('type: preserves input types', () => {
  expectTypeOf(Fn.identity(5)).toEqualTypeOf<number>()
  expectTypeOf(Fn.identity('hello')).toEqualTypeOf<string>()
  expectTypeOf(Fn.identity(true)).toEqualTypeOf<boolean>()
  expectTypeOf(Fn.identity(null)).toEqualTypeOf<null>()
  expectTypeOf(Fn.identity(undefined)).toEqualTypeOf<undefined>()

  const obj = { a: 1 } as const
  expectTypeOf(Fn.identity(obj)).toEqualTypeOf<{ readonly a: 1 }>()
})
