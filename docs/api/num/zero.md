# Num.Zero

_Num_ / **Zero**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Zero.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Zero.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/zero/zero.ts#L16" />

Type predicate to check if value is zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): Zero
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/zero/zero.ts#L24" />

Construct a Zero.

Throws if the value is not zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): Zero | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/zero/zero.ts#L35" />

Try to construct a Zero.

Returns null if the value is not zero.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ZERO`

```typescript
Zero
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/zero/zero.ts#L42" />

The zero constant.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Zero`

```typescript
type Zero = 0 & { [ZeroBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/zero/zero.ts#L11" />

Zero.
