import { Fn } from '#fn'
import { Test } from '#test'
import { Ts } from '#ts'
import fc from 'fast-check'
import { expect, test } from 'vitest'

const A = Ts.Assert.exact.ofAs

Test.property('returns input unchanged for any value', fc.anything(), (value) => {
  expect(Fn.identity(value)).toBe(value)
})

Test.property('preserves object references', fc.oneof(fc.object(), fc.array(fc.anything())), (value) => {
  expect(Fn.identity(value)).toBe(value)
})

test('type: preserves input types', () => {
  A<5>().on(Fn.identity(5))
  A<'hello'>().on(Fn.identity('hello'))
  A<true>().on(Fn.identity(true))
  A<null>().on(Fn.identity(null))
  A<undefined>().on(Fn.identity(undefined))

  const obj = { a: 1 } as const
  A<{ readonly a: 1 }>().on(Fn.identity(obj))
})
