import { Ts } from '#ts'
import { Ref } from './$.js'

//
// ─── Ref.is ───────────────────────────────────────────────────────────────
//

declare const obj1: { a: 1 }
declare const obj2: { a: 1 }
Ts.assert<boolean>()(Ref.is(obj1, obj2))
Ts.assert<boolean>()(Ref.is(obj1, obj1))

declare const arr1: number[]
declare const arr2: number[]
Ts.assert<boolean>()(Ref.is(arr1, arr2))
Ts.assert<boolean>()(Ref.is(arr1, arr1))

declare const fn1: () => void
declare const fn2: () => void
Ts.assert<boolean>()(Ref.is(fn1, fn2))
Ts.assert<boolean>()(Ref.is(fn1, fn1))

// Union types with reference types
Ts.assert<boolean>()(Ref.is([] as [] | { a: 1 }, {} as { a: 1 } | []))

// Comparing identical object types is valid (different instances)
declare const sameTypeObj1: { a: 1 }
declare const sameTypeObj2: { a: 1 }
Ts.assert<boolean>()(Ref.is(sameTypeObj1, sameTypeObj2))

//
// ─── Ref.isOn ─────────────────────────────────────────────────────────────
//

const isSameObj = Ref.isOn(obj1)
Ts.assert<(b: typeof obj1) => boolean>()(isSameObj)
Ts.assert<boolean>()(isSameObj(obj1))
Ts.assert<boolean>()(isSameObj(obj2))

//
// ─── Ref.isnt & Ref.isntOn ────────────────────────────────────────────────
//

Ts.assert<boolean>()(Ref.isnt(obj1, obj2))

const isntArr1 = Ref.isntOn(arr1)
Ts.assert<(b: typeof arr1) => boolean>()(isntArr1)
Ts.assert<boolean>()(isntArr1(arr1))
Ts.assert<boolean>()(isntArr1(arr2))

//
// ─── Ref.canDiffer & Ref.isImmutable ──────────────────────────────────────
//

declare const value: 1 | object

if (Ref.isReferenceEquality(value)) {
  // Should be narrowed to object
  Ts.assert<object>()(value)
  // Can use Ref operations on it
  Ts.assert<boolean>()(Ref.is(value, value))
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
  Ts.assert<object>()(value)
  Ts.assert<boolean>()(Ref.is(value, value))
}

//
// ─── Invalid Usage (Type Errors) ──────────────────────────────────────────
//

type a = { a: '1' }
type b = { a: '2' }
declare const a: a
declare const b: b

type _ = Ts.Test<
  // Test that primitives produce ErrorPrimitiveType
  //
  Ts.AssertParameters<[Ref.ErrorPrimitiveType<1>, Ref.ErrorNotComparableSamePrimitive<1>], typeof Ref.is<1, 1>>,
  Ts.AssertParameters<[Ref.ErrorPrimitiveType<'a'>, Ref.ErrorNotComparableOverlap<'a', 'b'>], typeof Ref.is<'a', 'b'>>,
  Ts.AssertParameters<[Ref.ErrorPrimitiveType<true>], typeof Ref.isOn<true>>,
  // Test that no overlap produces ErrorNoOverlap
  Ts.AssertParameters<
    [typeof a, Ref.ErrorNotComparableOverlap<a, b>],
    typeof Ref.is<a, b>
  >
>
