import type * as Kind from '../../../kind.js'
import type { Parameters$ } from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { ExactKind } from '../../kinds/relators.js'

/**
 * parameters + exact relation matchers.
 *
 * Extraction: extracts the parameters tuple from a function
 * Relation: exact structural equality
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `exact<E, A>` instead of `exact.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.of<string, (...args: any[]) => string>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.of<string, (...args: any[]) => number>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Parameters$, [$Actual]>]>
const of_ = builder.parameters.exact.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.string<(...args: any[]) => string>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.string<(...args: any[]) => number>
 * ```
 */
type string_<$Actual> = Kind.Apply<ExactKind, [string, Kind.Apply<Parameters$, [$Actual]>]>
const string_ = builder.parameters.exact.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.number<(...args: any[]) => number>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.number<(...args: any[]) => string>
 * ```
 */
type number_<$Actual> = Kind.Apply<ExactKind, [number, Kind.Apply<Parameters$, [$Actual]>]>
const number_ = builder.parameters.exact.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.bigint<(...args: any[]) => bigint>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.bigint<(...args: any[]) => string>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, Kind.Apply<Parameters$, [$Actual]>]>
const bigint_ = builder.parameters.exact.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.boolean<(...args: any[]) => boolean>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.boolean<(...args: any[]) => string>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, Kind.Apply<Parameters$, [$Actual]>]>
const boolean_ = builder.parameters.exact.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.undefined<(...args: any[]) => undefined>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.undefined<(...args: any[]) => string>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, Kind.Apply<Parameters$, [$Actual]>]>
const undefined_ = builder.parameters.exact.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.null<(...args: any[]) => null>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.null<(...args: any[]) => string>
 * ```
 */
type null_<$Actual> = Kind.Apply<ExactKind, [null, Kind.Apply<Parameters$, [$Actual]>]>
const null_ = builder.parameters.exact.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.symbol<(...args: any[]) => symbol>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.symbol<(...args: any[]) => string>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, Kind.Apply<Parameters$, [$Actual]>]>
const symbol_ = builder.parameters.exact.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.Date<(...args: any[]) => Date>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.Date<(...args: any[]) => string>
 * ```
 */
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, Kind.Apply<Parameters$, [$Actual]>]>
const Date_ = builder.parameters.exact.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.RegExp<(...args: any[]) => RegExp>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.RegExp<(...args: any[]) => string>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, Kind.Apply<Parameters$, [$Actual]>]>
const RegExp_ = builder.parameters.exact.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.Error<(...args: any[]) => Error>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.Error<(...args: any[]) => string>
 * ```
 */
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, Kind.Apply<Parameters$, [$Actual]>]>
const Error_ = builder.parameters.exact.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.unknown<(...args: any[]) => unknown>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.unknown<(...args: any[]) => string>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<ExactKind, [unknown, Kind.Apply<Parameters$, [$Actual]>]>
const unknown_ = builder.parameters.exact.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.any<(...args: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.any<(...args: any[]) => string>
 * ```
 */
type any_<$Actual> = Kind.Apply<ExactKind, [any, Kind.Apply<Parameters$, [$Actual]>]>
const any_ = builder.parameters.exact.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.never<(...args: any[]) => never>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.never<(...args: any[]) => string>
 * ```
 */
type never_<$Actual> = Kind.Apply<ExactKind, [never, Kind.Apply<Parameters$, [$Actual]>]>
const never_ = builder.parameters.exact.never

const ofAs_ = <$Type>() => builder.parameters.exact.ofAs<$Type>()
type noExcess_ = never
const noExcess_ = builder.parameters.exact.noExcess

export {
  any_ as any,
  bigint_ as bigint,
  boolean_ as boolean,
  Date_ as Date,
  Error_ as Error,
  never_ as never,
  noExcess_ as noExcess,
  null_ as null,
  number_ as number,
  of_ as of,
  ofAs_ as ofAs,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
  unknown_ as unknown,
}
