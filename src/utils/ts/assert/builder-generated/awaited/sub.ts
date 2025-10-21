import type * as Kind from '../../../kind.js'
import type { Awaited$ } from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { SubKind, SubNoExcessKind } from '../../kinds/relators.js'

/**
 * awaited + sub relation matchers.
 *
 * Extraction: extracts the resolved type from a Promise
 * Relation: subtype relation (extends)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: Promise<T> → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `sub<E, A>` instead of `sub.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.of<string, Promise<string>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.of<string, Promise<number>>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Awaited$, [$Actual]>]>
const of_ = builder.awaited.sub.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.string<Promise<string>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.string<Promise<number>>
 * ```
 */
type string_<$Actual> = Kind.Apply<SubKind, [string, Kind.Apply<Awaited$, [$Actual]>]>
const string_ = builder.awaited.sub.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.number<Promise<number>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.number<Promise<string>>
 * ```
 */
type number_<$Actual> = Kind.Apply<SubKind, [number, Kind.Apply<Awaited$, [$Actual]>]>
const number_ = builder.awaited.sub.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.bigint<Promise<bigint>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.bigint<Promise<string>>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, Kind.Apply<Awaited$, [$Actual]>]>
const bigint_ = builder.awaited.sub.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.boolean<Promise<boolean>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.boolean<Promise<string>>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, Kind.Apply<Awaited$, [$Actual]>]>
const boolean_ = builder.awaited.sub.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.undefined<Promise<undefined>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.undefined<Promise<string>>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, Kind.Apply<Awaited$, [$Actual]>]>
const undefined_ = builder.awaited.sub.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.null<Promise<null>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.null<Promise<string>>
 * ```
 */
type null_<$Actual> = Kind.Apply<SubKind, [null, Kind.Apply<Awaited$, [$Actual]>]>
const null_ = builder.awaited.sub.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.symbol<Promise<symbol>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.symbol<Promise<string>>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, Kind.Apply<Awaited$, [$Actual]>]>
const symbol_ = builder.awaited.sub.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.Date<Promise<Date>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.Date<Promise<string>>
 * ```
 */
type Date_<$Actual> = Kind.Apply<SubKind, [Date, Kind.Apply<Awaited$, [$Actual]>]>
const Date_ = builder.awaited.sub.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.RegExp<Promise<RegExp>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.RegExp<Promise<string>>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, Kind.Apply<Awaited$, [$Actual]>]>
const RegExp_ = builder.awaited.sub.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.Error<Promise<Error>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.Error<Promise<string>>
 * ```
 */
type Error_<$Actual> = Kind.Apply<SubKind, [Error, Kind.Apply<Awaited$, [$Actual]>]>
const Error_ = builder.awaited.sub.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.unknown<Promise<unknown>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.unknown<Promise<string>>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<SubKind, [unknown, Kind.Apply<Awaited$, [$Actual]>]>
const unknown_ = builder.awaited.sub.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.any<Promise<any>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.any<Promise<string>>
 * ```
 */
type any_<$Actual> = Kind.Apply<SubKind, [any, Kind.Apply<Awaited$, [$Actual]>]>
const any_ = builder.awaited.sub.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.sub.never<Promise<never>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.sub.never<Promise<string>>
 * ```
 */
type never_<$Actual> = Kind.Apply<SubKind, [never, Kind.Apply<Awaited$, [$Actual]>]>
const never_ = builder.awaited.sub.never

const ofAs_ = <$Type>() => builder.awaited.sub.ofAs<$Type>()
/**
 * No-excess variant of sub relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Kind.Apply<SubNoExcessKind, [$Expected, Kind.Apply<Awaited$, [$Actual]>]>
const noExcess_ = builder.awaited.sub.noExcess
const noExcessAs_ = <$Type>() => builder.awaited.sub.noExcessAs<$Type>()

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
