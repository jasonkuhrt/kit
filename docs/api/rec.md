# Rec

Record utilities for working with plain JavaScript objects as dictionaries.

Provides type-safe operations for records (objects with PropertyKey indexes)
including type guards, merging, creation, and index signature manipulation.
Strictly validates plain objects, rejecting arrays and class instances.

## Import

```typescript
import { Rec } from '@wollybeard/kit/rec'
```

## Functions

### is <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L50)</sub>

```typescript
(value: unknown) => value is Any
```

### merge <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L97)</sub>

```typescript
;(<rec1 extends Any, rec2 extends Any>(rec1: rec1, rec2: rec2) => rec1 & rec2)
```

### create <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L169)</sub>

```typescript
;(<value>() => Record<PropertyKey, value>)
```

## Types

### Any <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L4)</sub>

```typescript
export type Any = AnyKeyTo<unknown>
```

### AnyReadonly <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L6)</sub>

```typescript
export type AnyReadonly = AnyReadonlyKeyTo<unknown>
```

### AnyKeyTo <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L8)</sub>

```typescript
export type AnyKeyTo<$Value> = {
  [key: PropertyKey]: $Value
}
```

### AnyReadonlyKeyTo <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L12)</sub>

```typescript
export type AnyReadonlyKeyTo<$Value> = {
  readonly [key: PropertyKey]: $Value
}
```

### Value <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L16)</sub>

```typescript
export type Value = {
  [key: PropertyKey]: Lang.Value
}
```

### Optional <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L101)</sub>

```typescript
export type Optional<$Key extends PropertyKey, $Value> = {
  [K in $Key]?: $Value
}
```

### RemoveIndex <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L115)</sub>

Remove index signatures from an object type.
Useful for converting Record types to object types with only known keys.

```typescript
export type RemoveIndex<$T> = {
  [k in keyof $T as string extends k ? never : number extends k ? never : k]:
    $T[k]
}
```

**Examples:**

```ts twoslash
type WithoutIndex = RemoveIndex<WithIndex> // { a: string; b: number }
```

### IsHasIndex <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/domains/rec/rec.ts#L129)</sub>

Check if a type has an index signature.

```typescript
export type IsHasIndex<$T, $Key extends PropertyKey = string> = $Key extends
  keyof $T ? true : false
```

**Examples:**

```ts twoslash
type T2 = IsHasIndex<{ a: string }> // false
type T3 = IsHasIndex<{ [key: number]: any }, number> // true
```
