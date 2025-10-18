# Num.NonNegative

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.NonNegative
```

```typescript [Barrel]
import { NonNegative } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-negative/non-negative.ts#L16" /> {#f-is-16}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is non-negative (= 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-negative/non-negative.ts#L24" /> {#f-from-24}

```typescript
(value: number): NonNegative
```

Construct a NonNegative number. Throws if the value is negative.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-negative/non-negative.ts#L35" /> {#f-try-from-35}

```typescript
(value: number): NonNegative | null
```

Try to construct a NonNegative number. Returns null if the value is negative.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `NonNegative`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-negative/non-negative.ts#L11" /> {#intersection-non-negative-11}

```typescript
type NonNegative = number & { [NonNegativeBrand]: true }
```

Non-negative number (= 0).
