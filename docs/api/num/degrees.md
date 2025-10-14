# Num.Degrees

_Num_ / **Degrees**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Degrees.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.Degrees.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L20" />

Type predicate to check if value is a valid degree angle.

Note: Any finite number can represent an angle in degrees.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): number & { [DegreesBrand]: true; } & { [FiniteBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L28" />

Construct a Degrees angle.

Throws if the value is not finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): (number & { [DegreesBrand]: true; } & { [FiniteBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L39" />

Try to construct a Degrees angle.

Returns null if the value is not finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromRadians`

```typescript
(radians: number): number & { [DegreesBrand]: true; } & { [FiniteBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L46" />

Convert radians to degrees.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toRadians`

```typescript
(deg: Degrees): number
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L53" />

Convert degrees to radians.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `normalize`

```typescript
(deg: Degrees): number & { [DegreesBrand]: true; } & { [FiniteBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L60" />

Normalize degrees to the range [0, 360).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Degrees`

```typescript
type Degrees = number & { [DegreesBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/degrees/degrees.ts#L14" />

Angle in degrees.
