# Num.Natural

_Num_ / **Natural**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Natural.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Natural.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L47" />

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a natural number

Type predicate to check if value is a natural number.

Returns true for positive integers (1, 2, 3, ...).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): number & { [NaturalBrand]: true; } & { [IntBrand]: true; } & { [PositiveBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L68" />

**Parameters:**

- `value` - The number to convert to Natural

**Returns:** The value as a Natural number

**Throws:**

- Error if value is not a positive integer

Construct a Natural number.

Throws if the value is not a positive integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): (number & { [NaturalBrand]: true; } & { [IntBrand]: true; } & { [PositiveBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L91" />

**Parameters:**

- `value` - The number to try converting

**Returns:** The Natural number or null

Try to construct a Natural number.

Returns null if the value is not a positive integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parseAsNatural`

```typescript
(value: string): (number & { [NaturalBrand]: true; } & { [IntBrand]: true; } & { [PositiveBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L112" />

**Parameters:**

- `value` - The string to parse

**Returns:** The parsed natural number or null

Parse a string as a natural number.

Returns null if the string doesn't represent a positive integer.

Note: parseInt("1.5") returns 1, but we check if the original string

represents an integer by comparing with the parsed result.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `next`

```typescript
(value: number): number & { [NaturalBrand]: true; } & { [IntBrand]: true; } & { [PositiveBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L135" />

**Parameters:**

- `value` - The number to get the next natural from

**Returns:** The next natural number

Get the next natural number.

For any number, returns the smallest natural number greater than the input.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prev`

```typescript
(value: number): (number & { [NaturalBrand]: true; } & { [IntBrand]: true; } & { [PositiveBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L154" />

**Parameters:**

- `value` - The number to get the previous natural from

**Returns:** The previous natural number or null

Get the previous natural number.

Returns null if there is no previous natural (i.e., for values

= 1).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Natural`

```typescript
type Natural = number & { [NaturalBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/natural/natural.ts#L31" />

Natural number (positive integer: 1, 2, 3, ...).

These are the counting numbers used in everyday life.

Natural numbers are both integers and positive, so they combine

both brands for maximum type safety.
