import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { Returned } from '../../kinds/extractors.js'
import type { ExactKind } from '../../kinds/relators.js'

/**
 * returned + exact relation matchers.
 *
 * Extraction: extracts the return type from a function
 * Relation: exact structural equality
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (...args: any[]) => T → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `exact<E, A>` instead of `exact.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.of<string, () => string>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.of<string, () => number>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Returned, [$Actual]>]>
const of_ = runtime.returned.exact.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.string<() => string>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.string<() => number>
 * ```
 */
type string_<$Actual> = Kind.Apply<ExactKind, [string, Kind.Apply<Returned, [$Actual]>]>
const string_ = runtime.returned.exact.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.number<() => number>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.number<() => string>
 * ```
 */
type number_<$Actual> = Kind.Apply<ExactKind, [number, Kind.Apply<Returned, [$Actual]>]>
const number_ = runtime.returned.exact.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.bigint<() => bigint>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.bigint<() => string>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, Kind.Apply<Returned, [$Actual]>]>
const bigint_ = runtime.returned.exact.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.boolean<() => boolean>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.boolean<() => string>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, Kind.Apply<Returned, [$Actual]>]>
const boolean_ = runtime.returned.exact.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.undefined<() => undefined>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.undefined<() => string>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, Kind.Apply<Returned, [$Actual]>]>
const undefined_ = runtime.returned.exact.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.null<() => null>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.null<() => string>
 * ```
 */
type null_<$Actual> = Kind.Apply<ExactKind, [null, Kind.Apply<Returned, [$Actual]>]>
const null_ = runtime.returned.exact.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.symbol<() => symbol>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.symbol<() => string>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, Kind.Apply<Returned, [$Actual]>]>
const symbol_ = runtime.returned.exact.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.Date<() => Date>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.Date<() => string>
 * ```
 */
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, Kind.Apply<Returned, [$Actual]>]>
const Date_ = runtime.returned.exact.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.RegExp<() => RegExp>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.RegExp<() => string>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, Kind.Apply<Returned, [$Actual]>]>
const RegExp_ = runtime.returned.exact.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.Error<() => Error>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.Error<() => string>
 * ```
 */
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, Kind.Apply<Returned, [$Actual]>]>
const Error_ = runtime.returned.exact.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.Promise<() => Promise<any>>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.Promise<() => string>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<ExactKind, [Promise<any>, Kind.Apply<Returned, [$Actual]>]>
const Promise_ = runtime.returned.exact.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.Array<() => any[]>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.Array<() => string>
 * ```
 */
type Array_<$Actual> = Kind.Apply<ExactKind, [any[], Kind.Apply<Returned, [$Actual]>]>
const Array_ = runtime.returned.exact.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.unknown<() => unknown>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.unknown<() => string>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<ExactKind, [unknown, Kind.Apply<Returned, [$Actual]>]>
const unknown_ = runtime.returned.exact.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.any<() => any>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.any<() => string>
 * ```
 */
type any_<$Actual> = Kind.Apply<ExactKind, [any, Kind.Apply<Returned, [$Actual]>]>
const any_ = runtime.returned.exact.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.never<() => never>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.never<() => string>
 * ```
 */
type never_<$Actual> = Kind.Apply<ExactKind, [never, Kind.Apply<Returned, [$Actual]>]>
const never_ = runtime.returned.exact.never

const ofAs_ = runtime.returned.exact.ofAs
type noExcess_ = never
const noExcess_ = runtime.returned.exact.noExcess

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
