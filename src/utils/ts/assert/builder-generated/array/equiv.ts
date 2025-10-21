import type * as Kind from '../../../kind.js'
import type { ArrayElement } from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, EquivNoExcessKind } from '../../kinds/relators.js'

/**
 * array + equiv relation matchers.
 *
 * Extraction: extracts the element type from an array
 * Relation: mutual assignability (equivalent types)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: T[] → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `equiv<E, A>` instead of `equiv.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.of<string, string[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.of<string, number[]>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<ArrayElement, [$Actual]>]>
const of_ = builder.array.equiv.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.string<string[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.string<number[]>
 * ```
 */
type string_<$Actual> = Kind.Apply<EquivKind, [string, Kind.Apply<ArrayElement, [$Actual]>]>
const string_ = builder.array.equiv.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.number<number[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.number<string[]>
 * ```
 */
type number_<$Actual> = Kind.Apply<EquivKind, [number, Kind.Apply<ArrayElement, [$Actual]>]>
const number_ = builder.array.equiv.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.bigint<bigint[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.bigint<string[]>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, Kind.Apply<ArrayElement, [$Actual]>]>
const bigint_ = builder.array.equiv.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.boolean<boolean[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.boolean<string[]>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, Kind.Apply<ArrayElement, [$Actual]>]>
const boolean_ = builder.array.equiv.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.undefined<undefined[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.undefined<string[]>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, Kind.Apply<ArrayElement, [$Actual]>]>
const undefined_ = builder.array.equiv.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.null<null[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.null<string[]>
 * ```
 */
type null_<$Actual> = Kind.Apply<EquivKind, [null, Kind.Apply<ArrayElement, [$Actual]>]>
const null_ = builder.array.equiv.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.symbol<symbol[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.symbol<string[]>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, Kind.Apply<ArrayElement, [$Actual]>]>
const symbol_ = builder.array.equiv.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.Date<Date[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.Date<string[]>
 * ```
 */
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, Kind.Apply<ArrayElement, [$Actual]>]>
const Date_ = builder.array.equiv.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.RegExp<RegExp[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.RegExp<string[]>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, Kind.Apply<ArrayElement, [$Actual]>]>
const RegExp_ = builder.array.equiv.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.Error<Error[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.Error<string[]>
 * ```
 */
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, Kind.Apply<ArrayElement, [$Actual]>]>
const Error_ = builder.array.equiv.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.unknown<unknown[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.unknown<string[]>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<EquivKind, [unknown, Kind.Apply<ArrayElement, [$Actual]>]>
const unknown_ = builder.array.equiv.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.any<any[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.any<string[]>
 * ```
 */
type any_<$Actual> = Kind.Apply<EquivKind, [any, Kind.Apply<ArrayElement, [$Actual]>]>
const any_ = builder.array.equiv.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.never<never[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.never<string[]>
 * ```
 */
type never_<$Actual> = Kind.Apply<EquivKind, [never, Kind.Apply<ArrayElement, [$Actual]>]>
const never_ = builder.array.equiv.never

const ofAs_ = <$Type>() => builder.array.equiv.ofAs<$Type>()
/**
 * No-excess variant of equiv relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Kind.Apply<EquivNoExcessKind, [$Expected, Kind.Apply<ArrayElement, [$Actual]>]>
const noExcess_ = builder.array.equiv.noExcess
const noExcessAs_ = <$Type>() => builder.array.equiv.noExcessAs<$Type>()

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
