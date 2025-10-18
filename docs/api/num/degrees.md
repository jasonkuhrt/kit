# Num.Degrees

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Degrees
```

```typescript [Barrel]
import { Degrees } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L20" /> {#f-is-20}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is a valid degree angle. Note: Any finite number can represent an angle in degrees.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L28" /> {#f-from-28}

```typescript
(value: number): number & { [DegreesBrand]: true; } & { [FiniteBrand]: true; }
```

Construct a Degrees angle. Throws if the value is not finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L39" /> {#f-try-from-39}

```typescript
(value: number): (number & { [DegreesBrand]: true; } & { [FiniteBrand]: true; }) | null
```

Try to construct a Degrees angle. Returns null if the value is not finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromRadians`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L46" /> {#f-from-radians-46}

```typescript
(radians: number): number & { [DegreesBrand]: true; } & { [FiniteBrand]: true; }
```

Convert radians to degrees.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toRadians`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L53" /> {#f-to-radians-53}

```typescript
(deg: Degrees): number
```

Convert degrees to radians.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `normalize`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L60" /> {#f-normalize-60}

```typescript
(deg: Degrees): number & { [DegreesBrand]: true; } & { [FiniteBrand]: true; }
```

Normalize degrees to the range [0, 360).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Degrees`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L14" /> {#intersection-degrees-14}

```typescript
type Degrees = number & { [DegreesBrand]: true }
```

Angle in degrees.
