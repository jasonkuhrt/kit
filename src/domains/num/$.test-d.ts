import { test } from 'vitest'

/**
 * Type-level tests for the Num module
 */

import { Num } from '#num'
import { Ts } from '#ts'
import { Assert } from '#ts/ts'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly when combining predicates', () => {
  const value: unknown = 42

  // Single predicate narrows type
  if (Num.Finite.is(value)) {
    Assert.sub.ofAs<Num.Finite>()(value)
  }

  // Multiple predicates narrow to intersection
  if (Num.Positive.is(value) && Num.Int.is(value)) {
    Assert.sub.ofAs<Num.Positive & Num.Int>()(value)
  }

  // Complex narrowing with multiple brands
  if (Num.Finite.is(value) && Num.Positive.is(value) && Num.Int.is(value) && Num.Odd.is(value)) {
    Assert.sub.ofAs<Num.Finite & Num.Positive & Num.Int & Num.Odd>()(value)
  }

  // Narrowing with incompatible predicates
  if (Num.Zero.is(value)) {
    Assert.sub.ofAs<Num.Zero>()(value)
    // @ts-expect-error - Zero cannot be Positive
    Assert.sub.ofAs<Num.Positive>()(value)
  }

  // Range-based narrowing
  if (Num.InRange.is(value, 0, 100)) {
    Assert.sub.ofAs<Num.InRange<0, 100>>()(value)
  }

  // Percentage narrowing
  if (Num.Percentage.is(value)) {
    Assert.sub.ofAs<Num.Percentage>()(value)
    // Percentage is InRange<0, 1> not InRange<0, 100>
    Assert.sub.ofAs<Num.InRange<0, 1>>()(value)
  }
})

// === Constructor Functions ===

test('Constructor functions produce correctly branded types', () => {
  // Single brand constructors
  const pos = Num.Positive.from(5)
  Assert.exact.ofAs<Num.Positive>()(pos)

  const int = Num.Int.from(42)
  Assert.exact.ofAs<Num.Int>()(int)

  const finite = Num.Finite.from(3.14)
  Assert.exact.ofAs<Num.Finite>()(finite)

  const zero = Num.Zero.from(0)
  Assert.exact.ofAs<Num.Zero>()(zero)

  const nonZero = Num.NonZero.from(1)
  Assert.exact.ofAs<Num.NonZero>()(nonZero)

  const neg = Num.Negative.from(-5)
  Assert.exact.ofAs<Num.Negative>()(neg)

  const nonNeg = Num.NonNegative.from(0)
  Assert.exact.ofAs<Num.NonNegative>()(nonNeg)

  const nonPos = Num.NonPositive.from(0)
  Assert.exact.ofAs<Num.NonPositive>()(nonPos)

  const even = Num.Even.from(4)
  Assert.exact.ofAs<Num.Even & Num.Int>()(even)

  const odd = Num.Odd.from(3)
  Assert.exact.ofAs<Num.Odd & Num.Int>()(odd)

  const safeInt = Num.SafeInt.from(1000)
  Assert.exact.ofAs<Num.SafeInt & Num.Int>()(safeInt)

  const float = Num.Float.from(3.14)
  Assert.exact.ofAs<Num.Float & Num.Finite>()(float)

  // Range constructor
  const inRange = Num.InRange.from(50, 0, 100)
  Assert.exact.ofAs<Num.InRange<0, 100>>()(inRange)

  // Percentage constructor
  const pct = Num.Percentage.from(0.75)
  Assert.exact.ofAs<Num.Percentage>()(pct)

  // Angle constructors
  const rad = Num.Radians.from(Math.PI)
  Assert.exact.ofAs<Num.Radians & Num.Finite>()(rad)

  const deg = Num.Degrees.from(180)
  Assert.exact.ofAs<Num.Degrees & Num.Finite>()(deg)
})

// === Try Constructors ===

test('Try constructors return branded types or null', () => {
  // Try constructors have correct return types
  const tryPos = Num.Positive.tryFrom(5)
  Assert.exact.ofAs<Num.Positive | null>()(tryPos)

  const tryInt = Num.Int.tryFrom(42.5)
  Assert.exact.ofAs<Num.Int | null>()(tryInt)

  const tryFinite = Num.Finite.tryFrom(Infinity)
  Assert.exact.ofAs<Num.Finite | null>()(tryFinite)

  // Type narrowing with try constructors
  const value = 42
  const result = Num.Positive.tryFrom(value)
  if (result !== null) {
    Assert.exact.ofAs<Num.Positive>()(result)
  }
})

// === Math Operations with Branded Types ===

test('Math operations enforce branded type constraints', () => {
  // Basic arithmetic preserves number type
  const sum = Num.add(5, 3)
  Assert.sub.ofAs<number>()(sum)

  const diff = Num.subtract(10, 3)
  Assert.sub.ofAs<number>()(diff)

  const product = Num.multiply(4, 5)
  Assert.sub.ofAs<number>()(product)

  const divisor = Num.NonZero.from(2)
  const quotient = Num.divide(10, divisor)
  Assert.sub.ofAs<number>()(quotient)

  // Power operations
  const squared = Num.power(3, 2)
  Assert.sub.ofAs<number>()(squared)

  // Root operations
  const sqrtInput = Num.NonNegative.from(16)
  const sqrtResult = Num.sqrt(sqrtInput)
  Assert.sub.ofAs<number>()(sqrtResult)

  // Modulo operations (mod doesn't exist, using % operator)
  const remainder = 10 % 3
  Assert.sub.ofAs<number>()(remainder)

  // Absolute value
  const absResult = Num.abs(-5)
  Assert.sub.ofAs<number>()(absResult)

  // Sign operations
  const signResult = Num.sign(-5)
  Assert.sub.ofAs<number>()(signResult)

  // Rounding operations
  const finiteValue = Num.Finite.from(3.7)
  const rounded = Num.round(finiteValue)
  Assert.sub.ofAs<number>()(rounded)

  const floored = Num.floor(finiteValue)
  Assert.sub.ofAs<number>()(floored)

  const ceiled = Num.ceil(Num.Finite.from(3.2))
  Assert.sub.ofAs<number>()(ceiled)

  const truncated = Num.trunc(finiteValue)
  Assert.sub.ofAs<number>()(truncated)

  // Comparison operations
  const minResult = Num.min(5, 3)
  Assert.sub.ofAs<number>()(minResult)

  const maxResult = Num.max(5, 3)
  Assert.sub.ofAs<number>()(maxResult)

  const clamped = Num.InRange.clamp(10, 0, 5)
  Assert.sub.ofAs<number>()(clamped)

  // Trigonometric operations with Radians
  const rad = Num.Radians.from(Math.PI / 2)
  const sinResult = Num.sin(rad)
  Assert.sub.ofAs<number>()(sinResult)

  const cosResult = Num.cos(rad)
  Assert.sub.ofAs<number>()(cosResult)

  const tanResult = Num.tan(rad)
  Assert.sub.ofAs<number>()(tanResult)

  // Angle conversions
  const deg: Num.Degrees = Num.Degrees.from(180)
  const toRad = Num.degToRad(deg)
  Assert.sub.ofAs<Num.Radians>()(toRad)

  const toDeg = Num.radToDeg(rad)
  Assert.sub.ofAs<Num.Degrees>()(toDeg)
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
    Assert.sub.ofAs<PositiveInt>()(posInt)
  }

  // Complex intersection
  if (Num.Positive.is(value) && Num.Int.is(value) && Num.Odd.is(value)) {
    const posOddInt: PositiveOddInt = value
    Assert.sub.ofAs<PositiveOddInt>()(posOddInt)
  }

  // Finite non-zero
  if (Num.Finite.is(value) && Num.NonZero.is(value)) {
    const finiteNonZero: FiniteNonZero = value
    Assert.sub.ofAs<FiniteNonZero>()(finiteNonZero)
  }
})

// === Type-Level Only Tests ===

// Test that branded types extend number
type _BrandsExtendNumber = Ts.Assert.Cases<
  Assert.sub.of<number, Num.Positive>,
  Assert.sub.of<number, Num.Negative>,
  Assert.sub.of<number, Num.Zero>,
  Assert.sub.of<number, Num.NonZero>,
  Assert.sub.of<number, Num.Int>,
  Assert.sub.of<number, Num.Float>,
  Assert.sub.of<number, Num.Finite>,
  Assert.sub.of<number, Num.SafeInt>,
  Assert.sub.of<number, Num.Even>,
  Assert.sub.of<number, Num.Odd>,
  Assert.sub.of<number, Num.NonNegative>,
  Assert.sub.of<number, Num.NonPositive>,
  Assert.sub.of<number, Num.Percentage>,
  Assert.sub.of<number, Num.Radians>,
  Assert.sub.of<number, Num.Degrees>
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
type _RangeTypes = Ts.Assert.Cases<
  Assert.sub.of<number, Num.InRange<0, 100>>,
  Assert.sub.of<number, Num.InRange<-10, 10>>,
  Assert.sub.of<Num.InRange<0, 1>, Num.Percentage>
>

// Test that arithmetic operations return base number type
type _ArithmeticReturnTypes = Ts.Assert.Cases<
  Assert.exact.of<ReturnType<typeof Num.add>, number>,
  Assert.exact.of<ReturnType<typeof Num.multiply>, number>,
  Assert.exact.of<ReturnType<typeof Num.subtract>, number>,
  Assert.exact.of<ReturnType<typeof Num.round>, number>
>

// Test angle conversion types
type _AngleConversions = Ts.Assert.Cases<
  Assert.exact.of<Parameters<typeof Num.degToRad>[0], Num.Degrees>,
  Assert.exact.of<ReturnType<typeof Num.degToRad>, Num.Radians>,
  Assert.exact.of<Parameters<typeof Num.radToDeg>[0], Num.Radians>,
  Assert.exact.of<ReturnType<typeof Num.radToDeg>, Num.Degrees>
>

// Test curried function types
type _CurriedFunctions = Ts.Assert.Cases<
  Assert.sub.of<(b: number) => number, ReturnType<typeof Num.addWith>>,
  Assert.sub.of<(b: number) => number, ReturnType<typeof Num.multiplyWith>>,
  Assert.sub.of<(b: number) => number, ReturnType<typeof Num.divideWith>>
>
