# Num.Even

_Num_ / **Even**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Even.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Even.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown) => value is number & { [EvenBrand]: true; } & { [IntBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L44" />

Type predicate to check if value is even. Returns Even & Int when the value is an even integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number) => number & { [EvenBrand]: true; } & { [IntBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L65" />

Construct an Even integer. Throws if the value is not an even integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number) => (number & { [EvenBrand]: true; } & { [IntBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L88" />

Try to construct an Even integer. Returns null if the value is not an even integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `next`

```typescript
(value: number) => number & { [EvenBrand]: true; } & { [IntBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L106" />

Get the next even number (rounds up if odd). For any number, returns the smallest even integer greater than or equal to it.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prev`

```typescript
(value: number) => number & { [EvenBrand]: true; } & { [IntBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L125" />

Get the previous even number (rounds down if odd). For any number, returns the largest even integer less than or equal to it.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Even`

```typescript
type Even = number & { [EvenBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/even/even.ts#L27" />

Even integer.

Even integers are whole numbers that are divisible by 2. They include zero and alternate with odd numbers on the number line. Note: This type combines with Int brand for maximum type safety.
