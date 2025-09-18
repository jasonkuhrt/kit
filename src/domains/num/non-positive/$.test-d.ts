/**
 * Type-level tests for the NonPositive module
 */

import { Ts } from '#ts'
import type { Negative } from '../negative/$$.js'
import type { Positive } from '../positive/$$.js'
import type { Zero } from '../zero/$$.js'
import type { NonPositive } from './$$.js'
import { from as nonPositive, is as isNonPositive, tryFrom as tryNonPositive } from './$$.js'

// === Type Narrowing with Predicates ===

Ts.test('Type narrowing works correctly with isNonPositive predicate', () => {
  const value: unknown = -5

  // Predicate narrows to NonPositive type
  if (isNonPositive(value)) {
    Ts.assert<NonPositive>()(value)
  }

  // Works with zero and negative values
  const _narrowed = (v: unknown): void => {
    if (isNonPositive(v)) {
      const _np: NonPositive = v
      // Also assignable to number
      const _n: number = v
    }
  }
})

// === Constructor Functions ===

Ts.test('Constructor functions produce correctly branded types', () => {
  // Basic non-positive constructor
  const np1 = nonPositive(-5)
  Ts.assert<NonPositive>()(np1)

  // Zero is non-positive
  const np2 = nonPositive(0)
  Ts.assert<NonPositive>()(np2)

  // Large negative values
  const np3 = nonPositive(-1000)
  Ts.assert<NonPositive>()(np3)

  // Small negative values
  const np4 = nonPositive(-0.001)
  Ts.assert<NonPositive>()(np4)

  // Try constructor
  const try1 = tryNonPositive(-42)
  Ts.assert<NonPositive | null>()(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Ts.assert<NonPositive>()(try1)
  }

  // Try with positive returns null
  const try2 = tryNonPositive(1)
  Ts.assert<NonPositive | null>()(try2)
})

// === Type Relationships ===

Ts.test('NonPositive has correct relationships with other sign brands', () => {
  const npVal: NonPositive = nonPositive(-5)

  // NonPositive can be assigned to number
  const asNumber: number = npVal
  Ts.assert<number>()(asNumber)

  // NonPositive and Positive are mutually exclusive
  const _posVal = {} as Positive
  // @ts-expect-error - NonPositive is not assignable to Positive
  const _bad1: Positive = npVal

  // @ts-expect-error - Positive is not assignable to NonPositive
  const _bad2: NonPositive = _posVal

  // Zero is both NonPositive and can coexist with Zero brand
  const _zeroVal = {} as Zero
  // Zero satisfies NonPositive (0 <= 0)
  const npZero = {} as NonPositive & Zero
  const _np: NonPositive = npZero
  const _z: Zero = npZero

  // Negative and NonPositive are separate brands
  const _negVal = {} as Negative
  // They don't have a subtype relationship at the type level
  // @ts-expect-error - Negative is not assignable to NonPositive (different brands)
  const _npFromNeg: NonPositive = _negVal
})

// === Type-Level Only Tests ===

// Test brand relationships
type _NonPositiveRelationships = Ts.Cases<
  // NonPositive extends number
  Ts.Assert<number, NonPositive>,
  // number does not extend NonPositive
  Ts.AssertNotExtends<number, NonPositive>,
  // NonPositive and Positive are mutually exclusive
  Ts.AssertNotExtends<NonPositive, Positive>,
  Ts.AssertNotExtends<Positive, NonPositive>,
  // Negative and NonPositive are separate brands (no subtype relationship)
  Ts.AssertNotExtends<NonPositive, Negative>,
  Ts.AssertNotExtends<Negative, NonPositive>,
  // Zero and NonPositive are separate brands (no subtype relationship)
  Ts.AssertNotExtends<NonPositive, Zero>,
  Ts.AssertNotExtends<Zero, NonPositive>,
  // NonPositive does not extend Negative (includes zero)
  Ts.AssertNotExtends<NonPositive, Negative>,
  // NonPositive does not extend Zero (includes negatives)
  Ts.AssertNotExtends<NonPositive, Zero>
>

// Test constructor return types
type _ConstructorReturnTypes = Ts.Cases<
  Ts.AssertExact<ReturnType<typeof nonPositive>, NonPositive>,
  Ts.AssertExact<ReturnType<typeof tryNonPositive>, NonPositive | null>
>

// Test the conceptual nature of NonPositive
type _NonPositiveConceptual = Ts.Cases<
  // NonPositive conceptually includes negative and zero values
  // But at the type level, they are separate brands
  Ts.AssertNotExtends<Negative, NonPositive>,
  Ts.AssertNotExtends<Zero, NonPositive>,
  // NonPositive is its own brand, not literally Negative | Zero
  Ts.AssertNotExtends<NonPositive, Negative | Zero>
>

// Demonstrate type safety with NonPositive
Ts.test('NonPositive enables specific numeric constraints', () => {
  // Function that only accepts non-positive values
  const processNonPositive = (value: NonPositive): string => {
    // We know value <= 0
    if (value === 0) return 'zero'
    return 'negative'
  }

  // Must validate before calling
  const value = -5
  const np = nonPositive(value)
  const result = processNonPositive(np)
  Ts.assert<string>()(result)

  // Cannot pass positive values
  // @ts-expect-error - Cannot assign positive number to NonPositive
  const _err = processNonPositive(1)
})

// Test nominal typing
Ts.test('NonPositive is nominal (brand-based), not structural', () => {
  // Even though -5 is non-positive, it's not NonPositive without the brand
  // @ts-expect-error - Cannot assign raw number to NonPositive
  const _bad1: NonPositive = -5

  // Even though 0 is non-positive, it needs the brand
  // @ts-expect-error - Cannot assign raw number to NonPositive
  const _bad2: NonPositive = 0

  // Must use constructor to get proper type
  const _good: NonPositive = nonPositive(-5)
})

// Test practical use cases
Ts.test('NonPositive practical examples', () => {
  // Temperature below or at freezing
  type FreezingOrBelow = NonPositive & { unit: 'celsius' }

  const _checkFreezing = (temp: number): FreezingOrBelow | null => {
    const np = tryNonPositive(temp)
    if (np === null) return null
    return np as FreezingOrBelow
  }

  // Debt or zero balance
  type DebtOrZero = NonPositive

  const recordDebt = (_amount: DebtOrZero): void => {
    // Safe to process as debt or zero balance
  }

  // Usage with validation
  const amount = -100
  const debt = nonPositive(amount)
  recordDebt(debt)
})

// Test combinations with other brands
Ts.test('NonPositive can combine with other number brands', () => {
  type Int = number & { __int: true }
  type Finite = number & { __finite: true }

  // Non-positive integer (0, -1, -2, ...)
  type NonPositiveInt = NonPositive & Int

  // Finite non-positive number
  type FiniteNonPositive = NonPositive & Finite

  // All relationships hold
  const npi = {} as NonPositiveInt
  const _np1: NonPositive = npi
  const _i: Int = npi
  const _n1: number = npi

  const fnp = {} as FiniteNonPositive
  const _np2: NonPositive = fnp
  const _f: Finite = fnp
  const _n2: number = fnp
})
