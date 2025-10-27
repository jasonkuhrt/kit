# Ts.Kind

Higher-kinded type utilities for TypeScript.

Provides type-level functions and utilities for simulating higher-kinded types in TypeScript, enabling more advanced type-level programming patterns.

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Kind
```

```typescript [Barrel]
import { Kind } from '@wollybeard/kit/ts'
```

:::

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PrivateKindReturn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L114" /> {#c-private-kind-return-114}

```typescript
typeof PrivateKindReturn
```

Private symbol for storing kind return type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PrivateKindParameters`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L120" /> {#c-private-kind-parameters-120}

```typescript
typeof PrivateKindParameters
```

Private symbol for storing kind parameters.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Apply`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L32" /> {#t-apply-32}

```typescript
type Apply<$Kind, $Args> =
  // @ts-expect-error - Intentional type manipulation for kind simulation
  ($Kind & { parameters: $Args })['return']
```

Higher-kinded type utilities for TypeScript.

Provides type-level functions and utilities for simulating higher-kinded types in TypeScript, enabling more advanced type-level programming patterns.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Kind`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L52" /> {#i-kind-52}

```typescript
interface Kind<$Params = unknown, $Return = unknown> {
  parameters: $Params
  return: $Return
}
```

Define a kind (higher-kinded type) function interface.

Provides a standard structure for defining type-level functions that can be applied using the Apply utility.

$Params

- The parameter types this kind accepts

$Return

- The return type this kind produces

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
interface BoxOf extends Kind<[unknown], Box<any>> {
  return: Box<this['parameters'][0]>
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Parameters`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L62" /> {#t-parameters-62}

```typescript
type Parameters<$Kind> = $Kind extends Kind<infer P, any> ? P : never
```

Extract the parameter types from a kind.

$Kind

- The kind to extract parameters from

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Return`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L69" /> {#t-return-69}

```typescript
type Return<$Kind> = $Kind extends Kind<any, infer R> ? R : never
```

Extract the return type from a kind.

$Kind

- The kind to extract return type from

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Identity`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L82" /> {#i-identity-82}

```typescript
interface Identity extends Kind {
  // @ts-expect-error
  return: this['parameters'][0]
}
```

Create a type-level identity function.

Returns the input type unchanged. Useful as a default or placeholder in kind compositions.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Same = Kind.Apply<Kind.Identity, [string]> // string
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Const`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L99" /> {#i-const-99}

```typescript
interface Const<$Const> extends Kind {
  return: $Const
}
```

Create a type-level constant function.

Always returns the same type regardless of input.

$Const

- The constant type to always return

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type AlwaysString = Kind.Apply<Kind.Const<string>, [number]> // string
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PrivateKindReturn`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L115" /> {#t-private-kind-return-115}

```typescript
type PrivateKindReturn = typeof PrivateKindReturn
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PrivateKindParameters`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L121" /> {#t-private-kind-parameters-121}

```typescript
type PrivateKindParameters = typeof PrivateKindParameters
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Private`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L138" /> {#i-private-138}

```typescript
interface Private {
  [PrivateKindReturn]: unknown
  [PrivateKindParameters]: unknown
}
```

Private kind interface using symbols instead of string keys.

This provides a more secure way to define higher-kinded types as the symbols cannot be accessed outside the module.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
interface BoxKind extends PrivateKind {
  // @ts-expect-error
  [PRIVATE_KIND_RETURN]: Box<this[PRIVATE_KIND_PARAMETERS][0]>
  [PRIVATE_KIND_PARAMETERS]: unknown
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PrivateApply`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L154" /> {#t-private-apply-154}

```typescript
type PrivateApply<$Kind extends Private, $Args> =
  ($Kind & { [PrivateKindParameters]: $Args })[PrivateKindReturn]
```

Apply arguments to a private kind.

$Kind

- The private kind to apply

$Args

- The arguments to apply

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type BoxOfString = PrivateKindApply<BoxKind, [string]> // Box<string>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `MaybePrivateApplyOr`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L157" /> {#t-maybe-private-apply-or-157}

```typescript
type MaybePrivateApplyOr<$MaybeKind, $Args, $Or> = $MaybeKind extends Private
  ? PrivateApply<$MaybeKind, $Args>
  : $Or
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsPrivateKind`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L173" /> {#t-is-private-kind-173}

```typescript
type IsPrivateKind<T> = T extends Private ? true : false
```

Check if a type is a private kind.

T

- The type to check

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Test1 = IsPrivateKind<BoxKind> // true
type Test2 = IsPrivateKind<string> // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Pipe`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L218" /> {#t-pipe-218}

```typescript
type Pipe<$Kinds extends readonly Kind[], $Input> = $Kinds extends readonly [
  infer __first__ extends Kind,
  ...infer __rest__ extends readonly Kind[],
] ? Pipe<__rest__, Apply<__first__, [$Input]>>
  : $Input
```

Apply a tuple of Kinds sequentially (left-to-right composition).

Takes an array of Kind functions and applies them in sequence from left to right. This enables composing multiple type-level transformations without creating specialized intermediate types.

**Application order**: Left-to-right (first Kind, then second, then third, etc.)

$Kinds

- Tuple of Kind functions to apply sequentially

$Input

- The initial type to transform

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Define some extractors
interface Awaited extends Kind {
  return: Awaited<this['parameters'][0]>
}

interface ArrayElement extends Kind {
  return: this['parameters'][0] extends (infer El)[] ? El : never
}

// Compose them: Promise<string[]> -> string[] -> string
type Result = Pipe<[Awaited, ArrayElement], Promise<string[]>>
// Result: string

// Compose three: () => Promise<number[]> -> Promise<number[]> -> number[] -> number
type Result2 = Pipe<
  [ReturnType, Awaited, ArrayElement],
  () => Promise<number[]>
>
// Result2: number
```
