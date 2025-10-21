import type { WritableDeep } from 'type-fest'
import type * as Kind from '../../kind.js'
import type { Error as TsError } from '../../ts.js'
import type { GuardActual, GuardAnyOrNeverActual, RestParamsDisplayGuards } from './guards.js'
import type { State } from './state.js'

/**
 * Strip readonly deeply from types.
 * Uses type-fest's WritableDeep for comprehensive readonly removal.
 */
type DeepMutable<$T> = WritableDeep<$T>

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Input
//
//
//
//

// dprint-ignore
export type InputFactory<
  $State extends State,
  $Relator extends Kind.Kind
> =
  $State['matcher']['input'] extends true
  // Take matcher input
  ? (
      $State['matcher']['inferMode'] extends 'wide'
        ? InputMatcherArgFactory<State.SetRelator<$State, $Relator>>
        : InputMatcherArgConstFactory<State.SetRelator<$State, $Relator>>
    )
  // Jump to taking actual input
  : (
      $State['matcher']['inferMode'] extends 'wide'
      ? InputActualFactory<State.SetRelator<$State, $Relator>>
      : InputActualConstFactory<State.SetRelator<$State, $Relator>>
    )

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Matcher Arg Receiver

// dprint-ignore
export type InputMatcherArgFactory<$State extends State> =
  $State['matcher']['inferMode'] extends 'wide'
    ? // Wide mode: No const, no readonly stripping
      {
        <$expected>(
          ...params: [
            expected: $expected,
          ]
        ): InputActualFactory<State.SetMatcherType<$State, $expected>>
      }
    : $State['matcher']['inferMode'] extends 'auto'
      ? // Auto mode: Const + strip readonly deep
        {
          <const $expected>(
            ...params: [
              expected: $expected,
            ]
          ): InputActualFactoryAuto<State.SetMatcherType<$State, DeepMutable<$expected>>>
        }
      : // Narrow mode: Const + keep readonly
        {
          <const $expected>(
            ...params: [
              expected: $expected,
            ]
          ): InputActualFactory<State.SetMatcherType<$State, $expected>>
        }

export interface InputMatcherArgConstFactory<$State extends State> {
  <const $expected>(
    ...params: [
      expected: $expected,
      // ...error: RestParamsDisplayGuard<GuardAnyOrNeverExpectation<$expected, $State>>,
    ]
  ): InputActualConstFactory<State.SetMatcherType<$State, $expected>>
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Actual Receiver

// dprint-ignore
export interface InputActualConstFactory<
  $State extends State
> {
  <const $actual>(
    ...params: [
      actual: GuardActual<$actual, $State>,
      ...error: RestParamsDisplayGuards<[
        GuardAnyOrNeverActual<NoInfer<$actual>, $State>,
        // GuardActual<NoInfer<$actual>, $State>
      ]>
    ]
  ): void

  as<$actual>(
    ...params: RestParamsDisplayGuards<[
      GuardActual<$actual, $State>,
      GuardAnyOrNeverActual<$actual,$State>
    ]>
  ): void
}

// dprint-ignore
export interface InputActualFactoryAuto<
  $State extends State
> {
  <const $actual>(
    ...params: [
      actual: [GuardActual<DeepMutable<$actual>, $State>] extends [TsError]
        ? GuardActual<DeepMutable<$actual>, $State>
        : $actual,
      ...error: RestParamsDisplayGuards<[
        GuardAnyOrNeverActual<NoInfer<$actual>, $State>,
      ]>
    ]
  ): void

  as<$actual>(
    ...params: RestParamsDisplayGuards<[
      GuardActual<DeepMutable<$actual>, $State>,
      GuardAnyOrNeverActual<$actual,$State>
    ]>
  ): void
}

// dprint-ignore
export interface InputActualFactory<
  $State extends State
> {
  <$actual>(
    ...params: [
      actual: GuardActual<$actual, $State>,
      ...error: RestParamsDisplayGuards<[
        GuardAnyOrNeverActual<NoInfer<$actual>, $State>,
        // GuardActual<NoInfer<$actual>, $State>
      ]>
    ]
  ): void

  as<$actual>(
    ...params: RestParamsDisplayGuards<[
      GuardActual<$actual, $State>,
      GuardAnyOrNeverActual<$actual,$State>
    ]>
  ): void
}

// dprint-ignore
export interface InputActualFactorySpecial<
  $State extends State
> {
  <$actual>(
    actual: GuardActual<$actual, $State>
  ): void

  as<$actual>(
    ...params: RestParamsDisplayGuards<[
      GuardActual<$actual, $State>
    ]>
  ): void
}
