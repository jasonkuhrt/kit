# Ts.Union

_Ts_ / **Union**

Valid values for discriminant properties in tagged unions.

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Union.someFunction()
```

```typescript [Barrel]
import * as Ts from '@wollybeard/kit/ts'

// Access via namespace
Ts.Union.someFunction()
```

:::

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `DiscriminantPropertyValue`

```typescript
type DiscriminantPropertyValue = string | number | symbol
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L4" />

Valid values for discriminant properties in tagged unions.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `__FORCE_DISTRIBUTION__`

```typescript
type __FORCE_DISTRIBUTION__ = any
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L37" />

Marker type to make forced union distribution explicit and self-documenting.

TypeScript distributes unions in conditional types when the checked type is a naked type parameter. Using this marker in your conditional type makes the intent explicit to readers.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Without marker - unclear if distribution is intentional
type Transform<T> = T extends string ? Uppercase<T> : T

// With marker - explicitly documents that distribution is desired
type Transform<T> = T extends __FORCE_DISTRIBUTION__ ? T extends string ? Uppercase<T> : T : never

// More typical usage pattern
type MapUnion<T> = T extends __FORCE_DISTRIBUTION__
  ? TransformSingleMember<T>
  : never
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Real-world example: mapping over union members
type AddPrefix<T> = T extends __FORCE_DISTRIBUTION__
  ? T extends string ? `prefix_${T}` : T
  : never

type Result = AddPrefix<'a' | 'b' | 'c'>
// 'prefix_a' | 'prefix_b' | 'prefix_c'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Include`

```typescript
type Include<$T, $U> = $T extends $U ? $T : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L49" />

Include only types that extend a constraint (opposite of Exclude). Filters a union type to only include members that extend the constraint.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type T = Union.Include<string | number | boolean, string | number>  // string | number
type T2 = Union.Include<'a' | 'b' | 1 | 2, string>  // 'a' | 'b'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ToTuple`

```typescript
type ToTuple<
  $Union,
  ___L = LastOf<$Union>,
  ___N = [$Union] extends [never] ? true : false,
> = true extends ___N ? []
  : [...ToTuple<Exclude<$Union, ___L>>, ___L]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L59" />

Convert a union type to a tuple type.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type T = Union.ToTuple<'a' | 'b' | 'c'>  // ['a', 'b', 'c']
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ToIntersection`

```typescript
type ToIntersection<$U> = ($U extends any ? (k: $U) => void : never) extends ((k: infer __i__) => void) ? __i__
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L75" />

Convert a union type to an intersection type.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type U = { a: string } | { b: number }
type I = Union.ToIntersection<U>  // { a: string } & { b: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `LastOf`

```typescript
type LastOf<$T> = ToIntersection<$T extends any ? () => $T : never> extends () => infer __r__ ? __r__
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L86" />

Get the last type in a union.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type T = Union.LastOf<'a' | 'b' | 'c'>  // 'c'
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Expanded`

```typescript
type Expanded<$Union> = $Union
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L97" />

Force union distribution in conditional types.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type T = Union.Expanded<'a' | 'b'>  // 'a' | 'b' (forced distribution)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IgnoreAnyOrUnknown`

```typescript
type IgnoreAnyOrUnknown<$T> = unknown extends $T ? never : $T
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L102" />

Union that ignores any and unknown.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsAnyMemberExtends`

```typescript
type IsAnyMemberExtends<$Union, $Type> =
  (
    // [1] Force distribution
    $Union extends any ?
    ($Union /* member */ extends $Type ? true : false) :
    never // [1]
  ) extends false
  ? false
  : true
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L114" />

Check if any member of a union extends a type.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type T1 = Union.IsAnyMemberExtends<string | number, string>  // true
type T2 = Union.IsAnyMemberExtends<number | boolean, string>  // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsHas`

```typescript
type IsHas<$Type, $LookingFor> =
  _IsHas<$Type, $LookingFor> extends false
  ? false
  : true
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L162" />

Checks if a union type contains a specific type.

Returns `true` if any member of the union type extends the target type, `false` otherwise. This is useful for conditional type logic based on union membership.

$Type

- The union type to search within

$LookingFor

- The type to search for

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type HasString = Union.IsHas<string | number | boolean, string>  // true
type HasDate = Union.IsHas<string | number, Date>                // false
type HasLiteral = Union.IsHas<'a' | 'b' | 'c', 'b'>             // true

// Useful in conditional types
type ProcessValue<T> = Union.IsHas<T, Promise<any>> extends true
  ? 'async'
  : 'sync'

type R1 = ProcessValue<string | Promise<string>>  // 'async'
type R2 = ProcessValue<string | number>           // 'sync'
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Works with complex types
type Events = { type: 'click' } | { type: 'hover' } | { type: 'focus' }
type HasClick = Union.IsHas<Events, { type: 'click' }>  // true

// Check for any promise in union
type MaybeAsync<T> = Union.IsHas<T, Promise<any>>
type R3 = MaybeAsync<string | Promise<number>>  // true
type R4 = MaybeAsync<string | number>           // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Merge`

```typescript
type Merge<$U> = {
  [
  k in (
    $U extends any ? keyof $U : never
  )
  ]: $U extends any ? (k extends keyof $U ? $U[k] : never) : never
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L182" />

Merge all members of a union into a single type.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type U = { a: string } | { b: number }
type M = Union.Merge<U>  // { a: string; b: number }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Is`

```typescript
type Is<$Type> =
  [$Type] extends [never] ? false :
  [$Type] extends [ToIntersection<$Type>] ? false :
  true
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/union.ts#L231" />

Check if a type is a union type.

Returns `true` if the type is a union with multiple members, `false` if it's a single type or `never`. This is useful for conditional type logic that needs to handle unions differently from single types.

The check works by: 1. First checking if the type is `never` (not a union) 2. Then checking if converting the type to an intersection yields the same type

(single types remain unchanged when converted to intersection, unions do not)

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Union types return true
type T1 = Union.Is<string | number>              // true
type T2 = Union.Is<'a' | 'b' | 'c'>             // true
type T3 = Union.Is<{ a: 1 } | { b: 2 }>         // true

// Single types return false
type T4 = Union.Is<string>                       // false
type T5 = Union.Is<number>                       // false
type T6 = Union.Is<{ a: string }>               // false

// Special cases
type T7 = Union.Is<never>                        // false
type T8 = Union.Is<any>                          // false
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Conditional logic based on union detection
type ProcessType<T> = Union.Is<T> extends true
  ? 'multiple options'
  : 'single option'

type R1 = ProcessType<string | number>  // 'multiple options'
type R2 = ProcessType<string>           // 'single option'
```
