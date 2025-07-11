/**
 * Type-level tests for the NonNegative module
 */

import { Ts } from '#ts'
import type { Negative } from '../negative/$$.ts'
import type { Positive } from '../positive/$$.ts'
import type { Zero } from '../zero/$$.ts'
import type { NonNegative } from './$$.ts'
import { from as nonNegative, is as isNonNegative, tryFrom as tryNonNegative } from './$$.ts'

// === Type Narrowing with Predicates ===

Ts.test('Type narrowing works correctly with isNonNegative predicate', () => {
  const value: unknown = 5

  // Predicate narrows to NonNegative type
  if (isNonNegative(value)) {
    Ts.assert<NonNegative>()(value)
  }

  // Works with zero and positive values
  const _narrowed = (v: unknown): void => {
    if (isNonNegative(v)) {
      const _nn: NonNegative = v
      // Also assignable to number
      const _n: number = v
    }
  }
})

// === Constructor Functions ===

Ts.test('Constructor functions produce correctly branded types', () => {
  // Basic non-negative constructor
  const nn1 = nonNegative(5)
  Ts.assert<NonNegative>()(nn1)

  // Zero is non-negative
  const nn2 = nonNegative(0)
  Ts.assert<NonNegative>()(nn2)

  // Large positive values
  const nn3 = nonNegative(1000)
  Ts.assert<NonNegative>()(nn3)

  // Small positive values
  const nn4 = nonNegative(0.001)
  Ts.assert<NonNegative>()(nn4)

  // Try constructor
  const try1 = tryNonNegative(42)
  Ts.assert<NonNegative | null>()(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Ts.assert<NonNegative>()(try1)
  }

  // Try with negative returns null
  const try2 = tryNonNegative(-1)
  Ts.assert<NonNegative | null>()(try2)
})

// === Type Relationships ===

Ts.test('NonNegative has correct relationships with other sign brands', () => {
  const nnVal: NonNegative = nonNegative(5)

  // NonNegative can be assigned to number
  const asNumber: number = nnVal
  Ts.assert<number>()(asNumber)

  // NonNegative and Negative are mutually exclusive
  const _negVal = {} as Negative
  // @ts-expect-error - NonNegative is not assignable to Negative
  const _bad1: Negative = nnVal

  // @ts-expect-error - Negative is not assignable to NonNegative
  const _bad2: NonNegative = _negVal

  // Zero is both NonNegative and can coexist with Zero brand
  const _zeroVal = {} as Zero
  // Zero satisfies NonNegative (0 >= 0)
  const nnZero = {} as NonNegative & Zero
  const _nn: NonNegative = nnZero
  const _z: Zero = nnZero

  // Positive and NonNegative are separate brands
  const _posVal = {} as Positive
  // They don't have a subtype relationship at the type level
  // @ts-expect-error - Positive is not assignable to NonNegative (different brands)
  const _nnFromPos: NonNegative = _posVal
})

// === Type-Level Only Tests ===

// Test brand relationships
type _NonNegativeRelationships = Ts.TestSuite<[
  // NonNegative extends number
  Ts.Assert<number, NonNegative>,

  // number does not extend NonNegative
  Ts.AssertNotExtends<number, NonNegative>,

  // NonNegative and Negative are mutually exclusive
  Ts.AssertNotExtends<NonNegative, Negative>,
  Ts.AssertNotExtends<Negative, NonNegative>,

  // Positive and NonNegative are separate brands (no subtype relationship)
  Ts.AssertNotExtends<NonNegative, Positive>,
  Ts.AssertNotExtends<Positive, NonNegative>,

  // Zero and NonNegative are separate brands (no subtype relationship)
  Ts.AssertNotExtends<NonNegative, Zero>,
  Ts.AssertNotExtends<Zero, NonNegative>,

  // NonNegative does not extend Positive (includes zero)
  Ts.AssertNotExtends<NonNegative, Positive>,

  // NonNegative does not extend Zero (includes positives)
  Ts.AssertNotExtends<NonNegative, Zero>,
]>

// Test constructor return types
type _ConstructorReturnTypes = Ts.TestSuite<[
  Ts.AssertExact<ReturnType<typeof nonNegative>, NonNegative>,
  Ts.AssertExact<ReturnType<typeof tryNonNegative>, NonNegative | null>,
]>

// Test the conceptual nature of NonNegative
type _NonNegativeConceptual = Ts.TestSuite<[
  // NonNegative conceptually includes positive and zero values
  // But at the type level, they are separate brands
  Ts.AssertNotExtends<Positive, NonNegative>,
  Ts.AssertNotExtends<Zero, NonNegative>,

  // NonNegative is its own brand, not literally Positive | Zero
  Ts.AssertNotExtends<NonNegative, Positive | Zero>,
]>

// Demonstrate type safety with NonNegative
Ts.test('NonNegative enables specific numeric constraints', () => {
  // Function that only accepts non-negative values
  const _calculateSquareRoot = (value: NonNegative): number => {
    // Safe to calculate square root - no imaginary numbers
    return Math.sqrt(value)
  }

  // Must validate before calling
  const value = 16
  const nn = nonNegative(value)
  const result = _calculateSquareRoot(nn)
  Ts.assert<number>()(result)

  // Cannot pass negative values
  // @ts-expect-error - Cannot assign negative number to NonNegative
  const _err = _calculateSquareRoot(-4)
})

// Test nominal typing
Ts.test('NonNegative is nominal (brand-based), not structural', () => {
  // Even though 5 is non-negative, it's not NonNegative without the brand
  // @ts-expect-error - Cannot assign raw number to NonNegative
  const _bad1: NonNegative = 5

  // Even though 0 is non-negative, it needs the brand
  // @ts-expect-error - Cannot assign raw number to NonNegative
  const _bad2: NonNegative = 0

  // Must use constructor to get proper type
  const _good: NonNegative = nonNegative(5)
})

// Test practical use cases
Ts.test('NonNegative practical examples', () => {
  // Array indices
  type ArrayIndex = NonNegative & { __index: true }

  const _getElement = <T>(arr: T[], index: ArrayIndex): T | undefined => {
    return arr[index]
  }

  // Age in years
  type Age = NonNegative

  const recordAge = (_age: Age): void => {
    // Safe to process as valid age
  }

  // Distance/Length measurements
  type Distance = NonNegative & { unit: 'meters' }

  const _calculateArea = (width: Distance, height: Distance): number => {
    // Both dimensions are guaranteed non-negative
    return width * height
  }

  // Usage with validation
  const age = 25
  const validAge = nonNegative(age)
  recordAge(validAge)
})

// Test combinations with other brands
Ts.test('NonNegative can combine with other number brands', () => {
  type Int = number & { __int: true }
  type Finite = number & { __finite: true }

  // Non-negative integer (0, 1, 2, ...)
  type NonNegativeInt = NonNegative & Int

  // Finite non-negative number
  type FiniteNonNegative = NonNegative & Finite

  // All relationships hold
  const nni = {} as NonNegativeInt
  const _nn1: NonNegative = nni
  const _i: Int = nni
  const _n1: number = nni

  const fnn = {} as FiniteNonNegative
  const _nn2: NonNegative = fnn
  const _f: Finite = fnn
  const _n2: number = fnn
})

// Test relationship between NonNegative and NonPositive
Ts.test('NonNegative and NonPositive overlap at zero', () => {
  type NonPositive = number & { __nonPositive: true }

  // Zero is both NonNegative and NonPositive
  type ZeroIsBoth = NonNegative & NonPositive & Zero

  const zero = {} as ZeroIsBoth
  const _nn: NonNegative = zero
  const _np: NonPositive = zero
  const _z: Zero = zero

  // But in general they don't overlap
  const _nn2 = {} as NonNegative
  const _np2 = {} as NonPositive

  // Most NonNegative are not NonPositive
  // @ts-expect-error - NonNegative doesn't extend NonPositive
  const _bad1: NonPositive = _nn2

  // Most NonPositive are not NonNegative
  // @ts-expect-error - NonPositive doesn't extend NonNegative
  const _bad2: NonNegative = _np2
})
