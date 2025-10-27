import type { Fn } from '#fn'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { ExactKind } from '../../kinds/relators.js'

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
type of_<$Expected, $Actual> = Fn.Kind.Apply<ExactKind, [$Expected, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const of_ = builder.array.exact.of

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
type string_<$Actual> = Fn.Kind.Apply<ExactKind, [string, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const string_ = builder.array.exact.string

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
type number_<$Actual> = Fn.Kind.Apply<ExactKind, [number, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const number_ = builder.array.exact.number

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
type bigint_<$Actual> = Fn.Kind.Apply<ExactKind, [bigint, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const bigint_ = builder.array.exact.bigint

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
type boolean_<$Actual> = Fn.Kind.Apply<ExactKind, [boolean, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const boolean_ = builder.array.exact.boolean

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
type undefined_<$Actual> = Fn.Kind.Apply<ExactKind, [undefined, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const undefined_ = builder.array.exact.undefined

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
type null_<$Actual> = Fn.Kind.Apply<ExactKind, [null, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const null_ = builder.array.exact.null

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
type symbol_<$Actual> = Fn.Kind.Apply<ExactKind, [symbol, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const symbol_ = builder.array.exact.symbol

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
type Date_<$Actual> = Fn.Kind.Apply<ExactKind, [Date, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const Date_ = builder.array.exact.Date

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
type RegExp_<$Actual> = Fn.Kind.Apply<ExactKind, [RegExp, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const RegExp_ = builder.array.exact.RegExp

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
type Error_<$Actual> = Fn.Kind.Apply<ExactKind, [Error, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const Error_ = builder.array.exact.Error

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
type unknown_<$Actual> = Fn.Kind.Apply<ExactKind, [unknown, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const unknown_ = builder.array.exact.unknown

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
type any_<$Actual> = Fn.Kind.Apply<ExactKind, [any, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const any_ = builder.array.exact.any

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
type never_<$Actual> = Fn.Kind.Apply<ExactKind, [never, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const never_ = builder.array.exact.never

const ofAs_ = <$Type>() => builder.array.exact.ofAs<$Type>()
type noExcess_ = never
const noExcess_ = builder.array.exact.noExcess

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
