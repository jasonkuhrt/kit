# Arr

Array utilities for working with readonly and mutable arrays.

Provides functional utilities for array operations including mapping, filtering, type guards, and conversions. Emphasizes immutable operations and type safety.

## Import

::: code-group

```typescript [Namespace]
import { Arr } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Arr from '@wollybeard/kit/arr'
```

:::

## Access

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `last`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L186" /> {#f-last-186}

```typescript
<$T>(array: readonly $T[]): $T | undefined
```

**Parameters:**

- `array` - The array to get the last element from

**Returns:** The last element, or `undefined` if the array is empty

Get the last element of an array.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit/arr'
// ---cut---
// [!code word:last:1]
Arr.last([1, 2, 3])  // 3
// [!code word:last:1]
Arr.last(['a'])  // 'a'
// [!code word:last:1]
Arr.last([])  // undefined
```

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `empty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L78" /> {#c-empty-78}

```typescript
readonly[]
```

:::warning DEPRECATED
Use Array.empty from Effect instead
:::

Empty array constant.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit'

// [!code word:empty:1]
const emptyArray = Arr.empty
// [!code word:log:1]
console.log(emptyArray) // []
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `emptyArray`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L90" /> {#c-empty-array-90}

```typescript
readonly[]
```

Empty array constant (frozen). Useful as a default value or sentinel.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit/arr'
// ---cut---
// [!code word:emptyArray:1]
const arr = items ?? Arr.emptyArray
```

## Normalization

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `ensure`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L169" /> {#f-ensure-169}

```typescript
<$T>(value: $T | $T[]): $T[]
```

**Parameters:**

- `value` - The value to ensure as array

**Returns:** An array containing the value(s)

Ensure a value is an array. If the value is already an array, return it as-is. Otherwise, wrap it in an array.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit/arr'
// ---cut---
// [!code word:ensure:1]
Arr.ensure('hello')  // ['hello']
// [!code word:ensure:1]
Arr.ensure(['a', 'b'])  // ['a', 'b']
// [!code word:ensure:1]
Arr.ensure(42)  // [42]
```

## Search

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `includes`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L148" /> {#f-includes-148}

```typescript
<$T>(array: $T[], value: unknown): boolean
```

**Parameters:**

- `array` - The array to search in
- `value` - The unknown value to search for

**Returns:** True if the value is in the array, with type narrowing

Type-safe array includes check that narrows the type of the value. Unlike the standard `includes`, this provides proper type narrowing.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit/arr'
// ---cut---
const fruits = ['apple', 'banana', 'orange'] as const
const value: unknown = 'apple'

// [!code word:includes:1]
if (Arr.includes(fruits, value)) {
  // value is now typed as 'apple' | 'banana' | 'orange'
}
```

## Traits

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Eq`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/traits/eq.ts#L35" /> {#c-eq-35}

```typescript
Eq<Any>
```

Eq trait implementation for immutable arrays.

Provides deep structural equality for readonly arrays by recursively comparing elements using their appropriate Eq implementations.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit'

// Basic array equality
// [!code word:is:1]
Arr.Eq.is([1, 2, 3], [1, 2, 3]) // true
// [!code word:is:1]
Arr.Eq.is([1, 2, 3], [1, 2, 4]) // false
// [!code word:is:1]
Arr.Eq.is([1, 2], [1, 2, 3]) // false (different lengths)

// Nested arrays
// [!code word:is:1]
Arr.Eq.is(
  [[1, 2], [3, 4]],
  [[1, 2], [3, 4]]
) // true

// Mixed types
// [!code word:is:1]
Arr.Eq.is(
  [1, 'hello', true],
  [1, 'hello', true]
) // true
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Type`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/traits/type.ts#L21" /> {#c-type-21}

```typescript
Type<Any>
```

Type trait implementation for immutable arrays.

Provides type checking for readonly array values using Array.isArray.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit'

// [!code word:is:1]
Arr.Type.is([1, 2, 3])     // true
// [!code word:is:1]
Arr.Type.is([])            // true
// [!code word:is:1]
Arr.Type.is('not array')   // false
// [!code word:is:1]
Arr.Type.is(null)          // false
```

## Transformation

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `transpose`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L222" /> {#f-transpose-222}

```typescript
<$T>(rows: readonly(readonly $T[])[]): $T[][]
```

**Parameters:**

- `rows` - The 2D array to transpose

**Returns:** The transposed 2D array

Transpose a 2D array (convert rows to columns and vice versa). This is a classic matrix transpose operation.

Handles ragged arrays (rows with different lengths) by creating columns that only contain elements from rows that had values at that position.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit/arr'
// ---cut---
const rows = [
  [1, 2, 3],
  [4, 5, 6]
]
// [!code word:transpose:1]
Arr.transpose(rows)
// [[1, 4], [2, 5], [3, 6]]

const table = [
  ['Alice', 'Engineer', '100k'],
  ['Bob', 'Designer', '90k']
]
// [!code word:transpose:1]
Arr.transpose(table)
// [['Alice', 'Bob'], ['Engineer', 'Designer'], ['100k', '90k']]

// Ragged array (uneven row lengths)
const ragged = [[1, 2, 3], [4, 5]]
// [!code word:transpose:1]
Arr.transpose(ragged)
// [[1, 4], [2, 5], [3]]
```

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `assert`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L124" /> {#f-assert-124}

```typescript
(value: unknown): void
```

**Parameters:**

- `value` - The value to check

**Throws:**

- TypeError If the value is not an array

Assert that a value is an array. Throws a TypeError if the value is not an array.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit/arr'
// ---cut---
function process(value: unknown) {
// [!code word:assert:1]
  Arr.assert(value)
  // value is now typed as unknown[]
// [!code word:forEach:1]
// [!code word:log:1]
  value.forEach(item => console.log(item))
}
```

## Type Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `All`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L27" /> {#t-all-27}

```typescript
type All<$Tuple extends [...boolean[]]> = $Tuple[number] extends true ? true : false
```

Check if all booleans in a tuple are true.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit/arr'
// ---cut---
type T1 = All<[true, true, true]>  // true
type T2 = All<[true, false, true]>  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsTupleMultiple`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L39" /> {#t-is-tuple-multiple-39}

```typescript
type IsTupleMultiple<$T> = $T extends [unknown, unknown, ...unknown[]] ? true : false
```

Check if a tuple has multiple elements.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit/arr'
// ---cut---
type T1 = IsTupleMultiple<[1, 2]>  // true
type T2 = IsTupleMultiple<[1]>  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Push`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L50" /> {#t-push-50}

```typescript
type Push<$T extends any[], $V> = [...$T, $V]
```

Push a value onto a tuple.

**Examples:**

```typescript twoslash
// @noErrors
import { Arr } from '@wollybeard/kit/arr'
// ---cut---
type T = Push<[1, 2], 3>  // [1, 2, 3]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `FirstNonUnknownNever`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L57" /> {#t-first-non-unknown-never-57}

```typescript
type FirstNonUnknownNever<$T extends any[]> = $T extends [infer __first__, ...infer __rest__]
  ? unknown extends __first__ ? 0 extends 1 & __first__ ? FirstNonUnknownNever<__rest__> // is any
  : FirstNonUnknownNever<__rest__> // is unknown
  : __first__ extends never ? FirstNonUnknownNever<__rest__>
  : __first__
  : never
```

Get the first non-unknown, non-never element from a tuple.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `EmptyArray`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L97" /> {#t-empty-array-97}

```typescript
type EmptyArray = typeof emptyArray
```

Type for the empty array constant.

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Unknown`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L9" /> {#t-unknown-9}

```typescript
type Unknown = readonly unknown[]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Any`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L11" /> {#t-any-11}

```typescript
type Any = readonly any[]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Empty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/arr/arr.ts#L13" /> {#t-empty-13}

```typescript
type Empty = readonly []
```
