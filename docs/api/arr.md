# Arr

Array utilities for working with readonly and mutable arrays.

Provides functional utilities for array operations including mapping, filtering,
type guards, and conversions. Emphasizes immutable operations and type safety.

## Import

```typescript
import { Arr } from '@wollybeard/kit/arr'
```

## Functions

### assert <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L113)</sub>

Assert that a value is an array.
Throws a TypeError if the value is not an array.

```typescript
export function assert(value: unknown): void
```

**Examples:**

```ts twoslash
Arr.assert(value)
  // value is now typed as unknown[]
  value.forEach(item => console.log(item))
}
```

### includes <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L136)</sub>

```typescript
<$T>(array: $T[], value: unknown) => value is $T
```

### ensure <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L156)</sub>

```typescript
<$T>(value: $T | $T[]) => $T[]
```

## Constants

### Eq <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/traits/eq.ts#L33)</sub>

```typescript
Eq<Any>
```

### Type <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/traits/type.ts#L20)</sub>

```typescript
Type<Any>
```

### empty <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L71)</sub>

```typescript
readonly []
```

### emptyArray <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L82)</sub>

```typescript
readonly []
```

## Types

### Unknown <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L9)</sub>

```typescript
export type Unknown = readonly unknown[]
```

### Any <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L11)</sub>

```typescript
export type Any = readonly any[]
```

### Empty <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L13)</sub>

```typescript
export type Empty = readonly []
```

### All <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L26)</sub>

Check if all booleans in a tuple are true.

```typescript
export type All<$Tuple extends [...boolean[]]> = $Tuple[number] extends true
  ? true
  : false
```

**Examples:**

```ts twoslash
type T2 = All<[true, false, true]> // false
```

### IsTupleMultiple <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L37)</sub>

Check if a tuple has multiple elements.

```typescript
export type IsTupleMultiple<$T> = $T extends [unknown, unknown, ...unknown[]]
  ? true
  : false
```

**Examples:**

```ts twoslash
type T2 = IsTupleMultiple<[1]> // false
```

### Push <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L47)</sub>

Push a value onto a tuple.

```typescript
export type Push<$T extends any[], $V> = [...$T, $V]
```

**Examples:**

```ts twoslash
```

### FirstNonUnknownNever <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L52)</sub>

Get the first non-unknown, non-never element from a tuple.

```typescript
export type FirstNonUnknownNever<$T extends any[]> = $T extends
  [infer __first__, ...infer __rest__]
  ? unknown extends __first__
    ? 0 extends 1 & __first__ ? FirstNonUnknownNever<__rest__> // is any
    : FirstNonUnknownNever<__rest__> // is unknown
  : __first__ extends never ? FirstNonUnknownNever<__rest__>
  : __first__
  : never
```

### EmptyArray <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/arr/arr.ts#L87)</sub>

Type for the empty array constant.

```typescript
export type EmptyArray = typeof emptyArray
```
