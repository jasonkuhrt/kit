# Num.SafeInt

_Num_ / **SafeInt**

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.SafeInt.someFunction()
```

```typescript [Barrel]
import * as Num from '@wollybeard/kit/num'

// Access via namespace
Num.SafeInt.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L18" />

Type predicate to check if value is a safe integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): number & { [SafeIntBrand]: true; } & { [IntBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L26" />

Construct a SafeInt. Throws if the value is not a safe integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): (number & { [SafeIntBrand]: true; } & { [IntBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L37" />

Try to construct a SafeInt. Returns null if the value is not a safe integer.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `MAX_SAFE_INT`

```typescript
number & { [SafeIntBrand]: true; } & { [IntBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L44" />

The maximum safe integer constant.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `MIN_SAFE_INT`

```typescript
number & { [SafeIntBrand]: true; } & { [IntBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L49" />

The minimum safe integer constant.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `SafeInt`

```typescript
type SafeInt = number & { [SafeIntBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/safe-int/safe-int.ts#L13" />

Safe integer (within Number.MAX_SAFE_INTEGER).
