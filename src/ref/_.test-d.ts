import { Type as A } from '#assert/assert'
import { Ref } from './_.js'

//
// ─── Ref.is ───────────────────────────────────────────────────────────────
//

declare const obj1: { a: 1 }
declare const obj2: { a: 1 }
A.sub.ofAs<boolean>().on(Ref.is(obj1, obj2))
A.sub.ofAs<boolean>().on(Ref.is(obj1, obj1))

declare const arr1: number[]
declare const arr2: number[]
A.sub.ofAs<boolean>().on(Ref.is(arr1, arr2))
A.sub.ofAs<boolean>().on(Ref.is(arr1, arr1))

declare const fn1: () => void
declare const fn2: () => void
A.sub.ofAs<boolean>().on(Ref.is(fn1, fn2))
A.sub.ofAs<boolean>().on(Ref.is(fn1, fn1))

// Union types with reference types
A.sub.ofAs<boolean>().on(Ref.is([] as [] | { a: 1 }, {} as { a: 1 } | []))

// Comparing identical object types is valid (different instances)
declare const sameTypeObj1: { a: 1 }
declare const sameTypeObj2: { a: 1 }
A.sub.ofAs<boolean>().on(Ref.is(sameTypeObj1, sameTypeObj2))

//
// ─── Ref.isOn ─────────────────────────────────────────────────────────────
//

const isSameObj = Ref.isOn(obj1)
A.sub.ofAs<(b: typeof obj1) => boolean>().on(isSameObj)
A.sub.ofAs<boolean>().on(isSameObj(obj1))
A.sub.ofAs<boolean>().on(isSameObj(obj2))

//
// ─── Ref.isnt & Ref.isntOn ────────────────────────────────────────────────
//

A.sub.ofAs<boolean>().on(Ref.isnt(obj1, obj2))

const isntArr1 = Ref.isntOn(arr1)
A.sub.ofAs<(b: typeof arr1) => boolean>().on(isntArr1)
A.sub.ofAs<boolean>().on(isntArr1(arr1))
A.sub.ofAs<boolean>().on(isntArr1(arr2))

//
// ─── Ref.canDiffer & Ref.isImmutable ──────────────────────────────────────
//

declare const value: 1 | object

if (Ref.isReferenceEquality(value)) {
  // Should be narrowed to object
  A.sub.ofAs<object>().on(value)
  // Can use Ref operations on it
  A.sub.ofAs<boolean>().on(Ref.is(value, value))
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
  A.sub.ofAs<object>().on(value)
  A.sub.ofAs<boolean>().on(Ref.is(value, value))
}

//
// ─── Invalid Usage (Type Errors) ──────────────────────────────────────────
//

type a = { a: '1' }
type b = { a: '2' }
declare const a: a
declare const b: b

// Test that primitives produce ErrorPrimitiveType
type _1 = A.parameters.exact<
  [Ref.ErrorPrimitiveType<1>, Ref.ErrorNotComparableSamePrimitive<1>],
  typeof Ref.is<1, 1>
>
type _2 = A.parameters.exact<
  [Ref.ErrorPrimitiveType<'a'>, Ref.ErrorNotComparableOverlap<'a', 'b'>],
  typeof Ref.is<'a', 'b'>
>
type _3 = A.parameters.exact<[Ref.ErrorPrimitiveType<true>], typeof Ref.isOn<true>>

// Test that no overlap produces ErrorNoOverlap
type _4 = A.parameters.exact<[typeof a, Ref.ErrorNotComparableOverlap<a, b>], typeof Ref.is<a, b>>
