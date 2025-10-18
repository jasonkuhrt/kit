# Ts.SimpleSignature

Utilities for working with the `__simpleSignature` phantom type pattern.

This pattern allows functions with complex generic signatures to provide a simpler signature for type inference in contexts like testing or documentation.

SimpleSignature

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.SimpleSignature.someFunction()
```

```typescript [Barrel]
import { SimpleSignature } from '@wollybeard/kit/ts'

// Access via direct import
SimpleSignature.someFunction()
```

:::

## Functions

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `implement`

```typescript
<$Fn>(impl: GetSignature<$Fn>): $Fn
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/simple-signature.ts#L157" />

**Parameters:**

- `impl` - Implementation function typed with the simple signature

**Returns:** The implementation cast to the full function type

Helper to implement a function with a simple signature for inference.

This allows you to write the implementation using the simple signature types while the returned function has the full complex signature.

$Fn

- The full function interface (with complex generics)

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
interface PartitionFn extends SimpleSignature<[
  (obj: object, keys: string[]) => { picked: object; omitted: object }
]> {
  <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): { picked: Pick<T, K>; omitted: Omit<T, K> }
}

export const partition = implement<PartitionFn>((obj, pickedKeys) => {
  // Implementation typed with simple signature: object and string[]
  return { picked: {}, omitted: { ...obj } }
})
```

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `symbol`

```typescript
typeof symbol
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/simple-signature.ts#L25" />

Utilities for working with the `__simpleSignature` phantom type pattern.

This pattern allows functions with complex generic signatures to provide a simpler signature for type inference in contexts like testing or documentation.

SimpleSignature

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `SimpleSignature`

```typescript
interface SimpleSignature<
  $Overloads extends readonly [(...args: any[]) => any, ...Array<(...args: any[]) => any>],
> {
  [symbol]: $Overloads[number]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/simple-signature.ts#L60" />

Helper interface for defining simple signatures with overloads.

Use this to define multiple overload signatures in a type-safe way. The type parameter accepts a tuple of function signatures.

$Overloads

- Tuple of function signature types

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
interface MyFunctionType extends SimpleSignature<[
  (x: string) => number,
  (x: number) => string,
  (x: boolean) => boolean
]> {
  // Your complex generic signature
  <T extends string | number | boolean>(x: T): ComplexType<T>
}
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Single overload (most common case)
interface PartitionFn extends SimpleSignature<[
  (obj: object, keys: string[]) => { picked: object; omitted: object }
]> {
  <T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): { picked: Pick<T, K>; omitted: Omit<T, K> }
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GetSignature`

```typescript
type GetSignature<$fn> = $fn extends { [symbol]: infer $sig } ? $sig : $fn
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/simple-signature.ts#L88" />

Extract the signature from a function, preferring `__simpleSignature` if available.

If the function has a `__simpleSignature` property, returns that type. Otherwise, returns the function's actual type unchanged.

$fn

- The function type to extract from

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Function without __simpleSignature
type Fn1 = (a: string, b: number) => boolean
type Result1 = GetSignature<Fn1>  // (a: string, b: number) => boolean

// Function with __simpleSignature
declare const partition: {
  <T extends object, K extends keyof T>(obj: T, keys: K[]): { picked: Pick<T, K>; omitted: Omit<T, K> }
  [__simpleSignature]: (obj: object, keys: string[]) => { picked: object; omitted: object }
}
type Result2 = GetSignature<typeof partition>  // (obj: object, keys: string[]) => { picked: object; omitted: object }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GetParameters`

```typescript
type GetParameters<$fn> = GetSignature<$fn> extends (...args: any) => any ? Parameters<GetSignature<$fn>>
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/simple-signature.ts#L107" />

Extract parameters from a function, using `__simpleSignature` if available.

$fn

- The function type to extract parameters from

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Params1 = GetParameters<(a: string, b: number) => void>  // [a: string, b: number]

// With __simpleSignature
declare const partition: {
  <T extends object, K extends keyof T>(obj: T, keys: K[]): any
  [__simpleSignature]: (obj: object, keys: string[]) => any
}
type Params2 = GetParameters<typeof partition>  // [obj: object, keys: string[]]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `GetReturnType`

```typescript
type GetReturnType<$fn> = GetSignature<$fn> extends (...args: any) => any ? ReturnType<GetSignature<$fn>>
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/simple-signature.ts#L127" />

Extract return type from a function, using `__simpleSignature` if available.

$fn

- The function type to extract return type from

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Return1 = GetReturnType<(a: string) => number>  // number

// With __simpleSignature
declare const partition: {
  <T extends object, K extends keyof T>(obj: T, keys: K[]): { picked: Pick<T, K>; omitted: Omit<T, K> }
  [__simpleSignature]: (obj: object, keys: string[]) => { picked: object; omitted: object }
}
type Return2 = GetReturnType<typeof partition>  // { picked: object; omitted: object }
```
