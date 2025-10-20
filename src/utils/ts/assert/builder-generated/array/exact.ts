/**
 * @generated
 * This file contains generated type-level matchers.
 * Manual edits should be made carefully and consistently across all generated files.
 */

import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { ArrayElement } from '../../kinds/extractors.js'
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
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<ArrayElement, [$Actual]>]>
const of_ = runtime.array.exact.of

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
type string_<$Actual> = Kind.Apply<ExactKind, [string, Kind.Apply<ArrayElement, [$Actual]>]>
const string_ = runtime.array.exact.string

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
type number_<$Actual> = Kind.Apply<ExactKind, [number, Kind.Apply<ArrayElement, [$Actual]>]>
const number_ = runtime.array.exact.number

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
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, Kind.Apply<ArrayElement, [$Actual]>]>
const bigint_ = runtime.array.exact.bigint

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
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, Kind.Apply<ArrayElement, [$Actual]>]>
const boolean_ = runtime.array.exact.boolean

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
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, Kind.Apply<ArrayElement, [$Actual]>]>
const undefined_ = runtime.array.exact.undefined

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
type null_<$Actual> = Kind.Apply<ExactKind, [null, Kind.Apply<ArrayElement, [$Actual]>]>
const null_ = runtime.array.exact.null

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
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, Kind.Apply<ArrayElement, [$Actual]>]>
const symbol_ = runtime.array.exact.symbol

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
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, Kind.Apply<ArrayElement, [$Actual]>]>
const Date_ = runtime.array.exact.Date

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
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, Kind.Apply<ArrayElement, [$Actual]>]>
const RegExp_ = runtime.array.exact.RegExp

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
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, Kind.Apply<ArrayElement, [$Actual]>]>
const Error_ = runtime.array.exact.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.Promise<Promise<any>[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.Promise<string[]>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<ExactKind, [Promise<any>, Kind.Apply<ArrayElement, [$Actual]>]>
const Promise_ = runtime.array.exact.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.exact.Array<any[][]>
 *
 * // ✗ Fail
 * type _ = Assert.array.exact.Array<string[]>
 * ```
 */
type Array_<$Actual> = Kind.Apply<ExactKind, [any[], Kind.Apply<ArrayElement, [$Actual]>]>
const Array_ = runtime.array.exact.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: T[] → T
 */
type unknown_<$Actual> = Kind.Apply<ExactKind, [unknown, Kind.Apply<ArrayElement, [$Actual]>]>
const unknown_ = runtime.array.exact.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: T[] → T
 */
type any_<$Actual> = Kind.Apply<ExactKind, [any, Kind.Apply<ArrayElement, [$Actual]>]>
const any_ = runtime.array.exact.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: T[] → T
 */
type never_<$Actual> = Kind.Apply<ExactKind, [never, Kind.Apply<ArrayElement, [$Actual]>]>
const never_ = runtime.array.exact.never

export {
  any_ as any,
  Array_ as Array,
  bigint_ as bigint,
  boolean_ as boolean,
  Date_ as Date,
  Error_ as Error,
  never_ as never,
  null_ as null,
  number_ as number,
  of_ as of,
  Promise_ as Promise,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
  unknown_ as unknown,
}
