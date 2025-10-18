# Num.InRange

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.InRange
```

```typescript [Barrel]
import { InRange } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L18" /> {#f-is-18}

```typescript
<Min extends number, Max extends number > (value: unknown, min: Min, max: Max): boolean
```

Type predicate to check if value is within a specific range.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L30" /> {#f-from-30}

```typescript
<Min extends number, Max extends number > (value: number, min: Min, max: Max): InRange<Min, Max>
```

Construct an InRange number. Throws if the value is outside the range.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L45" /> {#f-try-from-45}

```typescript
<Min extends number, Max extends number > (value: number, min: Min, max: Max): InRange<Min, Max> | null
```

Try to construct an InRange number. Returns null if the value is outside the range.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `clamp`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L63" /> {#f-clamp-63}

```typescript
<_T extends number, Min extends number, Max extends number > (value: _T, min: Min, max: Max): Clamp<_T, Min, Max>
```

Clamp a number to a range. Forces the value to be within the specified minimum and maximum bounds.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `clampOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L74" /> {#f-clamp-on-74}

```typescript
<_T extends number>(value: _T): <Min extends number, Max extends number>(min: Min, max: Max) => Clamp<_T, Min, Max>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `clampWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L82" /> {#f-clamp-with-82}

```typescript
<Min extends number, Max extends number > (min: Min, max: Max): <_T extends number>(value: _T) => Clamp<_T, Min, Max>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L90" /> {#f-is-on-90}

```typescript
(value: unknown): <Min extends number, Max extends number>(min: Min, max: Max) => boolean
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L98" /> {#f-is-with-98}

```typescript
<Min extends number, Max extends number > (min: Min, max: Max): (value: unknown) => value is InRange<Min, Max>
```

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `InRange`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L11" /> {#intersection-in-range-11}

```typescript
type InRange<Min extends number, Max extends number> = number & {
  [InRangeBrand]: { min: Min; max: Max }
}
```

Range-constrained number.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Clamp`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/in-range/in-range.ts#L57" /> {#t-clamp-57}

```typescript
type Clamp<_T extends number, Min extends number, Max extends number> = InRange<Min, Max>
```

Type-level clamp transformation. Ensures the result type is within the specified range.
