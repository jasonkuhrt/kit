# Ts.Assert

# TypeScript Test Module

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

## Unary Relators

Relators that check properties of a single type (no comparison). Available at top-level and directly executable.

### `any` / `unknown` / `never`

Check if type is an edge case:

```typescript
// [!code word:any:1]
Assert.any(x as any) // ✅
// [!code word:unknown:1]
Assert.unknown(x as unknown) // ✅
// [!code word:never:1]
Assert.never(x as never) // ✅

// With negation
// [!code word:any:1]
Assert.not.any(x as string) // ✅

// Note: Also available under binary relators for backward compat
// [!code word:any:1]
Assert.exact.any(x as any) // ✅ (same behavior)
```

### `empty`

Assert type is empty:

```typescript
// [!code word:empty:1]
Assert.empty([]) // ✅ empty array
// [!code word:empty:1]
Assert.empty('' as const) // ✅ empty string
// [!code word:empty:1]
Assert.empty({} as Record<string, never>) // ✅ empty object

// With negation
// [!code word:empty:1]
Assert.not.empty([1]) // ✅ not empty

// Common mistakes
// [!code word:empty:1]
Assert.empty({}) // ❌ {} = non-nullish!
```

**Important:** `{}` means "non-nullish", not empty. Use `Record<PropertyKey, never>`.

## Binary Relators

Binary relators compare two types (expected vs actual).

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
parameter<string>()((x: string) => {}) // OK
parameter2<number>()((a: string, b: number) => {}) // OK (2nd param)
parameters<[string, number]>()((x: string, y: number) => {}) // OK (all)
```

## Special Types (Legacy - see Unary Relators above)

These matchers are available under binary relators for backward compatibility, but work identically to their top-level unary relator counterparts.

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

Extract and assert on index signature value type:

```typescript
// For types with string index signatures
A.exact.indexed<number, Record<string, number>>  // OK - value type is number
A.exact.indexed<Foo, { [k: string]: Foo }>       // OK - value type is Foo

// Error: no index signature
A.exact.indexed<string, { name: string }>        // Error - no index signature
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
 * - `.indexed<Element, T>` - Extract value type from index signature
 *
 * ```typescript
// [!code word:array:1]
 * type T = Ts.Assert.sub.array<number, (1 | 2 | 3)[]>  // ✓ Pass
// [!code word:indexed:1]
  * type T = Ts.Assert.exact.indexed<number, Record<string, number>>  // ✓ Pass
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
 * See {@link KitLibrarySettings.Ts.Assert} for available options.
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

## Import

::: code-group

```typescript [Namespace]
import { Ts } from '@wollybeard/kit'

// Access via namespace
Ts.Assert
```

```typescript [Barrel]
import { Assert } from '@wollybeard/kit/ts'
```

:::

## Namespaces

| Namespace                                     | Description |
| --------------------------------------------- | ----------- |
| [**`array`**](/api/ts/assert/array)           | —           |
| [**`awaited`**](/api/ts/assert/awaited)       | —           |
| [**`equiv`**](/api/ts/assert/equiv)           | —           |
| [**`exact`**](/api/ts/assert/exact)           | —           |
| [**`not`**](/api/ts/assert/not)               | —           |
| [**`parameter1`**](/api/ts/assert/parameter1) | —           |
| [**`parameter2`**](/api/ts/assert/parameter2) | —           |
| [**`parameter3`**](/api/ts/assert/parameter3) | —           |
| [**`parameter4`**](/api/ts/assert/parameter4) | —           |
| [**`parameter5`**](/api/ts/assert/parameter5) | —           |
| [**`parameters`**](/api/ts/assert/parameters) | —           |
| [**`returned`**](/api/ts/assert/returned)     | —           |
| [**`sub`**](/api/ts/assert/sub)               | —           |

## Utils

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `StaticErrorAssertion`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/assertion-error.ts#L40" /> {#t-static-error-assertion-40}

```typescript
type StaticErrorAssertion<
  $Message extends string = string,
  $Expected = unknown,
  $Actual = unknown,
  $MetaInput extends MetaInput = never,
  ___$ErrorKeyLength extends number =
    KitLibrarySettings.Ts.Error['errorKeyLength'],
> = Ts.Err.StaticError<
  $Message,
  {
    expected: $Expected
    actual: $Actual
  } & NormalizeMetaInput<$MetaInput>,
  readonly ['root', 'assert', ...string[]]
>
```

Represents a static assertion error at the type level, optimized for type testing.

This is a simpler, more focused error type compared to Ts.StaticError. It's specifically designed for type assertions where you need to communicate expected vs. actual types.

Supports three forms of metadata:

- Single string tip: `StaticErrorAssertion<'msg', E, A, 'tip'>`
- Tuple of tips: `StaticErrorAssertion<'msg', E, A, ['tip1', 'tip2']>`
- Metadata object: `StaticErrorAssertion<'msg', E, A, { custom: 'data' }>`
- Object with tip: `StaticErrorAssertion<'msg', E, A, { tip: 'advice', ...meta }>`

$Message

- A string literal type describing the assertion failure

$Expected

- The expected type

$Actual

- The actual type that was provided

$MetaInput

- Optional metadata: string tip, tuple of tips, or object with custom fields

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
// Simple error with message only
type E1 = StaticErrorAssertion<'Types mismatch', string, number>

// With a single tip
type E2 = StaticErrorAssertion<
  'Types mismatch',
  string,
  number,
  'Use String() to convert'
>

// With multiple tips
type E3 = StaticErrorAssertion<
  'Types mismatch',
  string,
  number,
  ['Tip 1', 'Tip 2']
>

// With metadata object
type E4 = StaticErrorAssertion<
  'Types mismatch',
  string,
  number,
  { operation: 'concat' }
>

// With tip and metadata
type E5 = StaticErrorAssertion<
  'Types mismatch',
  string,
  number,
  { tip: 'Use String()'; diff_missing: { x: number } }
>
```

## Other

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `any`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/$$.ts#L8" /> {#c-any-8}

```typescript
InputActualForUnaryRelatorNarrow<State.Empty, 'any'>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `unknown`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/$$.ts#L9" /> {#c-unknown-9}

```typescript
InputActualForUnaryRelatorNarrow<State.Empty, 'unknown'>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `never`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/$$.ts#L10" /> {#c-never-10}

```typescript
InputActualForUnaryRelatorNarrow<State.Empty, 'never'>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `empty`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/$$.ts#L11" /> {#c-empty-11}

```typescript
InputActualForUnaryRelatorNarrow<State.Empty, 'empty'>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `on`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/$$.ts#L14" /> {#c-on-14}

```typescript
InputActualAsValueNarrow<State.Empty>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `onAs`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/$$.ts#L15" /> {#c-on-as-15}

```typescript
InputActualAsType<State.Empty>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `inferNarrow`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/$$.ts#L18" /> {#c-infer-narrow-18}

```typescript
Builder<State.SetInferMode<State.Empty, 'narrow'>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `inferWide`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/$$.ts#L19" /> {#c-infer-wide-19}

```typescript
Builder<State.SetInferMode<State.Empty, 'wide'>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `inferAuto`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/$$.ts#L20" /> {#c-infer-auto-20}

```typescript
Builder<State.SetInferMode<State.Empty, 'auto'>>
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[C]`</span> `setInfer`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/$$.ts#L21" /> {#c-set-infer-21}

```typescript
;(<$Mode>(mode: $Mode) => Builder<State.SetInferMode<State.Empty, $Mode>>)
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Case`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/cases.ts#L29" /> {#t-case-29}

```typescript
type Case<$Result extends never> = $Result
```

Type-level test assertion that requires the result to be never (no error). Used in type-level test suites to ensure a type evaluates to never (success).

Generally prefer value-level API instead.

**Problem**: Individual `Case<>` assertions don't actually catch type errors at compile time due to internal casting. Errors only appear when wrapped in `Cases<>`, which has its own issues.

**Better Alternative**: Use value-level API which reports ALL errors simultaneously:

```ts
// ❌ Type-level
- doesn't catch errors reliably
type _ = Ts.Assert.Case<Assert.exact<string, number>>

// May silently pass!

// ✅ Value-level
- shows all errors
Assert.exact.ofAs<string>().onAs<number>()

// Error shown immediately
```

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type MyTests = [
  Ts.Assert.Case<Equal<string, string>>, // OK - evaluates to never (success)
  Ts.Assert.Case<Equal<string, number>>, // Error - doesn't extend never (returns error)
]
```

### <span style="opacity: 0.6; font-weight: normal; font-size: 0.85em;">`[T]`</span> `Cases`<SourceLink inline href="https://github.com/jasonkuhrt/kit/blob/main/./src/utils/ts/assert/cases.ts#L91" /> {#t-cases-91}

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

Type-level batch assertion helper that accepts multiple assertions. Each type parameter must extend never (no error), allowing batch type assertions.

Generally prefer value-level API instead.

**Fatal Flaw**: TypeScript **short-circuits on the first failing assertion** and never evaluates remaining parameters. With dozens of test cases, this makes debugging extremely slow

- you fix one error, run again, see the next error, fix it, repeat.

**This is a fundamental TypeScript limitation and cannot be fixed.**

**Better Alternative**: Use value-level API which reports ALL errors simultaneously:

```ts
// ❌ Type-level Cases
- only shows FIRST error
type _ = Ts.Assert.Cases<


Assert.exact<string, string>,

 // ✓ Pass


Assert.exact<number, string>,

 // ✗ ERROR
- TypeScript stops here!


Assert.exact<boolean, boolean>, // Never checked
- you won't see errors here


Assert.exact<symbol, string>



// Never checked
- you won't see errors here
>

// ✅ Value-level
- shows ALL errors at once
Assert.exact.ofAs<string>().onAs<string>()

 // ✓ Pass
Assert.exact.ofAs<number>().onAs<string>()

 // ✗ Error shown
Assert.exact.ofAs<boolean>().onAs<boolean>() // ✓ Pass
Assert.exact.ofAs<symbol>().onAs<string>()

 // ✗ Error shown (both line 2 and 4 visible!)

// Alternative: Individual type aliases (also shows all errors)
type _pass1 = Assert.exact.of<string, string>
type _fail1 = Assert.exact.of<number, string>

// Error shown
type _pass2 = Assert.exact.of<boolean, boolean>
type _fail2 = Assert.exact.of<symbol, string>

// Error shown (all errors visible)
```

**Additional Limitations**:

- Limited to 100 type parameters (arbitrary hard limit)
- Cannot be aliased for brevity
- Worse error messages than value-level API

**Only use this if explicitly instructed**

- kept for backward compatibility only.

**Examples:**

```typescript twoslash
// @noErrors
import { Ts } from '@wollybeard/kit/ts'
// ---cut---
type _ = Ts.Assert.Cases<
  Equal<string, string>, // ✓ Pass (returns never)
  Extends<string, 'hello'>, // ✓ Pass (returns never)
  Never<never> // ✓ Pass (returns never)
>

// Type error if any assertion fails
type _ = Ts.Assert.Cases<
  Equal<string, string>, // ✓ Pass (returns never)
  Equal<string, number>, // ✗ Fail - Type error here (returns StaticErrorAssertion)
  Extends<string, 'hello'> // ✓ Pass (returns never)
>
```
