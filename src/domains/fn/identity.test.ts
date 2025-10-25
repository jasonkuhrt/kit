import { Fn } from '#fn'
import { Test } from '#test'
import { Ts } from '#ts'
import fc from 'fast-check'
import { expect, test } from 'vitest'

Test.property('returns input unchanged for any value', fc.anything(), (value) => {
  expect(Fn.identity(value)).toBe(value)
})

Test.property('preserves object references', fc.oneof(fc.object(), fc.array(fc.anything())), (value) => {
  expect(Fn.identity(value)).toBe(value)
})

test('type: preserves input types', () => {
  Ts.Assert.sub.ofAs<number>().on(Fn.identity(5))
  Ts.Assert.sub.ofAs<string>().on(Fn.identity('hello'))
  Ts.Assert.sub.ofAs<boolean>().on(Fn.identity(true))
  Ts.Assert.sub.ofAs<null>().on(Fn.identity(null))
  Ts.Assert.sub.ofAs<undefined>().on(Fn.identity(undefined))

  const obj = { a: 1 } as const
  Ts.Assert.sub.ofAs<{ readonly a: 1 }>().on(Fn.identity(obj))
})
