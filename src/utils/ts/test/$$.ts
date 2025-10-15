/**
 * Type-level assertion utilities for testing type correctness.
 *
 * ## Choosing the Right Assertion
 *
 * **Structural Equality (`exact`)**: Use when types must be structurally identical
 * ```ts
 * exact<string, string>           // ✓ Pass
 * exact<1 | 2, 2 | 1>             // ✓ Pass (union order doesn't affect structure)
 * exact<string & {}, string>      // ✗ Fail (different structure)
 * ```
 *
 * **Mutual Assignability (`equiv`)**: Use for semantically equal types
 * ```ts
 * equiv<1 | 2, 2 | 1>             // ✓ Pass (same computed type)
 * equiv<string & {}, string>      // ✓ Pass (both compute to string)
 * equiv<string, number>           // ✗ Fail (not mutually assignable)
 * ```
 *
 * **Subtype Checking (`sub`)**: Use when actual must extend expected
 * ```ts
 * sub<string, 'hello'>            // ✓ Pass ('hello' extends string)
 * sub<object, { a: 1 }>           // ✓ Pass (more specific extends less specific)
 * sub<'hello', string>            // ✗ Fail (string doesn't extend 'hello')
 * ```
 *
 * **Excess Property Detection**: Add `NoExcess` suffix to catch typos
 * ```ts
 * sub<Config>()({ id: true, extra: 1 })         // ✓ Pass (sub allows excess)
 * subNoExcess<Config>()({ id: true, extra: 1 }) // ✗ Fail (catches typo!)
 * ```
 *
 * **Negative Assertions (`Not`)**: Assert types are NOT related
 * ```ts
 * Not.exact<string, number>       // ✓ Pass (they're different)
 * Not.sub<number, string>         // ✓ Pass (string doesn't extend number)
 * Not.promise<number>             // ✓ Pass (number is not a Promise)
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
// ━━━━━━━━━━━━━━━━━━━━━━━━━ Core Type Relationships ━━━━━━━━━━━━━━━━━━━━━━━━━
//

// Structural equality - types must have identical structure
// Use when you need exact type matching (not just assignability)
export { exact } from './exact.js'
export type { exact as exactType } from './exact.js'

// Mutual assignability - types compute to the same result
// Use when you care about semantic equality rather than structure
// See also: exact (for structural equality), sub (for subtype checking)
export { equiv, equivNoExcess } from './equiv.js'
export type { equiv as equivType, equivNoExcess as equivNoExcessType } from './equiv.js'

// Subtype checking - actual extends expected
// Use for validating that types satisfy minimum requirements
// See also: exact (for equality), equiv (for mutual assignability), sup (reverse parameter order)
export { sub, subNoExcess, subNot } from './sub.ts'
export type { sub as subType, subNoExcess as subNoExcessType, subNot as subNotType } from './sub.ts'

// Supertype checking - reverse parameter order of sub
// Less commonly used - prefer sub with reversed parameters for clarity
// See also: sub (standard subtype checking)
export { sup } from './sup.ts'
export type { sup as supType } from './sup.ts'

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━ Special Type Assertions ━━━━━━━━━━━━━━━━━━━━━━━━━
//

// Edge case types that need special handling (any, never, unknown, empty object)
export { equalAny, equalEmptyObject, equalNever, equalUnknown } from './special-types.js'
export type {
  equalAny as equalAnyType,
  equalEmptyObject as equalEmptyObjectType,
  equalNever as equalNeverType,
  equalUnknown as equalUnknownType,
} from './special-types.js'

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━ Container Type Assertions ━━━━━━━━━━━━━━━━━━━━━━━━━
//

// Assert specific element types within container types
export { tuple } from './tuple.js'
export type { tuple as tupleType } from './tuple.js'

export { array } from './array.js'
export type { array as arrayType } from './array.js'

export { promise } from './promise.js'
export type { promise as promiseType } from './promise.js'

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━ Function Assertions ━━━━━━━━━━━━━━━━━━━━━━━━━
//

// Assert function signatures - parameters and return types
export { parameters } from './parameters.js'
export type { parameters as parametersType } from './parameters.js'

export { returns } from './returns.js'
export type { returns as returnsType } from './returns.js'

export { returnsPromise } from './returns-promise.js'
export type { returnsPromise as returnsPromiseType } from './returns-promise.js'

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━ Object Property Assertions ━━━━━━━━━━━━━━━━━━━━━━━━━
//

// Assert specific properties within object types (ignoring other properties)
export { propertiesEquiv, propertiesExact, propertiesSub } from './properties.js'
export type {
  propertiesEquiv as propertiesEquivType,
  propertiesExact as propertiesExactType,
  propertiesSub as propertiesSubType,
} from './properties.js'

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━ Negative Assertions ━━━━━━━━━━━━━━━━━━━━━━━━━
//

// Assert that types are NOT related in specific ways
// See also: positive assertion counterparts (exact, sub, equiv, promise, array)
export { Not } from './not.js'

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━ Helper Types ━━━━━━━━━━━━━━━━━━━━━━━━━
//

// Batch assertions and error types
export type { Case, Cases, StaticErrorAssertion } from './helpers.js'

// Internal utilities (exported for backward compatibility)
export type { _ExactError } from './shared.js'
