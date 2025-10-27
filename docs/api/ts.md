# Ts

TypeScript type utilities and type-level programming helpers.

Provides comprehensive type-level utilities including type printing, static errors, type guards, simplification utilities, exact type matching, and type testing tools. Features conditional types, type transformations, and type-level assertions for advanced TypeScript patterns.

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'
```

```typescript [Barrel]
import * as Ts from '@wollybeard/kit/ts'
```

:::

## Namespaces

| Namespace                                         | Description                                                                                                                                                                |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**`Kind`**](/api/ts/kind)                        | Higher-kinded type utilities for type-level programming. Provides type-level functions and utilities for simulating higher-kinded types in TypeScript.                     |
| [**`SimpleSignature`**](/api/ts/simple-signature) | Utilities for working with the `__simpleSignature` phantom type pattern. Allows complex generic functions to provide simpler signatures for type inference.                |
| [**`Assert`**](/api/ts/assert)                    | —                                                                                                                                                                          |
| [**`Inhabitance`**](/api/ts/inhabitance)          | Type utilities for classifying types by their inhabitance in TypeScript's type lattice.                                                                                    |
| [**`Simplify`**](/api/ts/simplify)                | Type simplification utilities for flattening and expanding types. All functions automatically preserve globally registered types from KitLibrarySettings.Ts.PreserveTypes. |
| [**`Err`**](/api/ts/err)                          | Error utilities for working with static type-level errors.                                                                                                                 |
| [**`Union`**](/api/ts/union)                      | Utilities for working with union types at the type level.                                                                                                                  |
| [**`VariancePhantom`**](/api/ts/variance-phantom) | Phantom type helpers for controlling type variance (covariance, contravariance, invariance, bivariance).                                                                   |
| [**`SENTINEL`**](/api/ts/sentinel)                | Utilities for working with the SENTINEL type.                                                                                                                              |

## Type Printing

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Show`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L186" /> {#t-show-186}

```typescript
type Show<$Type> = `\`${Print<$Type>}\``
```

Like Print but adds additional styling to display the rendered type in a sentence.

Useful for type-level error messages where you want to clearly distinguish type names from surrounding text. Wraps the printed type with backticks () like inline code in Markdown.

$Type

- The type to format and display

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Message1 = `Expected ${Show<string>} but got ${Show<number>}`
// Result: "Expected `string` but got `number`"

type Message2 = `The type ${Show<'hello' | 'world'>} is not assignable`
// Result: "The type `'hello' | 'world'` is not assignable"

// Using in error messages
type TypeError<Expected, Actual> = StaticError<
  `Type mismatch: expected ${Show<Expected>} but got ${Show<Actual>}`,
  { Expected, Actual }
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ShowInTemplate`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L217" /> {#t-show-in-template-217}

```typescript
type ShowInTemplate<$Type> = `'${Print<$Type>}'`
```

Version of Show but uses single quotes instead of backticks.

This can be useful in template literal types where backticks would be rendered as "" which is not ideal for readability. Use this when the output will be used within another template literal type or when backticks cause display issues.

Note that when working with TS-level errors, if TS can instantiate all the types involved then the result will be a string, not a string literal type. So when working with TS-level errors, only reach for this variant of Show if you think there is likelihood that types won't be instantiated.

$Type

- The type to format and display

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// When backticks would be escaped in output
type ErrorInTemplate = `Error: ${ShowInTemplate<string>} is required`
// Result: "Error: 'string' is required"

// Comparing Show vs ShowInTemplate
type WithShow = `Type is ${Show<number>}`
// May display as: "Type is \`number\`" (escaped backticks)

type WithShowInTemplate = `Type is ${ShowInTemplate<number>}`
// Displays as: "Type is 'number'" (cleaner)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Print`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/print.ts#L12" /> {#t-print-12}

```typescript
type Print<$Type, $Fallback extends string | undefined = undefined> =
  // Language base category types
  IsAny<$Type> extends true ? 'any'
  : IsUnknown<$Type> extends true ? 'unknown'
  : IsNever<$Type> extends true ? 'never'

  // Special union type boolean which we display as boolean insead of true | false
  : [$Type] extends [boolean] ? ([boolean] extends [$Type] ? 'boolean' : `${$Type}`)

  // General unions types
  : Union.ToTuple<$Type> extends ArrMut.Any2OrMoreRO ? _PrintUnion<Union.ToTuple<$Type>>

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

Print a type as a readable string representation.

## Type Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Interpolatable`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L63" /> {#u-interpolatable-63}

```typescript
type Interpolatable =
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

Types that TypeScript accepts being interpolated into a Template Literal Type.

These are the types that can be used within template literal types without causing a TypeScript error. When a value of one of these types is interpolated into a template literal type, TypeScript will properly convert it to its string representation.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// All these types can be interpolated:
type Valid1 = `Value: ${string}`
type Valid2 = `Count: ${number}`
type Valid3 = `Flag: ${boolean}`
type Valid4 = `ID: ${123n}`

// Example usage in conditional types:
type Stringify<T extends Interpolatable> = `${T}`
type Result1 = Stringify<42>        // "42"
type Result2 = Stringify<true>      // "true"
type Result3 = Stringify<'hello'>   // "hello"
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Primitive`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L338" /> {#u-primitive-338}

```typescript
type Primitive = null | undefined | string | number | boolean | symbol | bigint
```

Matches any primitive value type.

Primitive values are the basic building blocks of JavaScript that are not objects. This includes all value types that are not Objects, Functions, or Arrays.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type T1 = Primitive extends string ? true : false        // true
type T2 = Primitive extends { x: number } ? true : false // false

// Use in conditional types
type StripPrimitives<T> = T extends Primitive ? never : T
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `PrimitiveBrandLike`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L379" /> {#t-primitive-brand-like-379}

```typescript
// [!code word:BrandTypeId:1]
type PrimitiveBrandLike = { readonly [Brand.BrandTypeId]: any }
```

Structural pattern matching any Effect-branded primitive type.

This type matches primitives that have been branded using Effect's , by structurally checking for the presence of the `BrandTypeId` symbol property. It's used in KitLibrarySettings.Ts.PreserveTypes to prevent branded types from being expanded in type displays and error messages.

**How it works:**

Effect's branded types follow this pattern:

```ts
type NonNegative = number & Brand.Brand<'NonNegative'>
// Which expands to:
// number & { readonly [BrandTypeId]: { readonly NonNegative: "NonNegative" } }
```

The check `T extends { readonly [BrandTypeId]: any }` structurally matches the brand part while plain primitives fail the check since they lack the symbol property.

**Examples:**

```typescript twoslash
// @noErrors
import type { Brand } from 'effect'

type NonNegative = number & Brand.Brand<'NonNegative'>
type Int = number & Brand.Brand<'Int'>

// Branded types match
type Test1 = NonNegative extends PrimitiveBrandLike ? true : false  // true
type Test2 = Int extends PrimitiveBrandLike ? true : false          // true

// Plain primitives don't match
type Test3 = number extends PrimitiveBrandLike ? true : false       // false
type Test4 = string extends PrimitiveBrandLike ? true : false       // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `WritableDeep`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L421" /> {#t-writable-deep-421}

```typescript
type WritableDeep<$T> =
  // Built-ins checked FIRST - handles branded types like `number & { [Brand]: true }`
  $T extends Primitive | void | Date | RegExp ? $T
  : $T extends (...args: any[]) => any ? $T  // Functions pass through
  : $T extends readonly any[] ? { -readonly [i in keyof $T]: WritableDeep<$T[i]> }  // Arrays/tuples
  : $T extends object ? { -readonly [k in keyof $T]: WritableDeep<$T[k]> }  // Objects
  : $T
```

Recursively make all properties writable (removes readonly modifiers deeply).

Handles functions, primitives, built-ins, and branded types correctly by passing them through. Only recursively processes plain objects and tuples/arrays.

Unlike type-fest's WritableDeep, this implementation properly handles function types during TypeScript inference, preventing inference failures that result in `unknown`.

Built-in types (primitives, Date, RegExp, etc.) are checked FIRST to handle branded types like `number & { [Brand]: true }`, which extend both `number` and `object`.

$T

- The type to recursively make writable

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Primitives and built-ins pass through
type N = WritableDeep<number>  // number
type D = WritableDeep<Date>    // Date

// Branded types pass through (checked before object)
type Branded = number & { [brand]: true }
type Result = WritableDeep<Branded>  // number & { [brand]: true }

// Functions pass through unchanged
type Fn = (x: readonly string[]) => void
type Result2 = WritableDeep<Fn>  // (x: readonly string[]) => void

// Objects are recursively processed
type Obj = { readonly a: { readonly b: number } }
type Result3 = WritableDeep<Obj>  // { a: { b: number } }

// Arrays/tuples are recursively processed
type Arr = readonly [readonly string[], readonly number[]]
type Result4 = WritableDeep<Arr>  // [string[], number[]]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `StripReadonlyDeep`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L470" /> {#t-strip-readonly-deep-470}

```typescript
type StripReadonlyDeep<$T> =
  $T extends Function ? $T
  // TUPLE HANDLING: Must come before Array AND before GetPreservedTypes to preserve structure
  : $T extends readonly [...infer ___Elements]
  ? { -readonly [i in keyof ___Elements]: StripReadonlyDeep<___Elements[i]> }
  // Array handling (only matches non-tuple arrays now)
  : $T extends Array<infer __element__> ? Array<StripReadonlyDeep<__element__>>
  : $T extends ReadonlyArray<infer __element__> ? Array<StripReadonlyDeep<__element__>>
  // Preserve types from settings AFTER array/tuple handling (branded primitives, built-ins, user-registered)
  : $T extends GetPreservedTypes ? $T
  : $T extends object
  ? & { -readonly [k in keyof $T]: StripReadonlyDeep<$T[k]> }
  & unknown
  : $T
```

Recursively strip readonly modifiers from a type.

Strips `readonly` from objects, tuples, and arrays while recursing into nested structures. Uses inline simplification (`& unknown`) to avoid wrapper type names in error messages.

Automatically preserves types registered in KitLibrarySettings.Ts.PreserveTypes (including built-in types like Date, Error, Function, and branded primitives).

**CRITICAL**: Handles tuples BEFORE arrays to preserve tuple structure. Without tuple handling, `[1, 2]` would match `Array<infer element>` and widen to `(1 | 2)[]`.

$T

- The type to strip readonly from

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Object with readonly properties
type ReadonlyObj = { readonly x: number; readonly y: string }
type Mutable = StripReadonlyDeep<ReadonlyObj>
// { x: number; y: string }

// Readonly tuple
type ReadonlyTuple = readonly [1, 2, 3]
type MutableTuple = StripReadonlyDeep<ReadonlyTuple>
// [1, 2, 3]

// Readonly array
type ReadonlyArr = ReadonlyArray<number>
type MutableArr = StripReadonlyDeep<ReadonlyArr>
// Array<number>

// Nested structures with branded types
type NonNegative = number & Brand.Brand<'NonNegative'>
type Nested = { readonly data: readonly [NonNegative, 1, 2] }
type NestedMutable = StripReadonlyDeep<Nested>
// { data: [NonNegative, 1, 2] } - branded type preserved!
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SENTINEL`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L589" /> {#t-sentinel-589}

```typescript
type SENTINEL = { readonly __kit_ts_sentinel__: unique symbol }
```

Sentinel type for detecting whether an optional type parameter was provided.

Use as default value for optional type parameters when you need to distinguish between "user explicitly provided a type" vs "using default/inferring".

Enables conditional behavior based on whether the caller provided an explicit type argument or is relying on inference/defaults.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Different behavior based on whether type arg provided
function process<$T = SENTINEL>(...):
  Ts.SENTINEL.Is<$T> extends true
  ? // No type arg - infer from value
    : // Type arg provided - use it
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Real-world usage in assertion functions
type AssertFn<$Expected, $Actual = SENTINEL> =
  Ts.SENTINEL.Is<$Actual> extends true
  ? <$actual>(value: $actual) => void  // Value mode
  : void                                // Type-only mode
```

## Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `as`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L37" /> {#f-as-37}

```typescript
<$value>(value ?: unknown): $value
```

**Parameters:**

- `value` - The value to cast (defaults to undefined)

**Returns:** The value cast to the specified type

Cast any value to a specific type for testing purposes. Useful for type-level testing where you need to create a value with a specific type.

$value

- The type to cast to

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Creating typed test values
const user = as<{ id: string; name: string }>({ id: '1', name: 'Alice' })

// Testing type inference
declare let _: any
const result = someFunction()
assertExtends<string>()(_ as typeof result)
```

## Utils

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `TupleToLettered`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L154" /> {#t-tuple-to-lettered-154}

```typescript
type TupleToLettered<$Values extends readonly string[], $Prefix extends string = 'tip'> = {
  [
  i in keyof $Values as i extends `${infer __n__ extends number}` ? `${$Prefix}_${Str.Char.LettersLower[__n__]}`
  : never
  ]: $Values[i]
}
```

Represents a type error that can be surfaced at the type level.

This is useful for providing more informative error messages directly in TypeScript's type checking, often used with conditional types or generic constraints. When TypeScript encounters this type, it will display the error information in a structured way.

$Message

- A string literal type describing the error

$Context

- An object type providing additional context about the error,

often including the types involved

$Hint

- A string literal type providing a hint for resolving the error

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Creating a custom type error
type RequireString<T> = T extends string ? T : StaticError<
  'Type must be a string',
  { Received: T },
  'Consider using string or a string literal type'
>

type Good = RequireString<'hello'>  // 'hello'
type Bad = RequireString<number>    // StaticError<...>
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Using in function constraints
function processString<T>(
  value: T extends string ? T : StaticError<
    'Argument must be a string',
    { ProvidedType: T }
  >
): void {
  // Implementation
}

processString('hello')  // OK
processString(42)       // Type error with custom message
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsAny`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L40" /> {#t-is-any-40}

```typescript
type IsAny<T> = 0 extends 1 & T ? true : false
```

Check if a type is `any`.

Uses the fact that `any` is the only type where `0 extends (1 & T)` is true, since `any` absorbs all type operations including impossible intersections.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equal<IsAny<any>, true>,
  Ts.Test.equal<IsAny<unknown>, false>,
  Ts.Test.equal<IsAny<string>, false>,
  Ts.Test.equal<IsAny<never>, false>
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsNever`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L22" /> {#t-is-never-22}

```typescript
type IsNever<$Type> = [$Type] extends [never] ? true : false
```

Type utilities for detecting TypeScript edge case types: `any`, `never`, and `unknown`.

These utilities are useful for conditional type logic that needs to handle these special types differently.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsUnknown`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/inhabitance.ts#L59" /> {#t-is-unknown-59}

```typescript
type IsUnknown<T> = unknown extends T ? (IsAny<T> extends true ? false : true) : false
```

Check if a type is `unknown`.

Unknown is the top type

- everything extends unknown (except any, which is special). So we check if unknown extends the type (only true for unknown and any), then exclude any using IsAny.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Test.Cases<
  Ts.Test.equal<IsUnknown<unknown>, true>,
  Ts.Test.equal<IsUnknown<any>, false>,
  Ts.Test.equal<IsUnknown<string>, false>,
  Ts.Test.equal<IsUnknown<never>, false>
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ExtendsExact`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L257" /> {#t-extends-exact-257}

```typescript
type ExtendsExact<$Input, $Constraint> =
  $Input extends $Constraint
  ? $Constraint extends $Input
  ? $Input
  : never
  : never
```

Utilities for working with union types at the type level.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `NotExtends`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L306" /> {#t-not-extends-306}

```typescript
type NotExtends<$A, $B> = [$A] extends [$B] ? false : true
```

Type-level utility that checks if a type does NOT extend another type.

Returns `true` if type A does not extend type B, `false` otherwise. Useful for conditional type logic where you need to check the absence of a type relationship.

$A

- The type to check

$B

- The type to check against

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type T1 = NotExtends<string, number>      // true (string doesn't extend number)
type T2 = NotExtends<'hello', string>     // false ('hello' extends string)
type T3 = NotExtends<42, number>          // false (42 extends number)
type T4 = NotExtends<{ a: 1 }, { b: 2 }>  // true (different properties)
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Using in conditional types for optional handling
type VarBuilderToType<$Type, $VarBuilder> =
  $VarBuilder['required'] extends true ? Exclude<$Type, undefined> :
  NotExtends<$VarBuilder['default'], undefined> extends true ? $Type | undefined :
  $Type

// If default is undefined, type is just $Type
// If default is not undefined, type is $Type | undefined
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Checking for specific type exclusions
type SafeDivide<T> = NotExtends<T, 0> extends true
  ? number
  : StaticError<'Cannot divide by zero'>

type Result1 = SafeDivide<5>   // number
type Result2 = SafeDivide<0>   // StaticError<'Cannot divide by zero'>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Writeable`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L317" /> {#t-writeable-317}

```typescript
type Writeable<$Object> = {
  -readonly [k in keyof $Object]: $Object[k]
}
```

Make all properties in an object mutable (removes readonly modifiers).

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Readonly = { readonly x: number; readonly y: string }
type Mutable = Writeable<Readonly>  // { x: number; y: string }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `BooleanCase`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L538" /> {#t-boolean-case-538}

```typescript
type BooleanCase<$T extends boolean> = $T extends true ? 'true' : 'false'
```

Convert a boolean type to a string literal 'true' or 'false'. Useful for lookup table indexing.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type T1 = BooleanCase<true>   // 'true'
type T2 = BooleanCase<false>  // 'false'

// Using in lookup tables:
type Result = {
  true: 'yes'
  false: 'no'
}[BooleanCase<SomeCheck<T>>]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IntersectionIgnoreNeverOrAny`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L543" /> {#t-intersection-ignore-never-or-any-543}

```typescript
type IntersectionIgnoreNeverOrAny<$T> = IsAny<$T> extends true ? unknown : $T extends never ? unknown : $T
```

Intersection that ignores never and any.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `NeverOrAnyToUnknown`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L548" /> {#t-never-or-any-to-unknown-548}

```typescript
type NeverOrAnyToUnknown<$T> = IsAny<$T> extends true ? unknown : $T extends never ? unknown : $T
```

Convert never or any to unknown.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Narrowable`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L553" /> {#u-narrowable-553}

```typescript
type Narrowable = string | number | bigint | boolean | []
```

Any narrowable primitive type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAndUnknownToNever`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L558" /> {#t-any-and-unknown-to-never-558}

```typescript
type AnyAndUnknownToNever<$T> = IsAny<$T> extends true ? never : IsUnknown<$T> extends true ? never : $T
```

Convert any and unknown to never.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isTypeWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/type-guards.ts#L20" /> {#f-is-type-with-20}

```typescript
<reference>(reference: reference): <valueGiven>(value: ValidateIsSupertype<reference, valueGiven>) => value is reference extends valueGiven ? reference : never
```

**Parameters:**

- `reference` - The reference value to compare against

**Returns:** A type guard function that narrows to the reference type

Create a type guard that checks if a value equals a reference value.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// [!code word:isTypeWith:1]
const isNull = Ts.isTypeWith(null)
const value: string | null = getString()
if (isNull(value)) {
  // value is narrowed to null
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isntTypeWith`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/type-guards.ts#L43" /> {#f-isnt-type-with-43}

```typescript
<reference>(reference: reference): <valueGiven>(value: ValidateIsSupertype<reference, valueGiven>) => value is reference extends valueGiven ? Exclude<valueGiven, reference> : never
```

**Parameters:**

- `reference` - The reference value to compare against

**Returns:** A type guard function that narrows by excluding the reference type

Create a type guard that checks if a value does not equal a reference value.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// [!code word:isntTypeWith:1]
const isntNull = Ts.isntTypeWith(null)
const value: string | null = getString()
if (isntNull(value)) {
  // value is narrowed to string
}
```
