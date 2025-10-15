# Num.Negative

_Num_ / **Negative**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Negative.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Negative.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/negative/negative.ts#L16" />

Type predicate to check if value is negative ( 0).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): Negative
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/negative/negative.ts#L24" />

Construct a Negative number. Throws if the value is not negative.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): Negative | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/negative/negative.ts#L35" />

Try to construct a Negative number. Returns null if the value is not negative.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `negate`

```typescript
(value: number): Negative
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/negative/negative.ts#L42" />

Negate a positive number to make it negative.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Negative`

```typescript
type Negative = number & { [NegativeBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/negative/negative.ts#L11" />

Negative number ( 0).
