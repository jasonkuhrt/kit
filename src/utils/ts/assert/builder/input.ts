import type * as Kind from '../../kind.js'
import type { GuardActual, GuardAnyOrNeverActual, RestParamsDisplayGuards } from './guards.js'
import type { State } from './state.js'

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
      $State['matcher']['inputLiteral'] extends true
        ? InputMatcherArgConstFactory<State.SetRelator<$State, $Relator>>
        : InputMatcherArgFactory<State.SetRelator<$State, $Relator>>
    )
  // Jump to taking actual input
  : (
      $State['matcher']['inputLiteral'] extends true
      ? InputActualConstFactory<State.SetRelator<$State, $Relator>>
      : InputActualFactory<State.SetRelator<$State, $Relator>>
    )

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Matcher Arg Receiver

// dprint-ignore
export interface InputMatcherArgFactory<$State extends State> {
  <$expected>(
    ...params: [
      expected: $expected,
      // ...error: RestParamsDisplayGuard<GuardAnyOrNeverExpectation<$expected, $State>>
    ]
  ): InputActualFactory<State.SetMatcherType<$State, $expected>>

  as<$Type>(): InputActualFactory<State.SetMatcherType<$State, $Type>>
}

export interface InputMatcherArgConstFactory<$State extends State> {
  <const $expected>(
    ...params: [
      expected: $expected,
      // ...error: RestParamsDisplayGuard<GuardAnyOrNeverExpectation<$expected, $State>>,
    ]
  ): InputActualConstFactory<State.SetMatcherType<$State, $expected>>

  as<$Type>(): InputActualConstFactory<State.SetMatcherType<$State, $Type>>
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
