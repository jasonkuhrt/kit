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

- [**`Kind`**](/api/ts/kind) - Higher-kinded type utilities for type-level programming. Provides type-level functions and utilities for simulating higher-kinded types in TypeScript.
- [**`SimpleSignature`**](/api/ts/simple-signature) - Utilities for working with the `__simpleSignature` phantom type pattern. Allows complex generic functions to provide simpler signatures for type inference.
- [**`Test`**](/api/ts/test) - Type-level assertion utilities for testing type correctness. Provides compile-time type checking and assertions for tests.
- [**`Union`**](/api/ts/union) - Utilities for working with union types at the type level.
- [**`VariancePhantom`**](/api/ts/variance-phantom) - Phantom type helpers for controlling type variance (covariance, contravariance, invariance, bivariance).
- [**`SENTINEL`**](/api/ts/sentinel) - Utilities for working with the SENTINEL type.
- [**`Relation`**](/api/ts/relation)

## Error Messages

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[I]`</span> `StaticError`

```typescript
interface StaticError<
  $Message extends string = string,
  $Context extends object = {},
  $Hint extends string = '(none)',
> {
  ERROR: $Message
  CONTEXT: $Context
  HINT: $Hint
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L106" />

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

type Good = RequireString<'hello'> // 'hello'
type Bad = RequireString<number> // StaticError<...>
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
  >,
): void {
  // Implementation
}

processString('hello') // OK
processString(42) // Type error with custom message
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `StaticErrorAny`

```typescript
type StaticErrorAny = StaticError<string, object, string>
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L119" />

## Type Printing

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Print`

```typescript
type Print<$Type, $Fallback extends string | undefined = undefined> =
  // Language base category types
  IsAny<$Type> extends true ? 'any'
    : IsUnknown<$Type> extends true ? 'unknown'
    : IsNever<$Type> extends true ? 'never'
    // Special union type boolean which we display as boolean insead of true | false
    : [$Type] extends [boolean]
      ? ([boolean] extends [$Type] ? 'boolean' : `${$Type}`)
    // General unions types
    : Union.ToTuple<$Type> extends ArrMut.Any2OrMoreRO
      ? _PrintUnion<Union.ToTuple<$Type>>
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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/print.ts#L13" />

Print a type as a readable string representation.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Show`

```typescript
type Show<$Type> = `\`${Print<$Type>}\``
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L146" />

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
  { Expected; Actual }
>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ShowInTemplate`

```typescript
type ShowInTemplate<$Type> = `'${Print<$Type>}'`
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L177" />

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

## Type Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Interpolatable`

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

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L50" />

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
type Result1 = Stringify<42> // "42"
type Result2 = Stringify<true> // "true"
type Result3 = Stringify<'hello'> // "hello"
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[∩]`</span> `Simplify`

```typescript
type Simplify<$Type> =
  & {
    [_ in keyof $Type]: $Type[_]
  }
  & unknown
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L219" />

Simplifies complex type intersections and mapped types for better readability.

Forces TypeScript to evaluate and flatten a type, which is especially useful for:

- Intersection types that appear as `A & B & C` in tooltips
- Complex mapped types that show their internal structure
- Making type aliases more readable in IDE tooltips

$Type

- The type to simplify

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Without Simplify
type Complex = { a: string } & { b: number } & { c: boolean }
// Tooltip shows: { a: string } & { b: number } & { c: boolean }

// With Simplify
type Simple = Simplify<Complex>
// Tooltip shows: { a: string; b: number; c: boolean }
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Simplifying complex mapped types
type UserPermissions =
  & { read: boolean }
  & { write: boolean }
  & { admin: boolean }

type FlatPermissions = Simplify<UserPermissions>
// Shows as: { read: boolean; write: boolean; admin: boolean }

// Useful with generic constraints
function processUser<T extends Simplify<UserPermissions>>(user: T) {
  // T will show flattened structure in errors and tooltips
}
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SENTINEL`

```typescript
type SENTINEL = { readonly __kit_ts_sentinel__: unique symbol }
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L484" />

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
type AssertFn<$Expected, $Actual = SENTINEL> = Ts.SENTINEL.Is<$Actual> extends
  true ? <$actual>(value: $actual) => void // Value mode
  : void // Type-only mode
```

## Utilities

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `as`

```typescript
<$value>(value ?: unknown): $value
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L24" />

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

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SimplifyNullable`

```typescript
type SimplifyNullable<$T> = null extends $T ? (Simplify<$T> & {}) | null
  : Simplify<$T> & {}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L259" />

Simplify a type while preserving `| null` unions.

This solves a subtle problem with Simplify: when you have `Type | null`, using `Simplify<Type | null>` can absorb or transform the `null` in unexpected ways due to the intersection with `& unknown` or `& {}`. This utility checks for null first, then explicitly reconstructs the union to ensure `| null` remains intact.

**When to use:**

- Use SimplifyNullable when simplifying types that may contain `| null` or `| undefined`
- Use Simplify for non-nullable types or when null handling doesn't matter

$T

- The type to simplify

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Problem: Plain Simplify can mangle nullable unions
type User = { name: string } & { age: number }
type MaybeUser = User | null
type Bad = Simplify<MaybeUser> // May not preserve | null correctly

// Solution: SimplifyNullable preserves the null union
type Good = SimplifyNullable<MaybeUser> // { name: string; age: number } | null
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Works with non-nullable types too
type Simple = SimplifyNullable<{ a: 1 } & { b: 2 }> // { a: 1; b: 2 }

// Preserves null in unions
type Nullable = SimplifyNullable<({ a: 1 } & { b: 2 }) | null> // { a: 1; b: 2 } | null
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ExtendsExact`

```typescript
type ExtendsExact<$Input, $Constraint> = $Input extends $Constraint
  ? $Constraint extends $Input ? $Input
  : never
  : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L299" />

Utilities for working with union types at the type level.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `NotExtends`

```typescript
type NotExtends<$A, $B> = [$A] extends [$B] ? false : true
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L348" />

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
type T1 = NotExtends<string, number> // true (string doesn't extend number)
type T2 = NotExtends<'hello', string> // false ('hello' extends string)
type T3 = NotExtends<42, number> // false (42 extends number)
type T4 = NotExtends<{ a: 1 }, { b: 2 }> // true (different properties)
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Using in conditional types for optional handling
type VarBuilderToType<$Type, $VarBuilder> = $VarBuilder['required'] extends true
  ? Exclude<$Type, undefined>
  : NotExtends<$VarBuilder['default'], undefined> extends true
    ? $Type | undefined
  : $Type

// If default is undefined, type is just $Type
// If default is not undefined, type is $Type | undefined
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Checking for specific type exclusions
type SafeDivide<T> = NotExtends<T, 0> extends true ? number
  : StaticError<'Cannot divide by zero'>

type Result1 = SafeDivide<5> // number
type Result2 = SafeDivide<0> // StaticError<'Cannot divide by zero'>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Writeable`

```typescript
type Writeable<$Object> = {
  -readonly [k in keyof $Object]: $Object[k]
}
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L359" />

Make all properties in an object mutable (removes readonly modifiers).

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type Readonly = { readonly x: number; readonly y: string }
type Mutable = Writeable<Readonly> // { x: number; y: string }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IfExtendsElse`

```typescript
type IfExtendsElse<$Type, $Extends, $Then, $Else> = $Type extends $Extends
  ? $Then
  : $Else
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L398" />

:::warning DEPRECATED

- Commented out 2025-01-07

This utility was too strict - requires BIDIRECTIONAL extends, which rejects valid narrowed types (e.g., id: true for id: boolean ).

Use Obj.NoExcess instead, which: - ✓ Rejects excess properties (what you want) - ✓ Allows valid subtypes/narrowing (what you need)

If a use case for true bidirectional exact matching emerges, uncomment. Otherwise, remove after 3-6 months (target: ~2025-07-01).

Original implementation:
:::

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsNever`

```typescript
type IsNever<$Type> = [$Type] extends [never] ? true : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L400" />

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IntersectionIgnoreNeverOrAny`

```typescript
type IntersectionIgnoreNeverOrAny<$T> = IsAny<$T> extends true ? unknown
  : $T extends never ? unknown
  : $T
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L405" />

Intersection that ignores never and any.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `NeverOrAnyToUnknown`

```typescript
type NeverOrAnyToUnknown<$T> = IsAny<$T> extends true ? unknown
  : $T extends never ? unknown
  : $T
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L410" />

Convert never or any to unknown.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[U]`</span> `Narrowable`

```typescript
type Narrowable = string | number | bigint | boolean | []
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L415" />

Any narrowable primitive type.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `AnyAndUnknownToNever`

```typescript
type AnyAndUnknownToNever<$T> = IsAny<$T> extends true ? never
  : IsUnknown<$T> extends true ? never
  : $T
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L420" />

Convert any and unknown to never.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsAny`

```typescript
type IsAny<T> = 0 extends 1 & T ? true : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L436" />

Check if a type is `any`.

Uses the fact that `any` is the only type where `0 extends (1 & T)` is true, since `any` absorbs all type operations including impossible intersections.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type T1 = IsAny<any> // true
type T2 = IsAny<unknown> // false
type T3 = IsAny<string> // false
type T4 = IsAny<never> // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsUnknown`

```typescript
type IsUnknown<T> = unknown extends T ? (IsAny<T> extends true ? false : true)
  : false
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L453" />

Check if a type is `unknown`.

Unknown is the top type

- everything extends unknown (except any, which is special). So we check if unknown extends the type (only true for unknown and any), then exclude any using IsAny.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type T1 = IsUnknown<unknown> // true
type T2 = IsUnknown<any> // false
type T3 = IsUnknown<string> // false
type T4 = IsUnknown<never> // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isTypeWith`

```typescript
<reference>(reference: reference): <valueGiven>(value: ValidateIsSupertype<reference, valueGiven>) => value is reference extends valueGiven ? reference : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/type-guards.ts#L18" />

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[F]`</span> `isntTypeWith`

```typescript
<reference>(reference: reference): <valueGiven>(value: ValidateIsSupertype<reference, valueGiven>) => value is reference extends valueGiven ? Exclude<valueGiven, reference> : never
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/type-guards.ts#L41" />

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
