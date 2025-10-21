import { Ts } from '#ts'
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

Assert.exact.of(a)(a)
Assert.on(a).exact.of(a)
Assert.exact.ofAs<a>()(a)
Assert.onAs<a>().exact.of(a)
Assert.exact.ofAs<a>().as<a>()
Assert.onAs(a).exact.ofAs<a>()
// @ts-expect-error
Assert.exact.ofAs<a>()(b)
Assert.onAs<a>().exact.of(b)
// @ts-expect-error
Assert.exact.ofAs<a>().as<b>()
Assert.onAs<a>().exact.ofAs<b>()
//
// ━━ awaited.is
//
Assert.awaited.exact.of(a)(Promise.resolve(a))
Assert.on(Promise.resolve(a)).awaited.exact.of(a)
Assert.awaited.exact.ofAs<a>()(Promise.resolve(a))
Assert.onAs<Promise<a>>().awaited.exact.of(a)
Assert.awaited.exact.ofAs<a>().as<Promise<a>>()
Assert.onAs(Promise.resolve(a)).awaited.exact.ofAs<a>()
// @ts-expect-error
Assert.awaited.exact.ofAs<a>()(Promise.resolve(b))
Assert.onAs<Promise<a>>().awaited.exact.of(b)
// @ts-expect-error
Assert.awaited.exact.ofAs<a>().as<Promise<b>>()
Assert.onAs<Promise<a>>().awaited.exact.ofAs<b>()
//
// ━━ awaited.array
//
Assert.awaited.array.exact.of(a)(Promise.resolve([a]))
Assert.on(Promise.resolve([a])).awaited.array.exact.of(a)
Assert.awaited.array.exact.ofAs<a>()(Promise.resolve([a]))
Assert.onAs<Promise<a[]>>().awaited.array.exact.of(a)
Assert.awaited.array.exact.ofAs<a>().as<Promise<a[]>>()
Assert.onAs(Promise.resolve([a])).awaited.array.exact.ofAs<a>()
// @ts-expect-error
Assert.awaited.array.exact.ofAs<a>()(Promise.resolve([b]))
Assert.onAs<Promise<a[]>>().awaited.array.exact.of(b)
// @ts-expect-error
Assert.awaited.array.exact.ofAs<a>().as<Promise<b[]>>()
Assert.onAs<Promise<a[]>>().awaited.array.exact.ofAs<b>()
//
// ━━ returned.is
//
Assert.returned.exact.of(a)(() => a)
Assert.on(() => a).returned.exact.of(a)
Assert.returned.exact.ofAs<a>()(() => a)
Assert.onAs<() => a>().returned.exact.of(a)
Assert.returned.exact.ofAs<a>().as<() => a>()
Assert.onAs(() => a).returned.exact.ofAs<a>()
// @ts-expect-error
Assert.returned.exact.ofAs<a>()(() => b)
Assert.onAs<() => a>().returned.exact.of(b)
// @ts-expect-error
Assert.returned.exact.ofAs<a>().as<() => b>()
Assert.onAs<() => a>().returned.exact.ofAs<b>()
//
// ━━ returned.awaited
//
Assert.returned.awaited.exact.of(a)(() => Promise.resolve(a))
Assert.on(() => Promise.resolve(a)).returned.awaited.exact.of(a)
Assert.returned.awaited.exact.ofAs<a>()(() => Promise.resolve(a))
Assert.onAs<() => Promise<a>>().returned.awaited.exact.of(a)
Assert.returned.awaited.exact.ofAs<a>().as<() => Promise<a>>()
Assert.onAs(() => Promise.resolve(a)).returned.awaited.exact.ofAs<a>()
// @ts-expect-error
Assert.returned.awaited.exact.ofAs<a>()(() => Promise.resolve(b))
Assert.onAs<() => Promise<a>>().returned.awaited.exact.of(b)
// @ts-expect-error
Assert.returned.awaited.exact.ofAs<a>().as<() => Promise<b>>()
Assert.onAs<() => Promise<a>>().returned.awaited.exact.ofAs<b>()
//
// ━━ returned.array
//
Assert.returned.array.exact.of(a)(() => [a])
Assert.on(() => [a]).returned.array.exact.of(a)
Assert.returned.array.exact.ofAs<a>()(() => [a])
Assert.onAs<() => a[]>().returned.array.exact.of(a)
Assert.returned.array.exact.ofAs<a>().as<() => a[]>()
Assert.onAs(() => [a]).returned.array.exact.ofAs<a>()
// @ts-expect-error
Assert.returned.array.exact.ofAs<a>()(() => [b])
Assert.onAs<() => a[]>().returned.array.exact.of(b)
// @ts-expect-error
Assert.returned.array.exact.ofAs<a>().as<() => b[]>()
Assert.onAs<() => a[]>().returned.array.exact.ofAs<b>()
//
// ━━ array
//
Assert.array.exact.of(a)([a])
Assert.on([a]).array.exact.of(a)
Assert.array.exact.ofAs<a>()([a])
Assert.onAs<a[]>().array.exact.of(a)
Assert.array.exact.ofAs<a>().as<a[]>()
Assert.onAs([a]).array.exact.ofAs<a>()
// @ts-expect-error
Assert.array.exact.ofAs<a>()([b])
Assert.onAs<a[]>().array.exact.of(b)
// @ts-expect-error
Assert.array.exact.ofAs<a>().as<b[]>()
Assert.onAs<a[]>().array.exact.ofAs<b>()
//
// ━━ parameter1
//
Assert.parameter1.exact.of(a)((_: a) => b)
Assert.on((_: a) => b).parameter1.exact.of(a)
Assert.parameter1.exact.ofAs<a>()((_: a) => b)
Assert.onAs<(_: a) => b>().parameter1.exact.of(a)
Assert.parameter1.exact.ofAs<a>().as<(_: a) => b>()
Assert.onAs((_: a) => b).parameter1.exact.ofAs<a>()
// @ts-expect-error
Assert.parameter1.exact.of<a>()((_: b) => a)
Assert.onAs<(_: a) => b>().parameter1.exact.of(b)
// @ts-expect-error
Assert.parameter1.exact.of<a, (_: b) => a>()
Assert.onAs<(_: a) => b>().parameter1.exact.ofAs<b>()
//
// ━━ parameters
//
Assert.parameters.exact.of([a, b])((_: a, __: b) => a)
Assert.on((_: a, __: b) => a).parameters.exact.of([a, b])
Assert.parameters.exact.ofAs<[a, b]>()((_: a, __: b) => a)
Assert.onAs<(_: a, __: b) => a>().parameters.exact.of([a, b])
Assert.parameters.exact.ofAs<[a, b]>().as<((_: a, __: b) => a)>()
Assert.onAs((_: a, __: b) => a).parameters.exact.ofAs<[a, b]>()
// @ts-expect-error
Assert.parameters.exact<[a, b]>()((_: b, __: a) => a)
Assert.onAs<(_: a, __: b) => a>().parameters.exact.of([b, a])
// @ts-expect-error
Assert.parameters.exact<[a, b], (_: b, __: a) => a>()
Assert.onAs<(_: a, __: b) => a>().parameters.exact.ofAs<[b, a]>()
//
// ━━ noExcess (not a thing)
//
Assert.exact.never(Assert.exact.noExcess)

//
//
// ━━━━━━━━━━━━━━ • sub
//
//

Assert.sub.of(a)(a)
Assert.on(a).sub.of(a)
Assert.sub.ofAs<a>()(a)
Assert.onAs<a>().sub.of(a)
Assert.sub.ofAs<a>().as<a>()
Assert.onAs(a).sub.ofAs<a>()
// @ts-expect-error
Assert.sub.ofAs<a>()(b)
Assert.onAs<a>().sub.of(b)
// @ts-expect-error
Assert.sub.ofAs<a>().as<b>()
Assert.onAs<a>().sub.ofAs<b>()
//
// ━━ awaited.is
//
Assert.awaited.sub.of(a)(Promise.resolve(a))
Assert.on(Promise.resolve(a)).awaited.sub.of(a)
Assert.awaited.sub.ofAs<a>()(Promise.resolve(a))
Assert.onAs<Promise<a>>().awaited.sub.of(a)
Assert.awaited.sub.ofAs<a>().as<Promise<a>>()
Assert.onAs(Promise.resolve(a)).awaited.sub.ofAs<a>()
// @ts-expect-error
Assert.awaited.sub.ofAs<a>()(Promise.resolve(b))
Assert.onAs<Promise<a>>().awaited.sub.of(b)
// @ts-expect-error
Assert.awaited.sub.ofAs<a>().as<Promise<b>>()
Assert.onAs<Promise<a>>().awaited.sub.ofAs<b>()
//
// ━━ awaited.array
//
Assert.awaited.array.sub.of(a)(Promise.resolve([a]))
Assert.on(Promise.resolve([a])).awaited.array.sub.of(a)
Assert.awaited.array.sub.ofAs<a>()(Promise.resolve([a]))
Assert.onAs<Promise<a[]>>().awaited.array.sub.of(a)
Assert.awaited.array.sub.ofAs<a>().as<Promise<a[]>>()
Assert.onAs(Promise.resolve([a])).awaited.array.sub.ofAs<a>()
// @ts-expect-error
Assert.awaited.array.sub.ofAs<a>()(Promise.resolve([b]))
Assert.onAs<Promise<a[]>>().awaited.array.sub.of(b)
// @ts-expect-error
Assert.awaited.array.sub.ofAs<a>().as<Promise<b[]>>()
Assert.onAs<Promise<a[]>>().awaited.array.sub.ofAs<b>()
//
// ━━ returned.is
//
Assert.returned.sub.of(a)(() => a)
Assert.on(() => a).returned.sub.of(a)
Assert.returned.sub.ofAs<a>()(() => a)
Assert.onAs<() => a>().returned.sub.of(a)
Assert.returned.sub.ofAs<a>().as<() => a>()
Assert.onAs(() => a).returned.sub.ofAs<a>()
// @ts-expect-error
Assert.returned.sub.ofAs<a>()(() => b)
Assert.onAs<() => a>().returned.sub.of(b)
// @ts-expect-error
Assert.returned.sub.ofAs<a>().as<() => b>()
Assert.onAs<() => a>().returned.sub.ofAs<b>()
//
// ━━ returned.awaited
//
Assert.returned.awaited.sub.of(a)(() => Promise.resolve(a))
Assert.on(() => Promise.resolve(a)).returned.awaited.sub.of(a)
Assert.returned.awaited.sub.ofAs<a>()(() => Promise.resolve(a))
Assert.onAs<() => Promise<a>>().returned.awaited.sub.of(a)
Assert.returned.awaited.sub.ofAs<a>().as<() => Promise<a>>()
Assert.onAs(() => Promise.resolve(a)).returned.awaited.sub.ofAs<a>()
// @ts-expect-error
Assert.returned.awaited.sub.ofAs<a>()(() => Promise.resolve(b))
Assert.onAs<() => Promise<a>>().returned.awaited.sub.of(b)
// @ts-expect-error
Assert.returned.awaited.sub.ofAs<a>().as<() => Promise<b>>()
Assert.onAs<() => Promise<a>>().returned.awaited.sub.ofAs<b>()
//
// ━━ returned.array
//
Assert.returned.array.sub.of(a)(() => [a])
Assert.on(() => [a]).returned.array.sub.of(a)
Assert.returned.array.sub.ofAs<a>()(() => [a])
Assert.onAs<() => a[]>().returned.array.sub.of(a)
Assert.returned.array.sub.ofAs<a>().as<() => a[]>()
Assert.onAs(() => [a]).returned.array.sub.ofAs<a>()
// @ts-expect-error
Assert.returned.array.sub.ofAs<a>()(() => [b])
Assert.onAs<() => a[]>().returned.array.sub.of(b)
// @ts-expect-error
Assert.returned.array.sub.ofAs<a>().as<() => b[]>()
Assert.onAs<() => a[]>().returned.array.sub.ofAs<b>()
//
// ━━ array
//
Assert.array.sub.of(a)([a])
Assert.on([a]).array.sub.of(a)
Assert.array.sub.ofAs<a>()([a])
Assert.onAs<a[]>().array.sub.of(a)
Assert.array.sub.ofAs<a>().as<a[]>()
Assert.onAs([a]).array.sub.ofAs<a>()
// @ts-expect-error
Assert.array.sub.ofAs<a>()([b])
Assert.onAs<a[]>().array.sub.of(b)
// @ts-expect-error
Assert.array.sub.ofAs<a>().as<b[]>()
Assert.onAs<a[]>().array.sub.ofAs<b>()
//
// ━━ parameter1
//
Assert.parameter1.sub.of(a)((_: a) => b)
Assert.on((_: a) => b).parameter1.sub.of(a)
Assert.parameter1.sub.ofAs<a>()((_: a) => b)
Assert.onAs<(_: a) => b>().parameter1.sub.of(a)
Assert.parameter1.sub.ofAs<a>().as<(_: a) => b>()
Assert.onAs((_: a) => b).parameter1.sub.ofAs<a>()
// @ts-expect-error
Assert.sub.parameter1.ofAs<a>()((_: b) => a)
Assert.onAs<(_: a) => b>().parameter1.sub.of(b)
// @ts-expect-error
Assert.sub.parameter1.of<a>().as<(_: b) => a>()
Assert.onAs<(_: a) => b>().parameter1.sub.ofAs<b>()
//
// ━━ parameters
//
Assert.parameters.sub.of([a, b])((_: a, __: b) => a)
Assert.on((_: a, __: b) => a).parameters.sub.of([a, b])
Assert.parameters.sub.ofAs<[a, b]>()((_: a, __: b) => a)
Assert.onAs<(_: a, __: b) => a>().parameters.sub.of([a, b])
Assert.parameters.sub.ofAs<[a, b]>().as<(_: a, __: b) => a>()
Assert.onAs((_: a, __: b) => a).parameters.sub.ofAs<[a, b]>()
// @ts-expect-error
Assert.sub.parameters.ofAs<[a, b]>()((_: b, __: a) => a)
Assert.onAs<(_: a, __: b) => a>().parameters.sub.of([b, a])
// @ts-expect-error
Assert.sub.parameters.of<[a, b]>().as<(_: b, __: a) => a>()
Assert.onAs<(_: a, __: b) => a>().parameters.sub.ofAs<[b, a]>()
//
// ━━ noExcess
//
Assert.sub.noExcess(obj)(obj)
Assert.on(obj).sub.noExcess(obj)
Assert.sub.noExcessAs<obj>()(obj)
Assert.onAs<obj>().sub.noExcess(obj)
Assert.sub.noExcessAs<obj>().as<obj>()
Assert.onAs(obj).sub.noExcessAs<obj>()
// @ts-expect-error
Assert.sub.noExcessAs<obj>()(objExcess)
Assert.onAs<obj>().sub.noExcess(objExcess)
// @ts-expect-error
Assert.sub.noExcessAs<obj>()(objExcessOptional)
Assert.onAs<obj>().sub.noExcess(objExcessOptional)
// @ts-expect-error
Assert.sub.noExcessAs<obj>().as<objExcess>()
Assert.onAs<obj>().sub.noExcessAs<objExcess>()
// @ts-expect-error
Assert.sub.noExcessAs<obj>().as<objExcessOptional>()
Assert.onAs<obj>().sub.noExcessAs<objExcessOptional>()

//
//
// ━━━━━━━━━━━━━━ • equiv
//
//

Assert.equiv.of(ab)(ab)
Assert.on(ab).equiv.of(ab)
Assert.equiv.ofAs<ab>()(ab)
Assert.onAs<ab>().equiv.of(ab)
Assert.equiv.ofAs<ab>().as<ab>()
Assert.onAs(ab).equiv.ofAs<ab>()
// @ts-expect-error
Assert.equiv.ofAs<a>()(b)
Assert.onAs<a>().equiv.of(b)
// @ts-expect-error
Assert.equiv.ofAs<a>().as<b>()
Assert.onAs<a>().equiv.ofAs<b>()
//
// ━━ awaited.is
//
Assert.awaited.equiv.of(a)(Promise.resolve(a))
Assert.on(Promise.resolve(a)).awaited.equiv.of(a)
Assert.awaited.equiv.ofAs<a>()(Promise.resolve(a))
Assert.onAs<Promise<a>>().awaited.equiv.of(a)
Assert.awaited.equiv.ofAs<a>().as<Promise<a>>()
Assert.onAs(Promise.resolve(a)).awaited.equiv.ofAs<a>()
// @ts-expect-error
Assert.awaited.equiv.ofAs<a>()(Promise.resolve(b))
Assert.onAs<Promise<a>>().awaited.equiv.of(b)
// @ts-expect-error
Assert.awaited.equiv.ofAs<a>().as<Promise<b>>()
Assert.onAs<Promise<a>>().awaited.equiv.ofAs<b>()
//
// ━━ awaited.array
//
Assert.awaited.array.equiv.of(a)(Promise.resolve([a]))
Assert.on(Promise.resolve([a])).awaited.array.equiv.of(a)
Assert.awaited.array.equiv.ofAs<a>()(Promise.resolve([a]))
Assert.onAs<Promise<a[]>>().awaited.array.equiv.of(a)
Assert.awaited.array.equiv.ofAs<a>().as<Promise<a[]>>()
Assert.onAs(Promise.resolve([a])).awaited.array.equiv.ofAs<a>()
// @ts-expect-error
Assert.awaited.array.equiv.ofAs<a>()(Promise.resolve([b]))
Assert.onAs<Promise<a[]>>().awaited.array.equiv.of(b)
// @ts-expect-error
Assert.awaited.array.equiv.ofAs<a>().as<Promise<b[]>>()
Assert.onAs<Promise<a[]>>().awaited.array.equiv.ofAs<b>()
//
// ━━ returned.is
//
Assert.returned.equiv.of(a)(() => a)
Assert.on(() => a).returned.equiv.of(a)
Assert.returned.equiv.ofAs<a>()(() => a)
Assert.onAs<() => a>().returned.equiv.of(a)
Assert.returned.equiv.ofAs<a>().as<() => a>()
Assert.onAs(() => a).returned.equiv.ofAs<a>()
// @ts-expect-error
Assert.returned.equiv.ofAs<a>()(() => b)
Assert.onAs<() => a>().returned.equiv.of(b)
// @ts-expect-error
Assert.returned.equiv.ofAs<a>().as<() => b>()
Assert.onAs<() => a>().returned.equiv.ofAs<b>()
//
// ━━ returned.awaited
//
Assert.returned.awaited.equiv.of(a)(() => Promise.resolve(a))
Assert.on(() => Promise.resolve(a)).returned.awaited.equiv.of(a)
Assert.returned.awaited.equiv.ofAs<a>()(() => Promise.resolve(a))
Assert.onAs<() => Promise<a>>().returned.awaited.equiv.of(a)
Assert.returned.awaited.equiv.ofAs<a>().as<() => Promise<a>>()
Assert.onAs(() => Promise.resolve(a)).returned.awaited.equiv.ofAs<a>()
// @ts-expect-error
Assert.returned.awaited.equiv.ofAs<a>()(() => Promise.resolve(b))
Assert.onAs<() => Promise<a>>().returned.awaited.equiv.of(b)
// @ts-expect-error
Assert.returned.awaited.equiv.ofAs<a>().as<() => Promise<b>>()
Assert.onAs<() => Promise<a>>().returned.awaited.equiv.ofAs<b>()
//
// ━━ returned.array
//
Assert.returned.array.equiv.of(a)(() => [a])
Assert.on(() => [a]).returned.array.equiv.of(a)
Assert.returned.array.equiv.ofAs<a>()(() => [a])
Assert.onAs<() => a[]>().returned.array.equiv.of(a)
Assert.returned.array.equiv.ofAs<a>().as<() => a[]>()
Assert.onAs(() => [a]).returned.array.equiv.ofAs<a>()
// @ts-expect-error
Assert.returned.array.equiv.ofAs<a>()(() => [b])
Assert.onAs<() => a[]>().returned.array.equiv.of(b)
// @ts-expect-error
Assert.returned.array.equiv.ofAs<a>().as<() => b[]>()
Assert.onAs<() => a[]>().returned.array.equiv.ofAs<b>()
//
// ━━ array
//
Assert.array.equiv.of(a)([a])
Assert.on([a]).array.equiv.of(a)
Assert.array.equiv.ofAs<a>()([a])
Assert.onAs<a[]>().array.equiv.of(a)
Assert.array.equiv.ofAs<a>().as<a[]>()
Assert.onAs([a]).array.equiv.ofAs<a>()
// @ts-expect-error
Assert.array.equiv.ofAs<a>()([b])
Assert.onAs<a[]>().array.equiv.of(b)
// @ts-expect-error
Assert.array.equiv.ofAs<a>().as<b[]>()
Assert.onAs<a[]>().array.equiv.ofAs<b>()
//
// ━━ parameter1
//
Assert.parameter1.equiv.of(a)((_: a) => b)
Assert.on((_: a) => b).parameter1.equiv.of(a)
Assert.parameter1.equiv.ofAs<a>()((_: a) => b)
Assert.onAs<(_: a) => b>().parameter1.equiv.of(a)
Assert.parameter1.equiv.ofAs<a>().as<(_: a) => b>()
Assert.onAs((_: a) => b).parameter1.equiv.ofAs<a>()
// @ts-expect-error
Assert.equiv.parameter1.ofAs<a>()((_: b) => a)
Assert.onAs<(_: a) => b>().parameter1.equiv.of(b)
// @ts-expect-error
Assert.equiv.parameter1.of<a>().as<(_: b) => a>()
Assert.onAs<(_: a) => b>().parameter1.equiv.ofAs<b>()
//
// ━━ parameters
//
Assert.parameters.equiv.of([a, b])((_: a, __: b) => a)
Assert.on((_: a, __: b) => a).parameters.equiv.of([a, b])
Assert.parameters.equiv.ofAs<[a, b]>()((_: a, __: b) => a)
Assert.onAs<(_: a, __: b) => a>().parameters.equiv.of([a, b])
Assert.parameters.equiv.ofAs<[a, b]>().as<(_: a, __: b) => a>()
Assert.onAs((_: a, __: b) => a).parameters.equiv.ofAs<[a, b]>()
// @ts-expect-error
Assert.equiv.parameters.ofAs<[a, b]>()((_: b, __: a) => a)
Assert.onAs<(_: a, __: b) => a>().parameters.equiv.of([b, a])
// @ts-expect-error
Assert.equiv.parameters.of<[a, b]>().as<(_: b, __: a) => a>()
Assert.onAs<(_: a, __: b) => a>().parameters.equiv.ofAs<[b, a]>()
//
// ━━ noExcess
//
Assert.equiv.noExcess(obj)(obj)
Assert.on(obj).equiv.noExcess(obj)
Assert.equiv.noExcessAs<obj>()(obj)
Assert.onAs<obj>().equiv.noExcess(obj)
Assert.equiv.noExcessAs<obj>().as<obj>()
Assert.onAs(obj).equiv.noExcessAs<obj>()
// @ts-expect-error
Assert.equiv.noExcessAs<obj>()(objExcess)
Assert.onAs<obj>().equiv.noExcess(objExcess)
// @ts-expect-error
Assert.equiv.noExcessAs<obj>()(objExcessOptional)
Assert.onAs<obj>().equiv.noExcess(objExcessOptional)
// @ts-expect-error
Assert.equiv.noExcessAs<obj>().as<objExcess>()
Assert.onAs<obj>().equiv.noExcessAs<objExcess>()
// @ts-expect-error
Assert.equiv.noExcessAs<obj>().as<objExcessOptional>()
Assert.onAs<obj>().equiv.noExcessAs<objExcessOptional>()

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
Assert.exact.never($n)
Assert.on($n).exact.never()
// @ts-expect-error
Assert.exact.never(a)
Assert.on(a).exact.never()
// @ts-expect-error
Assert.exact.of(a)($n)
Assert.on($n).exact.of(a)
// @ts-expect-error
Assert.exact.of(a).as<$n>()
Assert.onAs<$n>().exact.of(a)

//
//
// ━━━━━━━━━━━━━━ • exact - any
//
//
Assert.exact.any($a)
Assert.on($a).exact.any()
// @ts-expect-error
Assert.exact.any(a)
Assert.on(a).exact.any()
// @ts-expect-error
Assert.exact.of(a)($a)
Assert.on($a).exact.of(a)
// @ts-expect-error
Assert.exact.of(a).as<$a>()
Assert.onAs<$a>().exact.of(a)

//
//
// ━━━━━━━━━━━━━━ • exact - unknown
//
//
Assert.exact.unknown($u)
Assert.on($u).exact.unknown()
// @ts-expect-error
Assert.exact.unknown(a)
Assert.on(a).exact.unknown()
// @ts-expect-error
Assert.exact.of(a)($u)
Assert.on($u).exact.of(a)
// @ts-expect-error
Assert.exact.of(a).as<$u>()
Assert.onAs<$u>().exact.of(a)

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

Assert /* default */.exact.of([a]).as<[a]>()
Assert.setInfer('auto').exact.of([a]).as<[a]>()
Assert.setInfer('narrow').exact.of([a]).as<readonly [a]>()
Assert.setInfer('wide').exact.of([a]).as<a[]>()

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
  Assert.equiv.noExcess<{ id: string }, { id: string }>,
  Assert.equiv.noExcess<{ a: number } & {}, { a: number }>
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
  Assert.sub.noExcess<{ id: string }, { id: string }>,
  Assert.sub.noExcess<{ a: number }, { a: 42 }>
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
  Assert.exact.of<BaseKeys | 'awaited',                                                                                                   keyof ReturnType<typeof Assert.on<Promise<number>>>>,                           // Promise - only awaited available
  Assert.exact.of<BaseKeys | 'returned' | 'parameters' | 'parameter1' | 'parameter2' | 'parameter3' | 'parameter4' | 'parameter5',       keyof ReturnType<typeof Assert.on<() => number>>>,                              // Function - function extractors only
  Assert.exact.of<BaseKeys | 'array',                                                                                                     keyof ReturnType<typeof Assert.on<number[]>>>,                                   // Array - only array available
  Assert.exact.of<BaseKeys,                                                                                                               keyof ReturnType<typeof Assert.on<string>>>,                                     // Primitives - no extractors, only base keys
  Assert.exact.of<BaseKeys | 'awaited',                                                                                                   keyof ReturnType<typeof Assert.on<Promise<number[]>>>>,                          // Chaining - Promise<Array> before awaited
  Assert.exact.of<BaseKeys | 'array',                                                                                                     keyof ReturnType<typeof Assert.on<Promise<number[]>>>['awaited']>,               // Chaining - Promise<Array> after awaited
  Assert.exact.of<BaseKeys | 'awaited',                                                                                                   keyof ReturnType<typeof Assert.on<Promise<() => number>>>>,                      // Chaining - Promise<Function> before awaited
  Assert.exact.of<BaseKeys | 'returned' | 'parameters' | 'parameter1' | 'parameter2' | 'parameter3' | 'parameter4' | 'parameter5',       keyof ReturnType<typeof Assert.on<Promise<() => number>>>['awaited']>,           // Chaining - Promise<Function> after awaited
  Assert.exact.of<BaseKeys | AllExtractors,                                                                                               keyof ReturnType<typeof Assert.on<any>>>,                                        // any - all extractors available
  Assert.exact.of<BaseKeys | AllExtractors,                                                                                               keyof ReturnType<typeof Assert.on<unknown>>>,                                    // unknown - all extractors available
]
