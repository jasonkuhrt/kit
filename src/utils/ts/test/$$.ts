/**
 * Type-level assertion utilities for testing type correctness.
 *
 * ## The Chaining API
 *
 * All assertions follow a consistent, compositional pattern:
 *
 * ```typescript
 * Ts.Test[.not].<relation>.<extractor?>.<extractor?>...<TypeParams>
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
 * type _ = Ts.Test.Cases<
 *   Ts.Test.exact<string, string>,                    // Plain relation
 *   Ts.Test.sub.awaited<User, Promise<AdminUser>>,    // With extractor
 *   Ts.Test.exact.returned.awaited<Data, AsyncFn>,    // Chained extractors
 *   Ts.Test.not.equiv<string, number>                 // Negation
 * >
 *
 * // Value Level (requires .is for identity)
 * Ts.Test.exact.is<string>()(value)
 * Ts.Test.sub.awaited<number>()(promise)
 * Ts.Test.exact.returned.awaited<User>()(asyncFn)
 * Ts.Test.not.sub.is<number>()(value)
 * ```
 *
 * ## Relations
 *
 * ### `exact` - Structural Equality
 * Types must be structurally identical. Most strict assertion.
 *
 * ```typescript
 * type T = Ts.Test.exact<string, string>           // ✓ Pass
 * type T = Ts.Test.exact<1 | 2, 2 | 1>             // ✗ Fail (different structure)
 * type T = Ts.Test.exact<string & {}, string>      // ✗ Fail (different structure)
 * ```
 *
 * ### `equiv` - Mutual Assignability (Semantic Equality)
 * Types must be mutually assignable (compute to the same result).
 *
 * ```typescript
 * type T = Ts.Test.equiv<1 | 2, 2 | 1>             // ✓ Pass (same computed type)
 * type T = Ts.Test.equiv<string & {}, string>      // ✓ Pass (both compute to string)
 * type T = Ts.Test.equiv<string, number>           // ✗ Fail (not mutually assignable)
 * ```
 *
 * ### `sub` - Subtype Checking
 * Actual must extend Expected. Most commonly used relation.
 *
 * ```typescript
 * type T = Ts.Test.sub<string, 'hello'>            // ✓ Pass ('hello' extends string)
 * type T = Ts.Test.sub<object, { a: 1 }>           // ✓ Pass (more specific extends less)
 * type T = Ts.Test.sub<'hello', string>            // ✗ Fail (string doesn't extend 'hello')
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
 * type T = Ts.Test.equiv.Never<never>              // ✓ Pass
 * Ts.Test.exact.any()(value)                       // Value level (lowercase)
 * ```
 *
 * ### Containers
 * - `.array<Element, T>` - Check array element type
 * - `.tuple<[...], T>` - Check tuple structure
 * - `.indexed<N, Element, T>` - Check specific array/tuple element
 *
 * ```typescript
 * type T = Ts.Test.sub.array<number, (1 | 2 | 3)[]>  // ✓ Pass
 * type T = Ts.Test.exact.indexed<0, string, [string, number]>  // ✓ Pass
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
 * type T = Ts.Test.exact.awaited.is<number, Promise<number>>
 * Ts.Test.exact.returned.is<string>()(fn)
 *
 * // Chaining (nest extractors)
 * type T = Ts.Test.exact.returned.awaited<User, () => Promise<User>>
 * Ts.Test.sub.awaited.array<number>()(Promise.resolve([1, 2, 3]))
 * ```
 *
 * ### Functions
 * - `.parameter<X, F>` - First parameter (most common)
 * - `.parameter1-5<X, F>` - Specific parameter position
 * - `.parameters<[...], F>` - Full parameter tuple
 *
 * ```typescript
 * type T = Ts.Test.exact.parameter<string, (x: string) => void>
 * type T = Ts.Test.sub.parameter2<number, (a: string, b: number) => void>
 * ```
 *
 * ### Objects
 * - `.properties<Props, T>` - Check specific properties (ignores others)
 *
 * ```typescript
 * type Config = { id: string; name: string; debug: boolean }
 * type T = Ts.Test.exact.properties<{ id: string }, Config>  // ✓ Pass
 * ```
 *
 * ### Modifiers
 * - `.noExcess<A, B>` - Additionally check for no excess properties
 *
 * **`sub.noExcess`** - Most common use case (config validation with narrowing):
 * ```typescript
 * type Options = { timeout?: number; retry?: boolean }
 * type T = Ts.Test.sub.noExcess<Options, { timeout: 5000, retry: true }>  // ✓ Allows literals
 * type T = Ts.Test.sub.noExcess<Options, { timeout: 5000, retrys: true }> // ✗ Catches typo!
 * ```
 *
 * **`equiv.noExcess`** - Special case (optional property typos in equiv types):
 * ```typescript
 * type Schema = { id: number; email?: string }
 * type Response = { id: number; emial?: string }  // Typo!
 * type T = Ts.Test.equiv<Schema, Response>          // ✓ Pass (mutually assignable)
 * type T = Ts.Test.equiv.noExcess<Schema, Response> // ✗ Fail (catches typo!)
 * ```
 *
 * ## Negation
 *
 * The `.not` namespace mirrors the entire API structure:
 *
 * ```typescript
 * // Negate any assertion
 * type T = Ts.Test.not.exact<string, number>             // ✓ Pass (different)
 * type T = Ts.Test.not.sub.awaited<X, Promise<Y>>        // ✓ Pass if Y doesn't extend X
 * Ts.Test.not.exact.returned.awaited<X>()(fn)            // Value level
 * ```
 *
 * ## Value Level vs Type Level
 *
 * **Type Level**: Use relations and extractors directly as types
 * ```typescript
 * type T = Ts.Test.exact<A, B>
 * type T = Ts.Test.sub.awaited<X, Promise<Y>>
 * ```
 *
 * **Value Level**: Relations require `.is`, extractors work directly
 * ```typescript
 * // Relations need .is for identity
 * Ts.Test.exact.is<string>()(value)    // ✓ Use .is
 * Ts.Test.exact<string>()(value)       // ✗ Error - exact is not callable!
 *
 * // Extractors work directly
 * Ts.Test.exact.awaited<X>()(promise)  // ✓ Works
 *
 * // Chained extractors use .is for terminal
 * Ts.Test.exact.returned.is<X>()(fn)            // Terminal check
 * Ts.Test.exact.returned.awaited<X>()(fn)       // Chained check
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
 * type T = Ts.Test.exact<Expected, Actual>
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
 * See {@link KitLibrarySettings.Ts.Test.Settings} for available options.
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

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━ Core Relations ━━━━━━━━━━━━━━━━━━━━━━━━━
//

/**
 * Exact relation - structural equality.
 *
 * At type level, use as type alias. At value level, use `.is` or extractors.
 *
 * @example
 * ```typescript
 * // Type level
 * type T = Ts.Test.exact<string, string>
 * type T = Ts.Test.exact.awaited<X, Promise<X>>
 *
 * // Value level
 * Ts.Test.exact.is<string>()(value)
 * Ts.Test.exact.awaited<X>()(promise)
 * ```
 */
export { exact } from './relations/exact.js'

/**
 * Equiv relation - mutual assignability (semantic equality).
 *
 * @example
 * ```typescript
 * type T = Ts.Test.equiv<string & {}, string>  // ✓ Pass
 * Ts.Test.equiv.is<number>()(value)
 * ```
 */
export { equiv } from './relations/equiv.js'

/**
 * Sub relation - subtype checking (most commonly used).
 *
 * @example
 * ```typescript
 * type T = Ts.Test.sub<string, 'hello'>  // ✓ Pass
 * Ts.Test.sub.is<number>()(value)
 * ```
 */
export { sub } from './relations/sub.js'

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━ Negation ━━━━━━━━━━━━━━━━━━━━━━━━━
//

/**
 * Negation namespace - mirrors entire API with negated checks.
 *
 * @example
 * ```typescript
 * type T = Ts.Test.not.exact<string, number>
 * type T = Ts.Test.not.sub.awaited<X, Promise<Y>>
 * Ts.Test.not.exact.is<number>()(value)
 * ```
 */
export { not } from './relations/not.js'

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━ Helper Types ━━━━━━━━━━━━━━━━━━━━━━━━━
//

/**
 * Batch assertions helper - accepts multiple assertions.
 *
 * @example
 * ```typescript
 * type _ = Ts.Test.Cases<
 *   Ts.Test.exact<string, string>,
 *   Ts.Test.sub<number, 5>,
 *   Ts.Test.equiv.never<never>
 * >
 * ```
 */
export type { Cases } from './helpers.js'

/**
 * Single assertion wrapper.
 */
export type { Case } from './helpers.js'

/**
 * Error type for failed assertions.
 */
export type { StaticErrorAssertion } from './helpers.js'
