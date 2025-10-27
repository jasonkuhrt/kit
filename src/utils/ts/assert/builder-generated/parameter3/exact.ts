import type { Fn } from '#fn'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { ExactKind } from '../../kinds/relators.js'

/**
 * parameter3 + exact relation matchers.
 *
 * Extraction: extracts the third parameter type from a function
 * Relation: exact structural equality
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `exact<E, A>` instead of `exact.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.of<string, (arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.of<string, (arg: number) => any>
 * ```
 */
type of_<$Expected, $Actual> = Fn.Kind.Apply<ExactKind, [$Expected, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const of_ = builder.parameter3.exact.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.string<(arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.string<(arg: number) => any>
 * ```
 */
type string_<$Actual> = Fn.Kind.Apply<ExactKind, [string, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const string_ = builder.parameter3.exact.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.number<(arg: number) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.number<(arg: string) => any>
 * ```
 */
type number_<$Actual> = Fn.Kind.Apply<ExactKind, [number, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const number_ = builder.parameter3.exact.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.bigint<(arg: bigint) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.bigint<(arg: string) => any>
 * ```
 */
type bigint_<$Actual> = Fn.Kind.Apply<ExactKind, [bigint, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const bigint_ = builder.parameter3.exact.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.boolean<(arg: boolean) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.boolean<(arg: string) => any>
 * ```
 */
type boolean_<$Actual> = Fn.Kind.Apply<ExactKind, [boolean, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const boolean_ = builder.parameter3.exact.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.undefined<(arg: undefined) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.undefined<(arg: string) => any>
 * ```
 */
type undefined_<$Actual> = Fn.Kind.Apply<ExactKind, [undefined, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const undefined_ = builder.parameter3.exact.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.null<(arg: null) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.null<(arg: string) => any>
 * ```
 */
type null_<$Actual> = Fn.Kind.Apply<ExactKind, [null, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const null_ = builder.parameter3.exact.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.symbol<(arg: symbol) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.symbol<(arg: string) => any>
 * ```
 */
type symbol_<$Actual> = Fn.Kind.Apply<ExactKind, [symbol, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const symbol_ = builder.parameter3.exact.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.Date<(arg: Date) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.Date<(arg: string) => any>
 * ```
 */
type Date_<$Actual> = Fn.Kind.Apply<ExactKind, [Date, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const Date_ = builder.parameter3.exact.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.RegExp<(arg: RegExp) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.RegExp<(arg: string) => any>
 * ```
 */
type RegExp_<$Actual> = Fn.Kind.Apply<ExactKind, [RegExp, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const RegExp_ = builder.parameter3.exact.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.Error<(arg: Error) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.Error<(arg: string) => any>
 * ```
 */
type Error_<$Actual> = Fn.Kind.Apply<ExactKind, [Error, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const Error_ = builder.parameter3.exact.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.unknown<(arg: unknown) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.unknown<(arg: string) => any>
 * ```
 */
type unknown_<$Actual> = Fn.Kind.Apply<ExactKind, [unknown, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const unknown_ = builder.parameter3.exact.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.any<(arg: any) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.any<(arg: string) => any>
 * ```
 */
type any_<$Actual> = Fn.Kind.Apply<ExactKind, [any, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const any_ = builder.parameter3.exact.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.exact.never<(arg: never) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.exact.never<(arg: string) => any>
 * ```
 */
type never_<$Actual> = Fn.Kind.Apply<ExactKind, [never, Fn.Kind.Apply<Path.Parameter3, [$Actual]>]>
const never_ = builder.parameter3.exact.never

const ofAs_ = <$Type>() => builder.parameter3.exact.ofAs<$Type>()
type noExcess_ = never
const noExcess_ = builder.parameter3.exact.noExcess

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
