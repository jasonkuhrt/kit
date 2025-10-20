import type * as Kind from '../../kind.js'
import type { IsAny, IsNever, IsUnknown } from '../../ts.js'
import type { AssertionErrorHash, StaticErrorAssertion } from '../assertion-error.js'
import type { ApplyExtractors } from '../kinds/extractors.ts'
import type { State } from './state.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Guards
//
//
//
//

// dprint-ignore
export type GuardAnyOrNeverExpectation<
  $expected,
  $State extends State
> =
  IsNever<$expected> extends true  ? IsNever<$State['matcher']['type']> extends true
    ? $expected
    : StaticErrorAssertion<'Type never is not assignable unless expected type is never', never, $expected, 'Use .never matcher if you actually expect never type'> :

  IsAny<$expected> extends true    ? IsAny<$State['matcher']['type']> extends true
    ? $expected
    : StaticErrorAssertion<'Type any is not assignable unless expected type is any', any, $expected, 'Use .any matcher if you actually expect any type'> :

    $expected

// dprint-ignore
export type GuardAnyOrNeverActual<
  $actual,
  $State extends State
> =
  // Check for never
  IsNever<$actual> extends true
    ? $State['matcher']['allowNever'] extends true
      ? $actual  // ✅ allowNever flag set, pass
      : IsNever<$State['matcher']['type']> extends true
        ? $actual  // ✅ Expected type is also never, pass
        : StaticErrorAssertion<'Type never is not assignable unless expected type is never', never, $actual, 'Use .never matcher if you actually expect never type'>
    :
  // Check for any
  IsAny<$actual> extends true
    ? $State['matcher']['allowAny'] extends true
      ? $actual  // ✅ allowAny flag set, pass
      : IsAny<$State['matcher']['type']> extends true
        ? $actual  // ✅ Expected type is also any, pass
        : StaticErrorAssertion<'Type any is not assignable unless expected type is any', any, $actual, 'Use .any matcher if you actually expect any type'>
    :
  // Neither never nor any
  $actual

export type GuardActual<
  $actual,
  $State extends State,
> = $State['relator'] extends Kind.Kind ? GuardActual_<
    $actual,
    $State,
    $State['relator']
  >
  : StaticErrorAssertion<'No relator set'>

// dprint-ignore
type GuardActual_<
  $actual,
  $State extends State,
  $Relator extends Kind.Kind,
  ___$ActualExtracted = ApplyExtractors<$State['extractors'], $actual>,
  ___$Error = [___$ActualExtracted] extends [AssertionErrorHash] ? ___$ActualExtracted
    : Kind.Apply<$Relator, [$State['matcher']['type'], ___$ActualExtracted]>,
> =
  // [___$ActualExtracted, ___$Error]
IsUnknown<___$ActualExtracted> extends true
  ? $State['matcher']['allowUnknown'] extends true
    ? [___$Error] extends [never]
      ? $actual
      : [___$Error] extends [AssertionErrorHash]
        ? ___$Error
        : StaticErrorAssertion<'Unexpected error type in GuardActual', unknown, unknown>
    : IsUnknown<$State['matcher']['type']> extends true
      ? [___$Error] extends [never]
        ? $actual
        : [___$Error] extends [AssertionErrorHash]
          ? ___$Error
          : StaticErrorAssertion<'Unexpected error type in GuardActual', unknown, unknown>
      : StaticErrorAssertion<'Type unknown is not a valid actual type to assertion on unless flag has been set'>
: [___$Error] extends [never]                       ? $actual :
[___$Error] extends [AssertionErrorHash]          ? ___$Error
                                                  : StaticErrorAssertion<'Unexpected error type in GuardActual', unknown, unknown>

// dprint-ignore
export type RestParamsDisplayGuards<$Results extends readonly any[]> =
  $Results extends [infer __first__, ...infer __rest__]
    ? [__first__] extends [AssertionErrorHash]
      ? [__first__, ...RestParamsDisplayGuards<__rest__>]
      : RestParamsDisplayGuards<__rest__>
    : []

export type RestParamsDisplayGuard<$Result> = [$Result] extends [AssertionErrorHash] ? [$Result] : []
