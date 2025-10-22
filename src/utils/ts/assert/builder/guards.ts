import type { Ts } from '#ts'
import type { Inhabitance } from '#ts/ts'
import type { IsAny, IsNever, IsUnknown } from '../../inhabitance.js'
import type * as Kind from '../../kind.js'
import type * as Path from '../../path.js'
import type { BooleanCase, StripReadonlyDeep } from '../../ts.js'
import type { StaticErrorAssertion } from '../assertion-error.js'
import type { State } from './state.js'

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
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Edge Type Validation
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
  'never': ValidateEdgeType<'never', $State>,
  'any': ValidateEdgeType<'any', $State>,
  // having this here breaks inference wherein unknown needs to be toleerated unti TS has resolved the arg type
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
type ValidateEdgeType<
  $TypeName extends 'never' | 'any' | 'unknown',
  $State extends State,
> = {
  false: {  // allowed = false
    false: StaticErrorAssertion<`Edge type ${$TypeName} not allowed by default, opt in with .${$TypeName}()`>,
    true: StaticErrorAssertion<`Expected type to not be ${$TypeName}, but was`>
  },
  true: {  // allowed = true
    false: never,
    true: StaticErrorAssertion<`Expected type to not be ${$TypeName}, but was`>
  }
}[BooleanCase<$State[`matcher_allow${Capitalize<$TypeName>}`]>][BooleanCase<$State['matcher_negated']>]

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Guards
//
//
//
//

/**
 * Apply relator after normalization.
 * Shared logic for both GuardActual and GuardExpected.
 */
// dprint-ignore
type ApplyAssertion<
  $Expected,
  $Actual,
  $State extends State,
  $Relator extends Kind.Kind,
  ___$ExpectedNormalized = NormalizeForComparison<$Expected, $State>,
  ___$ActualNormalized = NormalizeForComparison<$Actual, $State>,
> = Kind.Apply<$Relator, [___$ExpectedNormalized, ___$ActualNormalized]>

/**
 * Pure validation - returns Error | never.
 * Handles extraction, extraction errors, and relation validation.
 */
// dprint-ignore
type Validate<
  $Expected,
  $RawActual,
  $State extends State,
  $Relator extends Kind.Kind,
  ___$ActualExtracted = Path.ApplyExtractors<$State['actual_extractors'], $RawActual>,
  ___$Error = ApplyAssertion<$Expected, ___$ActualExtracted, $State, $Relator>,
> =
  // Check extraction error first
  Ts.Err.Is<___$ActualExtracted> extends true
    ? ___$ActualExtracted
    // Check unknown - only allowed with flag
    : IsUnknown<___$ActualExtracted> extends true
      ? $State['matcher_allowUnknown'] extends true
        ? [___$Error] extends [never]
          ? never
          : Ts.Err.Is<___$Error> extends true
            ? ___$Error
            : StaticErrorAssertion<'Unexpected error type in guard', unknown, unknown>
        : StaticErrorAssertion<'Type unknown is not a valid actual type to assertion on unless flag has been set'>
      // Regular validation
      : [___$Error] extends [never]
        ? never
        : Ts.Err.Is<___$Error> extends true
          ? ___$Error
          : StaticErrorAssertion<'Unexpected error type in guard', unknown, unknown>

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
 * Unified guard for never/any/unknown validation.
 * Checks both actual and expected values, returns tuple of 0-2 errors.
 */
export type GuardAgainstAnyNeverUnknown<
  $actual,
  $expected,
  $State extends State,
> = OnlyFailingChecks<[
  CheckEdgeType<$actual, $State>,
  CheckEdgeType<$expected, $State>,
]>

export type GuardActual<
  $actual,
  $State extends State,
> = $State['matcher_relator'] extends Kind.Kind ? Guard<
    $actual,
    Validate<$State['expected_type'], $actual, $State, $State['matcher_relator']>
  >
  : StaticErrorAssertion<'No relator set'>

export type GuardExpected<
  $expected,
  $State extends State,
> = $State['matcher_relator'] extends Kind.Kind ? Guard<
    $expected,
    Validate<$State['actual_type'], $expected, $State, $State['matcher_relator']>
  >
  : StaticErrorAssertion<'No relator set'>

// dprint-ignore
export type OnlyFailingChecks<$Results extends readonly any[]> =
  $Results extends [infer __first__, ...infer __rest__]
    ? IsNever<__first__> extends true      ? OnlyFailingChecks<__rest__>
    : IsAny<__first__> extends true        ? OnlyFailingChecks<__rest__>
    : Ts.Err.Is<__first__> extends true       ? [__first__, ...OnlyFailingChecks<__rest__>]
                                           : OnlyFailingChecks<__rest__>
    : []

// // dprint-ignore
// export type GetRestParamsForDisplayingGuard<$Result> =
//   IsNever<$Result> extends true     ? [] :
//   IsAny<$Result> extends true       ? [] :
//   [$Result] extends [Ts.StaticErrorLike]      ? [$Result] :
//                                       []

/**
 * Thin guard wrapper - converts validation result to Error | $Value.
 * Returns $Value on success (validation = never), Error on failure.
 */
// dprint-ignore
type Guard<
  $Value,
  ___Validation
> = [___Validation] extends [never]
  ? $Value
  : ___Validation

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
export type GuardUnaryRelator<
  $actual,
  $State extends State,
  $Kind extends 'any' | 'unknown' | 'never' | 'empty',
> = {
  'any': GuardUnaryRelatorEdgeType<$actual, $State, 'any'>
  'unknown': GuardUnaryRelatorEdgeType<$actual, $State, 'unknown'>
  'never': GuardUnaryRelatorEdgeType<$actual, $State, 'never'>
  'empty': GuardUnaryRelatorEmpty<$actual, $State>
}[$Kind]

/**
 * Check if type matches the edge type (any/unknown/never) for unary relators.
 * Unlike CheckEdgeType which validates/rejects edge types, this CHECKS if type IS that edge type.
 */
// dprint-ignore
type GuardUnaryRelatorEdgeType<
  $actual,
  $State extends State,
  $TypeName extends 'any' | 'unknown' | 'never',
> = {
  false: {  // not negated - check if type IS the edge type
    true: never  // is the edge type - pass (return never so params becomes [])
    false: StaticErrorAssertion<
      `Type is not ${$TypeName}`,
      $TypeName,
      $actual
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
type GuardUnaryRelatorEmpty<$actual, $State extends State> = {
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
