# Num.Positive

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Positive
```

```typescript [Barrel]
import { Positive } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/positive/positive.ts#L40" /> {#f-is-40}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a positive number

Type predicate to check if value is positive ( 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/positive/positive.ts#L60" /> {#f-from-60}

```typescript
(value: number): Positive
```

**Parameters:**

- `value` - The number to convert to Positive

**Returns:** The value as a Positive number

**Throws:**

- Error if value is not positive ( 0)

Construct a Positive number. Throws if the value is not positive.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/positive/positive.ts#L80" /> {#f-try-from-80}

```typescript
(value: number): Positive | null
```

**Parameters:**

- `value` - The number to try converting

**Returns:** The Positive number or null

Try to construct a Positive number. Returns null if the value is not positive.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Positive`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/positive/positive.ts#L24" /> {#intersection-positive-24}

```typescript
type Positive = number & { [PositiveBrand]: true }
```

Positive number ( 0).

Positive numbers are all numbers greater than zero. They represent quantities, counts, and measurements in the real world.
