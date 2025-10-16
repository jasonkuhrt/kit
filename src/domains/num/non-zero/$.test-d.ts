import { test } from 'vitest'

/**
 * Type-level tests for the NonZero module
 */

import { Ts } from '#ts'
import type { Zero } from '../zero/$$.js'
import type { NonZero } from './$$.js'
import {
  from as nonZero,
  is as isNonZero,
  safeDiv,
  safeDivide,
  safeDivOn,
  safeDivWith,
  tryFrom as tryNonZero,
} from './$$.js'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly with isNonZero predicate', () => {
  const value: unknown = 5

  // Predicate narrows to NonZero type
  if (isNonZero(value)) {
    Ts.Test.sub.is<NonZero>()(value)
  }

  // Works with different numeric values
  const _narrowed = (v: unknown): void => {
    if (isNonZero(v)) {
      const _nz: NonZero = v
      // Also assignable to number
      const _n: number = v
    }
  }
})

// === Constructor Functions ===

test('Constructor functions produce correctly branded types', () => {
  // Basic non-zero constructor
  const nz1 = nonZero(5)
  Ts.Test.exact.is<NonZero>()(nz1)

  // Negative non-zero
  const nz2 = nonZero(-10)
  Ts.Test.exact.is<NonZero>()(nz2)

  // Small non-zero values
  const nz3 = nonZero(0.001)
  Ts.Test.exact.is<NonZero>()(nz3)

  // Try constructor
  const try1 = tryNonZero(42)
  Ts.Test.exact.is<NonZero | null>()(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    Ts.Test.exact.is<NonZero>()(try1)
  }

  // Try with zero returns null
  const try2 = tryNonZero(0)
  Ts.Test.exact.is<NonZero | null>()(try2)
})

// === Safe Division Operations ===

test('Safe division operations have correct types', () => {
  const divisor: NonZero = nonZero(2)

  // safeDivide requires NonZero divisor and returns number
  const result1 = safeDivide(10, divisor)
  Ts.Test.sub.is<number>()(result1)

  // safeDiv accepts any number and returns number | null
  const result2 = safeDiv(10, 2)
  Ts.Test.sub.is<number | null>()(result2)

  const result3 = safeDiv(10, 0)
  Ts.Test.sub.is<number | null>()(result3)

  // Type narrowing with safeDiv
  if (result2 !== null) {
    Ts.Test.sub.is<number>()(result2)
  }
})

// === Type Relationships ===

test('NonZero has correct relationship with Zero', () => {
  const nonZeroVal: NonZero = nonZero(5)
  const _zeroVal = {} as Zero

  // NonZero can be assigned to number
  const asNumber: number = nonZeroVal
  Ts.Test.sub.is<number>()(asNumber)

  // NonZero and Zero are mutually exclusive
  // @ts-expect-error - NonZero is not assignable to Zero
  const _bad1: Zero = nonZeroVal

  // @ts-expect-error - Zero is not assignable to NonZero
  const _bad2: NonZero = _zeroVal
})

// === Type-Level Only Tests ===

// Test brand relationships
type _NonZeroRelationships = Ts.Test.Cases<
  // NonZero extends number
  Ts.Test.sub<number, NonZero>,
  // number does not extend NonZero
  Ts.Test.not.sub<NonZero, number>,
  // NonZero is distinct from Zero
  Ts.Test.not.sub<NonZero, Zero>,
  Ts.Test.not.sub<Zero, NonZero>
>

// Test constructor and operation return types
type _FunctionReturnTypes = Ts.Test.Cases<
  // Constructor return types
  Ts.Test.exact<ReturnType<typeof nonZero>, NonZero>,
  Ts.Test.exact<ReturnType<typeof tryNonZero>, NonZero | null>,
  // Division operation types
  Ts.Test.exact<ReturnType<typeof safeDivide>, number>,
  Ts.Test.exact<ReturnType<typeof safeDiv>, number | null>
>

// Test safe division parameter types
type _SafeDivisionParameters = Ts.Test.Cases<
  // safeDivide requires NonZero as second parameter
  Ts.Test.exact<Parameters<typeof safeDivide>[0], number>,
  Ts.Test.exact<Parameters<typeof safeDivide>[1], NonZero>,
  // safeDiv accepts regular numbers
  Ts.Test.exact<Parameters<typeof safeDiv>[0], number>,
  Ts.Test.exact<Parameters<typeof safeDiv>[1], number>
>

// Test curried function types
type _CurriedFunctions = Ts.Test.Cases<
  // safeDivOn returns a function that may return null
  Ts.Test.sub<(divisor: number) => number | null, ReturnType<typeof safeDivOn>>,
  // safeDivWith returns a function that may return null
  Ts.Test.sub<(dividend: number) => number | null, ReturnType<typeof safeDivWith>>
>

// Demonstrate type safety with division
test('NonZero enables type-safe division', () => {
  // Regular division can fail at runtime
  const _unsafeDivide = (a: number, b: number): number => a / b
  const _bad = _unsafeDivide(10, 0) // Returns Infinity, no compile-time error

  // safeDivide prevents division by zero at compile time
  const divisor: NonZero = nonZero(2)
  const _safe = safeDivide(10, divisor) // Always safe

  // Cannot pass zero to safeDivide
  // @ts-expect-error - number is not assignable to NonZero
  const _err1 = safeDivide(10, 0)

  // Cannot pass unverified number
  const _unknownDivisor: number = 2
  // @ts-expect-error - number is not assignable to NonZero
  const _err2 = safeDivide(10, _unknownDivisor)
})

// Test nominal typing
test('NonZero is nominal (brand-based), not structural', () => {
  // Even though 5 is non-zero, it's not NonZero without the brand
  // @ts-expect-error - Cannot assign raw number to NonZero
  const _bad1: NonZero = 5

  // Must use constructor to get proper type
  const _good: NonZero = nonZero(5)
})

// Test practical use cases
test('NonZero practical type safety examples', () => {
  // Function that requires non-zero denominator
  const _calculateRatio = (numerator: number, denominator: NonZero): number => {
    return numerator / denominator // Safe!
  }

  // Function that validates and returns NonZero
  const getDenominator = (value: number): NonZero => {
    const nz = tryNonZero(value)
    if (nz === null) {
      throw new Error('Denominator cannot be zero')
    }
    return nz
  }

  // Usage
  const denom = getDenominator(4)
  const ratio = _calculateRatio(12, denom)
  Ts.Test.sub.is<number>()(ratio)
})

// Test combinations with other brands
test('NonZero can combine with other number brands', () => {
  // Hypothetical combinations
  type Positive = number & { __positive: true }
  type Int = number & { __int: true }

  // Positive non-zero integer
  type PositiveNonZeroInt = NonZero & Positive & Int

  // All relationships hold
  const pnzi = {} as PositiveNonZeroInt
  const _nz: NonZero = pnzi
  const _p: Positive = pnzi
  const _i: Int = pnzi
  const _n: number = pnzi
})
