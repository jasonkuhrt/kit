# Num.Natural

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Natural
```

```typescript [Barrel]
import { Natural } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L47" /> {#f-is-47}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a natural number

Type predicate to check if value is a natural number. Returns true for positive integers (1, 2, 3, ...).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L68" /> {#f-from-68}

```typescript
(value: number): number & { [NaturalBrand]: true; } & { [IntBrand]: true; } & { [PositiveBrand]: true; }
```

**Parameters:**

- `value` - The number to convert to Natural

**Returns:** The value as a Natural number

**Throws:**

- Error if value is not a positive integer

Construct a Natural number. Throws if the value is not a positive integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L91" /> {#f-try-from-91}

```typescript
(value: number): (number & { [NaturalBrand]: true; } & { [IntBrand]: true; } & { [PositiveBrand]: true; }) | null
```

**Parameters:**

- `value` - The number to try converting

**Returns:** The Natural number or null

Try to construct a Natural number. Returns null if the value is not a positive integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parseAsNatural`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L112" /> {#f-parse-as-natural-112}

```typescript
(value: string): (number & { [NaturalBrand]: true; } & { [IntBrand]: true; } & { [PositiveBrand]: true; }) | null
```

**Parameters:**

- `value` - The string to parse

**Returns:** The parsed natural number or null

Parse a string as a natural number. Returns null if the string doesn't represent a positive integer. Note: parseInt("1.5") returns 1, but we check if the original string represents an integer by comparing with the parsed result.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `next`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L135" /> {#f-next-135}

```typescript
(value: number): number & { [NaturalBrand]: true; } & { [IntBrand]: true; } & { [PositiveBrand]: true; }
```

**Parameters:**

- `value` - The number to get the next natural from

**Returns:** The next natural number

Get the next natural number. For any number, returns the smallest natural number greater than the input.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prev`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L154" /> {#f-prev-154}

```typescript
(value: number): (number & { [NaturalBrand]: true; } & { [IntBrand]: true; } & { [PositiveBrand]: true; }) | null
```

**Parameters:**

- `value` - The number to get the previous natural from

**Returns:** The previous natural number or null

Get the previous natural number. Returns null if there is no previous natural (i.e., for values = 1).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Natural`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L31" /> {#intersection-natural-31}

```typescript
type Natural = number & { [NaturalBrand]: true }
```

Natural number (positive integer: 1, 2, 3, ...). These are the counting numbers used in everyday life.

Natural numbers are both integers and positive, so they combine both brands for maximum type safety.
