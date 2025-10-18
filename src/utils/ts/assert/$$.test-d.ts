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
// TODO: Not yet supported in new builder API
// sub.parameter1<a>()((_: a) => b)
// sub.parameter1<a, (_: a) => b>()
// // @ts-expect-error
// sub.parameter1<a>()((_: b) => a)
// // @ts-expect-error
// sub.parameter1<a, (_: b) => a>()
//
// ━━ parameters
//
// TODO: Not yet supported in new builder API
// sub.parameters<[a, b]>()((_: a, __: b) => a)
// sub.parameters<[a, b], (_: a, __: b) => a>()
// // @ts-expect-error
// sub.parameters<[a, b]>()((_: b, __: a) => a)
// // @ts-expect-error
// sub.parameters<[a, b], (_: b, __: a) => a>()
//
// ━━ noExcess
//
// TODO: Not yet supported in new builder API
// sub.noExcess<{ id: a }>()({ id: a })
// sub.noExcess<{ id: a }, { id: a }>()
// // @ts-expect-error
// sub.noExcess<{ id: a }>()({ id: a } as { id: a; name?: b })
// // @ts-expect-error
// sub.noExcess<{ id: a }, { id: a; name?: b }>()
// // @ts-expect-error - expectation constraint
// sub.noExcess<1>

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
// TODO: Not yet supported in new builder API
// equiv.parameter1<a>()((_: a) => b)
// equiv.parameter1<a, (_: a) => b>()
// // @ts-expect-error
// equiv.parameter1<a>()((_: b) => a)
// // @ts-expect-error
// equiv.parameter1<a, (_: b) => a>()
//
// ━━ parameters
//
// TODO: Not yet supported in new builder API
// equiv.parameters<[a, b]>()((_: a, __: b) => a)
// equiv.parameters<[a, b], (_: a, __: b) => a>()
// // @ts-expect-error
// equiv.parameters<[a, b]>()((_: b, __: a) => a)
// // @ts-expect-error
// equiv.parameters<[a, b], (_: b, __: a) => a>()
//
// ━━ noExcess
//
// TODO: Not yet supported in new builder API
// equiv.noExcess<{ id: a }>()({ id: a })
// equiv.noExcess<{ id: a }, { id: a }>()
// // @ts-expect-error
// equiv.noExcess<{ id: a }>()({ id: a } as { id: a; name?: b })
// // @ts-expect-error
// equiv.noExcess<{ id: a }, { id: a; name?: b }>()

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

// TODO: Not yet supported in new builder API
// exact.never($n)
// // @ts-expect-error
// exact.never<1>()
// // @ts-expect-error
// Assert.exact.of.as<a>($n)
// Assert.exact.of.as<a, $n>()
// // @ts-expect-error
// Assert.exact.of.as<$n, $n>()

//
//
// ━━━━━━━━━━━━━━ • exact - any
//
//

// TODO: Not yet supported in new builder API
// exact.any($a)
// // @ts-expect-error
// Assert.exact.of.as<a>()($a)
// // @ts-expect-error
// Assert.exact.of.as<a, $a>()

//
//
// ━━━━━━━━━━━━━━ • exact - unknown
//
//

// TODO: Not yet supported in new builder API
// exact.unknown($u)
// // @ts-expect-error
// Assert.exact.of.as<a>()($u)
// // @ts-expect-error
// Assert.exact.of.as<a, $u>()

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

test('Type-level: exact relation', () => {
  type _ = Assert.Cases<
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
    // Pre-curried built-ins
    Assert.exact.Date<Date>,
    Assert.exact.RegExp<RegExp>,
    Assert.exact.Error<Error>,
    Assert.exact.Promise<Promise<any>>,
    Assert.exact.Array<any[]>
  >
})

test('Type-level: equiv relation', () => {
  type _ = Assert.Cases<
    // Base .of matcher
    Assert.equiv.of<string & {}, string>,
    Assert.equiv.of<1 | 2, 2 | 1>,
    // Pre-curried primitives
    Assert.equiv.string<string>,
    Assert.equiv.number<number>,
    Assert.equiv.bigint<bigint>,
    Assert.equiv.boolean<boolean>,
    Assert.equiv.undefined<undefined>,
    Assert.equiv.null<null>
  >
})

test('Type-level: sub relation', () => {
  type _ = Assert.Cases<
    // Base .of matcher
    Assert.sub.of<string, 'hello'>,
    Assert.sub.of<number, 42>,
    Assert.sub.of<object, { a: 1 }>,
    // Pre-curried primitives
    Assert.sub.string<'hello'>,
    Assert.sub.number<42>,
    Assert.sub.boolean<true>,
    Assert.sub.undefined<undefined>,
    Assert.sub.null<null>
  >
})

//
// Extractors
//

test('Type-level: awaited extractor', () => {
  type _ = Assert.Cases<
    // Base .of matcher
    Assert.awaited.exact.of<number, Promise<number>>,
    Assert.awaited.exact.of<string, Promise<string>>,
    Assert.awaited.equiv.of<string & {}, Promise<string>>,
    Assert.awaited.sub.of<string, Promise<'hello'>>,
    // Pre-curried primitives
    Assert.awaited.exact.string<Promise<string>>,
    Assert.awaited.exact.number<Promise<number>>,
    Assert.awaited.exact.null<Promise<null>>,
    Assert.awaited.sub.string<Promise<'hello'>>,
    Assert.awaited.sub.number<Promise<42>>
  >
})

test('Type-level: returned extractor', () => {
  type _ = Assert.Cases<
    // Base .of matcher
    Assert.returned.exact.of<number, () => number>,
    Assert.returned.exact.of<string, () => string>,
    Assert.returned.sub.of<string, () => 'hello'>,
    // Pre-curried primitives
    Assert.returned.exact.string<() => string>,
    Assert.returned.exact.number<() => number>,
    Assert.returned.exact.null<() => null>,
    Assert.returned.sub.string<() => 'hello'>
  >
})

test('Type-level: array extractor', () => {
  type _ = Assert.Cases<
    // Base .of matcher
    Assert.array.exact.of<number, number[]>,
    Assert.array.exact.of<string, string[]>,
    Assert.array.sub.of<string, 'hello'[]>,
    // Pre-curried primitives
    Assert.array.exact.string<string[]>,
    Assert.array.exact.number<number[]>,
    Assert.array.exact.null<null[]>,
    Assert.array.sub.string<'hello'[]>
  >
})

//
// Type-Level Error Cases
//
type y = Assert.exact<string, number>
/**

 type y = {
     ERROR_________: "EXPECTED and ACTUAL are disjoint";
     expected______: string;
     actual________: number;
     tip___________: "Types share no values";
 }

 */

type x = Assert.exact.string<42>
/*
type x = {
    ERROR_________: "EXPECTED and ACTUAL are disjoint";
    expected______: string;
    actual________: 42;
    tip___________: "Types share no values";
}

*/

test('Type-level: error cases', () => {
  // @ts-expect-error - number not assignable to string
  type _1 = Assert.Case<Assert.exact<string, number>>

  // @ts-expect-error - 42 not exact match for string
  type _2 = Assert.Case<Assert.exact.string<42>>

  // @ts-expect-error - null not exact match for number
  type _3 = Assert.Case<Assert.exact.null<42>>

  // @ts-expect-error - Promise<string> not Promise<number>
  type _4 = Assert.Case<Assert.awaited.exact.number<Promise<string>>>

  // @ts-expect-error - () => string not () => number
  type _5 = Assert.Case<Assert.returned.exact.number<() => string>>

  // @ts-expect-error - string[] not number[]
  type _6 = Assert.Case<Assert.array.exact.number<string[]>>
})

//
// Coverage: All Relators with All Matchers
//

test('Type-level: comprehensive coverage - exact', () => {
  type _ = Assert.Cases<
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
})

test('Type-level: comprehensive coverage - equiv', () => {
  type _ = Assert.Cases<
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
})

test('Type-level: comprehensive coverage - sub', () => {
  type _ = Assert.Cases<
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
})

//
// Coverage: All Extractors with All Relators
//

test('Type-level: awaited extractor - all relators', () => {
  type _ = Assert.Cases<
    Assert.awaited.exact.string<Promise<string>>,
    Assert.awaited.equiv.string<Promise<string>>,
    Assert.awaited.sub.string<Promise<'hello'>>
  >
})

test('Type-level: returned extractor - all relators', () => {
  type _ = Assert.Cases<
    Assert.returned.exact.number<() => number>,
    Assert.returned.equiv.number<() => number>,
    Assert.returned.sub.number<() => 42>
  >
})

test('Type-level: array extractor - all relators', () => {
  type _ = Assert.Cases<
    Assert.array.exact.boolean<boolean[]>,
    Assert.array.equiv.boolean<boolean[]>,
    Assert.array.sub.boolean<true[]>
  >
})
