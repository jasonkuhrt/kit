import { Null } from '#null'
import { property } from '#test/test'
import fc from 'fast-check'
import { expect, expectTypeOf, test } from 'vitest'

test('null detection', () => {
  expect(Null.Type.is(null)).toBe(true)
  expect(!Null.Type.is(null)).toBe(false)
  expect(Null.Type.is(undefined)).toBe(false)
})

property('is returns true only for null', fc.anything(), (value) => {
  expect(Null.Type.is(value)).toBe(value === null)
})

property('filters nulls', fc.array(fc.option(fc.anything())), (arr) => {
  expect(arr.filter(v => !Null.Type.is(v)).every(v => v !== null)).toBe(true)
})

test('type narrowing', () => {
  const value = 'hello' as string | null
  if (Null.Type.is(value)) expectTypeOf(value).toEqualTypeOf<null>()
  else expectTypeOf(value).toEqualTypeOf<string>()
})
