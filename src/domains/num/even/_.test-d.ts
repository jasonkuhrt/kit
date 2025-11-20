import { test } from 'vitest'

/**
 * Type-level tests for the Even module
 */

import { Type as A } from '#assert/assert'
import { Ts } from '#ts'
import type { Int } from '../int/__.js'
import type { Even } from './__.js'
import { from as even, is as isEven, next as nextEven, prev as prevEven, tryFrom as tryEven } from './__.js'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly with isEven predicate', () => {
  const value: unknown = 4

  // Predicate narrows to Even & Int intersection
  if (isEven(value)) {
    A.sub.ofAs<Even & Int>().on(value)
    // Can assign to Even
    A.sub.ofAs<Even>().on(value)
    // Can assign to Int
    A.sub.ofAs<Int>().on(value)
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

test('Constructor functions produce correctly branded types', () => {
  // Basic even constructor always returns Even & Int
  const even1 = even(4)
  A.exact.ofAs<Even & Int>().on(even1)

  // Negative even numbers
  const even2 = even(-2)
  A.exact.ofAs<Even & Int>().on(even2)

  // Zero is even
  const even3 = even(0)
  A.exact.ofAs<Even & Int>().on(even3)

  // Try constructor
  const try1 = tryEven(6)
  A.exact.ofAs<(Even & Int) | null>().on(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    A.exact.ofAs<Even & Int>().on(try1)
  }

  // Next/prev even operations
  const next = nextEven(3.5) // Should be 4
  A.exact.ofAs<Even & Int>().on(next)

  const prev = prevEven(5.5) // Should be 4
  A.exact.ofAs<Even & Int>().on(prev)
})

// === Type Relationships ===

test('Even has correct relationship with Int', () => {
  const evenNum: Even & Int = even(4)

  // Even & Int can be assigned to Even
  const asEven: Even = evenNum
  A.sub.ofAs<Even>().on(asEven)

  // Even & Int can be assigned to Int
  const asInt: Int = evenNum
  A.sub.ofAs<Int>().on(asInt)

  // Even & Int can be assigned to number
  const asNumber: number = evenNum
  A.sub.ofAs<number>().on(asNumber)

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
type _EvenRelationships = A.Cases<
  // Even extends number
  A.sub.of<number, Even>,
  // Int extends number
  A.sub.of<number, Int>,
  // Even & Int extends both Even and Int
  A.sub.of<Even, Even & Int>,
  A.sub.of<Int, Even & Int>,
  A.sub.of<number, Even & Int>,
  // Even does not extend Int (not all Even are Int in type system)
  A.not.sub<Even, Int>,
  // Int does not extend Even (not all Int are Even)
  A.not.sub<Int, Even>,
  // Even & Int is more specific than either alone
  A.not.sub<Even & Int, Even>,
  A.not.sub<Even & Int, Int>
>

// Test constructor return types
type _ConstructorReturnTypes = A.Cases<
  // All constructors return the intersection type
  A.exact.of<ReturnType<typeof even>, Even & Int>,
  A.exact.of<ReturnType<typeof tryEven>, (Even & Int) | null>,
  A.exact.of<ReturnType<typeof nextEven>, Even & Int>,
  A.exact.of<ReturnType<typeof prevEven>, Even & Int>
>

// Test predicate return type
type _PredicateTypes = A.Cases<
  // isEven narrows to the intersection
  A.sub.of<(value: unknown) => value is Even & Int, typeof isEven>
>

// Demonstrate intersection behavior
test('Even and Int form a proper intersection', () => {
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
test('Even is nominal (brand-based), not structural', () => {
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
test('Even can combine with other number brands', () => {
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
