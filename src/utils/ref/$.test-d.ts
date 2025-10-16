import { Ts } from '#ts'
import { Ref } from './$.js'

//
// ─── Ref.is ───────────────────────────────────────────────────────────────
//

declare const obj1: { a: 1 }
declare const obj2: { a: 1 }
Ts.Test.sub.is<boolean>()(Ref.is(obj1, obj2))
Ts.Test.sub.is<boolean>()(Ref.is(obj1, obj1))

declare const arr1: number[]
declare const arr2: number[]
Ts.Test.sub.is<boolean>()(Ref.is(arr1, arr2))
Ts.Test.sub.is<boolean>()(Ref.is(arr1, arr1))

declare const fn1: () => void
declare const fn2: () => void
Ts.Test.sub.is<boolean>()(Ref.is(fn1, fn2))
Ts.Test.sub.is<boolean>()(Ref.is(fn1, fn1))

// Union types with reference types
Ts.Test.sub.is<boolean>()(Ref.is([] as [] | { a: 1 }, {} as { a: 1 } | []))

// Comparing identical object types is valid (different instances)
declare const sameTypeObj1: { a: 1 }
declare const sameTypeObj2: { a: 1 }
Ts.Test.sub.is<boolean>()(Ref.is(sameTypeObj1, sameTypeObj2))

//
// ─── Ref.isOn ─────────────────────────────────────────────────────────────
//

const isSameObj = Ref.isOn(obj1)
Ts.Test.sub.is<(b: typeof obj1) => boolean>()(isSameObj)
Ts.Test.sub.is<boolean>()(isSameObj(obj1))
Ts.Test.sub.is<boolean>()(isSameObj(obj2))

//
// ─── Ref.isnt & Ref.isntOn ────────────────────────────────────────────────
//

Ts.Test.sub.is<boolean>()(Ref.isnt(obj1, obj2))

const isntArr1 = Ref.isntOn(arr1)
Ts.Test.sub.is<(b: typeof arr1) => boolean>()(isntArr1)
Ts.Test.sub.is<boolean>()(isntArr1(arr1))
Ts.Test.sub.is<boolean>()(isntArr1(arr2))

//
// ─── Ref.canDiffer & Ref.isImmutable ──────────────────────────────────────
//

declare const value: 1 | object

if (Ref.isReferenceEquality(value)) {
  // Should be narrowed to object
  Ts.Test.sub.is<object>()(value)
  // Can use Ref operations on it
  Ts.Test.sub.is<boolean>()(Ref.is(value, value))
} else {
  // Should be narrowed to primitive (not object)
  // @ts-expect-error - Ref operations only work with reference types
  Ref.is(value, value)
}

// isImmutable is the inverse
if (Ref.isValueEquality(value)) {
  // Value is primitive
  // @ts-expect-error - Ref operations only work with reference types
  Ref.is(value, value)
} else {
  // Value is object, can use Ref
  Ts.Test.sub.is<object>()(value)
  Ts.Test.sub.is<boolean>()(Ref.is(value, value))
}

//
// ─── Invalid Usage (Type Errors) ──────────────────────────────────────────
//

type a = { a: '1' }
type b = { a: '2' }
declare const a: a
declare const b: b

// Test that primitives produce ErrorPrimitiveType
type _1 = Ts.Test.exact.parameters<[Ref.ErrorPrimitiveType<1>, Ref.ErrorNotComparableSamePrimitive<1>], typeof Ref.is<1, 1>>
type _2 = Ts.Test.exact.parameters<[Ref.ErrorPrimitiveType<'a'>, Ref.ErrorNotComparableOverlap<'a', 'b'>], typeof Ref.is<'a', 'b'>>
type _3 = Ts.Test.exact.parameters<[Ref.ErrorPrimitiveType<true>], typeof Ref.isOn<true>>

// Test that no overlap produces ErrorNoOverlap
type _4 = Ts.Test.exact.parameters<[typeof a, Ref.ErrorNotComparableOverlap<a, b>], typeof Ref.is<a, b>>
