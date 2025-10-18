# Num.NonZero

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.NonZero
```

```typescript [Barrel]
import { NonZero } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L42" /> {#f-is-42}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a non-zero number

Type predicate to check if value is non-zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L63" /> {#f-from-63}

```typescript
(value: number): NonZero
```

**Parameters:**

- `value` - The number to convert to NonZero

**Returns:** The value as a NonZero number

**Throws:**

- Error if value is zero

Construct a NonZero number. Throws if the value is zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L83" /> {#f-try-from-83}

```typescript
(value: number): NonZero | null
```

**Parameters:**

- `value` - The number to try converting

**Returns:** The NonZero number or null

Try to construct a NonZero number. Returns null if the value is zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `safeDivide`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L100" /> {#f-safe-divide-100}

```typescript
(dividend: number, divisor: NonZero): number
```

**Parameters:**

- `dividend` - The number to divide
- `divisor` - The NonZero divisor

**Returns:** The result of the division

Safely divide a number by a NonZero divisor. This operation is guaranteed to never throw.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `safeDiv`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L118" /> {#f-safe-div-118}

```typescript
(dividend: number, divisor: number): number | null
```

**Parameters:**

- `dividend` - The number to divide
- `divisor` - The divisor (may be zero)

**Returns:** The result of the division or null

Try to divide two numbers safely. Returns null if the divisor is zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `safeDivOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L137" /> {#f-safe-div-on-137}

```typescript
(dividend: number): (divisor: number) => number | null
```

**Parameters:**

- `dividend` - The fixed dividend

**Returns:** A function that divides the dividend by its input

Create a function that safely divides a fixed dividend by any divisor.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `safeDivWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L155" /> {#f-safe-div-with-155}

```typescript
(divisor: number): (dividend: number) => number | null
```

**Parameters:**

- `divisor` - The fixed divisor

**Returns:** A function that divides its input by the divisor

Create a function that safely divides any dividend by a fixed divisor.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `NonZero`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L25" /> {#intersection-non-zero-25}

```typescript
type NonZero = number & { [NonZeroBrand]: true }
```

Non-zero number (≠ 0).

Non-zero numbers are all numbers except zero. They are essential for safe division operations and other mathematical contexts where zero would cause errors or undefined behavior.
