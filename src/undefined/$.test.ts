import { property } from '#test/test'
import { Undefined } from '#undefined'
import fc from 'fast-check'
import { expect, expectTypeOf, test } from 'vitest'

test('undefined detection', () => {
  expect(Undefined.is(undefined)).toBe(true)
  expect(Undefined.isnt(undefined)).toBe(false)
  // @ts-expect-error - type guard prevents non-undefined usage
  expect(Undefined.is(null)).toBe(false)
})

property('is/isnt are complementary', fc.anything(), (value) => {
  expect(Undefined.is(value)).toBe(!Undefined.isnt(value))
})

property('isnt filters undefined', fc.array(fc.option(fc.anything())), (arr) => {
  const withUndefined = arr.map(v => v === null ? undefined : v)
  expect(withUndefined.filter(Undefined.isnt).every(v => v !== undefined)).toBe(true)
})

test('type narrowing', () => {
  const value = 'hello' as string | undefined
  if (Undefined.is(value)) expectTypeOf(value).toEqualTypeOf<undefined>()
  else expectTypeOf(value).toEqualTypeOf<string>()
})
