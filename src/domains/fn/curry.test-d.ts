import { expectTypeOf, test } from 'vitest'
import { fn0p, fn1p, fn1pOptional, fn2p, fn2pOptional, fn3p } from './_test.js'
import { curry } from './curry.js'

test('cannot curry non-function', () => {
  // @ts-expect-error
  curry(0)
})

test('cannot curry 0 parameter function', () => {
  // @ts-expect-error
  curry(fn0p)
})

test('type checks', () => {
  expectTypeOf(curry(fn1p)).toEqualTypeOf<(arg: number) => void>()
  expectTypeOf(curry(fn2p)).toEqualTypeOf<(arg: number) => (arg2: string) => void>()
  expectTypeOf(curry(fn3p)).toEqualTypeOf<(arg: number) => (arg2: string) => (arg3: boolean) => void>()
  expectTypeOf(curry(fn1pOptional)).toEqualTypeOf<(arg?: number | undefined) => void>()
  expectTypeOf(curry(fn2pOptional)).toEqualTypeOf<(arg1?: number | undefined) => (arg2?: string | undefined) => void>()
})
