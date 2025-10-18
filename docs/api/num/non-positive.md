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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-positive/non-positive.ts#L16" />

Type predicate to check if value is non-positive (= 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): NonPositive
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-positive/non-positive.ts#L24" />

Construct a NonPositive number. Throws if the value is positive.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): NonPositive | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-positive/non-positive.ts#L35" />

Try to construct a NonPositive number. Returns null if the value is positive.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `NonPositive`

```typescript
type NonPositive = number & { [NonPositiveBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-positive/non-positive.ts#L11" />

Non-positive number (= 0).
