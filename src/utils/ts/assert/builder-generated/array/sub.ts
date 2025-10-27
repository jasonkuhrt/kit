import type { Fn } from '#fn'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { SubKind, SubNoExcessKind } from '../../kinds/relators.js'

/**
 * array + sub relation matchers.
 *
 * Extraction: extracts the element type from an array
 * Relation: subtype relation (extends)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: T[] → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `sub<E, A>` instead of `sub.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.of<string, string[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.of<string, number[]>
 * ```
 */
type of_<$Expected, $Actual> = Fn.Kind.Apply<SubKind, [$Expected, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const of_ = builder.array.sub.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.string<string[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.string<number[]>
 * ```
 */
type string_<$Actual> = Fn.Kind.Apply<SubKind, [string, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const string_ = builder.array.sub.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.number<number[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.number<string[]>
 * ```
 */
type number_<$Actual> = Fn.Kind.Apply<SubKind, [number, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const number_ = builder.array.sub.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.bigint<bigint[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.bigint<string[]>
 * ```
 */
type bigint_<$Actual> = Fn.Kind.Apply<SubKind, [bigint, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const bigint_ = builder.array.sub.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.boolean<boolean[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.boolean<string[]>
 * ```
 */
type boolean_<$Actual> = Fn.Kind.Apply<SubKind, [boolean, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const boolean_ = builder.array.sub.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.undefined<undefined[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.undefined<string[]>
 * ```
 */
type undefined_<$Actual> = Fn.Kind.Apply<SubKind, [undefined, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const undefined_ = builder.array.sub.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.null<null[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.null<string[]>
 * ```
 */
type null_<$Actual> = Fn.Kind.Apply<SubKind, [null, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const null_ = builder.array.sub.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.symbol<symbol[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.symbol<string[]>
 * ```
 */
type symbol_<$Actual> = Fn.Kind.Apply<SubKind, [symbol, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const symbol_ = builder.array.sub.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.Date<Date[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.Date<string[]>
 * ```
 */
type Date_<$Actual> = Fn.Kind.Apply<SubKind, [Date, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const Date_ = builder.array.sub.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.RegExp<RegExp[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.RegExp<string[]>
 * ```
 */
type RegExp_<$Actual> = Fn.Kind.Apply<SubKind, [RegExp, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const RegExp_ = builder.array.sub.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.Error<Error[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.Error<string[]>
 * ```
 */
type Error_<$Actual> = Fn.Kind.Apply<SubKind, [Error, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const Error_ = builder.array.sub.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.unknown<unknown[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.unknown<string[]>
 * ```
 */
type unknown_<$Actual> = Fn.Kind.Apply<SubKind, [unknown, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const unknown_ = builder.array.sub.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.any<any[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.any<string[]>
 * ```
 */
type any_<$Actual> = Fn.Kind.Apply<SubKind, [any, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const any_ = builder.array.sub.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.never<never[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.never<string[]>
 * ```
 */
type never_<$Actual> = Fn.Kind.Apply<SubKind, [never, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]>
const never_ = builder.array.sub.never

const ofAs_ = <$Type>() => builder.array.sub.ofAs<$Type>()
/**
 * No-excess variant of sub relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Fn.Kind.Apply<
  SubNoExcessKind,
  [$Expected, Fn.Kind.Apply<Path.ArrayElement, [$Actual]>]
>
const noExcess_ = builder.array.sub.noExcess
const noExcessAs_ = <$Type>() => builder.array.sub.noExcessAs<$Type>()

export {
  any_ as any,
  bigint_ as bigint,
  boolean_ as boolean,
  Date_ as Date,
  Error_ as Error,
  never_ as never,
  noExcess_ as noExcess,
  noExcessAs_ as noExcessAs,
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
