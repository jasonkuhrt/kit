# Obj

Object utilities for working with plain JavaScript objects.

Provides type-safe utilities for object operations including property access, manipulation, merging, filtering, and transformations. Supports both value-level and type-level operations with strong type inference.

## Import

::: code-group

```typescript [Namespace]
import { Obj } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Obj from '@wollybeard/kit/obj'
```

:::

## Namespaces

| Namespace                     | Description                  |
| ----------------------------- | ---------------------------- |
| [**`Union`**](/api/obj/union) | Union operations on objects. |

This module provides utilities for working with unions of object types, solving common TypeScript limitations when dealing with union types:

- `keyof (A | B)` returns only common keys (intersection), not all keys (union) - `(A | B)['key']` returns `any` for keys not in all members - No built-in way to merge union members while preserving value unions per key

These utilities use distributive conditional types to properly handle each union member separately, then combine the results. |
| [**`PropertySignature`**](/api/obj/property-signature) | — |

## Access

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L63" /> {#f-get-with-63}

```typescript
<pathInput extends PropertyPathInput>(pathInput: pathInput): <obj extends InferShapeFromPropertyPath<normalizePropertyPathInput<pathInput>>>(obj: obj) => getWith<normalizePropertyPathInput<pathInput>, obj>
```

**Parameters:**

- `pathInput` - A dot-notation string or array of property names

**Returns:** A function that extracts the value at the specified path

Create a getter function for a specific property path. Returns a function that extracts the value at that path from any compatible object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:getWith:1]
const getCityName = Obj.getWith('address.city')
getCityName({ address: { city: 'NYC' } }) // 'NYC'
getCityName({ address: { city: 'LA' } }) // 'LA'
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Type-safe property access
// [!code word:getWith:1]
const getAge = Obj.getWith(['user', 'profile', 'age'])
const data = { user: { profile: { age: 30 } } }
const age = getAge(data) // number
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Useful for mapping over arrays
const users = [
  { name: 'Alice', score: 95 },
  { name: 'Bob', score: 87 }
]
// [!code word:map:1]
// [!code word:getWith:1]
users.map(Obj.getWith('score')) // [95, 87]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L122" /> {#f-get-on-122}

```typescript
(obj: object): (pathInput: PropertyPathInput) => unknown
```

**Parameters:**

- `obj` - The object to extract values from

**Returns:** A function that accepts a property path and returns the value at that path

Create a getter function bound to a specific object. Returns a function that can extract values from that object using any property path. Inverse parameter order of getWith.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const user = {
  name: 'Alice',
  address: { city: 'NYC', zip: '10001' }
}

// [!code word:getOn:1]
const getUserProp = Obj.getOn(user)
getUserProp('name') // 'Alice'
getUserProp('address.city') // 'NYC'
getUserProp(['address', 'zip']) // '10001'
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Useful for extracting multiple properties
const config = { api: { url: 'https://api.com', key: 'secret' } }
// [!code word:getOn:1]
const getConfig = Obj.getOn(config)

const apiUrl = getConfig('api.url')
const apiKey = getConfig('api.key')
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `entries`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L156" /> {#f-entries-156}

```typescript
<obj extends Any>(obj: obj): { [K in keyof obj] -?: undefined extends obj[K] ? {} extends Pick<obj, K> ? [K, Exclude<obj[K]>] : [K, obj[K]] : [K, obj[K]]; } [keyof obj][]
```

**Parameters:**

- `obj` - The object to extract entries from

**Returns:** An array of tuples containing [key, value] pairs

Get an array of key-value pairs from an object. Preserves exact types including optional properties and undefined values.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:entries:1]
Obj.entries({ a: 1, b: 'hello', c: true })
// Returns: [['a', 1], ['b', 'hello'], ['c', true]]
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Handles optional properties and undefined values
// [!code word:entries:1]
Obj.entries({ a: 1, b?: 2, c: undefined })
// Returns proper types preserving optionality
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `stringKeyEntries`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L183" /> {#f-string-key-entries-183}

```typescript
<$T extends object>(obj: $T): [string & keyof $T, $T[keyof $T]][]
```

**Parameters:**

- `obj` - The object to extract entries from

**Returns:** An array of [key, value] tuples where keys are strings

Get entries from an object with string keys only.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const obj = { a: 1, b: 2 }
// [!code word:stringKeyEntries:1]
Obj.stringKeyEntries(obj)  // [['a', 1], ['b', 2]]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `entriesStrict`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L200" /> {#f-entries-strict-200}

```typescript
<$T extends object>(obj: $T): { [k in keyof $T]: [k, Exclude<$T[k], undefined>]; } [keyof $T][]
```

**Parameters:**

- `obj` - The object to extract entries from

**Returns:** An array of [key, value] tuples excluding undefined values

Get entries from an object excluding undefined values.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const obj = { a: 1, b: undefined, c: 2 }
// [!code word:entriesStrict:1]
Obj.entriesStrict(obj)  // [['a', 1], ['c', 2]]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `keysStrict`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L222" /> {#f-keys-strict-222}

```typescript
<$T extends object>(obj: $T): (keyof $T)[]
```

**Parameters:**

- `obj` - The object to extract keys from

**Returns:** An array of keys

Get keys from an object with proper type inference. Type-safe version of Object.keys.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const obj = { a: 1, b: 2 }
// [!code word:keysStrict:1]
Obj.keysStrict(obj)  // ['a', 'b'] with type ('a' | 'b')[]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getRandomly`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L241" /> {#f-get-randomly-241}

```typescript
<obj extends Any>(obj: obj): keyof obj extends never ? undefined : obj[keyof obj]
```

**Parameters:**

- `obj` - The object to get a random value from

**Returns:** A random value from the object, or undefined for empty objects

Get a random property value from an object

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:getRandomly:1]
Obj.getRandomly({ a: 1, b: 2, c: 3 }) // Could return 1, 2, or 3
// [!code word:getRandomly:1]
Obj.getRandomly({ a: 1, b: undefined }) // Could return 1 or undefined
// [!code word:getRandomly:1]
Obj.getRandomly({}) // Returns undefined
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getValueAtPath`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L270" /> {#f-get-value-at-path-270}

```typescript
<$T, ___Path extends readonly string[] > (obj: $T, path: ___Path): any
```

**Parameters:**

- `obj` - The object to traverse
- `path` - Array of property names representing the path

**Returns:** The value at the path, or undefined if not found

Get a value at a path in an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const obj = { a: { b: { c: 42 } } }
// [!code word:getValueAtPath:1]
Obj.getValueAtPath(obj, ['a', 'b', 'c'])  // 42
// [!code word:getValueAtPath:1]
Obj.getValueAtPath(obj, ['a', 'x'])  // undefined
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `values`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L300" /> {#f-values-300}

```typescript
<$T extends object>(obj: $T): values<$T>
```

**Parameters:**

- `obj` - The object to extract values from

**Returns:** An array of values

Get an array of values from an object. Type-safe version of Object.values.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const obj = { a: 1, b: 'hello', c: true }
// [!code word:values:1]
Obj.values(obj)  // [1, 'hello', true] with type (string | number | boolean)[]
```

## Filtering

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pick`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L62" /> {#f-pick-62}

```typescript
<T extends object, K extends keyof T > (obj: T, keys: readonly K[]): Pick < T, K >
  <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value?: undefined, obj?: undefined) => boolean): Partial < $Object >
    <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value: $Object[keyof $Object], obj?: $Object | undefined) => boolean): Partial < $Object >
      <T extends object, K extends keyof T > (obj: T, keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)): Pick<T, K> | Partial<T>
```

**Parameters:**

- `obj` - The object to pick properties from

**Returns:** A new object containing only the specified properties

Create a new object with only the specified properties.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using array of keys
const user = { name: 'Alice', age: 30, email: 'alice@example.com' }
// [!code word:pick:1]
const publicInfo = Obj.pick(user, ['name', 'email'])
// Result: { name: 'Alice', email: 'alice@example.com' }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Type-safe property selection
interface User {
  id: number
  name: string
  password: string
  email: string
}

function getPublicUser(user: User) {
// [!code word:pick:1]
  return Obj.pick(user, ['id', 'name', 'email'])
  // Type: Pick<User, 'id' | 'name' | 'email'>
}
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using a predicate function (key only)
const obj = { a: 1, b: 2, c: 3 }
// [!code word:pick:1]
Obj.pick(obj, k => k !== 'b') // { a: 1, c: 3 }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using a filter function (key, value, obj)
const obj = { a: 1, b: 2, c: 3 }
// [!code word:pick:1]
Obj.pick(obj, (k, v) => v > 1) // { b: 2, c: 3 }
// [!code word:pick:1]
Obj.pick(obj, (k, v, o) => v > average(o)) // picks above-average values
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `omit`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L162" /> {#f-omit-162}

```typescript
<T extends object, K extends keyof T > (obj: T, keys: readonly K[]): Omit < T, K >
  <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value?: undefined, obj?: undefined) => boolean): Partial < $Object >
    <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value: $Object[keyof $Object], obj?: $Object | undefined) => boolean): Partial < $Object >
      <T extends object, K extends keyof T > (obj: T, keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)): Omit<T, K> | Partial<T>
```

**Parameters:**

- `obj` - The object to omit properties from

**Returns:** A new object without the specified properties

Create a new object with the specified properties removed.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using array of keys
const user = { name: 'Alice', age: 30, password: 'secret' }
// [!code word:omit:1]
const safeUser = Obj.omit(user, ['password'])
// Result: { name: 'Alice', age: 30 }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Remove sensitive fields
interface User {
  id: number
  name: string
  password: string
  apiKey: string
}

function sanitizeUser(user: User) {
// [!code word:omit:1]
  return Obj.omit(user, ['password', 'apiKey'])
  // Type: Omit<User, 'password' | 'apiKey'>
}
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using a predicate function (key only)
const obj = { a: 1, b: 2, c: 3 }
// [!code word:omit:1]
Obj.omit(obj, k => k === 'b') // { a: 1, c: 3 } (excludes b)
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using a filter function (key, value, obj)
const obj = { a: 1, b: 2, c: 3 }
// [!code word:omit:1]
Obj.omit(obj, (k, v) => v > 1) // { a: 1 } (excludes b and c where value > 1)
// [!code word:omit:1]
Obj.omit(obj, (k, v, o) => v > average(o)) // excludes above-average values
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pickWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L91" /> {#f-pick-with-91}

```typescript
<K extends PropertyKey>(keysOrPredicate: readonly K[] | ((key: PropertyKey, value?: any, obj?: any) => boolean)): <T extends object>(obj: T) => any
```

Curried version of pick

- takes keys/predicate first, then object.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pickOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L105" /> {#f-pick-on-105}

```typescript
<T extends object>(obj: T): <K extends keyof T>(keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)) => any
```

Curried version of pick

- takes object first, then keys/predicate.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `omitWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L192" /> {#f-omit-with-192}

```typescript
<K extends PropertyKey>(keysOrPredicate: readonly K[] | ((key: PropertyKey, value?: any, obj?: any) => boolean)): <T extends object>(obj: T) => any
```

Curried version of omit

- takes keys/predicate first, then object.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `omitOn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L206" /> {#f-omit-on-206}

```typescript
<T extends object>(obj: T): <K extends keyof T>(keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)) => any
```

Curried version of omit

- takes object first, then keys/predicate.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `policyFilter`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L236" /> {#f-policy-filter-236}

```typescript
<$Object extends object, $Key extends Keyof<$Object>, $Mode extends 'allow' | 'deny' > (mode: $Mode, obj: $Object, keys: readonly $Key[]): PolicyFilter<$Object, $Key, $Mode>
```

**Parameters:**

- `mode` - 'allow' to keep only specified keys, 'deny' to remove specified keys
- `obj` - The object to filter
- `keys` - The keys to process

**Returns:** A filtered object with proper type inference

Filter object properties based on a policy mode and set of keys.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const obj = { a: 1, b: 2, c: 3 }

// Allow mode: keep only 'a' and 'c'
// [!code word:policyFilter:1]
Obj.policyFilter('allow', obj, ['a', 'c']) // { a: 1, c: 3 }

// Deny mode: remove 'a' and 'c'
// [!code word:policyFilter:1]
Obj.policyFilter('deny', obj, ['a', 'c']) // { b: 2 }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `omitUndefined`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L291" /> {#c-omit-undefined-291}

```typescript
<T>(obj: T) => any
```

Remove all properties with `undefined` values from an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const obj = { a: 1, b: undefined, c: 'hello', d: undefined }
// [!code word:omitUndefined:1]
Obj.omitUndefined(obj) // { a: 1, c: 'hello' }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Useful for cleaning up optional parameters
const config = {
  host: 'localhost',
// [!code word:port:1]
  port: options.port,      // might be undefined
// [!code word:timeout:1]
  timeout: options.timeout  // might be undefined
}
// [!code word:omitUndefined:1]
const cleanConfig = Obj.omitUndefined(config)
// Only includes properties that have actual values
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `partition`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L321" /> {#c-partition-321}

```typescript
partition
```

Partition an object into picked and omitted parts.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const obj = { a: 1, b: 2, c: 3 }
// [!code word:partition:1]
const { picked, omitted } = Obj.partition(obj, ['a', 'c'])
// picked: { a: 1, c: 3 }
// omitted: { b: 2 }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pickMatching`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L357" /> {#f-pick-matching-357}

```typescript
<T extends object>(obj: T, predicate: (key: string) => boolean): Partial<T>
```

**Parameters:**

- `obj` - The object to filter
- `predicate` - Function that returns true to keep a key

**Returns:** A new object with only the key/value pairs where key predicate returned true

Filter object properties by key pattern matching. Useful for extracting properties that match a pattern like data attributes.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const props = {
  'data-type': 'button',
  'data-current': true,
  onClick: fn,
  className: 'btn'
}
// [!code word:pickMatching:1]
// [!code word:startsWith:1]
const dataAttrs = Obj.pickMatching(props, key => key.startsWith('data-'))
// Result: { 'data-type': 'button', 'data-current': true }
```

## Merging

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mergeWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L43" /> {#f-merge-with-43}

```typescript
(mergers?: MergeOptions | undefined): <obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2
```

**Parameters:**

- `mergers` - Options to customize merge behavior

**Returns:** A merge function with the specified behavior

Create a customized merge function with specific merge behavior options. Allows control over how undefined values, defaults, and arrays are handled.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Create a merger that ignores undefined values
// [!code word:mergeWith:1]
const mergeIgnoreUndefined = Obj.mergeWith({ undefined: false })
mergeIgnoreUndefined({ a: 1 }, { a: undefined, b: 2 })
// Returns: { a: 1, b: 2 }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Create a merger that concatenates arrays
// [!code word:mergeWith:1]
const mergeArrays = Obj.mergeWith({
// [!code word:push:1]
  array: (a, b) => { a.push(...b) }
})
mergeArrays({ items: [1, 2] }, { items: [3, 4] })
// Returns: { items: [1, 2, 3, 4] }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `merge`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L81" /> {#c-merge-81}

```typescript
<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2
```

Deep merge two objects, with properties from the second object overwriting the first. Recursively merges nested objects, but arrays and other non-object values are replaced.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:merge:1]
Obj.merge({ a: 1, b: 2 }, { b: 3, c: 4 })
// Returns: { a: 1, b: 3, c: 4 }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Deep merging of nested objects
// [!code word:merge:1]
Obj.merge(
  { user: { name: 'Alice', age: 30 } },
  { user: { age: 31, city: 'NYC' } }
)
// Returns: { user: { name: 'Alice', age: 31, city: 'NYC' } }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Arrays are replaced, not merged
// [!code word:merge:1]
Obj.merge({ tags: ['a', 'b'] }, { tags: ['c', 'd'] })
// Returns: { tags: ['c', 'd'] }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mergeWithArrayPush`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L108" /> {#c-merge-with-array-push-108}

```typescript
<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2
```

Deep merge two objects with special handling for arrays. When both objects have an array at the same path, concatenates them instead of replacing.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:mergeWithArrayPush:1]
Obj.mergeWithArrayPush(
  { tags: ['react', 'typescript'] },
  { tags: ['nodejs', 'express'] }
)
// Returns: { tags: ['react', 'typescript', 'nodejs', 'express'] }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Works with nested arrays
// [!code word:mergeWithArrayPush:1]
Obj.mergeWithArrayPush(
  { user: { skills: ['js'] } },
  { user: { skills: ['ts'] } }
)
// Returns: { user: { skills: ['js', 'ts'] } }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mergeWithArrayPushDedupe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L139" /> {#c-merge-with-array-push-dedupe-139}

```typescript
<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2
```

Deep merge two objects with array concatenation and deduplication. When both objects have an array at the same path, concatenates and removes duplicates.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:mergeWithArrayPushDedupe:1]
Obj.mergeWithArrayPushDedupe(
  { tags: ['react', 'vue', 'react'] },
  { tags: ['react', 'angular'] }
)
// Returns: { tags: ['react', 'vue', 'angular'] }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Preserves order with first occurrence kept
// [!code word:mergeWithArrayPushDedupe:1]
Obj.mergeWithArrayPushDedupe(
  { ids: [1, 2, 3] },
  { ids: [3, 4, 2, 5] }
)
// Returns: { ids: [1, 2, 3, 4, 5] }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mergeDefaults`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L175" /> {#c-merge-defaults-175}

```typescript
<obj1 extends Any, obj1Defaults extends Partial<obj1>>(obj1: obj1, obj1Defaults: obj1Defaults) => { [_ in keyof(obj1 & obj1Defaults)]: (obj1 & obj1Defaults)[_]; }
```

Merge default values into an object, only filling in missing properties. Existing properties in the base object are preserved, even if undefined.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:mergeDefaults:1]
Obj.mergeDefaults(
  { name: 'Alice', age: undefined },
  { name: 'Unknown', age: 0, city: 'NYC' }
)
// Returns: { name: 'Alice', age: undefined, city: 'NYC' }
// Note: existing properties (even undefined) are not overwritten
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Useful for configuration objects
const config = { port: 3000 }
const defaults = { port: 8080, host: 'localhost', debug: false }
// [!code word:mergeDefaults:1]
Obj.mergeDefaults(config, defaults)
// Returns: { port: 3000, host: 'localhost', debug: false }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `shallowMergeDefaults`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L199" /> {#f-shallow-merge-defaults-199}

```typescript
<$Defaults extends object, $Input extends object > (defaults: $Defaults, input: $Input): $Defaults & $Input
```

**Parameters:**

- `defaults` - The default values
- `input` - The input values that override defaults

**Returns:** Merged object

Shallow merge two objects with later values overriding earlier ones. Useful for providing defaults that can be overridden.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const defaults = { a: 1, b: 2, c: 3 }
const input = { b: 20 }
// [!code word:shallowMergeDefaults:1]
Obj.shallowMergeDefaults(defaults, input)  // { a: 1, b: 20, c: 3 }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `spreadShallow`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L234" /> {#f-spread-shallow-234}

```typescript
<$Objects extends readonly (object | undefined)[]>(...objects ?: $Objects): { }
```

**Parameters:**

- `objects` - Objects to merge (later objects override earlier ones). Undefined objects are ignored.

**Returns:** Merged object with undefined values omitted

Shallow merge objects while omitting undefined values. Simplifies the common pattern of conditionally spreading objects to avoid including undefined values that would override existing values.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Instead of:
const config = {
  ...defaultConfig,
  ...(userConfig ? userConfig : {}),
  ...(debug ? { debug: true } : {}),
}

// Use:
// [!code word:spreadShallow:1]
const config = Obj.spreadShallow(
  defaultConfig,
  userConfig,
  { debug: debug ? true : undefined }
)
// undefined values won't override earlier values
```

## Path Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `normalizePropertyPathInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L31" /> {#f-normalize-property-path-input-31}

```typescript
<pathInput extends PropertyPathInput>(pathInput: pathInput): normalizePropertyPathInput<pathInput>
```

**Parameters:**

- `pathInput` - Either a dot-notation string or array of property names

**Returns:** An array of property names representing the path

Normalize a property path input to a consistent array format. Accepts either a dot-notation string or an array of property names.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:normalizePropertyPathInput:1]
Obj.normalizePropertyPathInput('user.address.city')
// Returns: ['user', 'address', 'city']
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:normalizePropertyPathInput:1]
Obj.normalizePropertyPathInput(['user', 'address', 'city'])
// Returns: ['user', 'address', 'city'] (unchanged)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `parsePropertyPathExpression`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L81" /> {#c-parse-property-path-expression-81}

```typescript
<expression extends string>(expression: expression) => parsePropertyPathExpression<expression>
```

Parse a dot-notation property path expression into an array of property names.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:parsePropertyPathExpression:1]
Obj.parsePropertyPathExpression('user.name')
// Returns: ['user', 'name']
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:parsePropertyPathExpression:1]
Obj.parsePropertyPathExpression('config.server.port')
// Returns: ['config', 'server', 'port']
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:parsePropertyPathExpression:1]
Obj.parsePropertyPathExpression('singleProperty')
// Returns: ['singleProperty']
```

## Predicates

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `hasNonUndefinedKeys`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L179" /> {#f-has-non-undefined-keys-179}

```typescript
(object: object): boolean
```

**Parameters:**

- `object` - The object to check

**Returns:** True if at least one value is not undefined

Check if an object has any non-undefined values.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:hasNonUndefinedKeys:1]
Obj.hasNonUndefinedKeys({ a: undefined, b: undefined })  // false
// [!code word:hasNonUndefinedKeys:1]
Obj.hasNonUndefinedKeys({ a: undefined, b: 1 })  // true
// [!code word:hasNonUndefinedKeys:1]
Obj.hasNonUndefinedKeys({})  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `empty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L89" /> {#f-empty-89}

```typescript
(): Empty
```

**Returns:** An empty object with type `Record<string, never>`

Create an empty object with proper type. Returns a frozen empty object typed as Empty.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:empty:1]
const opts = options ?? Obj.empty()
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Type is properly inferred as Empty
// [!code word:empty:1]
const emptyObj = Obj.empty()
type T = typeof emptyObj  // Record<string, never>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isEmpty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L197" /> {#f-is-empty-197}

```typescript
(obj: object): boolean
```

**Parameters:**

- `obj` - The object to check

**Returns:** True if the object has no enumerable properties

Check if an object has no enumerable properties.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:isEmpty:1]
Obj.isEmpty({}) // true
// [!code word:isEmpty:1]
Obj.isEmpty({ a: 1 }) // false
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Non-enumerable properties are ignored
const obj = {}
// [!code word:defineProperty:1]
Object.defineProperty(obj, 'hidden', { value: 1, enumerable: false })
// [!code word:isEmpty:1]
Obj.isEmpty(obj) // true - non-enumerable properties are ignored
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isEmpty$`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L230" /> {#f-is-empty$-230}

```typescript
<$T extends object>(obj: $T): boolean
```

**Parameters:**

- `obj` - The object to check

**Returns:** True if the object has no enumerable properties, with type narrowing to Empty

Type predicate that checks if an object has no enumerable properties. Narrows the type to an empty object type.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const obj: { a?: number } = {}
if (isEmpty$(obj)) {
  // obj is now typed as Empty
}
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Useful in conditional type flows
function processObject<T extends object>(obj: T) {
  if (isEmpty$(obj)) {
    // obj is Empty here
    return 'empty'
  }
  // obj retains its original type here
}
```

## Shape & Validation

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `assert`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L34" /> {#f-assert-34}

```typescript
(value: unknown): void
```

**Parameters:**

- `value` - The value to check

**Throws:**

- TypeError If the value is not an object

Assert that a value is an object. Throws a TypeError if the value is not an object (including null).

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
function process(value: unknown) {
// [!code word:assert:1]
  Obj.assert(value)
  // value is now typed as object
// [!code word:log:1]
// [!code word:keys:1]
  console.log(Object.keys(value))
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isShape`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L73" /> {#f-is-shape-73}

```typescript
<type>(spec: Record<PropertyKey, "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function">): (value: unknown) => value is type
```

**Parameters:**

- `spec` - An object mapping property names to their expected typeof results

**Returns:** A type predicate function that checks if a value matches the shape

Create a type predicate function that checks if a value matches a shape specification. Uses JavaScript's `typeof` operator to validate property types.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const isUser = isShape<{ name: string; age: number }>({
  name: 'string',
  age: 'number'
})

isUser({ name: 'Alice', age: 30 }) // true
isUser({ name: 'Bob' }) // false - missing age
isUser({ name: 'Charlie', age: '30' }) // false - age is string
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Can check for functions and other typeof types
const isCallback = isShape<{ fn: Function }>({
  fn: 'function'
})
```

## State Management

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `setPrivateState`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L116" /> {#f-set-private-state-116}

```typescript
<obj extends Any>(obj: obj, value: object): obj
```

**Parameters:**

- `obj` - The object to attach private state to
- `value` - The state object to attach

**Returns:** The original object with private state attached

Attach private state to an object using a non-enumerable Symbol property. The state is immutable once set and cannot be discovered through enumeration.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const user = { name: 'Alice' }
const privateData = { password: 'secret123' }

// [!code word:setPrivateState:1]
Obj.setPrivateState(user, privateData)
// user still appears as { name: 'Alice' } when logged
// but has hidden private state accessible via getPrivateState
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Useful for attaching metadata without polluting the object
const config = { timeout: 5000 }
// [!code word:setPrivateState:1]
Obj.setPrivateState(config, {
  source: 'environment',
// [!code word:now:1]
  timestamp: Date.now()
})
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getPrivateState`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L159" /> {#f-get-private-state-159}

```typescript
<state extends Any>(obj: object): state
```

**Parameters:**

- `obj` - The object to retrieve private state from

**Returns:** The private state object

**Throws:**

- Error if no private state is found on the object

Retrieve private state previously attached to an object with setPrivateState.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const user = { name: 'Alice' }
setPrivateState(user, { role: 'admin' })

const privateData = getPrivateState<{ role: string }>(user)
// [!code word:log:1]
// [!code word:role:1]
console.log(privateData.role) // 'admin'
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Type-safe private state retrieval
interface Metadata {
  createdAt: number
  createdBy: string
}

const doc = { title: 'Report' }
// [!code word:now:1]
setPrivateState(doc, { createdAt: Date.now(), createdBy: 'system' })

const meta = getPrivateState<Metadata>(doc)
// meta is typed as Metadata
```

## Traits

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Eq`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/traits/eq.ts#L35" /> {#c-eq-35}

```typescript
Eq<object>
```

Eq trait implementation for objects.

Provides deep structural equality for objects by recursively comparing properties using their appropriate Eq implementations.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit'

// Basic object equality
// [!code word:is:1]
Obj.Eq.is({ a: 1, b: 2 }, { a: 1, b: 2 }) // true
// [!code word:is:1]
Obj.Eq.is({ a: 1, b: 2 }, { a: 1, b: 3 }) // false
// [!code word:is:1]
Obj.Eq.is({ a: 1 }, { a: 1, b: 2 }) // false (different keys)

// Nested objects
// [!code word:is:1]
Obj.Eq.is(
  { a: 1, b: { c: 2 } },
  { a: 1, b: { c: 2 } }
) // true

// Mixed types in properties
// [!code word:is:1]
Obj.Eq.is(
  { a: 1, b: 'hello', c: true },
  { a: 1, b: 'hello', c: true }
) // true
```

## Transformation

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapEntriesDeep`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/map-entries-deep.ts#L132" /> {#f-map-entries-deep-132}

```typescript
<$value extends DeepObjectValue>(value: $value, visitor: (key: string, value: DeepObjectValue) => { key: string; value: DeepObjectValue; } | undefined): $value
```

**Parameters:**

- `value` - The value to traverse (can be primitive, object, or array)
- `visitor` - Function called for each object entry. Return `undefined` to keep unchanged, or `{key, value}` to transform.

**Returns:** A new structure with entry transformations applied

Recursively traverse nested object structures and transform key-value pairs (entries).

Performs **top-down traversal**: The visitor function is called for each object entry BEFORE recursing into the value's children. This allows transforming both keys and values while maintaining consistent traversal semantics with mapValuesDeep.

#### Visitor Pattern

The visitor receives both the key and value for each object entry:

- **Return `undefined`**: Keep the entry unchanged and recurse into the value's children
- **Return `{key, value}`**: Replace the entry and recurse into the NEW value's children

**Note**: Unlike mapValuesDeep, this function does NOT support early exit. The visitor result is always recursed into, whether it's the original or transformed value.

#### Features

- **Key transformations**: Rename object keys throughout nested structures
- **Value transformations**: Transform values based on their keys
- **Combined transformations**: Change both key and value simultaneously
- **Circular reference safe**: Automatically detects and marks circular references as `'[Circular]'`
- **Type preservation**: Maintains array and object structures during traversal

#### Common Use Cases

- Normalizing key naming conventions (e.g., stripping prefixes, camelCase conversion)
- Transforming values based on key patterns
- Sanitizing or filtering object properties recursively
- Renaming keys while preserving nested structure

#### Comparison with mapValuesDeep

Use **mapEntriesDeep** when you need to:

- Transform object keys
- Access both key and value in the visitor
- Transform entries at the object level

Use **mapValuesDeep** when you need to:

- Only transform values (keys unchanged)
- Early exit optimization (stop recursing after match)
- Transform any value type (not just object entries)

**Examples:**

**Key normalization** - Strip prefix from keys:

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const data = {
  $name: 'Alice',
  $age: 30,
  $address: {
    $city: 'NYC',
    $zip: '10001'
  }
}

// [!code word:mapEntriesDeep:1]
Obj.mapEntriesDeep(data, (key, value) =>
// [!code word:startsWith:1]
// [!code word:slice:1]
  key.startsWith('$') ? { key: key.slice(1), value } : undefined
)
// { name: 'Alice', age: 30, address: { city: 'NYC', zip: '10001' } }
```

**Value transformation** - Uppercase all string values:

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const data = {
  name: 'alice',
  location: {
    city: 'nyc',
    country: 'usa'
  }
}

// [!code word:mapEntriesDeep:1]
Obj.mapEntriesDeep(data, (key, value) =>
// [!code word:toUpperCase:1]
  typeof value === 'string' ? { key, value: value.toUpperCase() } : undefined
)
// { name: 'ALICE', location: { city: 'NYC', country: 'USA' } }
```

**Combined transformation** - Strip prefix AND uppercase string values:

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:mapEntriesDeep:1]
Obj.mapEntriesDeep(data, (key, value) => {
// [!code word:startsWith:1]
  if (key.startsWith('$')) {
// [!code word:slice:1]
    const newKey = key.slice(1)
// [!code word:toUpperCase:1]
    const newValue = typeof value === 'string' ? value.toUpperCase() : value
    return { key: newKey, value: newValue }
  }
})
```

**Selective transformation** - Only transform specific keys:

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:mapEntriesDeep:1]
Obj.mapEntriesDeep(data, (key, value) => {
  if (key === 'password' || key === 'apiKey') {
    return { key, value: '[REDACTED]' }
  }
})
```

**Works with arrays** - Transforms entries in nested arrays:

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const users = [
  { $id: 1, $name: 'Alice' },
  { $id: 2, $name: 'Bob' }
]

// [!code word:mapEntriesDeep:1]
Obj.mapEntriesDeep(users, (key, value) =>
// [!code word:startsWith:1]
// [!code word:slice:1]
  key.startsWith('$') ? { key: key.slice(1), value } : undefined
)
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapValuesDeep`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/map-values-deep.ts#L89" /> {#f-map-values-deep-89}

```typescript
(value: any, visitor: (value: any) => any, visited?: WeakSet<WeakKey> = new WeakSet()): any
```

**Parameters:**

- `value` - Any value to traverse (primitive, object, or array)
- `visitor` - Transformation function called for each value. Return `undefined` to continue recursing, or any other value to replace and stop.

**Returns:** Transformed structure with visitor transformations applied

Recursively traverse and transform values in nested data structures with early exit optimization.

Performs **top-down traversal**: The visitor function is called for each value BEFORE recursing into its children. This enables the visitor to transform a value and prevent further recursion, which is useful for replacing complex objects with primitives or handling special types.

#### Early Exit Pattern

The visitor function controls recursion through its return value:

- **Return `undefined`**: Continue recursing into the original value's children
- **Return any other value**: Use as replacement and STOP recursing into that branch

#### Features

- **Handles all structures**: Works with primitives, objects, arrays, and nested combinations
- **Circular reference safe**: Automatically detects and marks circular references as `'[Circular]'`
- **Type preservation**: Maintains array and object structures during traversal
- **Performance**: Early exit allows stopping recursion when a match is found

#### Common Use Cases

- Encoding schema instances to primitives (e.g., for snapshots)
- Replacing Error objects with error messages
- Sanitizing sensitive data in nested structures
- Truncating or formatting string values deeply
- Converting special objects to JSON-serializable forms

**Examples:**

**Schema encoding** - Transform schema instances to encoded primitives:

```typescript twoslash
// @noErrors
import { Schema as S } from 'effect'

// [!code word:mapValuesDeep:1]
Obj.mapValuesDeep(testData, (v) => {
// [!code word:FsLoc:1]
// [!code word:User:1]
  for (const schema of [FsLoc.FsLoc, User.User]) {
// [!code word:is:1]
    if (S.is(schema)(v)) {
// [!code word:encodeSync:1]
      return S.encodeSync(schema)(v)  // Replace and stop recursing
    }
  }
  // Return undefined to continue into children
})
// Before: { location: FsLocInstance { ... } }
// After:  { location: './src/index.ts' }
```

**Error sanitization** - Replace Error objects with messages:

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const data = {
  result: 'success',
  errors: [new Error('Failed'), new Error('Timeout')],
  nested: { err: new Error('Deep error') }
}

// [!code word:mapValuesDeep:1]
Obj.mapValuesDeep(data, (v) => {
// [!code word:message:1]
  if (v instanceof Error) return v.message
})
// { result: 'success', errors: ['Failed', 'Timeout'], nested: { err: 'Deep error' } }
```

**String truncation** - Limit string lengths throughout a structure:

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:mapValuesDeep:1]
Obj.mapValuesDeep(data, (v) => {
// [!code word:length:1]
  if (typeof v === 'string' && v.length > 100) {
// [!code word:slice:1]
    return v.slice(0, 100) + '...'
  }
})
```

**Conditional replacement** - Replace specific objects entirely:

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:mapValuesDeep:1]
Obj.mapValuesDeep(data, (v) => {
  // Replace Buffer objects with their base64 representation
// [!code word:isBuffer:1]
  if (Buffer.isBuffer(v)) {
// [!code word:toString:1]
    return v.toString('base64')
  }
})
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapValues`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/update.ts#L25" /> {#f-map-values-25}

```typescript
<rec extends Record<PropertyKey, any>, newValue > (obj: rec, fn: (value: rec[keyof rec], key: keyof rec) => newValue): Record<keyof rec, newValue>
```

**Parameters:**

- `obj` - The object to map values from
- `fn` - Function to transform each value, receives the value and key

**Returns:** A new object with transformed values

Create a new object with the same keys but with values transformed by a function.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const prices = { apple: 1.5, banana: 0.75, orange: 2 }
// [!code word:mapValues:1]
const doublePrices = Obj.mapValues(prices, (price) => price * 2)
// Result: { apple: 3, banana: 1.5, orange: 4 }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using the key parameter
const data = { a: 1, b: 2, c: 3 }
// [!code word:mapValues:1]
const withKeys = Obj.mapValues(data, (value, key) => `${key}: ${value}`)
// Result: { a: 'a: 1', b: 'b: 2', c: 'c: 3' }
```

## Type Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Keyof`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L380" /> {#t-keyof-380}

```typescript
type Keyof<$Object extends object> = object extends $Object ? PropertyKey : (keyof $Object)
```

Like keyof but returns PropertyKey for object type. Helper type for generic object key operations.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PolicyFilter`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L400" /> {#t-policy-filter-400}

```typescript
type PolicyFilter<
  $Object extends object,
  $Key extends Keyof<$Object>,
  $Mode extends 'allow' | 'deny',
> = $Mode extends 'allow'
  ? Pick<$Object, Extract<$Key, keyof $Object>>
  : Omit<$Object, Extract<$Key, keyof $Object>>
```

Filter object properties based on a policy mode and set of keys.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { id: number; name: string; email: string; password: string }
// Allow mode: keep only specified keys
type PublicUser = PolicyFilter<User, 'id' | 'name', 'allow'>
// Result: { id: number; name: string }

// Deny mode: remove specified keys
type SafeUser = PolicyFilter<User, 'password', 'deny'>
// Result: { id: number; name: string; email: string }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PickWhereValueExtends`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L420" /> {#t-pick-where-value-extends-420}

```typescript
type PickWhereValueExtends<$Obj extends object, $Constraint> = {
  [k in keyof $Obj as $Obj[k] extends $Constraint ? k : never]: $Obj[k]
}
```

Pick properties from an object where the values extend a given constraint.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { name: string; age: number; isActive: boolean; flag: boolean }
type BooleanProps = PickWhereValueExtends<User, boolean>
// Result: { isActive: boolean; flag: boolean }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SuffixKeyNames`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L435" /> {#t-suffix-key-names-435}

```typescript
type SuffixKeyNames<$Suffix extends string, $Object extends object> = {
  [k in keyof $Object as k extends string ? `${k}${$Suffix}` : k]: $Object[k]
}
```

Add a suffix to all property names in an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = SuffixKeyNames<'_old', { a: string; b: number }>
// { a_old: string; b_old: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `OmitKeysWithPrefix`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L450" /> {#t-omit-keys-with-prefix-450}

```typescript
type OmitKeysWithPrefix<$Object extends object, $Prefix extends string> = {
  [k in keyof $Object as k extends `${$Prefix}${string}` ? never : k]: $Object[k]
}
```

Omit all keys that start with a specific prefix.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = OmitKeysWithPrefix<{ _a: string; _b: number; c: boolean }, '_'>
// { c: boolean }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PickRequiredProperties`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L464" /> {#t-pick-required-properties-464}

```typescript
type PickRequiredProperties<$T extends object> = {
  [k in keyof $T as {} extends Pick<$T, k> ? never : k]: $T[k]
}
```

Pick only the required (non-optional) properties from an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = PickRequiredProperties<{ a: string; b?: number }>  // { a: string }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RequireProperties`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L479" /> {#t-require-properties-479}

```typescript
type RequireProperties<$O extends object, $K extends keyof $O> = Ts.Simplify<$O & { [k in $K]-?: $O[k] }>
```

Make specific properties required in an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = RequireProperties<{ a?: string; b?: number }, 'a'>
// { a: string; b?: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PartialOrUndefined`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L492" /> {#t-partial-or-undefined-492}

```typescript
type PartialOrUndefined<$T> = {
  [k in keyof $T]?: $T[k] | undefined
}
```

Make all properties optional and allow undefined values.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = PartialOrUndefined<{ a: string; b: number }>
// { a?: string | undefined; b?: number | undefined }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PickOptionalPropertyOrFallback`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L507" /> {#t-pick-optional-property-or-fallback-507}

```typescript
type PickOptionalPropertyOrFallback<$Object extends object, $Property extends keyof $Object, $Fallback> =
  {} extends Pick<$Object, $Property> ? $Object[$Property] : $Fallback
```

Pick an optional property or use fallback if required.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = PickOptionalPropertyOrFallback<{ a?: string }, 'a', never>  // string
type T2 = PickOptionalPropertyOrFallback<{ a: string }, 'a', never>  // never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `OnlyKeysInArray`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L522" /> {#t-only-keys-in-array-522}

```typescript
type OnlyKeysInArray<$Obj extends object, $KeysArray extends readonly string[]> = {
  [k in keyof $Obj as k extends $KeysArray[number] ? k : never]: $Obj[k]
}
```

Pick only the properties from an object that exist in a provided array of keys.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { id: number; name: string; age: number; email: string }
type PublicUser = OnlyKeysInArray<User, ['name', 'email']>
// Result: { name: string; email: string }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GetKeyOr`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L317" /> {#t-get-key-or-317}

```typescript
type GetKeyOr<$T, $Key, $Or> = $Key extends keyof $T ? $T[$Key] : $Or
```

Get value at key, or return fallback if key doesn't exist.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = GetKeyOr<{ a: string }, 'a', never>  // string
type T2 = GetKeyOr<{ a: string }, 'b', never>  // never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GetOrNever`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L330" /> {#t-get-or-never-330}

```typescript
type GetOrNever<$O extends object, $P extends string> = $P extends keyof $O ? $O[$P]
  : $P extends `${infer __head__}.${infer __tail__}`
  ? __head__ extends keyof $O ? GetOrNever<$O[__head__] & object, __tail__>
  : never
  : never
```

Get value at key or return never.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = GetOrNever<{ a: string }, 'a'>  // string
type T2 = GetOrNever<{ a: string }, 'b'>  // never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `keyofOr`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L347" /> {#t-keyof-or-347}

```typescript
type keyofOr<$Obj extends object, $Or> = [keyof $Obj] extends [never] ? $Or : $Obj[keyof $Obj]
```

Get the union of all value types from an object, or return fallback if no keys.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = keyofOr<{ a: string; b: number }, never>  // string | number
type T2 = keyofOr<{}, 'fallback'>  // 'fallback'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `KeysArray`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L361" /> {#t-keys-array-361}

```typescript
type KeysArray<$Obj extends object> = Array<keyof $Obj>
```

Create an array type containing the keys of an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { name: string; age: number; email: string }
type UserKeys = KeysArray<User>
// Result: Array<'name' | 'age' | 'email'>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `KeysReadonlyArray`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L375" /> {#t-keys-readonly-array-375}

```typescript
type KeysReadonlyArray<$Obj extends object> = ReadonlyArray<keyof $Obj>
```

Create a readonly array type containing the keys of an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { name: string; age: number; email: string }
type UserKeys = KeysReadonlyArray<User>
// Result: ReadonlyArray<'name' | 'age' | 'email'>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `StringKeyof`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L387" /> {#intersection-string-keyof-387}

```typescript
type StringKeyof<$T> = keyof $T & string
```

Extract only string keys from an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = StringKeyof<{ a: 1;[x: number]: 2 }>  // 'a'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PrimitiveFieldKeys`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L409" /> {#t-primitive-field-keys-409}

```typescript
type PrimitiveFieldKeys<$T> = {
  [K in keyof $T]: $T[K] extends string | number | boolean | bigint | null | undefined ? K
  : $T[K] extends Date ? K
  : never
}[keyof $T]
```

Extract keys from an object type that have primitive values. Useful for serialization scenarios where only primitive values can be safely transferred.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = {
  id: number
  name: string
  createdAt: Date
  metadata: { tags: string[] }
  isActive: boolean
}
type SerializableKeys = PrimitiveFieldKeys<User>
// Result: 'id' | 'name' | 'createdAt' | 'isActive'
// Note: Date is considered primitive for serialization purposes
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `MergeAllShallow`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L287" /> {#t-merge-all-shallow-287}

```typescript
type MergeAllShallow<$Objects extends readonly object[]> =
  $Objects extends readonly [infer $First extends object, ...infer $Rest extends object[]]
  ? $Rest extends readonly []
  ? $First
  : MergeShallow<$First, MergeAllShallow<$Rest>>
  : {}
```

Recursively merge an array of objects using shallow merge semantics. Each object in the array overrides properties from previous objects.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = MergeAllShallow<[{ a: string }, { b: number }, { c: boolean }]>
// Result: { a: string; b: number; c: boolean }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `MergeAll`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L306" /> {#t-merge-all-306}

```typescript
type MergeAll<$Objects extends object[]> = $Objects extends
  [infer __first__ extends object, ...infer __rest__ extends object[]] ? __first__ & MergeAll<__rest__>
  : {}
```

Merge an array of object types into a single type using deep merge semantics. Uses TypeScript's intersection type (`&`) for merging.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = MergeAll<[{ a: string }, { b: number }]>
// Result: { a: string; b: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `ReplaceProperty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L322" /> {#intersection-replace-property-322}

```typescript
type ReplaceProperty<$Obj extends object, $Key extends keyof $Obj, $NewType> =
  & Omit<$Obj, $Key>
  & {
    [_ in $Key]: $NewType
  }
```

Replace the type of a specific property in an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { id: number; name: string; age: number }
type UpdatedUser = ReplaceProperty<User, 'id', string>
// Result: { id: string; name: string; age: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Replace`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L341" /> {#intersection-replace-341}

```typescript
type Replace<$Object1, $Object2> = Omit<$Object1, keyof $Object2> & $Object2
```

Replace properties in an object type with new types. Useful for overriding specific property types.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { id: number; name: string; createdAt: Date }
type SerializedUser = Replace<User, { createdAt: string }>
// Result: { id: number; name: string; createdAt: string }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Writeable`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L224" /> {#t-writeable-224}

```typescript
type Writeable<$Obj extends object> = Writable<$Obj>
```

Make all properties of an object writable (remove readonly modifiers).

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type ReadonlyUser = { readonly id: number; readonly name: string }
type WritableUser = Writeable<ReadonlyUser>
// Result: { id: number; name: string }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ToParameters`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L232" /> {#t-to-parameters-232}

```typescript
type ToParameters<$Params extends object | undefined> =
  undefined extends $Params ? [params?: $Params] :
  $Params extends undefined ? [params?: $Params] :
  [params: $Params]
```

Convert an object to a parameters tuple.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ToParametersExact`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L242" /> {#t-to-parameters-exact-242}

```typescript
type ToParametersExact<
  $Input extends object,
  $Params extends object | undefined,
> = IsEmpty<$Input> extends true ? []
  : ToParameters<$Params>
```

Convert an object to parameters tuple with exact matching.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PropertyKeyToString`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L253" /> {#t-property-key-to-string-253}

```typescript
type PropertyKeyToString<$Key extends PropertyKey> = $Key extends string ? $Key
  : $Key extends number ? `${$Key}`
  : never
```

Convert PropertyKey to string if possible.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsEmpty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L29" /> {#t-is-empty-29}

```typescript
type IsEmpty<$Obj extends object> = keyof $Obj extends never ? true : false
```

Type-level check to determine if an object type has no keys.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type Empty = IsEmpty<{}> // true
type NotEmpty = IsEmpty<{ a: 1 }> // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Empty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L36" /> {#t-empty-36}

```typescript
type Empty = Record<string, never>
```

Type for an empty object.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `NoExcessNonEmpty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L162" /> {#t-no-excess-non-empty-162}

```typescript
type NoExcessNonEmpty<$Value extends object, $Constraint> = IsEmpty<$Value> extends true ? never
  : NoExcess<$Constraint, $Value>
```

Like NoExcess but also requires the object to be non-empty.

Enforces that: 1. Object has at least one property (not empty) 2. Object has no excess properties beyond the constraint

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { name: string }

type T1 = NoExcessNonEmpty<{ name: 'Alice' }, User>        // ✓ Pass
type T2 = NoExcessNonEmpty<{}, User>                       // ✗ Fail - empty
type T3 = NoExcessNonEmpty<{ name: 'Bob', age: 30 }, User> // ✗ Fail - excess
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `HasOptionalKeys`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L14" /> {#t-has-optional-keys-14}

```typescript
type HasOptionalKeys<$Obj extends object> = OptionalKeys<$Obj> extends never ? false : true
```

Check if an interface has any optional properties.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = HasOptionalKeys<{ a?: string }>  // true
type T2 = HasOptionalKeys<{ a: string }>  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `OptionalKeys`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L27" /> {#t-optional-keys-27}

```typescript
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]
```

Extract keys that are optional in the interface.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type Obj = { a: string; b?: number; c?: boolean }
type Optional = OptionalKeys<Obj>  // 'b' | 'c'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RequiredKeys`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L42" /> {#t-required-keys-42}

```typescript
type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>
```

Extract keys that are required in the interface.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type Obj = { a: string; b?: number; c?: boolean }
type Required = RequiredKeys<Obj>  // 'a'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `HasRequiredKeys`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L56" /> {#t-has-required-keys-56}

```typescript
type HasRequiredKeys<$Obj extends object> = RequiredKeys<$Obj> extends never ? false : true
```

Check if an interface has any required properties.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = HasRequiredKeys<{ a: string }>  // true
type T2 = HasRequiredKeys<{ a?: string }>  // false
type T3 = HasRequiredKeys<{ a: string; b?: number }>  // true
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `HasOptionalKey`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L69" /> {#t-has-optional-key-69}

```typescript
type HasOptionalKey<$Object extends object, $Key extends keyof $Object> = undefined extends $Object[$Key] ? true
  : false
```

Check if a key is optional in an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = HasOptionalKey<{ a?: string }, 'a'>  // true
type T2 = HasOptionalKey<{ a: string }, 'a'>  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsKeyOptional`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L84" /> {#t-is-key-optional-84}

```typescript
type IsKeyOptional<$T extends Undefined.Maybe<object>, $K extends string> = $K extends keyof $T
  ? ({} extends Pick<$T, $K> ? true : false)
  : false
```

Check if a key is optional in an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = IsKeyOptional<{ a?: string }, 'a'>  // true
type T2 = IsKeyOptional<{ a: string }, 'a'>  // false
type T3 = IsKeyOptional<{ a: string }, 'b'>  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `HasKey`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L99" /> {#t-has-key-99}

```typescript
type HasKey<$T extends object, $K extends string> = $K extends keyof $T ? true : false
```

Check if a key exists in an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = HasKey<{ a: string }, 'a'>  // true
type T2 = HasKey<{ a: string }, 'b'>  // false
```

## Type Utilities

$A - First object type $B - Second object type

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SharedKeys`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L274" /> {#t-shared-keys-274}

```typescript
type SharedKeys<$A extends object, $B extends object> = O.IntersectKeys<$A, $B>
```

Extract keys that are shared between two object types.

Returns a union of keys that exist in both `$A` and `$B`. Useful for finding common properties when comparing object types.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type A = { a: string; b: number; c: boolean }
type B = { b: string; c: number; d: Date }

type Shared = Obj.SharedKeys<A, B>  // "b" | "c"
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// No shared keys
type X = { a: string }
type Y = { b: number }
type None = Obj.SharedKeys<X, Y>  // never

// All keys shared
type Same = Obj.SharedKeys<{ a: 1; b: 2 }, { a: 3; b: 4 }>  // "a" | "b"
```

## Type Utilities

$A - The object type to subtract from $B - The object type whose properties to remove

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SubtractShallow`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L67" /> {#t-subtract-shallow-67}

```typescript
type SubtractShallow<$A, $B> = Omit<$A, keyof $B>
```

Subtract properties present in $B from $A (shallow operation).

Returns a new object type containing only properties that exist in $A but not in $B. This is equivalent to `Omit<$A, keyof $B>` but expresses the operation as subtraction.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { name: string; age: number; email: string }
type Public = { name: string; age: number }

type Private = Obj.SubtractShallow<User, Public>  // { email: string }
type Same = Obj.SubtractShallow<User, User>        // {}
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Finding what's different between two object types
type Config = { id: string; debug?: boolean }
type Provided = { id: string; invalid: true; typo: string }

type Extra = Obj.SubtractShallow<Provided, Config>  // { invalid: true; typo: string }
```

## Type Utilities

$Expected - The expected object type $Actual - The actual object type to compare

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Mismatched`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L346" /> {#t-mismatched-346}

```typescript
type Mismatched<$Expected extends object, $Actual extends object> = {
  [k in SharedKeys<$Expected, $Actual>]: k extends keyof $Expected
  ? k extends keyof $Actual
  ? $Expected[k] extends $Actual[k]
  ? $Actual[k] extends $Expected[k]
  ? never
  : { expected: $Expected[k]; actual: $Actual[k] }
  : { expected: $Expected[k]; actual: $Actual[k] }
  : never
  : never
}
```

Find properties that exist in both object types but have different types.

For each shared key, compares the types of the properties. If they differ, returns an object with `{ expected: TypeA, actual: TypeB }` for that key. If types match, returns `never` for that key (which can be filtered out with OmitNever).

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type Expected = { id: string; name: string; count: number }
type Actual = { id: number; name: string; count: string }

type Diff = Obj.Mismatched<Expected, Actual>
// {
//   id: { expected: string; actual: number }
//   name: never  // Types match
//   count: { expected: number; actual: string }
// }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Combined with OmitNever to get only mismatches
type OnlyMismatches = Obj.OmitNever<Obj.Mismatched<Expected, Actual>>
// {
//   id: { expected: string; actual: number }
//   count: { expected: number; actual: string }
// }
```

## Type Utilities

$Expected - The type defining allowed properties $Actual - The actual type to check for excess properties

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `NoExcess`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L142" /> {#intersection-no-excess-142}

```typescript
type NoExcess<$Expected, $Actual> = $Actual & Record<Exclude<keyof $Actual, keyof $Expected>, never>
```

Enforces that a type has no excess properties beyond those defined in the expected type.

This utility intersects the actual type with a record that marks all excess keys as `never`, causing TypeScript to reject values with properties not present in the expected type. Particularly useful in generic contexts where excess property checking is bypassed.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { name: string; age: number }

// Standard generic - allows excess properties
function test1<T extends User>(input: T): void { }
test1({ name: 'Alice', age: 30, extra: true })  // ✓ No error (excess allowed)

// With NoExcess - rejects excess
function test2<T extends User>(input: Obj.NoExcess<User, T>): void { }
test2({ name: 'Alice', age: 30, extra: true })  // ✗ Error: 'extra' is never
test2({ name: 'Alice', age: 30 })  // ✓ OK
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using with optional properties
type Config = { id: string; debug?: boolean }

function configure<T extends Config>(config: Obj.NoExcess<Config, T>): void { }

configure({ id: 'test' })  // ✓ OK - optional omitted
configure({ id: 'test', debug: true })  // ✓ OK - optional included
configure({ id: 'test', invalid: 'x' })  // ✗ Error: 'invalid' is never
```

## Type Utilities

$T - The object type to filter

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `OmitNever`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L394" /> {#t-omit-never-394}

```typescript
type OmitNever<$T> = {
  [k in keyof $T as $T[k] extends never ? never : k]: $T[k]
}
```

Remove all properties with `never` type from an object type.

Filters out object properties whose values are `never`, leaving only properties with concrete types. Useful for cleaning up conditional type results that use `never` as a sentinel value.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type Mixed = {
  keep1: string
  remove: never
  keep2: number
  alsoRemove: never
}

type Clean = Obj.OmitNever<Mixed>
// { keep1: string; keep2: number }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Common pattern: conditional properties
type Conditional<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : never
}

type Input = { a: string; b: number; c: string }
type OnlyStrings = Obj.OmitNever<Conditional<Input>>
// { a: string; c: string }
```

## Type Utilities

$T - The object type to remove keys from $Keys - Union of keys to remove

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ExcludeKeys`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L306" /> {#t-exclude-keys-306}

```typescript
type ExcludeKeys<$T, $Keys> = {
  [k in Exclude<keyof $T, $Keys>]: $T[k]
}
```

Remove specified keys from an object type, with forced evaluation.

Similar to TypeScript's built-in `Omit`, but ensures the resulting type is fully evaluated rather than showing as `Omit<T, K>` in error messages. This makes type errors more readable by displaying the actual resulting object type.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type User = { id: string; name: string; email: string; password: string }

type Public = Obj.ExcludeKeys<User, 'password'>
// { id: string; name: string; email: string }

type Minimal = Obj.ExcludeKeys<User, 'email' | 'password'>
// { id: string; name: string }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Difference from Omit - better error messages
type WithOmit = Omit<User, 'password'>  // Displays as: Omit<User, "password">
type WithExclude = Obj.ExcludeKeys<User, 'password'>  // Displays as: { id: string; name: string; email: string }
```

## Type Utilities

$T - The type whose keys should be aligned $Length - The target length for padded keys $Pad - The character to use for padding (defaults to '_')

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AlignKeys`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L432" /> {#t-align-keys-432}

```typescript
type AlignKeys<$T, $Length extends number, $Pad extends string = '_'> = {
  [k in keyof $T as k extends string ? Str.PadEnd<k, $Length, $Pad> : k]: $T[k]
}
```

Align object keys by padding with a character to a target length.

Pads string keys to the specified length using the given fill character. Non-string keys (symbols, numbers) are left unchanged. Ensures consistent alignment of object keys in IDE displays.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type Input = { MESSAGE: string, EXPECTED: number }
type Output = Obj.AlignKeys<Input, 12>
// { MESSAGE_____: string, EXPECTED____: number }

// Custom padding character
type Output2 = Obj.AlignKeys<Input, 12, '.'>
// { MESSAGE.....: string, EXPECTED....: number }
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Type`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/traits/type.ts#L5" /> {#c-type-5}

```typescript
Type<object>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pick`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L66" /> {#f-pick-66}

```typescript
<T extends object, K extends keyof T > (obj: T, keys: readonly K[]): Pick < T, K >
  <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value?: undefined, obj?: undefined) => boolean): Partial < $Object >
    <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value: $Object[keyof $Object], obj?: $Object | undefined) => boolean): Partial < $Object >
      <T extends object, K extends keyof T > (obj: T, keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)): Pick<T, K> | Partial<T>
```

**Parameters:**

- `obj` - The object to pick properties from

**Returns:** A new object containing only the specified properties

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pick`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L70" /> {#f-pick-70}

```typescript
<T extends object, K extends keyof T > (obj: T, keys: readonly K[]): Pick < T, K >
  <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value?: undefined, obj?: undefined) => boolean): Partial < $Object >
    <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value: $Object[keyof $Object], obj?: $Object | undefined) => boolean): Partial < $Object >
      <T extends object, K extends keyof T > (obj: T, keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)): Pick<T, K> | Partial<T>
```

**Parameters:**

- `obj` - The object to pick properties from

**Returns:** A new object containing only the specified properties

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pick`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L74" /> {#f-pick-74}

```typescript
<T extends object, K extends keyof T > (obj: T, keys: readonly K[]): Pick < T, K >
  <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value?: undefined, obj?: undefined) => boolean): Partial < $Object >
    <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value: $Object[keyof $Object], obj?: $Object | undefined) => boolean): Partial < $Object >
      <T extends object, K extends keyof T > (obj: T, keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)): Pick<T, K> | Partial<T>
```

**Parameters:**

- `obj` - The object to pick properties from

**Returns:** A new object containing only the specified properties

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `omit`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L166" /> {#f-omit-166}

```typescript
<T extends object, K extends keyof T > (obj: T, keys: readonly K[]): Omit < T, K >
  <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value?: undefined, obj?: undefined) => boolean): Partial < $Object >
    <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value: $Object[keyof $Object], obj?: $Object | undefined) => boolean): Partial < $Object >
      <T extends object, K extends keyof T > (obj: T, keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)): Omit<T, K> | Partial<T>
```

**Parameters:**

- `obj` - The object to omit properties from

**Returns:** A new object without the specified properties

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `omit`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L170" /> {#f-omit-170}

```typescript
<T extends object, K extends keyof T > (obj: T, keys: readonly K[]): Omit < T, K >
  <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value?: undefined, obj?: undefined) => boolean): Partial < $Object >
    <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value: $Object[keyof $Object], obj?: $Object | undefined) => boolean): Partial < $Object >
      <T extends object, K extends keyof T > (obj: T, keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)): Omit<T, K> | Partial<T>
```

**Parameters:**

- `obj` - The object to omit properties from

**Returns:** A new object without the specified properties

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `omit`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L174" /> {#f-omit-174}

```typescript
<T extends object, K extends keyof T > (obj: T, keys: readonly K[]): Omit < T, K >
  <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value?: undefined, obj?: undefined) => boolean): Partial < $Object >
    <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value: $Object[keyof $Object], obj?: $Object | undefined) => boolean): Partial < $Object >
      <T extends object, K extends keyof T > (obj: T, keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)): Omit<T, K> | Partial<T>
```

**Parameters:**

- `obj` - The object to omit properties from

**Returns:** A new object without the specified properties

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `partition`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L293" /> {#i-partition-293}

```typescript
interface partition extends
// [!code word:SimpleSignature:1]
  Ts.SimpleSignature.SimpleSignature<[
    (obj: object, pickedKeys: readonly string[]) => { picked: object; omitted: object },
  ]> {
  <$Object extends object, $Key extends keyof $Object>(
    obj: $Object,
    pickedKeys: readonly $Key[],
  ): { omitted: Omit<$Object, $Key>; picked: Pick<$Object, $Key> }
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `getWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L75" /> {#t-get-with-75}

```typescript
type getWith<
  $Path extends PropertyPath,
  $Obj extends Any
> =
  $Path extends readonly [infer __key__ extends string, ...infer __tail__ extends readonly string[]]
  ? __key__ extends keyof $Obj
  ? $Obj[__key__] extends Any
  ? getWith<__tail__, $Obj[__key__]>
  : __tail__ extends readonly []
  ? $Obj[__key__]
  : never // path/object mismatch
  : never // path/object mismatch
  : $Obj
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `entries`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L161" /> {#t-entries-161}

```typescript
type entries<obj extends Any> = {
  [K in keyof obj]-?: // Regarding "-?": we don't care about keys being undefined when we're trying to list out all the possible entries
  undefined extends obj[K]
  ? {} extends Pick<obj, K>
  ? [K, Undefined.Exclude<obj[K]>] // Optional key - remove only undefined, preserve null
  : [K, obj[K]] // Required key with undefined - preserve exact type including undefined
  : [K, obj[K]] // Required key without undefined - preserve exact type
}[keyof obj][]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `values`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L304" /> {#t-values-304}

```typescript
type values<$Obj extends object> = $Obj[keyof $Obj][]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `DeepObjectValue`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/map-entries-deep.ts#L4" /> {#u-deep-object-value-4}

```typescript
type DeepObjectValue = string | boolean | null | number | DeepObject | DeepObjectValue[]
```

A deep object value can be any JSON-serializable value including nested objects and arrays.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `DeepObject`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/map-entries-deep.ts#L9" /> {#t-deep-object-9}

```typescript
type DeepObject = { [key: string]: DeepObjectValue }
```

A deep object is a plain object with string keys and deep object values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `MergeShallow`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L261" /> {#t-merge-shallow-261}

```typescript
type MergeShallow<
  $Object1 extends Any,
  $Object2 extends Any,
  __ =
  {} extends $Object1
  ? $Object2
  : & $Object2
  // Keys from $Object1 that are NOT in $Object2
  & {
    [__k__ in keyof $Object1 as __k__ extends keyof $Object2 ? never : __k__]: $Object1[__k__]
  }
> = __
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PartialDeep`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L186" /> {#t-partial-deep-186}

```typescript
type PartialDeep<$Type> =
  $Type extends Array<infer __inner__> ? Array<PartialDeep<__inner__>> :
  $Type extends ReadonlyArray<infer __inner__> ? ReadonlyArray<PartialDeep<__inner__>> :
  $Type extends Promise<infer __inner__> ? Promise<PartialDeep<__inner__>> :
  $Type extends Function ? $Type :
  $Type extends object ? {
    [key in keyof $Type]?: PartialDeep<$Type[key]>
  } :
  // else
  $Type
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PropertyPathExpression`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L4" /> {#t-property-path-expression-4}

```typescript
type PropertyPathExpression = string
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PropertyPath`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L6" /> {#t-property-path-6}

```typescript
type PropertyPath = readonly string[]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `PropertyPathInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L8" /> {#u-property-path-input-8}

```typescript
type PropertyPathInput = PropertyPathExpression | PropertyPath
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `normalizePropertyPathInput`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L41" /> {#t-normalize-property-path-input-41}

```typescript
type normalizePropertyPathInput<pathInput extends PropertyPathInput> =
  pathInput extends PropertyPathExpression
  ? parsePropertyPathExpression<pathInput>
  : pathInput extends PropertyPath
  ? pathInput
  : never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PropertyPathSeparator`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L52" /> {#c-property-path-separator-52}

```typescript
"."
```

The separator character used in property path expressions. Used to split dot-notation paths like 'user.address.city'.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `parsePropertyPathExpression`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L86" /> {#t-parse-property-path-expression-86}

```typescript
type parsePropertyPathExpression<$Expression extends string> =
  $Expression extends `${infer __key__}.${infer __rest__}`
  ? [__key__, ...parsePropertyPathExpression<__rest__>]
  : [$Expression]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `InferShapeFromPropertyPath`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L92" /> {#t-infer-shape-from-property-path-92}

```typescript
type InferShapeFromPropertyPath<$PropertyPath extends PropertyPath> =
  $PropertyPath extends readonly []
  ? {}
  : _InferShapeFromPropertyPath<$PropertyPath>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Any`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L6" /> {#t-any-6}

```typescript
type Any = object
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PropertySignature`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/property-signature.ts#L1" /> {#t-property-signature-1}

```typescript
type PropertySignature = {
  name: string
  type: any
  optional: boolean
  optionalUndefined: boolean
}
```
