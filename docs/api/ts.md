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
- [**`Assert`**](/api/ts/assert) - # TypeScript Test Module

Type-level and value-level assertion utilities for testing TypeScript code.

## Core Concepts

### Two Testing Modes

This module supports two distinct testing modes:

#### TVA Mode (Type-Value-Arg)

Provide expected type, then pass a value to check:

```typescript
// Single call with value
// [!code word:exact:1]
Ts.Assert.exact<string>()('hello')

// Preserve literal types with .const()
// [!code word:exact:1]
Ts.Assert.exact<1>().const(1)
```

**Signature**: `<Expected>() => (value) => void`

#### TTA Mode (Type-Type-Arg)

Provide both expected and actual types:

```typescript
// Type-only check - no value
// [!code word:exact:1]
Ts.Assert.exact<string, string>()

// Fails - requires error parameter
// [!code word:exact:1]
Ts.Assert.exact<string, number>() // ❌ Expected 1 arguments, but got 0
```

**Signature**: `<Expected, Actual>() => void` (passes) or `<Expected, Actual>(error) => void` (fails)

### Error Feedback

When assertions fail, errors appear in parameter types:

```typescript
// TVA mode - error shows in value parameter type
// [!code word:exact:1]
Ts.Assert.exact<string>()(42)
// Parameter type becomes: { ERROR: "...", expected: string, actual: number }

// TTA mode - error parameter required
// [!code word:exact:1]
Ts.Assert.exact<string, number>()
// Must provide: (error: { ERROR: "...", expected: string, actual: number })
```

## Relations

### `exact`

Types must be exactly equal (mutual subtype):

```typescript
exact<A, B> // A extends B AND B extends A
```

### `sub`

Actual must be subtype of expected:

```typescript
sub<A, B> // B extends A
```

### `equiv`

Types are equivalent (ignoring excess properties):

```typescript
equiv<A, B> // A and B have same structure, allow excess
```

### `not.*`

Negated relations:

```typescript
// [!code word:exact:1]
not.exact<A, B> // NOT (A extends B AND B extends A)
// [!code word:sub:1]
not.sub<A, B> // NOT (B extends A)
// [!code word:equiv:1]
not.equiv<A, B> // NOT (A equivalent to B)
```

## Extractors

### `awaited`

Extract and assert on promised type:

```typescript
// [!code word:is:1]
// [!code word:resolve:1]
awaited.is<number>()(Promise.resolve(1)) // OK
// [!code word:is:1]
// [!code word:resolve:1]
awaited.is<string>()(Promise.resolve(1)) // ❌
```

### `returned`

Extract and assert on return type:

```typescript
// [!code word:is:1]
returned.is<number>()(() => 1) // OK
// [!code word:awaited:1]
// [!code word:resolve:1]
returned.awaited<string>()(() => Promise.resolve('x')) // OK
```

### `parameter`

Assert on function parameter type:

```typescript
parameter<string>()((x: string) => { }) // OK
parameter2<number>()((a: string, b: number) => { }) // OK (2nd param)
parameters<[string, number]>()((x: string, y: number) => { }) // OK (all)
```

## Special Types

### `never`

Unary assertion - expects never type:

```typescript
never()(null as never) // OK
never<never>() // OK (TTA mode)
never<string>() // ❌
```

### `any` / `unknown`

Unary assertions for special types:

```typescript
any()(null as any) // OK
unknown()(null as unknown) // OK
```

### `empty`

Assert array/object is empty:

```typescript
empty()([]) // OK
empty()({}) // OK
empty()([1]) // ❌
```

## Collection Types

### `array`

Assert on array element type:

```typescript
array<string>()(['a', 'b']) // OK
```

### `tuple`

Assert exact tuple type:

```typescript
tuple<[string, number]>()(['a', 1]) // OK
```

### `indexed`

Assert type at specific index:

```typescript
indexed<0, string>()(['a', 1]) // OK - first element is string
```

## Properties

### `properties`

Assert object has required properties (allows excess):

```typescript
properties<{ id: string }>()({ id: '1', name: 'test' }) // OK
```

## Type-Level Testing

For batch type assertions in test files:

```typescript
// Single assertion - must extend never (pass)
type _ = Ts.Assert.Case<Equal<string, string>> // OK

// Multiple assertions
type _ = Ts.Assert.Cases<
  Equal<string, string>, // ✓
  Sub<'hello', string>, // ✓
  Exact<number, number> // ✓
>
```

## Technical Details

### Literal Type Preservation

Scalars with `as const` preserve their literal types when passed to generics:

```typescript
const x = 1 as const
type T = typeof x // 1 (not number)

// [!code word:exact:1]
Ts.Assert.exact<1>()(x) // OK - x is type 1
```

Use `.const()` method for explicit literal preservation:

```typescript
// [!code word:exact:1]
Ts.Assert.exact<1>().const(1) // Preserves literal 1
```

### Never Detection

Passing `never` to non-never assertions requires explicit error parameter:

```typescript
// [!code word:exact:1]
Ts.Assert.exact<number>()(null as never)
// ❌ Requires: (error: NeverNotAllowedError)

// [!code word:exact:1]
Ts.Assert.exact<never>()(null as never) // OK
```

### Error Messages

Error objects use aligned keys for readability:

```typescript
{
  ERROR_________: 'Types are not exactly equal'
  expected______: string
  actual________: number
}
```

Key length configured via `KitLibrarySettings.Ts.Assert.errorKeyLength`.

````ts
/**
 * Type-level assertion utilities for testing type correctness.
 *
 * ## The Chaining API
 *
 * All assertions follow a consistent, compositional pattern:
 *
 * ```typescript
// [!code word:Assert:1]
// [!code word:not:1]
 * Ts.Assert[.not].<relation>.<extractor?>.<extractor?>...<TypeParams>
 * 
```
 *
 * Where:
 * - **Relation**: `exact` (structural equality), `equiv` (mutual assignability), `sub` (subtype)
 * - **Extractor**: Optional transformation (`.awaited`, `.returned`, `.parameter`, etc.)
 * - **Negation**: Optional `.not` prefix negates the assertion
 *
 * ## Quick Examples
 *
 * ```typescript
 * // Type Level
// [!code word:Cases:1]
 * type _ = Ts.Assert.Cases <
// [!code word:exact:1]
 * Ts.Assert.exact<string, string>,                    // Plain relation
// [!code word:awaited:1]
 * Ts.Assert.sub.awaited<User, Promise<AdminUser>>,    // With extractor
// [!code word:awaited:1]
 * Ts.Assert.exact.returned.awaited<Data, AsyncFn>,    // Chained extractors
// [!code word:equiv:1]
 * Ts.Assert.not.equiv<string, number>                 // Negation
  * >
 *
 * // Value Level (requires .is for identity)
// [!code word:as:1]
 * Ts.Assert.exact.of.as<string>()(value)
// [!code word:awaited:1]
  * Ts.Assert.sub.awaited<number>()(promise)
// [!code word:awaited:1]
  * Ts.Assert.exact.returned.awaited<User>()(asyncFn)
// [!code word:as:1]
  * Ts.Assert.not.sub.of.as<number>()(value)
  * 
```
 *
 * ## Relations
 *
 * ### `exact` - Structural Equality
 * Types must be structurally identical. Most strict assertion.
 *
 * ```typescript
// [!code word:exact:1]
 * type T = Ts.Assert.exact<string, string>           // ✓ Pass
// [!code word:exact:1]
  * type T = Ts.Assert.exact<1 | 2, 2 | 1>             // ✗ Fail (different structure)
// [!code word:exact:1]
    * type T = Ts.Assert.exact<string & {}, string>      // ✗ Fail (different structure)
      * 
```
 *
 * ### `equiv` - Mutual Assignability (Semantic Equality)
 * Types must be mutually assignable (compute to the same result).
 *
 * ```typescript
// [!code word:equiv:1]
 * type T = Ts.Assert.equiv<1 | 2, 2 | 1>             // ✓ Pass (same computed type)
// [!code word:equiv:1]
  * type T = Ts.Assert.equiv<string & {}, string>      // ✓ Pass (both compute to string)
// [!code word:equiv:1]
    * type T = Ts.Assert.equiv<string, number>           // ✗ Fail (not mutually assignable)
      * 
```
 *
 * ### `sub` - Subtype Checking
 * Actual must extend Expected. Most commonly used relation.
 *
 * ```typescript
// [!code word:sub:1]
 * type T = Ts.Assert.sub<string, 'hello'>            // ✓ Pass ('hello' extends string)
// [!code word:sub:1]
  * type T = Ts.Assert.sub<object, { a: 1 }>           // ✓ Pass (more specific extends less)
// [!code word:sub:1]
    * type T = Ts.Assert.sub<'hello', string>            // ✗ Fail (string doesn't extend 'hello')
      * 
```
 *
 * ## Extractors
 *
 * Extractors transform types before applying the relation check.
 *
 * ### Special Types
 * - `.Never<T>` / `.never()` - Check if type is `never` (type-level uses PascalCase due to keyword)
 * - `.Any<T>` / `.any()` - Check if type is `any`
 * - `.Unknown<T>` / `.unknown()` - Check if type is `unknown`
 * - `.empty<T>` - Check if type is empty ([], '', or empty object)
 *
 * ```typescript
// [!code word:Never:1]
 * type T = Ts.Assert.equiv.Never<never>              // ✓ Pass
// [!code word:any:1]
  * Ts.Assert.exact.any()(value)                       // Value level (lowercase)
  * 
```
 *
 * ### Containers
 * - `.array<Element, T>` - Check array element type
 * - `.tuple<[...], T>` - Check tuple structure
 * - `.indexed<N, Element, T>` - Check specific array/tuple element
 *
 * ```typescript
// [!code word:array:1]
 * type T = Ts.Assert.sub.array<number, (1 | 2 | 3)[]>  // ✓ Pass
// [!code word:indexed:1]
  * type T = Ts.Assert.exact.indexed<0, string, [string, number]>  // ✓ Pass
    * 
```
 *
 * ### Transformations (Chainable)
 * - `.awaited` - Extract resolved type from Promise
 * - `.returned` - Extract return type from function
 *
 * **These are namespace-only** (not callable). Use `.is` for terminal checks:
 *
 * ```typescript
 * // Terminal check (explicit .is)
// [!code word:is:1]
 * type T = Ts.Assert.exact.awaited.is<number, Promise<number>>
// [!code word:is:1]
  * Ts.Assert.exact.returned.is<string>()(fn)
  *
 * // Chaining (nest extractors)
// [!code word:awaited:1]
 * type T = Ts.Assert.exact.returned.awaited<User, () => Promise<User>>
// [!code word:array:1]
// [!code word:resolve:1]
  * Ts.Assert.sub.awaited.array<number>()(Promise.resolve([1, 2, 3]))
  * 
```
 *
 * ### Functions
 * - `.parameter<X, F>` - First parameter (most common)
 * - `.parameter1-5<X, F>` - Specific parameter position
 * - `.parameters<[...], F>` - Full parameter tuple
 *
 * ```typescript
// [!code word:parameter:1]
 * type T = Ts.Assert.exact.parameter<string, (x: string) => void>
// [!code word:parameter2:1]
  * type T = Ts.Assert.sub.parameter2<number, (a: string, b: number) => void>
    * 
```
 *
 * ### Objects
 * - `.properties<Props, T>` - Check specific properties (ignores others)
 *
 * ```typescript
 * type Config = { id: string; name: string; debug: boolean }
// [!code word:properties:1]
  * type T = Ts.Assert.exact.properties<{ id: string }, Config>  // ✓ Pass
    * 
```
 *
 * ### Modifiers
 * - `.noExcess<A, B>` - Additionally check for no excess properties
 *
 * **`sub.noExcess`** - Most common use case (config validation with narrowing):
 * ```typescript
 * type Options = { timeout?: number; retry?: boolean }
// [!code word:noExcess:1]
  * type T = Ts.Assert.sub.noExcess<Options, { timeout: 5000, retry: true }>  // ✓ Allows literals
// [!code word:noExcess:1]
    * type T = Ts.Assert.sub.noExcess<Options, { timeout: 5000, retrys: true }> // ✗ Catches typo!
      * 
```
 *
 * **`equiv.noExcess`** - Special case (optional property typos in equiv types):
 * ```typescript
 * type Schema = { id: number; email?: string }
  * type Response = { id: number; emial?: string }  // Typo!
// [!code word:equiv:1]
    * type T = Ts.Assert.equiv<Schema, Response>          // ✓ Pass (mutually assignable)
// [!code word:noExcess:1]
      * type T = Ts.Assert.equiv.noExcess<Schema, Response> // ✗ Fail (catches typo!)
        * 
```
 *
 * ## Negation
 *
 * The `.not` namespace mirrors the entire API structure:
 *
 * ```typescript
 * // Negate any assertion
// [!code word:exact:1]
 * type T = Ts.Assert.not.exact<string, number>             // ✓ Pass (different)
// [!code word:awaited:1]
  * type T = Ts.Assert.not.sub.awaited<X, Promise<Y>>        // ✓ Pass if Y doesn't extend X
// [!code word:awaited:1]
    * Ts.Assert.not.exact.returned.awaited<X>()(fn)            // Value level
    * 
```
 *
 * ## Value Level vs Type Level
 *
 * **Type Level**: Use relations and extractors directly as types
 * ```typescript
// [!code word:exact:1]
 * type T = Ts.Assert.exact<A, B>
// [!code word:awaited:1]
  * type T = Ts.Assert.sub.awaited<X, Promise<Y>>
    * 
```
 *
 * **Value Level**: Relations require `.is`, extractors work directly
 * ```typescript
 * // Relations need .is for identity
// [!code word:as:1]
 * Ts.Assert.exact.of.as<string>()(value)    // ✓ Use .is
// [!code word:exact:1]
  * Ts.Assert.exact<string>()(value)       // ✗ Error - exact is not callable!
  *
 * // Extractors work directly
// [!code word:awaited:1]
 * Ts.Assert.exact.awaited<X>()(promise)  // ✓ Works
  *
 * // Chained extractors use .is for terminal
// [!code word:is:1]
 * Ts.Assert.exact.returned.is<X>()(fn)            // Terminal check
// [!code word:awaited:1]
  * Ts.Assert.exact.returned.awaited<X>()(fn)       // Chained check
  * 
```
 *
 * ## Why `.is` for Identity?
 *
 * Relations (`exact`, `equiv`, `sub`) are **namespace-only** at value level to avoid
 * callable interfaces which pollute autocomplete with function properties (`call`, `apply`,
 * `bind`, `length`, `name`, etc.). Using `.is` keeps autocomplete clean and consistent.
 *
 * ## Type-Level Diff
 *
 * When comparing object types, failed assertions automatically include a `diff` field:
 *
 * ```typescript
 * type Expected = { id: string; name: string; age: number }
  * type Actual = { id: number; name: string; email: string }
    *
// [!code word:exact:1]
 * type T = Ts.Assert.exact<Expected, Actual>
  * // Error includes:
 * // diff: {
 * //   missing: { age: number }
 * //   excess: { email: string }
 * //   mismatched: { id: { expected: string, actual: number } }
 * // }
 * 
```
 *
 * ## Configuration
 *
 * Assertion behavior can be configured via global settings.
 * See {@link KitLibrarySettings.Ts.Assert.Settings} for available options.
 *
 * @example
 * ```typescript
 * // Enable strict linting in your project
 * // types/kit-settings.d.ts
 * declare global {
 * namespace KitLibrarySettings {
 * namespace Ts {
 * namespace Test {
 * interface Settings {
 * lintBidForExactPossibility: true
            *         }
 *       }
 *     }
 *   }
 * }
 * export { }
 * 
```
 */
````

- [**`Union`**](/api/ts/union) - Utilities for working with union types at the type level.
- [**`VariancePhantom`**](/api/ts/variance-phantom) - Phantom type helpers for controlling type variance (covariance, contravariance, invariance, bivariance).
- [**`SENTINEL`**](/api/ts/sentinel) - Utilities for working with the SENTINEL type.
- [**`Relation`**](/api/ts/relation)

## Error Messages

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
  { Expected, Actual }
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
type Result1 = Stringify<42>        // "42"
type Result2 = Stringify<true>      // "true"
type Result3 = Stringify<'hello'>   // "hello"
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
type AssertFn<$Expected, $Actual = SENTINEL> =
  Ts.SENTINEL.Is<$Actual> extends true
  ? <$actual>(value: $actual) => void  // Value mode
  : void                                // Type-only mode
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

## Utils

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

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `SimplifyNullable`

```typescript
type SimplifyNullable<$T> = null extends $T ? (Simplify<$T> & {}) | null : Simplify<$T> & {}
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
type Bad = Simplify<MaybeUser>  // May not preserve | null correctly

// Solution: SimplifyNullable preserves the null union
type Good = SimplifyNullable<MaybeUser>  // { name: string; age: number } | null
```

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Works with non-nullable types too
type Simple = SimplifyNullable<{ a: 1 } & { b: 2 }>  // { a: 1; b: 2 }

// Preserves null in unions
type Nullable = SimplifyNullable<({ a: 1 } & { b: 2 }) | null>  // { a: 1; b: 2 } | null
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `ExtendsExact`

```typescript
type ExtendsExact<$Input, $Constraint> =
  $Input extends $Constraint
  ? $Constraint extends $Input
  ? $Input
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
type Mutable = Writeable<Readonly>  // { x: number; y: string }
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IfExtendsElse`

```typescript
type IfExtendsElse<$Type, $Extends, $Then, $Else> = $Type extends $Extends ? $Then : $Else
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
type IntersectionIgnoreNeverOrAny<$T> = IsAny<$T> extends true ? unknown : $T extends never ? unknown : $T
```

<SourceLink href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/ts.ts#L405" />

Intersection that ignores never and any.

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `NeverOrAnyToUnknown`

```typescript
type NeverOrAnyToUnknown<$T> = IsAny<$T> extends true ? unknown : $T extends never ? unknown : $T
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
type AnyAndUnknownToNever<$T> = IsAny<$T> extends true ? never : IsUnknown<$T> extends true ? never : $T
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
type T1 = IsAny<any>      // true
type T2 = IsAny<unknown>  // false
type T3 = IsAny<string>   // false
type T4 = IsAny<never>    // false
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `IsUnknown`

```typescript
type IsUnknown<T> = unknown extends T ? (IsAny<T> extends true ? false : true) : false
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
type T1 = IsUnknown<unknown>  // true
type T2 = IsUnknown<any>      // false
type T3 = IsUnknown<string>   // false
type T4 = IsUnknown<never>    // false
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
