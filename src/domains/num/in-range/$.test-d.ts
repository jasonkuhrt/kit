/**
 * Type-level tests for the InRange module
 */

import { Ts } from '#ts'
import type { InRange } from './$$.js'
import { clamp, clampWith, from as ranged, is as inRange, isWith as inRangeWith, tryFrom as tryRanged } from './$$.js'

// === Type Narrowing with Predicates ===

Ts.test('Type narrowing works correctly with inRange predicate', () => {
  const value: unknown = 50

  // Single range check narrows type
  if (inRange(value, 0, 100)) {
    Ts.assert<InRange<0, 100>>()(value)
  }

  // Different ranges create different types
  if (inRange(value, -10, 10)) {
    Ts.assert<InRange<-10, 10>>()(value)
  }

  // Nested ranges
  if (inRange(value, 0, 100) && inRange(value, 25, 75)) {
    // Value is both InRange<0, 100> and InRange<25, 75>
    Ts.assert<InRange<0, 100>>()(value)
    Ts.assert<InRange<25, 75>>()(value)
  }
})

// === Constructor Functions ===

Ts.test('Constructor functions produce correctly branded types', () => {
  // Basic range constructor
  const ranged1 = ranged(50, 0, 100)
  Ts.assert<InRange<0, 100>>()(ranged1)

  // Negative range
  const ranged2 = ranged(-5, -10, 0)
  Ts.assert<InRange<-10, 0>>()(ranged2)

  // Decimal range
  const ranged3 = ranged(0.5, 0, 1)
  Ts.assert<InRange<0, 1>>()(ranged3)

  // Try constructor
  const try1 = tryRanged(50, 0, 100)
  Ts.assert<InRange<0, 100> | null>()(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Ts.assert<InRange<0, 100>>()(try1)
  }
})

// === Clamp Operations ===

Ts.test('Clamp operations produce correctly branded types', () => {
  // Clamp always returns InRange type
  const clamped1 = clamp(150, 0, 100)
  Ts.assert<InRange<0, 100>>()(clamped1)

  const clamped2 = clamp(-20, -10, 10)
  Ts.assert<InRange<-10, 10>>()(clamped2)

  // Clamp with decimal bounds
  const clamped3 = clamp(2, 0, 1)
  Ts.assert<InRange<0, 1>>()(clamped3)

  // Clamp with same min/max
  const clamped4 = clamp(5, 42, 42)
  Ts.assert<InRange<42, 42>>()(clamped4)
})

// === Type-Level Only Tests ===

// Test that InRange types extend number
type _InRangeExtendsNumber = Ts.Cases<
  Ts.Assert<number, InRange<0, 100>>,
  Ts.Assert<number, InRange<-100, 100>>,
  Ts.Assert<number, InRange<0, 1>>,
  Ts.Assert<number, InRange<42, 42>>
>

// Test that different ranges are distinct types
Ts.test('Different ranges create distinct branded types', () => {
  const range1: InRange<0, 100> = ranged(50, 0, 100)
  const range2: InRange<0, 200> = ranged(50, 0, 200)

  // @ts-expect-error - Cannot assign InRange<0, 100> to InRange<0, 200>
  const _bad1: InRange<0, 200> = range1
  // @ts-expect-error - Cannot assign InRange<0, 200> to InRange<0, 100>
  const _bad2: InRange<0, 100> = range2
})

// Test type parameter constraints and relationships
type _RangeTypeParameters = Ts.Cases<
  // InRange with literal number parameters
  Ts.Assert<InRange<0, 100>, InRange<0, 100>>,
  Ts.Assert<InRange<-10, 10>, InRange<-10, 10>>,
  // InRange extends number
  Ts.AssertExtendsTyped<InRange<0, 100>, number>,
  Ts.AssertExtendsTyped<InRange<-50, 50>, number>,
  // Number does not extend specific InRange
  Ts.AssertNotExtends<number, InRange<0, 100>>
>

// Test clamp return type transformation
type _ClampReturnTypes = Ts.Cases<
  // Clamp always returns the target range type
  Ts.AssertExact<ReturnType<typeof clamp<number, 0, 100>>, InRange<0, 100>>,
  Ts.AssertExact<ReturnType<typeof clamp<number, -10, 10>>, InRange<-10, 10>>,
  // Input type doesn't affect output range
  Ts.AssertExact<ReturnType<typeof clamp<InRange<0, 50>, 0, 100>>, InRange<0, 100>>
>

// Test curried function variants
type _CurriedFunctions = Ts.Cases<
  // inRangeWith returns a type predicate function
  Ts.Assert<(value: unknown) => value is InRange<0, 100>, ReturnType<typeof inRangeWith<0, 100>>>,
  // clampWith returns a clamping function
  Ts.Assert<
    <T extends number>(value: T) => InRange<0, 100>,
    ReturnType<typeof clampWith<0, 100>>
  >
>

// Test complex type parameter scenarios
type _ComplexTypeParameters = Ts.Cases<
  // Nested type parameters work correctly
  Ts.Assert<InRange<0, 100>, InRange<0, 100>>,
  // Generic constraints can be applied
  Ts.AssertExtendsTyped<InRange<0, 1>, InRange<number, number>>
>

// Demonstrate that InRange types are nominal, not structural
Ts.test('InRange types are nominal (brand-based), not structural', () => {
  // Even though both are numbers in range 0-100, they have different brands
  const range1: InRange<0, 100> = ranged(50, 0, 100)
  // const range2: InRange<0, 100> = ranged(75, 0, 100)

  // Same range types are assignable
  const _ok: InRange<0, 100> = range1

  // But raw numbers are not assignable without constructor
  // @ts-expect-error - Cannot assign raw number to InRange
  const _bad: InRange<0, 100> = 50
})
