# Num.Zero

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Zero
```

```typescript [Barrel]
import { Zero } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/zero/zero.ts#L16" /> {#f-is-16}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/zero/zero.ts#L24" /> {#f-from-24}

```typescript
(value: number): Zero
```

Construct a Zero. Throws if the value is not zero.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/zero/zero.ts#L35" /> {#f-try-from-35}

```typescript
(value: number): Zero | null
```

Try to construct a Zero. Returns null if the value is not zero.

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `ZERO`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/zero/zero.ts#L42" /> {#c-zero-42}

```typescript
Zero
```

The zero constant.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Zero`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/zero/zero.ts#L11" /> {#intersection-zero-11}

```typescript
type Zero = 0 & { [ZeroBrand]: true }
```

Zero.
