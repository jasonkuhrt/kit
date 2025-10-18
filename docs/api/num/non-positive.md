# Num.NonPositive

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.NonPositive
```

```typescript [Barrel]
import { NonPositive } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-positive/non-positive.ts#L16" /> {#f-is-16}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is non-positive (= 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-positive/non-positive.ts#L24" /> {#f-from-24}

```typescript
(value: number): NonPositive
```

Construct a NonPositive number. Throws if the value is positive.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-positive/non-positive.ts#L35" /> {#f-try-from-35}

```typescript
(value: number): NonPositive | null
```

Try to construct a NonPositive number. Returns null if the value is positive.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `NonPositive`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-positive/non-positive.ts#L11" /> {#intersection-non-positive-11}

```typescript
type NonPositive = number & { [NonPositiveBrand]: true }
```

Non-positive number (= 0).
