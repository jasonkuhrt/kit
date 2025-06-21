# Num Module

The `Num` module provides comprehensive utilities for working with numbers, including type predicates, mathematical operations, and common number transformations.

## Import

```typescript
import { Num } from '@wollybeard/kit'

// Or import specific functions
import { clamp, isInt, round } from '@wollybeard/kit/num'
```

## Type Predicates

### `is`

Checks if a value is a valid number (excludes `NaN`).

```typescript
Num.is(42) // true
Num.is('42') // false
Num.is(NaN) // false
Num.is(Infinity) // true
```

### `isFinite`

Checks if a value is a finite number.

```typescript
Num.isFinite(42) // true
Num.isFinite(Infinity) // false
Num.isFinite(-Infinity) // false
Num.isFinite(NaN) // false
```

### `isInt`

Checks if a value is an integer.

```typescript
Num.isInt(42) // true
Num.isInt(42.0) // true
Num.isInt(42.5) // false
Num.isInt('42') // false
```

### `isFloat`

Checks if a value is a floating-point number (non-integer).

```typescript
Num.isFloat(42.5) // true
Num.isFloat(42) // false
Num.isFloat(NaN) // false
```

### `isNaN`

Checks if a value is `NaN`.

```typescript
Num.isNaN(NaN) // true
Num.isNaN(0 / 0) // true
Num.isNaN(42) // false
Num.isNaN('not a number') // false
```

### `isPositive` / `isNegative` / `isZero`

Checks the sign of a number.

```typescript
Num.isPositive(42) // true
Num.isPositive(0) // false
Num.isPositive(-42) // false

Num.isNegative(-42) // true
Num.isNegative(0) // false
Num.isNegative(42) // false

Num.isZero(0) // true
Num.isZero(-0) // true
Num.isZero(42) // false
```

### `isEven` / `isOdd`

Checks if an integer is even or odd.

```typescript
Num.isEven(42) // true
Num.isEven(43) // false
Num.isEven(42.5) // false (not an integer)

Num.isOdd(43) // true
Num.isOdd(42) // false
```

### `isSafe`

Checks if a value is a safe integer.

```typescript
Num.isSafe(42) // true
Num.isSafe(Number.MAX_SAFE_INTEGER) // true
Num.isSafe(Number.MAX_SAFE_INTEGER + 1) // false
Num.isSafe(42.5) // false
```

### `inRange`

Checks if a value is within a range (inclusive).

```typescript
Num.inRange(5, 0, 10) // true
Num.inRange(10, 0, 10) // true
Num.inRange(11, 0, 10) // false

// Curried version
const inRange0to10 = Num.inRangeWith(0, 10)
inRange0to10(5) // true
inRange0to10(15) // false
```

## Core Operations

### `clamp`

Restricts a number to be within a range.

```typescript
Num.clamp(5, 0, 10) // 5
Num.clamp(-5, 0, 10) // 0
Num.clamp(15, 0, 10) // 10

// Curried versions
Num.clampOn(5)(0, 10) // 5
Num.clampWith(0, 10)(15) // 10
```

### `abs`

Returns the absolute value.

```typescript
Num.abs(42) // 42
Num.abs(-42) // 42
Num.abs(0) // 0
```

### `sign`

Returns the sign of a number (-1, 0, or 1).

```typescript
Num.sign(42) // 1
Num.sign(-42) // -1
Num.sign(0) // 0
Num.sign(-0) // -0
```

### `inc` / `dec`

Increment or decrement by 1.

```typescript
Num.inc(41) // 42
Num.dec(43) // 42
```

### `safeDiv`

Division with protection against division by zero.

```typescript
Num.safeDiv(10, 2) // 5
Num.safeDiv(10, 0) // 0 (default)
Num.safeDiv(10, 0, -1) // -1 (custom default)

// Curried version
const divWith2 = Num.safeDivWith(2)
divWith2(10) // 5
```

### `mod`

Modulo operation that always returns a positive result.

```typescript
Num.mod(7, 3) // 1
Num.mod(-7, 3) // 2
Num.mod(7, -3) // -2

// Curried version
const mod3 = Num.modWith(3)
mod3(7) // 1
```

## Mathematical Operations

### Basic Arithmetic

```typescript
// Addition
Num.add(2, 3) // 5
Num.addWith(2)(3) // 5

// Subtraction
Num.subtract(5, 3) // 2
Num.subtractWith(5)(3) // 2

// Multiplication
Num.multiply(3, 4) // 12
Num.multiplyWith(2)(5) // 10

// Division
Num.divide(10, 2) // 5
Num.divideWith(2)(10) // 5

// Power
Num.power(2, 3) // 8
Num.powerWith(2)(3) // 9 (3²)
```

### Rounding Operations

```typescript
// Round to nearest integer
Num.round(1.4) // 1
Num.round(1.5) // 2

// Round with precision
Num.round(1.2345, 2) // 1.23
Num.round(1.2355, 2) // 1.24

// Curried version
const round2 = Num.roundWith(2)
round2(1.2345) // 1.23

// Other rounding operations
Num.floor(1.9) // 1
Num.ceil(1.1) // 2
Num.trunc(1.9) // 1
Num.trunc(-1.9) // -1
```

### Roots and Logarithms

```typescript
// Square root
Num.sqrt(9) // 3
Num.sqrt(2) // 1.4142135623730951

// Cube root
Num.cbrt(8) // 2
Num.cbrt(27) // 3

// Logarithms
Num.log(Math.E) // 1 (natural log)
Num.log10(100) // 2
Num.log2(8) // 3
```

### Trigonometry

```typescript
// Basic trig functions (radians)
Num.sin(Math.PI / 2) // 1
Num.cos(Math.PI) // -1
Num.tan(Math.PI / 4) // ~1

// Inverse trig functions
Num.asin(1) // π/2
Num.acos(0) // π/2
Num.atan(1) // π/4
Num.atan2(1, 1) // π/4

// Angle conversion
Num.degToRad(180) // π
Num.radToDeg(Math.PI) // 180
```

### Min/Max and GCD/LCM

```typescript
// Min and max
Num.min(3, 5) // 3
Num.max(3, 5) // 5

// Greatest common divisor
Num.gcd(12, 8) // 4
Num.gcd(17, 19) // 1

// Least common multiple
Num.lcm(4, 6) // 12
Num.lcm(3, 5) // 15
```

## Constants

```typescript
Num.PI // 3.141592653589793
Num.E // 2.718281828459045
Num.TAU // 6.283185307179586 (2π)
Num.GOLDEN_RATIO // 1.618033988749895
```

## Common Patterns

### Value Clamping

```typescript
// Ensure a value stays within bounds
const clampPercentage = Num.clampWith(0, 100)

clampPercentage(50) // 50
clampPercentage(150) // 100
clampPercentage(-10) // 0
```

### Safe Arithmetic

```typescript
// Avoid division by zero
const calculateAverage = (sum: number, count: number) =>
  Num.safeDiv(sum, count, 0)

calculateAverage(100, 5) // 20
calculateAverage(100, 0) // 0
```

### Rounding Pipeline

```typescript
import { Fn } from '@wollybeard/kit'

// Round to 2 decimal places after calculations
const calculateTax = Fn.pipe(
  (price: number) => price * 0.08,
  Num.roundWith(2),
)

calculateTax(19.99) // 1.60
```

### Number Validation

```typescript
const validateAge = (value: unknown): number | null => {
  if (!Num.is(value)) return null
  if (!Num.isInt(value)) return null
  if (!Num.inRange(value, 0, 150)) return null
  return value
}

validateAge(25) // 25
validateAge(25.5) // null
validateAge('25') // null
validateAge(200) // null
```
