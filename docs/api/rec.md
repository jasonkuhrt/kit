# Rec

Record utilities for working with plain JavaScript objects as dictionaries.

Provides type-safe operations for records (objects with PropertyKey indexes)

including type guards, merging, creation, and index signature manipulation.

Strictly validates plain objects, rejecting arrays and class instances.

## Import

::: code-group

```typescript [Namespace]
import { Rec } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Rec from '@wollybeard/kit/rec'
```

:::

## Factories

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `create`

```typescript
<value>(): Record<PropertyKey, value>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L197" />

**Returns:** An empty record typed to hold values of the specified type

Create an empty record with a specific value type.

Useful for initializing typed record collections.

**Examples:**

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
const scores = create<number>()
scores['alice'] = 95
scores['bob'] = 87
// scores is typed as Record<PropertyKey, number>
```

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
// Creating typed lookups
interface User {
  id: string
  name: string
}

const userLookup = create<User>()
userLookup['u123'] = { id: 'u123', name: 'Alice' }
```

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
// Useful as accumulator in reduce operations
// [!code word:reduce:1]
const grouped = items.reduce(
  (acc, item) => {
// [!code word:category:1]
    acc[item.category] = item
    return acc
  },
  create<Item>()
)
```

## Operations

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `merge`

```typescript
<rec1 extends Any, rec2 extends Any > (rec1: rec1, rec2: rec2): rec1 & rec2
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L116" />

**Parameters:**

- `rec1` - The base record to merge into
- `rec2` - The record to merge from

**Returns:** A new record with properties from both records merged

Deep merge two records, with properties from the second record overwriting the first.

This is an alias for Obj.merge that works specifically with record types.

**Examples:**

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
// [!code word:merge:1]
Rec.merge({ a: 1, b: 2 }, { b: 3, c: 4 })
// Returns: { a: 1, b: 3, c: 4 }
```

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
// Deep merging of nested records
// [!code word:merge:1]
Rec.merge(
  { user: { name: 'Alice', settings: { theme: 'dark' } } },
  { user: { settings: { fontSize: 16 } } }
)
// Returns: { user: { name: 'Alice', settings: { theme: 'dark', fontSize: 16 } } }
```

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
// Type-safe merging
type Config = { api: { url: string }; timeout?: number }
type Overrides = { api: { key: string }; timeout: number }

const config: Config = { api: { url: 'https://api.com' } }
const overrides: Overrides = { api: { key: 'secret' }, timeout: 5000 }
// [!code word:merge:1]
const merged = Rec.merge(config, overrides)
// merged is typed as Config & Overrides
```

## Type Guards

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`

```typescript
(value: unknown): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L67" />

**Parameters:**

- `value` - The value to check

**Returns:** True if the value is a plain record object

Check if a value is a record (plain object only, not class instances or arrays).

This is a strict check that only accepts plain objects with Object.prototype.

**Examples:**

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
// [!code word:is:1]
Rec.is({ a: 1, b: 2 }) // true
// [!code word:is:1]
Rec.is({}) // true
// [!code word:is:1]
Rec.is([1, 2, 3]) // false - arrays are not records
// [!code word:is:1]
Rec.is(null) // false
// [!code word:is:1]
Rec.is(new Date()) // false - class instances are not plain records
// [!code word:is:1]
// [!code word:create:1]
Rec.is(Object.create(null)) // false - not plain Object.prototype
```

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
// Type guard usage
function processData(data: unknown) {
// [!code word:is:1]
  if (Rec.is(data)) {
    // data is typed as Rec.Any
// [!code word:keys:1]
    Object.keys(data).forEach(key => {
// [!code word:log:1]
      console.log(data[key])
    })
  }
}
```

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Any`

```typescript
type Any = AnyKeyTo<unknown>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L7" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyReadonly`

```typescript
type AnyReadonly = AnyReadonlyKeyTo<unknown>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L12" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyKeyTo`

```typescript
type AnyKeyTo<$Value> = {
  [key: PropertyKey]: $Value
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L17" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyReadonlyKeyTo`

```typescript
type AnyReadonlyKeyTo<$Value> = {
  readonly [key: PropertyKey]: $Value
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L24" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Value`

```typescript
type Value = {
  [key: PropertyKey]: Lang.Value
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L31" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Optional`

```typescript
type Optional<$Key extends PropertyKey, $Value> = {
  [K in $Key]?: $Value
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L123" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RemoveIndex`

```typescript
type RemoveIndex<$T> = {
  [k in keyof $T as string extends k ? never : number extends k ? never : k]: $T[k]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L139" />

Remove index signatures from an object type.

Useful for converting Record types to object types with only known keys.

**Examples:**

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
type WithIndex = { a: string; b: number;[key: string]: any }
type WithoutIndex = RemoveIndex<WithIndex>  // { a: string; b: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsHasIndex`

```typescript
type IsHasIndex<$T, $Key extends PropertyKey = string> = $Key extends keyof $T ? true : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L155" />

Check if a type has an index signature.

**Examples:**

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
type T1 = IsHasIndex<{ [key: string]: any }>  // true
type T2 = IsHasIndex<{ a: string }>  // false
type T3 = IsHasIndex<{ [key: number]: any }, number>  // true
```
