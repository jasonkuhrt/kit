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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L47" /> {#f-is-47}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a Ratio

Type predicate to check if value is a Ratio.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L79" /> {#f-from-79}

```typescript
(numerator: Int, denominator: NonZero): Ratio
```

**Parameters:**

- `numerator` - The top number
- `denominator` - The bottom number (non-zero)

**Returns:** The simplified ratio

Construct a Ratio from numerator and denominator. Automatically simplifies to lowest terms and normalizes sign.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromDecimal`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L145" /> {#f-from-decimal-145}

```typescript
(value: number, maxDenominator?: number = 10000): Ratio
```

**Parameters:**

- `value` - The decimal number
- `maxDenominator` - Maximum denominator to use (default: 10000)

**Returns:** The ratio approximation

Convert a decimal number to a Ratio with specified precision. Useful for converting floats to exact ratios.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `simplify`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L202" /> {#f-simplify-202}

```typescript
(ratio: Ratio): Ratio
```

**Parameters:**

- `ratio` - The ratio to simplify

**Returns:** The simplified ratio

Simplify a ratio to lowest terms. Note: from() already does this, but this is useful for ratios from other sources.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toDecimal`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L219" /> {#f-to-decimal-219}

```typescript
(ratio: Ratio): number
```

**Parameters:**

- `ratio` - The ratio to convert

**Returns:** The decimal representation

Convert ratio to decimal number. Note: This may lose precision for ratios like 1/3.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `add`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L239" /> {#f-add-239}

```typescript
(a: Ratio, b: Ratio): Ratio
```

**Parameters:**

- `a` - First ratio
- `b` - Second ratio

**Returns:** The sum as a simplified ratio

Add two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `subtract`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L286" /> {#f-subtract-286}

```typescript
(a: Ratio, b: Ratio): Ratio
```

**Parameters:**

- `a` - First ratio
- `b` - Second ratio

**Returns:** The difference as a simplified ratio

Subtract two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `multiply`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L337" /> {#f-multiply-337}

```typescript
(a: Ratio, b: Ratio): Ratio
```

**Parameters:**

- `a` - First ratio
- `b` - Second ratio

**Returns:** The product as a simplified ratio

Multiply two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `divide`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L387" /> {#f-divide-387}

```typescript
(a: Ratio, b: Ratio): Ratio
```

**Parameters:**

- `a` - First ratio (dividend)
- `b` - Second ratio (divisor, must be non-zero)

**Returns:** The quotient as a simplified ratio

**Throws:**

- Error if b is zero

Divide two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `compare`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L437" /> {#f-compare-437}

```typescript
(a: Ratio, b: Ratio): 0 | 1 | -1
```

**Parameters:**

- `a` - First ratio
- `b` - Second ratio

**Returns:** -1, 0, or 1

Compare two ratios. Returns -1 if a

b, 0 if a = b, 1 if a

b.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `reciprocal`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L487" /> {#f-reciprocal-487}

```typescript
(ratio: Ratio): Ratio
```

**Parameters:**

- `ratio` - The ratio to invert

**Returns:** The reciprocal

**Throws:**

- Error if ratio is zero

Get the reciprocal (inverse) of a ratio.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toMixedNumber`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L507" /> {#f-to-mixed-number-507}

```typescript
(ratio: Ratio): { whole: Int; fraction: Ratio; }
```

**Parameters:**

- `ratio` - The ratio to convert

**Returns:** Object with whole and fractional parts

Convert ratio to mixed number representation. Returns whole part and fractional part.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L110" /> {#c-from-with-110}

```typescript
(denominator: NonZero) => (numerator: Int) => Ratio
```

Create a function that constructs ratios with a fixed numerator. Useful for creating unit fractions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L125" /> {#c-from-on-125}

```typescript
(numerator: Int) => (denominator: NonZero) => Ratio
```

Create a function that constructs ratios with a fixed denominator. Useful for working with common denominators.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L257" /> {#c-add-on-257}

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

Create a function that adds a specific ratio. Useful for repeated additions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L271" /> {#c-add-with-271}

```typescript
(b: Ratio) => (a: Ratio) => Ratio
```

Create a function that adds to a specific ratio. Useful for accumulating values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L304" /> {#c-subtract-with-304}

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

Create a function that subtracts from a specific ratio. Useful for calculating remainders.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L318" /> {#c-subtract-on-318}

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

Create a function that subtracts a specific ratio. Useful for repeated subtractions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L355" /> {#c-multiply-on-355}

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

Create a function that multiplies by a specific ratio. Useful for scaling.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L369" /> {#c-multiply-with-369}

```typescript
(b: Ratio) => (a: Ratio) => Ratio
```

Create a function that multiplies a specific ratio. Useful for applying ratios to values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L408" /> {#c-divide-with-408}

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

Create a function that divides from a specific ratio. Useful for finding proportions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L422" /> {#c-divide-on-422}

```typescript
(a: Ratio) => (b: Ratio) => Ratio
```

Create a function that divides by a specific ratio. Useful for repeated divisions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L459" /> {#c-compare-on-459}

```typescript
(a: Ratio) => (b: Ratio) => 0 | 1 | -1
```

Create a function that compares against a specific ratio. Useful for filtering or sorting.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L473" /> {#c-compare-with-473}

```typescript
(b: Ratio) => (a: Ratio) => 0 | 1 | -1
```

Create a function that compares a specific ratio. Useful for finding where a ratio fits in a range.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Ratio`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L30" /> {#intersection-ratio-30}

```typescript
type Ratio = {
  readonly numerator: Int
  readonly denominator: NonZero
} & { [RatioBrand]: true }
```

Ratio (rational number)

- a number expressible as p/q where q ≠ 0.

Ratios provide exact arithmetic without floating-point errors, making them ideal for:

- Financial calculations (no lost pennies)
- Music theory (frequency ratios like 3:2 for perfect fifth)
- Aspect ratios and proportions
- Probability calculations
- Any domain requiring exact fractional values
