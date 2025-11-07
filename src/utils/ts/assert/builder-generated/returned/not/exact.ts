import type { Fn } from '#fn'
import type { Either } from 'effect'
import type * as Path from '../../../../path.js'
import { builder } from '../../../builder-singleton.js'
import type { ExactKind } from '../../../kinds/relators.js'

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
// dprint-ignore
type of_<$Expected, $Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [$Expected, __actual__, true]>
                                                                         : never
const of_ = builder.returned.not.exact.of

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
// dprint-ignore
type string_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [string, __actual__, true]>
                                                                         : never
const string_ = builder.returned.not.exact.string

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
// dprint-ignore
type number_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [number, __actual__, true]>
                                                                         : never
const number_ = builder.returned.not.exact.number

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
// dprint-ignore
type bigint_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [bigint, __actual__, true]>
                                                                         : never
const bigint_ = builder.returned.not.exact.bigint

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
// dprint-ignore
type boolean_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [boolean, __actual__, true]>
                                                                         : never
const boolean_ = builder.returned.not.exact.boolean

/**
 * Pre-curried matcher for true.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.true<() => true>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.true<() => string>
 * ```
 */
// dprint-ignore
type true_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [true, __actual__, true]>
                                                                         : never
const true_ = builder.returned.not.exact.true

/**
 * Pre-curried matcher for false.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.exact.false<() => false>
 *
 * // ✗ Fail
 * type _ = Assert.returned.exact.false<() => string>
 * ```
 */
// dprint-ignore
type false_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [false, __actual__, true]>
                                                                         : never
const false_ = builder.returned.not.exact.false

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
// dprint-ignore
type undefined_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [undefined, __actual__, true]>
                                                                         : never
const undefined_ = builder.returned.not.exact.undefined

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
// dprint-ignore
type null_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [null, __actual__, true]>
                                                                         : never
const null_ = builder.returned.not.exact.null

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
// dprint-ignore
type symbol_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [symbol, __actual__, true]>
                                                                         : never
const symbol_ = builder.returned.not.exact.symbol

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
// dprint-ignore
type Date_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [Date, __actual__, true]>
                                                                         : never
const Date_ = builder.returned.not.exact.Date

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
// dprint-ignore
type RegExp_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [RegExp, __actual__, true]>
                                                                         : never
const RegExp_ = builder.returned.not.exact.RegExp

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
// dprint-ignore
type Error_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [Error, __actual__, true]>
                                                                         : never
const Error_ = builder.returned.not.exact.Error

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
// dprint-ignore
type unknown_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [unknown, __actual__, true]>
                                                                         : never
const unknown_ = builder.returned.not.exact.unknown

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
// dprint-ignore
type any_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [any, __actual__, true]>
                                                                         : never
const any_ = builder.returned.not.exact.any

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
// dprint-ignore
type never_<$Actual, __$ActualExtracted = Fn.Kind.Apply<Path.Returned, [$Actual]>> =
  __$ActualExtracted extends Either.Left<infer __error__, infer _>      ? __error__ :
  __$ActualExtracted extends Either.Right<infer _, infer __actual__>    ? Fn.Kind.Apply<ExactKind, [never, __actual__, true]>
                                                                         : never
const never_ = builder.returned.not.exact.never

const ofAs_ = <$Type>() => builder.returned.not.exact.ofAs<$Type>()
type noExcess_ = never
const noExcess_ = builder.returned.not.exact.noExcess

export {
  any_ as any,
  bigint_ as bigint,
  boolean_ as boolean,
  Date_ as Date,
  Error_ as Error,
  false_ as false,
  never_ as never,
  noExcess_ as noExcess,
  null_ as null,
  number_ as number,
  of_ as of,
  ofAs_ as ofAs,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  true_ as true,
  undefined_ as undefined,
  unknown_ as unknown,
}
