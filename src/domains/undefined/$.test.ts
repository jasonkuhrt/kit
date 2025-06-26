import { property } from '#test/test'
import { Undefined } from '#undefined'
import fc from 'fast-check'
import { expect, expectTypeOf, test } from 'vitest'

test('undefined detection', () => {
  expect(Undefined.Type.is(undefined)).toBe(true)
  expect(!Undefined.Type.is(undefined)).toBe(false)
  expect(Undefined.Type.is(null)).toBe(false)
})

property('is returns true only for undefined', fc.anything(), (value) => {
  expect(Undefined.Type.is(value)).toBe(value === undefined)
})

property('filters undefined', fc.array(fc.option(fc.anything())), (arr) => {
  const withUndefined = arr.map(v => v === null ? undefined : v)
  expect(withUndefined.filter(v => !Undefined.Type.is(v)).every(v => v !== undefined)).toBe(true)
})

test('type narrowing', () => {
  const value = 'hello' as string | undefined
  if (Undefined.Type.is(value)) expectTypeOf(value).toEqualTypeOf<undefined>()
  else expectTypeOf(value).toEqualTypeOf<string>()
})
