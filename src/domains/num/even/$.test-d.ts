/**
 * Type-level tests for the Even module
 */

import { Ts } from '#ts'
import type { Int } from '../int/$$.js'
import type { Even } from './$$.js'
import { from as even, is as isEven, next as nextEven, prev as prevEven, tryFrom as tryEven } from './$$.js'

// === Type Narrowing with Predicates ===

Ts.test('Type narrowing works correctly with isEven predicate', () => {
  const value: unknown = 4

  // Predicate narrows to Even & Int intersection
  if (isEven(value)) {
    Ts.assert<Even & Int>()(value)
    // Can assign to Even
    Ts.assert<Even>()(value)
    // Can assign to Int
    Ts.assert<Int>()(value)
  }

  // Multiple checks preserve all brands
  const _narrowed = (v: unknown): void => {
    if (isEven(v)) {
      // v has both Even and Int brands
      const _e: Even = v
      const _i: Int = v
      const _ei: Even & Int = v
    }
  }
})

// === Constructor Functions ===

Ts.test('Constructor functions produce correctly branded types', () => {
  // Basic even constructor always returns Even & Int
  const even1 = even(4)
  Ts.assert<Even & Int>()(even1)

  // Negative even numbers
  const even2 = even(-2)
  Ts.assert<Even & Int>()(even2)

  // Zero is even
  const even3 = even(0)
  Ts.assert<Even & Int>()(even3)

  // Try constructor
  const try1 = tryEven(6)
  Ts.assert<(Even & Int) | null>()(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Ts.assert<Even & Int>()(try1)
  }

  // Next/prev even operations
  const next = nextEven(3.5) // Should be 4
  Ts.assert<Even & Int>()(next)

  const prev = prevEven(5.5) // Should be 4
  Ts.assert<Even & Int>()(prev)
})

// === Type Relationships ===

Ts.test('Even has correct relationship with Int', () => {
  const evenNum: Even & Int = even(4)

  // Even & Int can be assigned to Even
  const asEven: Even = evenNum
  Ts.assert<Even>()(asEven)

  // Even & Int can be assigned to Int
  const asInt: Int = evenNum
  Ts.assert<Int>()(asInt)

  // Even & Int can be assigned to number
  const asNumber: number = evenNum
  Ts.assert<number>()(asNumber)

  // But Even alone cannot be assigned to Int (might not be integer)
  const justEven = {} as Even
  // This should work - Even can be assigned to number
  const _okNumber: number = justEven

  // And Int alone cannot be assigned to Even (might be odd)
  const justInt = {} as Int
  // @ts-expect-error - Int is not assignable to Even
  const _badEven: Even = justInt
})

// === Type-Level Only Tests ===

// Test brand relationships
type _EvenRelationships = Ts.Cases<
  // Even extends number
  Ts.Assert<number, Even>,
  // Int extends number
  Ts.Assert<number, Int>,
  // Even & Int extends both Even and Int
  Ts.AssertExtendsTyped<Even & Int, Even>,
  Ts.AssertExtendsTyped<Even & Int, Int>,
  Ts.AssertExtendsTyped<Even & Int, number>,
  // Even does not extend Int (not all Even are Int in type system)
  Ts.AssertNotExtends<Even, Int>,
  // Int does not extend Even (not all Int are Even)
  Ts.AssertNotExtends<Int, Even>,
  // Even & Int is more specific than either alone
  Ts.AssertNotExtends<Even, Even & Int>,
  Ts.AssertNotExtends<Int, Even & Int>
>

// Test constructor return types
type _ConstructorReturnTypes = Ts.Cases<
  // All constructors return the intersection type
  Ts.AssertExact<ReturnType<typeof even>, Even & Int>,
  Ts.AssertExact<ReturnType<typeof tryEven>, (Even & Int) | null>,
  Ts.AssertExact<ReturnType<typeof nextEven>, Even & Int>,
  Ts.AssertExact<ReturnType<typeof prevEven>, Even & Int>
>

// Test predicate return type
type _PredicateTypes = Ts.Cases<
  // isEven narrows to the intersection
  Ts.Assert<(value: unknown) => value is Even & Int, typeof isEven>
>

// Demonstrate intersection behavior
Ts.test('Even and Int form a proper intersection', () => {
  const evenInt: Even & Int = even(4)

  // Can use in contexts expecting Even
  const useEven = (_e: Even): void => {}
  useEven(evenInt)

  // Can use in contexts expecting Int
  const useInt = (_i: Int): void => {}
  useInt(evenInt)

  // Can use in contexts expecting both
  const useBoth = (_ei: Even & Int): void => {}
  useBoth(evenInt)

  // Cannot mix different brand combinations
  const justEven = {} as Even
  const justInt = {} as Int

  // @ts-expect-error - Even alone doesn't satisfy Even & Int
  useBoth(justEven)

  // @ts-expect-error - Int alone doesn't satisfy Even & Int
  useBoth(justInt)
})

// Test nominal typing
Ts.test('Even is nominal (brand-based), not structural', () => {
  // Even though 4 is even, it's not Even without the brand
  // @ts-expect-error - Cannot assign raw number to Even
  const _bad1: Even = 4

  // Even an Int that happens to be even isn't Even without the brand
  const int: Int = {} as Int
  // @ts-expect-error - Cannot assign Int to Even
  const _bad2: Even = int

  // Must use constructor to get proper type
  const _good: Even & Int = even(4)
})

// Test with other number brands
Ts.test('Even can combine with other number brands', () => {
  // Hypothetical: if we had Positive brand
  type Positive = number & { __positive: true }

  // We could have Even & Int & Positive
  type PositiveEvenInt = Even & Int & Positive

  // All relationships hold
  const pei = {} as PositiveEvenInt
  const _e: Even = pei
  const _i: Int = pei
  const _p: Positive = pei
  const _n: number = pei
})
