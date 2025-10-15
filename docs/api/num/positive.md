# Num.Positive

_Num_ / **Positive**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Positive.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Positive.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/positive/positive.ts#L40" />

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a positive number

Type predicate to check if value is positive ( 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): Positive
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/positive/positive.ts#L60" />

**Parameters:**

- `value` - The number to convert to Positive

**Returns:** The value as a Positive number

**Throws:**

- Error if value is not positive ( 0)

Construct a Positive number. Throws if the value is not positive.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): Positive | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/positive/positive.ts#L80" />

**Parameters:**

- `value` - The number to try converting

**Returns:** The Positive number or null

Try to construct a Positive number. Returns null if the value is not positive.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Positive`

```typescript
type Positive = number & { [PositiveBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/positive/positive.ts#L24" />

Positive number ( 0).

Positive numbers are all numbers greater than zero. They represent quantities, counts, and measurements in the real world.
