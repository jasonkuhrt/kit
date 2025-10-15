import type { Obj } from '#obj'
import type { Apply, Kind } from '../kind.js'
import type { GetRelation, IsExact } from '../relation.js'
import type { GetTestSetting } from '../test-settings.js'
import type { ShowInTemplate } from '../ts.ts'
import { type AssertionFn, runtime, type StaticErrorAssertion } from './helpers.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Equiv Assertion
//
//
//
//

/**
 * Equiv assertion kind - checks for mutual assignability.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected, $Actual]
 * Returns: never if types are mutually assignable, otherwise StaticErrorAssertion
 */
interface EquivKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    GetRelation<this['parameters'][0], this['parameters'][1]> extends infer ___Relation
      ? ___Relation extends 'equivalent'
        // Both directions pass - check if exact would also pass
        ? IsExact<this['parameters'][1], this['parameters'][0]> extends true
          // Exact also passes - check if linting is enabled
          ? GetTestSetting<'lintBidForExactPossibility'> extends true
            ? StaticErrorAssertion<
                'Types are structurally equal',
                this['parameters'][0],
                this['parameters'][1],
                'Use exact() instead - equiv() is only needed when types are mutually assignable but not structurally equal'
              >
            : never // Linting disabled, allow it
          : never // Only equiv passes (not exact) - this is correct usage
      : ___Relation extends 'subtype'
        ? StaticErrorAssertion<
            'Actual extends Expected, but Expected does not extend Actual',
            this['parameters'][0],
            this['parameters'][1]
          >
      : ___Relation extends 'supertype'
        ? StaticErrorAssertion<
            'Expected extends Actual, but Actual does not extend Expected',
            this['parameters'][0],
            this['parameters'][1]
          >
      : ___Relation extends 'overlapping'
        ? StaticErrorAssertion<
            'Types overlap but are not mutually assignable',
            this['parameters'][0],
            this['parameters'][1]
          >
      : StaticErrorAssertion<
          'Types are disjoint (no common values)',
          this['parameters'][0],
          this['parameters'][1]
        >
      : never
}

/**
 * Assert that two types are equivalent (mutually assignable).
 *
 * This checks that types are mutually assignable (A extends B and B extends A),
 * which means they compute to the same result even if their structure differs.
 *
 * Use this when you care about semantic equality rather than structural equality.
 * For strict structural equality, use {@link exact}.
 *
 * **Linting:** When `KitLibrarySettings.Ts.Test.Settings.lintBidForExactPossibility` is `true`,
 * this will show an error if {@link exact} would work, encouraging use of the stricter assertion.
 * See module documentation for configuration example.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equiv<string, string>,      // ✓ Pass (or error if linting enabled - should use exact)
 *   Ts.Test.equiv<1 | 2, 2 | 1>,        // ✓ Pass (or error if linting enabled - should use exact)
 *   Ts.Test.equiv<string & {}, string>, // ✓ Pass - both compute to string (exact would fail)
 *   Ts.Test.equiv<string, number>       // ✗ Fail - Type error
 * >
 * ```
 *
 * @see Module documentation for how to enable strict linting
 */
export type equiv<$Expected, $Actual> = Apply<EquivKind, [$Expected, $Actual]>

/**
 * Assert that two types are equivalent (mutually assignable) at compile time.
 * Checks mutual assignability rather than structural equality.
 *
 * **Linting:** When `KitLibrarySettings.Ts.Test.Settings.lintBidForExactPossibility` is `true`,
 * this will show an error if {@link exact} would work, encouraging use of the stricter assertion.
 * See module documentation for configuration example.
 *
 * Type-level equivalent: {@link equiv}
 *
 * @example
 * ```ts
 * // Value mode (provide value in second call)
 * Ts.Test.equiv<string>()('hello') // OK (or error if linting enabled - should use exact)
 * Ts.Test.equiv<string | number>()(Math.random() > 0.5 ? 'hello' : 42) // OK - mutually assignable
 * Ts.Test.equiv<number>()('hello') // Error
 *
 * // Type-only mode (provide type as second type parameter)
 * Ts.Test.equiv<string, string>() // OK
 * Ts.Test.equiv<1 | 2, 2 | 1>() // OK - mutually assignable
 * Ts.Test.equiv<string, number>() // Error
 * ```
 *
 * @see Module documentation for how to enable strict linting
 */
export const equiv: AssertionFn<EquivKind> = runtime

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • EquivNoExcess Assertion
//
//
//
//

/**
 * EquivNoExcess assertion kind - checks equivalence AND no excess properties.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected, $Actual]
 * Returns: never if types are equivalent with no excess, otherwise StaticErrorAssertion
 */
interface EquivNoExcessKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    GetRelation<this['parameters'][0], this['parameters'][1]> extends 'equivalent'
      ? [keyof Obj.SubtractShallow<this['parameters'][1], this['parameters'][0]>] extends [never]
        ? never
        : StaticErrorAssertion<
            'Types are equivalent but Actual has excess properties',
            this['parameters'][0],
            this['parameters'][1],
            `Excess properties: ${ShowInTemplate<keyof Obj.SubtractShallow<this['parameters'][1], this['parameters'][0]>>}`
          >
      : GetRelation<this['parameters'][0], this['parameters'][1]> extends 'subtype'
        ? StaticErrorAssertion<
            'Actual extends Expected, but Expected does not extend Actual',
            this['parameters'][0],
            this['parameters'][1]
          >
        : GetRelation<this['parameters'][0], this['parameters'][1]> extends 'supertype'
          ? StaticErrorAssertion<
              'Expected extends Actual, but Actual does not extend Expected',
              this['parameters'][0],
              this['parameters'][1]
            >
          : StaticErrorAssertion<
              'Types are not equivalent',
              this['parameters'][0],
              this['parameters'][1]
            >
}

/**
 * Assert that two types are equivalent (mutually assignable) AND have no excess properties.
 *
 * Similar to {@link equiv} but also rejects excess properties in the actual type.
 * This is useful for catching typos or unintended properties in configuration objects
 * while still allowing types that compute to the same result.
 *
 * @example
 * ```ts
 * type Config = { id: boolean; name?: string }
 *
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equivNoExcess<Config, { id: true }>,               // ✓ Pass
 *   Ts.Test.equivNoExcess<Config, { id: true; name: 'test' }>, // ✓ Pass - optional included
 *   Ts.Test.equivNoExcess<Config, { id: true; extra: 1 }>,     // ✗ Fail - excess property
 * >
 * ```
 *
 * @see {@link equiv} for standard equivalence checking (allows excess properties)
 * @see {@link subNoExcess} for subtype checking with no excess
 */
export type equivNoExcess<$Expected, $Actual> = Apply<EquivNoExcessKind, [$Expected, $Actual]>

/**
 * Assert that a value's type is equivalent to expected type AND has no excess properties.
 *
 * Similar to {@link equiv} but also rejects excess properties, catching typos and
 * unintended fields while still accepting types that are mutually assignable.
 *
 * Type-level equivalent: {@link equivNoExcess}
 *
 * @example
 * ```ts
 * type Config = { id: boolean; name?: string }
 *
 * // Value mode
 * Ts.Test.equivNoExcess<Config>()({ id: true }) // ✓ Pass
 * Ts.Test.equivNoExcess<Config>()({ id: true, name: 'test' }) // ✓ Pass
 *
 * // @ts-expect-error - Excess property
 * Ts.Test.equivNoExcess<Config>()({ id: true, extra: 1 })
 *
 * // Type-only mode
 * Ts.Test.equivNoExcess<Config, { id: true }>() // ✓ Pass
 * Ts.Test.equivNoExcess<Config, { id: true; extra: 1 }>() // ✗ Fail - excess property
 * ```
 *
 * @see {@link equiv} for standard equivalence (allows excess properties)
 * @see {@link subNoExcess} for subtype with no excess
 */
export const equivNoExcess: AssertionFn<EquivNoExcessKind> = runtime
