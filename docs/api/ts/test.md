# Ts.Test

_Ts_ / **Test**

Type-level assertion utilities for testing type correctness.

## Choosing the Right Assertion

**Structural Equality (

exact

)**: Use when types must be structurally identical

```ts
exact<string, string> // ✓ Pass
exact<1 | 2, 2 | 1> // ✓ Pass (union order doesn't affect structure)
exact<string & {}, string> // ✗ Fail (different structure)
```

**Mutual Assignability (

equiv

)**: Use for semantically equal types

```ts
equiv<1 | 2, 2 | 1> // ✓ Pass (same computed type)
equiv<string & {}, string> // ✓ Pass (both compute to string)
equiv<string, number> // ✗ Fail (not mutually assignable)
```

**Subtype Checking (

sub

)**: Use when actual must extend expected

```ts
sub<string, 'hello'> // ✓ Pass ('hello' extends string)
sub<object, { a: 1 }> // ✓ Pass (more specific extends less specific)
sub<'hello', string> // ✗ Fail (string doesn't extend 'hello')
```

**Excess Property Detection**: Add

NoExcess

suffix to catch typos

```ts
sub<Config>()({ id: true, extra: 1 }) // ✓ Pass (sub allows excess)
subNoExcess<Config>()({ id: true, extra: 1 }) // ✗ Fail (catches typo!)
```

**Negative Assertions (

Not

)**: Assert types are NOT related

```ts
Not.exact<string, number> // ✓ Pass (they're different)
Not.sub<number, string> // ✓ Pass (string doesn't extend number)
Not.promise<number> // ✓ Pass (number is not a Promise)
```

## Configuration

Assertion behavior can be configured via global settings.

See

KitLibrarySettings.Ts.Test.Settings

for available options.

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Test.someFunction()
```

```typescript [Barrel]
import * as Ts from '@wollybeard/kit/ts'

// Access via namespace
Ts.Test.someFunction()
```

:::

## Namespaces

- [**`Not`**](/api/ts/test/not) - Namespace for negative assertions - asserting that types are NOT related in specific ways.

## Error Messages

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `StaticErrorAssertion`

```typescript
interface StaticErrorAssertion<
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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/helpers.ts#L192" />

Represents a static assertion error at the type level, optimized for type testing.

This is a simpler, more focused error type compared to

StaticError

. It's specifically

designed for type assertions where you need to communicate expected vs. actual types.

$Message

- A string literal type describing the assertion failure

$Expected

- The expected type

$Actual

- The actual type that was provided

$Tip

- Optional tip for resolving the error

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Using in parameter assertions
function assertParameters<T extends readonly any[]>(
  fn: Parameters<typeof fn> extends T ? typeof fn
    : StaticErrorAssertion<
      'Parameters mismatch',
      T,
      Parameters<typeof fn>
    >,
): void {}

// Error shows:
// MESSAGE: 'Parameters mismatch'
// EXPECTED: [string, number]
// ACTUAL: [number, string]
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `exact`

```typescript
type exact<$Expected, $Actual> = Apply<ExactKind, [$Expected, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/exact.ts#L64" />

Assert that two types are exactly equal (structurally).

Uses a conditional type inference trick to check exact structural equality,

correctly handling any, never, and unknown edge cases.

This checks for structural equality

- types must have the same structure,

not just compute to the same result. For mutual assignability, use

equiv

.

When types are equivalent but not exact (mutually assignable), provides a helpful

error suggesting to use equiv(). For other mismatches, TypeScript's native error

messages show the specific structural differences.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.exact<string, string>, // ✓ Pass
  Ts.Test.exact<string | number, string>, // ✗ Fail - TypeScript shows mismatch
  Ts.Test.exact<{ a: 1 }, { a: 1 }>, // ✓ Pass
  Ts.Test.exact<any, unknown>, // ✗ Fail - TypeScript shows mismatch
  Ts.Test.exact<1 | 2, 2 | 1> // ✗ Fail with tip - types are equivalent but not structurally equal
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `exactConst`

```typescript
ConstAssertionFn<ExactKind>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/exact.ts#L113" />

Assert that a value exactly equals the expected type, using const to preserve literal types.

This eliminates the need for

as

casts when testing with literal values.

Related:

exact

(non-const variant)

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Without const - requires cast
Ts.Test.exact<{ a: 1 }>()({ a: 1 } as { a: 1 })

// With const - no cast needed!
Ts.Test.exactConst<{ a: 1 }>()({ a: 1 })

// Works with any literal type
Ts.Test.exactConst<'hello'>()('hello')
Ts.Test.exactConst<42>()(42)
Ts.Test.exactConst<true>()(true)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `exactType`

```typescript
type exact<$Expected, $Actual> = Apply<ExactKind, [$Expected, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/exact.ts#L64" />

Assert that two types are exactly equal (structurally).

Uses a conditional type inference trick to check exact structural equality,

correctly handling any, never, and unknown edge cases.

This checks for structural equality

- types must have the same structure,

not just compute to the same result. For mutual assignability, use

equiv

.

When types are equivalent but not exact (mutually assignable), provides a helpful

error suggesting to use equiv(). For other mismatches, TypeScript's native error

messages show the specific structural differences.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.exact<string, string>, // ✓ Pass
  Ts.Test.exact<string | number, string>, // ✗ Fail - TypeScript shows mismatch
  Ts.Test.exact<{ a: 1 }, { a: 1 }>, // ✓ Pass
  Ts.Test.exact<any, unknown>, // ✗ Fail - TypeScript shows mismatch
  Ts.Test.exact<1 | 2, 2 | 1> // ✗ Fail with tip - types are equivalent but not structurally equal
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equiv`

```typescript
type equiv<$Expected, $Actual> = Apply<EquivKind, [$Expected, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/equiv.ts#L95" />

Assert that two types are equivalent (mutually assignable).

This checks that types are mutually assignable (A extends B and B extends A),

which means they compute to the same result even if their structure differs.

Use this when you care about semantic equality rather than structural equality.

For strict structural equality, use

exact

.

**Linting:** When

KitLibrarySettings.Ts.Test.Settings.lintBidForExactPossibility

is

true

,

this will show an error if

exact

would work, encouraging use of the stricter assertion.

See module documentation for configuration example.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equiv<string, string>, // ✓ Pass (or error if linting enabled - should use exact)
  Ts.Test.equiv<1 | 2, 2 | 1>, // ✓ Pass (or error if linting enabled - should use exact)
  Ts.Test.equiv<string & {}, string>, // ✓ Pass - both compute to string (exact would fail)
  Ts.Test.equiv<string, number> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `equivConst`

```typescript
ConstAssertionFn<EquivConstKind>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/equiv.ts#L194" />

Assert that a value is equivalent (mutually assignable) with the expected type, using const to preserve literal types.

This eliminates the need for

as

casts when testing with literal values.

Unlike

equiv

, this also accepts subtypes, which is needed for const assertions

with literals (e.g., literal 1 is a subtype of union 1 | 2).

Related:

equiv

(non-const variant)

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Without const - requires cast for exact match
Ts.Test.equiv<1 | 2>()(1 as 1 | 2)

// With const - no cast needed
Ts.Test.equivConst<1 | 2>()(1) // preserves literal 1

// Useful for union types
type Status = 'pending' | 'complete'
Ts.Test.equivConst<Status>()('pending') // keeps 'pending' literal
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equivNoExcess`

```typescript
type equivNoExcess<$Expected, $Actual> = Apply<
  EquivNoExcessKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/equiv.ts#L267" />

Assert that two types are equivalent (mutually assignable) AND have no excess properties.

Similar to

equiv

but also rejects excess properties in the actual type.

This is useful for catching typos or unintended properties in configuration objects

while still allowing types that compute to the same result.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Config = { id: boolean; name?: string }

type _ = Ts.Test.Cases<
  Ts.Test.equivNoExcess<Config, { id: true }>, // ✓ Pass
  Ts.Test.equivNoExcess<Config, { id: true; name: 'test' }>, // ✓ Pass - optional included
  Ts.Test.equivNoExcess<Config, { id: true; extra: 1 }> // ✗ Fail - excess property
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equivType`

```typescript
type equiv<$Expected, $Actual> = Apply<EquivKind, [$Expected, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/equiv.ts#L95" />

Assert that two types are equivalent (mutually assignable).

This checks that types are mutually assignable (A extends B and B extends A),

which means they compute to the same result even if their structure differs.

Use this when you care about semantic equality rather than structural equality.

For strict structural equality, use

exact

.

**Linting:** When

KitLibrarySettings.Ts.Test.Settings.lintBidForExactPossibility

is

true

,

this will show an error if

exact

would work, encouraging use of the stricter assertion.

See module documentation for configuration example.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equiv<string, string>, // ✓ Pass (or error if linting enabled - should use exact)
  Ts.Test.equiv<1 | 2, 2 | 1>, // ✓ Pass (or error if linting enabled - should use exact)
  Ts.Test.equiv<string & {}, string>, // ✓ Pass - both compute to string (exact would fail)
  Ts.Test.equiv<string, number> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equivNoExcessType`

```typescript
type equivNoExcess<$Expected, $Actual> = Apply<
  EquivNoExcessKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/equiv.ts#L267" />

Assert that two types are equivalent (mutually assignable) AND have no excess properties.

Similar to

equiv

but also rejects excess properties in the actual type.

This is useful for catching typos or unintended properties in configuration objects

while still allowing types that compute to the same result.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Config = { id: boolean; name?: string }

type _ = Ts.Test.Cases<
  Ts.Test.equivNoExcess<Config, { id: true }>, // ✓ Pass
  Ts.Test.equivNoExcess<Config, { id: true; name: 'test' }>, // ✓ Pass - optional included
  Ts.Test.equivNoExcess<Config, { id: true; extra: 1 }> // ✗ Fail - excess property
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `sub`

```typescript
type sub<$Expected, $Actual> = Apply<SubKind, [$Expected, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/sub.ts#L56" />

Assert that a type extends (is a subtype of) another type.

Equivalent to TypeScript's

extends

keyword: checks if

$Actual extends $Expected

.

This is useful for validating type relationships and narrowing.

For exact type equality (not just subtyping), use

exact

instead.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.sub<string, 'hello'>, // ✓ Pass - 'hello' extends string
  Ts.Test.sub<'hello', string>, // ✗ Fail - string doesn't extend 'hello'
  Ts.Test.sub<{ a: 1 }, { a: 1; b: 2 }>, // ✓ Pass - more specific extends less specific
  Ts.Test.sub<object, { a: 1 }> // ✓ Pass - { a: 1 } extends object
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `subConst`

```typescript
ConstAssertionFn<SubKind>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/sub.ts#L314" />

Assert that a value extends the expected type, using const to preserve literal types.

This eliminates the need for

as

casts when testing with literal values.

Related:

sub

(non-const variant)

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Without const - type may widen
sub<string>()('hello') // 'hello' widens to string

// With const - preserves literal
subConst<string>()('hello') // keeps 'hello' literal type

// Useful for object literals
subConst<{ a: number }>()({ a: 1 }) // preserves { readonly a: 1 }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `subNoExcess`

```typescript
type subNoExcess<$Expected, $Actual> = Apply<
  SubNoExcessKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/sub.ts#L169" />

Assert that a type extends the expected type AND has no excess properties.

Similar to

sub

but also rejects excess properties beyond those defined

in the expected type. This catches common bugs like typos in configuration objects

or accidentally passing extra properties.

This is particularly useful for:

- Validating configuration objects

- Checking function parameters that shouldn't have extra properties

- Testing that types don't have unexpected fields

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Config = { id: boolean; name?: string }

type _ = Ts.Test.Cases<
  Ts.Test.subNoExcess<Config, { id: true }>, // ✓ Pass
  Ts.Test.subNoExcess<Config, { id: true; name: 'test' }>, // ✓ Pass - optional included
  Ts.Test.subNoExcess<Config, { id: true; $skip: true }>, // ✗ Fail - excess property
  Ts.Test.subNoExcess<Config, { id: 'wrong' }> // ✗ Fail - wrong type
>
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Compare with .sub (allows excess):
type Q = { id: boolean }

type T1 = Ts.Test.sub<Q, { id: true; extra: 1 }> // ✓ Pass (sub allows excess)
type T2 = Ts.Test.subNoExcess<Q, { id: true; extra: 1 }> // ✗ Fail (subNoExcess rejects)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `subNot`

```typescript
type subNot<$NotExpected, $Actual> = Apply<SubNotKind, [$NotExpected, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/sub.ts#L264" />

Assert that a type does NOT extend another type.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.subNot<number, string>, // ✓ Pass
  Ts.Test.subNot<string, 'hello'> // ✗ Fail - 'hello' extends string
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `subType`

```typescript
type sub<$Expected, $Actual> = Apply<SubKind, [$Expected, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/sub.ts#L56" />

Assert that a type extends (is a subtype of) another type.

Equivalent to TypeScript's

extends

keyword: checks if

$Actual extends $Expected

.

This is useful for validating type relationships and narrowing.

For exact type equality (not just subtyping), use

exact

instead.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.sub<string, 'hello'>, // ✓ Pass - 'hello' extends string
  Ts.Test.sub<'hello', string>, // ✗ Fail - string doesn't extend 'hello'
  Ts.Test.sub<{ a: 1 }, { a: 1; b: 2 }>, // ✓ Pass - more specific extends less specific
  Ts.Test.sub<object, { a: 1 }> // ✓ Pass - { a: 1 } extends object
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `subNoExcessType`

```typescript
type subNoExcess<$Expected, $Actual> = Apply<
  SubNoExcessKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/sub.ts#L169" />

Assert that a type extends the expected type AND has no excess properties.

Similar to

sub

but also rejects excess properties beyond those defined

in the expected type. This catches common bugs like typos in configuration objects

or accidentally passing extra properties.

This is particularly useful for:

- Validating configuration objects

- Checking function parameters that shouldn't have extra properties

- Testing that types don't have unexpected fields

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Config = { id: boolean; name?: string }

type _ = Ts.Test.Cases<
  Ts.Test.subNoExcess<Config, { id: true }>, // ✓ Pass
  Ts.Test.subNoExcess<Config, { id: true; name: 'test' }>, // ✓ Pass - optional included
  Ts.Test.subNoExcess<Config, { id: true; $skip: true }>, // ✗ Fail - excess property
  Ts.Test.subNoExcess<Config, { id: 'wrong' }> // ✗ Fail - wrong type
>
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Compare with .sub (allows excess):
type Q = { id: boolean }

type T1 = Ts.Test.sub<Q, { id: true; extra: 1 }> // ✓ Pass (sub allows excess)
type T2 = Ts.Test.subNoExcess<Q, { id: true; extra: 1 }> // ✗ Fail (subNoExcess rejects)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `subNotType`

```typescript
type subNot<$NotExpected, $Actual> = Apply<SubNotKind, [$NotExpected, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/sub.ts#L264" />

Assert that a type does NOT extend another type.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.subNot<number, string>, // ✓ Pass
  Ts.Test.subNot<string, 'hello'> // ✗ Fail - 'hello' extends string
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `sup`

```typescript
type sup<$Supertype, $Actual> = Apply<SupKind, [$Supertype, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/sup.ts#L51" />

Assert that a type is a supertype of (i.e., extended by) another type.

Equivalent to TypeScript's

extends

keyword: checks if

$Actual extends $Supertype

.

This is the reverse parameter order of

sub

- the expected type is the supertype.

Less commonly used than

sub

- most cases should use

sub

with reversed parameters for clarity.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.sup<object, { a: 1 }>, // ✓ Pass - { a: 1 } extends object (object is supertype)
  Ts.Test.sup<{ a: 1 }, object>, // ✗ Fail - object doesn't extend { a: 1 }
  Ts.Test.sup<string, 'hello'> // ✓ Pass - 'hello' extends string (string is supertype)
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `supType`

```typescript
type sup<$Supertype, $Actual> = Apply<SupKind, [$Supertype, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/sup.ts#L51" />

Assert that a type is a supertype of (i.e., extended by) another type.

Equivalent to TypeScript's

extends

keyword: checks if

$Actual extends $Supertype

.

This is the reverse parameter order of

sub

- the expected type is the supertype.

Less commonly used than

sub

- most cases should use

sub

with reversed parameters for clarity.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.sup<object, { a: 1 }>, // ✓ Pass - { a: 1 } extends object (object is supertype)
  Ts.Test.sup<{ a: 1 }, object>, // ✗ Fail - object doesn't extend { a: 1 }
  Ts.Test.sup<string, 'hello'> // ✓ Pass - 'hello' extends string (string is supertype)
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equalAny`

```typescript
type equalAny<$Actual> = Apply<EqualAnyKind, [$Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/special-types.ts#L82" />

Assert that a type is exactly

any

.

Uses the

0 extends 1 & T

trick to detect

any

.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equalAny<any>, // ✓ Pass
  Ts.Test.equalAny<unknown>, // ✗ Fail - Type error
  Ts.Test.equalAny<string> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equalEmptyObject`

```typescript
type equalEmptyObject<$Actual extends object> = Apply<
  EqualEmptyObjectKind,
  [$Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/special-types.ts#L183" />

Assert that a type is an empty object (no properties).

Uses

Obj.IsEmpty

from kit to check if the object has no keys.

Note:

{}

in TypeScript means "any non-nullish value", not an empty object.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equalEmptyObject<Record<string, never>>, // ✓ Pass
  Ts.Test.equalEmptyObject<{}>, // ✗ Fail - {} is not empty
  Ts.Test.equalEmptyObject<{ a: 1 }> // ✗ Fail - has properties
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equalNever`

```typescript
type equalNever<$Actual> = Apply<EqualNeverKind, [$Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/special-types.ts#L33" />

Assert that a type is exactly

never

.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equalNever<never>, // ✓ Pass
  Ts.Test.equalNever<string> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equalUnknown`

```typescript
type equalUnknown<$Actual> = Apply<EqualUnknownKind, [$Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/special-types.ts#L133" />

Assert that a type is exactly

unknown

.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equalUnknown<unknown>, // ✓ Pass
  Ts.Test.equalUnknown<any>, // ✗ Fail - Type error
  Ts.Test.equalUnknown<string> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equalAnyType`

```typescript
type equalAny<$Actual> = Apply<EqualAnyKind, [$Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/special-types.ts#L82" />

Assert that a type is exactly

any

.

Uses the

0 extends 1 & T

trick to detect

any

.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equalAny<any>, // ✓ Pass
  Ts.Test.equalAny<unknown>, // ✗ Fail - Type error
  Ts.Test.equalAny<string> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equalEmptyObjectType`

```typescript
type equalEmptyObject<$Actual extends object> = Apply<
  EqualEmptyObjectKind,
  [$Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/special-types.ts#L183" />

Assert that a type is an empty object (no properties).

Uses

Obj.IsEmpty

from kit to check if the object has no keys.

Note:

{}

in TypeScript means "any non-nullish value", not an empty object.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equalEmptyObject<Record<string, never>>, // ✓ Pass
  Ts.Test.equalEmptyObject<{}>, // ✗ Fail - {} is not empty
  Ts.Test.equalEmptyObject<{ a: 1 }> // ✗ Fail - has properties
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equalNeverType`

```typescript
type equalNever<$Actual> = Apply<EqualNeverKind, [$Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/special-types.ts#L33" />

Assert that a type is exactly

never

.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equalNever<never>, // ✓ Pass
  Ts.Test.equalNever<string> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `equalUnknownType`

```typescript
type equalUnknown<$Actual> = Apply<EqualUnknownKind, [$Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/special-types.ts#L133" />

Assert that a type is exactly

unknown

.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equalUnknown<unknown>, // ✓ Pass
  Ts.Test.equalUnknown<any>, // ✗ Fail - Type error
  Ts.Test.equalUnknown<string> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `tuple`

```typescript
type tuple<$Expected extends readonly any[], $Actual> = Apply<
  TupleKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/tuple.ts#L47" />

Assert that a type is a tuple with specific element types.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.tuple<[string, number], [string, number]>, // ✓ Pass
  Ts.Test.tuple<[string, number], [number, string]>, // ✗ Fail - Type error
  Ts.Test.tuple<[string], string> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `tupleType`

```typescript
type tuple<$Expected extends readonly any[], $Actual> = Apply<
  TupleKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/tuple.ts#L47" />

Assert that a type is a tuple with specific element types.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.tuple<[string, number], [string, number]>, // ✓ Pass
  Ts.Test.tuple<[string, number], [number, string]>, // ✗ Fail - Type error
  Ts.Test.tuple<[string], string> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `array`

```typescript
type array<$ElementType, $Actual> = Apply<ArrayKind, [$ElementType, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/array.ts#L49" />

Assert that a type is an array with specific element type.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.array<string, string[]>, // ✓ Pass
  Ts.Test.array<number, string[]>, // ✗ Fail - Type error
  Ts.Test.array<string, string> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `arrayType`

```typescript
type array<$ElementType, $Actual> = Apply<ArrayKind, [$ElementType, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/array.ts#L49" />

Assert that a type is an array with specific element type.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.array<string, string[]>, // ✓ Pass
  Ts.Test.array<number, string[]>, // ✗ Fail - Type error
  Ts.Test.array<string, string> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `promise`

```typescript
type promise<$Type, $Actual> = Apply<PromiseKind, [$Type, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/promise.ts#L49" />

Assert that a type is a Promise with specific element type.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.promise<number, Promise<number>>, // ✓ Pass
  Ts.Test.promise<string, Promise<number>>, // ✗ Fail - Type error
  Ts.Test.promise<number, number> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `promiseType`

```typescript
type promise<$Type, $Actual> = Apply<PromiseKind, [$Type, $Actual]>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/promise.ts#L49" />

Assert that a type is a Promise with specific element type.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.promise<number, Promise<number>>, // ✓ Pass
  Ts.Test.promise<string, Promise<number>>, // ✗ Fail - Type error
  Ts.Test.promise<number, number> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `parameters`

```typescript
type parameters<
  $Expected extends readonly any[],
  $Actual extends readonly any[],
> = Apply<
  ParametersKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/parameters.ts#L46" />

Assert that a function's parameters match the expected type.

Combines

Parameters&lt;typeof fn&gt;

with assertion in one step.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
function add(a: number, b: number): number {
  return a + b
}
type _ = Ts.Test.Cases<
  Ts.Test.parameters<[number, number], Parameters<typeof add>>, // ✓ Pass
  Ts.Test.parameters<[string, string], Parameters<typeof add>> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `parametersType`

```typescript
type parameters<
  $Expected extends readonly any[],
  $Actual extends readonly any[],
> = Apply<
  ParametersKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/parameters.ts#L46" />

Assert that a function's parameters match the expected type.

Combines

Parameters&lt;typeof fn&gt;

with assertion in one step.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
function add(a: number, b: number): number {
  return a + b
}
type _ = Ts.Test.Cases<
  Ts.Test.parameters<[number, number], Parameters<typeof add>>, // ✓ Pass
  Ts.Test.parameters<[string, string], Parameters<typeof add>> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `returns`

```typescript
type returns<$Expected, $Actual> = Apply<
  ReturnsAssertionKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/returns.ts#L62" />

Assert that a function's return type matches the expected type.

Combines

ReturnType&lt;typeof fn&gt;

with assertion in one step.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
function getUser() {
  return { name: 'John', age: 30 }
}
type _ = Ts.Test.Cases<
  Ts.Test.returns<{ name: string; age: number }, ReturnType<typeof getUser>>, // ✓ Pass
  Ts.Test.returns<{ name: string }, ReturnType<typeof getUser>> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `returnsType`

```typescript
type returns<$Expected, $Actual> = Apply<
  ReturnsAssertionKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/returns.ts#L62" />

Assert that a function's return type matches the expected type.

Combines

ReturnType&lt;typeof fn&gt;

with assertion in one step.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
function getUser() {
  return { name: 'John', age: 30 }
}
type _ = Ts.Test.Cases<
  Ts.Test.returns<{ name: string; age: number }, ReturnType<typeof getUser>>, // ✓ Pass
  Ts.Test.returns<{ name: string }, ReturnType<typeof getUser>> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `returnsPromise`

```typescript
type returnsPromise<$Expected, $Actual> = Apply<
  ReturnsPromiseAssertionKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/returns-promise.ts#L62" />

Assert that an async function's resolved return type matches the expected type.

Combines

Awaited&lt;ReturnType&lt;typeof fn&gt;&gt;

with assertion in one step.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
async function getUser() {
  return { name: 'John', age: 30 }
}
type _ = Ts.Test.Cases<
  Ts.Test.returnsPromise<
    { name: string; age: number },
    Awaited<ReturnType<typeof getUser>>
  >, // ✓ Pass
  Ts.Test.returnsPromise<{ name: string }, Awaited<ReturnType<typeof getUser>>> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `returnsPromiseType`

```typescript
type returnsPromise<$Expected, $Actual> = Apply<
  ReturnsPromiseAssertionKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/returns-promise.ts#L62" />

Assert that an async function's resolved return type matches the expected type.

Combines

Awaited&lt;ReturnType&lt;typeof fn&gt;&gt;

with assertion in one step.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
async function getUser() {
  return { name: 'John', age: 30 }
}
type _ = Ts.Test.Cases<
  Ts.Test.returnsPromise<
    { name: string; age: number },
    Awaited<ReturnType<typeof getUser>>
  >, // ✓ Pass
  Ts.Test.returnsPromise<{ name: string }, Awaited<ReturnType<typeof getUser>>> // ✗ Fail - Type error
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `propertiesEquiv`

```typescript
type propertiesEquiv<$Expected extends object, $Actual extends object> = Apply<
  PropertiesEquivKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/properties.ts#L229" />

Assert that specified properties in an object are equivalent (mutually assignable) to expected types.

Checks that for each property in the expected shape, the actual object has that property

and its type is mutually assignable (equivalent but not necessarily structurally equal).

Only checks properties explicitly listed in the expected shape.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type User = { name: string; count: number & {} }

type _ = Ts.Test.Cases<
  Ts.Test.propertiesEquiv<{ name: string }, User>, // ✓ Pass
  Ts.Test.propertiesEquiv<{ count: number }, User>, // ✓ Pass - number & {} equiv to number
  Ts.Test.propertiesEquiv<{ name: number }, User> // ✗ Fail - not equivalent
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `propertiesExact`

```typescript
type propertiesExact<$Expected extends object, $Actual extends object> = Apply<
  PropertiesExactKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/properties.ts#L147" />

Assert that specified properties in an object are exactly equal to expected types.

Checks that for each property in the expected shape, the actual object has that property

and its type is structurally identical. Only checks properties explicitly listed in

the expected shape

- additional properties in the actual object are ignored.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type User = { name: string; age: number; role: 'admin' | 'user' }

type _ = Ts.Test.Cases<
  Ts.Test.propertiesExact<{ name: string }, User>, // ✓ Pass
  Ts.Test.propertiesExact<{ role: 'admin' | 'user' }, User>, // ✓ Pass
  Ts.Test.propertiesExact<{ role: 'admin' }, User> // ✗ Fail - not exact
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `propertiesSub`

```typescript
type propertiesSub<$Expected extends object, $Actual extends object> = Apply<
  PropertiesSubKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/properties.ts#L63" />

Assert that specified properties in an object are subtypes of expected types.

Checks that for each property in the expected shape, the actual object has that property

and its type extends the expected type. Only checks properties explicitly listed in

the expected shape

- additional properties in the actual object are ignored.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type User = { name: string; age: number; email?: string }

type _ = Ts.Test.Cases<
  Ts.Test.propertiesSub<{ name: string }, User>, // ✓ Pass
  Ts.Test.propertiesSub<{ name: string; age: number }, User>, // ✓ Pass
  Ts.Test.propertiesSub<{ name: number }, User> // ✗ Fail - wrong type
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `propertiesEquivType`

```typescript
type propertiesEquiv<$Expected extends object, $Actual extends object> = Apply<
  PropertiesEquivKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/properties.ts#L229" />

Assert that specified properties in an object are equivalent (mutually assignable) to expected types.

Checks that for each property in the expected shape, the actual object has that property

and its type is mutually assignable (equivalent but not necessarily structurally equal).

Only checks properties explicitly listed in the expected shape.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type User = { name: string; count: number & {} }

type _ = Ts.Test.Cases<
  Ts.Test.propertiesEquiv<{ name: string }, User>, // ✓ Pass
  Ts.Test.propertiesEquiv<{ count: number }, User>, // ✓ Pass - number & {} equiv to number
  Ts.Test.propertiesEquiv<{ name: number }, User> // ✗ Fail - not equivalent
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `propertiesExactType`

```typescript
type propertiesExact<$Expected extends object, $Actual extends object> = Apply<
  PropertiesExactKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/properties.ts#L147" />

Assert that specified properties in an object are exactly equal to expected types.

Checks that for each property in the expected shape, the actual object has that property

and its type is structurally identical. Only checks properties explicitly listed in

the expected shape

- additional properties in the actual object are ignored.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type User = { name: string; age: number; role: 'admin' | 'user' }

type _ = Ts.Test.Cases<
  Ts.Test.propertiesExact<{ name: string }, User>, // ✓ Pass
  Ts.Test.propertiesExact<{ role: 'admin' | 'user' }, User>, // ✓ Pass
  Ts.Test.propertiesExact<{ role: 'admin' }, User> // ✗ Fail - not exact
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `propertiesSubType`

```typescript
type propertiesSub<$Expected extends object, $Actual extends object> = Apply<
  PropertiesSubKind,
  [$Expected, $Actual]
>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/properties.ts#L63" />

Assert that specified properties in an object are subtypes of expected types.

Checks that for each property in the expected shape, the actual object has that property

and its type extends the expected type. Only checks properties explicitly listed in

the expected shape

- additional properties in the actual object are ignored.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type User = { name: string; age: number; email?: string }

type _ = Ts.Test.Cases<
  Ts.Test.propertiesSub<{ name: string }, User>, // ✓ Pass
  Ts.Test.propertiesSub<{ name: string; age: number }, User>, // ✓ Pass
  Ts.Test.propertiesSub<{ name: number }, User> // ✗ Fail - wrong type
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Case`

```typescript
type Case<$Result extends never> = $Result
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/helpers.ts#L36" />

Type-level test assertion that requires the result to be never (no error).

Used in type-level test suites to ensure a type evaluates to never (success).

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type MyTests = [
  Ts.Test.Case<Equal<string, string>>, // OK - evaluates to never (success)
  Ts.Test.Case<Equal<string, number>>, // Error - doesn't extend never (returns error)
]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Cases`

```typescript
type Cases<
  _T1 extends never = never,
  _T2 extends never = never,
  _T3 extends never = never,
  _T4 extends never = never,
  _T5 extends never = never,
  _T6 extends never = never,
  _T7 extends never = never,
  _T8 extends never = never,
  _T9 extends never = never,
  _T10 extends never = never,
  _T11 extends never = never,
  _T12 extends never = never,
  _T13 extends never = never,
  _T14 extends never = never,
  _T15 extends never = never,
  _T16 extends never = never,
  _T17 extends never = never,
  _T18 extends never = never,
  _T19 extends never = never,
  _T20 extends never = never,
  _T21 extends never = never,
  _T22 extends never = never,
  _T23 extends never = never,
  _T24 extends never = never,
  _T25 extends never = never,
  _T26 extends never = never,
  _T27 extends never = never,
  _T28 extends never = never,
  _T29 extends never = never,
  _T30 extends never = never,
  _T31 extends never = never,
  _T32 extends never = never,
  _T33 extends never = never,
  _T34 extends never = never,
  _T35 extends never = never,
  _T36 extends never = never,
  _T37 extends never = never,
  _T38 extends never = never,
  _T39 extends never = never,
  _T40 extends never = never,
  _T41 extends never = never,
  _T42 extends never = never,
  _T43 extends never = never,
  _T44 extends never = never,
  _T45 extends never = never,
  _T46 extends never = never,
  _T47 extends never = never,
  _T48 extends never = never,
  _T49 extends never = never,
  _T50 extends never = never,
  _T51 extends never = never,
  _T52 extends never = never,
  _T53 extends never = never,
  _T54 extends never = never,
  _T55 extends never = never,
  _T56 extends never = never,
  _T57 extends never = never,
  _T58 extends never = never,
  _T59 extends never = never,
  _T60 extends never = never,
  _T61 extends never = never,
  _T62 extends never = never,
  _T63 extends never = never,
  _T64 extends never = never,
  _T65 extends never = never,
  _T66 extends never = never,
  _T67 extends never = never,
  _T68 extends never = never,
  _T69 extends never = never,
  _T70 extends never = never,
  _T71 extends never = never,
  _T72 extends never = never,
  _T73 extends never = never,
  _T74 extends never = never,
  _T75 extends never = never,
  _T76 extends never = never,
  _T77 extends never = never,
  _T78 extends never = never,
  _T79 extends never = never,
  _T80 extends never = never,
  _T81 extends never = never,
  _T82 extends never = never,
  _T83 extends never = never,
  _T84 extends never = never,
  _T85 extends never = never,
  _T86 extends never = never,
  _T87 extends never = never,
  _T88 extends never = never,
  _T89 extends never = never,
  _T90 extends never = never,
  _T91 extends never = never,
  _T92 extends never = never,
  _T93 extends never = never,
  _T94 extends never = never,
  _T95 extends never = never,
  _T96 extends never = never,
  _T97 extends never = never,
  _T98 extends never = never,
  _T99 extends never = never,
  _T100 extends never = never,
> = true
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/helpers.ts#L58" />

Type-level batch assertion helper that accepts multiple assertions.

Each type parameter must extend never (no error), allowing batch type assertions.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Equal<string, string>, // ✓ Pass (returns never)
  Extends<string, 'hello'>, // ✓ Pass (returns never)
  Never<never> // ✓ Pass (returns never)
>

// Type error if any assertion fails
type _ = Ts.Test.Cases<
  Equal<string, string>, // ✓ Pass (returns never)
  Equal<string, number>, // ✗ Fail - Type error here (returns StaticErrorAssertion)
  Extends<string, 'hello'> // ✓ Pass (returns never)
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `_ExactError`

```typescript
type _ExactError<
  $Expected,
  $Actual,
  ___Relation = GetRelation<$Expected, $Actual>,
> = ___Relation extends 'equivalent' ? StaticErrorAssertion<
    'Types are mutually assignable but not structurally equal',
    $Expected,
    $Actual,
    'Use equiv() for mutual assignability OR apply Simplify<T> to normalize types'
  >
  : ___Relation extends 'subtype' ? StaticErrorAssertion<
      'Actual type is a subtype of expected type but not structurally equal',
      $Expected,
      $Actual,
      "Actual is narrower than expected - types don't match exactly"
    >
  : ___Relation extends 'supertype' ? StaticErrorAssertion<
      'Actual type is a supertype of expected type but not structurally equal',
      $Expected,
      $Actual,
      "Actual is wider than expected - types don't match exactly"
    >
  : ___Relation extends 'overlapping' ? StaticErrorAssertion<
      'Types have overlapping values but are not structurally equal',
      $Expected,
      $Actual,
      'Types share some possible values but are different'
    >
  : ___Relation extends 'disjoint' ? StaticErrorAssertion<
      'Types are completely disjoint (no common values)',
      $Expected,
      $Actual,
      'These types have no overlap and will never be equal'
    >
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/test/shared.ts#L55" />

Internal utility for generating appropriate error messages when exact equality fails

due to types being equivalent but not structurally equal.

In the hybrid error approach, this is primarily used when GetRelation returns 'equivalent',

providing a helpful suggestion to use equiv() for mutual assignability or apply Simplify

to normalize types. For other type mismatches, TypeScript's native error messages are

preferred as they show specific structural differences in complex objects.
