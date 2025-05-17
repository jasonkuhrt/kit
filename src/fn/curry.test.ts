import { expectTypeOf } from "vitest";
import { _, fn1p, fn2p, fn3p, fn0p, fn1pOptional, fn2pOptional } from "./_test.js";
import { curry } from "./curry.js";


// @ts-expect-error
curry(0)

// @ts-expect-error
curry(fn0p)

expectTypeOf(curry(fn1p)).toEqualTypeOf<(arg: number) => void>()
expectTypeOf(curry(fn2p)).toEqualTypeOf<(arg: number) => (arg2: string) => void>()
expectTypeOf(curry(fn3p)).toEqualTypeOf<(arg: number) => (arg2: string) => (arg3: boolean) => void>()
expectTypeOf(curry(fn1pOptional)).toEqualTypeOf<(arg?: number | undefined) => void>()
expectTypeOf(curry(fn2pOptional)).toEqualTypeOf<(arg1?: number | undefined) => (arg2?: string | undefined) => void>()
