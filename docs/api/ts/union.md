# Ts.Union

_Ts_ / **Union**

Valid values for discriminant properties in tagged unions.

## Import

```typescript
import { Ts } from '@wollybeard/kit/ts'

// Access via namespace
Ts.Union.someFunction()
```

## Types

### DiscriminantPropertyValue <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L4)</sub>

Valid values for discriminant properties in tagged unions.

```typescript
export type DiscriminantPropertyValue = string | number | symbol
```

### **FORCE_DISTRIBUTION** <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L37)</sub>

Marker type to make forced union distribution explicit and self-documenting.

TypeScript distributes unions in conditional types when the checked type is a naked type parameter.
Using this marker in your conditional type makes the intent explicit to readers.

```typescript
export type __FORCE_DISTRIBUTION__ = any
```

**Examples:**

```ts twoslash
type Transform<T> = T extends string ? Uppercase<T> : T

// With marker - explicitly documents that distribution is desired
type Transform<T> = T extends __FORCE_DISTRIBUTION__
  ? T extends string ? Uppercase<T> : T
  : never

// More typical usage pattern
type MapUnion<T> = T extends __FORCE_DISTRIBUTION__ ? TransformSingleMember<T>
  : never
```

```ts twoslash
type AddPrefix<T> = T extends __FORCE_DISTRIBUTION__
  ? T extends string ? `prefix_${T}` : T
  : never

type Result = AddPrefix<'a' | 'b' | 'c'>
// 'prefix_a' | 'prefix_b' | 'prefix_c'
```

### Include <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L49)</sub>

Include only types that extend a constraint (opposite of Exclude).
Filters a union type to only include members that extend the constraint.

```typescript
export type Include<$T, $U> = $T extends $U ? $T : never
```

**Examples:**

```ts twoslash
type T2 = Union.Include<'a' | 'b' | 1 | 2, string> // 'a' | 'b'
```

### ToTuple <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L59)</sub>

Convert a union type to a tuple type.

```typescript
export type ToTuple<
  $Union,
  ___L = LastOf<$Union>,
  ___N = [$Union] extends [never] ? true : false,
> = true extends ___N ? []
  : [...ToTuple<Exclude<$Union, ___L>>, ___L]
```

**Examples:**

```ts twoslash
```

### ToIntersection <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L75)</sub>

Convert a union type to an intersection type.

```typescript
export type ToIntersection<$U> =
  ($U extends any ? (k: $U) => void : never) extends ((k: infer __i__) => void)
    ? __i__
    : never
```

**Examples:**

```ts twoslash
type I = Union.ToIntersection<U> // { a: string } & { b: number }
```

### LastOf <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L86)</sub>

Get the last type in a union.

```typescript
export type LastOf<$T> =
  ToIntersection<$T extends any ? () => $T : never> extends () => infer __r__
    ? __r__
    : never
```

**Examples:**

```ts twoslash
```

### Expanded <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L97)</sub>

Force union distribution in conditional types.

```typescript
export type Expanded<$Union> = $Union
```

**Examples:**

```ts twoslash
```

### IgnoreAnyOrUnknown <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L102)</sub>

Union that ignores any and unknown.

```typescript
export type IgnoreAnyOrUnknown<$T> = unknown extends $T ? never : $T
```

### IsAnyMemberExtends <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L114)</sub>

Check if any member of a union extends a type.

```typescript
export type IsAnyMemberExtends<$Union, $Type> = (
  // [1] Force distribution
  $Union extends any ? ($Union /* member */ extends $Type ? true : false)
    : never // [1]
) extends false ? false
  : true
```

**Examples:**

```ts twoslash
type T2 = Union.IsAnyMemberExtends<number | boolean, string> // false
```

### IsHas <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L162)</sub>

Checks if a union type contains a specific type.

Returns `true` if any member of the union type extends the target type,
`false` otherwise. This is useful for conditional type logic based on
union membership.

```typescript
export type IsHas<$Type, $LookingFor> = _IsHas<$Type, $LookingFor> extends false
  ? false
  : true
```

**Examples:**

```ts twoslash
type HasDate = Union.IsHas<string | number, Date> // false
type HasLiteral = Union.IsHas<'a' | 'b' | 'c', 'b'> // true

// Useful in conditional types
type ProcessValue<T> = Union.IsHas<T, Promise<any>> extends true ? 'async'
  : 'sync'

type R1 = ProcessValue<string | Promise<string>> // 'async'
type R2 = ProcessValue<string | number> // 'sync'
```

```ts twoslash
type Events = { type: 'click' } | { type: 'hover' } | { type: 'focus' }
type HasClick = Union.IsHas<Events, { type: 'click' }> // true

// Check for any promise in union
type MaybeAsync<T> = Union.IsHas<T, Promise<any>>
type R3 = MaybeAsync<string | Promise<number>> // true
type R4 = MaybeAsync<string | number> // false
```

### Merge <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/union.ts#L182)</sub>

Merge all members of a union into a single type.

```typescript
export type Merge<$U> = {
  [
    k in (
      $U extends any ? keyof $U : never
    )
  ]: $U extends any ? (k extends keyof $U ? $U[k] : never) : never
}
```

**Examples:**

```ts twoslash
type M = Union.Merge<U> // { a: string; b: number }
```
