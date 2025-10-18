# Num.Radians

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Radians
```

```typescript [Barrel]
import { Radians } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L20" /> {#f-is-20}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is a valid radian angle. Note: Any finite number can represent an angle in radians.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L28" /> {#f-from-28}

```typescript
(value: number): number & { [RadiansBrand]: true; } & { [FiniteBrand]: true; }
```

Construct a Radians angle. Throws if the value is not finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L39" /> {#f-try-from-39}

```typescript
(value: number): (number & { [RadiansBrand]: true; } & { [FiniteBrand]: true; }) | null
```

Try to construct a Radians angle. Returns null if the value is not finite.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromDegrees`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L46" /> {#f-from-degrees-46}

```typescript
(degrees: number): number & { [RadiansBrand]: true; } & { [FiniteBrand]: true; }
```

Convert degrees to radians.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toDegrees`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L53" /> {#f-to-degrees-53}

```typescript
(rad: Radians): number
```

Convert radians to degrees.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `normalize`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L60" /> {#f-normalize-60}

```typescript
(rad: Radians): number & { [RadiansBrand]: true; } & { [FiniteBrand]: true; }
```

Normalize radians to the range [0, 2π).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Radians`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/radians/radians.ts#L14" /> {#intersection-radians-14}

```typescript
type Radians = number & { [RadiansBrand]: true }
```

Angle in radians.
