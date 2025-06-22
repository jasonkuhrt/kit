# Num Module Design

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
├── $.ts          # Namespace export: export * as Num from './$$.ts' ✅
├── $$.ts         # Barrel export: export * from './*.ts' ✅
├── $.test.ts     # Comprehensive tests ✅
├── num.ts        # Core number operations ✅
├── math.ts       # Mathematical operations and constants ✅
├── format.ts     # Number formatting utilities ❌ TODO
├── range.ts      # Range operations and generation ✅
└── random.ts     # Random number generation ❌ TODO
```

## API Design

### Type Predicates & Validation (`num.ts`) ✅ COMPLETED

All type predicates have been implemented with branded types for enhanced type safety:

- `is`, `isFinite`, `isInt`, `isFloat`, `isNaN`
- `isPositive`, `isNegative`, `isZero`
- `isEven`, `isOdd`, `isSafeInt` (renamed from `isSafe`)
- `inRange` with curried variants `inRangeOn` and `inRangeWith`
- Additional predicates: `isNonNegative`, `isNonPositive`

### Core Operations (`num.ts`) ✅ COMPLETED

All core operations have been implemented:

- `clamp`, `clampOn`, `clampWith` - with type-safe range constraints
- `abs` - returns appropriate branded types
- `sign` - returns precise -1 | 0 | 1 type
- `inc`, `dec` - simple increment/decrement
- `safeDiv` - now returns `null` instead of default value (safer API)
- `mod`, `modOn`, `modWith` - always returns non-negative result

Note: Curried variants follow `*With` pattern, not `*By`

### Mathematical Operations (`math.ts`) ✅ COMPLETED

All mathematical operations have been implemented with:

- **Arithmetic**: `add`/`addWith`, `subtract`/`subtractWith`, `multiply`/`multiplyWith`, `divide`/`divideWith`, `power`/`powerWith`
- **Rounding**: `round`/`roundWith`, `floor`, `ceil`, `trunc` - all with type-safe return types
- **Roots & Logs**: `sqrt`, `cbrt`, `log`, `log10`, `log2` - with appropriate input constraints
- **Trigonometry**: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`/`atan2With` - with finite/range constraints
- **Angle Conversion**: `degToRad`, `radToDeg` - with branded Degrees/Radians types
- **Comparison**: `min`/`minWith`, `max`/`maxWith`
- **Number Theory**: `gcd`/`gcdWith`, `lcm`/`lcmWith`
- **Constants**: `PI`, `E`, `TAU`, `GOLDEN_RATIO`

All functions use `Fn.curry` for 2-parameter functions and follow the `*With` naming pattern.
Enhanced with JSDoc including @category tags and MDN reference links.

### Number Formatting (`format.ts`) ❌ TODO

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
export const percentWith = (options: PercentOptions) => (value: number): string

/**
 * Format with thousands separators.
 */
export const thousands = (value: number, separator?: string): string
export const thousandsWith = (separator: string) => (value: number): string

/**
 * Format to fixed decimal places.
 */
export const toFixed = (value: number, digits: number): string
export const toFixedWith = (digits: number) => (value: number): string

/**
 * Format in scientific notation.
 */
export const toExponential = (value: number, fractionDigits?: number): string
export const toExponentialWith = (fractionDigits: number) => (value: number): string

/**
 * Format with precision.
 */
export const toPrecision = (value: number, precision: number): string
export const toPrecisionWith = (precision: number) => (value: number): string

/**
 * Format as ordinal (1st, 2nd, 3rd, etc.).
 */
export const ordinal = (value: number, locale?: string): string
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
export const fileSizeWith = (options: FileSizeOptions) => (bytes: number): string
```

### Range Operations (`range.ts`) ✅ COMPLETED

All range operations have been implemented with comprehensive tests:

- **Range Generation**: `range`, `rangeFrom`, `rangeTo`, `rangeStep`, `rangeStepWith`, `rangeInclusive`, `sequence`
  - Supports custom steps, inclusive/exclusive ranges, and automatic direction detection
  - Uses index-based iteration to avoid floating point accumulation errors
  - Handles edge cases like zero step and reverse ranges

- **Iteration**: `times`, `timesWith`
  - Execute functions n times with index parameter
  - Type-safe with generic support
  - Validates non-negative integer counts

- **Interpolation**: `lerp`, `lerpBetween`
  - Linear interpolation between values
  - Handles extrapolation (t outside [0,1])
  - Edge case handling for infinite values and overflow

- **Range Mapping**: `mapRange`, `mapRangeFrom`
  - Maps values from one range to another
  - Preserves endpoints exactly
  - Handles zero-width source range errors
  - Robust handling of large numbers and precision issues

- **Wrapping**: `wrap`, `wrapWithin`
  - Wraps values within a range (modulo-like behavior)
  - Used for angles, time, and cyclic values
  - Robust algorithm for edge cases and floating point precision

All functions follow the `*With` currying pattern and include extensive property-based tests.

### Random Number Generation (`random.ts`) ❌ TODO

```typescript
/**
 * Generate random number between 0 and 1.
 */
export const random = (): number

/**
 * Generate random number in range.
 */
export const randomInRange = (min: number, max: number): number
export const randomBetween = (min: number, max: number): number

/**
 * Generate random integer.
 */
export const randomInt = (min: number, max: number): number
export const randomIntBetween = (min: number, max: number): number

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
export const randomWeightedFrom = <T>(options: Array<{ value: T; weight: number }>) => (): T
```

## Type Definitions ✅ COMPLETED

Branded types have been implemented with enhanced type safety:

- `Positive`, `Negative`, `Zero` - sign-based brands
- `Int`, `Float`, `SafeInt` - numeric type brands
- `NonNegative`, `NonPositive` - boundary brands
- `Finite` - excludes NaN and infinities
- `Even`, `Odd` - parity brands (stackable with Int)
- `InRange<Min, Max>` - compile-time range constraints
- `Percentage` - alias for InRange<0, 1>
- `Radians`, `Degrees` - angle type brands
- Additional brands in subdirectories for `Natural`, `Whole`, `NonZero`

All brands use a unified `WithBrand<T, Brand>` utility for consistency.

## Error Handling ❌ TODO

```typescript
/**
 * Safe operations that handle edge cases.
 */
export const safeParseInt = (value: string, radix?: number): number | null
export const safeParseFloat = (value: string): number | null

/**
 * Result types for operations that might fail.
 */
export type ParseResult<T> = { success: true; value: T } | { success: false; error: string }

export const tryParseInt = (value: string, radix?: number): ParseResult<number>
export const tryParseFloat = (value: string): ParseResult<number>
```

## Integration with Existing Modules ✅ PARTIALLY COMPLETED

The `num` module integrates with:

1. **Fn**: Using `Fn.curry` for all 2-parameter functions ✅
2. **Arr**: Numerical array operations (sum, average, etc.) ❌ TODO
3. **Str**: Number-to-string conversions and parsing ❌ TODO
4. **Mask**: Numerical masking and filtering ❌ TODO
5. **Eq**: Numerical equality with precision handling ❌ TODO

## Usage Examples

```typescript
import { Num } from '@wollybeard/kit'

// Type predicates
Num.is(42) // true
Num.isInt(42.5) // false
Num.isPositive(-5) // false

// Curried operations
const clampToPercent = Num.clampWith(0, 100)
const multiplyByTwo = Num.multiplyBy(2)
const roundToTwo = Num.roundTo(2)

// Chaining with pipes
pipe(
  42.789,
  multiplyByTwo,
  roundToTwo,
  clampToPercent,
) // 85.58

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

## Testing Strategy ✅ COMPLETED

Comprehensive test suite implemented using:

1. **Property-based testing** with fast-check for all mathematical properties ✅
2. **Edge case testing** for NaN, Infinity, floating-point precision ✅
3. **Type-level testing** for branded types and type predicates ✅
4. **Performance benchmarks** against native operations ❌ TODO
5. **Cross-browser compatibility** testing ❌ TODO

All core functionality has extensive property-based tests ensuring mathematical correctness.

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
