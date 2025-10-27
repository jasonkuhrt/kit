import type { Fn } from '#fn'
import type * as Path from '../../../../path.js'
import { builder } from '../../../builder-singleton.js'
import type { EquivKind } from '../../../kinds/relators.js'

/**
 * awaited + equiv relation matchers.
 *
 * Extraction: extracts the resolved type from a Promise
 * Relation: mutual assignability (equivalent types)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: Promise<T> → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `equiv<E, A>` instead of `equiv.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.of<string, Promise<string>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.of<string, Promise<number>>
 * ```
 */
type of_<$Expected, $Actual> = Fn.Kind.Apply<EquivKind, [$Expected, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const of_ = builder.awaited.not.equiv.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.string<Promise<string>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.string<Promise<number>>
 * ```
 */
type string_<$Actual> = Fn.Kind.Apply<EquivKind, [string, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const string_ = builder.awaited.not.equiv.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.number<Promise<number>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.number<Promise<string>>
 * ```
 */
type number_<$Actual> = Fn.Kind.Apply<EquivKind, [number, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const number_ = builder.awaited.not.equiv.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.bigint<Promise<bigint>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.bigint<Promise<string>>
 * ```
 */
type bigint_<$Actual> = Fn.Kind.Apply<EquivKind, [bigint, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const bigint_ = builder.awaited.not.equiv.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.boolean<Promise<boolean>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.boolean<Promise<string>>
 * ```
 */
type boolean_<$Actual> = Fn.Kind.Apply<EquivKind, [boolean, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const boolean_ = builder.awaited.not.equiv.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.undefined<Promise<undefined>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.undefined<Promise<string>>
 * ```
 */
type undefined_<$Actual> = Fn.Kind.Apply<EquivKind, [undefined, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const undefined_ = builder.awaited.not.equiv.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.null<Promise<null>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.null<Promise<string>>
 * ```
 */
type null_<$Actual> = Fn.Kind.Apply<EquivKind, [null, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const null_ = builder.awaited.not.equiv.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.symbol<Promise<symbol>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.symbol<Promise<string>>
 * ```
 */
type symbol_<$Actual> = Fn.Kind.Apply<EquivKind, [symbol, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const symbol_ = builder.awaited.not.equiv.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.Date<Promise<Date>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.Date<Promise<string>>
 * ```
 */
type Date_<$Actual> = Fn.Kind.Apply<EquivKind, [Date, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const Date_ = builder.awaited.not.equiv.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.RegExp<Promise<RegExp>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.RegExp<Promise<string>>
 * ```
 */
type RegExp_<$Actual> = Fn.Kind.Apply<EquivKind, [RegExp, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const RegExp_ = builder.awaited.not.equiv.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.Error<Promise<Error>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.Error<Promise<string>>
 * ```
 */
type Error_<$Actual> = Fn.Kind.Apply<EquivKind, [Error, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const Error_ = builder.awaited.not.equiv.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.unknown<Promise<unknown>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.unknown<Promise<string>>
 * ```
 */
type unknown_<$Actual> = Fn.Kind.Apply<EquivKind, [unknown, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const unknown_ = builder.awaited.not.equiv.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.any<Promise<any>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.any<Promise<string>>
 * ```
 */
type any_<$Actual> = Fn.Kind.Apply<EquivKind, [any, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const any_ = builder.awaited.not.equiv.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.never<Promise<never>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.never<Promise<string>>
 * ```
 */
type never_<$Actual> = Fn.Kind.Apply<EquivKind, [never, Fn.Kind.Apply<Path.Awaited$, [$Actual]>, true]>
const never_ = builder.awaited.not.equiv.never

const ofAs_ = <$Type>() => builder.awaited.not.equiv.ofAs<$Type>()

export {
  any_ as any,
  bigint_ as bigint,
  boolean_ as boolean,
  Date_ as Date,
  Error_ as Error,
  never_ as never,
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
