# Num.Ratio

_Num_ / **Ratio**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Ratio.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Ratio.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown) => value is Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L47" />

Type predicate to check if value is a Ratio.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
;((numerator: Int, denominator: NonZero) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L79" />

Construct a Ratio from numerator and denominator. Automatically simplifies to lowest terms and normalizes sign.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromDecimal`

```typescript
;((value: number, maxDenominator?: number) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L145" />

Convert a decimal number to a Ratio with specified precision. Useful for converting floats to exact ratios.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `simplify`

```typescript
;((ratio: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L202" />

Simplify a ratio to lowest terms. Note: from() already does this, but this is useful for ratios from other sources.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toDecimal`

```typescript
;((ratio: Ratio) => number)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L219" />

Convert ratio to decimal number. Note: This may lose precision for ratios like 1/3.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `add`

```typescript
;((a: Ratio, b: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L239" />

Add two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `subtract`

```typescript
;((a: Ratio, b: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L286" />

Subtract two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `multiply`

```typescript
;((a: Ratio, b: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L337" />

Multiply two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `divide`

```typescript
;((a: Ratio, b: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L387" />

Divide two ratios. Result is automatically simplified.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `compare`

```typescript
;((a: Ratio, b: Ratio) => 0 | 1 | -1)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L437" />

Compare two ratios. Returns -1 if a

b, 0 if a = b, 1 if a

b.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `reciprocal`

```typescript
;((ratio: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L487" />

Get the reciprocal (inverse) of a ratio.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toMixedNumber`

```typescript
;((ratio: Ratio) => {
  whole: Int
  fraction: Ratio
})
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L507" />

Convert ratio to mixed number representation. Returns whole part and fractional part.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromWith`

```typescript
;((denominator: NonZero) => (numerator: Int) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L110" />

Create a function that constructs ratios with a fixed numerator. Useful for creating unit fractions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromOn`

```typescript
;((numerator: Int) => (denominator: NonZero) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L125" />

Create a function that constructs ratios with a fixed denominator. Useful for working with common denominators.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addOn`

```typescript
;((a: Ratio) => (b: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L257" />

Create a function that adds a specific ratio. Useful for repeated additions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addWith`

```typescript
;((b: Ratio) => (a: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L271" />

Create a function that adds to a specific ratio. Useful for accumulating values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractWith`

```typescript
;((a: Ratio) => (b: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L304" />

Create a function that subtracts from a specific ratio. Useful for calculating remainders.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subtractOn`

```typescript
;((a: Ratio) => (b: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L318" />

Create a function that subtracts a specific ratio. Useful for repeated subtractions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyOn`

```typescript
;((a: Ratio) => (b: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L355" />

Create a function that multiplies by a specific ratio. Useful for scaling.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyWith`

```typescript
;((b: Ratio) => (a: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L369" />

Create a function that multiplies a specific ratio. Useful for applying ratios to values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideWith`

```typescript
;((a: Ratio) => (b: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L408" />

Create a function that divides from a specific ratio. Useful for finding proportions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `divideOn`

```typescript
;((a: Ratio) => (b: Ratio) => Ratio)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L422" />

Create a function that divides by a specific ratio. Useful for repeated divisions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareOn`

```typescript
;((a: Ratio) => (b: Ratio) => 0 | 1 | -1)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/ratio/ratio.ts#L459" />

Create a function that compares against a specific ratio. Useful for filtering or sorting.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareWith`

```typescript
;((b: Ratio) => (a: Ratio) => 0 | 1 | -1)
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
