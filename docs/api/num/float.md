# Num.Float

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Float.someFunction()
```

```typescript [Barrel]
import { Float } from '@wollybeard/kit/num'

// Access via direct import
Float.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/float/float.ts#L18" />

Type predicate to check if value is a float (non-integer number).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): number & { [FloatBrand]: true; } & { [FiniteBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/float/float.ts#L26" />

Construct a Float. Throws if the value is not a float.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): (number & { [FloatBrand]: true; } & { [FiniteBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/float/float.ts#L40" />

Try to construct a Float. Returns null if the value is not a float.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `toFloat`

```typescript
(value: number): number & { [FloatBrand]: true; } & { [FiniteBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/float/float.ts#L47" />

Convert an integer to a float by adding a small decimal.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Float`

```typescript
type Float = number & { [FloatBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/float/float.ts#L13" />

Float (non-integer finite number).
