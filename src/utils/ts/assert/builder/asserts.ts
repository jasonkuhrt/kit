import type { Fn } from '#fn'
import type { Ts } from '#ts'
import type { Inhabitance } from '#ts/ts'
import type { Either } from 'effect'
import type { IsAny, IsNever, IsUnknown } from '../../inhabitance.ts'
import type * as Path from '../../path.ts'
import type { BooleanCase, StripReadonlyDeep } from '../../ts.ts'
import type { StaticErrorAssertion } from '../assertion-error.ts'
import * as Asserts from '../asserts.ts'
import type { State } from './state.ts'

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
          ? AssertsKindApply<$Expected, __value__, $State>
          : Ts.Err.StaticErrorMessage<'Type unknown is not a valid actual type to assertion on unless flag has been set'>
        : AssertsKindApply<$Expected, __value__, $State>
    )
                                                                      : never // Shouldn't happen - ApplyExtractors always returns Either
type AssertsKindApply<
  $Expected,
  $Actual,
  $State extends State,
  ___$ExpectedNormalized = NormalizeForComparison<$Expected, $State>,
  ___$ActualNormalized = NormalizeForComparison<$Actual, $State>,
> = Asserts.KindApply<
  $State['matcher_relator'],
  [___$ExpectedNormalized, ___$ActualNormalized, $State['matcher_negated']]
>

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • AssertEdgeType
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
export type AssertEdgeType<
  $Value,
  $State extends State,
  ___Case extends Inhabitance.Case = Inhabitance.GetCase<$Value>
> = {
  'never': AssertEdgeType_<'never', $State>,
  'any': AssertEdgeType_<'any', $State>,
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
type AssertEdgeType_<
  $TypeName extends 'never' | 'any',
  $State extends State,
> = {
  false: Ts.Err.StaticError<[], { message: `Edge type ${$TypeName} not allowed by default, opt in with .${$TypeName}()` }>,
  true: StaticErrorAssertion<`Expected type to not be ${$TypeName}, but was`>
  negated_false: never,
  negated_true: StaticErrorAssertion<`Expected type to not be ${$TypeName}, but was`>
}[
  `${$State['matcher_negated'] extends true ? 'negated_':''}${BooleanCase<$State[`matcher_allow${Capitalize<$TypeName>}`]>}`
]

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
 * Dispatches via HKT pattern using Fn.Kind.Apply.
 */
export type AssertUnaryRelator<
  $actual,
  $State extends State,
  $Kind extends Fn.Kind.Kind,
  ___$ExtractionResult = Path.ApplyExtractors<$State['actual_extractors'], $actual>,
> = ___$ExtractionResult extends Either.Left<infer __error__, infer _> ? __error__ // Extraction failed - propagate error
  : ___$ExtractionResult extends Either.Right<infer _, infer __value__>
    ? Fn.Kind.Apply<$Kind, [__value__, $State['matcher_negated']]>
  : never

/**
 * Unary relator assertion on an already-extracted value.
 * Used by ExecuteUnaryRelator which has already applied extractors.
 * Does NOT apply extractors - works directly on the provided value.
 */
export type AssertUnaryRelatorValue<
  $value,
  $State extends State,
  $Kind extends Fn.Kind.Kind,
> = Fn.Kind.Apply<$Kind, [$value, $State['matcher_negated']]>

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Helpers
//
//

// dprint-ignore
export type OnlyAssertionErrorsAndShow<$Results extends readonly any[]> =
  $Results extends [infer __first__, ...infer __rest__]
    ? IsNever<__first__> extends true                         ? OnlyAssertionErrorsAndShow<__rest__>
    : IsAny<__first__> extends true                           ? OnlyAssertionErrorsAndShow<__rest__>
    : __first__ extends Ts.Err.StaticError                    ? [Ts.Err.Show<__first__>, ...OnlyAssertionErrorsAndShow<__rest__>]
                                                              : OnlyAssertionErrorsAndShow<__rest__>
                                                              : []
