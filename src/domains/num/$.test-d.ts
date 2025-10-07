import { test } from 'vitest'

/**
 * Type-level tests for the Num module
 */

import { Num } from '#num'
import { Ts } from '#ts'

// === Type Narrowing with Predicates ===

test('Type narrowing works correctly when combining predicates', () => {
  const value: unknown = 42

  // Single predicate narrows type
  if (Num.Finite.is(value)) {
    Ts.Test.sub<Num.Finite>()(value)
  }

  // Multiple predicates narrow to intersection
  if (Num.Positive.is(value) && Num.Int.is(value)) {
    Ts.Test.sub<Num.Positive & Num.Int>()(value)
  }

  // Complex narrowing with multiple brands
  if (Num.Finite.is(value) && Num.Positive.is(value) && Num.Int.is(value) && Num.Odd.is(value)) {
    Ts.Test.sub<Num.Finite & Num.Positive & Num.Int & Num.Odd>()(value)
  }

  // Narrowing with incompatible predicates
  if (Num.Zero.is(value)) {
    Ts.Test.sub<Num.Zero>()(value)
    // @ts-expect-error - Zero cannot be Positive
    Ts.Test.sub<Num.Positive>()(value)
  }

  // Range-based narrowing
  if (Num.InRange.is(value, 0, 100)) {
    Ts.Test.sub<Num.InRange<0, 100>>()(value)
  }

  // Percentage narrowing
  if (Num.Percentage.is(value)) {
    Ts.Test.sub<Num.Percentage>()(value)
    // Percentage is InRange<0, 1> not InRange<0, 100>
    Ts.Test.sub<Num.InRange<0, 1>>()(value)
  }
})

// === Constructor Functions ===

test('Constructor functions produce correctly branded types', () => {
  // Single brand constructors
  const pos = Num.Positive.from(5)
  Ts.Test.equal<Num.Positive>()(pos)

  const int = Num.Int.from(42)
  Ts.Test.equal<Num.Int>()(int)

  const finite = Num.Finite.from(3.14)
  Ts.Test.equal<Num.Finite>()(finite)

  const zero = Num.Zero.from(0)
  Ts.Test.equal<Num.Zero>()(zero)

  const nonZero = Num.NonZero.from(1)
  Ts.Test.equal<Num.NonZero>()(nonZero)

  const neg = Num.Negative.from(-5)
  Ts.Test.equal<Num.Negative>()(neg)

  const nonNeg = Num.NonNegative.from(0)
  Ts.Test.equal<Num.NonNegative>()(nonNeg)

  const nonPos = Num.NonPositive.from(0)
  Ts.Test.equal<Num.NonPositive>()(nonPos)

  const even = Num.Even.from(4)
  Ts.Test.equal<Num.Even & Num.Int>()(even)

  const odd = Num.Odd.from(3)
  Ts.Test.equal<Num.Odd & Num.Int>()(odd)

  const safeInt = Num.SafeInt.from(1000)
  Ts.Test.equal<Num.SafeInt & Num.Int>()(safeInt)

  const float = Num.Float.from(3.14)
  Ts.Test.equal<Num.Float & Num.Finite>()(float)

  // Range constructor
  const inRange = Num.InRange.from(50, 0, 100)
  Ts.Test.equal<Num.InRange<0, 100>>()(inRange)

  // Percentage constructor
  const pct = Num.Percentage.from(0.75)
  Ts.Test.equal<Num.Percentage>()(pct)

  // Angle constructors
  const rad = Num.Radians.from(Math.PI)
  Ts.Test.equal<Num.Radians & Num.Finite>()(rad)

  const deg = Num.Degrees.from(180)
  Ts.Test.equal<Num.Degrees & Num.Finite>()(deg)
})

// === Try Constructors ===

test('Try constructors return branded types or null', () => {
  // Try constructors have correct return types
  const tryPos = Num.Positive.tryFrom(5)
  Ts.Test.equal<Num.Positive | null>()(tryPos)

  const tryInt = Num.Int.tryFrom(42.5)
  Ts.Test.equal<Num.Int | null>()(tryInt)

  const tryFinite = Num.Finite.tryFrom(Infinity)
  Ts.Test.equal<Num.Finite | null>()(tryFinite)

  // Type narrowing with try constructors
  const value = 42
  const result = Num.Positive.tryFrom(value)
  if (result !== null) {
    Ts.Test.equal<Num.Positive>()(result)
  }
})

// === Math Operations with Branded Types ===

test('Math operations enforce branded type constraints', () => {
  // Basic arithmetic preserves number type
  const sum = Num.add(5, 3)
  Ts.Test.sub<number>()(sum)

  const diff = Num.subtract(10, 3)
  Ts.Test.sub<number>()(diff)

  const product = Num.multiply(4, 5)
  Ts.Test.sub<number>()(product)

  const divisor = Num.NonZero.from(2)
  const quotient = Num.divide(10, divisor)
  Ts.Test.sub<number>()(quotient)

  // Power operations
  const squared = Num.power(3, 2)
  Ts.Test.sub<number>()(squared)

  // Root operations
  const sqrtInput = Num.NonNegative.from(16)
  const sqrtResult = Num.sqrt(sqrtInput)
  Ts.Test.sub<number>()(sqrtResult)

  // Modulo operations (mod doesn't exist, using % operator)
  const remainder = 10 % 3
  Ts.Test.sub<number>()(remainder)

  // Absolute value
  const absResult = Num.abs(-5)
  Ts.Test.sub<number>()(absResult)

  // Sign operations
  const signResult = Num.sign(-5)
  Ts.Test.sub<number>()(signResult)

  // Rounding operations
  const finiteValue = Num.Finite.from(3.7)
  const rounded = Num.round(finiteValue)
  Ts.Test.sub<number>()(rounded)

  const floored = Num.floor(finiteValue)
  Ts.Test.sub<number>()(floored)

  const ceiled = Num.ceil(Num.Finite.from(3.2))
  Ts.Test.sub<number>()(ceiled)

  const truncated = Num.trunc(finiteValue)
  Ts.Test.sub<number>()(truncated)

  // Comparison operations
  const minResult = Num.min(5, 3)
  Ts.Test.sub<number>()(minResult)

  const maxResult = Num.max(5, 3)
  Ts.Test.sub<number>()(maxResult)

  const clamped = Num.InRange.clamp(10, 0, 5)
  Ts.Test.sub<number>()(clamped)

  // Trigonometric operations with Radians
  const rad = Num.Radians.from(Math.PI / 2)
  const sinResult = Num.sin(rad)
  Ts.Test.sub<number>()(sinResult)

  const cosResult = Num.cos(rad)
  Ts.Test.sub<number>()(cosResult)

  const tanResult = Num.tan(rad)
  Ts.Test.sub<number>()(tanResult)

  // Angle conversions
  const deg: Num.Degrees = Num.Degrees.from(180)
  const toRad = Num.degToRad(deg)
  Ts.Test.sub<Num.Radians>()(toRad)

  const toDeg = Num.radToDeg(rad)
  Ts.Test.sub<Num.Degrees>()(toDeg)
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
    Ts.Test.sub<PositiveInt>()(posInt)
  }

  // Complex intersection
  if (Num.Positive.is(value) && Num.Int.is(value) && Num.Odd.is(value)) {
    const posOddInt: PositiveOddInt = value
    Ts.Test.sub<PositiveOddInt>()(posOddInt)
  }

  // Finite non-zero
  if (Num.Finite.is(value) && Num.NonZero.is(value)) {
    const finiteNonZero: FiniteNonZero = value
    Ts.Test.sub<FiniteNonZero>()(finiteNonZero)
  }
})

// === Type-Level Only Tests ===

// Test that branded types extend number
type _BrandsExtendNumber = Ts.Test.Cases<
  Ts.Test.sub<number, Num.Positive>,
  Ts.Test.sub<number, Num.Negative>,
  Ts.Test.sub<number, Num.Zero>,
  Ts.Test.sub<number, Num.NonZero>,
  Ts.Test.sub<number, Num.Int>,
  Ts.Test.sub<number, Num.Float>,
  Ts.Test.sub<number, Num.Finite>,
  Ts.Test.sub<number, Num.SafeInt>,
  Ts.Test.sub<number, Num.Even>,
  Ts.Test.sub<number, Num.Odd>,
  Ts.Test.sub<number, Num.NonNegative>,
  Ts.Test.sub<number, Num.NonPositive>,
  Ts.Test.sub<number, Num.Percentage>,
  Ts.Test.sub<number, Num.Radians>,
  Ts.Test.sub<number, Num.Degrees>
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
type _RangeTypes = Ts.Test.Cases<
  Ts.Test.sub<number, Num.InRange<0, 100>>,
  Ts.Test.sub<number, Num.InRange<-10, 10>>,
  Ts.Test.sub<Num.InRange<0, 1>, Num.Percentage>
>

// Test that arithmetic operations return base number type
type _ArithmeticReturnTypes = Ts.Test.Cases<
  Ts.Test.equal<ReturnType<typeof Num.add>, number>,
  Ts.Test.equal<ReturnType<typeof Num.multiply>, number>,
  Ts.Test.equal<ReturnType<typeof Num.subtract>, number>,
  Ts.Test.equal<ReturnType<typeof Num.round>, number>
>

// Test angle conversion types
type _AngleConversions = Ts.Test.Cases<
  Ts.Test.equal<Parameters<typeof Num.degToRad>[0], Num.Degrees>,
  Ts.Test.equal<ReturnType<typeof Num.degToRad>, Num.Radians>,
  Ts.Test.equal<Parameters<typeof Num.radToDeg>[0], Num.Radians>,
  Ts.Test.equal<ReturnType<typeof Num.radToDeg>, Num.Degrees>
>

// Test curried function types
type _CurriedFunctions = Ts.Test.Cases<
  Ts.Test.sub<(b: number) => number, ReturnType<typeof Num.addWith>>,
  Ts.Test.sub<(b: number) => number, ReturnType<typeof Num.multiplyWith>>,
  Ts.Test.sub<(b: number) => number, ReturnType<typeof Num.divideWith>>
>
