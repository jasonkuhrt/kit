import type { GetRelation } from '../relation.js'
import type { StaticErrorAssertion } from './helpers.js'

/**
 * Internal sentinel type used to detect whether an optional type parameter was provided.
 *
 * **Purpose**: Distinguishes between value mode and type-only mode in assertion functions:
 * - Value mode: `fn<Expected>()` - no type arg provided, infer from runtime value
 * - Type-only mode: `fn<Expected, Actual>()` - type arg provided, validate at compile time
 *
 * **Implementation**: Uses a unique symbol to ensure this type can never accidentally
 * match a real type being tested. The triple underscore naming convention marks this
 * as internal/special.
 *
 * **Usage**: Always check with {@link IsNoTypeArg} helper, never directly.
 *
 * @internal
 */
export type ___NoValue___ = { readonly __kit_test_no_value_sentinel__: unique symbol }

/**
 * Check if a type parameter was omitted (defaulted to ___NoValue___).
 *
 * Used throughout assertion functions to differentiate between:
 * - Value mode: User didn't provide type argument, we infer from runtime value
 * - Type-only mode: User provided type argument, validate at compile time
 *
 * Uses tuple wrapping to prevent distributive conditional behavior.
 *
 * @example
 * ```ts
 * // In assertion function signature:
 * <$Actual = ___NoValue___>(...) =>
 *   IsNoTypeArg<$Actual> extends true
 *     ? // Value mode - no type arg provided
 *     : // Type-only mode - type arg provided
 * ```
 *
 * @internal
 */
export type IsNoTypeArg<$T> = [$T] extends [___NoValue___] ? true : false

/**
 * Internal utility for generating appropriate error messages when exact equality fails
 * due to types being equivalent but not structurally equal.
 *
 * In the hybrid error approach, this is primarily used when GetRelation returns 'equivalent',
 * providing a helpful suggestion to use equiv() for mutual assignability or apply Simplify<T>
 * to normalize types. For other type mismatches, TypeScript's native error messages are
 * preferred as they show specific structural differences in complex objects.
 *
 * @internal
 */
// dprint-ignore
export type _ExactError<
  $Expected,
  $Actual,
  ___Relation = GetRelation<$Expected, $Actual>
> =
  ___Relation extends 'equivalent' ? StaticErrorAssertion<
    'Types are mutually assignable but not structurally equal',
    $Expected,
    $Actual,
    'Use equiv() for mutual assignability OR apply Simplify<T> to normalize types'
  > :
  ___Relation extends 'subtype' ? StaticErrorAssertion<
    'Actual type is a subtype of expected type but not structurally equal',
    $Expected,
    $Actual,
    'Actual is narrower than expected - types don\'t match exactly'
  > :
  ___Relation extends 'supertype' ? StaticErrorAssertion<
    'Actual type is a supertype of expected type but not structurally equal',
    $Expected,
    $Actual,
    'Actual is wider than expected - types don\'t match exactly'
  > :
  ___Relation extends 'overlapping' ? StaticErrorAssertion<
    'Types have overlapping values but are not structurally equal',
    $Expected,
    $Actual,
    'Types share some possible values but are different'
  > :
  ___Relation extends 'disjoint' ? StaticErrorAssertion<
    'Types are completely disjoint (no common values)',
    $Expected,
    $Actual,
    'These types have no overlap and will never be equal'
  > :
  never
