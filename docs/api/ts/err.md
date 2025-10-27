# Ts.Err

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Err
```

```typescript [Barrel]
import { Err } from '@wollybeard/kit/ts'
```

:::

## Error Messages

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `StaticErrorLike`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/err.ts#L32" /> {#i-static-error-like-32}

```typescript
interface StaticErrorLike<$Message extends string = string> {
  ERROR_________: $Message
}
```

Structural interface for all static type-level errors.

All type-level error types must extend this interface by having an `ERROR_________` field and a `HIERARCHY___` field for hierarchical categorization. This allows error detection via structural typing and enables selective preservation.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Check if a type is an error
type IsError<$T> = $T extends StaticErrorLike ? true : false

// Pass through errors in type transformations
type Transform<$T> = $T extends StaticErrorLike ? $T : ActualTransform<$T>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `StaticError`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/err.ts#L92" /> {#t-static-error-92}

```typescript
type StaticError<
  $Message extends string = string,
  $Meta extends Record<string, any> = {},
  $Hierarchy extends readonly string[] = readonly ['root', ...string[]],
  ___$Obj = StaticErrorLike<$Message> & $Meta & { HIERARCHY___: $Hierarchy }
> = Simplify.Top<{
  [k in keyof ___$Obj
  as k extends string
  ? PadKeyTo14<k>
  : k
  ]: ___$Obj[k]
}>
```

General-purpose static type-level error with flexible metadata.

This is the base error type for creating custom error messages at the type level. For assertion-specific errors with expected/actual fields, use StaticErrorAssertion.

The error message and metadata fields are automatically padded to align keys for better readability.

$Message

- A string literal type describing the error

$Meta

- Optional metadata object with custom fields

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Simple error with just a message
type E1 = StaticError<'Invalid operation'>
// { ERROR_________: 'Invalid operation' }

// Error with metadata
type E2 = StaticError<'Key not found', { key: 'foo'; available: ['bar', 'baz'] }>
// {
//   ERROR_________: 'Key not found'
//   key___________: 'foo'
//   available_____: ['bar', 'baz']
// }
```

## Error Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Is`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/err.ts#L133" /> {#t-is-133}

```typescript
type Is<$T> = $T extends StaticErrorLike ? true : false
```

Check if a type is a static error.

This type distributes over unions, checking each member.

$T

- The type to check

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type A = Is<StaticError<'msg'>>  // true
type B = Is<string>  // false
type C = Is<{ ERROR_________: 'msg' }>  // true (structural)
type D = Is<string | StaticError<'msg'>>  // boolean (distributes: false | true)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Render`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/err.ts#L159" /> {#t-render-159}

```typescript
type Render<$Error extends StaticErrorLike> =
  KitLibrarySettings.Ts.Error['renderErrors'] extends false
  ? $Error['ERROR_________']
  : $Error
```

Renders an error based on the `renderErrors` setting.

When `renderErrors` is `true` (default), returns the full error object. When `false`, extracts just the error message string for cleaner IDE hovers.

Uses the generic KitLibrarySettings.Ts.Error.renderErrors setting.

$Error

- The full StaticErrorLike object or error type

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// With renderErrors: true (default)
type E = Render<StaticError<'msg', { key: 'value' }>>
// { ERROR_________: 'msg', key___________: 'value' }

// With renderErrors: false
type E = Render<StaticError<'msg', { key: 'value' }>>
// 'msg'
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `CROSS`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/err.ts#L178" /> {#c-cross-178}

```typescript
"✕"
```

Cross mark

- indicates an error or type mismatch occurred. Used in error messages to denote failures or incompatibilities.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `WARNING`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/err.ts#L184" /> {#c-warning-184}

```typescript
"⚠"
```

Warning sign

- indicates a potential issue or cautionary note. Used when types are equivalent but not structurally exact.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `LIGHTNING`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/err.ts#L190" /> {#c-lightning-190}

```typescript
"⚡"
```

Lightning bolt

- indicates type coercion or transformation. Used when automatic type conversions occur.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `EXCLUSION`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/err.ts#L196" /> {#c-exclusion-196}

```typescript
"⊘"
```

Exclusion symbol

- indicates type exclusion or prohibition. Used when certain types are explicitly not allowed.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `EMPTY_SET`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/err.ts#L202" /> {#c-empty_set-202}

```typescript
"∅"
```

Empty set

- indicates an empty type or no valid values. Used when a type has no inhabitants (like never in certain contexts).
