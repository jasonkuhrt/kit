# Num.Ratio

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Ratio
```

```typescript [Barrel]
import { Ratio } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L47" />

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a Ratio

Type predicate to check if value is a Ratio.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(numerator: Int, denominator: NonZero): Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L79" />

**Parameters:**

- `numerator` - The top number
- `denominator` - The bottom number (non-zero)

**Returns:** The simplified ratio

Construct a Ratio from numerator and denominator. Automatically simplifies to lowest terms and normalizes sign.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromDecimal`

```typescript
(value: number, maxDenominator?: number = 10000): Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L145" />

**Parameters:**

- `value` - The decimal number
- `maxDenominator` - Maximum denominator to use (default: 10000)

**Returns:** The ratio approximation

Convert a decimal number to a Ratio with specified precision. Useful for converting floats to exact ratios.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `simplify`

```typescript
(ratio: Ratio): Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L202" />

**Parameters:**

- `ratio` - The ratio to simplify

**Returns:** The simplified ratio

Simplify a ratio to lowest terms. Note: from() already does this, but this is useful for ratios from other sources.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toDecimal`

```typescript
(ratio: Ratio): number
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L219" />

**Parameters:**

- `ratio` - The ratio to convert

**Returns:** The decimal representation

Convert ratio to decimal number. Note: This may lose precision for ratios like 1/3.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `add`

```typescript
(a: Ratio, b: Ratio): Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L239" />

**Parameters:**

- `a` - First ratio
- `b` - Second ratio

**Returns:** The sum as a simplified ratio

Add two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `subtract`

```typescript
(a: Ratio, b: Ratio): Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L286" />

**Parameters:**

- `a` - First ratio
- `b` - Second ratio

**Returns:** The difference as a simplified ratio

Subtract two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `multiply`

```typescript
(a: Ratio, b: Ratio): Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L337" />

**Parameters:**

- `a` - First ratio
- `b` - Second ratio

**Returns:** The product as a simplified ratio

Multiply two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `divide`

```typescript
(a: Ratio, b: Ratio): Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L387" />

**Parameters:**

- `a` - First ratio (dividend)
- `b` - Second ratio (divisor, must be non-zero)

**Returns:** The quotient as a simplified ratio

**Throws:**

- Error if b is zero

Divide two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `compare`

```typescript
(a: Ratio, b: Ratio): 0 | 1 | -1
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L437" />

**Parameters:**

- `a` - First ratio
- `b` - Second ratio

**Returns:** -1, 0, or 1

Compare two ratios. Returns -1 if a

b, 0 if a = b, 1 if a

b.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `reciprocal`

```typescript
(ratio: Ratio): Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L487" />

**Parameters:**

- `ratio` - The ratio to invert

**Returns:** The reciprocal

**Throws:**

- Error if ratio is zero

Get the reciprocal (inverse) of a ratio.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toMixedNumber`

```typescript
(ratio: Ratio): { whole: Int; fraction: Ratio; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L507" />

**Parameters:**

- `ratio` - The ratio to convert

**Returns:** Object with whole and fractional parts

Convert ratio to mixed number representation. Returns whole part and fractional part.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromWith`

```typescript
(denominator: NonZero) => (numerator: Int) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L110" />

Create a function that constructs ratios with a fixed numerator. Useful for creating unit fractions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromOn`

```typescript
(numerator: Int) => (denominator: NonZero) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L125" />

Create a function that constructs ratios with a fixed denominator. Useful for working with common denominators.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addOn`

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L257" />

Create a function that adds a specific ratio. Useful for repeated additions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addWith`

```typescript
(b: Ratio) => (a: Ratio) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L271" />

Create a function that adds to a specific ratio. Useful for accumulating values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractWith`

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L304" />

Create a function that subtracts from a specific ratio. Useful for calculating remainders.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractOn`

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L318" />

Create a function that subtracts a specific ratio. Useful for repeated subtractions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyOn`

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L355" />

Create a function that multiplies by a specific ratio. Useful for scaling.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyWith`

```typescript
(b: Ratio) => (a: Ratio) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L369" />

Create a function that multiplies a specific ratio. Useful for applying ratios to values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideWith`

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L408" />

Create a function that divides from a specific ratio. Useful for finding proportions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideOn`

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L422" />

Create a function that divides by a specific ratio. Useful for repeated divisions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareOn`

```typescript
(a: Ratio) => (b: Ratio) => 0 | 1 | -1
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L459" />

Create a function that compares against a specific ratio. Useful for filtering or sorting.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareWith`

```typescript
(b: Ratio) => (a: Ratio) => 0 | 1 | -1
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L473" />

Create a function that compares a specific ratio. Useful for finding where a ratio fits in a range.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Ratio`

```typescript
type Ratio = {
  readonly numerator: Int
  readonly denominator: NonZero
} & { [RatioBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L30" />

Ratio (rational number)

- a number expressible as p/q where q ≠ 0.

Ratios provide exact arithmetic without floating-point errors, making them ideal for:

- Financial calculations (no lost pennies)
- Music theory (frequency ratios like 3:2 for perfect fifth)
- Aspect ratios and proportions
- Probability calculations
- Any domain requiring exact fractional values
