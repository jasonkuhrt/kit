import type * as Kind from '../../../../kind.js'
import { runtime } from '../../../builder/runtime.js'
import type { ArrayElement } from '../../../../path.js'
import type { EquivKind } from '../../../kinds/relators.js'

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
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<ArrayElement, [$Actual]>, true]>
const of_ = runtime.array.not.equiv.of

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
type string_<$Actual> = Kind.Apply<EquivKind, [string, Kind.Apply<ArrayElement, [$Actual]>, true]>
const string_ = runtime.array.not.equiv.string

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
type number_<$Actual> = Kind.Apply<EquivKind, [number, Kind.Apply<ArrayElement, [$Actual]>, true]>
const number_ = runtime.array.not.equiv.number

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
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, Kind.Apply<ArrayElement, [$Actual]>, true]>
const bigint_ = runtime.array.not.equiv.bigint

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
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, Kind.Apply<ArrayElement, [$Actual]>, true]>
const boolean_ = runtime.array.not.equiv.boolean

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
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, Kind.Apply<ArrayElement, [$Actual]>, true]>
const undefined_ = runtime.array.not.equiv.undefined

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
type null_<$Actual> = Kind.Apply<EquivKind, [null, Kind.Apply<ArrayElement, [$Actual]>, true]>
const null_ = runtime.array.not.equiv.null

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
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, Kind.Apply<ArrayElement, [$Actual]>, true]>
const symbol_ = runtime.array.not.equiv.symbol

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
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, Kind.Apply<ArrayElement, [$Actual]>, true]>
const Date_ = runtime.array.not.equiv.Date

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
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, Kind.Apply<ArrayElement, [$Actual]>, true]>
const RegExp_ = runtime.array.not.equiv.RegExp

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
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, Kind.Apply<ArrayElement, [$Actual]>, true]>
const Error_ = runtime.array.not.equiv.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.Promise<Promise<any>[]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.Promise<string[]>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<EquivKind, [Promise<any>, Kind.Apply<ArrayElement, [$Actual]>, true]>
const Promise_ = runtime.array.not.equiv.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: T[] → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.array.equiv.Array<any[][]>
 *
 * // ✗ Fail
 * type _ = Assert.array.equiv.Array<string[]>
 * ```
 */
type Array_<$Actual> = Kind.Apply<EquivKind, [any[], Kind.Apply<ArrayElement, [$Actual]>, true]>
const Array_ = runtime.array.not.equiv.Array

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
type unknown_<$Actual> = Kind.Apply<EquivKind, [unknown, Kind.Apply<ArrayElement, [$Actual]>, true]>
const unknown_ = runtime.array.not.equiv.unknown

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
type any_<$Actual> = Kind.Apply<EquivKind, [any, Kind.Apply<ArrayElement, [$Actual]>, true]>
const any_ = runtime.array.not.equiv.any

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
type never_<$Actual> = Kind.Apply<EquivKind, [never, Kind.Apply<ArrayElement, [$Actual]>, true]>
const never_ = runtime.array.not.equiv.never

const ofAs_ = runtime.array.not.equiv.ofAs

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
  ofAs_ as ofAs,
  Promise_ as Promise,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
  unknown_ as unknown,
}
