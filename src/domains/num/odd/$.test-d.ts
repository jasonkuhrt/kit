import { test } from 'vitest'

/**
 * Type-level tests for the Odd module
 */

import { Ts } from '#ts'
import type { Even } from '../even/$$.js'
import type { Int } from '../int/$$.js'
import type { Odd } from './$$.js'
import { from as odd, is as isOdd, next as nextOdd, prev as prevOdd, tryFrom as tryOdd } from './$$.js'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly with isOdd predicate', () => {
  const value: unknown = 5

  // Predicate narrows to Odd & Int intersection
  if (isOdd(value)) {
    Ts.Test.sub.is<Odd & Int>()(value)
    // Can assign to Odd
    Ts.Test.sub.is<Odd>()(value)
    // Can assign to Int
    Ts.Test.sub.is<Int>()(value)
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
  Ts.Test.exact.is<Odd & Int>()(odd1)

  // Negative odd numbers
  const odd2 = odd(-3)
  Ts.Test.exact.is<Odd & Int>()(odd2)

  // Large odd numbers
  const odd3 = odd(999)
  Ts.Test.exact.is<Odd & Int>()(odd3)

  // Try constructor
  const try1 = tryOdd(7)
  Ts.Test.exact.is<(Odd & Int) | null>()(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Ts.Test.exact.is<Odd & Int>()(try1)
  }

  // Next/prev odd operations
  const next = nextOdd(4.5) // Should be 5
  Ts.Test.exact.is<Odd & Int>()(next)

  const prev = prevOdd(6.5) // Should be 5
  Ts.Test.exact.is<Odd & Int>()(prev)
})

// === Type Relationships ===

test('Odd has correct relationship with Int and Even', () => {
  const oddNum: Odd & Int = odd(5)

  // Odd & Int can be assigned to Odd
  const asOdd: Odd = oddNum
  Ts.Test.sub.is<Odd>()(asOdd)

  // Odd & Int can be assigned to Int
  const asInt: Int = oddNum
  Ts.Test.sub.is<Int>()(asInt)

  // Odd & Int can be assigned to number
  const asNumber: number = oddNum
  Ts.Test.sub.is<number>()(asNumber)

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
type _OddRelationships = Ts.Test.Cases<
  // Odd extends number
  Ts.Test.sub<number, Odd>,
  // Int extends number
  Ts.Test.sub<number, Int>,
  // Odd & Int extends both Odd and Int
  Ts.Test.sub<Odd, Odd & Int>,
  Ts.Test.sub<Int, Odd & Int>,
  Ts.Test.sub<number, Odd & Int>,
  // Odd does not extend Int (not all Odd are Int in type system)
  Ts.Test.not.sub<Odd, Int>,
  // Int does not extend Odd (not all Int are Odd)
  Ts.Test.not.sub<Int, Odd>,
  // Odd & Int is more specific than either alone
  Ts.Test.not.sub<Odd & Int, Odd>,
  Ts.Test.not.sub<Odd & Int, Int>
>

// Test mutual exclusivity with Even
type _OddEvenExclusive = Ts.Test.Cases<
  // Odd and Even don't extend each other
  Ts.Test.not.sub<Odd, Even>,
  Ts.Test.not.sub<Even, Odd>
> // The intersection Odd & Even would be never in practice
// (though TypeScript won't reduce it to never automatically)

// Test constructor return types
type _ConstructorReturnTypes = Ts.Test.Cases<
  // All constructors return the intersection type
  Ts.Test.exact<ReturnType<typeof odd>, Odd & Int>,
  Ts.Test.exact<ReturnType<typeof tryOdd>, (Odd & Int) | null>,
  Ts.Test.exact<ReturnType<typeof nextOdd>, Odd & Int>,
  Ts.Test.exact<ReturnType<typeof prevOdd>, Odd & Int>
>

// Test predicate return type
type _PredicateTypes = Ts.Test.Cases<
  // isOdd narrows to the intersection
  Ts.Test.sub<(value: unknown) => value is Odd & Int, typeof isOdd>
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
