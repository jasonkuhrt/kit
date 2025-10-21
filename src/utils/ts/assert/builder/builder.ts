import { Prox } from '#prox'
import type { WritableDeep } from 'type-fest'
import type { StaticErrorAssertion } from '../assertion-error.js'
import type {
  ArrayElement,
  Awaited$,
  Parameter1,
  Parameter2,
  Parameter3,
  Parameter4,
  Parameter5,
  Parameters$,
  Returned,
} from '../kinds/extractors.js'
import type { EquivKind, EquivNoExcessKind, ExactKind, SubKind, SubNoExcessKind } from '../kinds/relators.js'
import type { GuardActual } from './guards.js'
import type { State } from './state.js'

/**
 * Strip readonly deeply from types.
 * Uses type-fest's WritableDeep for comprehensive readonly removal.
 */
type DeepMutable<$T> = WritableDeep<$T>

/**
 * Base builder properties that are always available regardless of actual type.
 * Includes relators (exact, equiv, sub) and inference mode configuration.
 *
 * @template $actual - The actual value type (inferred from runtime value)
 * @template $State - Builder state (tracks extractors applied)
 */
export interface OnBuilderBase<$actual, $State extends State> {
  /** Exact relation - structural equality */
  readonly exact: OnRelatorNamespace<$actual, State.SetRelator<$State, ExactKind>>

  /** Equiv relation - mutual assignability */
  readonly equiv: OnEquivRelatorNamespace<$actual, State.SetRelator<$State, EquivKind>>

  /** Sub relation - subtype checking */
  readonly sub: OnSubRelatorNamespace<$actual, State.SetRelator<$State, SubKind>>

  /** Configure inference mode to narrow (literals with readonly preserved) */
  readonly inferNarrow: OnBuilder<$actual, State.SetInferMode<$State, 'narrow'>>

  /** Configure inference mode to wide (no literal inference) */
  readonly inferWide: OnBuilder<$actual, State.SetInferMode<$State, 'wide'>>

  /** Configure inference mode to auto (literals with readonly stripped) */
  readonly inferAuto: OnBuilder<$actual, State.SetInferMode<$State, 'auto'>>

  /** Dynamically configure inference mode */
  setInfer<$Mode extends 'auto' | 'narrow' | 'wide'>(mode: $Mode): OnBuilder<$actual, State.SetInferMode<$State, $Mode>>
}

/**
 * All extractors for any/unknown types.
 * Shows all extractors regardless of actual type structure.
 *
 * @template $actual - The actual value type
 * @template $State - Builder state
 */
// dprint-ignore
export type AllExtractors<$actual, $State extends State> = {
  readonly awaited: OnBuilder<Awaited<$actual>, $State>
  readonly returned: OnBuilder<
    $actual extends (...args: any[]) => infer __return__ ? __return__ : never,
    $State
  >
  readonly array: OnBuilder<
    $actual extends (infer __element__)[] ? __element__ : never,
    $State
  >
  readonly parameters: OnBuilder<
    $actual extends (...args: infer __params__) => any ? __params__ : never,
    $State
  >
  readonly parameter1: OnBuilder<
    $actual extends (p1: infer __p1__, ...args: any[]) => any ? __p1__ : never,
    $State
  >
  readonly parameter2: OnBuilder<
    $actual extends (p1: any, p2: infer __p2__, ...args: any[]) => any ? __p2__ : never,
    $State
  >
  readonly parameter3: OnBuilder<
    $actual extends (p1: any, p2: any, p3: infer __p3__, ...args: any[]) => any ? __p3__ : never,
    $State
  >
  readonly parameter4: OnBuilder<
    $actual extends (p1: any, p2: any, p3: any, p4: infer __p4__, ...args: any[]) => any ? __p4__ : never,
    $State
  >
  readonly parameter5: OnBuilder<
    $actual extends (p1: any, p2: any, p3: any, p4: any, p5: infer __p5__, ...args: any[]) => any ? __p5__ : never,
    $State
  >
}

/**
 * Conditional extractors based on actual type.
 * Uses outermost priority: Promise > Function > Array.
 *
 * @template $actual - The actual value type
 * @template $State - Builder state
 */
// dprint-ignore
export type ConditionalExtractors<$actual, $State extends State> =
  // Check Promise first (outermost layer)
  $actual extends Promise<infer __inner__>
    ? { readonly awaited: OnBuilder<__inner__, $State> }
    // Not Promise - check Function
    : $actual extends (...args: infer __params__) => infer __return__
      ? {
          readonly returned: OnBuilder<__return__, $State>
          readonly parameters: OnBuilder<__params__, $State>
          readonly parameter1: OnBuilder<__params__[0], $State>
          readonly parameter2: OnBuilder<__params__[1], $State>
          readonly parameter3: OnBuilder<__params__[2], $State>
          readonly parameter4: OnBuilder<__params__[3], $State>
          readonly parameter5: OnBuilder<__params__[4], $State>
        }
      // Not Function - check Array
      : $actual extends readonly (infer __element__)[]
        ? { readonly array: OnBuilder<__element__, $State> }
        // Not any of the above - no extractors
        : {}

/**
 * Actual-first assertion builder - binds actual value first, then describe assertion.
 *
 * This provides a more natural reading order: "on this value, assert X".
 * Useful for pipelines where you have a value and want to assert properties.
 *
 * Smart extractor availability:
 * - Only shows extractors applicable to the actual type
 * - Uses outermost priority: Promise > Function > Array
 * - Special case: any/unknown show all extractors
 *
 * @template $actual - The actual value type (inferred from runtime value)
 * @template $State - Builder state (tracks extractors applied)
 *
 * @example
 * ```typescript
 * // Promise - only .awaited available initially
 * Assert.on(Promise.resolve([1, 2, 3]))
 *   .awaited  // ✓ Available
 *   .array    // ✓ Available after awaiting
 *   .exact.number<number>
 *
 * // Function - only function extractors available
 * Assert.on((() => 42) as () => number)
 *   .returned     // ✓ Available
 *   .parameters   // ✓ Available
 *   .awaited      // ✗ Not available (not shown in autocomplete)
 * ```
 */
// dprint-ignore
export type OnBuilder<$actual, $State extends State> =
  & OnBuilderBase<$actual, $State>
  & (
      // Special case: never - show all extractors (avoid distributive conditional)
      [$actual] extends [never]
        ? AllExtractors<$actual, $State>
        // Special case: any/unknown show all extractors
        : unknown extends $actual
          ? 0 extends 1 & $actual
            ? AllExtractors<$actual, $State>  // any
            : AllExtractors<$actual, $State>  // unknown
          : ConditionalExtractors<$actual, $State>  // Normal types
    )

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
   * Inference behavior depends on inferMode state.
   */
  readonly of: $State['matcher']['inferMode'] extends 'wide'
    // Wide mode: No const
    ? <$expected>(
      expected: GuardActual<$expected, State.SetMatcherType<$State, $expected>> extends $actual ? $expected
        : GuardActual<$expected, State.SetMatcherType<$State, $expected>>,
    ) => void
    : $State['matcher']['inferMode'] extends 'auto'
    // Auto mode: Const + strip readonly from both expected and actual
      ? <const $expected>(
        expected: GuardActual<DeepMutable<$expected>, State.SetMatcherType<$State, DeepMutable<$expected>>> extends
          DeepMutable<$actual> ? $expected
          : GuardActual<DeepMutable<$expected>, State.SetMatcherType<$State, DeepMutable<$expected>>>,
      ) => void
    // Narrow mode: Const + keep readonly
    : <const $expected>(
      expected: GuardActual<$expected, State.SetMatcherType<$State, $expected>> extends $actual ? $expected
        : GuardActual<$expected, State.SetMatcherType<$State, $expected>>,
    ) => void

  /**
   * Type-explicit matcher - specify expected type explicitly, actual is already bound.
   */
  readonly ofAs: <$Type>() => GuardActual<$actual, State.SetMatcherType<$State, $Type>>

  /**
   * Pre-curried matchers - zero-parameter functions (both expected and actual are bound).
   * Called with () to execute the assertion.
   */
  readonly string: () => GuardActual<$actual, State.SetMatcher<$State, string>>
  readonly number: () => GuardActual<$actual, State.SetMatcher<$State, number>>
  readonly bigint: () => GuardActual<$actual, State.SetMatcher<$State, bigint>>
  readonly boolean: () => GuardActual<$actual, State.SetMatcher<$State, boolean>>
  readonly undefined: () => GuardActual<$actual, State.SetMatcher<$State, undefined>>
  readonly null: () => GuardActual<$actual, State.SetMatcher<$State, null>>
  readonly symbol: () => GuardActual<$actual, State.SetMatcher<$State, symbol>>

  readonly Date: () => GuardActual<$actual, State.SetMatcher<$State, Date>>
  readonly RegExp: () => GuardActual<$actual, State.SetMatcher<$State, RegExp>>
  readonly Error: () => GuardActual<$actual, State.SetMatcher<$State, Error>>
  readonly Promise: () => GuardActual<$actual, State.SetMatcher<$State, Promise<any>>>
  readonly Array: () => GuardActual<$actual, State.SetMatcher<$State, any[]>>

  readonly unknown: () => GuardActual<$actual, State.SetMatcher<$State, unknown, false, true, false, false>>
  readonly any: () => GuardActual<$actual, State.SetMatcher<$State, any, false, false, true, false>>
  readonly never: () => GuardActual<$actual, State.SetMatcher<$State, never, false, false, false, true>>

  /**
   * Const matcher - provide expected value with const inference.
   */
  readonly const: <const $expected>(
    expected: GuardActual<$expected, State.SetMatcherType<$State, $expected>> extends $actual ? $expected
      : GuardActual<$expected, State.SetMatcherType<$State, $expected>>,
  ) => void
}

/**
 * Sub relator namespace for actual-first assertions with noExcess support.
 */
export interface OnSubRelatorNamespace<$actual, $State extends State> extends OnRelatorNamespace<$actual, $State> {
  /**
   * No excess properties matcher - actual must be subtype with no excess properties.
   * Inference behavior depends on inferMode state.
   */
  readonly noExcess: $State['matcher']['inferMode'] extends 'wide' ? <$expected>(
      expected:
        GuardActual<$expected, State.SetMatcherType<State.SetRelator<$State, SubNoExcessKind>, $expected>> extends
          $actual ? $expected
          : GuardActual<$expected, State.SetMatcherType<State.SetRelator<$State, SubNoExcessKind>, $expected>>,
    ) => void
    : $State['matcher']['inferMode'] extends 'auto' ? <const $expected>(
        expected: GuardActual<
          DeepMutable<$expected>,
          State.SetMatcherType<State.SetRelator<$State, SubNoExcessKind>, DeepMutable<$expected>>
        > extends DeepMutable<$actual> ? $expected
          : GuardActual<
            DeepMutable<$expected>,
            State.SetMatcherType<State.SetRelator<$State, SubNoExcessKind>, DeepMutable<$expected>>
          >,
      ) => void
    : <const $expected>(
      expected:
        GuardActual<$expected, State.SetMatcherType<State.SetRelator<$State, SubNoExcessKind>, $expected>> extends
          $actual ? $expected
          : GuardActual<$expected, State.SetMatcherType<State.SetRelator<$State, SubNoExcessKind>, $expected>>,
    ) => void

  /**
   * Type-explicit noExcess matcher.
   */
  readonly noExcessAs: <$Type>() => GuardActual<
    $actual,
    State.SetMatcherType<State.SetRelator<$State, SubNoExcessKind>, $Type>
  >
}

/**
 * Equiv relator namespace for actual-first assertions with noExcess support.
 */
export interface OnEquivRelatorNamespace<$actual, $State extends State> extends OnRelatorNamespace<$actual, $State> {
  /**
   * No excess properties matcher - actual must be equivalent with no excess properties.
   * Inference behavior depends on inferMode state.
   */
  readonly noExcess: $State['matcher']['inferMode'] extends 'wide' ? <$expected>(
      expected:
        GuardActual<$expected, State.SetMatcherType<State.SetRelator<$State, EquivNoExcessKind>, $expected>> extends
          $actual ? $expected
          : GuardActual<$expected, State.SetMatcherType<State.SetRelator<$State, EquivNoExcessKind>, $expected>>,
    ) => void
    : $State['matcher']['inferMode'] extends 'auto' ? <const $expected>(
        expected: GuardActual<
          DeepMutable<$expected>,
          State.SetMatcherType<State.SetRelator<$State, EquivNoExcessKind>, DeepMutable<$expected>>
        > extends DeepMutable<$actual> ? $expected
          : GuardActual<
            DeepMutable<$expected>,
            State.SetMatcherType<State.SetRelator<$State, EquivNoExcessKind>, DeepMutable<$expected>>
          >,
      ) => void
    : <const $expected>(
      expected:
        GuardActual<$expected, State.SetMatcherType<State.SetRelator<$State, EquivNoExcessKind>, $expected>> extends
          $actual ? $expected
          : GuardActual<$expected, State.SetMatcherType<State.SetRelator<$State, EquivNoExcessKind>, $expected>>,
    ) => void

  /**
   * Type-explicit noExcess matcher.
   */
  readonly noExcessAs: <$Type>() => GuardActual<
    $actual,
    State.SetMatcherType<State.SetRelator<$State, EquivNoExcessKind>, $Type>
  >
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
 * Supports two modes:
 * - Type-first: `onAs<Type>()` returns builder with type constraint
 * - Value-first: `onAs(value)` returns builder (same as `on(value)`)
 *
 * @example
 * ```typescript
 * // Type-first mode
 * assert.onAs<string>().exact.of('hello')
 * assert.onAs<number>().exact.of(42)
 *
 * // Value-first mode (same as `on`)
 * assert.onAs('hello').exact.string
 * assert.onAs(42).exact.number
 * ```
 */
export const onAs: {
  <$Type>(): OnBuilder<$Type, State.Empty>
  <$actual>($actual: $actual): OnBuilder<$actual, State.Empty>
} = Prox.createRecursive() as any
