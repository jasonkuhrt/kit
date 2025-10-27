# Obj.Union

Union operations on objects.

This module provides utilities for working with unions of object types, solving common TypeScript limitations when dealing with union types:

- `keyof (A | B)` returns only common keys (intersection), not all keys (union) - `(A | B)['key']` returns `any` for keys not in all members - No built-in way to merge union members while preserving value unions per key

These utilities use distributive conditional types to properly handle each union member separately, then combine the results.

## Import

::: code-group

```typescript [Namespace]
import { Obj } from '@wollybeard/kit'

// Access via namespace
Obj.Union
```

```typescript [Barrel]
import { Union } from '@wollybeard/kit/obj'
```

:::

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Merge`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/union.ts#L67" /> {#t-merge-67}

```typescript
type Merge<$Union extends object> = {
  [k in Keys<$Union>]: ValueAt<$Union, k>
}
```

Union operations on objects.

This module provides utilities for working with unions of object types, solving common TypeScript limitations when dealing with union types:

- `keyof (A | B)` returns only common keys (intersection), not all keys (union)
- `(A | B)['key']` returns `any` for keys not in all members
- No built-in way to merge union members while preserving value unions per key

These utilities use distributive conditional types to properly handle each union member separately, then combine the results.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Keys`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/union.ts#L124" /> {#t-keys-124}

```typescript
type Keys<
  $Union extends object,
> = $Union extends __FORCE_DISTRIBUTION__ ? keyof $Union
  : never
```

Collects all keys from all members of a union of objects into a single union of keys.

**Problem:** TypeScript's built-in `keyof` operator on a union type returns only the keys that are common to ALL union members (intersection behavior), not all possible keys (union behavior). This is often counterintuitive when working with union types.

**Solution:** This utility uses distributive conditional types to iterate over each union member separately, extract its keys, then union all the results together.

Common use cases:

- Type-safe property access across union members
- Building generic utilities that work with any key from union types
- Validating property names in discriminated unions

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// The problem with built-in keyof
type A = { x: string; y: number }
type B = { x: boolean; z: string }

type Problem = keyof (A | B) // 'x' (only keys in BOTH types)
type Solution = Obj.Union.Keys<A | B> // 'x' | 'y' | 'z' (all keys)
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Real-world: Type-safe property picker for discriminated unions
type Circle = { kind: 'circle'; radius: number }
type Square = { kind: 'square'; size: number }
type Shape = Circle | Square

type AllShapeKeys = Obj.Union.Keys<Shape>
// 'kind' | 'radius' | 'size'

function getProperty<K extends AllShapeKeys>(
  shape: Shape,
  key: K,
): Obj.Union.ValueAt<Shape, K> {
  return (shape as any)[key]
}
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Works with optional properties
type Partial1 = { a?: string }
type Partial2 = { b?: number }

type Keys = Obj.Union.Keys<Partial1 | Partial2> // 'a' | 'b'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ValueAt`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/union.ts#L206" /> {#t-value-at-206}

```typescript
type ValueAt<
  $Union extends object,
  $Key extends PropertyKey,
> = $Union extends __FORCE_DISTRIBUTION__
  ? $Key extends keyof $Union ? $Union[$Key]
  : never
  : never
```

Gets the union of all possible value types for a specific key across all members of a union of objects.

**Problem:** TypeScript's indexed access `(A | B)['key']` has problematic behavior:

- Returns `any` when the key doesn't exist in all union members
- Loses type information in complex union scenarios
- Doesn't handle optional properties correctly

**Solution:** This utility uses distributive conditional types to: 1. Check each union member separately for the key 2. Collect the value type if present 3. Return `never` for members without the key (which gets filtered from the union) 4. Union all the collected value types together

Common use cases:

- Type-safe property getters for union types
- Building mapped types over discriminated unions
- Creating type-safe validators for specific properties

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// The problem with built-in indexed access
type A = { x: string; y: number }
type B = { x: boolean; z: string }

type Problem = (A | B)['y'] // any (unsafe - 'y' not in B!)
type Solution = Obj.Union.ValueAt<A | B, 'y'> // number (correct!)
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Keys in all members produce value union
type A = { x: string; y: number }
type B = { x: boolean; z: string }

type X = Obj.Union.ValueAt<A | B, 'x'> // string | boolean
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Real-world: Type-safe discriminant extraction
type Success = { status: 'success'; data: string }
type Error = { status: 'error'; message: string }
type Result = Success | Error

type Status = Obj.Union.ValueAt<Result, 'status'>
// 'success' | 'error'

type Data = Obj.Union.ValueAt<Result, 'data'>
// string (only from Success, Error filtered as never)
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Keys not in any member return never
type A = { x: string }
type B = { y: number }

type Missing = Obj.Union.ValueAt<A | B, 'z'> // never
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Works with optional properties
type Config1 = { port?: number }
type Config2 = { port?: string }

type Port = Obj.Union.ValueAt<Config1 | Config2, 'port'>
// number | string | undefined
```
