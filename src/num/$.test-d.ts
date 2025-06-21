/**
 * Type-level tests for the Num module
 */

import { Num } from '#num'
import { Ts } from '#ts'

// === Type Narrowing with Predicates ===

Ts.test('Type narrowing works correctly when combining predicates', () => {
  const value: unknown = 42

  // Single predicate narrows type
  if (Num.isFinite(value)) {
    Ts.assert<Num.Finite>()(value)
  }

  // Multiple predicates narrow to intersection
  if (Num.isPositive(value) && Num.isInt(value)) {
    Ts.assert<Num.Positive & Num.Int>()(value)
  }

  // Complex narrowing with multiple brands
  if (Num.isFinite(value) && Num.isPositive(value) && Num.isInt(value) && Num.isOdd(value)) {
    Ts.assert<Num.Finite & Num.Positive & Num.Int & Num.Odd>()(value)
  }

  // Narrowing with incompatible predicates
  if (Num.isZero(value)) {
    Ts.assert<Num.Zero>()(value)
    // @ts-expect-error - Zero cannot be Positive
    Ts.assert<Num.Positive>()(value)
  }

  // Range-based narrowing
  if (Num.inRange(value, 0, 100)) {
    Ts.assert<Num.InRange<0, 100>>()(value)
  }

  // Percentage narrowing
  if (Num.isPercentage(value)) {
    Ts.assert<Num.Percentage>()(value)
    // Percentage is InRange<0, 1> not InRange<0, 100>
    Ts.assert<Num.InRange<0, 1>>()(value)
  }
})

// === Constructor Functions ===

Ts.test('Constructor functions produce correctly branded types', () => {
  // Single brand constructors
  const pos = Num.positive(5)
  Ts.assert<Num.Positive>()(pos)

  const int = Num.int(42)
  Ts.assert<Num.Int>()(int)

  const finite = Num.finite(3.14)
  Ts.assert<Num.Finite>()(finite)

  const zero = Num.zero(0)
  Ts.assert<Num.Zero>()(zero)

  const nonZero = Num.nonZero(1)
  Ts.assert<Num.NonZero>()(nonZero)

  const neg = Num.negative(-5)
  Ts.assert<Num.Negative>()(neg)

  const nonNeg = Num.nonNegative(0)
  Ts.assert<Num.NonNegative>()(nonNeg)

  const nonPos = Num.nonPositive(0)
  Ts.assert<Num.NonPositive>()(nonPos)

  const even = Num.even(4)
  Ts.assert<Num.Even>()(even)

  const odd = Num.odd(3)
  Ts.assert<Num.Odd>()(odd)

  const safeInt = Num.safeInt(1000)
  Ts.assert<Num.SafeInt>()(safeInt)

  const float = Num.float(3.14)
  Ts.assert<Num.Float>()(float)

  // Range constructor
  const inRange = Num.ranged(50, 0, 100)
  Ts.assert<Num.InRange<0, 100>>()(inRange)

  // Percentage constructor
  const pct = Num.percentage(0.75)
  Ts.assert<Num.Percentage>()(pct)

  // Angle constructors
  const rad = Num.radians(Math.PI)
  Ts.assert<Num.Radians>()(rad)

  const deg = Num.degrees(180)
  Ts.assert<Num.Degrees>()(deg)
})

// === Try Constructors ===

Ts.test('Try constructors return branded types or null', () => {
  // Try constructors have correct return types
  const tryPos = Num.tryPositive(5)
  Ts.assert<Num.Positive | null>()(tryPos)

  const tryInt = Num.tryInt(42.5)
  Ts.assert<Num.Int | null>()(tryInt)

  const tryFinite = Num.tryFinite(Infinity)
  Ts.assert<Num.Finite | null>()(tryFinite)

  // Type narrowing with try constructors
  const value = 42
  const result = Num.tryPositive(value)
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

  const divisor = Num.nonZero(2)
  const quotient = Num.divide(10, divisor)
  Ts.assert<number>()(quotient)

  // Power operations
  const squared = Num.power(3, 2)
  Ts.assert<number>()(squared)

  // Root operations
  const sqrtResult = Num.sqrt(16)
  Ts.assert<number>()(sqrtResult)

  // Modulo operations
  const remainder = Num.mod(10, 3)
  Ts.assert<number>()(remainder)

  // Absolute value
  const absResult = Num.abs(-5)
  Ts.assert<number>()(absResult)

  // Sign operations
  const signResult = Num.sign(-5)
  Ts.assert<number>()(signResult)

  // Rounding operations
  const rounded = Num.round(3.7)
  Ts.assert<number>()(rounded)

  const floored = Num.floor(3.7)
  Ts.assert<number>()(floored)

  const ceiled = Num.ceil(3.2)
  Ts.assert<number>()(ceiled)

  const truncated = Num.trunc(3.7)
  Ts.assert<number>()(truncated)

  // Comparison operations
  const minResult = Num.min(5, 3)
  Ts.assert<number>()(minResult)

  const maxResult = Num.max(5, 3)
  Ts.assert<number>()(maxResult)

  const clamped = Num.clamp(10, 0, 5)
  Ts.assert<number>()(clamped)

  // Trigonometric operations with Radians
  const rad: Num.Radians = Num.radians(Math.PI / 2)
  const sinResult = Num.sin(rad)
  Ts.assert<number>()(sinResult)

  const cosResult = Num.cos(rad)
  Ts.assert<number>()(cosResult)

  const tanResult = Num.tan(rad)
  Ts.assert<number>()(tanResult)

  // Angle conversions
  const deg: Num.Degrees = Num.degrees(180)
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
  if (Num.isPositive(value) && Num.isInt(value)) {
    const posInt: PositiveInt = value
    Ts.assert<PositiveInt>()(posInt)
  }

  // Complex intersection
  if (Num.isPositive(value) && Num.isInt(value) && Num.isOdd(value)) {
    const posOddInt: PositiveOddInt = value
    Ts.assert<PositiveOddInt>()(posOddInt)
  }

  // Finite non-zero
  if (Num.isFinite(value) && Num.isNonZero(value)) {
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
  const pos: Num.Positive = Num.positive(5)
  const neg: Num.Negative = Num.negative(-5)
  const zero: Num.Zero = Num.zero(0)
  const nonZero: Num.NonZero = Num.nonZero(1)
  const even: Num.Even = Num.even(4)
  const odd: Num.Odd = Num.odd(3)

  // @ts-expect-error - Cannot assign Positive to Negative
  const _neg: Num.Negative = pos
  // @ts-expect-error - Cannot assign Zero to NonZero
  const _nonZero: Num.NonZero = zero
  // @ts-expect-error - Cannot assign Even to Odd
  const _odd: Num.Odd = even
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
