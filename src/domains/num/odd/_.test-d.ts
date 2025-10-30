import { test } from 'vitest'

/**
 * Type-level tests for the Odd module
 */

import { Ts } from '#ts'
import { Assert } from '#ts/ts'
import type { Even } from '../even/__.js'
import type { Int } from '../int/__.js'
import type { Odd } from './__.js'
import { from as odd, is as isOdd, next as nextOdd, prev as prevOdd, tryFrom as tryOdd } from './__.js'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly with isOdd predicate', () => {
  const value: unknown = 5

  // Predicate narrows to Odd & Int intersection
  if (isOdd(value)) {
    Assert.sub.ofAs<Odd & Int>().on(value)
    // Can assign to Odd
    Assert.sub.ofAs<Odd>().on(value)
    // Can assign to Int
    Assert.sub.ofAs<Int>().on(value)
  }

  // Multiple checks preserve all brands
  const _narrowed = (v: unknown): void => {
    if (isOdd(v)) {
      // v has both Odd and Int brands
      const _o: Odd = v
      const _i: Int = v
      const _oi: Odd & Int = v
    }
  }
})

// === Constructor Functions ===

test('Constructor functions produce correctly branded types', () => {
  // Basic odd constructor always returns Odd & Int
  const odd1 = odd(5)
  Assert.exact.ofAs<Odd & Int>().on(odd1)

  // Negative odd numbers
  const odd2 = odd(-3)
  Assert.exact.ofAs<Odd & Int>().on(odd2)

  // Large odd numbers
  const odd3 = odd(999)
  Assert.exact.ofAs<Odd & Int>().on(odd3)

  // Try constructor
  const try1 = tryOdd(7)
  Assert.exact.ofAs<(Odd & Int) | null>().on(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Assert.exact.ofAs<Odd & Int>().on(try1)
  }

  // Next/prev odd operations
  const next = nextOdd(4.5) // Should be 5
  Assert.exact.ofAs<Odd & Int>().on(next)

  const prev = prevOdd(6.5) // Should be 5
  Assert.exact.ofAs<Odd & Int>().on(prev)
})

// === Type Relationships ===

test('Odd has correct relationship with Int and Even', () => {
  const oddNum: Odd & Int = odd(5)

  // Odd & Int can be assigned to Odd
  const asOdd: Odd = oddNum
  Assert.sub.ofAs<Odd>().on(asOdd)

  // Odd & Int can be assigned to Int
  const asInt: Int = oddNum
  Assert.sub.ofAs<Int>().on(asInt)

  // Odd & Int can be assigned to number
  const asNumber: number = oddNum
  Assert.sub.ofAs<number>().on(asNumber)

  // Odd and Even are mutually exclusive
  const _oddVal = {} as Odd
  const _evenVal = {} as Even

  // @ts-expect-error - Odd is not assignable to Even
  const _bad1: Even = _oddVal

  // @ts-expect-error - Even is not assignable to Odd
  const _bad2: Odd = _evenVal
})

// === Type-Level Only Tests ===

// Test brand relationships
type _OddRelationships = Ts.Assert.Cases<
  // Odd extends number
  Assert.sub.of<number, Odd>,
  // Int extends number
  Assert.sub.of<number, Int>,
  // Odd & Int extends both Odd and Int
  Assert.sub.of<Odd, Odd & Int>,
  Assert.sub.of<Int, Odd & Int>,
  Assert.sub.of<number, Odd & Int>,
  // Odd does not extend Int (not all Odd are Int in type system)
  Ts.Assert.not.sub<Odd, Int>,
  // Int does not extend Odd (not all Int are Odd)
  Ts.Assert.not.sub<Int, Odd>,
  // Odd & Int is more specific than either alone
  Ts.Assert.not.sub<Odd & Int, Odd>,
  Ts.Assert.not.sub<Odd & Int, Int>
>

// Test mutual exclusivity with Even
type _OddEvenExclusive = Ts.Assert.Cases<
  // Odd and Even don't extend each other
  Ts.Assert.not.sub<Odd, Even>,
  Ts.Assert.not.sub<Even, Odd>
> // The intersection Odd & Even would be never in practice
// (though TypeScript won't reduce it to never automatically)

// Test constructor return types
type _ConstructorReturnTypes = Ts.Assert.Cases<
  // All constructors return the intersection type
  Assert.exact.of<ReturnType<typeof odd>, Odd & Int>,
  Assert.exact.of<ReturnType<typeof tryOdd>, (Odd & Int) | null>,
  Assert.exact.of<ReturnType<typeof nextOdd>, Odd & Int>,
  Assert.exact.of<ReturnType<typeof prevOdd>, Odd & Int>
>

// Test predicate return type
type _PredicateTypes = Ts.Assert.Cases<
  // isOdd narrows to the intersection
  Assert.sub.of<(value: unknown) => value is Odd & Int, typeof isOdd>
>

// Demonstrate intersection behavior
test('Odd and Int form a proper intersection', () => {
  const oddInt: Odd & Int = odd(5)

  // Can use in contexts expecting Odd
  const useOdd = (_o: Odd): void => {}
  useOdd(oddInt)

  // Can use in contexts expecting Int
  const useInt = (_i: Int): void => {}
  useInt(oddInt)

  // Can use in contexts expecting both
  const useBoth = (_oi: Odd & Int): void => {}
  useBoth(oddInt)

  // Cannot mix different brand combinations
  const _justOdd = {} as Odd
  const _justInt = {} as Int

  // @ts-expect-error - Odd alone doesn't satisfy Odd & Int
  useBoth(_justOdd)

  // @ts-expect-error - Int alone doesn't satisfy Odd & Int
  useBoth(_justInt)
})

// Test nominal typing
test('Odd is nominal (brand-based), not structural', () => {
  // Even though 5 is odd, it's not Odd without the brand
  // @ts-expect-error - Cannot assign raw number to Odd
  const _bad1: Odd = 5

  // Even an Int that happens to be odd isn't Odd without the brand
  const _int: Int = {} as Int
  // @ts-expect-error - Cannot assign Int to Odd
  const _bad2: Odd = _int

  // Must use constructor to get proper type
  const _good: Odd & Int = odd(5)
})

// Test practical impossibility of Odd & Even
test('Odd & Even intersection is effectively never', () => {
  // This would be a number that is both odd and even - impossible!
  type ImpossibleNumber = Odd & Even & Int

  // TypeScript doesn't reduce it to never, but it's impossible to construct
  const _attemptConstruct = (_n: number): void => {
    // Can't satisfy both predicates
    // if (isOdd(n) && isEven(n)) {
    //   // This block will never execute
    //   const impossible: ImpossibleNumber = n
    // }
  }

  // The type system allows the intersection syntactically
  type _syntacticallyValid = ImpossibleNumber

  // But no runtime value can satisfy it
})

// Test with other number brands
test('Odd can combine with other number brands', () => {
  // Hypothetical: if we had Positive brand
  type Positive = number & { __positive: true }

  // We could have Odd & Int & Positive (positive odd integer)
  type PositiveOddInt = Odd & Int & Positive

  // All relationships hold
  const poi = {} as PositiveOddInt
  const _o: Odd = poi
  const _i: Int = poi
  const _p: Positive = poi
  const _n: number = poi
})
