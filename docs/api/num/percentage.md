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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L19" /> {#f-is-19}

```typescript
(value: unknown): boolean
```

Type predicate for percentage (0-1).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L27" /> {#f-from-27}

```typescript
(value: number): Percentage
```

Construct a Percentage. Throws if the value is not between 0 and 1.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L38" /> {#f-try-from-38}

```typescript
(value: number): Percentage | null
```

Try to construct a Percentage. Returns null if the value is not between 0 and 1.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `fromPercent`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L45" /> {#f-from-percent-45}

```typescript
(value: number): Percentage
```

Convert a percentage value (0-100) to a decimal (0-1).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toPercent`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L52" /> {#f-to-percent-52}

```typescript
(value: Percentage): number
```

Convert a decimal (0-1) to a percentage value (0-100).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `clamp`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L59" /> {#f-clamp-59}

```typescript
(value: number): Percentage
```

Clamp a value to percentage range (0-1).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Percentage`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/percentage/percentage.ts#L14" /> {#intersection-percentage-14}

```typescript
type Percentage = InRange<0, 1> & { [PercentageBrand]: true }
```

Percentage (0-1). Represents a value between 0% (0.0) and 100% (1.0).
