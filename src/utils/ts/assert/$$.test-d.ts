import { Ts } from '#ts'
import { test } from 'vitest'
import * as Assert from './$$.js'

//
//
// ━━━━━━━━━━━━━━ • fixtures
//
//

const a = 1 as const
const b = 2 as const
const ab = 0 as a | b
type a = typeof a
type b = typeof b
type ab = typeof ab

//
//
//
//
//
// Case
//
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//
//
//
//

type __ = [
  Ts.Assert.Case<never>,
  // @ts-expect-error
  Ts.Assert.Case<true>,
]

//
//
//
//
//
// Assertions
//
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//
//
// Rules:
// - Every relation group must cover all extractors
// - Every method must have test matrix:
//    1. TVA | TTA
//    2. fail | pass
// - Every test must be one line
//
//

// const { not, exact, sub, equiv } = Ts.Assert // OLD API - no longer used

//
//
// ━━━━━━━━━━━━━━ • exact
//
//

Assert.exact.of.as<a>()(a)
Assert.exact.of.as<a>().as<a>()
// @ts-expect-error
Assert.exact.of.as<a>()(b)
// @ts-expect-error
Assert.exact.of.as<a>().as<b>()
//
// ━━ awaited.is
//
Assert.awaited.exact.of.as<a>()(Promise.resolve(a))
Assert.awaited.exact.of.as<a>().as<Promise<a>>()
// @ts-expect-error
Assert.awaited.exact.of.as<a>()(Promise.resolve(b))
// @ts-expect-error
Assert.awaited.exact.of.as<a>().as<Promise<b>>()
//
// ━━ awaited.array
//
Assert.awaited.array.exact.of.as<a>()(Promise.resolve([a]))
Assert.awaited.array.exact.of.as<a>().as<Promise<a[]>>()
// @ts-expect-error
Assert.awaited.array.exact.of.as<a>()(Promise.resolve([b]))
// @ts-expect-error
Assert.awaited.array.exact.of.as<a>().as<Promise<b[]>>()
//
// ━━ returned.is
//
Assert.returned.exact.of.as<a>()(() => a)
Assert.returned.exact.of.as<a>().as<() => a>()
// @ts-expect-error
Assert.returned.exact.of.as<a>()(() => b)
// @ts-expect-error
Assert.returned.exact.of.as<a>().as<() => b>()
//
// ━━ returned.awaited
//
Assert.returned.awaited.exact.of.as<a>()(() => Promise.resolve(a))
Assert.returned.awaited.exact.of.as<a>().as<() => Promise<a>>()
// @ts-expect-error
Assert.returned.awaited.exact.of.as<a>()(() => Promise.resolve(b))
// @ts-expect-error
Assert.returned.awaited.exact.of.as<a>().as<() => Promise<b>>()
//
// ━━ returned.array
//
Assert.returned.array.exact.of.as<a>()(() => [a])
Assert.returned.array.exact.of.as<a>().as<() => a[]>()
// @ts-expect-error
Assert.returned.array.exact.of.as<a>()(() => [b])
// @ts-expect-error
Assert.returned.array.exact.of.as<a>().as<() => b[]>()
//
// ━━ array
//
Assert.array.exact.of.as<a>()([a])
Assert.array.exact.of.as<a>().as<a[]>()
// @ts-expect-error
Assert.array.exact.of.as<a>()([b])
// @ts-expect-error
Assert.array.exact.of.as<a>().as<b[]>()
//
// ━━ parameter1
//
Assert.parameter1.exact.of.as<a>()((_: a) => b)
Assert.parameter1.exact.of.as<a>().as<(_: a) => b>()
// @ts-expect-error
Assert.parameter1.exact.of<a>()((_: b) => a)
// @ts-expect-error
Assert.parameter1.exact.of<a, (_: b) => a>()
//
// ━━ parameters
//
Assert.parameters.exact.of.as<[a, b]>()((_: a, __: b) => a)
Assert.parameters.exact.of.as<[a, b]>().as<((_: a, __: b) => a)>()
// @ts-expect-error
Assert.parameters.exact<[a, b]>()((_: b, __: a) => a)
// @ts-expect-error
Assert.parameters.exact<[a, b], (_: b, __: a) => a>()
//
// ━━ noExcess
//

// Assert.noExcess.of.as<{ id: a }>()({ id: a })
// Assert.noExcess.of.as<{ id: a }>().as<{ id: a }>()
// // @ts-expect-error
// Assert.noExcess<{ id: a }>()({ id: a, name: b })
// // @ts-expect-error
// Assert.noExcess<{ id: a }, { id: a; name: b }>()

//
//
// ━━━━━━━━━━━━━━ • sub
//
//

Assert.sub.of.as<a>()(a)
Assert.sub.of.as<a>().as<a>()
// @ts-expect-error
Assert.sub.of.as<a>()(b)
// @ts-expect-error
Assert.sub.of.as<a>().as<b>()
//
// ━━ awaited.is
//
Assert.awaited.sub.of.as<a>()(Promise.resolve(a))
Assert.awaited.sub.of.as<a>().as<Promise<a>>()
// @ts-expect-error
Assert.awaited.sub.of.as<a>()(Promise.resolve(b))
// @ts-expect-error
Assert.awaited.sub.of.as<a>().as<Promise<b>>()
//
// ━━ awaited.array
//
Assert.awaited.array.sub.of.as<a>()(Promise.resolve([a]))
Assert.awaited.array.sub.of.as<a>().as<Promise<a[]>>()
// @ts-expect-error
Assert.awaited.array.sub.of.as<a>()(Promise.resolve([b]))
// @ts-expect-error
Assert.awaited.array.sub.of.as<a>().as<Promise<b[]>>()
//
// ━━ returned.is
//
Assert.returned.sub.of.as<a>()(() => a)
Assert.returned.sub.of.as<a>().as<() => a>()
// @ts-expect-error
Assert.returned.sub.of.as<a>()(() => b)
// @ts-expect-error
Assert.returned.sub.of.as<a>().as<() => b>()
//
// ━━ returned.awaited
//
Assert.returned.awaited.sub.of.as<a>()(() => Promise.resolve(a))
Assert.returned.awaited.sub.of.as<a>().as<() => Promise<a>>()
// @ts-expect-error
Assert.returned.awaited.sub.of.as<a>()(() => Promise.resolve(b))
// @ts-expect-error
Assert.returned.awaited.sub.of.as<a>().as<() => Promise<b>>()
//
// ━━ returned.array
//
Assert.returned.array.sub.of.as<a>()(() => [a])
Assert.returned.array.sub.of.as<a>().as<() => a[]>()
// @ts-expect-error
Assert.returned.array.sub.of.as<a>()(() => [b])
// @ts-expect-error
Assert.returned.array.sub.of.as<a>().as<() => b[]>()
//
// ━━ array
//
Assert.array.sub.of.as<a>()([a])
Assert.array.sub.of.as<a>().as<a[]>()
// @ts-expect-error
Assert.array.sub.of.as<a>()([b])
// @ts-expect-error
Assert.array.sub.of.as<a>().as<b[]>()
//
// ━━ parameter1
//
Assert.parameter1.sub.of.as<a>()((_: a) => b)
Assert.parameter1.sub.of.as<a>().as<(_: a) => b>()
// @ts-expect-error
Assert.sub.parameter1.of.as<a>()((_: b) => a)
// @ts-expect-error
Assert.sub.parameter1.of<a>().as<(_: b) => a>()
//
// ━━ parameters
//
Assert.parameters.sub.of.as<[a, b]>()((_: a, __: b) => a)
Assert.parameters.sub.of.as<[a, b]>().as<(_: a, __: b) => a>()
// @ts-expect-error
Assert.sub.parameters.of.as<[a, b]>()((_: b, __: a) => a)
// @ts-expect-error
Assert.sub.parameters.of<[a, b]>().as<(_: b, __: a) => a>()
//
// ━━ noExcess
//
Assert.sub.noExcess.of.as<{ id: a }>()({ id: a })
Assert.sub.noExcess.of.as<{ id: a }>().as<{ id: a }>()
// @ts-expect-error
Assert.sub.noExcess.of.as<{ id: a }>()({ id: a } as { id: a; name?: b })
// @ts-expect-error
Assert.sub.noExcess.of<{ id: a }>().as<{ id: a; name?: b }>()

//
//
// ━━━━━━━━━━━━━━ • equiv
//
//

Assert.equiv.of.as<ab>()(ab)
Assert.equiv.of.as<ab>().as<ab>()
// @ts-expect-error
Assert.equiv.of.as<a>()(b)
// @ts-expect-error
Assert.equiv.of.as<a>().as<b>()
//
// ━━ awaited.is
//
Assert.awaited.equiv.of.as<a>()(Promise.resolve(a))
Assert.awaited.equiv.of.as<a>().as<Promise<a>>()
// @ts-expect-error
Assert.awaited.equiv.of.as<a>()(Promise.resolve(b))
// @ts-expect-error
Assert.awaited.equiv.of.as<a>().as<Promise<b>>()
//
// ━━ awaited.array
//
Assert.awaited.array.equiv.of.as<a>()(Promise.resolve([a]))
Assert.awaited.array.equiv.of.as<a>().as<Promise<a[]>>()
// @ts-expect-error
Assert.awaited.array.equiv.of.as<a>()(Promise.resolve([b]))
// @ts-expect-error
Assert.awaited.array.equiv.of.as<a>().as<Promise<b[]>>()
//
// ━━ returned.is
//
Assert.returned.equiv.of.as<a>()(() => a)
Assert.returned.equiv.of.as<a>().as<() => a>()
// @ts-expect-error
Assert.returned.equiv.of.as<a>()(() => b)
// @ts-expect-error
Assert.returned.equiv.of.as<a>().as<() => b>()
//
// ━━ returned.awaited
//
Assert.returned.awaited.equiv.of.as<a>()(() => Promise.resolve(a))
Assert.returned.awaited.equiv.of.as<a>().as<() => Promise<a>>()
// @ts-expect-error
Assert.returned.awaited.equiv.of.as<a>()(() => Promise.resolve(b))
// @ts-expect-error
Assert.returned.awaited.equiv.of.as<a>().as<() => Promise<b>>()
//
// ━━ returned.array
//
Assert.returned.array.equiv.of.as<a>()(() => [a])
Assert.returned.array.equiv.of.as<a>().as<() => a[]>()
// @ts-expect-error
Assert.returned.array.equiv.of.as<a>()(() => [b])
// @ts-expect-error
Assert.returned.array.equiv.of.as<a>().as<() => b[]>()
//
// ━━ array
//
Assert.array.equiv.of.as<a>()([a])
Assert.array.equiv.of.as<a>().as<a[]>()
// @ts-expect-error
Assert.array.equiv.of.as<a>()([b])
// @ts-expect-error
Assert.array.equiv.of.as<a>().as<b[]>()
//
// ━━ parameter1
//
Assert.parameter1.equiv.of.as<a>()((_: a) => b)
Assert.parameter1.equiv.of.as<a>().as<(_: a) => b>()
// @ts-expect-error
Assert.equiv.parameter1.of.as<a>()((_: b) => a)
// @ts-expect-error
Assert.equiv.parameter1.of<a>().as<(_: b) => a>()
//
// ━━ parameters
//
Assert.parameters.equiv.of.as<[a, b]>()((_: a, __: b) => a)
Assert.parameters.equiv.of.as<[a, b]>().as<(_: a, __: b) => a>()
// @ts-expect-error
Assert.equiv.parameters.of.as<[a, b]>()((_: b, __: a) => a)
// @ts-expect-error
Assert.equiv.parameters.of<[a, b]>().as<(_: b, __: a) => a>()
//
// ━━ noExcess
//
Assert.equiv.noExcess.of.as<{ id: a }>()({ id: a })
Assert.equiv.noExcess.of.as<{ id: a }>().as<{ id: a }>()
// @ts-expect-error
Assert.equiv.noExcess.of.as<{ id: a }>()({ id: a } as { id: a; name?: b })
// @ts-expect-error
Assert.equiv.noExcess.of<{ id: a }>().as<{ id: a; name?: b }>()

//
//
//
//
//
// Not
//
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//
//
//
//

//
//
// ━━━━━━━━━━━━━━ • not.exact
//
//

// TODO: Not yet supported in new builder API
// not.exact.of.as<a>()(b)
// not.exact.of.as<a, b>()
// // @ts-expect-error
// not.exact.of.as<a>()(a)
// // @ts-expect-error
// not.exact.of.as<a, a>()

//
//
// ━━━━━━━━━━━━━━ • not.sub
//
//

// TODO: Not yet supported in new builder API
// not.sub.of.as<a>().const(b)
// // @ts-expect-error
// not.sub.of.as<a>().const(a)
// // @ts-expect-error
// not.sub.of.as<a, a>()

//
//
// ━━━━━━━━━━━━━━ • not.equiv
//
//

// TODO: Not yet supported in new builder API
// not.equiv.of<a>().const(b)
// not.equiv.of<a | b>().const(a)
// // @ts-expect-error
// not.equiv.of<a | b, a | b>()

//
//
//
//
//
// (never/any/unknown)
//
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//
//
//
//

const $n = 0 as never
const $a = 0 as any
const $u = 0 as unknown
type $n = typeof $n
type $a = typeof $a
type $u = typeof $u

//
//
// ━━━━━━━━━━━━━━ • exact - never
//
//
Assert.exact.never($n)
// @ts-expect-error
Assert.exact.never(1)
// @ts-expect-error
Assert.exact.of(a)($n)
// @ts-expect-error
Assert.exact.of(a).as<$n>()

//
//
// ━━━━━━━━━━━━━━ • exact - any
//
//
Assert.exact.any($a)
// @ts-expect-error
Assert.exact.any(1)
// @ts-expect-error
Assert.exact.of(a)($a)
// @ts-expect-error
Assert.exact.of(a).as<$a>()

//
//
// ━━━━━━━━━━━━━━ • exact - unknown
//
//
Assert.exact.unknown($u)
// @ts-expect-error
Assert.exact.unknown(1)
// @ts-expect-error
Assert.exact.of(a)($u)
// @ts-expect-error
Assert.exact.of(a).as<$u>()

//
//
// ━━━━━━━━━━━━━━ • exact - empty
//
//

// TODO: Not yet supported in new builder API
// exact.empty([])

//
//
//
//
//
// Type Level Assert
//
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//
//
//
//

//
// Base Relators
//

type _exact_relation = Assert.Cases<
  // Base .of matcher
  Assert.exact.of<string, string>,
  Assert.exact.of<number, number>,
  Assert.exact.of<42, 42>,
  Assert.exact.of<'hello', 'hello'>,
  // Pre-curried primitives
  Assert.exact.string<string>,
  Assert.exact.number<number>,
  Assert.exact.bigint<bigint>,
  Assert.exact.boolean<boolean>,
  Assert.exact.undefined<undefined>,
  Assert.exact.null<null>,
  Assert.exact.symbol<symbol>,
  Assert.exact.unknown<unknown>,
  Assert.exact.any<any>,
  Assert.exact.never<never>,
  // Pre-curried built-ins
  Assert.exact.Date<Date>,
  Assert.exact.RegExp<RegExp>,
  Assert.exact.Error<Error>,
  Assert.exact.Promise<Promise<any>>,
  Assert.exact.Array<any[]>
>

type _equiv_relation = Assert.Cases<
  // Base .of matcher
  Assert.equiv.of<string & {}, string>,
  Assert.equiv.of<1 | 2, 2 | 1>,
  // Pre-curried primitives
  Assert.equiv.string<string>,
  Assert.equiv.number<number>,
  Assert.equiv.bigint<bigint>,
  Assert.equiv.boolean<boolean>,
  Assert.equiv.undefined<undefined>,
  Assert.equiv.null<null>,
  Assert.equiv.unknown<unknown>,
  Assert.equiv.any<any>,
  Assert.equiv.never<never>
>

type _equiv_noExcess_relation = Assert.Cases<
  Assert.equiv.noExcess.of<{ id: string }, { id: string }>,
  Assert.equiv.noExcess.of<{ a: number } & {}, { a: number }>
>

type _sub_relation = Assert.Cases<
  // Base .of matcher
  Assert.sub.of<string, 'hello'>,
  Assert.sub.of<number, 42>,
  Assert.sub.of<object, { a: 1 }>,
  // Pre-curried primitives
  Assert.sub.string<'hello'>,
  Assert.sub.number<42>,
  Assert.sub.boolean<true>,
  Assert.sub.undefined<undefined>,
  Assert.sub.null<null>,
  Assert.sub.unknown<unknown>,
  Assert.sub.any<any>,
  Assert.sub.never<never>
>

type _sub_noExcess_relation = Assert.Cases<
  Assert.sub.noExcess.of<{ id: string }, { id: string }>,
  Assert.sub.noExcess.of<{ a: number }, { a: 42 }>
>

//
// Extractors
//

type _awaited_extractor = Assert.Cases<
  // Base .of matcher
  Assert.awaited.exact.of<number, Promise<number>>,
  Assert.awaited.exact.of<string, Promise<string>>,
  Assert.awaited.equiv.of<string & {}, Promise<string>>,
  Assert.awaited.sub.of<string, Promise<'hello'>>,
  // Pre-curried primitives
  Assert.awaited.exact.string<Promise<string>>,
  Assert.awaited.exact.number<Promise<number>>,
  Assert.awaited.exact.null<Promise<null>>,
  Assert.awaited.exact.unknown<Promise<unknown>>,
  Assert.awaited.exact.any<Promise<any>>,
  Assert.awaited.exact.never<Promise<never>>,
  Assert.awaited.sub.string<Promise<'hello'>>,
  Assert.awaited.sub.number<Promise<42>>
>

type _returned_extractor = Assert.Cases<
  // Base .of matcher
  Assert.returned.exact.of<number, () => number>,
  Assert.returned.exact.of<string, () => string>,
  Assert.returned.sub.of<string, () => 'hello'>,
  // Pre-curried primitives
  Assert.returned.exact.string<() => string>,
  Assert.returned.exact.number<() => number>,
  Assert.returned.exact.null<() => null>,
  Assert.returned.exact.unknown<() => unknown>,
  Assert.returned.exact.any<() => any>,
  Assert.returned.exact.never<() => never>,
  Assert.returned.sub.string<() => 'hello'>
>

type _array_extractor = Assert.Cases<
  // Base .of matcher
  Assert.array.exact.of<number, number[]>,
  Assert.array.exact.of<string, string[]>,
  Assert.array.sub.of<string, 'hello'[]>,
  // Pre-curried primitives
  Assert.array.exact.string<string[]>,
  Assert.array.exact.number<number[]>,
  Assert.array.exact.null<null[]>,
  Assert.array.exact.unknown<unknown[]>,
  Assert.array.exact.any<any[]>,
  Assert.array.exact.never<never[]>,
  Assert.array.sub.string<'hello'[]>
>

//
// Type-Level Error Cases
//

// @ts-expect-error - number not assignable to string
type _error_1 = Assert.Case<Assert.exact<string, number>>
// @ts-expect-error - 42 not exact match for string
type _error_2 = Assert.Case<Assert.exact.string<42>>
// @ts-expect-error - null not exact match for number
type _error_3 = Assert.Case<Assert.exact.null<42>>
// @ts-expect-error - Promise<string> not Promise<number>
type _error_4 = Assert.Case<Assert.awaited.exact.number<Promise<string>>>
// @ts-expect-error - () => string not () => number
type _error_5 = Assert.Case<Assert.returned.exact.number<() => string>>
// @ts-expect-error - string[] not number[]
type _error_6 = Assert.Case<Assert.array.exact.number<string[]>>
// @ts-expect-error - string not exact match for unknown
type _error_7 = Assert.Case<Assert.exact.unknown<string>>
// @ts-expect-error - unknown not exact match for any
type _error_8 = Assert.Case<Assert.exact.any<unknown>>
// @ts-expect-error - string not exact match for never
type _error_9 = Assert.Case<Assert.exact.never<string>>

// any/never actuals should be caught by guards (type-level)
// @ts-expect-error - any not assignable to literal 3
type _guard_any = Assert.Case<Assert.exact<3, any>>
// @ts-expect-error - never not assignable to literal 3
type _guard_never = Assert.Case<Assert.exact<3, never>>

// any/never actuals should be caught by guards (value-level)
test('guards value-level', () => {
  // @ts-expect-error - any not assignable to literal 3
  Assert.exact.of.as<3>()($a)
  // @ts-expect-error - any not assignable to string
  Assert.equiv.of.as<string>()($a)
  // @ts-expect-error - any not assignable to number
  Assert.sub.of.as<number>()($a)
  // @ts-expect-error - never not assignable to string
  Assert.exact.of.as<string>()($n)
})

//
// Coverage: All Relators with All Matchers
//

type _coverage_exact = Assert.Cases<
  // All primitives
  Assert.exact.string<string>,
  Assert.exact.number<number>,
  Assert.exact.bigint<bigint>,
  Assert.exact.boolean<boolean>,
  Assert.exact.undefined<undefined>,
  Assert.exact.null<null>,
  Assert.exact.symbol<symbol>,
  // All built-ins
  Assert.exact.Date<Date>,
  Assert.exact.RegExp<RegExp>,
  Assert.exact.Error<Error>,
  Assert.exact.Promise<Promise<any>>,
  Assert.exact.Array<any[]>
>

type _coverage_equiv = Assert.Cases<
  // All primitives
  Assert.equiv.string<string>,
  Assert.equiv.number<number>,
  Assert.equiv.bigint<bigint>,
  Assert.equiv.boolean<boolean>,
  Assert.equiv.undefined<undefined>,
  Assert.equiv.null<null>,
  Assert.equiv.symbol<symbol>,
  // All built-ins
  Assert.equiv.Date<Date>,
  Assert.equiv.RegExp<RegExp>,
  Assert.equiv.Error<Error>,
  Assert.equiv.Promise<Promise<any>>,
  Assert.equiv.Array<any[]>
>

type _coverage_sub = Assert.Cases<
  // All primitives
  Assert.sub.string<string>,
  Assert.sub.number<number>,
  Assert.sub.bigint<bigint>,
  Assert.sub.boolean<boolean>,
  Assert.sub.undefined<undefined>,
  Assert.sub.null<null>,
  Assert.sub.symbol<symbol>,
  // All built-ins
  Assert.sub.Date<Date>,
  Assert.sub.RegExp<RegExp>,
  Assert.sub.Error<Error>,
  Assert.sub.Promise<Promise<any>>,
  Assert.sub.Array<any[]>
>

//
// Coverage: All Extractors with All Relators
//

type _awaited_all_relators = Assert.Cases<
  Assert.awaited.exact.string<Promise<string>>,
  Assert.awaited.equiv.string<Promise<string>>,
  Assert.awaited.sub.string<Promise<'hello'>>
>

type _returned_all_relators = Assert.Cases<
  Assert.returned.exact.number<() => number>,
  Assert.returned.equiv.number<() => number>,
  Assert.returned.sub.number<() => 42>
>

type _array_all_relators = Assert.Cases<
  Assert.array.exact.boolean<boolean[]>,
  Assert.array.equiv.boolean<boolean[]>,
  Assert.array.sub.boolean<true[]>
>
