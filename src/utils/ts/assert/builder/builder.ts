import { Prox } from '#prox'
import type { ArrayElement, Awaited$, Returned } from '../kinds/extractors.js'
import type { EquivKind, ExactKind, SubKind } from '../kinds/relators.js'
import type { GuardActual } from './guards.js'
import type { State } from './state.js'

/**
 * Actual-first assertion builder - binds actual value first, then describe assertion.
 *
 * This provides a more natural reading order: "on this value, assert X".
 * Useful for pipelines where you have a value and want to assert properties.
 *
 * @template $actual - The actual value type (inferred from runtime value)
 * @template $State - Builder state (tracks extractors applied)
 */
export interface OnBuilder<$actual, $State extends State> {
  /** Exact relation - structural equality */
  readonly exact: OnRelatorNamespace<$actual, State.SetRelator<$State, ExactKind>>

  /** Equiv relation - mutual assignability */
  readonly equiv: OnRelatorNamespace<$actual, State.SetRelator<$State, EquivKind>>

  /** Sub relation - subtype checking */
  readonly sub: OnRelatorNamespace<$actual, State.SetRelator<$State, SubKind>>

  /** Extract resolved type from Promise */
  readonly awaited: OnBuilder<Awaited<$actual>, State.AddExtractor<$State, Awaited$>>

  /** Extract return type from function */
  readonly returned: OnBuilder<
    $actual extends (...args: any[]) => infer __return__ ? __return__ : never,
    State.AddExtractor<$State, Returned>
  >

  /** Extract element type from array */
  readonly array: OnBuilder<
    $actual extends (infer __element__)[] ? __element__ : never,
    State.AddExtractor<$State, ArrayElement>
  >
}

/**
 * Relator namespace for actual-first assertions.
 *
 * Actual value is already bound, so matchers only need expected value (or nothing).
 *
 * @template $actual - The bound actual value type
 * @template $State - Builder state with relator set
 */
export interface OnRelatorNamespace<$actual, $State extends State> {
  /**
   * Base matcher - provide expected value to compare against bound actual.
   */
  readonly of: <$expected>(
    expected: GuardActual<$expected, State.SetMatcherType<$State, $expected>> extends $actual ? $expected
      : GuardActual<$expected, State.SetMatcherType<$State, $expected>>,
  ) => void

  /**
   * Pre-curried matchers - no parameters needed (both expected and actual are bound).
   * These are callable properties that execute the assertion immediately.
   */
  readonly string: GuardActual<$actual, State.SetMatcher<$State, string>>
  readonly number: GuardActual<$actual, State.SetMatcher<$State, number>>
  readonly bigint: GuardActual<$actual, State.SetMatcher<$State, bigint>>
  readonly boolean: GuardActual<$actual, State.SetMatcher<$State, boolean>>
  readonly undefined: GuardActual<$actual, State.SetMatcher<$State, undefined>>
  readonly null: GuardActual<$actual, State.SetMatcher<$State, null>>
  readonly symbol: GuardActual<$actual, State.SetMatcher<$State, symbol>>

  readonly Date: GuardActual<$actual, State.SetMatcher<$State, Date>>
  readonly RegExp: GuardActual<$actual, State.SetMatcher<$State, RegExp>>
  readonly Error: GuardActual<$actual, State.SetMatcher<$State, Error>>
  readonly Promise: GuardActual<$actual, State.SetMatcher<$State, Promise<any>>>
  readonly Array: GuardActual<$actual, State.SetMatcher<$State, any[]>>

  /**
   * Const matcher - provide expected value with const inference.
   */
  readonly const: <const $expected>(
    expected: GuardActual<$expected, State.SetMatcherType<$State, $expected>> extends $actual ? $expected
      : GuardActual<$expected, State.SetMatcherType<$State, $expected>>,
  ) => void
}

/**
 * Actual-first entry point - binds actual value first, then describe assertion.
 *
 * @example
 * ```typescript
 * assert.on(42).exact.number
 * assert.on('hello').exact.string
 * assert.on(42).exact.of(42)
 * assert.on(Promise.resolve(42)).awaited.exact.number
 * ```
 */
export const on = Prox.createRecursive<<$actual>($actual: $actual) => OnBuilder<$actual, State.Empty>>()

/**
 * Actual-first entry point with explicit type casting.
 *
 * Casts the actual value to the specified type before binding.
 * Useful for asserting against widened or specific types.
 *
 * @example
 * ```typescript
 * assert.onAs<string>()('hello').exact.string
 * assert.onAs<number>()(42).exact.of(42)
 * assert.onAs<Promise<number>>()(promise).awaited.exact.number
 * ```
 */
export const onAs = Prox.createRecursive<
  (<$Type>() => <$actual extends $Type>($actual: $actual) => OnBuilder<$actual, State.Empty>)
>
