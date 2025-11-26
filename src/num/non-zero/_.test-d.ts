import { test } from 'vitest'

/**
 * Type-level tests for the NonZero module
 */

import { Type as A } from '#assert/assert'
import { Ts } from '#ts'
import type { Zero } from '../zero/__.js'
import type { NonZero } from './__.js'
import {
  from as nonZero,
  is as isNonZero,
  safeDiv,
  safeDivide,
  safeDivOn,
  safeDivWith,
  tryFrom as tryNonZero,
} from './__.js'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly with isNonZero predicate', () => {
  const value: unknown = 5

  // Predicate narrows to NonZero type
  if (isNonZero(value)) {
    A.sub.ofAs<NonZero>().on(value)
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
  A.exact.ofAs<NonZero>().on(nz1)

  // Negative non-zero
  const nz2 = nonZero(-10)
  A.exact.ofAs<NonZero>().on(nz2)

  // Small non-zero values
  const nz3 = nonZero(0.001)
  A.exact.ofAs<NonZero>().on(nz3)

  // Try constructor
  const try1 = tryNonZero(42)
  A.exact.ofAs<NonZero | null>().on(try1)

  // Type narrowing with try constructor
  if (try1 !== null) {
    A.exact.ofAs<NonZero>().on(try1)
  }

  // Try with zero returns null
  const try2 = tryNonZero(0)
  A.exact.ofAs<NonZero | null>().on(try2)
})

// === Safe Division Operations ===

test('Safe division operations have correct types', () => {
  const divisor: NonZero = nonZero(2)

  // safeDivide requires NonZero divisor and returns number
  const result1 = safeDivide(10, divisor)
  A.sub.ofAs<number>().on(result1)

  // safeDiv accepts any number and returns number | null
  const result2 = safeDiv(10, 2)
  A.sub.ofAs<number | null>().on(result2)

  const result3 = safeDiv(10, 0)
  A.sub.ofAs<number | null>().on(result3)

  // Type narrowing with safeDiv
  if (result2 !== null) {
    A.sub.ofAs<number>().on(result2)
  }
})

// === Type Relationships ===

test('NonZero has correct relationship with Zero', () => {
  const nonZeroVal: NonZero = nonZero(5)
  const _zeroVal = {} as Zero

  // NonZero can be assigned to number
  const asNumber: number = nonZeroVal
  A.sub.ofAs<number>().on(asNumber)

  // NonZero and Zero are mutually exclusive
  // @ts-expect-error - NonZero is not assignable to Zero
  const _bad1: Zero = nonZeroVal

  // @ts-expect-error - Zero is not assignable to NonZero
  const _bad2: NonZero = _zeroVal
})

// === Type-Level Only Tests ===

// Test brand relationships
type _NonZeroRelationships = A.Cases<
  // NonZero extends number
  A.sub.of<number, NonZero>,
  // number does not extend NonZero
  A.not.sub<NonZero, number>,
  // NonZero is distinct from Zero
  A.not.sub<NonZero, Zero>,
  A.not.sub<Zero, NonZero>
>

// Test constructor and operation return types
type _FunctionReturnTypes = A.Cases<
  // Constructor return types
  A.exact.of<ReturnType<typeof nonZero>, NonZero>,
  A.exact.of<ReturnType<typeof tryNonZero>, NonZero | null>,
  // Division operation types
  A.exact.of<ReturnType<typeof safeDivide>, number>,
  A.exact.of<ReturnType<typeof safeDiv>, number | null>
>

// Test safe division parameter types
type _SafeDivisionParameters = A.Cases<
  // safeDivide requires NonZero as second parameter
  A.exact.of<Parameters<typeof safeDivide>[0], number>,
  A.exact.of<Parameters<typeof safeDivide>[1], NonZero>,
  // safeDiv accepts regular numbers
  A.exact.of<Parameters<typeof safeDiv>[0], number>,
  A.exact.of<Parameters<typeof safeDiv>[1], number>
>

// Test curried function types
type _CurriedFunctions = A.Cases<
  // safeDivOn returns a function that may return null
  A.sub.of<(divisor: number) => number | null, ReturnType<typeof safeDivOn>>,
  // safeDivWith returns a function that may return null
  A.sub.of<(dividend: number) => number | null, ReturnType<typeof safeDivWith>>
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
  A.sub.ofAs<number>().on(ratio)
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
