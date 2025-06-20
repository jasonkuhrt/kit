import { describe, expectTypeOf, test } from 'vitest'
import { _, fn1p, fn2p } from './_test.ts'
import { bind } from './base.ts'

describe('bind', () => {
  test('fn must have parameters', () => {
    bind(
      // @ts-expect-error
      fnNoParameters,
      _,
    )
  })
  test('binding parameters must match fn types', () => {
    bind(
      fn1p,
      // @ts-expect-error
      'invalid',
    )
  })
  test('bound fn invocation type checks', () => {
    expectTypeOf(bind(fn1p, 1)).toEqualTypeOf<() => void>()
    expectTypeOf(bind(fn2p, 1)).toEqualTypeOf<(arg2: string) => void>()
  })
})
