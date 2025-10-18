# Num.Float

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Float
```

```typescript [Barrel]
import { Float } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/float/float.ts#L18" /> {#f-is-18}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is a float (non-integer number).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/float/float.ts#L26" /> {#f-from-26}

```typescript
(value: number): number & { [FloatBrand]: true; } & { [FiniteBrand]: true; }
```

Construct a Float. Throws if the value is not a float.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/float/float.ts#L40" /> {#f-try-from-40}

```typescript
(value: number): (number & { [FloatBrand]: true; } & { [FiniteBrand]: true; }) | null
```

Try to construct a Float. Returns null if the value is not a float.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toFloat`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/float/float.ts#L47" /> {#f-to-float-47}

```typescript
(value: number): number & { [FloatBrand]: true; } & { [FiniteBrand]: true; }
```

Convert an integer to a float by adding a small decimal.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Float`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/float/float.ts#L13" /> {#intersection-float-13}

```typescript
type Float = number & { [FloatBrand]: true }
```

Float (non-integer finite number).
