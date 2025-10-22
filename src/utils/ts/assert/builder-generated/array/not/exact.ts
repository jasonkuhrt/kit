import type * as Kind from '../../../../kind.js'
import type * as Path from '../../../../path.js'
import { builder } from '../../../builder-singleton.js'
import type { ExactKind } from '../../../kinds/relators.js'

/**
 * array + exact relation matchers.
 *
 * Extraction: extracts the element type from an array
 * Relation: exact structural equality
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: T[] → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `exact<E, A>` instead of `exact.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.of<string, string[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.of<string, number[]>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const of_ = builder.array.not.exact.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.string<string[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.string<number[]>
 * ```
 */
type string_<$Actual> = Kind.Apply<ExactKind, [string, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const string_ = builder.array.not.exact.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.number<number[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.number<string[]>
 * ```
 */
type number_<$Actual> = Kind.Apply<ExactKind, [number, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const number_ = builder.array.not.exact.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.bigint<bigint[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.bigint<string[]>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const bigint_ = builder.array.not.exact.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.boolean<boolean[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.boolean<string[]>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const boolean_ = builder.array.not.exact.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.undefined<undefined[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.undefined<string[]>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const undefined_ = builder.array.not.exact.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.null<null[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.null<string[]>
 * ```
 */
type null_<$Actual> = Kind.Apply<ExactKind, [null, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const null_ = builder.array.not.exact.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.symbol<symbol[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.symbol<string[]>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const symbol_ = builder.array.not.exact.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.Date<Date[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.Date<string[]>
 * ```
 */
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const Date_ = builder.array.not.exact.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.RegExp<RegExp[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.RegExp<string[]>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const RegExp_ = builder.array.not.exact.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.Error<Error[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.Error<string[]>
 * ```
 */
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const Error_ = builder.array.not.exact.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.unknown<unknown[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.unknown<string[]>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<ExactKind, [unknown, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const unknown_ = builder.array.not.exact.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.any<any[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.any<string[]>
 * ```
 */
type any_<$Actual> = Kind.Apply<ExactKind, [any, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const any_ = builder.array.not.exact.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.never<never[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.never<string[]>
 * ```
 */
type never_<$Actual> = Kind.Apply<ExactKind, [never, Kind.Apply<Path.ArrayElement, [$Actual]>, true]>
const never_ = builder.array.not.exact.never

const ofAs_ = <$Type>() => builder.array.not.exact.ofAs<$Type>()
type noExcess_ = never
const noExcess_ = builder.array.not.exact.noExcess

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
