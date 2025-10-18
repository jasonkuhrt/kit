# Num.Odd

## Import

::: code-group

```typescript [Namespace]
import { Num } from '@wollybeard/kit'

// Access via namespace
Num.Odd
```

```typescript [Barrel]
import { Odd } from '@wollybeard/kit/num'
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L21" />

Type predicate to check if value is odd. Returns Odd & Int when the value is an odd integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`

```typescript
(value: number): number & { [OddBrand]: true; } & { [IntBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L29" />

Construct an Odd integer. Throws if the value is not an odd integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`

```typescript
(value: number): (number & { [OddBrand]: true; } & { [IntBrand]: true; }) | null
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L43" />

Try to construct an Odd integer. Returns null if the value is not an odd integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `next`

```typescript
(value: number): number & { [OddBrand]: true; } & { [IntBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L50" />

Get the next odd number (rounds up if even).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prev`

```typescript
(value: number): number & { [OddBrand]: true; } & { [IntBrand]: true; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L58" />

Get the previous odd number (rounds down if even).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Odd`

```typescript
type Odd = number & { [OddBrand]: true }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L15" />

Odd integer. Note: This stacks with Int brand to allow Int & Odd.
