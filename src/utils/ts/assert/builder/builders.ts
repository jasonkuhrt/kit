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
import type { InputActualFactory, InputMatcherArgConstFactory, InputMatcherArgFactory } from './input.js'
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

  // Special - two-level curry with const: (expected) => (actual) => void
  readonly const: InputMatcherArgConstFactory<$State>
}

/**
 * Sub relator namespace with noExcess modifier.
 */
export interface SubRelatorNamespace<$State extends State> extends RelatorNamespace<$State> {
  readonly noExcess: RelatorNamespace<State.SetRelator<$State, SubNoExcessKind>>
}

/**
 * Equiv relator namespace with noExcess modifier.
 */
export interface EquivRelatorNamespace<$State extends State> extends RelatorNamespace<$State> {
  readonly noExcess: RelatorNamespace<State.SetRelator<$State, EquivNoExcessKind>>
}

/**
 * Not namespace for negated assertions.
 * Contains only relators (no extractors) with negation applied.
 */
export interface NotNamespace<$State extends State> {
  readonly exact: RelatorNamespace<State.SetRelator<State.SetNegated<$State>, ExactKind>>
  readonly equiv: EquivRelatorNamespace<State.SetRelator<State.SetNegated<$State>, EquivKind>>
  readonly sub: SubRelatorNamespace<State.SetRelator<State.SetNegated<$State>, SubKind>>
}

export interface ExtractorsBuilder<$State extends State> {
  // Relators return RelatorNamespace
  readonly exact: RelatorNamespace<State.SetRelator<$State, ExactKind>>
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

export interface BaseBuilder<$State extends State> extends ExtractorsBuilder<$State> {}
