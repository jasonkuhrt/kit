import { test } from 'vitest'

/**
 * Type-level tests for the Even module
 */

import { Ts } from '#ts'
import type { Int } from '../int/$$.js'
import type { Even } from './$$.js'
import { from as even, is as isEven, next as nextEven, prev as prevEven, tryFrom as tryEven } from './$$.js'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly with isEven predicate', () => {
  const value: unknown = 4

  // Predicate narrows to Even & Int intersection
  if (isEven(value)) {
    Ts.Test.sub.is<Even & Int>()(value)
    // Can assign to Even
    Ts.Test.sub.is<Even>()(value)
    // Can assign to Int
    Ts.Test.sub.is<Int>()(value)
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
  Ts.Test.exact.is<Even & Int>()(even1)

  // Negative even numbers
  const even2 = even(-2)
  Ts.Test.exact.is<Even & Int>()(even2)

  // Zero is even
  const even3 = even(0)
  Ts.Test.exact.is<Even & Int>()(even3)

  // Try constructor
  const try1 = tryEven(6)
  Ts.Test.exact.is<(Even & Int) | null>()(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Ts.Test.exact.is<Even & Int>()(try1)
  }

  // Next/prev even operations
  const next = nextEven(3.5) // Should be 4
  Ts.Test.exact.is<Even & Int>()(next)

  const prev = prevEven(5.5) // Should be 4
  Ts.Test.exact.is<Even & Int>()(prev)
})

// === Type Relationships ===

test('Even has correct relationship with Int', () => {
  const evenNum: Even & Int = even(4)

  // Even & Int can be assigned to Even
  const asEven: Even = evenNum
  Ts.Test.sub.is<Even>()(asEven)

  // Even & Int can be assigned to Int
  const asInt: Int = evenNum
  Ts.Test.sub.is<Int>()(asInt)

  // Even & Int can be assigned to number
  const asNumber: number = evenNum
  Ts.Test.sub.is<number>()(asNumber)

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
type _EvenRelationships = Ts.Test.Cases<
  // Even extends number
  Ts.Test.sub<number, Even>,
  // Int extends number
  Ts.Test.sub<number, Int>,
  // Even & Int extends both Even and Int
  Ts.Test.sub<Even, Even & Int>,
  Ts.Test.sub<Int, Even & Int>,
  Ts.Test.sub<number, Even & Int>,
  // Even does not extend Int (not all Even are Int in type system)
  Ts.Test.not.sub<Even, Int>,
  // Int does not extend Even (not all Int are Even)
  Ts.Test.not.sub<Int, Even>,
  // Even & Int is more specific than either alone
  Ts.Test.not.sub<Even & Int, Even>,
  Ts.Test.not.sub<Even & Int, Int>
>

// Test constructor return types
type _ConstructorReturnTypes = Ts.Test.Cases<
  // All constructors return the intersection type
  Ts.Test.exact<ReturnType<typeof even>, Even & Int>,
  Ts.Test.exact<ReturnType<typeof tryEven>, (Even & Int) | null>,
  Ts.Test.exact<ReturnType<typeof nextEven>, Even & Int>,
  Ts.Test.exact<ReturnType<typeof prevEven>, Even & Int>
>

// Test predicate return type
type _PredicateTypes = Ts.Test.Cases<
  // isEven narrows to the intersection
  Ts.Test.sub<(value: unknown) => value is Even & Int, typeof isEven>
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
