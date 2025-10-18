# Num.Radians

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Radians.someFunction()
```

```typescript [Barrel]
import { Radians } from '@wollybeard/kit/num'

// Access via direct import
Radians.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L20" />

Type predicate to check if value is a valid radian angle. Note: Any finite number can represent an angle in radians.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): number & { [RadiansBrand]: true; } & { [FiniteBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L28" />

Construct a Radians angle. Throws if the value is not finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): (number & { [RadiansBrand]: true; } & { [FiniteBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L39" />

Try to construct a Radians angle. Returns null if the value is not finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromDegrees`

```typescript
(degrees: number): number & { [RadiansBrand]: true; } & { [FiniteBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L46" />

Convert degrees to radians.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toDegrees`

```typescript
(rad: Radians): number
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L53" />

Convert radians to degrees.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `normalize`

```typescript
(rad: Radians): number & { [RadiansBrand]: true; } & { [FiniteBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L60" />

Normalize radians to the range [0, 2π).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Radians`

```typescript
type Radians = number & { [RadiansBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L14" />

Angle in radians.
