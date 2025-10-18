# Num.Whole

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Whole
```

```typescript [Barrel]
import { Whole } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L46" /> {#f-is-46}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to check

**Returns:** True if value is a whole number

Type predicate to check if value is a whole number. Returns true for non-negative integers (0, 1, 2, 3, ...).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L66" /> {#f-from-66}

```typescript
(value: number): number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }
```

**Parameters:**

- `value` - The number to convert to Whole

**Returns:** The value as a Whole number

**Throws:**

- Error if value is not a non-negative integer

Construct a Whole number. Throws if the value is not a non-negative integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L89" /> {#f-try-from-89}

```typescript
(value: number): (number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }) | null
```

**Parameters:**

- `value` - The number to try converting

**Returns:** The Whole number or null

Try to construct a Whole number. Returns null if the value is not a non-negative integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parseAsWhole`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L107" /> {#f-parse-as-whole-107}

```typescript
(value: string): (number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }) | null
```

**Parameters:**

- `value` - The string to parse

**Returns:** The parsed whole number or null

Parse a string as a whole number. Returns null if the string doesn't represent a non-negative integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `next`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L127" /> {#f-next-127}

```typescript
(value: number): number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }
```

**Parameters:**

- `value` - The number to get the next whole from

**Returns:** The next whole number

Get the next whole number. For any number, returns the smallest whole number greater than the input.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prev`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L146" /> {#f-prev-146}

```typescript
(value: number): (number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }) | null
```

**Parameters:**

- `value` - The number to get the previous whole from

**Returns:** The previous whole number or null

Get the previous whole number. Returns null if there is no previous whole (i.e., for values = 0).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Whole`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L30" /> {#intersection-whole-30}

```typescript
type Whole = number & { [WholeBrand]: true }
```

Whole number (non-negative integer: 0, 1, 2, 3, ...). These are the natural numbers plus zero.

Whole numbers are both integers and non-negative, so they combine both brands for maximum type safety.
