import { test } from 'vitest'

/**
 * Type-level tests for the InRange module
 */

import { Type as A } from '#assert/assert'
import { Ts } from '#ts'
import type { InRange } from './__.js'
import { clamp, clampWith, from as ranged, is as inRange, isWith as inRangeWith, tryFrom as tryRanged } from './__.js'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly with inRange predicate', () => {
  const value: unknown = 50

  // Single range check narrows type
  if (inRange(value, 0, 100)) {
    A.sub.ofAs<InRange<0, 100>>().on(value)
  }

  // Different ranges create different types
  if (inRange(value, -10, 10)) {
    A.sub.ofAs<InRange<-10, 10>>().on(value)
  }

  // Nested ranges
  if (inRange(value, 0, 100) && inRange(value, 25, 75)) {
    // Value is both InRange<0, 100> and InRange<25, 75>
    A.sub.ofAs<InRange<0, 100>>().on(value)
    A.sub.ofAs<InRange<25, 75>>().on(value)
  }
})

// === Constructor Functions ===

test('Constructor functions produce correctly branded types', () => {
  // Basic range constructor
  const ranged1 = ranged(50, 0, 100)
  A.sub.ofAs<InRange<0, 100>>().on(ranged1)

  // Negative range
  const ranged2 = ranged(-5, -10, 0)
  A.sub.ofAs<InRange<-10, 0>>().on(ranged2)

  // Decimal range
  const ranged3 = ranged(0.5, 0, 1)
  A.sub.ofAs<InRange<0, 1>>().on(ranged3)

  // Try constructor
  const try1 = tryRanged(50, 0, 100)
  A.sub.ofAs<InRange<0, 100> | null>().on(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    A.sub.ofAs<InRange<0, 100>>().on(try1)
  }
})

// === Clamp Operations ===

test('Clamp operations produce correctly branded types', () => {
  // Clamp always returns InRange type
  const clamped1 = clamp(150, 0, 100)
  A.sub.ofAs<InRange<0, 100>>().on(clamped1)

  const clamped2 = clamp(-20, -10, 10)
  A.sub.ofAs<InRange<-10, 10>>().on(clamped2)

  // Clamp with decimal bounds
  const clamped3 = clamp(2, 0, 1)
  A.sub.ofAs<InRange<0, 1>>().on(clamped3)

  // Clamp with same min/max
  const clamped4 = clamp(5, 42, 42)
  A.sub.ofAs<InRange<42, 42>>().on(clamped4)
})

// === Type-Level Only Tests ===

// Test that InRange types extend number
type _InRangeExtendsNumber = A.Cases<
  A.sub.of<number, InRange<0, 100>>,
  A.sub.of<number, InRange<-100, 100>>,
  A.sub.of<number, InRange<0, 1>>,
  A.sub.of<number, InRange<42, 42>>
>

// Test that different ranges are distinct types
test('Different ranges create distinct branded types', () => {
  const range1: InRange<0, 100> = ranged(50, 0, 100)
  const range2: InRange<0, 200> = ranged(50, 0, 200)

  // @ts-expect-error - Cannot assign InRange<0, 100> to InRange<0, 200>
  const _bad1: InRange<0, 200> = range1
  // @ts-expect-error - Cannot assign InRange<0, 200> to InRange<0, 100>
  const _bad2: InRange<0, 100> = range2
})

// Test type parameter constraints and relationships
type _RangeTypeParameters = A.Cases<
  // InRange with literal number parameters
  A.sub.of<InRange<0, 100>, InRange<0, 100>>,
  A.sub.of<InRange<-10, 10>, InRange<-10, 10>>,
  // InRange extends number
  A.sub.of<number, InRange<0, 100>>,
  A.sub.of<number, InRange<-50, 50>>,
  // Number does not extend specific InRange
  A.not.sub<InRange<0, 100>, number>
>

// Test clamp return type transformation
type _ClampReturnTypes = A.Cases<
  // Clamp always returns the target range type
  A.exact.of<ReturnType<typeof clamp<number, 0, 100>>, InRange<0, 100>>,
  A.exact.of<ReturnType<typeof clamp<number, -10, 10>>, InRange<-10, 10>>,
  // Input type doesn't affect output range
  A.exact.of<ReturnType<typeof clamp<InRange<0, 50>, 0, 100>>, InRange<0, 100>>
>

// Test curried function variants
type _CurriedFunctions = A.Cases<
  // inRangeWith returns a type predicate function
  A.sub.of<(value: unknown) => value is InRange<0, 100>, ReturnType<typeof inRangeWith<0, 100>>>,
  // clampWith returns a clamping function
  A.sub.of<
    <T extends number>(value: T) => InRange<0, 100>,
    ReturnType<typeof clampWith<0, 100>>
  >
>

// Test complex type parameter scenarios
type _ComplexTypeParameters = A.Cases<
  // Nested type parameters work correctly
  A.sub.of<InRange<0, 100>, InRange<0, 100>>,
  // Generic constraints can be applied
  A.sub.of<InRange<number, number>, InRange<0, 1>>
>

// Demonstrate that InRange types are nominal, not structural
test('InRange types are nominal (brand-based), not structural', () => {
  // Even though both are numbers in range 0-100, they have different brands
  const range1: InRange<0, 100> = ranged(50, 0, 100)
  // const range2: InRange<0, 100> = ranged(75, 0, 100)

  // Same range types are assignable
  const _ok: InRange<0, 100> = range1

  // But raw numbers are not assignable without constructor
  // @ts-expect-error - Cannot assign raw number to InRange
  const _bad: InRange<0, 100> = 50
})
