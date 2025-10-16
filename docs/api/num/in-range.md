# Num.InRange

_Num_ / **InRange**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.InRange.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.InRange.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
<Min extends number, Max extends number > (value: unknown, min: Min, max: Max): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L18" />

Type predicate to check if value is within a specific range.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
<Min extends number, Max extends number > (value: number, min: Min, max: Max): InRange<Min, Max>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L30" />

Construct an InRange number. Throws if the value is outside the range.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
<Min extends number, Max extends number > (value: number, min: Min, max: Max): InRange<Min, Max> | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L45" />

Try to construct an InRange number. Returns null if the value is outside the range.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `clamp`

```typescript
<_T extends number, Min extends number, Max extends number > (value: _T, min: Min, max: Max): Clamp<_T, Min, Max>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L63" />

Clamp a number to a range. Forces the value to be within the specified minimum and maximum bounds.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `clampOn`

```typescript
<_T extends number>(value: _T): <Min extends number, Max extends number>(min: Min, max: Max) => Clamp<_T, Min, Max>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L74" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `clampWith`

```typescript
<Min extends number, Max extends number > (min: Min, max: Max): <_T extends number>(value: _T) => Clamp<_T, Min, Max>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L82" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isOn`

```typescript
(value: unknown): <Min extends number, Max extends number>(min: Min, max: Max) => boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L90" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isWith`

```typescript
<Min extends number, Max extends number > (min: Min, max: Max): (value: unknown) => value is InRange<Min, Max>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L98" />

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `InRange`

```typescript
type InRange<Min extends number, Max extends number> = number & {
  [InRangeBrand]: { min: Min; max: Max }
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L11" />

Range-constrained number.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Clamp`

```typescript
type Clamp<_T extends number, Min extends number, Max extends number> = InRange<
  Min,
  Max
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L57" />

Type-level clamp transformation. Ensures the result type is within the specified range.
