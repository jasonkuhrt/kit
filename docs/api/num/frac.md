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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L48" />

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a proper fraction (0 n/d 1)

Type predicate to check if value is a proper fraction.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(numerator: Natural, denominator: Natural): Frac
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L76" />

**Parameters:**

- `numerator` - The top number (positive, less than denominator)
- `denominator` - The bottom number (positive, greater than numerator)

**Returns:** The fraction

**Throws:**

- Error if not a proper fraction

Construct a Fraction from numerator and denominator. Both must be positive and numerator must be less than denominator.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(numerator: Natural, denominator: Natural): Frac | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L131" />

**Parameters:**

- `numerator` - The top number
- `denominator` - The bottom number

**Returns:** The fraction or null

Try to construct a Fraction. Returns null if not a proper fraction.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromDecimal`

```typescript
(value: number, maxDenominator?: number = 100): Frac
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L158" />

**Parameters:**

- `value` - The decimal value (0 value 1)
- `maxDenominator` - Maximum denominator to use (default: 100)

**Returns:** The fraction approximation

**Throws:**

- Error if value is not between 0 and 1

Convert a decimal to a fraction. The decimal must be between 0 and 1 (exclusive).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toDecimal`

```typescript
(frac: Frac): number
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L183" />

**Parameters:**

- `frac` - The fraction to convert

**Returns:** The decimal value (between 0 and 1)

Convert fraction to decimal.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toPercentage`

```typescript
(frac: Frac): number
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L199" />

**Parameters:**

- `frac` - The fraction to convert

**Returns:** The percentage value (0-100)

Convert fraction to percentage.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `complement`

```typescript
(frac: Frac): Frac
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L218" />

**Parameters:**

- `frac` - The fraction

**Returns:** The complement as a fraction

Get the complement of a fraction (1

- fraction).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `add`

```typescript
(a: Frac, b: Frac): Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L244" />

**Parameters:**

- `a` - First fraction
- `b` - Second fraction

**Returns:** The sum as a Ratio (might be = 1)

Add two fractions. Note: The result might not be a fraction if the sum = 1.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `multiply`

```typescript
(a: Frac, b: Frac): Frac
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L294" />

**Parameters:**

- `a` - First fraction
- `b` - Second fraction

**Returns:** The product as a fraction

Multiply two fractions. The result is always a fraction (product of two numbers

1 is

1).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `compare`

```typescript
(a: Frac, b: Frac): 0 | 1 | -1
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L339" />

**Parameters:**

- `a` - First fraction
- `b` - Second fraction

**Returns:** -1 if a b, 0 if a = b, 1 if a b

Compare two fractions.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromWith`

```typescript
(numerator: Natural) => (denominator: Natural) => Frac
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L100" />

Create a function that constructs fractions with a fixed numerator. Useful for creating series of fractions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `fromOn`

```typescript
(denominator: Natural) => (numerator: Natural) => Frac
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L115" />

Create a function that constructs fractions with a fixed denominator. Useful for working with common denominators.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addOn`

```typescript
(a: Frac) => (b: Frac) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L260" />

Create a function that adds to a specific fraction. Data-first pattern: fix the first argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `addWith`

```typescript
(b: Frac) => (a: Frac) => Ratio
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L274" />

Create a function that adds with a specific fraction. Data-second pattern: fix the second argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyOn`

```typescript
(a: Frac) => (b: Frac) => Frac
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L311" />

Create a function that multiplies a specific fraction. Data-first pattern: fix the first argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `multiplyWith`

```typescript
(b: Frac) => (a: Frac) => Frac
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L325" />

Create a function that multiplies with a specific fraction. Data-second pattern: fix the second argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareOn`

```typescript
(a: Frac) => (b: Frac) => 0 | 1 | -1
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L355" />

Create a function that compares a specific fraction. Data-first pattern: fix the first argument.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `compareWith`

```typescript
(b: Frac) => (a: Frac) => 0 | 1 | -1
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L369" />

Create a function that compares with a specific fraction. Data-second pattern: fix the second argument.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Frac`

```typescript
type Frac = Ratio & { [FracBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/frac/frac.ts#L32" />

Fraction (proper fraction)

- a positive ratio where 0

numerator

denominator.

Fractions represent parts of a whole, always between 0 and 1 (exclusive). They're ideal for:

- Probabilities (1/6 for dice roll)
- Portions and percentages (3/4 of a pizza)
- UI measurements (2/3 width)
- Musical note durations (1/4 note, 1/8 note)
