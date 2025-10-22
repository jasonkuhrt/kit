import type { Inhabitance, SENTINEL } from '#ts/ts'
import type {
  ApplyExtractors,
  ArrayElement,
  Awaited$,
  Parameter1,
  Parameter2,
  Parameter3,
  Parameter4,
  Parameter5,
  Parameters$,
  Returned,
} from '../../path.js'
import type { EquivKind, EquivNoExcessKind, ExactKind, SubKind, SubNoExcessKind } from '../kinds/relators.js'
import type {
  GuardActual,
  GuardAgainstAnyNeverUnknown,
  GuardExpected,
  GuardUnaryRelator,
  OnlyFailingChecks,
} from './guards.js'
import type { State as S } from './state.js'

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Core
//
//

export type Builder<$State extends S> =
  & BuilderUnaryRelators<$State>
  & BuilderBinaryRelators<$State>
  & BuilderExtractors<$State>
  & BuilderSettings<$State>
  & BuilderActualInputIfMissingActual<$State>

export type BuilderActualInputIfMissingActual<$State extends S> = {
  'actual': BuilderActualInput<$State>
  'either': BuilderActualInput<$State>
  'expected': {}
  'complete': {}
}[S.InputNextCase<$State>]

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Unary Relators
//
//

/**
 * Unary relators - check properties of a single type.
 * These are directly executable (no matchers needed).
 * All support .not modifier.
 */
export interface BuilderUnaryRelators<$State extends S> {
  /**
   * Assert type is `any`.
   */
  readonly any: UnaryRelatorDispatch<$State, 'any'>

  /**
   * Assert type is `unknown`.
   */
  readonly unknown: UnaryRelatorDispatch<$State, 'unknown'>

  /**
   * Assert type is `never`.
   */
  readonly never: UnaryRelatorDispatch<$State, 'never'>

  /**
   * Assert type is empty ([], keyof T extends never, or '').
   * Note: {} is non-nullish, not empty!
   */
  readonly empty: UnaryRelatorDispatch<$State, 'empty'>
}

type UnaryRelatorDispatch<$State extends S, $Kind extends 'any' | 'unknown' | 'never' | 'empty'> = {
  'complete': ExecuteUnaryRelator<$State, $Kind>
  'either': InputActualForUnaryRelator<$State, $Kind>
  'actual': InputActualForUnaryRelator<$State, $Kind>
  'expected': ExecuteUnaryRelator<$State, $Kind> // Unary relators execute when we have actual (no expected needed)
}[S.InputNextCase<$State>]

export type InputActualForUnaryRelator<$State extends S, $Kind extends 'any' | 'unknown' | 'never' | 'empty'> = {
  'auto': InputActualForUnaryRelatorNarrow<$State, $Kind>
  'narrow': InputActualForUnaryRelatorNarrow<$State, $Kind>
  'wide': InputActualForUnaryRelatorWide<$State, $Kind>
}[$State['matcher_inferMode']]

export interface InputActualForUnaryRelatorNarrow<
  $State extends S,
  $Kind extends 'any' | 'unknown' | 'never' | 'empty',
> {
  <const $actual>(value: $actual, ...params: OnlyFailingChecks<[GuardUnaryRelator<$actual, $State, $Kind>]>): void
}

export interface InputActualForUnaryRelatorWide<$State extends S, $Kind extends 'any' | 'unknown' | 'never' | 'empty'> {
  <$actual>(value: $actual, ...params: OnlyFailingChecks<[GuardUnaryRelator<$actual, $State, $Kind>]>): void
}

export type ExecuteUnaryRelator<
  $State extends S,
  $Kind extends 'any' | 'unknown' | 'never' | 'empty',
  ___ActualExtracted = ApplyExtractors<$State['actual_extractors'], $State['actual_type']>,
> = (
  ...params: OnlyFailingChecks<[GuardUnaryRelator<___ActualExtracted, $State, $Kind>]>
) => void

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Binary Relators
//
//

/**
 * Binary relators - compare two types.
 * Return Matchers interface for providing expected type.
 */
export interface BuilderBinaryRelators<$State extends S> {
  readonly exact: BuilderMatchers<S.SetRelator<$State, ExactKind>, ExactKind>
  readonly equiv: BuilderMatchers<S.SetRelator<$State, EquivKind>, EquivKind>
  readonly sub: BuilderMatchers<S.SetRelator<$State, SubKind>, SubKind>
}

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Extractors
//
//

export type BuilderExtractors<
  $State extends S,
> = {
  'actual': BuilderExtractorsConstant<$State>
  'either': BuilderExtractorsConstant<$State>
  'expected': BuilderExtractorsConditionalMaybe<$State>
  'complete': {}
}[S.InputNextCase<$State>]

export interface BuilderExtractorsConstant<$State extends S> {
  /**
   * Extract the resolved type from a Promise.
   */
  readonly awaited: Builder<S.AddExtractor<$State, Awaited$>>

  /**
   * Extract the return type from a function.
   */
  readonly returned: Builder<S.AddExtractor<$State, Returned>>

  /**
   * Extract the element type from an array.
   */
  readonly array: Builder<S.AddExtractor<$State, ArrayElement>>

  /**
   * Extract the parameters tuple from a function.
   */
  readonly parameters: Builder<S.AddExtractor<$State, Parameters$>>

  /**
   * Extract the first parameter type from a function.
   */
  readonly parameter1: Builder<S.AddExtractor<$State, Parameter1>>

  /**
   * Extract the second parameter type from a function.
   */
  readonly parameter2: Builder<S.AddExtractor<$State, Parameter2>>

  /**
   * Extract the third parameter type from a function.
   */
  readonly parameter3: Builder<S.AddExtractor<$State, Parameter3>>

  /**
   * Extract the fourth parameter type from a function.
   */
  readonly parameter4: Builder<S.AddExtractor<$State, Parameter4>>

  /**
   * Extract the fifth parameter type from a function.
   */
  readonly parameter5: Builder<S.AddExtractor<$State, Parameter5>>
}

export type BuilderExtractorsConditionalMaybe<
  $State extends S,
  ___$ActualIsEmpty extends boolean = SENTINEL.IsEmpty<$State['actual_type']>,
  ___$ActualInhabitanceCase extends Inhabitance.Case = Inhabitance.GetCase<$State['actual_type']>,
> = ___$ActualIsEmpty extends true ? BuilderExtractorsConstant<$State> // Empty sentinel - use constant (HKT) extractors
  : {
    'proper': BuilderExtractorsConditional<$State>
    // else constant extractors only
    'any': BuilderExtractorsConstant<$State>
    'unknown': BuilderExtractorsConstant<$State>
    'never': BuilderExtractorsConstant<$State>
  }[___$ActualInhabitanceCase]

// dprint-ignore
export type BuilderExtractorsConditional<$State extends S> =
  // Check Promise first (outermost layer)
  $State['actual_type'] extends Promise<infer __inner__>
    ? { readonly awaited: Builder<S.SetActualType<$State, __inner__>> }
    // Not Promise - check Function
    : $State['actual_type'] extends (...args: infer __params__) => infer __return__
      ? {
          readonly returned: Builder<S.SetActualType<$State, __return__>>
          readonly parameters: Builder<S.SetActualType<$State, __params__>>
          readonly parameter1: Builder<S.SetActualType<$State, __params__[0]>>
          readonly parameter2: Builder<S.SetActualType<$State, __params__[1]>>
          readonly parameter3: Builder<S.SetActualType<$State, __params__[2]>>
          readonly parameter4: Builder<S.SetActualType<$State, __params__[3]>>
          readonly parameter5: Builder<S.SetActualType<$State, __params__[4]>>
        }
      // Not Function - check Array
      : $State['actual_type'] extends readonly (infer __element__)[]
        ? { readonly array: Builder<S.SetActualType<$State, __element__>> }
        // Not any of the above - no extractors
        : {}

/**
 * Valid relator kinds for use in Relator interface.
 */
type RelatorKind = ExactKind | EquivKind | SubKind

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Matchers
//
//

/**
 * Relator namespace containing all matchers for a specific relator.
 *
 * Matchers come in three forms:
 * - `.of` - Base primitive, takes expected then actual (two-level curry)
 * - `.string`, `.number`, etc. - Pre-curried convenience (one-level, direct actual)
 * - `.literal` - Special matcher with const inference (two-level curry)
 */
export interface BuilderMatchers<
  $State extends S,
  $RelatorKind extends RelatorKind = RelatorKind,
> {
  readonly of: InputExpectedAsValue<$State>
  readonly ofAs: InputExpectedAsType<$State>

  readonly string: InputActualDispatch<S.SetExpectedType<$State, string>>
  readonly number: InputActualDispatch<S.SetExpectedType<$State, number>>
  readonly bigint: InputActualDispatch<S.SetExpectedType<$State, bigint>>
  readonly boolean: InputActualDispatch<S.SetExpectedType<$State, boolean>>
  readonly undefined: InputActualDispatch<S.SetExpectedType<$State, undefined>>
  readonly null: InputActualDispatch<S.SetExpectedType<$State, null>>
  readonly symbol: InputActualDispatch<S.SetExpectedType<$State, symbol>>

  readonly Date: InputActualDispatch<S.SetExpectedType<$State, Date>>
  readonly RegExp: InputActualDispatch<S.SetExpectedType<$State, RegExp>>
  readonly Error: InputActualDispatch<S.SetExpectedType<$State, Error>>

  readonly unknown: InputActualDispatch<S.SetExpectedType<S.SetAllowUnknown<$State>, unknown>>
  readonly any: InputActualDispatch<S.SetExpectedType<S.SetAllowAny<$State>, any>>
  readonly never: InputActualDispatch<S.SetExpectedType<S.SetAllowNever<$State>, never>>

  /**
   * NoExcess modifier - adds excess property checking to relation.
   *
   * - `sub.noExcess`: Subtype relation with excess property checking
   * - `equiv.noExcess`: Equivalence relation with excess property checking
   * - `exact.noExcess`: Not available (exact already requires exact match)
   */
  readonly noExcess: {
    sub: InputExpectedAsValue<S.SetRelator<$State, SubNoExcessKind>>
    equiv: InputExpectedAsValue<S.SetRelator<$State, EquivNoExcessKind>>
    exact: never
  }[$RelatorKind['name']]

  /**
   * Type-explicit variant of noExcess.
   */
  readonly noExcessAs: {
    sub: InputExpectedAsType<S.SetRelator<$State, SubNoExcessKind>>
    equiv: InputExpectedAsType<S.SetRelator<$State, EquivNoExcessKind>>
    exact: never
  }[$RelatorKind['name']]
}

export type InputActualDispatch<$State extends S> = {
  'either': never
  'expected': never
  'actual': InputActualAsValue<$State>
  'complete': ExecuteLone<$State>
}[S.InputNextCase<$State>]

//
//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Settings
//
//

export interface BuilderSettings<$State extends S> {
  // _: $State
  /**
   * Negate the assertion (inverts the relation check).
   */
  readonly not: Builder<S.SetNegated<$State>>

  /**
   * Configure inference mode to narrow (literals with readonly preserved).
   *
   * Use `const` modifier with readonly preserved.
   * Example: `[1, 2]` becomes `readonly [1, 2]`
   */
  readonly inferNarrow: Builder<S.SetInferMode<$State, 'narrow'>>

  /**
   * Configure inference mode to wide (no literal inference).
   *
   * No `const` modifier, types are widened.
   * Example: `[1, 2]` becomes `number[]`
   */
  readonly inferWide: Builder<S.SetInferMode<$State, 'wide'>>

  /**
   * Configure inference mode to auto (default: literals with readonly stripped).
   *
   * Use `const` modifier but strip readonly deep.
   * Example: `[1, 2]` becomes `[1, 2]` (not `readonly [1, 2]`)
   */
  readonly inferAuto: Builder<S.SetInferMode<$State, 'auto'>>

  /**
   * Dynamically configure inference mode.
   *
   * Useful when inference mode comes from configuration or external source.
   */
  setInfer<$Mode extends S.InferMode>(mode: $Mode): Builder<S.SetInferMode<$State, $Mode>>
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • InputExpected
//
//
//
//

// dprint-ignore
export type InputExpectedAsValue<$State extends S> = {
  'auto': InputExpectedAsValueNarrow<$State>
  'narrow': InputExpectedAsValueNarrow<$State>
  'wide': InputExpectedAsValueWide<$State>
}[$State['matcher_inferMode']]

// dprint-ignore
export interface InputExpectedAsValueNarrow<$State extends S> {
  <const $expected>(...params: InputExpectedAsValueParams<$State, $expected>): DispatchAfterInput<S.SetExpectedType<$State, $expected>>
}
// dprint-ignore
export interface InputExpectedAsValueWide<$State extends S> {
        <$expected>(...params: InputExpectedAsValueParams<$State, $expected>): DispatchAfterInput<S.SetExpectedType<$State, $expected>>
}

export interface InputExpectedAsType<$State extends S> {
  <$Type>(
    ...errors: InputExpectedAsTypeParam<$State, $Type>
  ): DispatchAfterInput<S.SetExpectedType<$State, $Type>>
}

export type InputExpectedAsTypeParam<
  $State extends S,
  $expected,
> = {
  'either': []
  // Trigger
  'expected': OnlyFailingChecks<[
    GuardExpected<$expected, $State>,
    ...GuardAgainstAnyNeverUnknown<$State['actual_type'], $expected, $State>,
  ]>
  // Awaiting actual now
  'actual': []
  // impossible
  'complete': never
}[S.InputNextCase<$State>]

export type InputExpectedAsValueParams<
  $State extends S,
  $expected,
> = {
  // Neither set - no guards needed
  'either': [expected: $expected]
  // Expected missing, actual IS set - validate expected against actual
  'expected': [
    expected: GuardExpected<$expected, $State>,
    ...GuardAgainstAnyNeverUnknown<$State['actual_type'], $expected, $State>,
  ]
  // Impossible - expected already set
  'actual': never
  // Impossible
  'complete': never
}[S.InputNextCase<$State>]

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • InputActual
//
//
//
//

export interface BuilderActualInput<
  $State extends S,
> {
  on: InputActualAsValue<$State>
  onAs: InputActualAsType<$State>
}

export type InputActualAsValue<
  $State extends S,
> = {
  'auto': InputActualAsValueNarrow<$State>
  'wide': InputActualAsValueWide<$State>
  'narrow': InputActualAsValueNarrow<$State>
}[$State['matcher_inferMode']]

// dprint-ignore
export interface InputActualAsValueNarrow<$State extends S> {
  <const $actual>(...params: InputActualAsValueParams<$State, $actual>): DispatchAfterInput<S.SetActualType<$State,$actual>>
}
// dprint-ignore
export interface InputActualAsValueWide<$State extends S> {
        <$actual>(...params: InputActualAsValueParams<$State, $actual>): DispatchAfterInput<S.SetActualType<$State,$actual>>
}

export type InputActualAsValueParams<
  $State extends S,
  $actual,
> = {
  // in this case we're in an actual-first style call chain,
  // just collect the actual, don't apply assertion yet since
  // we don't have any expected to work with.
  'either': [actual: $actual]
  // Impossible, ... todo?
  'expected': never
  // trigger
  'actual': [
    actual: GuardActual<$actual, $State>,
    ...GuardAgainstAnyNeverUnknown<NoInfer<$actual>, $State['expected_type'], $State>,
  ]
  // Impossible, only at the end of the chain can this happen
  'complete': never
}[S.InputNextCase<$State>]

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • InputActualAsType

export interface InputActualAsType<$State extends S> {
  <$actual>(
    ...errors: InputActualAsTypeParam<$State, $actual>
  ): DispatchAfterInput<S.SetActualType<$State, $actual>>
}

export type InputActualAsTypeParam<
  $State extends S,
  $actual,
> = {
  // Actual-first mode - no guards needed (no relator/expected to validate against)
  'either': []
  // Impossible
  'expected': never
  // Expected-first mode - apply guards to validate actual matches expected
  'actual': OnlyFailingChecks<[
    GuardActual<$actual, $State>,
    ...GuardAgainstAnyNeverUnknown<$actual, $State['expected_type'], $State>,
  ]>
  // Impossible
  'complete': never
}[S.InputNextCase<$State>]

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • DispatchAfterInput
//
//
//
//

export type DispatchAfterInput<$State extends S> = {
  'either': never
  'expected': Builder<$State>
  'actual': Builder<$State>
  'complete': never // ExecuteLone<$State>
}[S.InputNextCase<$State>]

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Execute
//
//
//
//

type ExecuteLone<$State extends S> = (
  ...errors: OnlyFailingChecks<[
    GuardActual<$State['actual_type'], $State>,
    ...GuardAgainstAnyNeverUnknown<$State['actual_type'], $State['expected_type'], $State>,
  ]>
) => void
