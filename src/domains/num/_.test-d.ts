import { test } from 'vitest'

/**
 * Type-level tests for the Num module
 */

import { Type as A } from '#assert/assert'
import { Num } from '#num'
import { Ts } from '#ts'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly when combining predicates', () => {
  const value: unknown = 42

  // Single predicate narrows type
  if (Num.Finite.is(value)) {
    A.sub.ofAs<Num.Finite>().on(value)
  }

  // Multiple predicates narrow to intersection
  if (Num.Positive.is(value) && Num.Int.is(value)) {
    A.sub.ofAs<Num.Positive & Num.Int>().on(value)
  }

  // Complex narrowing with multiple brands
  if (Num.Finite.is(value) && Num.Positive.is(value) && Num.Int.is(value) && Num.Odd.is(value)) {
    A.sub.ofAs<Num.Finite & Num.Positive & Num.Int & Num.Odd>().on(value)
  }

  // Narrowing with incompatible predicates
  if (Num.Zero.is(value)) {
    A.sub.ofAs<Num.Zero>().on(value)
    // @ts-expect-error - Zero cannot be Positive
    A.sub.ofAs<Num.Positive>().on(value)
  }

  // Range-based narrowing
  if (Num.InRange.is(value, 0, 100)) {
    A.sub.ofAs<Num.InRange<0, 100>>().on(value)
  }

  // Percentage narrowing
  if (Num.Percentage.is(value)) {
    A.sub.ofAs<Num.Percentage>().on(value)
    // Percentage is InRange<0, 1> not InRange<0, 100>
    A.sub.ofAs<Num.InRange<0, 1>>().on(value)
  }
})

// === Constructor Functions ===

test('Constructor functions produce correctly branded types', () => {
  // Single brand constructors
  const pos = Num.Positive.from(5)
  A.exact.ofAs<Num.Positive>().on(pos)

  const int = Num.Int.from(42)
  A.exact.ofAs<Num.Int>().on(int)

  const finite = Num.Finite.from(3.14)
  A.exact.ofAs<Num.Finite>().on(finite)

  const zero = Num.Zero.from(0)
  A.exact.ofAs<Num.Zero>().on(zero)

  const nonZero = Num.NonZero.from(1)
  A.exact.ofAs<Num.NonZero>().on(nonZero)

  const neg = Num.Negative.from(-5)
  A.exact.ofAs<Num.Negative>().on(neg)

  const nonNeg = Num.NonNegative.from(0)
  A.exact.ofAs<Num.NonNegative>().on(nonNeg)

  const nonPos = Num.NonPositive.from(0)
  A.exact.ofAs<Num.NonPositive>().on(nonPos)

  const even = Num.Even.from(4)
  A.exact.ofAs<Num.Even & Num.Int>().on(even)

  const odd = Num.Odd.from(3)
  A.exact.ofAs<Num.Odd & Num.Int>().on(odd)

  const safeInt = Num.SafeInt.from(1000)
  A.exact.ofAs<Num.SafeInt & Num.Int>().on(safeInt)

  const float = Num.Float.from(3.14)
  A.exact.ofAs<Num.Float & Num.Finite>().on(float)

  // Range constructor
  const inRange = Num.InRange.from(50, 0, 100)
  A.exact.ofAs<Num.InRange<0, 100>>().on(inRange)

  // Percentage constructor
  const pct = Num.Percentage.from(0.75)
  A.exact.ofAs<Num.Percentage>().on(pct)

  // Angle constructors
  const rad = Num.Radians.from(Math.PI)
  A.exact.ofAs<Num.Radians & Num.Finite>().on(rad)

  const deg = Num.Degrees.from(180)
  A.exact.ofAs<Num.Degrees & Num.Finite>().on(deg)
})

// === Try Constructors ===

test('Try constructors return branded types or null', () => {
  // Try constructors have correct return types
  const tryPos = Num.Positive.tryFrom(5)
  A.exact.ofAs<Num.Positive | null>().on(tryPos)

  const tryInt = Num.Int.tryFrom(42.5)
  A.exact.ofAs<Num.Int | null>().on(tryInt)

  const tryFinite = Num.Finite.tryFrom(Infinity)
  A.exact.ofAs<Num.Finite | null>().on(tryFinite)

  // Type narrowing with try constructors
  const value = 42
  const result = Num.Positive.tryFrom(value)
  if (result !== null) {
    A.exact.ofAs<Num.Positive>().on(result)
  }
})

// === Math Operations with Branded Types ===

test('Math operations enforce branded type constraints', () => {
  // Basic arithmetic preserves number type
  const sum = Num.add(5, 3)
  A.sub.ofAs<number>().on(sum)

  const diff = Num.subtract(10, 3)
  A.sub.ofAs<number>().on(diff)

  const product = Num.multiply(4, 5)
  A.sub.ofAs<number>().on(product)

  const divisor = Num.NonZero.from(2)
  const quotient = Num.divide(10, divisor)
  A.sub.ofAs<number>().on(quotient)

  // Power operations
  const squared = Num.power(3, 2)
  A.sub.ofAs<number>().on(squared)

  // Root operations
  const sqrtInput = Num.NonNegative.from(16)
  const sqrtResult = Num.sqrt(sqrtInput)
  A.sub.ofAs<number>().on(sqrtResult)

  // Modulo operations (mod doesn't exist, using % operator)
  const remainder = 10 % 3
  A.sub.ofAs<number>().on(remainder)

  // Absolute value
  const absResult = Num.abs(-5)
  A.sub.ofAs<number>().on(absResult)

  // Sign operations
  const signResult = Num.sign(-5)
  A.sub.ofAs<number>().on(signResult)

  // Rounding operations
  const finiteValue = Num.Finite.from(3.7)
  const rounded = Num.round(finiteValue)
  A.sub.ofAs<number>().on(rounded)

  const floored = Num.floor(finiteValue)
  A.sub.ofAs<number>().on(floored)

  const ceiled = Num.ceil(Num.Finite.from(3.2))
  A.sub.ofAs<number>().on(ceiled)

  const truncated = Num.trunc(finiteValue)
  A.sub.ofAs<number>().on(truncated)

  // Comparison operations
  const minResult = Num.min(5, 3)
  A.sub.ofAs<number>().on(minResult)

  const maxResult = Num.max(5, 3)
  A.sub.ofAs<number>().on(maxResult)

  const clamped = Num.InRange.clamp(10, 0, 5)
  A.sub.ofAs<number>().on(clamped)

  // Trigonometric operations with Radians
  const rad = Num.Radians.from(Math.PI / 2)
  const sinResult = Num.sin(rad)
  A.sub.ofAs<number>().on(sinResult)

  const cosResult = Num.cos(rad)
  A.sub.ofAs<number>().on(cosResult)

  const tanResult = Num.tan(rad)
  A.sub.ofAs<number>().on(tanResult)

  // Angle conversions
  const deg: Num.Degrees = Num.Degrees.from(180)
  const toRad = Num.degToRad(deg)
  A.sub.ofAs<Num.Radians>().on(toRad)

  const toDeg = Num.radToDeg(rad)
  A.sub.ofAs<Num.Degrees>().on(toDeg)
})

// === Branded Type Intersections ===

test('Branded types can be properly intersected', () => {
  // Type-level intersections
  type PositiveInt = Num.Positive & Num.Int
  type PositiveOddInt = Num.Positive & Num.Int & Num.Odd
  type FiniteNonZero = Num.Finite & Num.NonZero

  // Runtime values with multiple brands
  const value = 5
  if (Num.Positive.is(value) && Num.Int.is(value)) {
    const posInt: PositiveInt = value
    A.sub.ofAs<PositiveInt>().on(posInt)
  }

  // Complex intersection
  if (Num.Positive.is(value) && Num.Int.is(value) && Num.Odd.is(value)) {
    const posOddInt: PositiveOddInt = value
    A.sub.ofAs<PositiveOddInt>().on(posOddInt)
  }

  // Finite non-zero
  if (Num.Finite.is(value) && Num.NonZero.is(value)) {
    const finiteNonZero: FiniteNonZero = value
    A.sub.ofAs<FiniteNonZero>().on(finiteNonZero)
  }
})

// === Type-Level Only Tests ===

// Test that branded types extend number
type _BrandsExtendNumber = A.Cases<
  A.sub.of<number, Num.Positive>,
  A.sub.of<number, Num.Negative>,
  A.sub.of<number, Num.Zero>,
  A.sub.of<number, Num.NonZero>,
  A.sub.of<number, Num.Int>,
  A.sub.of<number, Num.Float>,
  A.sub.of<number, Num.Finite>,
  A.sub.of<number, Num.SafeInt>,
  A.sub.of<number, Num.Even>,
  A.sub.of<number, Num.Odd>,
  A.sub.of<number, Num.NonNegative>,
  A.sub.of<number, Num.NonPositive>,
  A.sub.of<number, Num.Percentage>,
  A.sub.of<number, Num.Radians>,
  A.sub.of<number, Num.Degrees>
>

// Test brand relationships
// Verify that incompatible brands cannot be assigned to each other
test('Brand exclusivity', () => {
  const pos: Num.Positive = Num.Positive.from(5)
  const _neg: Num.Negative = Num.Negative.from(-5)
  const zero: Num.Zero = Num.Zero.from(0)
  const _nonZero: Num.NonZero = Num.NonZero.from(1)
  const even: Num.Even = Num.Even.from(4)
  const _odd: Num.Odd = Num.Odd.from(3)

  // @ts-expect-error - Cannot assign Positive to Negative
  const _neg2: Num.Negative = pos
  // @ts-expect-error - Cannot assign Zero to NonZero
  const _nonZero2: Num.NonZero = zero
  // @ts-expect-error - Cannot assign Even to Odd
  const _odd2: Num.Odd = even
})

// Test range type parameter constraints
type _RangeTypes = A.Cases<
  A.sub.of<number, Num.InRange<0, 100>>,
  A.sub.of<number, Num.InRange<-10, 10>>,
  A.sub.of<Num.InRange<0, 1>, Num.Percentage>
>

// Test that arithmetic operations return base number type
type _ArithmeticReturnTypes = A.Cases<
  A.exact.of<ReturnType<typeof Num.add>, number>,
  A.exact.of<ReturnType<typeof Num.multiply>, number>,
  A.exact.of<ReturnType<typeof Num.subtract>, number>,
  A.exact.of<ReturnType<typeof Num.round>, number>
>

// Test angle conversion types
type _AngleConversions = A.Cases<
  A.exact.of<Parameters<typeof Num.degToRad>[0], Num.Degrees>,
  A.exact.of<ReturnType<typeof Num.degToRad>, Num.Radians>,
  A.exact.of<Parameters<typeof Num.radToDeg>[0], Num.Radians>,
  A.exact.of<ReturnType<typeof Num.radToDeg>, Num.Degrees>
>

// Test curried function types
type _CurriedFunctions = A.Cases<
  A.sub.of<(b: number) => number, ReturnType<typeof Num.addWith>>,
  A.sub.of<(b: number) => number, ReturnType<typeof Num.multiplyWith>>,
  A.sub.of<(b: number) => number, ReturnType<typeof Num.divideWith>>
>
