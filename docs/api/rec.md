# Rec

Record utilities for working with plain JavaScript objects as dictionaries.

Provides type-safe operations for records (objects with PropertyKey indexes) including type guards, merging, creation, and index signature manipulation. Strictly validates plain objects, rejecting arrays and class instances.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `create`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L197" /> {#f-create-197}

```typescript
<value>(): Record<PropertyKey, value>
```

**Returns:** An empty record typed to hold values of the specified type

Create an empty record with a specific value type. Useful for initializing typed record collections.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `merge`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L116" /> {#f-merge-116}

```typescript
<rec1 extends Any, rec2 extends Any > (rec1: rec1, rec2: rec2): rec1 & rec2
```

**Parameters:**

- `rec1` - The base record to merge into
- `rec2` - The record to merge from

**Returns:** A new record with properties from both records merged

Deep merge two records, with properties from the second record overwriting the first. This is an alias for Obj.merge that works specifically with record types.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L67" /> {#f-is-67}

```typescript
(value: unknown): boolean
```

**Parameters:**

- `value` - The value to check

**Returns:** True if the value is a plain record object

Check if a value is a record (plain object only, not class instances or arrays). This is a strict check that only accepts plain objects with Object.prototype.

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Any`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L7" /> {#t-any-7}

```typescript
type Any = AnyKeyTo<unknown>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyReadonly`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L12" /> {#t-any-readonly-12}

```typescript
type AnyReadonly = AnyReadonlyKeyTo<unknown>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyKeyTo`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L17" /> {#t-any-key-to-17}

```typescript
type AnyKeyTo<$Value> = {
  [key: PropertyKey]: $Value
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyReadonlyKeyTo`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L24" /> {#t-any-readonly-key-to-24}

```typescript
type AnyReadonlyKeyTo<$Value> = {
  readonly [key: PropertyKey]: $Value
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Value`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L31" /> {#t-value-31}

```typescript
type Value = {
  [key: PropertyKey]: Lang.Value
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Optional`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L123" /> {#t-optional-123}

```typescript
type Optional<$Key extends PropertyKey, $Value> = {
  [K in $Key]?: $Value
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RemoveIndex`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L139" /> {#t-remove-index-139}

```typescript
type RemoveIndex<$T> = {
  [k in keyof $T as string extends k ? never : number extends k ? never : k]: $T[k]
}
```

Remove index signatures from an object type. Useful for converting Record types to object types with only known keys.

**Examples:**

```typescript twoslash
// @noErrors
import { Rec } from '@wollybeard/kit/rec'
// ---cut---
type WithIndex = { a: string; b: number;[key: string]: any }
type WithoutIndex = RemoveIndex<WithIndex>  // { a: string; b: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsHasIndex`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/rec/rec.ts#L155" /> {#t-is-has-index-155}

```typescript
type IsHasIndex<$T, $Key extends PropertyKey = string> = $Key extends keyof $T ? true : false
```

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
