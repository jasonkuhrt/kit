# TypeScript Test Module

Type-level and value-level assertion utilities for testing TypeScript code.

## Core Concepts

### Two Testing Modes

This module supports two distinct testing modes:

#### TVA Mode (Type-Value-Arg)

Provide expected type, then pass a value to check:

```typescript
// Single call with value
A.exact<string>()('hello')

// Preserve literal types with .const()
A.exact<1>().const(1)
```

**Signature**: `<Expected>() => (value) => void`

#### TTA Mode (Type-Type-Arg)

Provide both expected and actual types:

```typescript
// Type-only check - no value
A.exact<string, string>()

// Fails - requires error parameter
A.exact<string, number>() // ❌ Expected 1 arguments, but got 0
```

**Signature**: `<Expected, Actual>() => void` (passes) or `<Expected, Actual>(error) => void` (fails)

### Error Feedback

When assertions fail, errors appear in parameter types:

```typescript
// TVA mode - error shows in value parameter type
A.exact<string>()(42)
// Parameter type becomes: { ERROR: "...", expected: string, actual: number }

// TTA mode - error parameter required
A.exact<string, number>()
// Must provide: (error: { ERROR: "...", expected: string, actual: number })
```

## Unary Relators

Relators that check properties of a single type (no comparison). Available at top-level and directly executable.

### `any` / `unknown` / `never`

Check if type is an edge case:

```typescript
Assert.any(x as any) // ✅
Assert.unknown(x as unknown) // ✅
Assert.never(x as never) // ✅

// With negation
Assert.not.any(x as string) // ✅

// Note: Also available under binary relators for backward compat
Assert.exact.any(x as any) // ✅ (same behavior)
```

### `empty`

Assert type is empty:

```typescript
Assert.empty([]) // ✅ empty array
Assert.empty('' as const) // ✅ empty string
Assert.empty({} as Record<string, never>) // ✅ empty object

// With negation
Assert.not.empty([1]) // ✅ not empty

// Common mistakes
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
not.exact<A, B> // NOT (A extends B AND B extends A)
not.sub<A, B> // NOT (B extends A)
not.equiv<A, B> // NOT (A equivalent to B)
```

## Extractors

### `awaited`

Extract and assert on promised type:

```typescript
awaited.is<number>()(Promise.resolve(1)) // OK
awaited.is<string>()(Promise.resolve(1)) // ❌
```

### `returned`

Extract and assert on return type:

```typescript
returned.is<number>()(() => 1) // OK
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
A.exact.indexed<number, Record<string, number>> // OK - value type is number
A.exact.indexed<Foo, { [k: string]: Foo }> // OK - value type is Foo

// Error: no index signature
A.exact.indexed<string, { name: string }> // ❌ Error - no index signature
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
type _ = A.Case<Equal<string, string>> // OK

// Multiple assertions
type _ = A.Cases<
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

A.exact<1>()(x) // OK - x is type 1
```

Use `.const()` method for explicit literal preservation:

```typescript
A.exact<1>().const(1) // Preserves literal 1
```

### Never Detection

Passing `never` to non-never assertions requires explicit error parameter:

```typescript
A.exact<number>()(null as never)
// ❌ Requires: (error: NeverNotAllowedError)

A.exact<never>()(null as never) // OK
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

Key length configured via `KitLibrarySettings.A.errorKeyLength`.

````ts
/**
 * Type-level assertion utilities for testing type correctness.
 *
 * ## The Chaining API
 *
 * All assertions follow a consistent, compositional pattern:
 *
 * ```typescript
 * A[.not].<relation>.<extractor?>.<extractor?>...<TypeParams>
 * ```
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
 * type _ = A.Cases<
 *   A.exact<string, string>,                    // Plain relation
 *   A.sub.awaited<User, Promise<AdminUser>>,    // With extractor
 *   A.exact.returned.awaited<Data, AsyncFn>,    // Chained extractors
 *   A.not.equiv<string, number>                 // Negation
 * >
 *
 * // Value Level (requires .is for identity)
 * A.exact.of.as<string>()(value)
 * A.sub.awaited<number>()(promise)
 * A.exact.returned.awaited<User>()(asyncFn)
 * A.not.sub.of.as<number>()(value)
 * ```
 *
 * ## Relations
 *
 * ### `exact` - Structural Equality
 * Types must be structurally identical. Most strict assertion.
 *
 * ```typescript
 * type T = A.exact<string, string>           // ✓ Pass
 * type T = A.exact<1 | 2, 2 | 1>             // ✗ Fail (different structure)
 * type T = A.exact<string & {}, string>      // ✗ Fail (different structure)
 * ```
 *
 * ### `equiv` - Mutual Assignability (Semantic Equality)
 * Types must be mutually assignable (compute to the same result).
 *
 * ```typescript
 * type T = A.equiv<1 | 2, 2 | 1>             // ✓ Pass (same computed type)
 * type T = A.equiv<string & {}, string>      // ✓ Pass (both compute to string)
 * type T = A.equiv<string, number>           // ✗ Fail (not mutually assignable)
 * ```
 *
 * ### `sub` - Subtype Checking
 * Actual must extend Expected. Most commonly used relation.
 *
 * ```typescript
 * type T = A.sub<string, 'hello'>            // ✓ Pass ('hello' extends string)
 * type T = A.sub<object, { a: 1 }>           // ✓ Pass (more specific extends less)
 * type T = A.sub<'hello', string>            // ✗ Fail (string doesn't extend 'hello')
 * ```
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
 * type T = A.equiv.Never<never>              // ✓ Pass
 * A.exact.any()(value)                       // Value level (lowercase)
 * ```
 *
 * ### Containers
 * - `.array<Element, T>` - Check array element type
 * - `.tuple<[...], T>` - Check tuple structure
 * - `.indexed<Element, T>` - Extract value type from index signature
 *
 * ```typescript
 * type T = A.sub.array<number, (1 | 2 | 3)[]>  // ✓ Pass
 * type T = A.exact.indexed<number, Record<string, number>>  // ✓ Pass
 * ```
 *
 * ### Transformations (Chainable)
 * - `.awaited` - Extract resolved type from Promise
 * - `.returned` - Extract return type from function
 *
 * **These are namespace-only** (not callable). Use `.is` for terminal checks:
 *
 * ```typescript
 * // Terminal check (explicit .is)
 * type T = A.exact.awaited.is<number, Promise<number>>
 * A.exact.returned.is<string>()(fn)
 *
 * // Chaining (nest extractors)
 * type T = A.exact.returned.awaited<User, () => Promise<User>>
 * A.sub.awaited.array<number>()(Promise.resolve([1, 2, 3]))
 * ```
 *
 * ### Functions
 * - `.parameter<X, F>` - First parameter (most common)
 * - `.parameter1-5<X, F>` - Specific parameter position
 * - `.parameters<[...], F>` - Full parameter tuple
 *
 * ```typescript
 * type T = A.exact.parameter<string, (x: string) => void>
 * type T = A.sub.parameter2<number, (a: string, b: number) => void>
 * ```
 *
 * ### Objects
 * - `.properties<Props, T>` - Check specific properties (ignores others)
 *
 * ```typescript
 * type Config = { id: string; name: string; debug: boolean }
 * type T = A.exact.properties<{ id: string }, Config>  // ✓ Pass
 * ```
 *
 * ### Modifiers
 * - `.noExcess<A, B>` - Additionally check for no excess properties
 *
 * **`sub.noExcess`** - Most common use case (config validation with narrowing):
 * ```typescript
 * type Options = { timeout?: number; retry?: boolean }
 * type T = A.sub.noExcess<Options, { timeout: 5000, retry: true }>  // ✓ Allows literals
 * type T = A.sub.noExcess<Options, { timeout: 5000, retrys: true }> // ✗ Catches typo!
 * ```
 *
 * **`equiv.noExcess`** - Special case (optional property typos in equiv types):
 * ```typescript
 * type Schema = { id: number; email?: string }
 * type Response = { id: number; emial?: string }  // Typo!
 * type T = A.equiv<Schema, Response>          // ✓ Pass (mutually assignable)
 * type T = A.equiv.noExcess<Schema, Response> // ✗ Fail (catches typo!)
 * ```
 *
 * ## Negation
 *
 * The `.not` namespace mirrors the entire API structure:
 *
 * ```typescript
 * // Negate any assertion
 * type T = A.not.exact<string, number>             // ✓ Pass (different)
 * type T = A.not.sub.awaited<X, Promise<Y>>        // ✓ Pass if Y doesn't extend X
 * A.not.exact.returned.awaited<X>()(fn)            // Value level
 * ```
 *
 * ## Value Level vs Type Level
 *
 * **Type Level**: Use relations and extractors directly as types
 * ```typescript
 * type T = A.exact<A, B>
 * type T = A.sub.awaited<X, Promise<Y>>
 * ```
 *
 * **Value Level**: Relations require `.is`, extractors work directly
 * ```typescript
 * // Relations need .is for identity
 * A.exact.of.as<string>()(value)    // ✓ Use .is
 * A.exact<string>()(value)       // ✗ Error - exact is not callable!
 *
 * // Extractors work directly
 * A.exact.awaited<X>()(promise)  // ✓ Works
 *
 * // Chained extractors use .is for terminal
 * A.exact.returned.is<X>()(fn)            // Terminal check
 * A.exact.returned.awaited<X>()(fn)       // Chained check
 * ```
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
 * type T = A.exact<Expected, Actual>
 * // Error includes:
 * // diff: {
 * //   missing: { age: number }
 * //   excess: { email: string }
 * //   mismatched: { id: { expected: string, actual: number } }
 * // }
 * ```
 *
 * ## Configuration
 *
 * Assertion behavior can be configured via global settings.
 * See {@link KitLibrarySettings.A} for available options.
 *
 * @example
 * ```typescript
 * // Enable strict linting in your project
 * // types/kit-settings.d.ts
 * declare global {
 *   namespace KitLibrarySettings {
 *     namespace Ts {
 *       namespace Test {
 *         interface Settings {
 *           lintBidForExactPossibility: true
 *         }
 *       }
 *     }
 *   }
 * }
 * export {}
 * ```
 */
````
