import { Fn } from '#fn/index.js'
import { property } from '#test/test.js'
import * as fc from 'fast-check'
import { expect, expectTypeOf, test } from 'vitest'

property('returns a function that always returns the initial value', fc.anything(), (value) => {
  const constantFn = Fn.constant(value)
  // Call multiple times to ensure consistency
  expect(constantFn()).toBe(value)
  expect(constantFn()).toBe(value)
  expect(constantFn()).toBe(value)
})

property(
  'preserves reference equality for objects',
  fc.oneof(fc.object(), fc.array(fc.anything())),
  (value) => {
    const constantFn = Fn.constant(value)
    const result1 = constantFn()
    const result2 = constantFn()
    expect(result1).toBe(result2)
    expect(result1).toBe(value)
  },
)

property(
  'returned function is pure (no arguments affect output)',
  fc.anything(),
  fc.array(fc.anything(), { minLength: 1, maxLength: 5 }),
  (value, args) => {
    const constantFn = Fn.constant(value)
    // Even if we pass arguments, the result should be the same
    args.forEach(arg => {
      expect((constantFn as any)(arg)).toBe(value)
    })
  },
)

test('type: preserves value types in returned function', () => {
  const constantNumber = Fn.constant(42)
  expectTypeOf(constantNumber).toEqualTypeOf<() => number>()
  expectTypeOf(constantNumber()).toEqualTypeOf<number>()

  const constantString = Fn.constant('hello')
  expectTypeOf(constantString).toEqualTypeOf<() => string>()
  expectTypeOf(constantString()).toEqualTypeOf<string>()

  const obj = { a: 1 } as const
  const constantObj = Fn.constant(obj)
  expectTypeOf(constantObj).toEqualTypeOf<() => { readonly a: 1 }>()
  expectTypeOf(constantObj()).toEqualTypeOf<{ readonly a: 1 }>()
})
