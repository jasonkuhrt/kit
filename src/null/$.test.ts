import { Null } from '#null'
import { property } from '#test/test'
import fc from 'fast-check'
import { expect, expectTypeOf, test } from 'vitest'

test('null detection', () => {
  expect(Null.is(null)).toBe(true)
  expect(Null.isnt(null)).toBe(false)
  // @ts-expect-error - type guard prevents non-null usage
  expect(Null.is(undefined)).toBe(false)
})

property('is/isnt are complementary', fc.anything(), (value) => {
  expect(Null.is(value)).toBe(!Null.isnt(value))
})

property('isnt filters nulls', fc.array(fc.option(fc.anything())), (arr) => {
  expect(arr.filter(Null.isnt).every(v => v !== null)).toBe(true)
})

test('type narrowing', () => {
  const value = 'hello' as string | null
  if (Null.is(value)) expectTypeOf(value).toEqualTypeOf<null>()
  else expectTypeOf(value).toEqualTypeOf<string>()
})
