# Num.Percentage

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Percentage
```

```typescript [Barrel]
import { Percentage } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L19" />

Type predicate for percentage (0-1).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): Percentage
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L27" />

Construct a Percentage. Throws if the value is not between 0 and 1.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): Percentage | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L38" />

Try to construct a Percentage. Returns null if the value is not between 0 and 1.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromPercent`

```typescript
(value: number): Percentage
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L45" />

Convert a percentage value (0-100) to a decimal (0-1).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toPercent`

```typescript
(value: Percentage): number
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L52" />

Convert a decimal (0-1) to a percentage value (0-100).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `clamp`

```typescript
(value: number): Percentage
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L59" />

Clamp a value to percentage range (0-1).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Percentage`

```typescript
type Percentage = InRange<0, 1> & { [PercentageBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L14" />

Percentage (0-1). Represents a value between 0% (0.0) and 100% (1.0).
