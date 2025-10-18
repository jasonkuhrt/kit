# Num.NonNegative

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.NonNegative.someFunction()
```

```typescript [Barrel]
import { NonNegative } from '@wollybeard/kit/num'

// Access via direct import
NonNegative.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-negative/non-negative.ts#L16" />

Type predicate to check if value is non-negative (= 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): NonNegative
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-negative/non-negative.ts#L24" />

Construct a NonNegative number. Throws if the value is negative.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): NonNegative | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-negative/non-negative.ts#L35" />

Try to construct a NonNegative number. Returns null if the value is negative.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `NonNegative`

```typescript
type NonNegative = number & { [NonNegativeBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/non-negative/non-negative.ts#L11" />

Non-negative number (= 0).
