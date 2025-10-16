# Ts.Kind

_Ts_ / **Kind**

Higher-kinded type utilities for TypeScript.

Provides type-level functions and utilities for simulating higher-kinded types in TypeScript, enabling more advanced type-level programming patterns.

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Kind.someFunction()
```

```typescript [Barrel]
import * as Ts from '@wollybeard/kit/ts'

// Access via namespace
Ts.Kind.someFunction()
```

:::

## Constants

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PrivateKindReturn`

```typescript
typeof PrivateKindReturn
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L114" />

Private symbol for storing kind return type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `PrivateKindParameters`

```typescript
typeof PrivateKindParameters
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L120" />

Private symbol for storing kind parameters.

## Types

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Apply`

```typescript
type Apply<$Kind, $Args> =
  // @ts-expect-error - Intentional type manipulation for kind simulation
  ($Kind & { parameters: $Args })['return']
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L32" />

Higher-kinded type utilities for TypeScript.

Provides type-level functions and utilities for simulating higher-kinded types in TypeScript, enabling more advanced type-level programming patterns.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Kind`

```typescript
interface Kind<$Params = unknown, $Return = unknown> {
  readonly parameters: $Params
  readonly return: $Return
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L52" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Parameters`

```typescript
type Parameters<$Kind> = $Kind extends Kind<infer P, any> ? P : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L62" />

Extract the parameter types from a kind.

$Kind

- The kind to extract parameters from

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Return`

```typescript
type Return<$Kind> = $Kind extends Kind<any, infer R> ? R : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L69" />

Extract the return type from a kind.

$Kind

- The kind to extract return type from

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Identity`

```typescript
interface Identity extends Kind {
  // @ts-expect-error
  return: this['parameters'][0]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L82" />

Create a type-level identity function.

Returns the input type unchanged. Useful as a default or placeholder in kind compositions.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Same = Kind.Apply<Kind.Identity, [string]> // string
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Const`

```typescript
interface Const<$Const> extends Kind {
  return: $Const
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L99" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `Private`

```typescript
interface Private {
  [PrivateKindReturn]: unknown
  [PrivateKindParameters]: unknown
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L138" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PrivateApply`

```typescript
type PrivateApply<$Kind extends Private, $Args> =
  ($Kind & { [PrivateKindParameters]: $Args })[PrivateKindReturn]
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L154" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `MaybePrivateApplyOr`

```typescript
type MaybePrivateApplyOr<$MaybeKind, $Args, $Or> = $MaybeKind extends Private
  ? PrivateApply<$MaybeKind, $Args>
  : $Or
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L157" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsPrivateKind`

```typescript
type IsPrivateKind<T> = T extends Private ? true : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/kind.ts#L173" />

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
