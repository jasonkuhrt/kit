import { Null } from '#null'
import { property } from '#test/test'
import { Ts } from '#ts'
import fc from 'fast-check'
import { expect, test } from 'vitest'

const A = Ts.Assert.exact.ofAs

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
  if (Null.Type.is(value)) A<null>().on(value)
  else A<string>().on(value)
})
