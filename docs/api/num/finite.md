# Num.Finite

_Num_ / **Finite**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Finite.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Finite.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/finite/finite.ts#L17" />

Type predicate to check if value is a finite number. Excludes NaN, Infinity, and -Infinity.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): Finite
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/finite/finite.ts#L25" />

Construct a Finite number. Throws if the value is not finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): Finite | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/finite/finite.ts#L36" />

Try to construct a Finite number. Returns null if the value is not finite.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Finite`

```typescript
type Finite = number & { [FiniteBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/finite/finite.ts#L11" />

Finite number (excludes NaN, Infinity, -Infinity).
