import type { Fn } from '#fn'
import type * as Path from '../../../../path.js'
import { builder } from '../../../builder-singleton.js'
import type { ExactKind } from '../../../kinds/relators.js'

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
type of_<$Expected, $Actual> = Fn.Kind.Apply<ExactKind, [$Expected, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const of_ = builder.awaited.not.exact.of

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
type string_<$Actual> = Fn.Kind.Apply<ExactKind, [string, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const string_ = builder.awaited.not.exact.string

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
type number_<$Actual> = Fn.Kind.Apply<ExactKind, [number, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const number_ = builder.awaited.not.exact.number

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
type bigint_<$Actual> = Fn.Kind.Apply<ExactKind, [bigint, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const bigint_ = builder.awaited.not.exact.bigint

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
type boolean_<$Actual> = Fn.Kind.Apply<ExactKind, [boolean, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const boolean_ = builder.awaited.not.exact.boolean

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
type undefined_<$Actual> = Fn.Kind.Apply<ExactKind, [undefined, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const undefined_ = builder.awaited.not.exact.undefined

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
type null_<$Actual> = Fn.Kind.Apply<ExactKind, [null, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const null_ = builder.awaited.not.exact.null

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
type symbol_<$Actual> = Fn.Kind.Apply<ExactKind, [symbol, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const symbol_ = builder.awaited.not.exact.symbol

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
type Date_<$Actual> = Fn.Kind.Apply<ExactKind, [Date, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const Date_ = builder.awaited.not.exact.Date

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
type RegExp_<$Actual> = Fn.Kind.Apply<ExactKind, [RegExp, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const RegExp_ = builder.awaited.not.exact.RegExp

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
type Error_<$Actual> = Fn.Kind.Apply<ExactKind, [Error, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const Error_ = builder.awaited.not.exact.Error

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
type unknown_<$Actual> = Fn.Kind.Apply<ExactKind, [unknown, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const unknown_ = builder.awaited.not.exact.unknown

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
type any_<$Actual> = Fn.Kind.Apply<ExactKind, [any, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const any_ = builder.awaited.not.exact.any

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
type never_<$Actual> = Fn.Kind.Apply<ExactKind, [never, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const never_ = builder.awaited.not.exact.never

const ofAs_ = <$Type>() => builder.awaited.not.exact.ofAs<$Type>()
type noExcess_ = never
const noExcess_ = builder.awaited.not.exact.noExcess

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
