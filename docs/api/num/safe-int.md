# Num.SafeInt

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.SafeInt
```

```typescript [Barrel]
import { SafeInt } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L18" /> {#f-is-18}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is a safe integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L26" /> {#f-from-26}

```typescript
(value: number): number & { [SafeIntBrand]: true; } & { [IntBrand]: true; }
```

Construct a SafeInt. Throws if the value is not a safe integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L37" /> {#f-try-from-37}

```typescript
(value: number): (number & { [SafeIntBrand]: true; } & { [IntBrand]: true; }) | null
```

Try to construct a SafeInt. Returns null if the value is not a safe integer.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `MAX_SAFE_INT`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L44" /> {#c-max_safe_int-44}

```typescript
number & { [SafeIntBrand]: true; } & { [IntBrand]: true; }
```

The maximum safe integer constant.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `MIN_SAFE_INT`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L49" /> {#c-min_safe_int-49}

```typescript
number & { [SafeIntBrand]: true; } & { [IntBrand]: true; }
```

The minimum safe integer constant.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `SafeInt`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L13" /> {#intersection-safe-int-13}

```typescript
type SafeInt = number & { [SafeIntBrand]: true }
```

Safe integer (within Number.MAX_SAFE_INTEGER).
