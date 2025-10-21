import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { Awaited$ } from '../../../path.js'
import type { ExactKind } from '../../kinds/relators.js'

/**
 * awaited + exact relation matchers.
 *
 * Extraction: extracts the resolved type from a Promise
 * Relation: exact structural equality
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: Promise<T> → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `exact<E, A>` instead of `exact.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.of<string, Promise<string>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.of<string, Promise<number>>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Awaited$, [$Actual]>]>
const of_ = runtime.awaited.exact.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.string<Promise<string>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.string<Promise<number>>
 * ```
 */
type string_<$Actual> = Kind.Apply<ExactKind, [string, Kind.Apply<Awaited$, [$Actual]>]>
const string_ = runtime.awaited.exact.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.number<Promise<number>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.number<Promise<string>>
 * ```
 */
type number_<$Actual> = Kind.Apply<ExactKind, [number, Kind.Apply<Awaited$, [$Actual]>]>
const number_ = runtime.awaited.exact.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.bigint<Promise<bigint>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.bigint<Promise<string>>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, Kind.Apply<Awaited$, [$Actual]>]>
const bigint_ = runtime.awaited.exact.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.boolean<Promise<boolean>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.boolean<Promise<string>>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, Kind.Apply<Awaited$, [$Actual]>]>
const boolean_ = runtime.awaited.exact.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.undefined<Promise<undefined>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.undefined<Promise<string>>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, Kind.Apply<Awaited$, [$Actual]>]>
const undefined_ = runtime.awaited.exact.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.null<Promise<null>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.null<Promise<string>>
 * ```
 */
type null_<$Actual> = Kind.Apply<ExactKind, [null, Kind.Apply<Awaited$, [$Actual]>]>
const null_ = runtime.awaited.exact.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.symbol<Promise<symbol>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.symbol<Promise<string>>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, Kind.Apply<Awaited$, [$Actual]>]>
const symbol_ = runtime.awaited.exact.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.Date<Promise<Date>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.Date<Promise<string>>
 * ```
 */
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, Kind.Apply<Awaited$, [$Actual]>]>
const Date_ = runtime.awaited.exact.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.RegExp<Promise<RegExp>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.RegExp<Promise<string>>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, Kind.Apply<Awaited$, [$Actual]>]>
const RegExp_ = runtime.awaited.exact.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.Error<Promise<Error>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.Error<Promise<string>>
 * ```
 */
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, Kind.Apply<Awaited$, [$Actual]>]>
const Error_ = runtime.awaited.exact.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.Promise<Promise<Promise<any>>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.Promise<Promise<string>>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<ExactKind, [Promise<any>, Kind.Apply<Awaited$, [$Actual]>]>
const Promise_ = runtime.awaited.exact.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.Array<Promise<any[]>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.Array<Promise<string>>
 * ```
 */
type Array_<$Actual> = Kind.Apply<ExactKind, [any[], Kind.Apply<Awaited$, [$Actual]>]>
const Array_ = runtime.awaited.exact.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.unknown<Promise<unknown>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.unknown<Promise<string>>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<ExactKind, [unknown, Kind.Apply<Awaited$, [$Actual]>]>
const unknown_ = runtime.awaited.exact.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.any<Promise<any>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.any<Promise<string>>
 * ```
 */
type any_<$Actual> = Kind.Apply<ExactKind, [any, Kind.Apply<Awaited$, [$Actual]>]>
const any_ = runtime.awaited.exact.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.exact.never<Promise<never>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.exact.never<Promise<string>>
 * ```
 */
type never_<$Actual> = Kind.Apply<ExactKind, [never, Kind.Apply<Awaited$, [$Actual]>]>
const never_ = runtime.awaited.exact.never

const ofAs_ = runtime.awaited.exact.ofAs
type noExcess_ = never
const noExcess_ = runtime.awaited.exact.noExcess

export {
  any_ as any,
  Array_ as Array,
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
  Promise_ as Promise,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
  unknown_ as unknown,
}
