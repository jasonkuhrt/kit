# Ts.Kind

_Ts_ / **Kind**

Higher-kinded type utilities for TypeScript.

Provides type-level functions and utilities for simulating higher-kinded
types in TypeScript, enabling more advanced type-level programming patterns.

@module

## Import

```typescript
import { Ts } from '@wollybeard/kit/ts'

// Access via namespace
Ts.Kind.someFunction()
```

## Constants

### PrivateKindReturn <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L114)</sub>

```typescript
typeof PrivateKindReturn
```

### PrivateKindParameters <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L120)</sub>

```typescript
typeof PrivateKindParameters
```

## Types

### Apply <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L32)</sub>

Higher-kinded type utilities for TypeScript.

Provides type-level functions and utilities for simulating higher-kinded
types in TypeScript, enabling more advanced type-level programming patterns.

```typescript
export type Apply<$Kind, $Args> =
  // @ts-expect-error - Intentional type manipulation for kind simulation
  ($Kind & { parameters: $Args })['return']
```

### Kind <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L52)</sub>

Define a kind (higher-kinded type) function interface.

Provides a standard structure for defining type-level functions
that can be applied using the Apply utility.

```typescript
export interface Kind<$Params = unknown, $Return = unknown> {
  readonly parameters: $Params
  readonly return: $Return
}
```

**Examples:**

```ts twoslash
return: Box<this['parameters'][0]>
}
```

### Parameters <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L62)</sub>

Extract the parameter types from a kind.

```typescript
export type Parameters<$Kind> = $Kind extends Kind<infer P, any> ? P : never
```

### Return <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L69)</sub>

Extract the return type from a kind.

```typescript
export type Return<$Kind> = $Kind extends Kind<any, infer R> ? R : never
```

### Identity <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L82)</sub>

Create a type-level identity function.

Returns the input type unchanged. Useful as a default or
placeholder in kind compositions.

```typescript
export interface Identity extends Kind {
  // @ts-expect-error
  return: this['parameters'][0]
}
```

**Examples:**

```ts twoslash
```

### Const <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L99)</sub>

Create a type-level constant function.

Always returns the same type regardless of input.

```typescript
export interface Const<$Const> extends Kind {
  return: $Const
}
```

**Examples:**

```ts twoslash
```

### Private <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L138)</sub>

Private kind interface using symbols instead of string keys.

This provides a more secure way to define higher-kinded types
as the symbols cannot be accessed outside the module.

```typescript
export interface Private {
  [PrivateKindReturn]: unknown
  [PrivateKindParameters]: unknown
}
```

**Examples:**

````typescript twoslash
```ts
interface BoxKind extends PrivateKind {
  //
````

### PrivateApply <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L154)</sub>

Apply arguments to a private kind.

```typescript
export type PrivateApply<$Kind extends Private, $Args> =
  ($Kind & { [PrivateKindParameters]: $Args })[PrivateKindReturn]
```

**Examples:**

```ts twoslash
```

### MaybePrivateApplyOr <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L157)</sub>

```typescript
export type MaybePrivateApplyOr<$MaybeKind, $Args, $Or> = $MaybeKind extends
  Private ? PrivateApply<$MaybeKind, $Args>
  : $Or
```

### IsPrivateKind <sub style="float: right;">[📄](https://github.com/jasonkuhrt/kit/blob/main/src/utils/ts/kind.ts#L173)</sub>

Check if a type is a private kind.

```typescript
export type IsPrivateKind<T> = T extends Private ? true : false
```

**Examples:**

```ts twoslash
type Test2 = IsPrivateKind<string> // false
```
