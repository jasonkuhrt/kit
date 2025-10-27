# Num

Numeric types and utilities with branded types for mathematical constraints.

Provides branded number types (Positive, Negative, Even, Odd, etc.) with runtime validation, mathematical operations, range types, and specialized numeric domains like Complex, Ratio, and BigInt. Includes type guards, ordering, and equivalence utilities.

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'
```

:::

## Angle Conversion

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `degToRad`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L790" /> {#f-deg-to-rad-790}

```typescript
(degrees: Degrees): Radians
```

**Parameters:**

- `degrees` - The angle in degrees

**Returns:** The angle in radians

Convert degrees to radians. Most JavaScript math functions expect angles in radians, but humans often think in degrees. This converts from the familiar degree system (0-360) to radians (0-2π).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `radToDeg`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L820" /> {#f-rad-to-deg-820}

```typescript
(radians: Radians): Degrees
```

**Parameters:**

- `radians` - The angle in radians

**Returns:** The angle in degrees

Convert radians to degrees. Math functions return angles in radians, but you might want to display them in degrees. This converts from radians (0-2π) to the familiar degree system (0-360).

## Arithmetic

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `add`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L27" /> {#f-add-27}

```typescript
(a: number, b: number): number
```

**Parameters:**

- `a` - The first number to add
- `b` - The second number to add

**Returns:** The sum of a and b

Add two numbers together.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L48" /> {#c-add-with-48}

```typescript
;((a: number) => (b: number) => number)
```

Create a function that adds a specific number to any other number. This is useful when you want to add the same number multiple times.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `subtract`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L65" /> {#f-subtract-65}

```typescript
(a: number, b: number): number
```

**Parameters:**

- `a` - The number to subtract from (minuend)
- `b` - The number to subtract (subtrahend)

**Returns:** The difference between a and b

Subtract one number from another. Takes the second number away from the first number.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L88" /> {#c-subtract-with-88}

```typescript
;((a: number) => (b: number) => number)
```

Create a function that subtracts other numbers from a specific number. This is useful when you have a starting value and want to subtract various amounts from it.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `multiply`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L106" /> {#f-multiply-106}

```typescript
(a: number, b: number): number
```

**Parameters:**

- `a` - The first number (multiplicand)
- `b` - The second number (multiplier)

**Returns:** The product of a and b

Multiply two numbers together. This gives you the result of adding a number to itself b times.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L132" /> {#c-multiply-with-132}

```typescript
;((b: number) => (a: number) => number)
```

Create a function that multiplies any number by a specific factor. This is useful for scaling values or converting units.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `divide`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L151" /> {#f-divide-151}

```typescript
(dividend: number, divisor: NonZero): number
```

**Parameters:**

- `dividend` - The number to be divided (what you're splitting up)
- `divisor` - The non-zero number to divide by (how many parts to split into)

**Returns:** The quotient (result of division)

Divide one number by another. This splits the first number into equal parts based on the second number. The divisor must be non-zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `divideWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L177" /> {#f-divide-with-177}

```typescript
(divisor: NonZero): (dividend: number) => number
```

**Parameters:**

- `divisor` - The non-zero number to divide by

**Returns:** A function that divides its input by the divisor

Create a function that divides any number by a specific divisor. This is useful for splitting values into fixed portions.

## Comparison

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `min`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L853" /> {#f-min-853}

```typescript
<A extends number, B extends number > (a: A, b: B): Min<A, B>
```

**Parameters:**

- `a` - The first number to compare
- `b` - The second number to compare

**Returns:** The smaller of the two numbers

Find the smaller of two numbers. Returns whichever number is less.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `minWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L866" /> {#c-min-with-866}

```typescript
;((a: number) => (b: number) => number)
```

Create a function that finds the minimum with a fixed first value. Useful for clamping or limiting values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `max`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L897" /> {#f-max-897}

```typescript
<A extends number, B extends number > (a: A, b: B): Max<A, B>
```

**Parameters:**

- `a` - The first number to compare
- `b` - The second number to compare

**Returns:** The larger of the two numbers

Find the larger of two numbers. Returns whichever number is greater.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `maxWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L910" /> {#c-max-with-910}

```typescript
;((a: number) => (b: number) => number)
```

Create a function that finds the maximum with a fixed first value. Useful for ensuring minimum values.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PI`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L1039" /> {#c-pi-1039}

```typescript
number
```

The mathematical constant pi (π). Pi is the ratio of a circle's circumference to its diameter. Approximately 3.14159...

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `E`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L1059" /> {#c-e-1059}

```typescript
number
```

The mathematical constant e (Euler's number). The base of natural logarithms, approximately 2.71828... It appears naturally in exponential growth and compound interest.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `TAU`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L1081" /> {#c-tau-1081}

```typescript
number
```

The mathematical constant tau (τ). Tau is 2π, representing a full circle in radians. Some mathematicians prefer tau over pi for circular calculations. Approximately 6.28318...

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `GOLDEN_RATIO`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L1105" /> {#c-golden_ratio-1105}

```typescript
number
```

The golden ratio (φ, phi). A special number appearing in nature, art, and architecture. When a line is divided so that the whole length divided by the long part equals the long part divided by the short part. Approximately 1.61803...

## Exponentiation

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `power`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L204" /> {#f-power-204}

```typescript
(base: number, exponent: number): number
```

**Parameters:**

- `base` - The number to be multiplied by itself
- `exponent` - How many times to multiply the base by itself

**Returns:** The result of base raised to the exponent power

Raise a number to a power (exponentiation). This multiplies the base number by itself 'exponent' times. For best results, use finite numbers to avoid NaN/Infinity.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `powerWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L230" /> {#c-power-with-230}

```typescript
;((exponent: number) => (base: number) => number)
```

Create a function that raises any number to a specific power. This is useful for repeated exponentiations.

## Interpolation

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `lerp`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L259" /> {#f-lerp-259}

```typescript
(start: number, end: number, t: number): number
```

**Parameters:**

- `start` - The starting value (when t = 0)
- `end` - The ending value (when t = 1)
- `t` - The interpolation factor (typically between 0 and 1)

**Returns:** The interpolated value

Linear interpolation between two values. Calculates a value between start and end based on the interpolation factor t.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `lerpBetween`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L309" /> {#f-lerp-between-309}

```typescript
(start: number, end: number): (t: number) => number
```

**Parameters:**

- `start` - The starting value
- `end` - The ending value

**Returns:** A function that takes t and returns the interpolated value

Create a function that linearly interpolates between two fixed values. Useful for creating reusable interpolation functions.

## Iteration

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `times`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L200" /> {#f-times-200}

```typescript
<T>(n: number, fn: (index: number) => T): T[]
```

**Parameters:**

- `n` - The number of times to execute the function
- `fn` - The function to execute, receives the current index

**Returns:** An array of the function results

Execute a function n times and collect the results. The function receives the current index (0-based) as its argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `timesWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L229" /> {#f-times-with-229}

```typescript
<T>(fn: (index: number) => T): (n: number) => T[]
```

**Parameters:**

- `fn` - The function to execute

**Returns:** A function that takes n and returns the results array

Create a function that executes another function n times. Useful for partial application of the times function.

## Logarithms

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `log`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L475" /> {#f-log-475}

```typescript
(value: Positive): number
```

**Parameters:**

- `value` - The positive number to find the natural logarithm of

**Returns:** The natural logarithm of the value

Calculate the natural logarithm (base e) of a number. The logarithm tells you what power you need to raise e (≈2.718) to get your number. It's the inverse operation of exponential (e^x).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `log10`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L502" /> {#f-log10-502}

```typescript
(value: Positive): number
```

**Parameters:**

- `value` - The positive number to find the base-10 logarithm of

**Returns:** The base-10 logarithm of the value

Calculate the base-10 logarithm of a number. This tells you what power you need to raise 10 to get your number. It's commonly used for measuring orders of magnitude.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `log2`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L530" /> {#f-log2-530}

```typescript
(value: Positive): number
```

**Parameters:**

- `value` - The positive number to find the base-2 logarithm of

**Returns:** The base-2 logarithm of the value

Calculate the base-2 logarithm of a number. This tells you what power you need to raise 2 to get your number. It's commonly used in computer science for binary operations.

## Number Theory

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `gcd`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L941" /> {#f-gcd-941}

```typescript
(a: Int, b: Int): Natural
```

**Parameters:**

- `a` - The first integer
- `b` - The second integer

**Returns:** The greatest common divisor as a positive integer

Find the greatest common divisor (GCD) of two integers. The GCD is the largest positive integer that divides both numbers evenly. Also known as the greatest common factor (GCF).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `gcdWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L971" /> {#c-gcd-with-971}

```typescript
;((a: Int) => (b: Int) => Natural)
```

Create a function that finds the GCD with a fixed first value. Useful for finding common factors with a specific number.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `lcm`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L1002" /> {#f-lcm-1002}

```typescript
(a: Int, b: Int): Whole
```

**Parameters:**

- `a` - The first integer
- `b` - The second integer

**Returns:** The least common multiple as a non-negative integer

Find the least common multiple (LCM) of two integers. The LCM is the smallest positive integer that is divisible by both numbers. Returns 0 if either input is 0.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `lcmWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L1020" /> {#c-lcm-with-1020}

```typescript
;((a: Int) => (b: Int) => Whole)
```

Create a function that finds the LCM with a fixed first value. Useful for finding common multiples with a specific number.

## Range Generation

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `range`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L43" /> {#f-range-43}

```typescript
(start: number, end: number, options?: RangeOptions | undefined): number[]
```

**Parameters:**

- `start` - The starting value (inclusive)
- `end` - The ending value (exclusive by default)
- `options` - Configuration options

**Returns:** An array of numbers in the range

Generate an array of numbers in a range. By default, the range is exclusive of the end value and uses a step of 1.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `rangeFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L96" /> {#f-range-from-96}

```typescript
(start: number): (end: number, options?: RangeOptions | undefined) => number[]
```

**Parameters:**

- `start` - The starting value

**Returns:** A function that takes end and options and returns the range

Create a function that generates a range from a specific start value. Useful for creating ranges with a fixed starting point.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `rangeTo`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L117" /> {#f-range-to-117}

```typescript
(end: number): (start: number, options?: RangeOptions | undefined) => number[]
```

**Parameters:**

- `end` - The ending value

**Returns:** A function that takes start and options and returns the range

Create a function that generates a range to a specific end value. Useful for creating ranges with a fixed ending point.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `rangeStep`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L136" /> {#f-range-step-136}

```typescript
(start: number, end: number, step: number): number[]
```

**Parameters:**

- `start` - The starting value
- `end` - The ending value
- `step` - The step between values

**Returns:** An array of numbers in the range

Generate a range with a specific step. A convenience function that makes the step explicit.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `rangeStepWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L157" /> {#f-range-step-with-157}

```typescript
(step: number): (start: number, end: number) => number[]
```

**Parameters:**

- `step` - The step between values

**Returns:** A function that takes start and end and returns the range

Create a function that generates ranges with a specific step. Useful for creating consistent stepped ranges.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `rangeInclusive`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L175" /> {#f-range-inclusive-175}

```typescript
(start: number, end: number): number[]
```

**Parameters:**

- `start` - The starting value
- `end` - The ending value (inclusive)

**Returns:** An array of numbers from start to end (inclusive)

Create an inclusive range. A convenience function that always includes the end value.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `sequence`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L440" /> {#f-sequence-440}

```typescript
(n: number): number[]
```

**Parameters:**

- `n` - The number of integers to generate

**Returns:** An array of integers from 0 to n-1

Generate a sequence of integers starting from 0. A convenience function equivalent to range(0, n).

## Range Mapping

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapRange`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L339" /> {#f-map-range-339}

```typescript
(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number
```

**Parameters:**

- `value` - The value to map
- `fromMin` - The minimum of the source range
- `fromMax` - The maximum of the source range
- `toMin` - The minimum of the target range
- `toMax` - The maximum of the target range

**Returns:** The mapped value in the target range

Map a value from one range to another. Converts a value from the source range [fromMin, fromMax] to the target range [toMin, toMax].

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapRangeFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L414" /> {#f-map-range-from-414}

```typescript
(fromMin: number, fromMax: number, toMin: number, toMax: number): (value: number) => number
```

**Parameters:**

- `fromMin` - The minimum of the source range
- `fromMax` - The maximum of the source range
- `toMin` - The minimum of the target range
- `toMax` - The maximum of the target range

**Returns:** A function that takes a value and returns the mapped value

Create a function that maps values from one range to another. Useful for creating reusable range mapping functions.

## Range Operations

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `wrap`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L471" /> {#f-wrap-471}

```typescript
(value: number, min: number, max: number): number
```

**Parameters:**

- `value` - The value to wrap
- `min` - The minimum of the range
- `max` - The maximum of the range

**Returns:** The wrapped value within [min, max)

Constrain a value to be within a range, wrapping around if necessary. Unlike clamp which stops at boundaries, wrap continues from the other side.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `wrapWithin`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L534" /> {#f-wrap-within-534}

```typescript
(min: number, max: number): (value: number) => number
```

**Parameters:**

- `min` - The minimum of the range
- `max` - The maximum of the range

**Returns:** A function that takes a value and returns the wrapped value

Create a function that wraps values within a specific range.

## Roots

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `sqrt`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L429" /> {#f-sqrt-429}

```typescript
<T extends NonNegative>(value: T): Sqrt<T>
```

**Parameters:**

- `value` - The non-negative number to find the square root of

**Returns:** The square root of the value

Calculate the square root of a non-negative number. The square root is a number that, when multiplied by itself, gives the original number. For type safety, this requires a non-negative input to avoid NaN results.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `cbrt`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L451" /> {#f-cbrt-451}

```typescript
(value: number): number
```

**Parameters:**

- `value` - The number to find the cube root of

**Returns:** The cube root of the value

Calculate the cube root of a number. The cube root is a number that, when multiplied by itself three times, gives the original number.

## Rounding

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `round`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L258" /> {#f-round-258}

```typescript
(value: number, precision?: number = 0): number
```

**Parameters:**

- `value` - The number to round
- `precision` - Number of decimal places to keep (default: 0 for whole numbers)

**Returns:** The rounded number

Round a number to the nearest integer or to a specific number of decimal places. Rounding follows standard rules: 0.5 and above rounds up, below 0.5 rounds down.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `roundWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L286" /> {#c-round-with-286}

```typescript
;((precision?: number | undefined) => (value: number) => number)
```

Create a function that rounds numbers to a specific number of decimal places. This is useful when you need consistent precision across multiple values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `floor`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L319" /> {#f-floor-319}

```typescript
<T extends Finite>(value: T): Int
```

**Parameters:**

- `value` - The finite number to round down

**Returns:** The largest integer less than or equal to the value

Round a number down to the nearest integer. This always rounds towards negative infinity, removing any decimal part. The input must be finite to ensure a valid integer result.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `ceil`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L355" /> {#f-ceil-355}

```typescript
<T extends Finite>(value: T): Int
```

**Parameters:**

- `value` - The finite number to round up

**Returns:** The smallest integer greater than or equal to the value

Round a number up to the nearest integer. This always rounds towards positive infinity. The input must be finite to ensure a valid integer result.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `trunc`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L390" /> {#f-trunc-390}

```typescript
<T extends Finite>(value: T): Int
```

**Parameters:**

- `value` - The finite number to truncate

**Returns:** The integer part of the number

Remove the decimal part of a number (truncate). This simply cuts off the decimal portion, always rounding towards zero. The input must be finite to ensure a valid integer result.

## Trigonometry

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `sin`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L565" /> {#f-sin-565}

```typescript
<T extends Finite>(radians: T): Sin<_T>
```

**Parameters:**

- `radians` - The angle in radians (must be finite)

**Returns:** The sine of the angle, always between -1 and 1

Calculate the sine of an angle. Sine is a trigonometric function that represents the ratio of the opposite side to the hypotenuse in a right triangle. The angle must be in radians and finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `cos`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L600" /> {#f-cos-600}

```typescript
<T extends Finite>(radians: T): Cos<_T>
```

**Parameters:**

- `radians` - The angle in radians (must be finite)

**Returns:** The cosine of the angle, always between -1 and 1

Calculate the cosine of an angle. Cosine is a trigonometric function that represents the ratio of the adjacent side to the hypotenuse in a right triangle. The angle must be in radians and finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tan`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L628" /> {#f-tan-628}

```typescript
(radians: Finite): number
```

**Parameters:**

- `radians` - The angle in radians (must be finite)

**Returns:** The tangent of the angle

Calculate the tangent of an angle. Tangent is the ratio of sine to cosine, or the ratio of the opposite side to the adjacent side in a right triangle. The angle must be in radians and finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `asin`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L658" /> {#f-asin-658}

```typescript
(value: InRange<-1, 1>): Radians
```

**Parameters:**

- `value` - A number between -1 and 1 (inclusive)

**Returns:** The angle in radians, between -PI/2 and PI/2

Calculate the arcsine (inverse sine) of a value. This gives you the angle whose sine is the input value. The input must be in the range [-1, 1] to get a valid result. The result is in radians.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `acos`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L689" /> {#f-acos-689}

```typescript
(value: InRange<-1, 1>): Radians
```

**Parameters:**

- `value` - A number between -1 and 1 (inclusive)

**Returns:** The angle in radians, between 0 and PI

Calculate the arccosine (inverse cosine) of a value. This gives you the angle whose cosine is the input value. The input must be in the range [-1, 1] to get a valid result. The result is in radians.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `atan`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L718" /> {#f-atan-718}

```typescript
(value: Finite): Radians
```

**Parameters:**

- `value` - Any finite number (the tangent of the angle)

**Returns:** The angle in radians, between -PI/2 and PI/2

Calculate the arctangent (inverse tangent) of a value. This gives you the angle whose tangent is the input value. The input must be finite to get a meaningful angle. The result is in radians.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `atan2`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L749" /> {#f-atan2-749}

```typescript
(y: Finite, x: Finite): Radians
```

**Parameters:**

- `y` - The y-coordinate of the point (must be finite)
- `x` - The x-coordinate of the point (must be finite)

**Returns:** The angle in radians, between -PI and PI

Calculate the angle from the positive x-axis to a point (x, y). This is like atan(y/x) but handles all quadrants correctly and avoids division by zero. Both coordinates must be finite to get a meaningful angle. The result is in radians.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `atan2With`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L762" /> {#c-atan2with-762}

```typescript
;((y: Finite) => (x: Finite) => Radians)
```

Create a function that calculates atan2 with a fixed y value. Useful for repeated calculations with the same y offset.

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Eq`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/traits/eq.ts#L21" /> {#c-eq-21}

```typescript
Eq<number>
```

Eq trait implementation for numbers.

Provides number equality comparison using strict equality (===). Handles special cases like NaN, which is never equal to itself.

**Examples:**

```typescript twoslash
// @noErrors
import { Num } from '@wollybeard/kit'

// [!code word:is:1]
Num.Eq.is(42, 42) // true
// [!code word:is:1]
Num.Eq.is(3.14, 3.14) // true
// [!code word:is:1]
Num.Eq.is(0, -0) // true (positive and negative zero are equal)
// [!code word:is:1]
Num.Eq.is(NaN, NaN) // false (NaN is never equal to itself)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Type`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/traits/type.ts#L20" /> {#c-type-20}

```typescript
Type<number>
```

Type trait implementation for numbers.

Provides type checking for number values using typeof.

**Examples:**

```typescript twoslash
// @noErrors
import { Num } from '@wollybeard/kit'

// [!code word:is:1]
Num.Type.is(42) // true
// [!code word:is:1]
Num.Type.is(3.14) // true
// [!code word:is:1]
Num.Type.is(NaN) // true (NaN is a number)
// [!code word:is:1]
Num.Type.is('42') // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Floor`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L292" /> {#t-floor-292}

```typescript
type Floor<_T extends number> = Int
```

Type-level floor transformation. Floor always returns an integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Ceil`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L327" /> {#t-ceil-327}

```typescript
type Ceil<_T extends number> = Int
```

Type-level ceil transformation. Ceil always returns an integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Trunc`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L363" /> {#t-trunc-363}

```typescript
type Trunc<_T extends number> = Int
```

Type-level trunc transformation. Trunc always returns an integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Sqrt`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L399" /> {#t-sqrt-399}

```typescript
type Sqrt<T extends number> = T extends Positive ? Positive
  : T extends NonNegative ? NonNegative
  : number
```

Type-level sqrt transformation. Square root of non-negative returns non-negative. Square root of positive returns positive (except for 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Sin`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L538" /> {#t-sin-538}

```typescript
type Sin<_T extends number> = InRange<-1, 1>
```

Type-level sine transformation. Sine always returns a value in the range [-1, 1].

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Cos`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L573" /> {#t-cos-573}

```typescript
type Cos<_T extends number> = InRange<-1, 1>
```

Type-level cosine transformation. Cosine always returns a value in the range [-1, 1].

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Min`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L828" /> {#u-min-828}

```typescript
type Min<A extends number, B extends number> = A | B
```

Type-level min transformation. Returns the union of both input types (the more general type).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Max`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/math.ts#L872" /> {#u-max-872}

```typescript
type Max<A extends number, B extends number> = A | B
```

Type-level max transformation. Returns the union of both input types (the more general type).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L16" /> {#f-is-16}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is a number. Excludes NaN by default.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isNaN`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L23" /> {#f-is-na-n-23}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is NaN.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Abs`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L31" /> {#t-abs-31}

```typescript
type Abs<T extends number> = T extends Positive ? Positive
  : T extends Negative ? Positive
  : T extends NonPositive ? NonNegative
  : T extends Zero ? Zero
  : NonNegative
```

Type-level absolute value transformation. Maps number types to their absolute value types.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `abs`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L50" /> {#f-abs-50}

```typescript
<T extends number>(value: T): Abs<T>
```

**Parameters:**

- `value` - The number to get absolute value of

**Returns:** The absolute value with appropriate branded type

Get absolute value. Returns the non-negative magnitude of a number.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Sign`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L58" /> {#t-sign-58}

```typescript
type Sign<T extends number> = T extends Positive ? 1
  : T extends Negative ? -1
  : T extends Zero ? 0
  : -1 | 0 | 1
```

Type-level sign transformation. Maps number types to their sign (-1, 0, 1).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `sign`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L78" /> {#f-sign-78}

```typescript
<T extends number>(value: T): Sign<T>
```

**Parameters:**

- `value` - The number to get the sign of

**Returns:** -1, 0, or 1 with precise type

Get sign of number (-1, 0, 1). Returns -1 for negative numbers, 0 for zero, and 1 for positive numbers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `inc`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L85" /> {#f-inc-85}

```typescript
(value: number): number
```

Increment by 1.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `dec`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L92" /> {#f-dec-92}

```typescript
(value: number): number
```

Decrement by 1.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Mod`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L100" /> {#t-mod-100}

```typescript
type Mod<_T extends number, _U extends NonZero> = NonNegative
```

Type-level modulo transformation. Modulo always returns a non-negative result.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mod`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L123" /> {#f-mod-123}

```typescript
<T extends number, U extends NonZero > (dividend: T, divisor: U): NonNegative
```

**Parameters:**

- `dividend` - The number to divide
- `divisor` - The non-zero number to divide by

**Returns:** The positive remainder

Modulo operation that always returns positive result. Unlike the % operator, this always returns a non-negative result. The divisor must be non-zero for a valid result.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `modOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L141" /> {#f-mod-on-141}

```typescript
<T extends number>(dividend: T): <U extends NonZero>(divisor: U) => NonNegative
```

**Parameters:**

- `dividend` - The fixed dividend

**Returns:** A function that takes a divisor and returns the modulo

Create a function that calculates modulo with a fixed dividend.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `modWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L162" /> {#f-mod-with-162}

```typescript
<U extends NonZero>(divisor: U): <T extends number>(dividend: T) => NonNegative
```

**Parameters:**

- `divisor` - The fixed non-zero divisor

**Returns:** A function that takes a dividend and returns the modulo

Create a function that calculates modulo with a fixed divisor. Useful for wrapping values in a fixed range.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Literal`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L169" /> {#u-literal-169}

```typescript
type Literal =
  | LiteralZero
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | LiteralInfinity
```

Number literal type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PlusOne`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L200" /> {#t-plus-one-200}

```typescript
type PlusOne<$n extends Literal> = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  never,
][
  $n
]
```

Add one to a number literal type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `MinusOne`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/operations.ts#L229" /> {#t-minus-one-229}

```typescript
type MinusOne<$n extends Literal> = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
][
  $n
]
```

Subtract one from a number literal type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `RangeOptions`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/range.ts#L4" /> {#i-range-options-4}

```typescript
interface RangeOptions {
  /**
   * The step between each number in the range.
   * @default 1
   */
  step?: number
  /**
   * Whether to include the end value in the range.
   * @default false
   */
  inclusive?: boolean
}
```

Options for generating numeric ranges.
