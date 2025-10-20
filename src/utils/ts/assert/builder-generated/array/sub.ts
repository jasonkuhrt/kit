/**
 * @generated
 * This file contains generated type-level matchers.
 * Manual edits should be made carefully and consistently across all generated files.
 */

import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { ArrayElement } from '../../kinds/extractors.js'
import type { SubKind } from '../../kinds/relators.js'

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
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<ArrayElement, [$Actual]>]>
const of_ = runtime.array.sub.of

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
type string_<$Actual> = Kind.Apply<SubKind, [string, Kind.Apply<ArrayElement, [$Actual]>]>
const string_ = runtime.array.sub.string

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
type number_<$Actual> = Kind.Apply<SubKind, [number, Kind.Apply<ArrayElement, [$Actual]>]>
const number_ = runtime.array.sub.number

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
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, Kind.Apply<ArrayElement, [$Actual]>]>
const bigint_ = runtime.array.sub.bigint

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
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, Kind.Apply<ArrayElement, [$Actual]>]>
const boolean_ = runtime.array.sub.boolean

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
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, Kind.Apply<ArrayElement, [$Actual]>]>
const undefined_ = runtime.array.sub.undefined

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
type null_<$Actual> = Kind.Apply<SubKind, [null, Kind.Apply<ArrayElement, [$Actual]>]>
const null_ = runtime.array.sub.null

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
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, Kind.Apply<ArrayElement, [$Actual]>]>
const symbol_ = runtime.array.sub.symbol

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
type Date_<$Actual> = Kind.Apply<SubKind, [Date, Kind.Apply<ArrayElement, [$Actual]>]>
const Date_ = runtime.array.sub.Date

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
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, Kind.Apply<ArrayElement, [$Actual]>]>
const RegExp_ = runtime.array.sub.RegExp

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
type Error_<$Actual> = Kind.Apply<SubKind, [Error, Kind.Apply<ArrayElement, [$Actual]>]>
const Error_ = runtime.array.sub.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.Promise<Promise<any>[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.Promise<string[]>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<SubKind, [Promise<any>, Kind.Apply<ArrayElement, [$Actual]>]>
const Promise_ = runtime.array.sub.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.sub.Array<any[][]>
 *
 * // ✗ Fail
 * type _ = Assert.array.sub.Array<string[]>
 * ```
 */
type Array_<$Actual> = Kind.Apply<SubKind, [any[], Kind.Apply<ArrayElement, [$Actual]>]>
const Array_ = runtime.array.sub.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: T[] → T
 */
type unknown_<$Actual> = Kind.Apply<SubKind, [unknown, Kind.Apply<ArrayElement, [$Actual]>]>
const unknown_ = runtime.array.sub.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: T[] → T
 */
type any_<$Actual> = Kind.Apply<SubKind, [any, Kind.Apply<ArrayElement, [$Actual]>]>
const any_ = runtime.array.sub.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: T[] → T
 */
type never_<$Actual> = Kind.Apply<SubKind, [never, Kind.Apply<ArrayElement, [$Actual]>]>
const never_ = runtime.array.sub.never

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
