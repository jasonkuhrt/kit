# Num.NonZero

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.NonZero.someFunction()
```

```typescript [Barrel]
import { NonZero } from '@wollybeard/kit/num'

// Access via direct import
NonZero.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L42" />

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a non-zero number

Type predicate to check if value is non-zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): NonZero
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L63" />

**Parameters:**

- `value` - The number to convert to NonZero

**Returns:** The value as a NonZero number

**Throws:**

- Error if value is zero

Construct a NonZero number. Throws if the value is zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): NonZero | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L83" />

**Parameters:**

- `value` - The number to try converting

**Returns:** The NonZero number or null

Try to construct a NonZero number. Returns null if the value is zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `safeDivide`

```typescript
(dividend: number, divisor: NonZero): number
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L100" />

**Parameters:**

- `dividend` - The number to divide
- `divisor` - The NonZero divisor

**Returns:** The result of the division

Safely divide a number by a NonZero divisor. This operation is guaranteed to never throw.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `safeDiv`

```typescript
(dividend: number, divisor: number): number | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L118" />

**Parameters:**

- `dividend` - The number to divide
- `divisor` - The divisor (may be zero)

**Returns:** The result of the division or null

Try to divide two numbers safely. Returns null if the divisor is zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `safeDivOn`

```typescript
(dividend: number): (divisor: number) => number | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L137" />

**Parameters:**

- `dividend` - The fixed dividend

**Returns:** A function that divides the dividend by its input

Create a function that safely divides a fixed dividend by any divisor.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `safeDivWith`

```typescript
(divisor: number): (dividend: number) => number | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L155" />

**Parameters:**

- `divisor` - The fixed divisor

**Returns:** A function that divides its input by the divisor

Create a function that safely divides any dividend by a fixed divisor.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `NonZero`

```typescript
type NonZero = number & { [NonZeroBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-zero/non-zero.ts#L25" />

Non-zero number (≠ 0).

Non-zero numbers are all numbers except zero. They are essential for safe division operations and other mathematical contexts where zero would cause errors or undefined behavior.
