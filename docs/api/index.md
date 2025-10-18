# API Reference

Browse the complete API documentation for @wollybeard/kit.

## [Arr](/api/arr)

Array utilities for working with readonly and mutable arrays.

## [Err](/api/err)

Error handling utilities for robust error management.

## [Fn](/api/fn)

Function utilities for functional programming patterns.

## [Html](/api/html)

HTML utility functions for escaping and working with HTML content.

## [Json](/api/json)

JSON utilities with Effect Schema integration.

## [Num](/api/num)

Numeric types and utilities with branded types for mathematical constraints.

- [`BigInteger`](/api/num/biginteger)
- [`Complex`](/api/num/complex)
- [`Degrees`](/api/num/degrees)
- [`Even`](/api/num/even)
- [`Finite`](/api/num/finite)
- [`Float`](/api/num/float)
- [`Frac`](/api/num/frac)
- [`InRange`](/api/num/inrange)
- [`Int`](/api/num/int)
- [`Natural`](/api/num/natural)
- [`Negative`](/api/num/negative)
- [`NonNegative`](/api/num/nonnegative)
- [`NonPositive`](/api/num/nonpositive)
- [`NonZero`](/api/num/nonzero)
- [`Odd`](/api/num/odd)
- [`Percentage`](/api/num/percentage)
- [`Positive`](/api/num/positive)
- [`Prime`](/api/num/prime)
- [`Radians`](/api/num/radians)
- [`Ratio`](/api/num/ratio)
- [`SafeInt`](/api/num/safeint)
- [`Whole`](/api/num/whole)
- [`Zero`](/api/num/zero)

## [Obj](/api/obj)

Object utilities for working with plain JavaScript objects.

- [`PropertySignature`](/api/obj/propertysignature)
- [`Union`](/api/obj/union) - Union operations on objects.

This module provides utilities for working with unions of object types, solving common TypeScript limitations when dealing with union types:

- `keyof (A | B)` returns only common keys (intersection), not all keys (union) - `(A | B)['key']` returns `any` for keys not in all members - No built-in way to merge union members while preserving value unions per key

These utilities use distributive conditional types to properly handle each union member separately, then combine the results.

## [Prom](/api/prom)

Promise utilities for asynchronous operations.

## [Rec](/api/rec)

Record utilities for working with plain JavaScript objects as dictionaries.

## [Str](/api/str)

String utilities for text manipulation and analysis.

- [`AxisHand`](/api/str/axishand)
- [`Case`](/api/str/case)
- [`Char`](/api/str/char) - Uppercase letter.
- [`Code`](/api/str/code) - Code generation and documentation utilities.

Provides tools for generating markdown, TSDoc/JSDoc, and TypeScript code. Includes safe JSDoc generation with escaping, builder API, and structured tag helpers.

- [`Nat`](/api/str/nat)
- [`Text`](/api/str/text) - Multi-line text formatting and layout utilities.

Provides functions specifically for working with multi-line strings treated as text content: - **Line operations**: Split into lines, join lines, map transformations per line - **Indentation**: Add/remove indentation, strip common leading whitespace - **Alignment**: Pad text, span to width, fit to exact width - **Block formatting**: Format blocks with prefixes, styled borders

**Use Text for**: Operations that treat strings as multi-line content with visual layout (indentation, padding for tables, line-by-line transformations).

**Use root Str for**: Primitive string operations (split, join, replace, match, trim) that work on strings as atomic values.

- [`Tpl`](/api/str/tpl)
- [`Visual`](/api/str/visual) - Visual-aware string utilities that handle ANSI escape codes and grapheme clusters.

These functions measure and manipulate strings based on their visual appearance, not raw character count. Useful for terminal output, tables, and formatted text.

## [Test](/api/test)

Enhanced test utilities for table-driven testing with Vitest.

- [`Test`](/api/test/test) - Enhanced test utilities for table-driven testing with Vitest.

Provides builder API and type-safe utilities for parameterized tests with built-in support for todo, skip, and only cases.

## [Ts](/api/ts)

TypeScript type utilities and type-level programming helpers.

- [`Assert`](/api/ts/assert) - # TypeScript Test Module

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

- [`Kind`](/api/ts/kind) - Higher-kinded type utilities for type-level programming. Provides type-level functions and utilities for simulating higher-kinded types in TypeScript.
- [`Relation`](/api/ts/relation)
- [`SENTINEL`](/api/ts/sentinel) - Utilities for working with the SENTINEL type.
- [`SimpleSignature`](/api/ts/simplesignature) - Utilities for working with the `__simpleSignature` phantom type pattern. Allows complex generic functions to provide simpler signatures for type inference.
- [`Union`](/api/ts/union) - Utilities for working with union types at the type level.
- [`VariancePhantom`](/api/ts/variancephantom) - Phantom type helpers for controlling type variance (covariance, contravariance, invariance, bivariance).

## [Value](/api/value)

General value utilities for common JavaScript values and patterns.

## [Paka](/api/paka)

# Paka Documentation Extractor

- [`Adaptors`](/api/paka/adaptors)
- [`Extractor`](/api/paka/extractor)
