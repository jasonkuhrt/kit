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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L21" /> {#f-is-21}

```typescript
(value: unknown): boolean
```

Type predicate to check if value is odd. Returns Odd & Int when the value is an odd integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `from`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L29" /> {#f-from-29}

```typescript
(value: number): number & { [OddBrand]: true; } & { [IntBrand]: true; }
```

Construct an Odd integer. Throws if the value is not an odd integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `tryFrom`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L43" /> {#f-try-from-43}

```typescript
(value: number): (number & { [OddBrand]: true; } & { [IntBrand]: true; }) | null
```

Try to construct an Odd integer. Returns null if the value is not an odd integer.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `next`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L50" /> {#f-next-50}

```typescript
(value: number): number & { [OddBrand]: true; } & { [IntBrand]: true; }
```

Get the next odd number (rounds up if even).

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `prev`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L58" /> {#f-prev-58}

```typescript
(value: number): number & { [OddBrand]: true; } & { [IntBrand]: true; }
```

Get the previous odd number (rounds down if even).

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Odd`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/num/odd/odd.ts#L15" /> {#intersection-odd-15}

```typescript
type Odd = number & { [OddBrand]: true }
```

Odd integer. Note: This stacks with Int brand to allow Int & Odd.
