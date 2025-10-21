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
import type {
  InputActualFactory,
  InputActualFactorySpecial,
  InputMatcherArgConstFactory,
  InputMatcherArgFactory,
} from './input.js'
import type { State } from './state.js'

/**
 * Relator namespace containing all matchers for a specific relator.
 *
 * Matchers come in three forms:
 * - `.of` - Base primitive, takes expected then actual (two-level curry)
 * - `.string`, `.number`, etc. - Pre-curried convenience (one-level, direct actual)
 * - `.literal` - Special matcher with const inference (two-level curry)
 */
export interface RelatorNamespace<$State extends State> {
  // Base primitive - two-level curry: (expected) => (actual) => void
  readonly of: InputMatcherArgFactory<$State>

  // Type-explicit variant - one-level curry with type parameter: <Type>() => (actual) => void
  readonly ofAs: <$Type>() => InputActualFactory<State.SetMatcherType<$State, $Type>>

  // Pre-curried primitives - one-level: (actual) => void
  readonly string: InputActualFactory<State.SetMatcher<$State, string>>
  readonly number: InputActualFactory<State.SetMatcher<$State, number>>
  readonly bigint: InputActualFactory<State.SetMatcher<$State, bigint>>
  readonly boolean: InputActualFactory<State.SetMatcher<$State, boolean>>
  readonly undefined: InputActualFactory<State.SetMatcher<$State, undefined>>
  readonly null: InputActualFactory<State.SetMatcher<$State, null>>
  readonly symbol: InputActualFactory<State.SetMatcher<$State, symbol>>

  // Pre-curried built-in classes - one-level: (actual) => void
  readonly Date: InputActualFactory<State.SetMatcher<$State, Date>>
  readonly RegExp: InputActualFactory<State.SetMatcher<$State, RegExp>>
  readonly Error: InputActualFactory<State.SetMatcher<$State, Error>>
  readonly Promise: InputActualFactory<State.SetMatcher<$State, Promise<any>>>
  readonly Array: InputActualFactory<State.SetMatcher<$State, any[]>>

  // Pre-curried special types - one-level: (actual) => void
  // These use InputActualFactorySpecial to bypass GuardAnyOrNeverActual since they explicitly allow these types
  readonly unknown: InputActualFactorySpecial<State.SetMatcher<$State, unknown, false, true, false, false>>
  readonly any: InputActualFactorySpecial<State.SetMatcher<$State, any, false, false, true, false>>
  readonly never: InputActualFactorySpecial<State.SetMatcher<$State, never, false, false, false, true>>

  // Special - two-level curry with const: (expected) => (actual) => void
  readonly const: InputMatcherArgConstFactory<$State>
}

/**
 * Exact relator namespace (no noExcess modifier).
 */
export interface ExactRelatorNamespace<$State extends State> extends RelatorNamespace<$State> {
  /**
   * Not available for exact relation.
   *
   * The `noExcess` modifier only makes sense for `sub` and `equiv` relations, where it adds
   * excess property checking. The `exact` relation already requires exact type matching,
   * so `noExcess` would be redundant.
   *
   * Use `Assert.sub.noExcess` or `Assert.equiv.noExcess` instead.
   */
  readonly noExcess: never
}

/**
 * Sub relator namespace with noExcess modifier.
 */
export interface SubRelatorNamespace<$State extends State> extends RelatorNamespace<$State> {
  /**
   * Subtype relation with excess property checking.
   *
   * Asserts that the actual type is a subtype of the expected type AND has no excess properties.
   */
  readonly noExcess: InputMatcherArgFactory<State.SetRelator<$State, SubNoExcessKind>>

  /**
   * Type-explicit variant of noExcess.
   *
   * Asserts that the actual type is a subtype of the expected type AND has no excess properties.
   */
  readonly noExcessAs: <$Type>() => InputActualFactory<
    State.SetMatcherType<State.SetRelator<$State, SubNoExcessKind>, $Type>
  >
}

/**
 * Equiv relator namespace with noExcess modifier.
 */
export interface EquivRelatorNamespace<$State extends State> extends RelatorNamespace<$State> {
  /**
   * Equivalence relation with excess property checking.
   *
   * Asserts that the actual type is equivalent to the expected type AND has no excess properties.
   */
  readonly noExcess: InputMatcherArgFactory<State.SetRelator<$State, EquivNoExcessKind>>

  /**
   * Type-explicit variant of noExcess.
   *
   * Asserts that the actual type is equivalent to the expected type AND has no excess properties.
   */
  readonly noExcessAs: <$Type>() => InputActualFactory<
    State.SetMatcherType<State.SetRelator<$State, EquivNoExcessKind>, $Type>
  >
}

/**
 * Not namespace for negated assertions.
 * Contains only relators (no extractors) with negation applied.
 */
export interface NotNamespace<$State extends State> {
  readonly exact: ExactRelatorNamespace<State.SetRelator<State.SetNegated<$State>, ExactKind>>
  readonly equiv: EquivRelatorNamespace<State.SetRelator<State.SetNegated<$State>, EquivKind>>
  readonly sub: SubRelatorNamespace<State.SetRelator<State.SetNegated<$State>, SubKind>>
}

export interface ExtractorsBuilder<$State extends State> {
  // Relators
  readonly exact: ExactRelatorNamespace<State.SetRelator<$State, ExactKind>>
  readonly equiv: EquivRelatorNamespace<State.SetRelator<$State, EquivKind>>
  readonly sub: SubRelatorNamespace<State.SetRelator<$State, SubKind>>

  /**
   * Negate the assertion (inverts the relation check).
   */
  readonly not: NotNamespace<$State>

  /**
   * Extract the resolved type from a Promise.
   */
  readonly awaited: ExtractorsBuilder<State.AddExtractor<$State, Awaited$>>

  /**
   * Extract the return type from a function.
   */
  readonly returned: ExtractorsBuilder<State.AddExtractor<$State, Returned>>

  /**
   * Extract the element type from an array.
   */
  readonly array: ExtractorsBuilder<State.AddExtractor<$State, ArrayElement>>

  /**
   * Extract the parameters tuple from a function.
   */
  readonly parameters: ExtractorsBuilder<State.AddExtractor<$State, Parameters$>>

  /**
   * Extract the first parameter type from a function.
   */
  readonly parameter1: ExtractorsBuilder<State.AddExtractor<$State, Parameter1>>

  /**
   * Extract the second parameter type from a function.
   */
  readonly parameter2: ExtractorsBuilder<State.AddExtractor<$State, Parameter2>>

  /**
   * Extract the third parameter type from a function.
   */
  readonly parameter3: ExtractorsBuilder<State.AddExtractor<$State, Parameter3>>

  /**
   * Extract the fourth parameter type from a function.
   */
  readonly parameter4: ExtractorsBuilder<State.AddExtractor<$State, Parameter4>>

  /**
   * Extract the fifth parameter type from a function.
   */
  readonly parameter5: ExtractorsBuilder<State.AddExtractor<$State, Parameter5>>
}

export interface BaseBuilder<$State extends State> extends ExtractorsBuilder<$State> {
  /**
   * Configure inference mode to narrow (literals with readonly preserved).
   *
   * Use `const` modifier with readonly preserved.
   * Example: `[1, 2]` becomes `readonly [1, 2]`
   */
  readonly inferNarrow: BaseBuilder<State.SetInferMode<$State, 'narrow'>>

  /**
   * Configure inference mode to wide (no literal inference).
   *
   * No `const` modifier, types are widened.
   * Example: `[1, 2]` becomes `number[]`
   */
  readonly inferWide: BaseBuilder<State.SetInferMode<$State, 'wide'>>

  /**
   * Configure inference mode to auto (default: literals with readonly stripped).
   *
   * Use `const` modifier but strip readonly deep.
   * Example: `[1, 2]` becomes `[1, 2]` (not `readonly [1, 2]`)
   */
  readonly inferAuto: BaseBuilder<State.SetInferMode<$State, 'auto'>>

  /**
   * Dynamically configure inference mode.
   *
   * Useful when inference mode comes from configuration or external source.
   */
  setInfer<$Mode extends 'auto' | 'narrow' | 'wide'>(mode: $Mode): BaseBuilder<State.SetInferMode<$State, $Mode>>
}
