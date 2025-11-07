import type { Fn } from '#fn'
import type { Ts } from '#ts'
import type { Inhabitance } from '#ts/ts'
import type { Either } from 'effect'
import type { IsAny, IsNever, IsUnknown } from '../../inhabitance.js'
import type * as Path from '../../path.js'
import type { BooleanCase, StripReadonlyDeep } from '../../ts.js'
import type { StaticErrorAssertion } from '../assertion-error.js'
import type { State } from './state.js'

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Guards
//
//

export type GuardActual<
  $actual,
  $State extends State,
> = Guard<$actual, AssertActual<$actual, $State>>

export type GuardExpected<
  $expected,
  $State extends State,
> = Guard<$expected, AssertExpected<$expected, $State>>

/**
 * Thin guard wrapper - converts validation result to Error | $Value.
 * Returns $Value on success (validation = never), Error on failure.
 */
// dprint-ignore
type Guard<$Value, ___Validation extends Ts.Err.StaticError,
> = [___Validation] extends [never]
  ? $Value
  : Ts.Err.Show<___Validation>

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Normalization
//
//
//
//

/**
 * Normalize types for comparison based on inference mode from state.
 *
 * - `'auto'` - Strip readonly deep for readonly-agnostic comparison
 * - `'wide'` - No normalization (identity)
 * - `'narrow'` - No normalization (identity)
 *
 * This enables auto mode to ignore readonly modifiers when comparing types,
 * while wide/narrow modes respect them.
 */
// dprint-ignore
type NormalizeForComparison<$T, $State extends State> = {
  'auto': StripReadonlyDeep<$T>
  'narrow': $T
  'wide': $T
}[$State['matcher_inferMode']]

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Assert
//
//
//
//

export type AssertActual<
  $actual,
  $State extends State,
> = $State['matcher_relator'] extends Fn.Kind.Kind ? Assert<$State['expected_type'], $actual, $State>
  : Ts.Err.StaticErrorMessage<'No relator set'>

export type AssertExpected<
  $expected,
  $State extends State,
> = $State['matcher_relator'] extends Fn.Kind.Kind ? Assert<$expected, $State['actual_type'], $State>
  : Ts.Err.StaticErrorMessage<'No relator set'>

/**
 * Pure validation - returns Error | never.
 * Handles extraction, extraction errors, and relation validation.
 */
// dprint-ignore
type Assert<
  $Expected,
  $RawActual,
  $State extends State,
  ___$ExtractionResult = Path.ApplyExtractors<$State['actual_extractors'], $RawActual>,
> =
  // Check if extraction failed
  ___$ExtractionResult extends Either.Left<infer __error__, infer _>  ? __error__ :
  ___$ExtractionResult extends Either.Right<infer _, infer __value__> ?
    (
      IsUnknown<__value__> extends true
        ? $State['matcher_allowUnknown'] extends true
          ? ApplyAssertion<$Expected, __value__, $State>
          : Ts.Err.StaticErrorMessage<'Type unknown is not a valid actual type to assertion on unless flag has been set'>
        : ApplyAssertion<$Expected, __value__, $State>
    )
                                                                      : never // Shouldn't happen - ApplyExtractors always returns Either

/**
 * Apply relator after normalization.
 * Shared logic for both GuardActual and GuardExpected.
 */
// dprint-ignore
type ApplyAssertion<
  $Expected,
  $Actual,
  $State extends State,
  ___$ExpectedNormalized = NormalizeForComparison<$Expected, $State>,
  ___$ActualNormalized = NormalizeForComparison<$Actual, $State>,
  ___$Result = Fn.Kind.Apply<$State['matcher_relator'], [___$ExpectedNormalized, ___$ActualNormalized, $State['matcher_negated']]>
> = ___$Result extends Ts.Err.StaticError
  ? ___$Result
  : never

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • GuardAnyOrNever (Unified)
//
//
//
//

/**
 * Validate edge types (never/any/unknown) using inhabitance-based lookup.
 *
 * Uses Inhabitance.GetCase to determine the type case, then dispatches to
 * ValidateEdgeType for proper edge types. Returns never for proper types.
 */
// dprint-ignore
type CheckEdgeType<
  $Value,
  $State extends State,
  ___Case extends Inhabitance.Case = Inhabitance.GetCase<$Value>
> = {
  'never': AssertEdgeType<'never', $State>,
  'any': AssertEdgeType<'any', $State>,
  // having this here breaks inference wherein unknown needs to be tolerated until TS has resolved the arg type
  // 'unknown': ValidateEdgeType<'unknown', $State>,
  'unknown': never
  'proper': never
}[___Case]

/**
 * Core validation logic for edge types using 2D lookup table.
 *
 * Dimensions: allowFlag (true/false) × negated (true/false)
 */
// dprint-ignore
type AssertEdgeType<
  $TypeName extends 'never' | 'any' | 'unknown',
  $State extends State,
> = {
  false: {  // allowed = false
    false: Ts.Err.StaticError<[], { message: `Edge type ${$TypeName} not allowed by default, opt in with .${$TypeName}()` }>,
    true: StaticErrorAssertion<`Expected type to not be ${$TypeName}, but was`>
  },
  true: {  // allowed = true
    false: never,
    true: StaticErrorAssertion<`Expected type to not be ${$TypeName}, but was`>
  }
}[BooleanCase<$State[`matcher_allow${Capitalize<$TypeName>}`]>][BooleanCase<$State['matcher_negated']>]

/**
 * Unified guard for never/any/unknown validation.
 * Checks both actual and expected values, returns tuple of 0-2 errors.
 */
export type CheckAgainstAnyNeverUnknown<
  $actual,
  $expected,
  $State extends State,
> = OnlyAssertionErrorsAndShow<[
  CheckEdgeType<$actual, $State>,
  CheckEdgeType<$expected, $State>,
]>

// dprint-ignore
export type OnlyAssertionErrorsAndShow<$Results extends readonly any[]> =
  $Results extends [infer __first__, ...infer __rest__]
    ? IsNever<__first__> extends true                         ? OnlyAssertionErrorsAndShow<__rest__>
    : IsAny<__first__> extends true                           ? OnlyAssertionErrorsAndShow<__rest__>
    : __first__ extends Ts.Err.StaticError                    ? [Ts.Err.Show<__first__>, ...OnlyAssertionErrorsAndShow<__rest__>]
                                                              : OnlyAssertionErrorsAndShow<__rest__>
                                                              : []

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Unary Relator Guards
//
//
//
//

/**
 * Guard for unary relators.
 * Dispatches based on kind and negation state.
 */
export type AssertUnaryRelator<
  $actual,
  $State extends State,
  $Kind extends 'any' | 'unknown' | 'never' | 'empty',
> = {
  'any': AssertUnaryRelatorEdgeType<$actual, $State, 'any'>
  'unknown': AssertUnaryRelatorEdgeType<$actual, $State, 'unknown'>
  'never': AssertUnaryRelatorEdgeType<$actual, $State, 'never'>
  'empty': AssertUnaryRelatorEmpty<$actual, $State>
}[$Kind]

/**
 * Check if type matches the edge type (any/unknown/never) for unary relators.
 * Unlike CheckEdgeType which validates/rejects edge types, this CHECKS if type IS that edge type.
 */
// dprint-ignore
type AssertUnaryRelatorEdgeType<
  $actual,
  $State extends State,
  $TypeName extends 'any' | 'unknown' | 'never',
> = {
  false: {  // not negated - check if type IS the edge type
    true: never  // is the edge type - pass (return never so params becomes [])
    false: StaticErrorAssertion<`Type is not ${$TypeName}`, $TypeName, $actual
    >
  }
  true: {  // negated - check if type is NOT the edge type
    true: StaticErrorAssertion<`Type is ${$TypeName}, but expected not ${$TypeName}`, $TypeName, $actual>
    false: never  // not the edge type - pass (return never so params becomes [])
  }
}[BooleanCase<$State['matcher_negated']>][BooleanCase<Inhabitance.GetCase<$actual> extends $TypeName ? true : false>]

/**
 * Validate empty with negation support.
 */
// dprint-ignore
type AssertUnaryRelatorEmpty<$actual, $State extends State> = {
  false: {  // not negated
    true: never  // is empty - pass (return never so params becomes [])
    false: StaticErrorAssertion<
      'Type is not empty',
      EmptyTypes,
      $actual,
      {
        tip_array: 'Empty array: [] or readonly []'
        tip_object: 'Empty object: keyof T extends never (not {}!)'
        tip_string: 'Empty string: \'\''
      }
    >
  }
  true: {  // negated
    true: StaticErrorAssertion<'Expected type to not be empty, but was'>
    false: never  // not empty - pass (return never so params becomes [])
  }
}[BooleanCase<$State['matcher_negated']>][BooleanCase<Inhabitance.IsEmpty<$actual>>]

/**
 * Union of valid empty types for error display.
 */
type EmptyTypes = [] | Record<PropertyKey, never> | ''
