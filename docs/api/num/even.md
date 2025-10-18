# Num.Even

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Even
```

```typescript [Barrel]
import { Even } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L44" /> {#f-is-44}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to check

**Returns:** True if value is an even integer

Type predicate to check if value is even. Returns Even & Int when the value is an even integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L65" /> {#f-from-65}

```typescript
(value: number): number & { [EvenBrand]: true; } & { [IntBrand]: true; }
```

**Parameters:**

- `value` - The number to convert to Even

**Returns:** The value as an Even & Int

**Throws:**

- Error if value is not an even integer

Construct an Even integer. Throws if the value is not an even integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L88" /> {#f-try-from-88}

```typescript
(value: number): (number & { [EvenBrand]: true; } & { [IntBrand]: true; }) | null
```

**Parameters:**

- `value` - The number to try converting

**Returns:** The Even & Int or null

Try to construct an Even integer. Returns null if the value is not an even integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `next`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L106" /> {#f-next-106}

```typescript
(value: number): number & { [EvenBrand]: true; } & { [IntBrand]: true; }
```

**Parameters:**

- `value` - The number to get the next even from

**Returns:** The next even integer

Get the next even number (rounds up if odd). For any number, returns the smallest even integer greater than or equal to it.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prev`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L125" /> {#f-prev-125}

```typescript
(value: number): number & { [EvenBrand]: true; } & { [IntBrand]: true; }
```

**Parameters:**

- `value` - The number to get the previous even from

**Returns:** The previous even integer

Get the previous even number (rounds down if odd). For any number, returns the largest even integer less than or equal to it.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Even`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L27" /> {#intersection-even-27}

```typescript
type Even = number & { [EvenBrand]: true }
```

Even integer.

Even integers are whole numbers that are divisible by 2. They include zero and alternate with odd numbers on the number line. Note: This type combines with Int brand for maximum type safety.
