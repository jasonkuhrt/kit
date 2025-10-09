# Obj

Object utilities for working with plain JavaScript objects.

Provides type-safe utilities for object operations including property access,
manipulation, merging, filtering, and transformations. Supports both value-level
and type-level operations with strong type inference.

## Import

```typescript
import { Obj } from '@wollybeard/kit/obj'
```

## Functions

### pick <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L43)</sub>

```typescript
;(<T extends object, K extends keyof T>(obj: T, keys: readonly K[]) =>
  Pick<T, K>)
```

### omit <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L80)</sub>

```typescript
;(<T extends object, K extends keyof T>(obj: T, keys: readonly K[]) =>
  Omit<T, K>)
```

### policyFilter <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L106)</sub>

```typescript
;(<
  $Object extends object,
  $Key extends Keyof<$Object>,
  $Mode extends 'allow' | 'deny',
>(mode: $Mode, obj: $Object, keys: readonly $Key[]) =>
  PolicyFilter<$Object, $Key, $Mode>)
```

### filter <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L149)</sub>

```typescript
;(<$Object extends object>(
  obj: $Object,
  predicate: (
    key: keyof $Object,
    value: $Object[keyof $Object],
    obj: $Object,
  ) => boolean,
) => Partial<$Object>)
```

### partition <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L177)</sub>

```typescript
;(<$Object extends object, $Key extends keyof $Object>(
  obj: $Object,
  pickedKeys: readonly $Key[],
) => {
  omitted: Omit<$Object, $Key>
  picked: Pick<$Object, $Key>
})
```

### pickMatching <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L214)</sub>

```typescript
;(<T extends object>(obj: T, predicate: (key: string) => boolean) => Partial<T>)
```

### getWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L61)</sub>

```typescript
;(<pathInput extends PropertyPathInput>(pathInput: pathInput) =>
<obj extends InferShapeFromPropertyPath<normalizePropertyPathInput<pathInput>>>(
  obj: obj,
) => getWith<normalizePropertyPathInput<pathInput>, obj>)
```

### getOn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L118)</sub>

```typescript
;((obj: object) => (pathInput: PropertyPathInput) => unknown)
```

### entries <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L150)</sub>

```typescript
<obj extends Any>(obj: obj) => { [K in keyof obj]-?: undefined extends obj[K] ? {} extends Pick<obj, K> ? [K, Exclude<obj[K]>] : [K, obj[K]] : [K, obj[K]]; }[keyof obj][]
```

### stringKeyEntries <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L175)</sub>

```typescript
<$T extends object>(obj: $T) => [string & keyof $T, $T[keyof $T]][]
```

### entriesStrict <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L190)</sub>

```typescript
<$T extends object>(obj: $T) => { [k in keyof $T]: [k, Exclude<$T[k], undefined>]; }[keyof $T][]
```

### keysStrict <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L210)</sub>

```typescript
<$T extends object>(obj: $T) => (keyof $T)[]
```

### getRandomly <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L226)</sub>

```typescript
<obj extends Any>(obj: obj) => keyof obj extends never ? undefined : obj[keyof obj]
```

### getValueAtPath <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L253)</sub>

```typescript
;(<$T, ___Path extends readonly string[]>(obj: $T, path: ___Path) => any)
```

### values <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L281)</sub>

```typescript
;(<$T extends object>(obj: $T) => values<$T>)
```

### mapEntriesDeep <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/map-entries-deep.ts#L41)</sub>

```typescript
;(<$value extends DeepObjectValue>(
  value: $value,
  visitor: (
    key: string,
    value: DeepObjectValue,
  ) => { key: string; value: DeepObjectValue } | undefined,
) => $value)
```

### mergeWith <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L41)</sub>

```typescript
;((mergers?: MergeOptions | undefined) =>
<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2)
```

### shallowMergeDefaults <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L187)</sub>

```typescript
;(<$Defaults extends object, $Input extends object>(
  defaults: $Defaults,
  input: $Input,
) => $Defaults & $Input)
```

### spreadShallow <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L220)</sub>

```typescript
;(<$Objects extends readonly (object | undefined)[]>(
  ...objects: $Objects
) => {})
```

### assert <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/obj.ts#L32)</sub>

Assert that a value is an object.
Throws a TypeError if the value is not an object (including null).

```typescript
export function assert(value: unknown): void
```

**Examples:**

```ts twoslash
Obj.assert(value)
  // value is now typed as object
  console.log(Object.keys(value))
}
```

### isShape <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/obj.ts#L69)</sub>

```typescript
<type>(spec: Record<PropertyKey, "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function">) => (value: unknown) => value is type
```

### setPrivateState <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/obj.ts#L110)</sub>

```typescript
;(<obj extends Any>(obj: obj, value: object) => obj)
```

### getPrivateState <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/obj.ts#L151)</sub>

```typescript
;(<state extends Any>(obj: object) => state)
```

### hasNonUndefinedKeys <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/obj.ts#L169)</sub>

```typescript
;((object: object) => boolean)
```

### normalizePropertyPathInput <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/path.ts#L29)</sub>

```typescript
;(<pathInput extends PropertyPathInput>(pathInput: pathInput) =>
  normalizePropertyPathInput<pathInput>)
```

### empty <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/type.ts#L49)</sub>

```typescript
;(() => Empty)
```

### isEmpty <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/type.ts#L151)</sub>

```typescript
;((obj: object) => boolean)
```

### isEmpty$ <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/type.ts#L182)</sub>

```typescript
<$T extends object>(obj: $T) => obj is $T & Empty
```

### mapValues <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/update.ts#L23)</sub>

```typescript
;(<rec extends Record<PropertyKey, any>, newValue>(
  obj: rec,
  fn: (value: rec[keyof rec], key: keyof rec) => newValue,
) => Record<keyof rec, newValue>)
```

## Constants

### Eq <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/traits/eq.ts#L33)</sub>

```typescript
Eq<object>
```

### Type <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/traits/type.ts#L5)</sub>

```typescript
Type<object>
```

### merge <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L77)</sub>

```typescript
;(<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2)
```

### mergeWithArrayPush <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L102)</sub>

```typescript
;(<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2)
```

### mergeWithArrayPushDedupe <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L131)</sub>

```typescript
;(<obj1 extends Any, obj2 extends Any>(obj1: obj1, obj2: obj2) => obj1 & obj2)
```

### mergeDefaults <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L165)</sub>

```typescript
<obj1 extends Any, obj1Defaults extends Partial<obj1>>(obj1: obj1, obj1Defaults: obj1Defaults) => { [_ in keyof (obj1 & obj1Defaults)]: (obj1 & obj1Defaults)[_]; }
```

### PropertyPathSeparator <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/path.ts#L50)</sub>

```typescript
'.'
```

### parsePropertyPathExpression <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/path.ts#L77)</sub>

```typescript
;(<expression extends string>(expression: expression) =>
  parsePropertyPathExpression<expression>)
```

## Types

### Keyof <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L241)</sub>

Like keyof but returns PropertyKey for object type.
Helper type for generic object key operations.

```typescript
export type Keyof<$Object extends object> = object extends $Object ? PropertyKey
  : (keyof $Object)
```

### PolicyFilter <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L258)</sub>

Filter object properties based on a policy mode and set of keys.

```typescript
export type PolicyFilter<
  $Object extends object,
  $Key extends Keyof<$Object>,
  $Mode extends 'allow' | 'deny',
> = $Mode extends 'allow' ? Pick<$Object, Extract<$Key, keyof $Object>>
  : Omit<$Object, Extract<$Key, keyof $Object>>
```

**Examples:**

```ts twoslash
// Allow mode: keep only specified keys
type PublicUser = PolicyFilter<User, 'id' | 'name', 'allow'>
// Result: { id: number; name: string }

// Deny mode: remove specified keys
type SafeUser = PolicyFilter<User, 'password', 'deny'>
// Result: { id: number; name: string; email: string }
```

### PickWhereValueExtends <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L275)</sub>

Pick properties from an object where the values extend a given constraint.

```typescript
export type PickWhereValueExtends<$Obj extends object, $Constraint> = {
  [k in keyof $Obj as $Obj[k] extends $Constraint ? k : never]: $Obj[k]
}
```

**Examples:**

```ts twoslash
type BooleanProps = PickWhereValueExtends<User, boolean>
// Result: { isActive: boolean; flag: boolean }
```

### SuffixKeyNames <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L288)</sub>

Add a suffix to all property names in an object.

```typescript
export type SuffixKeyNames<$Suffix extends string, $Object extends object> = {
  [k in keyof $Object as k extends string ? `${k}${$Suffix}` : k]: $Object[k]
}
```

**Examples:**

```ts twoslash
// { a_old: string; b_old: number }
```

### OmitKeysWithPrefix <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L301)</sub>

Omit all keys that start with a specific prefix.

```typescript
export type OmitKeysWithPrefix<$Object extends object, $Prefix extends string> =
  {
    [k in keyof $Object as k extends `${$Prefix}${string}` ? never : k]:
      $Object[k]
  }
```

**Examples:**

```ts twoslash
// { c: boolean }
```

### PickRequiredProperties <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L313)</sub>

Pick only the required (non-optional) properties from an object.

```typescript
export type PickRequiredProperties<$T extends object> = {
  [k in keyof $T as {} extends Pick<$T, k> ? never : k]: $T[k]
}
```

**Examples:**

```ts twoslash
```

### RequireProperties <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L326)</sub>

Make specific properties required in an object.

```typescript
export type RequireProperties<$O extends object, $K extends keyof $O> =
  Ts.Simplify<$O & { [k in $K]-?: $O[k] }>
```

**Examples:**

```ts twoslash
// { a: string; b?: number }
```

### PartialOrUndefined <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L337)</sub>

Make all properties optional and allow undefined values.

```typescript
export type PartialOrUndefined<$T> = {
  [k in keyof $T]?: $T[k] | undefined
}
```

**Examples:**

```ts twoslash
// { a?: string | undefined; b?: number | undefined }
```

### PickOptionalPropertyOrFallback <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L350)</sub>

Pick an optional property or use fallback if required.

```typescript
export type PickOptionalPropertyOrFallback<
  $Object extends object,
  $Property extends keyof $Object,
  $Fallback,
> = {} extends Pick<$Object, $Property> ? $Object[$Property] : $Fallback
```

**Examples:**

```ts twoslash
type T2 = PickOptionalPropertyOrFallback<{ a: string }, 'a', never> // never
```

### OnlyKeysInArray <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/filter.ts#L362)</sub>

Pick only the properties from an object that exist in a provided array of keys.

```typescript
export type OnlyKeysInArray<
  $Obj extends object,
  $KeysArray extends readonly string[],
> = {
  [k in keyof $Obj as k extends $KeysArray[number] ? k : never]: $Obj[k]
}
```

**Examples:**

```ts twoslash
type PublicUser = OnlyKeysInArray<User, ['name', 'email']>
// Result: { name: string; email: string }
```

### GetKeyOr <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L296)</sub>

Get value at key, or return fallback if key doesn't exist.

```typescript
export type GetKeyOr<$T, $Key, $Or> = $Key extends keyof $T ? $T[$Key] : $Or
```

**Examples:**

```ts twoslash
type T2 = GetKeyOr<{ a: string }, 'b', never> // never
```

### GetOrNever <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L307)</sub>

Get value at key or return never.

```typescript
export type GetOrNever<$O extends object, $P extends string> = $P extends
  keyof $O ? $O[$P]
  : $P extends `${infer __head__}.${infer __tail__}`
    ? __head__ extends keyof $O ? GetOrNever<$O[__head__] & object, __tail__>
    : never
  : never
```

**Examples:**

```ts twoslash
type T2 = GetOrNever<{ a: string }, 'b'> // never
```

### keyofOr <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L322)</sub>

Get the union of all value types from an object, or return fallback if no keys.

```typescript
export type keyofOr<$Obj extends object, $Or> = [keyof $Obj] extends [never]
  ? $Or
  : $Obj[keyof $Obj]
```

**Examples:**

```ts twoslash
type T2 = keyofOr<{}, 'fallback'> // 'fallback'
```

### KeysArray <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L333)</sub>

Create an array type containing the keys of an object.

```typescript
export type KeysArray<$Obj extends object> = Array<keyof $Obj>
```

**Examples:**

```ts twoslash
type UserKeys = KeysArray<User>
// Result: Array<'name' | 'age' | 'email'>
```

### KeysReadonlyArray <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L344)</sub>

Create a readonly array type containing the keys of an object.

```typescript
export type KeysReadonlyArray<$Obj extends object> = ReadonlyArray<keyof $Obj>
```

**Examples:**

```ts twoslash
type UserKeys = KeysReadonlyArray<User>
// Result: ReadonlyArray<'name' | 'age' | 'email'>
```

### StringKeyof <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L354)</sub>

Extract only string keys from an object.

```typescript
export type StringKeyof<$T> = keyof $T & string
```

**Examples:**

```ts twoslash
```

### PrimitiveFieldKeys <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/get.ts#L373)</sub>

Extract keys from an object type that have primitive values.
Useful for serialization scenarios where only primitive values can be safely transferred.

```typescript
export type PrimitiveFieldKeys<$T> = {
  [K in keyof $T]: $T[K] extends
    string | number | boolean | bigint | null | undefined ? K
    : $T[K] extends Date ? K
    : never
}[keyof $T]
```

**Examples:**

```ts twoslash
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

### DeepObjectValue <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/map-entries-deep.ts#L6)</sub>

A deep object value can be any JSON-serializable value including nested objects and arrays.

```typescript
export type DeepObjectValue =
  | string
  | boolean
  | null
  | number
  | DeepObject
  | DeepObjectValue[]
```

### DeepObject <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/map-entries-deep.ts#L11)</sub>

A deep object is a plain object with string keys and deep object values.

```typescript
export type DeepObject = { [key: string]: DeepObjectValue }
```

### MergeShallow <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L247)</sub>

```typescript
export type MergeShallow<
  $Object1 extends Any,
  $Object2 extends Any,
  __ = {} extends $Object1 ? $Object2
    :
      & $Object2
      // Keys from $Object1 that are NOT in $Object2
      & {
        [
          __k__ in keyof $Object1 as __k__ extends keyof $Object2 ? never
            : __k__
        ]: $Object1[__k__]
      },
> = __
```

### MergeAllShallow <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L271)</sub>

Recursively merge an array of objects using shallow merge semantics.
Each object in the array overrides properties from previous objects.

```typescript
export type MergeAllShallow<$Objects extends readonly object[]> =
  $Objects extends
    readonly [infer $First extends object, ...infer $Rest extends object[]]
    ? $Rest extends readonly [] ? $First
    : MergeShallow<$First, MergeAllShallow<$Rest>>
    : {}
```

**Examples:**

```ts twoslash
// Result: { a: string; b: number; c: boolean }
```

### MergeAll <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L288)</sub>

Merge an array of object types into a single type using deep merge semantics.
Uses TypeScript's intersection type (`&`) for merging.

```typescript
export type MergeAll<$Objects extends object[]> = $Objects extends
  [infer __first__ extends object, ...infer __rest__ extends object[]]
  ? __first__ & MergeAll<__rest__>
  : {}
```

**Examples:**

```ts twoslash
// Result: { a: string; b: number }
```

### ReplaceProperty <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L301)</sub>

Replace the type of a specific property in an object.

```typescript
export type ReplaceProperty<
  $Obj extends object,
  $Key extends keyof $Obj,
  $NewType,
> =
  & Omit<$Obj, $Key>
  & {
    [_ in $Key]: $NewType
  }
```

**Examples:**

```ts twoslash
type UpdatedUser = ReplaceProperty<User, 'id', string>
// Result: { id: string; name: string; age: number }
```

### Replace <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/merge.ts#L317)</sub>

Replace properties in an object type with new types.
Useful for overriding specific property types.

```typescript
export type Replace<$Object1, $Object2> =
  & Omit<$Object1, keyof $Object2>
  & $Object2
```

**Examples:**

```ts twoslash
type SerializedUser = Replace<User, { createdAt: string }>
// Result: { id: number; name: string; createdAt: string }
```

### PartialDeep <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/obj.ts#L176)</sub>

```typescript
export type PartialDeep<$Type> = $Type extends Array<infer __inner__>
  ? Array<PartialDeep<__inner__>>
  : $Type extends ReadonlyArray<infer __inner__>
    ? ReadonlyArray<PartialDeep<__inner__>>
  : $Type extends Promise<infer __inner__> ? Promise<PartialDeep<__inner__>>
  : $Type extends Function ? $Type
  : $Type extends object ? {
      [key in keyof $Type]?: PartialDeep<$Type[key]>
    }
  // else
  : $Type
```

### Writeable <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/obj.ts#L211)</sub>

Make all properties of an object writable (remove readonly modifiers).

```typescript
export type Writeable<$Obj extends object> = Writable<$Obj>
```

**Examples:**

```ts twoslash
type WritableUser = Writeable<ReadonlyUser>
// Result: { id: number; name: string }
```

### ToParameters <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/obj.ts#L217)</sub>

Convert an object to a parameters tuple.

```typescript
export type ToParameters<$Params extends object | undefined> = undefined extends
  $Params ? [params?: $Params]
  : $Params extends undefined ? [params?: $Params]
  : [params: $Params]
```

### ToParametersExact <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/obj.ts#L225)</sub>

Convert an object to parameters tuple with exact matching.

```typescript
export type ToParametersExact<
  $Input extends object,
  $Params extends object | undefined,
> = IsEmpty<$Input> extends true ? []
  : ToParameters<$Params>
```

### PropertyKeyToString <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/obj.ts#L234)</sub>

Convert PropertyKey to string if possible.

```typescript
export type PropertyKeyToString<$Key extends PropertyKey> = $Key extends string
  ? $Key
  : $Key extends number ? `${$Key}`
  : never
```

### PropertyPathExpression <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/path.ts#L4)</sub>

```typescript
export type PropertyPathExpression = string
```

### PropertyPath <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/path.ts#L6)</sub>

```typescript
export type PropertyPath = readonly string[]
```

### PropertyPathInput <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/path.ts#L8)</sub>

```typescript
export type PropertyPathInput = PropertyPathExpression | PropertyPath
```

### InferShapeFromPropertyPath <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/path.ts#L88)</sub>

```typescript
export type InferShapeFromPropertyPath<$PropertyPath extends PropertyPath> =
  $PropertyPath extends readonly [] ? {}
    : _InferShapeFromPropertyPath<$PropertyPath>
```

### _InferShapeFromPropertyPath <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/path.ts#L94)</sub>

```typescript
export type _InferShapeFromPropertyPath<$PropertyPath extends PropertyPath> =
  $PropertyPath extends readonly [
    infer __key__ extends string,
    ...infer __tail__ extends readonly string[],
  ] ? { [_ in __key__]?: InferShapeFromPropertyPath<__tail__> }
    : unknown
```

### Any <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/type.ts#L4)</sub>

```typescript
export type Any = object
```

### IsEmpty <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/type.ts#L24)</sub>

Type-level check to determine if an object type has no keys.

```typescript
export type IsEmpty<$Obj extends object> = keyof $Obj extends never ? true
  : false
```

**Examples:**

```ts twoslash
type NotEmpty = IsEmpty<{ a: 1 }> // false
```

### Empty <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/type.ts#L29)</sub>

Type for an empty object.

```typescript
export type Empty = Record<string, never>
```

### NoExcess <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/type.ts#L100)</sub>

Enforces that a type has no excess properties beyond those defined in the expected type.

This utility intersects the actual type with a record that marks all excess keys as `never`,
causing TypeScript to reject values with properties not present in the expected type.
Particularly useful in generic contexts where excess property checking is bypassed.

```typescript
export type NoExcess<$Expected, $Actual> =
  & $Actual
  & Record<Exclude<keyof $Actual, keyof $Expected>, never>
```

**Examples:**

```ts twoslash
// Standard generic - allows excess properties
function test1<T extends User>(input: T): void {}
test1({ name: 'Alice', age: 30, extra: true }) // ✓ No error (excess allowed)

// With NoExcess - rejects excess
function test2<T extends User>(input: Obj.NoExcess<User, T>): void {}
test2({ name: 'Alice', age: 30, extra: true }) // ✗ Error: 'extra' is never
test2({ name: 'Alice', age: 30 }) // ✓ OK
```

```ts twoslash
type Config = { id: string; debug?: boolean }

function configure<T extends Config>(config: Obj.NoExcess<Config, T>): void {}

configure({ id: 'test' }) // ✓ OK - optional omitted
configure({ id: 'test', debug: true }) // ✓ OK - optional included
configure({ id: 'test', invalid: 'x' }) // ✗ Error: 'invalid' is never
```

### NoExcessNonEmpty <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/type.ts#L118)</sub>

Like {@link NoExcess} but also requires the object to be non-empty.

Enforces that:

1. Object has at least one property (not empty)
2. Object has no excess properties beyond the constraint

```typescript
export type NoExcessNonEmpty<$Value extends object, $Constraint> =
  IsEmpty<$Value> extends true ? never
    : NoExcess<$Constraint, $Value>
```

**Examples:**

```ts twoslash
type T1 = NoExcessNonEmpty<{ name: 'Alice' }, User> // ✓ Pass
type T2 = NoExcessNonEmpty<{}, User> // ✗ Fail - empty
type T3 = NoExcessNonEmpty<{ name: 'Bob'; age: 30 }, User> // ✗ Fail - excess
```

### HasOptionalKeys <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/predicates.ts#L12)</sub>

Check if an interface has any optional properties.

```typescript
export type HasOptionalKeys<$Obj extends object> = OptionalKeys<$Obj> extends
  never ? false : true
```

**Examples:**

```ts twoslash
type T2 = HasOptionalKeys<{ a: string }> // false
```

### OptionalKeys <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/predicates.ts#L23)</sub>

Extract keys that are optional in the interface.

```typescript
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]
```

**Examples:**

```ts twoslash
type Optional = OptionalKeys<Obj> // 'b' | 'c'
```

### RequiredKeys <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/predicates.ts#L36)</sub>

Extract keys that are required in the interface.

```typescript
export type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>
```

**Examples:**

```ts twoslash
type Required = RequiredKeys<Obj> // 'a'
```

### HasRequiredKeys <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/predicates.ts#L48)</sub>

Check if an interface has any required properties.

```typescript
export type HasRequiredKeys<$Obj extends object> = RequiredKeys<$Obj> extends
  never ? false : true
```

**Examples:**

```ts twoslash
type T2 = HasRequiredKeys<{ a?: string }> // false
type T3 = HasRequiredKeys<{ a: string; b?: number }> // true
```

### HasOptionalKey <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/predicates.ts#L59)</sub>

Check if a key is optional in an object.

```typescript
export type HasOptionalKey<$Object extends object, $Key extends keyof $Object> =
  undefined extends $Object[$Key] ? true
    : false
```

**Examples:**

```ts twoslash
type T2 = HasOptionalKey<{ a: string }, 'a'> // false
```

### IsKeyOptional <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/predicates.ts#L72)</sub>

Check if a key is optional in an object.

```typescript
export type IsKeyOptional<
  $T extends Undefined.Maybe<object>,
  $K extends string,
> = $K extends keyof $T ? ({} extends Pick<$T, $K> ? true : false)
  : false
```

**Examples:**

```ts twoslash
type T2 = IsKeyOptional<{ a: string }, 'a'> // false
type T3 = IsKeyOptional<{ a: string }, 'b'> // false
```

### HasKey <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/predicates.ts#L85)</sub>

Check if a key exists in an object.

```typescript
export type HasKey<$T extends object, $K extends string> = $K extends keyof $T
  ? true
  : false
```

**Examples:**

```ts twoslash
type T2 = HasKey<{ a: string }, 'b'> // false
```

### PropertySignature <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/obj/property-signature.ts#L1)</sub>

```typescript
export type PropertySignature = {
  name: string
  type: any
  optional: boolean
  optionalUndefined: boolean
}
```
