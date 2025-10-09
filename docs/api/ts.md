# Ts

## Import

```typescript
import { Ts } from '@wollybeard/kit/ts'
```

## Namespaces

- [**Kind**](/api/ts/kind)
- [**Test**](/api/ts/test)
- [**Union**](/api/ts/union)

## Functions

### as

```typescript
as = <$value>(value?: unknown): $value => value as any
```

### isTypeWith

```typescript
isTypeWith = <reference>(reference: reference) => {
  return <valueGiven>(
    value: ValidateIsSupertype<reference, valueGiven>,
  ): value is reference extends valueGiven ? reference : never => {
    return value === reference as any
  }
}
```

### isntTypeWith

```typescript
isntTypeWith = <reference>(reference: reference) => {
  return <valueGiven>(
    value: ValidateIsSupertype<reference, valueGiven>,
  ): value is reference extends valueGiven ? Exclude<valueGiven, reference>
    : never =>
  {
    return value !== reference as any
  }
}
```

## Types

### Interpolatable

```typescript
export type Interpolatable =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol
  | object
  | unknown
  | any
  | never
```

### StaticError

```typescript
export interface StaticError<
  $Message extends string = string,
  $Context extends object = {},
  $Hint extends string = '(none)',
> {
  ERROR: $Message
  CONTEXT: $Context
  HINT: $Hint
}
```

### StaticErrorAny

```typescript
export type StaticErrorAny = StaticError<string, object, string>
```

### StaticErrorAssertion

```typescript
export interface StaticErrorAssertion<
  $Message extends string = string,
  $Expected = unknown,
  $Actual = unknown,
  $Tip extends string = never,
> {
  MESSAGE: $Message
  EXPECTED: $Expected
  ACTUAL: $Actual
  TIP: $Tip
}
```

### Show

```typescript
export type Show<$Type> = `\`${Print<$Type>}\``
```

### ShowInTemplate

```typescript
export type ShowInTemplate<$Type> = `'${Print<$Type>}'`
```

### Simplify

```typescript
export type Simplify<$Type> =
  & {
    [_ in keyof $Type]: $Type[_]
  }
  & unknown
```

### SimplifyNullable

```typescript
export type SimplifyNullable<$T> = null extends $T ? (Simplify<$T> & {}) | null
  : Simplify<$T> & {}
```

### ExtendsExact

```typescript
export type ExtendsExact<$Input, $Constraint> = $Input extends $Constraint
  ? $Constraint extends $Input ? $Input
  : never
  : never
```

### NotExtends

```typescript
export type NotExtends<$A, $B> = [$A] extends [$B] ? false : true
```

### Covariant

```typescript
export type Covariant<$T> = () => $T
```

### Contravariant

```typescript
export type Contravariant<$T> = (value: $T) => void
```

### Invariant

```typescript
export type Invariant<$T> = (value: $T) => $T
```

### Bivariant

```typescript
export type Bivariant<$T> = { bivariantHack(value: $T): void }['bivariantHack']
```

### Writeable

```typescript
export type Writeable<$Object> = {
  -readonly [k in keyof $Object]: $Object[k]
}
```

### IfExtendsElse

```typescript
export type IfExtendsElse<$Type, $Extends, $Then, $Else> = $Type extends
  $Extends ? $Then : $Else
```

### IntersectionIgnoreNeverOrAny

```typescript
export type IntersectionIgnoreNeverOrAny<$T> = IsAny<$T> extends true ? unknown
  : $T extends never ? unknown
  : $T
```

### NeverOrAnyToUnknown

```typescript
export type NeverOrAnyToUnknown<$T> = IsAny<$T> extends true ? unknown
  : $T extends never ? unknown
  : $T
```

### Narrowable

```typescript
export type Narrowable = string | number | bigint | boolean | []
```

### AnyAndUnknownToNever

```typescript
export type AnyAndUnknownToNever<$T> = IsAny<$T> extends true ? never
  : IsUnknown<$T> extends true ? never
  : $T
```

### Print

```typescript
export type Print<$Type, $Fallback extends string | undefined = undefined> =
  // Language base category types
  IsAny<$Type> extends true ? 'any'
    : IsUnknown<$Type> extends true ? 'unknown'
    : IsNever<$Type> extends true ? 'never'
    // Special union type boolean which we display as boolean insead of true | false
    : [$Type] extends [boolean]
      ? ([boolean] extends [$Type] ? 'boolean' : `${$Type}`)
    // General unions types
    : UnionToTuple<$Type> extends ArrMut.Any2OrMoreRO
      ? _PrintUnion<UnionToTuple<$Type>>
    // Primitive and literal types
    : $Type extends true ? 'true'
    : $Type extends false ? 'false'
    : $Type extends void ? ($Type extends undefined ? 'undefined' : 'void')
    : $Type extends string ? (string extends $Type ? 'string' : `'${$Type}'`)
    : $Type extends number ? (number extends $Type ? 'number' : `${$Type}`)
    : $Type extends bigint ? (bigint extends $Type ? 'bigint' : `${$Type}n`)
    : $Type extends null ? 'null'
    : $Type extends undefined ? 'undefined'
    // User-provided fallback takes precedence if type is not a primitive
    : $Fallback extends string ? $Fallback
    // Common object types and specific generic patterns
    : $Type extends Promise<infer T> ? `Promise<${Print<T>}>`
    : $Type extends (infer T)[] ? `Array<${Print<T>}>`
    : $Type extends readonly (infer T)[] ? `ReadonlyArray<${Print<T>}>`
    : $Type extends Date ? 'Date'
    : $Type extends RegExp ? 'RegExp'
    //
    : $Type extends Function ? 'Function'
    : $Type extends symbol ? 'symbol'
    // General object fallback
    : $Type extends object ? 'object'
    // Ultimate fallback
    : '?'
```

### _PrintUnion

```typescript
export type _PrintUnion<$Type extends ArrMut.AnyRO> = $Type extends
  readonly [infer __first__, ...infer __rest__ extends ArrMut.Any1OrMoreRO]
  ? `${Print<__first__>} | ${_PrintUnion<__rest__>}`
  : $Type extends readonly [infer __first__] ? `${Print<__first__>}`
  : $Type extends ArrMut.EmptyRO ? ''
  : never
```
