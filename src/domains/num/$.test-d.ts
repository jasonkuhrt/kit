/**
 * Type-level tests for the Num module
 */

import { Num } from '#num'
import { Ts } from '#ts'

// === Type Narrowing with Predicates ===

Ts.test('Type narrowing works correctly when combining predicates', () => {
  const value: unknown = 42

  // Single predicate narrows type
  if (Num.Finite.is(value)) {
    Ts.assert<Num.Finite>()(value)
  }

  // Multiple predicates narrow to intersection
  if (Num.Positive.is(value) && Num.Int.is(value)) {
    Ts.assert<Num.Positive & Num.Int>()(value)
  }

  // Complex narrowing with multiple brands
  if (Num.Finite.is(value) && Num.Positive.is(value) && Num.Int.is(value) && Num.Odd.is(value)) {
    Ts.assert<Num.Finite & Num.Positive & Num.Int & Num.Odd>()(value)
  }

  // Narrowing with incompatible predicates
  if (Num.Zero.is(value)) {
    Ts.assert<Num.Zero>()(value)
    // @ts-expect-error - Zero cannot be Positive
    Ts.assert<Num.Positive>()(value)
  }

  // Range-based narrowing
  if (Num.InRange.is(value, 0, 100)) {
    Ts.assert<Num.InRange<0, 100>>()(value)
  }

  // Percentage narrowing
  if (Num.Percentage.is(value)) {
    Ts.assert<Num.Percentage>()(value)
    // Percentage is InRange<0, 1> not InRange<0, 100>
    Ts.assert<Num.InRange<0, 1>>()(value)
  }
})

// === Constructor Functions ===

Ts.test('Constructor functions produce correctly branded types', () => {
  // Single brand constructors
  const pos = Num.Positive.from(5)
  Ts.assert<Num.Positive>()(pos)

  const int = Num.Int.from(42)
  Ts.assert<Num.Int>()(int)

  const finite = Num.Finite.from(3.14)
  Ts.assert<Num.Finite>()(finite)

  const zero = Num.Zero.from(0)
  Ts.assert<Num.Zero>()(zero)

  const nonZero = Num.NonZero.from(1)
  Ts.assert<Num.NonZero>()(nonZero)

  const neg = Num.Negative.from(-5)
  Ts.assert<Num.Negative>()(neg)

  const nonNeg = Num.NonNegative.from(0)
  Ts.assert<Num.NonNegative>()(nonNeg)

  const nonPos = Num.NonPositive.from(0)
  Ts.assert<Num.NonPositive>()(nonPos)

  const even = Num.Even.from(4)
  Ts.assert<Num.Even>()(even)

  const odd = Num.Odd.from(3)
  Ts.assert<Num.Odd>()(odd)

  const safeInt = Num.SafeInt.from(1000)
  Ts.assert<Num.SafeInt>()(safeInt)

  const float = Num.Float.from(3.14)
  Ts.assert<Num.Float>()(float)

  // Range constructor
  const inRange = Num.InRange.from(50, 0, 100)
  Ts.assert<Num.InRange<0, 100>>()(inRange)

  // Percentage constructor
  const pct = Num.Percentage.from(0.75)
  Ts.assert<Num.Percentage>()(pct)

  // Angle constructors
  const rad = Num.Radians.from(Math.PI)
  Ts.assert<Num.Radians>()(rad)

  const deg = Num.Degrees.from(180)
  Ts.assert<Num.Degrees>()(deg)
})

// === Try Constructors ===

Ts.test('Try constructors return branded types or null', () => {
  // Try constructors have correct return types
  const tryPos = Num.Positive.tryFrom(5)
  Ts.assert<Num.Positive | null>()(tryPos)

  const tryInt = Num.Int.tryFrom(42.5)
  Ts.assert<Num.Int | null>()(tryInt)

  const tryFinite = Num.Finite.tryFrom(Infinity)
  Ts.assert<Num.Finite | null>()(tryFinite)

  // Type narrowing with try constructors
  const value = 42
  const result = Num.Positive.tryFrom(value)
  if (result !== null) {
    Ts.assert<Num.Positive>()(result)
  }
})

// === Math Operations with Branded Types ===

Ts.test('Math operations enforce branded type constraints', () => {
  // Basic arithmetic preserves number type
  const sum = Num.add(5, 3)
  Ts.assert<number>()(sum)

  const diff = Num.subtract(10, 3)
  Ts.assert<number>()(diff)

  const product = Num.multiply(4, 5)
  Ts.assert<number>()(product)

  const divisor = Num.NonZero.from(2)
  const quotient = Num.divide(10, divisor)
  Ts.assert<number>()(quotient)

  // Power operations
  const squared = Num.power(3, 2)
  Ts.assert<number>()(squared)

  // Root operations
  const sqrtInput = Num.NonNegative.from(16)
  const sqrtResult = Num.sqrt(sqrtInput)
  Ts.assert<number>()(sqrtResult)

  // Modulo operations (mod doesn't exist, using % operator)
  const remainder = 10 % 3
  Ts.assert<number>()(remainder)

  // Absolute value
  const absResult = Num.abs(-5)
  Ts.assert<number>()(absResult)

  // Sign operations
  const signResult = Num.sign(-5)
  Ts.assert<number>()(signResult)

  // Rounding operations
  const finiteValue = Num.Finite.from(3.7)
  const rounded = Num.round(finiteValue)
  Ts.assert<number>()(rounded)

  const floored = Num.floor(finiteValue)
  Ts.assert<number>()(floored)

  const ceiled = Num.ceil(Num.Finite.from(3.2))
  Ts.assert<number>()(ceiled)

  const truncated = Num.trunc(finiteValue)
  Ts.assert<number>()(truncated)

  // Comparison operations
  const minResult = Num.min(5, 3)
  Ts.assert<number>()(minResult)

  const maxResult = Num.max(5, 3)
  Ts.assert<number>()(maxResult)

  const clamped = Num.InRange.clamp(10, 0, 5)
  Ts.assert<number>()(clamped)

  // Trigonometric operations with Radians
  const rad = Num.Radians.from(Math.PI / 2)
  const sinResult = Num.sin(rad)
  Ts.assert<number>()(sinResult)

  const cosResult = Num.cos(rad)
  Ts.assert<number>()(cosResult)

  const tanResult = Num.tan(rad)
  Ts.assert<number>()(tanResult)

  // Angle conversions
  const deg: Num.Degrees = Num.Degrees.from(180)
  const toRad = Num.degToRad(deg)
  Ts.assert<Num.Radians>()(toRad)

  const toDeg = Num.radToDeg(rad)
  Ts.assert<Num.Degrees>()(toDeg)
})

// === Branded Type Intersections ===

Ts.test('Branded types can be properly intersected', () => {
  // Type-level intersections
  type PositiveInt = Num.Positive & Num.Int
  type PositiveOddInt = Num.Positive & Num.Int & Num.Odd
  type FiniteNonZero = Num.Finite & Num.NonZero

  // Runtime values with multiple brands
  const value = 5
  if (Num.Positive.is(value) && Num.Int.is(value)) {
    const posInt: PositiveInt = value
    Ts.assert<PositiveInt>()(posInt)
  }

  // Complex intersection
  if (Num.Positive.is(value) && Num.Int.is(value) && Num.Odd.is(value)) {
    const posOddInt: PositiveOddInt = value
    Ts.assert<PositiveOddInt>()(posOddInt)
  }

  // Finite non-zero
  if (Num.Finite.is(value) && Num.NonZero.is(value)) {
    const finiteNonZero: FiniteNonZero = value
    Ts.assert<FiniteNonZero>()(finiteNonZero)
  }
})

// === Type-Level Only Tests ===

// Test that branded types extend number
type _BrandsExtendNumber = Ts.TestSuite<[
  Ts.Assert<number, Num.Positive>,
  Ts.Assert<number, Num.Negative>,
  Ts.Assert<number, Num.Zero>,
  Ts.Assert<number, Num.NonZero>,
  Ts.Assert<number, Num.Int>,
  Ts.Assert<number, Num.Float>,
  Ts.Assert<number, Num.Finite>,
  Ts.Assert<number, Num.SafeInt>,
  Ts.Assert<number, Num.Even>,
  Ts.Assert<number, Num.Odd>,
  Ts.Assert<number, Num.NonNegative>,
  Ts.Assert<number, Num.NonPositive>,
  Ts.Assert<number, Num.Percentage>,
  Ts.Assert<number, Num.Radians>,
  Ts.Assert<number, Num.Degrees>,
]>

// Test brand relationships
// Verify that incompatible brands cannot be assigned to each other
Ts.test('Brand exclusivity', () => {
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
type _RangeTypes = Ts.TestSuite<[
  Ts.Assert<number, Num.InRange<0, 100>>,
  Ts.Assert<number, Num.InRange<-10, 10>>,
  Ts.Assert<Num.InRange<0, 1>, Num.Percentage>,
]>

// Test that arithmetic operations return base number type
type _ArithmeticReturnTypes = Ts.TestSuite<[
  Ts.AssertExact<ReturnType<typeof Num.add>, number>,
  Ts.AssertExact<ReturnType<typeof Num.multiply>, number>,
  Ts.AssertExact<ReturnType<typeof Num.subtract>, number>,
  Ts.AssertExact<ReturnType<typeof Num.round>, number>,
]>

// Test angle conversion types
type _AngleConversions = Ts.TestSuite<[
  Ts.AssertExact<Parameters<typeof Num.degToRad>[0], Num.Degrees>,
  Ts.AssertExact<ReturnType<typeof Num.degToRad>, Num.Radians>,
  Ts.AssertExact<Parameters<typeof Num.radToDeg>[0], Num.Radians>,
  Ts.AssertExact<ReturnType<typeof Num.radToDeg>, Num.Degrees>,
]>

// Test curried function types
type _CurriedFunctions = Ts.TestSuite<[
  Ts.Assert<(b: number) => number, ReturnType<typeof Num.addWith>>,
  Ts.Assert<(b: number) => number, ReturnType<typeof Num.multiplyWith>>,
  Ts.Assert<(b: number) => number, ReturnType<typeof Num.divideWith>>,
]>
