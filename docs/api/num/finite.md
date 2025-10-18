# Num.Finite

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Finite
```

```typescript [Barrel]
import { Finite } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/finite/finite.ts#L17" /> {#f-is-17}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is a finite number. Excludes NaN, Infinity, and -Infinity.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/finite/finite.ts#L25" /> {#f-from-25}

```typescript
(value: number): Finite
```

Construct a Finite number. Throws if the value is not finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/finite/finite.ts#L36" /> {#f-try-from-36}

```typescript
(value: number): Finite | null
```

Try to construct a Finite number. Returns null if the value is not finite.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Finite`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/finite/finite.ts#L11" /> {#intersection-finite-11}

```typescript
type Finite = number & { [FiniteBrand]: true }
```

Finite number (excludes NaN, Infinity, -Infinity).
