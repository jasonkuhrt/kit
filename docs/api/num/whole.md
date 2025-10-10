# Num.Whole

_Num_ / **Whole**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Whole.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Whole.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown) => value is number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L46" />

Type predicate to check if value is a whole number. Returns true for non-negative integers (0, 1, 2, 3, ...).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number) => number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L66" />

Construct a Whole number. Throws if the value is not a non-negative integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number) => (number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L89" />

Try to construct a Whole number. Returns null if the value is not a non-negative integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `parseAsWhole`

```typescript
(value: string) => (number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L107" />

Parse a string as a whole number. Returns null if the string doesn't represent a non-negative integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `next`

```typescript
(value: number) => number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L127" />

Get the next whole number. For any number, returns the smallest whole number greater than the input.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prev`

```typescript
(value: number) => (number & { [WholeBrand]: true; } & { [IntBrand]: true; } & { [NonNegativeBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L146" />

Get the previous whole number. Returns null if there is no previous whole (i.e., for values = 0).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Whole`

```typescript
type Whole = number & { [WholeBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/whole/whole.ts#L30" />

Whole number (non-negative integer: 0, 1, 2, 3, ...). These are the natural numbers plus zero.

Whole numbers are both integers and non-negative, so they combine both brands for maximum type safety.
