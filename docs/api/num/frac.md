# Num.Frac

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Frac
```

```typescript [Barrel]
import { Frac } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L48" /> {#f-is-48}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a proper fraction (0 n/d 1)

Type predicate to check if value is a proper fraction.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L76" /> {#f-from-76}

```typescript
(numerator: Natural, denominator: Natural): Frac
```

**Parameters:**

- `numerator` - The top number (positive, less than denominator)
- `denominator` - The bottom number (positive, greater than numerator)

**Returns:** The fraction

**Throws:**

- Error if not a proper fraction

Construct a Fraction from numerator and denominator. Both must be positive and numerator must be less than denominator.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L131" /> {#f-try-from-131}

```typescript
(numerator: Natural, denominator: Natural): Frac | null
```

**Parameters:**

- `numerator` - The top number
- `denominator` - The bottom number

**Returns:** The fraction or null

Try to construct a Fraction. Returns null if not a proper fraction.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromDecimal`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L158" /> {#f-from-decimal-158}

```typescript
(value: number, maxDenominator?: number = 100): Frac
```

**Parameters:**

- `value` - The decimal value (0 value 1)
- `maxDenominator` - Maximum denominator to use (default: 100)

**Returns:** The fraction approximation

**Throws:**

- Error if value is not between 0 and 1

Convert a decimal to a fraction. The decimal must be between 0 and 1 (exclusive).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toDecimal`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L183" /> {#f-to-decimal-183}

```typescript
(frac: Frac): number
```

**Parameters:**

- `frac` - The fraction to convert

**Returns:** The decimal value (between 0 and 1)

Convert fraction to decimal.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toPercentage`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L199" /> {#f-to-percentage-199}

```typescript
(frac: Frac): number
```

**Parameters:**

- `frac` - The fraction to convert

**Returns:** The percentage value (0-100)

Convert fraction to percentage.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `complement`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L218" /> {#f-complement-218}

```typescript
(frac: Frac): Frac
```

**Parameters:**

- `frac` - The fraction

**Returns:** The complement as a fraction

Get the complement of a fraction (1

- fraction).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `add`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L244" /> {#f-add-244}

```typescript
(a: Frac, b: Frac): Ratio
```

**Parameters:**

- `a` - First fraction
- `b` - Second fraction

**Returns:** The sum as a Ratio (might be = 1)

Add two fractions. Note: The result might not be a fraction if the sum = 1.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `multiply`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L294" /> {#f-multiply-294}

```typescript
(a: Frac, b: Frac): Frac
```

**Parameters:**

- `a` - First fraction
- `b` - Second fraction

**Returns:** The product as a fraction

Multiply two fractions. The result is always a fraction (product of two numbers

1 is

1).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `compare`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L339" /> {#f-compare-339}

```typescript
(a: Frac, b: Frac): 0 | 1 | -1
```

**Parameters:**

- `a` - First fraction
- `b` - Second fraction

**Returns:** -1 if a b, 0 if a = b, 1 if a b

Compare two fractions.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L100" /> {#c-from-with-100}

```typescript
;((numerator: Natural) => (denominator: Natural) => Frac)
```

Create a function that constructs fractions with a fixed numerator. Useful for creating series of fractions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L115" /> {#c-from-on-115}

```typescript
;((denominator: Natural) => (numerator: Natural) => Frac)
```

Create a function that constructs fractions with a fixed denominator. Useful for working with common denominators.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L260" /> {#c-add-on-260}

```typescript
;((a: Frac) => (b: Frac) => Ratio)
```

Create a function that adds to a specific fraction. Data-first pattern: fix the first argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L274" /> {#c-add-with-274}

```typescript
;((b: Frac) => (a: Frac) => Ratio)
```

Create a function that adds with a specific fraction. Data-second pattern: fix the second argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L311" /> {#c-multiply-on-311}

```typescript
;((a: Frac) => (b: Frac) => Frac)
```

Create a function that multiplies a specific fraction. Data-first pattern: fix the first argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L325" /> {#c-multiply-with-325}

```typescript
;((b: Frac) => (a: Frac) => Frac)
```

Create a function that multiplies with a specific fraction. Data-second pattern: fix the second argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L355" /> {#c-compare-on-355}

```typescript
;((a: Frac) => (b: Frac) => 0 | 1 | -1)
```

Create a function that compares a specific fraction. Data-first pattern: fix the first argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L369" /> {#c-compare-with-369}

```typescript
;((b: Frac) => (a: Frac) => 0 | 1 | -1)
```

Create a function that compares with a specific fraction. Data-second pattern: fix the second argument.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Frac`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L32" /> {#intersection-frac-32}

```typescript
type Frac = Ratio & { [FracBrand]: true }
```

Fraction (proper fraction)

- a positive ratio where 0

numerator

denominator.

Fractions represent parts of a whole, always between 0 and 1 (exclusive). They're ideal for:

- Probabilities (1/6 for dice roll)
- Portions and percentages (3/4 of a pizza)
- UI measurements (2/3 width)
- Musical note durations (1/4 note, 1/8 note)
