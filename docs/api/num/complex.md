# Num.Complex

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Complex
```

```typescript [Barrel]
import { Complex } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L52" />

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a Complex number

Type predicate to check if value is a Complex number.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(real: number, imaginary?: number = 0): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L83" />

**Parameters:**

- `real` - The real part
- `imaginary` - The imaginary part (default: 0)

**Returns:** The complex number

Construct a Complex number from real and imaginary parts.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `real`

```typescript
(real: number): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L135" />

**Parameters:**

- `real` - The real value

**Returns:** Complex number with zero imaginary part

Create a real complex number (imaginary part = 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `imaginary`

```typescript
(imaginary: number): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L148" />

**Parameters:**

- `imaginary` - The imaginary value

**Returns:** Complex number with zero real part

Create a pure imaginary complex number (real part = 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `add`

```typescript
(a: Complex, b: Complex): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L193" />

**Parameters:**

- `a` - First complex number to add
- `b` - Second complex number to add

**Returns:** A new complex number that is the sum of a and b

Add two complex numbers together.

When adding complex numbers, you add the real parts together and the imaginary parts together. Formula: (a + bi) + (c + di) = (a + c) + (b + d)i

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `subtract`

```typescript
(a: Complex, b: Complex): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L256" />

**Parameters:**

- `a` - First complex number (minuend)
- `b` - Second complex number (subtrahend)

**Returns:** The difference

Subtract two complex numbers. (a + bi)

- (c + di) = (a
- c) + (b
- d)i

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `multiply`

```typescript
(a: Complex, b: Complex): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L306" />

**Parameters:**

- `a` - First complex number
- `b` - Second complex number

**Returns:** The product

Multiply two complex numbers. (a + bi)(c + di) = (ac

- bd) + (ad + bc)i

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `divide`

```typescript
(a: Complex, b: Complex): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L375" />

**Parameters:**

- `a` - First complex number (dividend)
- `b` - Second complex number (divisor)

**Returns:** The quotient

**Throws:**

- Error if divisor is zero

Divide two complex numbers. (a + bi) / (c + di) = [(a + bi)(c

- di)] / (c² + d²)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `conjugate`

```typescript
(z: Complex): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L462" />

**Parameters:**

- `z` - The complex number

**Returns:** The complex conjugate with imaginary part sign flipped

Get the complex conjugate by flipping the sign of the imaginary part.

The complex conjugate is useful for:

- Converting division into multiplication (z/w = z*w̄/|w|²)
- Finding the magnitude squared (z*z̄ = |z|²)
- Extracting real parts from complex expressions

If z = a + bi, then z* = a

- bi

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `abs`

```typescript
(z: Complex): number
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L496" />

**Parameters:**

- `z` - The complex number

**Returns:** The magnitude as a non-negative real number

Get the absolute value (magnitude/modulus) of a complex number.

The magnitude represents the distance from the origin to the point in the complex plane. This is always a non-negative real number, calculated using the Pythagorean theorem.

Formula: |a + bi| = √(a² + b²)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `arg`

```typescript
(z: Complex): number
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L534" />

**Parameters:**

- `z` - The complex number

**Returns:** The argument in radians, ranging from -π to π

**Throws:**

- Error if z is zero (argument is undefined for zero)

Get the argument (phase/angle) of a complex number in radians.

The argument is the angle from the positive real axis to the line connecting the origin to the complex number, measured counterclockwise. This is essential for polar form representation and rotation operations.

Formula: arg(a + bi) = atan2(b, a)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toPolar`

```typescript
(z: Complex): { magnitude: number; angle: number; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L566" />

**Parameters:**

- `z` - The complex number to convert

**Returns:** Object with magnitude (distance from origin) and angle (in radians)

Convert complex number to polar form (magnitude, angle).

Polar form represents a complex number as r*e^(iθ) where r is the magnitude and θ is the angle. This form is especially useful for multiplication and power operations, as it turns them into simple arithmetic on the components.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromPolar`

```typescript
(magnitude: number, angle: number): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L600" />

**Parameters:**

- `magnitude` - The magnitude (r) - distance from origin, must be non-negative
- `angle` - The angle in radians (θ) - measured counterclockwise from positive real axis

**Returns:** Complex number r * e^(iθ) = r(cos θ + i sin θ)

Create complex number from polar form (magnitude, angle).

This converts from polar coordinates (r, θ) to rectangular coordinates (a, bi) using Euler's formula: r*e^(iθ) = r(cos θ + i sin θ)

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `power`

```typescript
(z: Complex, n: number): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L646" />

**Parameters:**

- `z` - The complex base number
- `n` - The real exponent (can be fractional for roots)

**Returns:** z raised to the power n

Raise a complex number to a real power using De Moivre's theorem.

This uses the polar form to compute powers efficiently: If z = r*e^(iθ), then z^n = r^n * e^(inθ) This avoids the complexity of repeated multiplication for integer powers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `sqrt`

```typescript
(z: Complex): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L749" />

**Parameters:**

- `z` - The complex number to find the square root of

**Returns:** The principal square root

Get the square root of a complex number.

Returns the principal (primary) square root using the power function. The principal root is the one with argument in the range (-π/2, π/2]. Note that every non-zero complex number has exactly two square roots.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `exp`

```typescript
(z: Complex): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L785" />

**Parameters:**

- `z` - The complex exponent

**Returns:** e raised to the complex power z

Natural exponential function for complex numbers.

Uses Euler's formula: e^(a + bi) = e^a * (cos b + i sin b) This fundamental function connects exponentials with trigonometry and is essential for signal processing, quantum mechanics, and many areas of mathematics.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `log`

```typescript
(z: Complex): Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L823" />

**Parameters:**

- `z` - The complex number (must be non-zero)

**Returns:** The principal natural logarithm

**Throws:**

- Error if z is zero (logarithm undefined)

Natural logarithm for complex numbers.

Uses the formula: log(z) = log|z| + i*arg(z) This gives the principal branch of the complex logarithm. Note that complex logarithms are multi-valued; this returns the principal value.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `equals`

```typescript
(a: Complex, b: Complex, tolerance?: number = 1e-9): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L865" />

**Parameters:**

- `a` - First complex number
- `b` - Second complex number
- `tolerance` - Maximum allowed difference for each component (default: 1e-9)

**Returns:** True if both real and imaginary parts are within tolerance

Check if two complex numbers are equal within a tolerance.

Due to floating-point arithmetic limitations, exact equality is rarely achievable for computed complex numbers. This function allows for small differences that arise from numerical precision issues.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toString`

```typescript
(z: Complex, precision?: number = 6): string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L973" />

**Parameters:**

- `z` - The complex number to convert
- `precision` - Number of decimal places to display (default: 6)

**Returns:** String representation in mathematical notation

Convert complex number to string representation.

Creates a human-readable string in standard mathematical notation (a + bi). Handles special cases like pure real numbers, pure imaginary numbers, and the imaginary unit to provide clean, readable output.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromWith`

```typescript
(real: number) => (imaginary?: number | undefined) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L107" />

Create a function that constructs complex numbers with a fixed real part. Useful for creating pure imaginary numbers or series.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromOn`

```typescript
(imaginary?: number | undefined) => (real: number) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L122" />

Create a function that constructs complex numbers with a fixed imaginary part. Useful for creating real numbers or series with constant imaginary component.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `I`

```typescript
Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L158" />

The imaginary unit i (0 + 1i). Satisfies i² = -1.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ZERO`

```typescript
Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L163" />

Zero complex number (0 + 0i).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ONE`

```typescript
Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L168" />

One complex number (1 + 0i).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addOn`

```typescript
(a: Complex) => (b: Complex) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L217" />

Create a function that adds its input to a specific complex number.

This is the data-first curried version where the input becomes the first parameter. Useful for operations where you want to add various numbers to a fixed base value.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addWith`

```typescript
(b: Complex) => (a: Complex) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L242" />

Create a function that adds a specific complex number to other complex numbers.

This is the data-second curried version where the fixed value is added to various inputs. Useful when you want to add the same complex number to many different values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractWith`

```typescript
(a: Complex) => (b: Complex) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L270" />

Create a function that subtracts from a specific complex number.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractOn`

```typescript
(a: Complex) => (b: Complex) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L286" />

Create a function that subtracts from a specific complex number.

This is the data-first curried version where the input becomes the subtrahend. Useful for operations where you want to subtract various numbers from a fixed value.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyOn`

```typescript
(a: Complex) => (b: Complex) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L332" />

Create a function that multiplies a specific complex number by others.

This is the data-first curried version where the input becomes the second factor. Useful for operations where you want to multiply a fixed base by various values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyWith`

```typescript
(b: Complex) => (a: Complex) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L359" />

Create a function that multiplies with a specific complex number.

This is the data-second curried version where the fixed multiplier is applied to various inputs. Useful when you want to scale or rotate many complex numbers by the same amount. In 2D graphics, multiplying by a complex number rotates and scales points around the origin.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideWith`

```typescript
(a: Complex) => (b: Complex) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L408" />

Create a function that divides from a specific complex number.

This creates a function where the provided complex number is the dividend (numerator) and the function's input becomes the divisor (denominator).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideOn`

```typescript
(a: Complex) => (b: Complex) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L430" />

Create a function that divides a specific complex number by others.

This is the data-first curried version where the input becomes the divisor. Useful for operations where you want to divide a fixed dividend by various values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `powerOn`

```typescript
(z: Complex) => (n: number) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L684" />

Create a function that raises a specific complex number to various powers.

This is the data-first curried version where the input becomes the exponent. Useful for operations where you want to raise a fixed base to different powers.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `powerWith`

```typescript
(n: number) => (z: Complex) => Complex
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L719" />

Create a function that raises complex numbers to a specific power.

This is the data-second curried version where the fixed exponent is applied to various bases. Useful for applying the same power operation to multiple complex numbers, such as when processing arrays or in mathematical transformations.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `equalsOn`

```typescript
(a: Complex) => (b: Complex) => (tolerance?: number | undefined) => boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L898" />

Create a function that checks if its input equals a specific complex number.

This is the data-first curried version where the reference value is the first parameter. Useful for checking if various numbers equal a fixed reference value.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `equalsWith`

```typescript
(b: Complex) => (a: Complex) => (tolerance?: number | undefined) => boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L932" />

Create a function that checks equality with a specific complex number.

This is the data-second curried version where the comparison value is fixed. Useful for filtering, validation, or when you need to check many numbers against the same reference value.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Complex`

```typescript
type Complex = {
  readonly real: number
  readonly imaginary: number
} & { [ComplexBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/complex/complex.ts#L34" />

Complex number

- a number with both real and imaginary parts, written as a + bi.

The 'i' represents the imaginary unit, which is the square root of -1. Complex numbers extend regular numbers to solve problems that regular numbers can't, like finding the square root of negative numbers.

Common uses:

- **Signal processing**: Analyzing sound waves and digital signals
- **Electrical engineering**: Calculating power in AC circuits
- **Physics**: Describing quantum states and wave behavior
- **Computer graphics**: Rotating points and creating fractals
- **Control systems**: Analyzing system stability
