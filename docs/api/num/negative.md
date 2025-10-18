# Num.Negative

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Negative
```

```typescript [Barrel]
import { Negative } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/negative/negative.ts#L16" /> {#f-is-16}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is negative ( 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/negative/negative.ts#L24" /> {#f-from-24}

```typescript
(value: number): Negative
```

Construct a Negative number. Throws if the value is not negative.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/negative/negative.ts#L35" /> {#f-try-from-35}

```typescript
(value: number): Negative | null
```

Try to construct a Negative number. Returns null if the value is not negative.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `negate`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/negative/negative.ts#L42" /> {#f-negate-42}

```typescript
(value: number): Negative
```

Negate a positive number to make it negative.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Negative`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/negative/negative.ts#L11" /> {#intersection-negative-11}

```typescript
type Negative = number & { [NegativeBrand]: true }
```

Negative number ( 0).
