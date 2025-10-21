import { Ts } from '#ts'
import * as A from './$$.js'

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
const obj = { a: a } as const
const objExcess = { ...obj } as any as { a: a; z: 0 }
type objExcess = typeof objExcess
const objExcessOptional = { ...obj } as any as { a: a; z?: 0 }
type objExcessOptional = typeof objExcessOptional
type obj = typeof obj
const $n = 0 as never
const $a = 0 as any
const $u = 0 as unknown
type $n = typeof $n
type $a = typeof $a
type $u = typeof $u

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
  A.Case<never>,
  // @ts-expect-error
  A.Case<true>,
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
// - Every test must be one line
// - Every extractor section follows a 10-line pattern covering both API styles:
//
//   1. .of(expected)(actual)             - Simple inferred value-level
//   2. .on(actual).of(expected)          - Value-first API
//   3. .ofAs<Type>()(actual)             - Type-explicit value-level
//   4. .onAs<Type>().of(expected)        - Type-first API
//   5. .ofAs<Type>().as<Type>()          - Type-level assertion (deprecated .as)
//   6. .onAs(actual).ofAs<Type>()        - Value-first with type-level
//   7. .ofAs<Type>()(wrongValue)         - Failing case (with @ts-expect-error)
//   8. .onAs<Type>().of(wrongValue)      - Failing value-first (no @ts-expect-error)
//   9. .ofAs<Type>().as<WrongType>()     - Failing type-level (with @ts-expect-error, deprecated .as)
//   10. .onAs<Type>().ofAs<WrongType>()  - Failing value-first type-level (no @ts-expect-error)
//
// Note: Lines 5 and 9 use deprecated `.as()` method on actual receiver
//
//

// const { not, exact, sub, equiv } = Ts.Assert // OLD API - no longer used

//
//
// ━━━━━━━━━━━━━━ • exact
//
//

A.exact.of(a)(a)
A.on(a).exact.of(a)
A.exact.ofAs<a>()(a)
A.onAs<a>().exact.of(a)
A.exact.ofAs<a>().as<a>()
A.onAs(a).exact.ofAs<a>()
// @ts-expect-error
A.exact.ofAs<a>()(b)
A.onAs<a>().exact.of(b)
// @ts-expect-error
A.exact.ofAs<a>().as<b>()
A.onAs<a>().exact.ofAs<b>()
//
// ━━ awaited.is
//
A.awaited.exact.of(a)(Promise.resolve(a))
A.on(Promise.resolve(a)).awaited.exact.of(a)
A.awaited.exact.ofAs<a>()(Promise.resolve(a))
A.onAs<Promise<a>>().awaited.exact.of(a)
A.awaited.exact.ofAs<a>().as<Promise<a>>()
A.onAs(Promise.resolve(a)).awaited.exact.ofAs<a>()
// @ts-expect-error
A.awaited.exact.ofAs<a>()(Promise.resolve(b))
A.onAs<Promise<a>>().awaited.exact.of(b)
// @ts-expect-error
A.awaited.exact.ofAs<a>().as<Promise<b>>()
A.onAs<Promise<a>>().awaited.exact.ofAs<b>()
//
// ━━ awaited.array
//
A.awaited.array.exact.of(a)(Promise.resolve([a]))
A.on(Promise.resolve([a])).awaited.array.exact.of(a)
A.awaited.array.exact.ofAs<a>()(Promise.resolve([a]))
A.onAs<Promise<a[]>>().awaited.array.exact.of(a)
A.awaited.array.exact.ofAs<a>().as<Promise<a[]>>()
A.onAs(Promise.resolve([a])).awaited.array.exact.ofAs<a>()
// @ts-expect-error
A.awaited.array.exact.ofAs<a>()(Promise.resolve([b]))
A.onAs<Promise<a[]>>().awaited.array.exact.of(b)
// @ts-expect-error
A.awaited.array.exact.ofAs<a>().as<Promise<b[]>>()
A.onAs<Promise<a[]>>().awaited.array.exact.ofAs<b>()
//
// ━━ returned.is
//
A.returned.exact.of(a)(() => a)
A.on(() => a).returned.exact.of(a)
A.returned.exact.ofAs<a>()(() => a)
A.onAs<() => a>().returned.exact.of(a)
A.returned.exact.ofAs<a>().as<() => a>()
A.onAs(() => a).returned.exact.ofAs<a>()
// @ts-expect-error
A.returned.exact.ofAs<a>()(() => b)
A.onAs<() => a>().returned.exact.of(b)
// @ts-expect-error
A.returned.exact.ofAs<a>().as<() => b>()
A.onAs<() => a>().returned.exact.ofAs<b>()
//
// ━━ returned.awaited
//
A.returned.awaited.exact.of(a)(() => Promise.resolve(a))
A.on(() => Promise.resolve(a)).returned.awaited.exact.of(a)
A.returned.awaited.exact.ofAs<a>()(() => Promise.resolve(a))
A.onAs<() => Promise<a>>().returned.awaited.exact.of(a)
A.returned.awaited.exact.ofAs<a>().as<() => Promise<a>>()
A.onAs(() => Promise.resolve(a)).returned.awaited.exact.ofAs<a>()
// @ts-expect-error
A.returned.awaited.exact.ofAs<a>()(() => Promise.resolve(b))
A.onAs<() => Promise<a>>().returned.awaited.exact.of(b)
// @ts-expect-error
A.returned.awaited.exact.ofAs<a>().as<() => Promise<b>>()
A.onAs<() => Promise<a>>().returned.awaited.exact.ofAs<b>()
//
// ━━ returned.array
//
A.returned.array.exact.of(a)(() => [a])
A.on(() => [a]).returned.array.exact.of(a)
A.returned.array.exact.ofAs<a>()(() => [a])
A.onAs<() => a[]>().returned.array.exact.of(a)
A.returned.array.exact.ofAs<a>().as<() => a[]>()
A.onAs(() => [a]).returned.array.exact.ofAs<a>()
// @ts-expect-error
A.returned.array.exact.ofAs<a>()(() => [b])
A.onAs<() => a[]>().returned.array.exact.of(b)
// @ts-expect-error
A.returned.array.exact.ofAs<a>().as<() => b[]>()
A.onAs<() => a[]>().returned.array.exact.ofAs<b>()
//
// ━━ array
//
A.array.exact.of(a)([a])
A.on([a]).array.exact.of(a)
A.array.exact.ofAs<a>()([a])
A.onAs<a[]>().array.exact.of(a)
A.array.exact.ofAs<a>().as<a[]>()
A.onAs([a]).array.exact.ofAs<a>()
// @ts-expect-error
A.array.exact.ofAs<a>()([b])
A.onAs<a[]>().array.exact.of(b)
// @ts-expect-error
A.array.exact.ofAs<a>().as<b[]>()
A.onAs<a[]>().array.exact.ofAs<b>()
//
// ━━ parameter1
//
A.parameter1.exact.of(a)((_: a) => b)
A.on((_: a) => b).parameter1.exact.of(a)
A.parameter1.exact.ofAs<a>()((_: a) => b)
A.onAs<(_: a) => b>().parameter1.exact.of(a)
A.parameter1.exact.ofAs<a>().as<(_: a) => b>()
A.onAs((_: a) => b).parameter1.exact.ofAs<a>()
// @ts-expect-error
A.parameter1.exact.of<a>()((_: b) => a)
A.onAs<(_: a) => b>().parameter1.exact.of(b)
// @ts-expect-error
A.parameter1.exact.of<a, (_: b) => a>()
A.onAs<(_: a) => b>().parameter1.exact.ofAs<b>()
//
// ━━ parameters
//
A.parameters.exact.of([a, b])((_: a, __: b) => a)
A.on((_: a, __: b) => a).parameters.exact.of([a, b])
A.parameters.exact.ofAs<[a, b]>()((_: a, __: b) => a)
A.onAs<(_: a, __: b) => a>().parameters.exact.of([a, b])
A.parameters.exact.ofAs<[a, b]>().as<((_: a, __: b) => a)>()
A.onAs((_: a, __: b) => a).parameters.exact.ofAs<[a, b]>()
// @ts-expect-error
A.parameters.exact<[a, b]>()((_: b, __: a) => a)
A.onAs<(_: a, __: b) => a>().parameters.exact.of([b, a])
// @ts-expect-error
A.parameters.exact<[a, b], (_: b, __: a) => a>()
A.onAs<(_: a, __: b) => a>().parameters.exact.ofAs<[b, a]>()
//
// ━━ noExcess (not a thing)
//
A.exact.never(A.exact.noExcess)

//
//
// ━━━━━━━━━━━━━━ • sub
//
//

A.sub.of(a)(a)
A.on(a).sub.of(a)
A.sub.ofAs<a>()(a)
A.onAs<a>().sub.of(a)
A.sub.ofAs<a>().as<a>()
A.onAs(a).sub.ofAs<a>()
// @ts-expect-error
A.sub.ofAs<a>()(b)
A.onAs<a>().sub.of(b)
// @ts-expect-error
A.sub.ofAs<a>().as<b>()
A.onAs<a>().sub.ofAs<b>()
//
// ━━ awaited.is
//
A.awaited.sub.of(a)(Promise.resolve(a))
A.on(Promise.resolve(a)).awaited.sub.of(a)
A.awaited.sub.ofAs<a>()(Promise.resolve(a))
A.onAs<Promise<a>>().awaited.sub.of(a)
A.awaited.sub.ofAs<a>().as<Promise<a>>()
A.onAs(Promise.resolve(a)).awaited.sub.ofAs<a>()
// @ts-expect-error
A.awaited.sub.ofAs<a>()(Promise.resolve(b))
A.onAs<Promise<a>>().awaited.sub.of(b)
// @ts-expect-error
A.awaited.sub.ofAs<a>().as<Promise<b>>()
A.onAs<Promise<a>>().awaited.sub.ofAs<b>()
//
// ━━ awaited.array
//
A.awaited.array.sub.of(a)(Promise.resolve([a]))
A.on(Promise.resolve([a])).awaited.array.sub.of(a)
A.awaited.array.sub.ofAs<a>()(Promise.resolve([a]))
A.onAs<Promise<a[]>>().awaited.array.sub.of(a)
A.awaited.array.sub.ofAs<a>().as<Promise<a[]>>()
A.onAs(Promise.resolve([a])).awaited.array.sub.ofAs<a>()
// @ts-expect-error
A.awaited.array.sub.ofAs<a>()(Promise.resolve([b]))
A.onAs<Promise<a[]>>().awaited.array.sub.of(b)
// @ts-expect-error
A.awaited.array.sub.ofAs<a>().as<Promise<b[]>>()
A.onAs<Promise<a[]>>().awaited.array.sub.ofAs<b>()
//
// ━━ returned.is
//
A.returned.sub.of(a)(() => a)
A.on(() => a).returned.sub.of(a)
A.returned.sub.ofAs<a>()(() => a)
A.onAs<() => a>().returned.sub.of(a)
A.returned.sub.ofAs<a>().as<() => a>()
A.onAs(() => a).returned.sub.ofAs<a>()
// @ts-expect-error
A.returned.sub.ofAs<a>()(() => b)
A.onAs<() => a>().returned.sub.of(b)
// @ts-expect-error
A.returned.sub.ofAs<a>().as<() => b>()
A.onAs<() => a>().returned.sub.ofAs<b>()
//
// ━━ returned.awaited
//
A.returned.awaited.sub.of(a)(() => Promise.resolve(a))
A.on(() => Promise.resolve(a)).returned.awaited.sub.of(a)
A.returned.awaited.sub.ofAs<a>()(() => Promise.resolve(a))
A.onAs<() => Promise<a>>().returned.awaited.sub.of(a)
A.returned.awaited.sub.ofAs<a>().as<() => Promise<a>>()
A.onAs(() => Promise.resolve(a)).returned.awaited.sub.ofAs<a>()
// @ts-expect-error
A.returned.awaited.sub.ofAs<a>()(() => Promise.resolve(b))
A.onAs<() => Promise<a>>().returned.awaited.sub.of(b)
// @ts-expect-error
A.returned.awaited.sub.ofAs<a>().as<() => Promise<b>>()
A.onAs<() => Promise<a>>().returned.awaited.sub.ofAs<b>()
//
// ━━ returned.array
//
A.returned.array.sub.of(a)(() => [a])
A.on(() => [a]).returned.array.sub.of(a)
A.returned.array.sub.ofAs<a>()(() => [a])
A.onAs<() => a[]>().returned.array.sub.of(a)
A.returned.array.sub.ofAs<a>().as<() => a[]>()
A.onAs(() => [a]).returned.array.sub.ofAs<a>()
// @ts-expect-error
A.returned.array.sub.ofAs<a>()(() => [b])
A.onAs<() => a[]>().returned.array.sub.of(b)
// @ts-expect-error
A.returned.array.sub.ofAs<a>().as<() => b[]>()
A.onAs<() => a[]>().returned.array.sub.ofAs<b>()
//
// ━━ array
//
A.array.sub.of(a)([a])
A.on([a]).array.sub.of(a)
A.array.sub.ofAs<a>()([a])
A.onAs<a[]>().array.sub.of(a)
A.array.sub.ofAs<a>().as<a[]>()
A.onAs([a]).array.sub.ofAs<a>()
// @ts-expect-error
A.array.sub.ofAs<a>()([b])
A.onAs<a[]>().array.sub.of(b)
// @ts-expect-error
A.array.sub.ofAs<a>().as<b[]>()
A.onAs<a[]>().array.sub.ofAs<b>()
//
// ━━ parameter1
//
A.parameter1.sub.of(a)((_: a) => b)
A.on((_: a) => b).parameter1.sub.of(a)
A.parameter1.sub.ofAs<a>()((_: a) => b)
A.onAs<(_: a) => b>().parameter1.sub.of(a)
A.parameter1.sub.ofAs<a>().as<(_: a) => b>()
A.onAs((_: a) => b).parameter1.sub.ofAs<a>()
// @ts-expect-error
A.sub.parameter1.ofAs<a>()((_: b) => a)
A.onAs<(_: a) => b>().parameter1.sub.of(b)
// @ts-expect-error
A.sub.parameter1.of<a>().as<(_: b) => a>()
A.onAs<(_: a) => b>().parameter1.sub.ofAs<b>()
//
// ━━ parameters
//
A.parameters.sub.of([a, b])((_: a, __: b) => a)
A.on((_: a, __: b) => a).parameters.sub.of([a, b])
A.parameters.sub.ofAs<[a, b]>()((_: a, __: b) => a)
A.onAs<(_: a, __: b) => a>().parameters.sub.of([a, b])
A.parameters.sub.ofAs<[a, b]>().as<(_: a, __: b) => a>()
A.onAs((_: a, __: b) => a).parameters.sub.ofAs<[a, b]>()
// @ts-expect-error
A.sub.parameters.ofAs<[a, b]>()((_: b, __: a) => a)
A.onAs<(_: a, __: b) => a>().parameters.sub.of([b, a])
// @ts-expect-error
A.sub.parameters.of<[a, b]>().as<(_: b, __: a) => a>()
A.onAs<(_: a, __: b) => a>().parameters.sub.ofAs<[b, a]>()
//
// ━━ noExcess
//
A.sub.noExcess(obj)(obj)
A.on(obj).sub.noExcess(obj)
A.sub.noExcessAs<obj>()(obj)
A.onAs<obj>().sub.noExcess(obj)
A.sub.noExcessAs<obj>().as<obj>()
A.onAs(obj).sub.noExcessAs<obj>()
// @ts-expect-error
A.sub.noExcessAs<obj>()(objExcess)
A.onAs<obj>().sub.noExcess(objExcess)
// @ts-expect-error
A.sub.noExcessAs<obj>()(objExcessOptional)
A.onAs<obj>().sub.noExcess(objExcessOptional)
// @ts-expect-error
A.sub.noExcessAs<obj>().as<objExcess>()
A.onAs<obj>().sub.noExcessAs<objExcess>()
// @ts-expect-error
A.sub.noExcessAs<obj>().as<objExcessOptional>()
A.onAs<obj>().sub.noExcessAs<objExcessOptional>()

//
//
// ━━━━━━━━━━━━━━ • equiv
//
//

A.equiv.of(ab)(ab)
A.on(ab).equiv.of(ab)
A.equiv.ofAs<ab>()(ab)
A.onAs<ab>().equiv.of(ab)
A.equiv.ofAs<ab>().as<ab>()
A.onAs(ab).equiv.ofAs<ab>()
// @ts-expect-error
A.equiv.ofAs<a>()(b)
A.onAs<a>().equiv.of(b)
// @ts-expect-error
A.equiv.ofAs<a>().as<b>()
A.onAs<a>().equiv.ofAs<b>()
//
// ━━ awaited.is
//
A.awaited.equiv.of(a)(Promise.resolve(a))
A.on(Promise.resolve(a)).awaited.equiv.of(a)
A.awaited.equiv.ofAs<a>()(Promise.resolve(a))
A.onAs<Promise<a>>().awaited.equiv.of(a)
A.awaited.equiv.ofAs<a>().as<Promise<a>>()
A.onAs(Promise.resolve(a)).awaited.equiv.ofAs<a>()
// @ts-expect-error
A.awaited.equiv.ofAs<a>()(Promise.resolve(b))
A.onAs<Promise<a>>().awaited.equiv.of(b)
// @ts-expect-error
A.awaited.equiv.ofAs<a>().as<Promise<b>>()
A.onAs<Promise<a>>().awaited.equiv.ofAs<b>()
//
// ━━ awaited.array
//
A.awaited.array.equiv.of(a)(Promise.resolve([a]))
A.on(Promise.resolve([a])).awaited.array.equiv.of(a)
A.awaited.array.equiv.ofAs<a>()(Promise.resolve([a]))
A.onAs<Promise<a[]>>().awaited.array.equiv.of(a)
A.awaited.array.equiv.ofAs<a>().as<Promise<a[]>>()
A.onAs(Promise.resolve([a])).awaited.array.equiv.ofAs<a>()
// @ts-expect-error
A.awaited.array.equiv.ofAs<a>()(Promise.resolve([b]))
A.onAs<Promise<a[]>>().awaited.array.equiv.of(b)
// @ts-expect-error
A.awaited.array.equiv.ofAs<a>().as<Promise<b[]>>()
A.onAs<Promise<a[]>>().awaited.array.equiv.ofAs<b>()
//
// ━━ returned.is
//
A.returned.equiv.of(a)(() => a)
A.on(() => a).returned.equiv.of(a)
A.returned.equiv.ofAs<a>()(() => a)
A.onAs<() => a>().returned.equiv.of(a)
A.returned.equiv.ofAs<a>().as<() => a>()
A.onAs(() => a).returned.equiv.ofAs<a>()
// @ts-expect-error
A.returned.equiv.ofAs<a>()(() => b)
A.onAs<() => a>().returned.equiv.of(b)
// @ts-expect-error
A.returned.equiv.ofAs<a>().as<() => b>()
A.onAs<() => a>().returned.equiv.ofAs<b>()
//
// ━━ returned.awaited
//
A.returned.awaited.equiv.of(a)(() => Promise.resolve(a))
A.on(() => Promise.resolve(a)).returned.awaited.equiv.of(a)
A.returned.awaited.equiv.ofAs<a>()(() => Promise.resolve(a))
A.onAs<() => Promise<a>>().returned.awaited.equiv.of(a)
A.returned.awaited.equiv.ofAs<a>().as<() => Promise<a>>()
A.onAs(() => Promise.resolve(a)).returned.awaited.equiv.ofAs<a>()
// @ts-expect-error
A.returned.awaited.equiv.ofAs<a>()(() => Promise.resolve(b))
A.onAs<() => Promise<a>>().returned.awaited.equiv.of(b)
// @ts-expect-error
A.returned.awaited.equiv.ofAs<a>().as<() => Promise<b>>()
A.onAs<() => Promise<a>>().returned.awaited.equiv.ofAs<b>()
//
// ━━ returned.array
//
A.returned.array.equiv.of(a)(() => [a])
A.on(() => [a]).returned.array.equiv.of(a)
A.returned.array.equiv.ofAs<a>()(() => [a])
A.onAs<() => a[]>().returned.array.equiv.of(a)
A.returned.array.equiv.ofAs<a>().as<() => a[]>()
A.onAs(() => [a]).returned.array.equiv.ofAs<a>()
// @ts-expect-error
A.returned.array.equiv.ofAs<a>()(() => [b])
A.onAs<() => a[]>().returned.array.equiv.of(b)
// @ts-expect-error
A.returned.array.equiv.ofAs<a>().as<() => b[]>()
A.onAs<() => a[]>().returned.array.equiv.ofAs<b>()
//
// ━━ array
//
A.array.equiv.of(a)([a])
A.on([a]).array.equiv.of(a)
A.array.equiv.ofAs<a>()([a])
A.onAs<a[]>().array.equiv.of(a)
A.array.equiv.ofAs<a>().as<a[]>()
A.onAs([a]).array.equiv.ofAs<a>()
// @ts-expect-error
A.array.equiv.ofAs<a>()([b])
A.onAs<a[]>().array.equiv.of(b)
// @ts-expect-error
A.array.equiv.ofAs<a>().as<b[]>()
A.onAs<a[]>().array.equiv.ofAs<b>()
//
// ━━ parameter1
//
A.parameter1.equiv.of(a)((_: a) => b)
A.on((_: a) => b).parameter1.equiv.of(a)
A.parameter1.equiv.ofAs<a>()((_: a) => b)
A.onAs<(_: a) => b>().parameter1.equiv.of(a)
A.parameter1.equiv.ofAs<a>().as<(_: a) => b>()
A.onAs((_: a) => b).parameter1.equiv.ofAs<a>()
// @ts-expect-error
A.equiv.parameter1.ofAs<a>()((_: b) => a)
A.onAs<(_: a) => b>().parameter1.equiv.of(b)
// @ts-expect-error
A.equiv.parameter1.of<a>().as<(_: b) => a>()
A.onAs<(_: a) => b>().parameter1.equiv.ofAs<b>()
//
// ━━ parameters
//
A.parameters.equiv.of([a, b])((_: a, __: b) => a)
A.on((_: a, __: b) => a).parameters.equiv.of([a, b])
A.parameters.equiv.ofAs<[a, b]>()((_: a, __: b) => a)
A.onAs<(_: a, __: b) => a>().parameters.equiv.of([a, b])
A.parameters.equiv.ofAs<[a, b]>().as<(_: a, __: b) => a>()
A.onAs((_: a, __: b) => a).parameters.equiv.ofAs<[a, b]>()
// @ts-expect-error
A.equiv.parameters.ofAs<[a, b]>()((_: b, __: a) => a)
A.onAs<(_: a, __: b) => a>().parameters.equiv.of([b, a])
// @ts-expect-error
A.equiv.parameters.of<[a, b]>().as<(_: b, __: a) => a>()
A.onAs<(_: a, __: b) => a>().parameters.equiv.ofAs<[b, a]>()
//
// ━━ noExcess
//
A.equiv.noExcess(obj)(obj)
A.on(obj).equiv.noExcess(obj)
A.equiv.noExcessAs<obj>()(obj)
A.onAs<obj>().equiv.noExcess(obj)
A.equiv.noExcessAs<obj>().as<obj>()
A.onAs(obj).equiv.noExcessAs<obj>()
// @ts-expect-error
A.equiv.noExcessAs<obj>()(objExcess)
A.onAs<obj>().equiv.noExcess(objExcess)
// @ts-expect-error
A.equiv.noExcessAs<obj>()(objExcessOptional)
A.onAs<obj>().equiv.noExcess(objExcessOptional)
// @ts-expect-error
A.equiv.noExcessAs<obj>().as<objExcess>()
A.onAs<obj>().equiv.noExcessAs<objExcess>()
// @ts-expect-error
A.equiv.noExcessAs<obj>().as<objExcessOptional>()
A.onAs<obj>().equiv.noExcessAs<objExcessOptional>()

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
// not.exact.ofAs<a>()(b)
// not.exact.ofAs<a, b>()
// // @ts-expect-error
// not.exact.ofAs<a>()(a)
// // @ts-expect-error
// not.exact.ofAs<a, a>()

//
//
// ━━━━━━━━━━━━━━ • not.sub
//
//

// TODO: Not yet supported in new builder API
// not.sub.ofAs<a>().const(b)
// // @ts-expect-error
// not.sub.ofAs<a>().const(a)
// // @ts-expect-error
// not.sub.ofAs<a, a>()

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

//
//
// ━━━━━━━━━━━━━━ • exact - never
//
//
A.exact.never($n)
A.on($n).exact.never()
// @ts-expect-error
A.exact.never(a)
A.on(a).exact.never()
// @ts-expect-error
A.exact.of(a)($n)
A.on($n).exact.of(a)
// @ts-expect-error
A.exact.of(a).as<$n>()
A.onAs<$n>().exact.of(a)

//
//
// ━━━━━━━━━━━━━━ • exact - any
//
//
A.exact.any($a)
A.on($a).exact.any()
// @ts-expect-error
A.exact.any(a)
A.on(a).exact.any()
// @ts-expect-error
A.exact.of(a)($a)
A.on($a).exact.of(a)
// @ts-expect-error
A.exact.of(a).as<$a>()
A.onAs<$a>().exact.of(a)

//
//
// ━━━━━━━━━━━━━━ • exact - unknown
//
//
A.exact.unknown($u)
A.on($u).exact.unknown()
// @ts-expect-error
A.exact.unknown(a)
A.on(a).exact.unknown()
// @ts-expect-error
A.exact.of(a)($u)
A.on($u).exact.of(a)
// @ts-expect-error
A.exact.of(a).as<$u>()
A.onAs<$u>().exact.of(a)

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
// Infer Specificity Mode
//
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//
//
//
//

const readonlyValue = Ts.as<readonly [string]>()
type readonlyValue = typeof readonlyValue

/* default */
A.exact.of([a]).as<[a]>()
A.exact.of(readonlyValue)(readonlyValue)
A.exact.of(readonlyValue)([a] as any as [string])
A.exact.of(readonlyValue).as<[string]>()

A.setInfer('auto').exact.of([a]).as<[a]>()
A.setInfer('wide').exact.of([a]).as<a[]>()

A.setInfer('narrow').exact.of([a]).as<readonly [a]>()
A.setInfer('narrow').exact.of(readonlyValue)(readonlyValue)
A.setInfer('narrow').exact.of(readonlyValue)([a] as any as readonlyValue)
A.setInfer('narrow').exact.of(readonlyValue).as<readonlyValue>()

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

type _exact_relation = A.Cases<
  // Base .of matcher
  A.exact.of<string, string>,
  A.exact.of<number, number>,
  A.exact.of<42, 42>,
  A.exact.of<'hello', 'hello'>,
  // Pre-curried primitives
  A.exact.string<string>,
  A.exact.number<number>,
  A.exact.bigint<bigint>,
  A.exact.boolean<boolean>,
  A.exact.undefined<undefined>,
  A.exact.null<null>,
  A.exact.symbol<symbol>,
  A.exact.unknown<unknown>,
  A.exact.any<any>,
  A.exact.never<never>,
  // Pre-curried built-ins
  A.exact.Date<Date>,
  A.exact.RegExp<RegExp>,
  A.exact.Error<Error>,
  A.exact.Promise<Promise<any>>,
  A.exact.Array<any[]>
>

type _equiv_relation = A.Cases<
  // Base .of matcher
  A.equiv.of<string & {}, string>,
  A.equiv.of<1 | 2, 2 | 1>,
  // Pre-curried primitives
  A.equiv.string<string>,
  A.equiv.number<number>,
  A.equiv.bigint<bigint>,
  A.equiv.boolean<boolean>,
  A.equiv.undefined<undefined>,
  A.equiv.null<null>,
  A.equiv.unknown<unknown>,
  A.equiv.any<any>,
  A.equiv.never<never>
>

type _equiv_noExcess_relation = A.Cases<
  A.equiv.noExcess<{ id: string }, { id: string }>,
  A.equiv.noExcess<{ a: number } & {}, { a: number }>
>

type _sub_relation = A.Cases<
  // Base .of matcher
  A.sub.of<string, 'hello'>,
  A.sub.of<number, 42>,
  A.sub.of<object, { a: 1 }>,
  // Pre-curried primitives
  A.sub.string<'hello'>,
  A.sub.number<42>,
  A.sub.boolean<true>,
  A.sub.undefined<undefined>,
  A.sub.null<null>,
  A.sub.unknown<unknown>,
  A.sub.any<any>,
  A.sub.never<never>
>

type _sub_noExcess_relation = A.Cases<
  A.sub.noExcess<{ id: string }, { id: string }>,
  A.sub.noExcess<{ a: number }, { a: 42 }>
>

//
// Extractors
//

type _awaited_extractor = A.Cases<
  // Base .of matcher
  A.awaited.exact.of<number, Promise<number>>,
  A.awaited.exact.of<string, Promise<string>>,
  A.awaited.equiv.of<string & {}, Promise<string>>,
  A.awaited.sub.of<string, Promise<'hello'>>,
  // Pre-curried primitives
  A.awaited.exact.string<Promise<string>>,
  A.awaited.exact.number<Promise<number>>,
  A.awaited.exact.null<Promise<null>>,
  A.awaited.exact.unknown<Promise<unknown>>,
  A.awaited.exact.any<Promise<any>>,
  A.awaited.exact.never<Promise<never>>,
  A.awaited.sub.string<Promise<'hello'>>,
  A.awaited.sub.number<Promise<42>>
>

type _returned_extractor = A.Cases<
  // Base .of matcher
  A.returned.exact.of<number, () => number>,
  A.returned.exact.of<string, () => string>,
  A.returned.sub.of<string, () => 'hello'>,
  // Pre-curried primitives
  A.returned.exact.string<() => string>,
  A.returned.exact.number<() => number>,
  A.returned.exact.null<() => null>,
  A.returned.exact.unknown<() => unknown>,
  A.returned.exact.any<() => any>,
  A.returned.exact.never<() => never>,
  A.returned.sub.string<() => 'hello'>
>

type _array_extractor = A.Cases<
  // Base .of matcher
  A.array.exact.of<number, number[]>,
  A.array.exact.of<string, string[]>,
  A.array.sub.of<string, 'hello'[]>,
  // Pre-curried primitives
  A.array.exact.string<string[]>,
  A.array.exact.number<number[]>,
  A.array.exact.null<null[]>,
  A.array.exact.unknown<unknown[]>,
  A.array.exact.any<any[]>,
  A.array.exact.never<never[]>,
  A.array.sub.string<'hello'[]>
>

//
// Type-Level Error Cases
//

// @ts-expect-error - number not assignable to string
type _error_1 = A.Case<A.exact<string, number>>
// @ts-expect-error - 42 not exact match for string
type _error_2 = A.Case<A.exact.string<42>>
// @ts-expect-error - null not exact match for number
type _error_3 = A.Case<A.exact.null<42>>
// @ts-expect-error - Promise<string> not Promise<number>
type _error_4 = A.Case<A.awaited.exact.number<Promise<string>>>
// @ts-expect-error - () => string not () => number
type _error_5 = A.Case<A.returned.exact.number<() => string>>
// @ts-expect-error - string[] not number[]
type _error_6 = A.Case<A.array.exact.number<string[]>>
// @ts-expect-error - string not exact match for unknown
type _error_7 = A.Case<A.exact.unknown<string>>
// @ts-expect-error - unknown not exact match for any
type _error_8 = A.Case<A.exact.any<unknown>>
// @ts-expect-error - string not exact match for never
type _error_9 = A.Case<A.exact.never<string>>

// any/never actuals should be caught by guards (type-level)
// @ts-expect-error - any not assignable to literal 3
type _guard_any = A.Case<A.exact<3, any>>
// @ts-expect-error - never not assignable to literal 3
type _guard_never = A.Case<A.exact<3, never>>

//
// Coverage: All Relators with All Matchers
//

type _coverage_exact = A.Cases<
  // All primitives
  A.exact.string<string>,
  A.exact.number<number>,
  A.exact.bigint<bigint>,
  A.exact.boolean<boolean>,
  A.exact.undefined<undefined>,
  A.exact.null<null>,
  A.exact.symbol<symbol>,
  // All built-ins
  A.exact.Date<Date>,
  A.exact.RegExp<RegExp>,
  A.exact.Error<Error>,
  A.exact.Promise<Promise<any>>,
  A.exact.Array<any[]>
>

type _coverage_equiv = A.Cases<
  // All primitives
  A.equiv.string<string>,
  A.equiv.number<number>,
  A.equiv.bigint<bigint>,
  A.equiv.boolean<boolean>,
  A.equiv.undefined<undefined>,
  A.equiv.null<null>,
  A.equiv.symbol<symbol>,
  // All built-ins
  A.equiv.Date<Date>,
  A.equiv.RegExp<RegExp>,
  A.equiv.Error<Error>,
  A.equiv.Promise<Promise<any>>,
  A.equiv.Array<any[]>
>

type _coverage_sub = A.Cases<
  // All primitives
  A.sub.string<string>,
  A.sub.number<number>,
  A.sub.bigint<bigint>,
  A.sub.boolean<boolean>,
  A.sub.undefined<undefined>,
  A.sub.null<null>,
  A.sub.symbol<symbol>,
  // All built-ins
  A.sub.Date<Date>,
  A.sub.RegExp<RegExp>,
  A.sub.Error<Error>,
  A.sub.Promise<Promise<any>>,
  A.sub.Array<any[]>
>

//
// Coverage: All Extractors with All Relators
//

type _awaited_all_relators = A.Cases<
  A.awaited.exact.string<Promise<string>>,
  A.awaited.equiv.string<Promise<string>>,
  A.awaited.sub.string<Promise<'hello'>>
>

type _returned_all_relators = A.Cases<
  A.returned.exact.number<() => number>,
  A.returned.equiv.number<() => number>,
  A.returned.sub.number<() => 42>
>

type _array_all_relators = A.Cases<
  A.array.exact.boolean<boolean[]>,
  A.array.equiv.boolean<boolean[]>,
  A.array.sub.boolean<true[]>
>

//
//
//
//
//
// Smart Extractor Availability - Value-First API
//
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
//
//
//
//

// Base keys always available on builder
type BaseKeys = 'exact' | 'equiv' | 'sub' | 'inferNarrow' | 'inferWide' | 'inferAuto' | 'setInfer'

// All extractor keys
type AllExtractors =
  | 'awaited'
  | 'returned'
  | 'array'
  | 'parameters'
  | 'parameter1'
  | 'parameter2'
  | 'parameter3'
  | 'parameter4'
  | 'parameter5'

// dprint-ignore
type _extractor_availability = [
  A.exact.of<BaseKeys | 'awaited',                                                                                                   keyof ReturnType<typeof A.on<Promise<number>>>>,                           // Promise - only awaited available
  A.exact.of<BaseKeys | 'returned' | 'parameters' | 'parameter1' | 'parameter2' | 'parameter3' | 'parameter4' | 'parameter5',       keyof ReturnType<typeof A.on<() => number>>>,                              // Function - function extractors only
  A.exact.of<BaseKeys | 'array',                                                                                                     keyof ReturnType<typeof A.on<number[]>>>,                                   // Array - only array available
  A.exact.of<BaseKeys,                                                                                                               keyof ReturnType<typeof A.on<string>>>,                                     // Primitives - no extractors, only base keys
  A.exact.of<BaseKeys | 'awaited',                                                                                                   keyof ReturnType<typeof A.on<Promise<number[]>>>>,                          // Chaining - Promise<Array> before awaited
  A.exact.of<BaseKeys | 'array',                                                                                                     keyof ReturnType<typeof A.on<Promise<number[]>>>['awaited']>,               // Chaining - Promise<Array> after awaited
  A.exact.of<BaseKeys | 'awaited',                                                                                                   keyof ReturnType<typeof A.on<Promise<() => number>>>>,                      // Chaining - Promise<Function> before awaited
  A.exact.of<BaseKeys | 'returned' | 'parameters' | 'parameter1' | 'parameter2' | 'parameter3' | 'parameter4' | 'parameter5',       keyof ReturnType<typeof A.on<Promise<() => number>>>['awaited']>,           // Chaining - Promise<Function> after awaited
  A.exact.of<BaseKeys | AllExtractors,                                                                                               keyof ReturnType<typeof A.on<any>>>,                                        // any - all extractors available
  A.exact.of<BaseKeys | AllExtractors,                                                                                               keyof ReturnType<typeof A.on<unknown>>>,                                    // unknown - all extractors available
]
