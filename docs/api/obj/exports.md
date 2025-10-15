# Obj.Exports

_Obj_ / **Exports**

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

- [**`Union`**](/api/obj/union) - Union operations on objects.

This module provides utilities for working with unions of object types, solving common TypeScript limitations when dealing with union types:

- `keyof (A | B)` returns only common keys (intersection), not all keys (union) - `(A | B)['key']` returns `any` for keys not in all members - No built-in way to merge union members while preserving value unions per key

These utilities use distributive conditional types to properly handle each union member separately, then combine the results.

## Access

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getWith`

```typescript
<pathInput extends PropertyPathInput>(pathInput: pathInput): <obj extends InferShapeFromPropertyPath<normalizePropertyPathInput<pathInput>>>(obj: obj) => getWith<normalizePropertyPathInput<pathInput>, obj>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L63" />

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
const getCityName = Obj.Exports.getWith('address.city')
getCityName({ address: { city: 'NYC' } }) // 'NYC'
getCityName({ address: { city: 'LA' } }) // 'LA'
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Type-safe property access
// [!code word:getWith:1]
const getAge = Obj.Exports.getWith(['user', 'profile', 'age'])
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
users.map(Obj.Exports.getWith('score')) // [95, 87]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getOn`

```typescript
(obj: object): (pathInput: PropertyPathInput) => unknown
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L122" />

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
const getUserProp = Obj.Exports.getOn(user)
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
const getConfig = Obj.Exports.getOn(config)

const apiUrl = getConfig('api.url')
const apiKey = getConfig('api.key')
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `entries`

```typescript
<obj extends Any>(obj: obj): { [K in keyof obj] -?: undefined extends obj[K] ? {} extends Pick<obj, K> ? [K, Exclude<obj[K]>] : [K, obj[K]] : [K, obj[K]]; } [keyof obj][]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L156" />

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
Obj.Exports.entries({ a: 1, b: 'hello', c: true })
// Returns: [['a', 1], ['b', 'hello'], ['c', true]]
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Handles optional properties and undefined values
// [!code word:entries:1]
Obj.Exports.entries({ a: 1, b?: 2, c: undefined })
// Returns proper types preserving optionality
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `stringKeyEntries`

```typescript
<$T extends object>(obj: $T): [string & keyof $T, $T[keyof $T]][]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L183" />

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
Obj.Exports.stringKeyEntries(obj)  // [['a', 1], ['b', 2]]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `entriesStrict`

```typescript
<$T extends object>(obj: $T): { [k in keyof $T]: [k, Exclude<$T[k], undefined>]; } [keyof $T][]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L200" />

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
Obj.Exports.entriesStrict(obj)  // [['a', 1], ['c', 2]]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `keysStrict`

```typescript
<$T extends object>(obj: $T): (keyof $T)[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L222" />

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
Obj.Exports.keysStrict(obj)  // ['a', 'b'] with type ('a' | 'b')[]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getRandomly`

```typescript
<obj extends Any>(obj: obj): keyof obj extends never ? undefined : obj[keyof obj]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L241" />

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
Obj.Exports.getRandomly({ a: 1, b: 2, c: 3 }) // Could return 1, 2, or 3
// [!code word:getRandomly:1]
Obj.Exports.getRandomly({ a: 1, b: undefined }) // Could return 1 or undefined
// [!code word:getRandomly:1]
Obj.Exports.getRandomly({}) // Returns undefined
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getValueAtPath`

```typescript
<$T, ___Path extends readonly string[] > (obj: $T, path: ___Path): any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L270" />

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
Obj.Exports.getValueAtPath(obj, ['a', 'b', 'c'])  // 42
// [!code word:getValueAtPath:1]
Obj.Exports.getValueAtPath(obj, ['a', 'x'])  // undefined
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `values`

```typescript
<$T extends object>(obj: $T): values<$T>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L300" />

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
Obj.Exports.values(obj)  // [1, 'hello', true] with type (string | number | boolean)[]
```

## Filtering

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pick`

```typescript
<T extends object, K extends keyof T > (obj: T, keys: readonly K[]): Pick < T, K >
  <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value?: undefined, obj?: undefined) => boolean): Partial < $Object >
    <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value: $Object[keyof $Object], obj?: $Object | undefined) => boolean): Partial < $Object >
      <T extends object, K extends keyof T > (obj: T, keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)): Pick<T, K> | Partial<T>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L62" />

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
const publicInfo = Obj.Exports.pick(user, ['name', 'email'])
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
  return Obj.Exports.pick(user, ['id', 'name', 'email'])
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
Obj.Exports.pick(obj, k => k !== 'b') // { a: 1, c: 3 }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using a filter function (key, value, obj)
const obj = { a: 1, b: 2, c: 3 }
// [!code word:pick:1]
Obj.Exports.pick(obj, (k, v) => v > 1) // { b: 2, c: 3 }
// [!code word:pick:1]
Obj.Exports.pick(obj, (k, v, o) => v > average(o)) // picks above-average values
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `omit`

```typescript
<T extends object, K extends keyof T > (obj: T, keys: readonly K[]): Omit < T, K >
  <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value?: undefined, obj?: undefined) => boolean): Partial < $Object >
    <$Object extends object>(obj: $Object, predicate: (key: keyof $Object, value: $Object[keyof $Object], obj?: $Object | undefined) => boolean): Partial < $Object >
      <T extends object, K extends keyof T > (obj: T, keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)): Omit<T, K> | Partial<T>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L162" />

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
const safeUser = Obj.Exports.omit(user, ['password'])
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
  return Obj.Exports.omit(user, ['password', 'apiKey'])
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
Obj.Exports.omit(obj, k => k === 'b') // { a: 1, c: 3 } (excludes b)
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using a filter function (key, value, obj)
const obj = { a: 1, b: 2, c: 3 }
// [!code word:omit:1]
Obj.Exports.omit(obj, (k, v) => v > 1) // { a: 1 } (excludes b and c where value > 1)
// [!code word:omit:1]
Obj.Exports.omit(obj, (k, v, o) => v > average(o)) // excludes above-average values
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pickWith`

```typescript
<K extends PropertyKey>(keysOrPredicate: readonly K[] | ((key: PropertyKey, value?: any, obj?: any) => boolean)): <T extends object>(obj: T) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L91" />

Curried version of pick

- takes keys/predicate first, then object.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pickOn`

```typescript
<T extends object>(obj: T): <K extends keyof T>(keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L105" />

Curried version of pick

- takes object first, then keys/predicate.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `omitWith`

```typescript
<K extends PropertyKey>(keysOrPredicate: readonly K[] | ((key: PropertyKey, value?: any, obj?: any) => boolean)): <T extends object>(obj: T) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L192" />

Curried version of omit

- takes keys/predicate first, then object.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `omitOn`

```typescript
<T extends object>(obj: T): <K extends keyof T>(keysOrPredicate: readonly K[] | ((key: keyof T, value?: any, obj?: any) => boolean)) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L206" />

Curried version of omit

- takes object first, then keys/predicate.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `policyFilter`

```typescript
<$Object extends object, $Key extends Keyof<$Object>, $Mode extends 'allow' | 'deny' > (mode: $Mode, obj: $Object, keys: readonly $Key[]): PolicyFilter<$Object, $Key, $Mode>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L236" />

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
Obj.Exports.policyFilter('allow', obj, ['a', 'c']) // { a: 1, c: 3 }

// Deny mode: remove 'a' and 'c'
// [!code word:policyFilter:1]
Obj.Exports.policyFilter('deny', obj, ['a', 'c']) // { b: 2 }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `omitUndefined`

```typescript
<T>(obj: T) => any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L291" />

Remove all properties with `undefined` values from an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
const obj = { a: 1, b: undefined, c: 'hello', d: undefined }
// [!code word:omitUndefined:1]
Obj.Exports.omitUndefined(obj) // { a: 1, c: 'hello' }
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
const cleanConfig = Obj.Exports.omitUndefined(config)
// Only includes properties that have actual values
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `pickMatching`

```typescript
<T extends object>(obj: T, predicate: (key: string) => boolean): Partial<T>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L357" />

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
const dataAttrs = Obj.Exports.pickMatching(props, key => key.startsWith('data-'))
// Result: { 'data-type': 'button', 'data-current': true }
```

## Merging

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mergeWith`

```typescript
(mergers?: MergeOptions | undefined): <obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L43" />

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
const mergeIgnoreUndefined = Obj.Exports.mergeWith({ undefined: false })
mergeIgnoreUndefined({ a: 1 }, { a: undefined, b: 2 })
// Returns: { a: 1, b: 2 }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Create a merger that concatenates arrays
// [!code word:mergeWith:1]
const mergeArrays = Obj.Exports.mergeWith({
// [!code word:push:1]
  array: (a, b) => { a.push(...b) }
})
mergeArrays({ items: [1, 2] }, { items: [3, 4] })
// Returns: { items: [1, 2, 3, 4] }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `merge`

```typescript
<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L81" />

Deep merge two objects, with properties from the second object overwriting the first. Recursively merges nested objects, but arrays and other non-object values are replaced.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:merge:1]
Obj.Exports.merge({ a: 1, b: 2 }, { b: 3, c: 4 })
// Returns: { a: 1, b: 3, c: 4 }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Deep merging of nested objects
// [!code word:merge:1]
Obj.Exports.merge(
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
Obj.Exports.merge({ tags: ['a', 'b'] }, { tags: ['c', 'd'] })
// Returns: { tags: ['c', 'd'] }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mergeWithArrayPush`

```typescript
<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L108" />

Deep merge two objects with special handling for arrays. When both objects have an array at the same path, concatenates them instead of replacing.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:mergeWithArrayPush:1]
Obj.Exports.mergeWithArrayPush(
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
Obj.Exports.mergeWithArrayPush(
  { user: { skills: ['js'] } },
  { user: { skills: ['ts'] } }
)
// Returns: { user: { skills: ['js', 'ts'] } }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mergeWithArrayPushDedupe`

```typescript
<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L139" />

Deep merge two objects with array concatenation and deduplication. When both objects have an array at the same path, concatenates and removes duplicates.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:mergeWithArrayPushDedupe:1]
Obj.Exports.mergeWithArrayPushDedupe(
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
Obj.Exports.mergeWithArrayPushDedupe(
  { ids: [1, 2, 3] },
  { ids: [3, 4, 2, 5] }
)
// Returns: { ids: [1, 2, 3, 4, 5] }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `mergeDefaults`

```typescript
<obj1 extends Any, obj1Defaults extends Partial<obj1>>(obj1: obj1, obj1Defaults: obj1Defaults) => { [_ in keyof(obj1 & obj1Defaults)]: (obj1 & obj1Defaults)[_]; }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L175" />

Merge default values into an object, only filling in missing properties. Existing properties in the base object are preserved, even if undefined.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:mergeDefaults:1]
Obj.Exports.mergeDefaults(
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
Obj.Exports.mergeDefaults(config, defaults)
// Returns: { port: 3000, host: 'localhost', debug: false }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `shallowMergeDefaults`

```typescript
<$Defaults extends object, $Input extends object > (defaults: $Defaults, input: $Input): $Defaults & $Input
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L199" />

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
Obj.Exports.shallowMergeDefaults(defaults, input)  // { a: 1, b: 20, c: 3 }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `spreadShallow`

```typescript
<$Objects extends readonly (object | undefined)[]>(...objects ?: $Objects): { }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L234" />

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
const config = Obj.Exports.spreadShallow(
  defaultConfig,
  userConfig,
  { debug: debug ? true : undefined }
)
// undefined values won't override earlier values
```

## Path Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `normalizePropertyPathInput`

```typescript
<pathInput extends PropertyPathInput>(pathInput: pathInput): normalizePropertyPathInput<pathInput>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L31" />

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
Obj.Exports.normalizePropertyPathInput('user.address.city')
// Returns: ['user', 'address', 'city']
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:normalizePropertyPathInput:1]
Obj.Exports.normalizePropertyPathInput(['user', 'address', 'city'])
// Returns: ['user', 'address', 'city'] (unchanged)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `parsePropertyPathExpression`

```typescript
<expression extends string>(expression: expression) => parsePropertyPathExpression<expression>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L81" />

Parse a dot-notation property path expression into an array of property names.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:parsePropertyPathExpression:1]
Obj.Exports.parsePropertyPathExpression('user.name')
// Returns: ['user', 'name']
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:parsePropertyPathExpression:1]
Obj.Exports.parsePropertyPathExpression('config.server.port')
// Returns: ['config', 'server', 'port']
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// [!code word:parsePropertyPathExpression:1]
Obj.Exports.parsePropertyPathExpression('singleProperty')
// Returns: ['singleProperty']
```

## Predicates

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `hasNonUndefinedKeys`

```typescript
(object: object): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L179" />

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
Obj.Exports.hasNonUndefinedKeys({ a: undefined, b: undefined })  // false
// [!code word:hasNonUndefinedKeys:1]
Obj.Exports.hasNonUndefinedKeys({ a: undefined, b: 1 })  // true
// [!code word:hasNonUndefinedKeys:1]
Obj.Exports.hasNonUndefinedKeys({})  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `empty`

```typescript
(): Empty
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L87" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isEmpty`

```typescript
(obj: object): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L195" />

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
Obj.Exports.isEmpty({}) // true
// [!code word:isEmpty:1]
Obj.Exports.isEmpty({ a: 1 }) // false
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
Obj.Exports.isEmpty(obj) // true - non-enumerable properties are ignored
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isEmpty$`

```typescript
<$T extends object>(obj: $T): boolean
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L228" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `assert`

```typescript
(value: unknown): void
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L34" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isShape`

```typescript
<type>(spec: Record<PropertyKey, "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function">): (value: unknown) => value is type
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L73" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `setPrivateState`

```typescript
<obj extends Any>(obj: obj, value: object): obj
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L116" />

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
Obj.Exports.setPrivateState(user, privateData)
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
Obj.Exports.setPrivateState(config, {
  source: 'environment',
// [!code word:now:1]
  timestamp: Date.now()
})
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `getPrivateState`

```typescript
<state extends Any>(obj: object): state
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L159" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Eq`

```typescript
Eq<object>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/traits/eq.ts#L35" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapEntriesDeep`

```typescript
<$value extends DeepObjectValue>(value: $value, visitor: (key: string, value: DeepObjectValue) => { key: string; value: DeepObjectValue; } | undefined): $value
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/map-entries-deep.ts#L132" />

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
Obj.Exports.mapEntriesDeep(data, (key, value) =>
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
Obj.Exports.mapEntriesDeep(data, (key, value) =>
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
Obj.Exports.mapEntriesDeep(data, (key, value) => {
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
Obj.Exports.mapEntriesDeep(data, (key, value) => {
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
Obj.Exports.mapEntriesDeep(users, (key, value) =>
// [!code word:startsWith:1]
// [!code word:slice:1]
  key.startsWith('$') ? { key: key.slice(1), value } : undefined
)
// [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapValuesDeep`

```typescript
(value: any, visitor: (value: any) => any, visited?: WeakSet<WeakKey> = new WeakSet()): any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/map-values-deep.ts#L89" />

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
Obj.Exports.mapValuesDeep(testData, (v) => {
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
Obj.Exports.mapValuesDeep(data, (v) => {
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
Obj.Exports.mapValuesDeep(data, (v) => {
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
Obj.Exports.mapValuesDeep(data, (v) => {
  // Replace Buffer objects with their base64 representation
// [!code word:isBuffer:1]
  if (Buffer.isBuffer(v)) {
// [!code word:toString:1]
    return v.toString('base64')
  }
})
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `mapValues`

```typescript
<rec extends Record<PropertyKey, any>, newValue > (obj: rec, fn: (value: rec[keyof rec], key: keyof rec) => newValue): Record<keyof rec, newValue>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/update.ts#L25" />

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
const doublePrices = Obj.Exports.mapValues(prices, (price) => price * 2)
// Result: { apple: 3, banana: 1.5, orange: 4 }
```

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
// Using the key parameter
const data = { a: 1, b: 2, c: 3 }
// [!code word:mapValues:1]
const withKeys = Obj.Exports.mapValues(data, (value, key) => `${key}: ${value}`)
// Result: { a: 'a: 1', b: 'b: 2', c: 'c: 3' }
```

## Type Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Keyof`

```typescript
type Keyof<$Object extends object> = object extends $Object ? PropertyKey : (keyof $Object)
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L380" />

Like keyof but returns PropertyKey for object type. Helper type for generic object key operations.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PolicyFilter`

```typescript
type PolicyFilter<
  $Object extends object,
  $Key extends Keyof<$Object>,
  $Mode extends 'allow' | 'deny',
> = $Mode extends 'allow'
  ? Pick<$Object, Extract<$Key, keyof $Object>>
  : Omit<$Object, Extract<$Key, keyof $Object>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L400" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PickWhereValueExtends`

```typescript
type PickWhereValueExtends<$Obj extends object, $Constraint> = {
  [k in keyof $Obj as $Obj[k] extends $Constraint ? k : never]: $Obj[k]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L420" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SuffixKeyNames`

```typescript
type SuffixKeyNames<$Suffix extends string, $Object extends object> = {
  [k in keyof $Object as k extends string ? `${k}${$Suffix}` : k]: $Object[k]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L435" />

Add a suffix to all property names in an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = SuffixKeyNames<'_old', { a: string; b: number }>
// { a_old: string; b_old: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `OmitKeysWithPrefix`

```typescript
type OmitKeysWithPrefix<$Object extends object, $Prefix extends string> = {
  [k in keyof $Object as k extends `${$Prefix}${string}` ? never : k]: $Object[k]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L450" />

Omit all keys that start with a specific prefix.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = OmitKeysWithPrefix<{ _a: string; _b: number; c: boolean }, '_'>
// { c: boolean }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PickRequiredProperties`

```typescript
type PickRequiredProperties<$T extends object> = {
  [k in keyof $T as {} extends Pick<$T, k> ? never : k]: $T[k]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L464" />

Pick only the required (non-optional) properties from an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = PickRequiredProperties<{ a: string; b?: number }>  // { a: string }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RequireProperties`

```typescript
type RequireProperties<$O extends object, $K extends keyof $O> = Ts.Simplify<$O & { [k in $K]-?: $O[k] }>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L479" />

Make specific properties required in an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = RequireProperties<{ a?: string; b?: number }, 'a'>
// { a: string; b?: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PartialOrUndefined`

```typescript
type PartialOrUndefined<$T> = {
  [k in keyof $T]?: $T[k] | undefined
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L492" />

Make all properties optional and allow undefined values.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = PartialOrUndefined<{ a: string; b: number }>
// { a?: string | undefined; b?: number | undefined }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PickOptionalPropertyOrFallback`

```typescript
type PickOptionalPropertyOrFallback<$Object extends object, $Property extends keyof $Object, $Fallback> =
  {} extends Pick<$Object, $Property> ? $Object[$Property] : $Fallback
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L507" />

Pick an optional property or use fallback if required.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = PickOptionalPropertyOrFallback<{ a?: string }, 'a', never>  // string
type T2 = PickOptionalPropertyOrFallback<{ a: string }, 'a', never>  // never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `OnlyKeysInArray`

```typescript
type OnlyKeysInArray<$Obj extends object, $KeysArray extends readonly string[]> = {
  [k in keyof $Obj as k extends $KeysArray[number] ? k : never]: $Obj[k]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L522" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GetKeyOr`

```typescript
type GetKeyOr<$T, $Key, $Or> = $Key extends keyof $T ? $T[$Key] : $Or
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L317" />

Get value at key, or return fallback if key doesn't exist.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = GetKeyOr<{ a: string }, 'a', never>  // string
type T2 = GetKeyOr<{ a: string }, 'b', never>  // never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GetOrNever`

```typescript
type GetOrNever<$O extends object, $P extends string> = $P extends keyof $O ? $O[$P]
  : $P extends `${infer __head__}.${infer __tail__}`
  ? __head__ extends keyof $O ? GetOrNever<$O[__head__] & object, __tail__>
  : never
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L330" />

Get value at key or return never.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = GetOrNever<{ a: string }, 'a'>  // string
type T2 = GetOrNever<{ a: string }, 'b'>  // never
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `keyofOr`

```typescript
type keyofOr<$Obj extends object, $Or> = [keyof $Obj] extends [never] ? $Or : $Obj[keyof $Obj]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L347" />

Get the union of all value types from an object, or return fallback if no keys.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = keyofOr<{ a: string; b: number }, never>  // string | number
type T2 = keyofOr<{}, 'fallback'>  // 'fallback'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `KeysArray`

```typescript
type KeysArray<$Obj extends object> = Array<keyof $Obj>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L361" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `KeysReadonlyArray`

```typescript
type KeysReadonlyArray<$Obj extends object> = ReadonlyArray<keyof $Obj>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L375" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `StringKeyof`

```typescript
type StringKeyof<$T> = keyof $T & string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L387" />

Extract only string keys from an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = StringKeyof<{ a: 1;[x: number]: 2 }>  // 'a'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PrimitiveFieldKeys`

```typescript
type PrimitiveFieldKeys<$T> = {
  [K in keyof $T]: $T[K] extends string | number | boolean | bigint | null | undefined ? K
  : $T[K] extends Date ? K
  : never
}[keyof $T]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/get.ts#L409" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `MergeAllShallow`

```typescript
type MergeAllShallow<$Objects extends readonly object[]> =
  $Objects extends readonly [infer $First extends object, ...infer $Rest extends object[]]
  ? $Rest extends readonly []
  ? $First
  : MergeShallow<$First, MergeAllShallow<$Rest>>
  : {}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L287" />

Recursively merge an array of objects using shallow merge semantics. Each object in the array overrides properties from previous objects.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = MergeAllShallow<[{ a: string }, { b: number }, { c: boolean }]>
// Result: { a: string; b: number; c: boolean }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `MergeAll`

```typescript
type MergeAll<$Objects extends object[]> = $Objects extends
  [infer __first__ extends object, ...infer __rest__ extends object[]] ? __first__ & MergeAll<__rest__>
  : {}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L306" />

Merge an array of object types into a single type using deep merge semantics. Uses TypeScript's intersection type (`&`) for merging.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T = MergeAll<[{ a: string }, { b: number }]>
// Result: { a: string; b: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `ReplaceProperty`

```typescript
type ReplaceProperty<$Obj extends object, $Key extends keyof $Obj, $NewType> =
  & Omit<$Obj, $Key>
  & {
    [_ in $Key]: $NewType
  }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L322" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Replace`

```typescript
type Replace<$Object1, $Object2> = Omit<$Object1, keyof $Object2> & $Object2
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L341" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Writeable`

```typescript
type Writeable<$Obj extends object> = Writable<$Obj>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L224" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ToParameters`

```typescript
type ToParameters<$Params extends object | undefined> =
  undefined extends $Params ? [params?: $Params] :
  $Params extends undefined ? [params?: $Params] :
  [params: $Params]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L232" />

Convert an object to a parameters tuple.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ToParametersExact`

```typescript
type ToParametersExact<
  $Input extends object,
  $Params extends object | undefined,
> = IsEmpty<$Input> extends true ? []
  : ToParameters<$Params>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L242" />

Convert an object to parameters tuple with exact matching.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PropertyKeyToString`

```typescript
type PropertyKeyToString<$Key extends PropertyKey> = $Key extends string ? $Key
  : $Key extends number ? `${$Key}`
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L253" />

Convert PropertyKey to string if possible.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsEmpty`

```typescript
type IsEmpty<$Obj extends object> = keyof $Obj extends never ? true : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L27" />

Type-level check to determine if an object type has no keys.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type Empty = IsEmpty<{}> // true
type NotEmpty = IsEmpty<{ a: 1 }> // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Empty`

```typescript
type Empty = Record<string, never>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L34" />

Type for an empty object.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `NoExcessNonEmpty`

```typescript
type NoExcessNonEmpty<$Value extends object, $Constraint> = IsEmpty<$Value> extends true ? never
  : NoExcess<$Constraint, $Value>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L160" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `HasOptionalKeys`

```typescript
type HasOptionalKeys<$Obj extends object> = OptionalKeys<$Obj> extends never ? false : true
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L14" />

Check if an interface has any optional properties.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = HasOptionalKeys<{ a?: string }>  // true
type T2 = HasOptionalKeys<{ a: string }>  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `OptionalKeys`

```typescript
type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L27" />

Extract keys that are optional in the interface.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type Obj = { a: string; b?: number; c?: boolean }
type Optional = OptionalKeys<Obj>  // 'b' | 'c'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `RequiredKeys`

```typescript
type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L42" />

Extract keys that are required in the interface.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type Obj = { a: string; b?: number; c?: boolean }
type Required = RequiredKeys<Obj>  // 'a'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `HasRequiredKeys`

```typescript
type HasRequiredKeys<$Obj extends object> = RequiredKeys<$Obj> extends never ? false : true
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L56" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `HasOptionalKey`

```typescript
type HasOptionalKey<$Object extends object, $Key extends keyof $Object> = undefined extends $Object[$Key] ? true
  : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L69" />

Check if a key is optional in an object.

**Examples:**

```typescript twoslash
// @noErrors
import { Obj } from '@wollybeard/kit/obj'
// ---cut---
type T1 = HasOptionalKey<{ a?: string }, 'a'>  // true
type T2 = HasOptionalKey<{ a: string }, 'a'>  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsKeyOptional`

```typescript
type IsKeyOptional<$T extends Undefined.Maybe<object>, $K extends string> = $K extends keyof $T
  ? ({} extends Pick<$T, $K> ? true : false)
  : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L84" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `HasKey`

```typescript
type HasKey<$T extends object, $K extends string> = $K extends keyof $T ? true : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/predicates.ts#L99" />

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

$A - The object type to subtract from $B - The object type whose properties to remove

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SubtractShallow`

```typescript
type SubtractShallow<$A, $B> = Omit<$A, keyof $B>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L65" />

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

$Expected - The type defining allowed properties $Actual - The actual type to check for excess properties

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `NoExcess`

```typescript
type NoExcess<$Expected, $Actual> = $Actual & Record<Exclude<keyof $Actual, keyof $Expected>, never>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L140" />

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

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `Type`

```typescript
Type<object>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/traits/type.ts#L5" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `partition`

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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/filter.ts#L293" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `DeepObjectValue`

```typescript
type DeepObjectValue = string | boolean | null | number | DeepObject | DeepObjectValue[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/map-entries-deep.ts#L4" />

A deep object value can be any JSON-serializable value including nested objects and arrays.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `DeepObject`

```typescript
type DeepObject = { [key: string]: DeepObjectValue }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/map-entries-deep.ts#L9" />

A deep object is a plain object with string keys and deep object values.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `MergeShallow`

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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/merge.ts#L261" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PartialDeep`

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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/obj.ts#L186" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PropertyPathExpression`

```typescript
type PropertyPathExpression = string
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L4" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PropertyPath`

```typescript
type PropertyPath = readonly string[]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L6" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `PropertyPathInput`

```typescript
type PropertyPathInput = PropertyPathExpression | PropertyPath
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L8" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PropertyPathSeparator`

```typescript
"."
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L52" />

The separator character used in property path expressions. Used to split dot-notation paths like 'user.address.city'.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `InferShapeFromPropertyPath`

```typescript
type InferShapeFromPropertyPath<$PropertyPath extends PropertyPath> =
  $PropertyPath extends readonly []
  ? {}
  : _InferShapeFromPropertyPath<$PropertyPath>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/path.ts#L92" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Any`

```typescript
type Any = object
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/type.ts#L4" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PropertySignature`

```typescript
type PropertySignature = {
  name: string
  type: any
  optional: boolean
  optionalUndefined: boolean
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/domains/obj/property-signature.ts#L1" />
