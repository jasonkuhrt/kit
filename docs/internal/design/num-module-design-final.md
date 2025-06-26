# Num Module Design - Final

## Overview

The `num` module provides comprehensive utilities for working with numbers in TypeScript. This module fills a critical gap in the current data structure offerings and follows the established patterns of other primitive type modules (`str`, `bool`, `null`, `undefined`).

## Core Philosophy

1. **Type Safety First**: Leverage TypeScript's type system for compile-time guarantees
2. **Functional Programming**: Pure functions with currying support (`*On` and `*With` variants)
3. **Performance**: Use native JavaScript operations where possible
4. **Consistency**: Follow established module patterns and naming conventions
5. **Edge Case Handling**: Proper handling of `NaN`, `Infinity`, and floating-point precision

## Module Structure

```
src/num/
├── $.ts          # Namespace export: export * as Num from './$$.ts'
├── $$.ts         # Barrel export: export * from './*.ts'
├── $.test.ts     # Comprehensive tests
├── num.ts        # Core number operations
├── math.ts       # Mathematical operations and constants
├── format.ts     # Number formatting utilities
├── range.ts      # Range operations and generation
└── random.ts     # Random number generation
```

## API Design

### Type Predicates & Validation (`num.ts`)

```typescript
/**
 * Type predicate to check if value is a number.
 * Excludes NaN by default.
 */
export const is = (value: unknown): value is number

/**
 * Type predicate to check if value is a finite number.
 * Excludes NaN, Infinity, and -Infinity.
 */
export const isFinite = (value: unknown): value is number

/**
 * Type predicate to check if value is an integer.
 */
export const isInt = (value: unknown): value is number

/**
 * Type predicate to check if value is a float (non-integer number).
 */
export const isFloat = (value: unknown): value is number

/**
 * Type predicate to check if value is NaN.
 */
export const isNaN = (value: unknown): value is number

/**
 * Type predicate to check if value is positive (> 0).
 */
export const isPositive = (value: unknown): value is number

/**
 * Type predicate to check if value is negative (< 0).
 */
export const isNegative = (value: unknown): value is number

/**
 * Type predicate to check if value is zero.
 */
export const isZero = (value: unknown): value is number

/**
 * Type predicate to check if value is even.
 */
export const isEven = (value: unknown): value is number

/**
 * Type predicate to check if value is odd.
 */
export const isOdd = (value: unknown): value is number

/**
 * Type predicate to check if value is a safe integer.
 */
export const isSafe = (value: unknown): value is number

/**
 * Type predicate to check if value is within a specific range.
 */
export const inRange = (value: unknown, min: number, max: number): value is number
export const inRangeOn = (value: unknown) => (min: number, max: number): value is number
export const inRangeWith = (min: number, max: number) => (value: unknown): value is number
```

### Core Operations (`num.ts`)

```typescript
/**
 * Clamp a number to a range.
 */
export const clamp = (value: number, min: number, max: number): number
export const clampOn = (value: number) => (min: number, max: number): number
export const clampWith = (min: number, max: number) => (value: number): number

/**
 * Get absolute value.
 */
export const abs = (value: number): number

/**
 * Get sign of number (-1, 0, 1).
 */
export const sign = (value: number): -1 | 0 | 1

/**
 * Increment by 1.
 */
export const inc = (value: number): number

/**
 * Decrement by 1.
 */
export const dec = (value: number): number

/**
 * Safe division that returns a default value for division by zero.
 */
export const safeDiv = (dividend: number, divisor: number, defaultValue?: number): number
export const safeDivOn = (dividend: number) => (divisor: number, defaultValue?: number): number
export const safeDivWith = (divisor: number, defaultValue?: number) => (dividend: number): number

/**
 * Modulo operation that always returns positive result.
 */
export const mod = (dividend: number, divisor: number): number
export const modOn = (dividend: number) => (divisor: number): number
export const modWith = (divisor: number) => (dividend: number): number
```

### Mathematical Operations (`math.ts`)

```typescript
/**
 * Basic arithmetic - only base and On variants needed (same semantics).
 */
export const add = (a: number, b: number): number
export const addOn = (a: number) => (b: number): number

export const subtract = (a: number, b: number): number
export const subtractOn = (a: number) => (b: number): number

export const multiply = (a: number, b: number): number
export const multiplyOn = (a: number) => (b: number): number

export const divide = (dividend: number, divisor: number): number
export const divideOn = (dividend: number) => (divisor: number): number
export const divideWith = (divisor: number) => (dividend: number): number  // Different semantics

export const power = (base: number, exponent: number): number
export const powerOn = (base: number) => (exponent: number): number
export const powerWith = (exponent: number) => (base: number): number  // Different semantics

/**
 * Rounding operations.
 */
export const round = (value: number, precision?: number): number
export const roundOn = (value: number) => (precision?: number): number
export const roundWith = (precision: number) => (value: number): number

export const floor = (value: number): number
export const ceil = (value: number): number
export const trunc = (value: number): number

/**
 * Advanced mathematical functions.
 */
export const sqrt = (value: number): number
export const cbrt = (value: number): number
export const log = (value: number): number
export const log10 = (value: number): number
export const log2 = (value: number): number

/**
 * Trigonometric functions.
 */
export const sin = (radians: number): number
export const cos = (radians: number): number
export const tan = (radians: number): number
export const asin = (value: number): number
export const acos = (value: number): number
export const atan = (value: number): number
export const atan2 = (y: number, x: number): number
export const atan2On = (y: number) => (x: number): number
export const atan2With = (x: number) => (y: number): number  // Different semantics

/**
 * Angle conversion.
 */
export const degToRad = (degrees: number): number
export const radToDeg = (radians: number): number

/**
 * Statistical functions - only base and On (same semantics).
 */
export const min = (a: number, b: number): number
export const minOn = (a: number) => (b: number): number

export const max = (a: number, b: number): number
export const maxOn = (a: number) => (b: number): number

export const gcd = (a: number, b: number): number
export const gcdOn = (a: number) => (b: number): number

export const lcm = (a: number, b: number): number
export const lcmOn = (a: number) => (b: number): number

/**
 * Constants.
 */
export const PI = Math.PI
export const E = Math.E
export const TAU = 2 * Math.PI
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2
```

### Number Formatting (`format.ts`)

```typescript
/**
 * Format number as currency.
 */
export interface CurrencyOptions {
  currency?: string
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export const currency = (value: number, options?: CurrencyOptions): string
export const currencyOn = (value: number) => (options?: CurrencyOptions): string
export const currencyWith = (options: CurrencyOptions) => (value: number): string

/**
 * Format number as percentage.
 */
export interface PercentOptions {
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export const percent = (value: number, options?: PercentOptions): string
export const percentOn = (value: number) => (options?: PercentOptions): string
export const percentWith = (options: PercentOptions) => (value: number): string

/**
 * Format with thousands separators.
 */
export const thousands = (value: number, separator?: string): string
export const thousandsOn = (value: number) => (separator?: string): string
export const thousandsWith = (separator: string) => (value: number): string

/**
 * Format to fixed decimal places.
 */
export const toFixed = (value: number, digits: number): string
export const toFixedOn = (value: number) => (digits: number): string
export const toFixedWith = (digits: number) => (value: number): string

/**
 * Format in scientific notation.
 */
export const toExponential = (value: number, fractionDigits?: number): string
export const toExponentialOn = (value: number) => (fractionDigits?: number): string
export const toExponentialWith = (fractionDigits: number) => (value: number): string

/**
 * Format with precision.
 */
export const toPrecision = (value: number, precision: number): string
export const toPrecisionOn = (value: number) => (precision: number): string
export const toPrecisionWith = (precision: number) => (value: number): string

/**
 * Format as ordinal (1st, 2nd, 3rd, etc.).
 */
export const ordinal = (value: number, locale?: string): string
export const ordinalOn = (value: number) => (locale?: string): string
export const ordinalWith = (locale: string) => (value: number): string

/**
 * Format file sizes (bytes to KB, MB, GB, etc.).
 */
export interface FileSizeOptions {
  base?: 1000 | 1024
  unit?: 'B' | 'KB' | 'MB' | 'GB' | 'TB'
  precision?: number
}

export const fileSize = (bytes: number, options?: FileSizeOptions): string
export const fileSizeOn = (bytes: number) => (options?: FileSizeOptions): string
export const fileSizeWith = (options: FileSizeOptions) => (bytes: number): string
```

### Range Operations (`range.ts`)

```typescript
/**
 * Generate array of numbers in range.
 */
export interface RangeOptions {
  step?: number
  inclusive?: boolean
}

export const range = (start: number, end: number, options?: RangeOptions): number[]
export const rangeOn = (start: number) => (end: number, options?: RangeOptions): number[]
export const rangeWith = (end: number, options?: RangeOptions) => (start: number): number[]

/**
 * Generate range with step.
 */
export const rangeStep = (start: number, end: number, step: number): number[]
export const rangeStepOn = (start: number) => (end: number, step: number): number[]
export const rangeStepWith = (end: number, step: number) => (start: number): number[]

/**
 * Create inclusive range (same semantics, only base and On).
 */
export const rangeInclusive = (start: number, end: number): number[]
export const rangeInclusiveOn = (start: number) => (end: number): number[]

/**
 * Times function - execute n times.
 */
export const times = <T>(n: number, fn: (index: number) => T): T[]
export const timesOn = <T>(n: number) => (fn: (index: number) => T): T[]
export const timesWith = <T>(fn: (index: number) => T) => (n: number): T[]

/**
 * Linear interpolation.
 */
export const lerp = (start: number, end: number, t: number): number
export const lerpOn = (start: number) => (end: number, t: number): number
export const lerpWith = (end: number, t: number) => (start: number): number

/**
 * Map value from one range to another.
 */
export const mapRange = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number
export const mapRangeOn = (value: number) =>
  (fromMin: number, fromMax: number, toMin: number, toMax: number): number
export const mapRangeWith = (fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  (value: number): number
```

### Random Number Generation (`random.ts`)

```typescript
/**
 * Generate random number between 0 and 1.
 */
export const random = (): number

/**
 * Generate random number in range (same semantics).
 */
export const randomInRange = (min: number, max: number): number
export const randomBetween = (min: number, max: number): number  // Alias

/**
 * Generate random integer (same semantics).
 */
export const randomInt = (min: number, max: number): number
export const randomIntBetween = (min: number, max: number): number  // Alias

/**
 * Generate random number with normal distribution.
 */
export const randomNormal = (mean?: number, stdDev?: number): number
export const randomNormalWith = (mean: number, stdDev: number) => (): number

/**
 * Seeded random number generator.
 */
export class SeededRandom {
  constructor(seed: number)
  next(): number
  range(min: number, max: number): number
  int(min: number, max: number): number
}

/**
 * Create seeded random generator.
 */
export const seeded = (seed: number): SeededRandom

/**
 * Generate random boolean with probability.
 */
export const randomBool = (probability?: number): boolean
export const randomBoolWith = (probability: number) => (): boolean

/**
 * Choose random element from weighted options.
 */
export const randomWeighted = <T>(options: Array<{ value: T; weight: number }>): T
export const randomWeightedWith = <T>(options: Array<{ value: T; weight: number }>) => (): T
```

## Type Definitions

```typescript
/**
 * Positive number type.
 */
export type Positive = number & { readonly __brand: 'Positive' }

/**
 * Negative number type.
 */
export type Negative = number & { readonly __brand: 'Negative' }

/**
 * Integer type.
 */
export type Integer = number & { readonly __brand: 'Integer' }

/**
 * Non-negative number type.
 */
export type NonNegative = number & { readonly __brand: 'NonNegative' }

/**
 * Finite number type.
 */
export type Finite = number & { readonly __brand: 'Finite' }

/**
 * Range type for constraining numbers.
 */
export type InRange<Min extends number, Max extends number> = number & {
  readonly __brand: 'InRange'
  readonly __min: Min
  readonly __max: Max
}
```

## Error Handling

```typescript
/**
 * Safe operations that handle edge cases.
 */
export const safeParseInt = (value: string, radix?: number): number | null
export const safeParseIntOn = (value: string) => (radix?: number): number | null
export const safeParseIntWith = (radix?: number) => (value: string): number | null

export const safeParseFloat = (value: string): number | null

/**
 * Result types for operations that might fail.
 */
export type ParseResult<T> = { success: true; value: T } | { success: false; error: string }

export const tryParseInt = (value: string, radix?: number): ParseResult<number>
export const tryParseIntOn = (value: string) => (radix?: number): ParseResult<number>
export const tryParseIntWith = (radix?: number) => (value: string): ParseResult<number>

export const tryParseFloat = (value: string): ParseResult<number>
```

## Integration with Existing Modules

The `num` module will integrate with existing modules:

1. **Arr**: Numerical array operations (sum, average, etc.)
2. **Str**: Number-to-string conversions and parsing
3. **Mask**: Numerical masking and filtering
4. **Eq**: Numerical equality with precision handling

## Usage Examples

```typescript
import { Num } from '@wollybeard/kit'

// Type predicates
Num.is(42) // true
Num.isInt(42.5) // false
Num.isPositive(-5) // false

// Basic operations - note simpler currying
const add5 = Num.addOn(5)
add5(10) // 15

const divideBy2 = Num.divideWith(2) // Different semantics
divideBy2(10) // 5

const clampToPercent = Num.clampWith(0, 100)
const roundToTwo = Num.roundWith(2)

// Chaining with pipes
pipe(
  42.789,
  Num.multiplyOn(2), // 85.578
  roundToTwo, // 85.58
  clampToPercent, // 85.58
)

// Range operations
Num.range(1, 10) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
Num.times(3, i => i * 2) // [0, 2, 4]

// Formatting
Num.currency(1234.56) // "$1,234.56"
Num.percent(0.875) // "87.5%"
Num.fileSize(1024 * 1024) // "1.0 MB"

// Random generation
Num.randomInRange(1, 10)
const rng = Num.seeded(42)
rng.range(1, 100) // Deterministic random number
```

## Currying Rules Summary

### Only base + `*On` (same semantics):

- `add`, `subtract`, `multiply` - Both parameters are just numbers to combine
- `min`, `max` - Both parameters are numbers to compare
- `gcd`, `lcm` - Both parameters are numbers to process
- `rangeInclusive` - Start and end have same meaning

### All three variants (different semantics):

- `divide` - Dividend vs divisor have different roles
- `power` - Base vs exponent have different meanings
- `mod` - Dividend vs divisor have different roles
- `clamp` - Value vs bounds have different purposes
- `inRange` - Value vs range bounds
- All formatting functions - Value vs options
- `range`, `rangeStep`, `lerp` - Different parameter meanings

### Only base + `*With` (configuration pattern):

- `randomNormalWith` - Configures the generator
- `randomBoolWith` - Configures probability
- `randomWeightedWith` - Configures weights

This design ensures consistency while avoiding unnecessary currying variants where parameters have identical semantics.

## Testing Strategy

1. **Property-based testing** with fast-check for mathematical properties
2. **Edge case testing** for NaN, Infinity, floating-point precision
3. **Type-level testing** for branded types and type predicates
4. **Performance benchmarks** against native operations
5. **Cross-browser compatibility** testing

## Performance Considerations

1. Use native `Math` functions where possible
2. Avoid unnecessary object creation in hot paths
3. Optimize curried functions for common use cases
4. Benchmark against lodash/ramda equivalents
5. Consider WebAssembly for computationally intensive operations

## Future Enhancements

1. **BigInt support**: Operations for arbitrary precision integers
2. **Decimal precision**: Libraries like decimal.js for financial calculations
3. **Complex numbers**: Support for imaginary numbers
4. **Units**: Type-safe units (meters, seconds, etc.)
5. **Validation**: Integration with Zod for runtime validation
