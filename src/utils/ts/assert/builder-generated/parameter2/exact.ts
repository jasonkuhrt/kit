import type * as Kind from '../../../kind.js'
import type { Parameter2 } from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { ExactKind } from '../../kinds/relators.js'

/**
 * parameter2 + exact relation matchers.
 *
 * Extraction: extracts the second parameter type from a function
 * Relation: exact structural equality
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `exact<E, A>` instead of `exact.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.of<string, (arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.of<string, (arg: number) => any>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>]>
const of_ = builder.parameter2.exact.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.string<(arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.string<(arg: number) => any>
 * ```
 */
type string_<$Actual> = Kind.Apply<ExactKind, [string, Kind.Apply<Parameter2, [$Actual]>]>
const string_ = builder.parameter2.exact.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.number<(arg: number) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.number<(arg: string) => any>
 * ```
 */
type number_<$Actual> = Kind.Apply<ExactKind, [number, Kind.Apply<Parameter2, [$Actual]>]>
const number_ = builder.parameter2.exact.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.bigint<(arg: bigint) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.bigint<(arg: string) => any>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, Kind.Apply<Parameter2, [$Actual]>]>
const bigint_ = builder.parameter2.exact.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.boolean<(arg: boolean) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.boolean<(arg: string) => any>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, Kind.Apply<Parameter2, [$Actual]>]>
const boolean_ = builder.parameter2.exact.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.undefined<(arg: undefined) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.undefined<(arg: string) => any>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, Kind.Apply<Parameter2, [$Actual]>]>
const undefined_ = builder.parameter2.exact.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.null<(arg: null) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.null<(arg: string) => any>
 * ```
 */
type null_<$Actual> = Kind.Apply<ExactKind, [null, Kind.Apply<Parameter2, [$Actual]>]>
const null_ = builder.parameter2.exact.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.symbol<(arg: symbol) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.symbol<(arg: string) => any>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, Kind.Apply<Parameter2, [$Actual]>]>
const symbol_ = builder.parameter2.exact.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.Date<(arg: Date) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.Date<(arg: string) => any>
 * ```
 */
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, Kind.Apply<Parameter2, [$Actual]>]>
const Date_ = builder.parameter2.exact.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.RegExp<(arg: RegExp) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.RegExp<(arg: string) => any>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, Kind.Apply<Parameter2, [$Actual]>]>
const RegExp_ = builder.parameter2.exact.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.Error<(arg: Error) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.Error<(arg: string) => any>
 * ```
 */
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, Kind.Apply<Parameter2, [$Actual]>]>
const Error_ = builder.parameter2.exact.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.unknown<(arg: unknown) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.unknown<(arg: string) => any>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<ExactKind, [unknown, Kind.Apply<Parameter2, [$Actual]>]>
const unknown_ = builder.parameter2.exact.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.any<(arg: any) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.any<(arg: string) => any>
 * ```
 */
type any_<$Actual> = Kind.Apply<ExactKind, [any, Kind.Apply<Parameter2, [$Actual]>]>
const any_ = builder.parameter2.exact.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.never<(arg: never) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.never<(arg: string) => any>
 * ```
 */
type never_<$Actual> = Kind.Apply<ExactKind, [never, Kind.Apply<Parameter2, [$Actual]>]>
const never_ = builder.parameter2.exact.never

const ofAs_ = <$Type>() => builder.parameter2.exact.ofAs<$Type>()
type noExcess_ = never
const noExcess_ = builder.parameter2.exact.noExcess

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
