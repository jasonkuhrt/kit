/**
 * Type-level tests for the Odd module
 */

import { Ts } from '#ts'
import type { Even } from '../even/$$.ts'
import type { Int } from '../int/$$.ts'
import type { Odd } from './$$.ts'
import { from as odd, is as isOdd, next as nextOdd, prev as prevOdd, tryFrom as tryOdd } from './$$.ts'

// === Type Narrowing with Predicates ===

Ts.test('Type narrowing works correctly with isOdd predicate', () => {
  const value: unknown = 5

  // Predicate narrows to Odd & Int intersection
  if (isOdd(value)) {
    Ts.assert<Odd & Int>()(value)
    // Can assign to Odd
    Ts.assert<Odd>()(value)
    // Can assign to Int
    Ts.assert<Int>()(value)
  }

  // Multiple checks preserve all brands
  const narrowed = (v: unknown): void => {
    if (isOdd(v)) {
      // v has both Odd and Int brands
      const _o: Odd = v
      const _i: Int = v
      const _oi: Odd & Int = v
    }
  }
})

// === Constructor Functions ===

Ts.test('Constructor functions produce correctly branded types', () => {
  // Basic odd constructor always returns Odd & Int
  const odd1 = odd(5)
  Ts.assert<Odd & Int>()(odd1)

  // Negative odd numbers
  const odd2 = odd(-3)
  Ts.assert<Odd & Int>()(odd2)

  // Large odd numbers
  const odd3 = odd(999)
  Ts.assert<Odd & Int>()(odd3)

  // Try constructor
  const try1 = tryOdd(7)
  Ts.assert<(Odd & Int) | null>()(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Ts.assert<Odd & Int>()(try1)
  }

  // Next/prev odd operations
  const next = nextOdd(4.5) // Should be 5
  Ts.assert<Odd & Int>()(next)

  const prev = prevOdd(6.5) // Should be 5
  Ts.assert<Odd & Int>()(prev)
})

// === Type Relationships ===

Ts.test('Odd has correct relationship with Int and Even', () => {
  const oddNum: Odd & Int = odd(5)

  // Odd & Int can be assigned to Odd
  const asOdd: Odd = oddNum
  Ts.assert<Odd>()(asOdd)

  // Odd & Int can be assigned to Int
  const asInt: Int = oddNum
  Ts.assert<Int>()(asInt)

  // Odd & Int can be assigned to number
  const asNumber: number = oddNum
  Ts.assert<number>()(asNumber)

  // Odd and Even are mutually exclusive
  const oddVal = {} as Odd
  const evenVal = {} as Even

  // @ts-expect-error - Odd is not assignable to Even
  const _bad1: Even = oddVal

  // @ts-expect-error - Even is not assignable to Odd
  const _bad2: Odd = evenVal
})

// === Type-Level Only Tests ===

// Test brand relationships
type _OddRelationships = Ts.TestSuite<[
  // Odd extends number
  Ts.Assert<number, Odd>,

  // Int extends number
  Ts.Assert<number, Int>,

  // Odd & Int extends both Odd and Int
  Ts.AssertExtendsTyped<Odd & Int, Odd>,
  Ts.AssertExtendsTyped<Odd & Int, Int>,
  Ts.AssertExtendsTyped<Odd & Int, number>,

  // Odd does not extend Int (not all Odd are Int in type system)
  Ts.AssertNotExtends<Odd, Int>,

  // Int does not extend Odd (not all Int are Odd)
  Ts.AssertNotExtends<Int, Odd>,

  // Odd & Int is more specific than either alone
  Ts.AssertNotExtends<Odd, Odd & Int>,
  Ts.AssertNotExtends<Int, Odd & Int>,
]>

// Test mutual exclusivity with Even
type _OddEvenExclusive = Ts.TestSuite<[
  // Odd and Even don't extend each other
  Ts.AssertNotExtends<Odd, Even>,
  Ts.AssertNotExtends<Even, Odd>,
  // The intersection Odd & Even would be never in practice
  // (though TypeScript won't reduce it to never automatically)
]>

// Test constructor return types
type _ConstructorReturnTypes = Ts.TestSuite<[
  // All constructors return the intersection type
  Ts.AssertExact<ReturnType<typeof odd>, Odd & Int>,
  Ts.AssertExact<ReturnType<typeof tryOdd>, (Odd & Int) | null>,
  Ts.AssertExact<ReturnType<typeof nextOdd>, Odd & Int>,
  Ts.AssertExact<ReturnType<typeof prevOdd>, Odd & Int>,
]>

// Test predicate return type
type _PredicateTypes = Ts.TestSuite<[
  // isOdd narrows to the intersection
  Ts.Assert<(value: unknown) => value is Odd & Int, typeof isOdd>,
]>

// Demonstrate intersection behavior
Ts.test('Odd and Int form a proper intersection', () => {
  const oddInt: Odd & Int = odd(5)

  // Can use in contexts expecting Odd
  const useOdd = (o: Odd): void => {}
  useOdd(oddInt)

  // Can use in contexts expecting Int
  const useInt = (i: Int): void => {}
  useInt(oddInt)

  // Can use in contexts expecting both
  const useBoth = (oi: Odd & Int): void => {}
  useBoth(oddInt)

  // Cannot mix different brand combinations
  const justOdd = {} as Odd
  const justInt = {} as Int

  // @ts-expect-error - Odd alone doesn't satisfy Odd & Int
  useBoth(justOdd)

  // @ts-expect-error - Int alone doesn't satisfy Odd & Int
  useBoth(justInt)
})

// Test nominal typing
Ts.test('Odd is nominal (brand-based), not structural', () => {
  // Even though 5 is odd, it's not Odd without the brand
  // @ts-expect-error - Cannot assign raw number to Odd
  const _bad1: Odd = 5

  // Even an Int that happens to be odd isn't Odd without the brand
  const int: Int = {} as Int
  // @ts-expect-error - Cannot assign Int to Odd
  const _bad2: Odd = int

  // Must use constructor to get proper type
  const good: Odd & Int = odd(5)
})

// Test practical impossibility of Odd & Even
Ts.test('Odd & Even intersection is effectively never', () => {
  // This would be a number that is both odd and even - impossible!
  type ImpossibleNumber = Odd & Even & Int

  // TypeScript doesn't reduce it to never, but it's impossible to construct
  const attemptConstruct = (n: number): void => {
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
Ts.test('Odd can combine with other number brands', () => {
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
