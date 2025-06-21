# Num Module - Branded Types Enhancement

## Overview

This document shows how to enhance the Num module with branded types for superior type safety, preventing common errors at compile time.

## Branded Type Definitions

```typescript
/**
 * Base branded number type.
 */
interface BrandedNumber<Brand extends string> {
  readonly __brand: Brand
}

/**
 * Finite number (excludes NaN, Infinity, -Infinity).
 */
export type Finite = number & BrandedNumber<'Finite'>

/**
 * Integer number.
 */
export type Int = number & BrandedNumber<'Int'>

/**
 * Float (non-integer finite number).
 */
export type Float = number & BrandedNumber<'Float'>

/**
 * Positive number (> 0).
 */
export type Positive = number & BrandedNumber<'Positive'>

/**
 * Negative number (< 0).
 */
export type Negative = number & BrandedNumber<'Negative'>

/**
 * Non-negative number (>= 0).
 */
export type NonNegative = number & BrandedNumber<'NonNegative'>

/**
 * Non-positive number (<= 0).
 */
export type NonPositive = number & BrandedNumber<'NonPositive'>

/**
 * Safe integer (within Number.MAX_SAFE_INTEGER).
 */
export type SafeInt = number & BrandedNumber<'SafeInt'>

/**
 * Even integer.
 */
export type Even = Int & BrandedNumber<'Even'>

/**
 * Odd integer.
 */
export type Odd = Int & BrandedNumber<'Odd'>

/**
 * Zero.
 */
export type Zero = 0 & BrandedNumber<'Zero'>

/**
 * Range-constrained number.
 */
export type InRange<Min extends number, Max extends number> =
  & number
  & BrandedNumber<`InRange<${Min},${Max}>`>

/**
 * Percentage (0-1).
 */
export type Percentage = InRange<0, 1>

/**
 * Angle in radians.
 */
export type Radians = number & BrandedNumber<'Radians'>

/**
 * Angle in degrees.
 */
export type Degrees = number & BrandedNumber<'Degrees'>
```

## Enhanced Type Predicates

```typescript
/**
 * Type predicate to check if value is a finite number.
 * Excludes NaN, Infinity, and -Infinity.
 */
export const isFinite = (value: unknown): value is Finite => {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Type predicate to check if value is an integer.
 */
export const isInt = (value: unknown): value is Int => {
  return typeof value === 'number' && Number.isInteger(value)
}

/**
 * Type predicate to check if value is a float (non-integer number).
 */
export const isFloat = (value: unknown): value is Float => {
  return typeof value === 'number' && Number.isFinite(value)
    && !Number.isInteger(value)
}

/**
 * Type predicate to check if value is positive (> 0).
 */
export const isPositive = (value: unknown): value is Positive => {
  return typeof value === 'number' && value > 0
}

/**
 * Type predicate to check if value is negative (< 0).
 */
export const isNegative = (value: unknown): value is Negative => {
  return typeof value === 'number' && value < 0
}

/**
 * Type predicate to check if value is non-negative (>= 0).
 */
export const isNonNegative = (value: unknown): value is NonNegative => {
  return typeof value === 'number' && value >= 0
}

/**
 * Type predicate to check if value is zero.
 */
export const isZero = (value: unknown): value is Zero => {
  return value === 0
}

/**
 * Type predicate to check if value is even.
 */
export const isEven = (value: unknown): value is Even => {
  return isInt(value) && value % 2 === 0
}

/**
 * Type predicate to check if value is odd.
 */
export const isOdd = (value: unknown): value is Odd => {
  return isInt(value) && value % 2 !== 0
}

/**
 * Type predicate to check if value is a safe integer.
 */
export const isSafeInt = (value: unknown): value is SafeInt => {
  return typeof value === 'number' && Number.isSafeInteger(value)
}

/**
 * Type predicate to check if value is within a specific range.
 */
export const inRange = <Min extends number, Max extends number>(
  value: unknown,
  min: Min,
  max: Max,
): value is InRange<Min, Max> => {
  return typeof value === 'number' && value >= min && value <= max
}

/**
 * Type predicate for percentage (0-1).
 */
export const isPercentage = (value: unknown): value is Percentage => {
  return inRange(value, 0, 1)
}
```

## Type-Safe Operations

```typescript
/**
 * Operations that preserve integer type.
 */
export const add = (a: Int, b: Int): Int => (a + b) as Int
export const addOn = (a: Int) => (b: Int): Int => (a + b) as Int

export const subtract = (a: Int, b: Int): Int => (a - b) as Int
export const subtractOn = (a: Int) => (b: Int): Int => (a - b) as Int

export const multiply = (a: Int, b: Int): Int => (a * b) as Int
export const multiplyOn = (a: Int) => (b: Int): Int => (a * b) as Int

/**
 * Division always returns Float (or throws for divide by zero).
 */
export const divide = (dividend: Finite, divisor: Finite): Float => {
  if (divisor === 0) throw new Error('Division by zero')
  return (dividend / divisor) as Float
}
export const divideOn = (dividend: Finite) => (divisor: Finite): Float =>
  divide(dividend, divisor)
export const divideWith = (divisor: Finite) => (dividend: Finite): Float =>
  divide(dividend, divisor)

/**
 * Safe division that returns null for invalid operations.
 */
export const safeDiv = (dividend: Finite, divisor: number): Float | null => {
  if (divisor === 0 || !isFinite(divisor)) return null
  return (dividend / divisor) as Float
}

/**
 * Integer division (truncates).
 */
export const intDiv = (dividend: Int, divisor: Int): Int => {
  if (divisor === 0) throw new Error('Division by zero')
  return Math.trunc(dividend / divisor) as Int
}

/**
 * Modulo for integers.
 */
export const mod = (dividend: Int, divisor: Int): NonNegative & Int => {
  const result = ((dividend % divisor) + divisor) % divisor
  return result as NonNegative & Int
}

/**
 * Power operations with type preservation.
 */
export const square = (n: Int): NonNegative & Int =>
  (n * n) as NonNegative & Int
export const squareFloat = (n: Finite): NonNegative & Finite =>
  (n * n) as NonNegative & Finite

export const power = (base: Finite, exponent: Int): Finite =>
  Math.pow(base, exponent) as Finite
export const powerOn = (base: Finite) => (exponent: Int): Finite =>
  Math.pow(base, exponent) as Finite

/**
 * Rounding operations that convert Float to Int.
 */
export const round = (value: Finite): Int => Math.round(value) as Int
export const floor = (value: Finite): Int => Math.floor(value) as Int
export const ceil = (value: Finite): Int => Math.ceil(value) as Int
export const trunc = (value: Finite): Int => Math.trunc(value) as Int

/**
 * Rounding to decimal places (preserves Float).
 */
export const roundTo =
  (precision: NonNegative & Int) => (value: Finite): Float => {
    const factor = Math.pow(10, precision)
    return (Math.round(value * factor) / factor) as Float
  }

/**
 * Absolute value with type preservation.
 */
export function abs(value: Positive): Positive
export function abs(value: Negative): Positive
export function abs(value: NonPositive): NonNegative
export function abs(value: Finite): NonNegative
export function abs(value: Finite): NonNegative {
  return Math.abs(value) as NonNegative
}

/**
 * Clamp with type constraints.
 */
export const clamp = <Min extends Finite, Max extends Finite>(
  value: Finite,
  min: Min,
  max: Max,
): InRange<Min, Max> => {
  if (min > max) throw new Error('Min must be <= max')
  return Math.max(min, Math.min(max, value)) as InRange<Min, Max>
}

/**
 * Type-safe increment/decrement.
 */
export const inc = (value: Int): Int => (value + 1) as Int
export const dec = (value: Int): Int => (value - 1) as Int

/**
 * Sign function with precise return type.
 */
export function sign(value: Positive): 1
export function sign(value: Negative): -1
export function sign(value: Zero): 0
export function sign(value: Finite): -1 | 0 | 1
export function sign(value: Finite): -1 | 0 | 1 {
  return Math.sign(value) as -1 | 0 | 1
}
```

## Range Operations with Branded Types

```typescript
/**
 * Generate array of integers in range.
 */
export const range = (start: Int, end: Int): Int[] => {
  const result: Int[] = []
  for (let i = start; i < end; i++) {
    result.push(i as Int)
  }
  return result
}

/**
 * Generate array of integers with step.
 */
export const rangeStep = (
  start: Int,
  end: Int,
  step: Positive & Int,
): Int[] => {
  const result: Int[] = []
  for (let i = start; i < end; i += step) {
    result.push(i as Int)
  }
  return result
}

/**
 * Times function with integer constraint.
 */
export const times = <T>(
  n: NonNegative & Int,
  fn: (index: NonNegative & Int) => T,
): T[] => {
  const result: T[] = []
  for (let i = 0; i < n; i++) {
    result.push(fn(i as NonNegative & Int))
  }
  return result
}
```

## Mathematical Functions with Branded Types

```typescript
/**
 * Square root always returns non-negative.
 */
export const sqrt = (value: NonNegative): NonNegative & Float => {
  return Math.sqrt(value) as NonNegative & Float
}

/**
 * Trigonometric functions with angle types.
 */
export const sin = (radians: Radians): Float => Math.sin(radians) as Float
export const cos = (radians: Radians): Float => Math.cos(radians) as Float
export const tan = (radians: Radians): Float => Math.tan(radians) as Float

/**
 * Angle conversion with type safety.
 */
export const degToRad = (degrees: Degrees): Radians => {
  return (degrees * Math.PI / 180) as Radians
}

export const radToDeg = (radians: Radians): Degrees => {
  return (radians * 180 / Math.PI) as Degrees
}

/**
 * Min/max with type preservation.
 */
export function min<T extends Finite>(a: T, b: T): T
export function min(a: Finite, b: Finite): Finite {
  return Math.min(a, b) as Finite
}

export function max<T extends Finite>(a: T, b: T): T
export function max(a: Finite, b: Finite): Finite {
  return Math.max(a, b) as Finite
}
```

## Parsing with Branded Types

```typescript
/**
 * Parse string to Int or null.
 */
export const parseInt = (value: string, radix?: Int): Int | null => {
  const parsed = Number.parseInt(value, radix)
  return isInt(parsed) ? parsed : null
}

/**
 * Parse string to Float or null.
 */
export const parseFloat = (value: string): Float | null => {
  const parsed = Number.parseFloat(value)
  return isFloat(parsed) ? parsed : null
}

/**
 * Parse with Result type.
 */
export type ParseResult<T> =
  | { success: true; value: T }
  | { success: false; error: string }

export const tryParseInt = (value: string, radix?: Int): ParseResult<Int> => {
  const parsed = parseInt(value, radix)
  return parsed !== null
    ? { success: true, value: parsed }
    : { success: false, error: `Cannot parse "${value}" as integer` }
}
```

## Usage Examples

```typescript
import { Num } from '@wollybeard/kit'

// Type predicates narrow types
const value: unknown = 42
if (Num.isInt(value)) {
  // value is now typed as Int
  const doubled = Num.multiply(value, value) // Int * Int = Int
  const halved = Num.divide(value, 2 as Num.Int) // Int / Int = Float
}

// Compile-time safety
const positiveOnly = (n: Num.Positive): void => {/* ... */}
const someNumber = -5
// positiveOnly(someNumber) // Error! number is not assignable to Positive

if (Num.isPositive(someNumber)) {
  positiveOnly(someNumber) // OK! someNumber is Positive
}

// Operations preserve types
const int1 = 5 as Num.Int
const int2 = 3 as Num.Int
const sum = Num.add(int1, int2) // Type: Int
const diff = Num.subtract(int1, int2) // Type: Int
const quotient = Num.divide(int1, int2) // Type: Float
const remainder = Num.mod(int1, int2) // Type: NonNegative & Int

// Range operations
const clamped = Num.clamp(
  150 as Num.Finite,
  0 as Num.NonNegative,
  100 as Num.Positive,
)
// Type: InRange<0, 100>

// Mathematical operations
const angle = 45 as Num.Degrees
const radians = Num.degToRad(angle) // Type: Radians
const sineValue = Num.sin(radians) // Type: Float

// Safe operations
const userInput = '123'
const parsed = Num.parseInt(userInput)
if (parsed !== null) {
  // parsed is Int
  const incremented = Num.inc(parsed) // Type: Int
}

// Chaining with type safety
pipe(
  -42,
  (n): n is Num.Negative => Num.isNegative(n), // Type guard
  (n) => n && Num.abs(n), // Returns Positive
  (n) => n && Num.square(n), // Returns NonNegative & Int
  (n) => n && Num.sqrt(n), // Returns NonNegative & Float
)
```

## Benefits of Branded Types

1. **Compile-Time Safety**: Catch type errors before runtime
2. **Self-Documenting**: Types express constraints clearly
3. **Prevents Common Errors**: Can't pass Float where Int expected
4. **Better IntelliSense**: IDE shows precise types
5. **Refactoring Safety**: Type changes propagate automatically

## Implementation Notes

1. All branded types are phantom types - no runtime overhead
2. Type assertions (`as`) are safe within validated functions
3. Use function overloads for operations that preserve specific types
4. Combine brands for multiple constraints (e.g., `NonNegative & Int`)

This approach makes the Num module significantly more type-safe while maintaining excellent developer experience.
