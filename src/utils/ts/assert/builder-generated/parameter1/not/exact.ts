import type * as Kind from '../../../../kind.js'
import { runtime } from '../../../builder/runtime.js'
import type { Parameter1 } from '../../../../path.js'
import type { ExactKind } from '../../../kinds/relators.js'

/**
 * parameter1 + exact relation matchers.
 *
 * Extraction: extracts the first parameter type from a function
 * Relation: exact structural equality
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `exact<E, A>` instead of `exact.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.of<string, (arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.of<string, (arg: number) => any>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Parameter1, [$Actual]>, true]>
const of_ = runtime.parameter1.not.exact.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.string<(arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.string<(arg: number) => any>
 * ```
 */
type string_<$Actual> = Kind.Apply<ExactKind, [string, Kind.Apply<Parameter1, [$Actual]>, true]>
const string_ = runtime.parameter1.not.exact.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.number<(arg: number) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.number<(arg: string) => any>
 * ```
 */
type number_<$Actual> = Kind.Apply<ExactKind, [number, Kind.Apply<Parameter1, [$Actual]>, true]>
const number_ = runtime.parameter1.not.exact.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.bigint<(arg: bigint) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.bigint<(arg: string) => any>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, Kind.Apply<Parameter1, [$Actual]>, true]>
const bigint_ = runtime.parameter1.not.exact.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.boolean<(arg: boolean) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.boolean<(arg: string) => any>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, Kind.Apply<Parameter1, [$Actual]>, true]>
const boolean_ = runtime.parameter1.not.exact.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.undefined<(arg: undefined) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.undefined<(arg: string) => any>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, Kind.Apply<Parameter1, [$Actual]>, true]>
const undefined_ = runtime.parameter1.not.exact.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.null<(arg: null) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.null<(arg: string) => any>
 * ```
 */
type null_<$Actual> = Kind.Apply<ExactKind, [null, Kind.Apply<Parameter1, [$Actual]>, true]>
const null_ = runtime.parameter1.not.exact.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.symbol<(arg: symbol) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.symbol<(arg: string) => any>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, Kind.Apply<Parameter1, [$Actual]>, true]>
const symbol_ = runtime.parameter1.not.exact.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.Date<(arg: Date) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.Date<(arg: string) => any>
 * ```
 */
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, Kind.Apply<Parameter1, [$Actual]>, true]>
const Date_ = runtime.parameter1.not.exact.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.RegExp<(arg: RegExp) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.RegExp<(arg: string) => any>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, Kind.Apply<Parameter1, [$Actual]>, true]>
const RegExp_ = runtime.parameter1.not.exact.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.Error<(arg: Error) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.Error<(arg: string) => any>
 * ```
 */
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, Kind.Apply<Parameter1, [$Actual]>, true]>
const Error_ = runtime.parameter1.not.exact.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.Promise<(arg: Promise<any>) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.Promise<(arg: string) => any>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<ExactKind, [Promise<any>, Kind.Apply<Parameter1, [$Actual]>, true]>
const Promise_ = runtime.parameter1.not.exact.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.Array<(arg: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.Array<(arg: string) => any>
 * ```
 */
type Array_<$Actual> = Kind.Apply<ExactKind, [any[], Kind.Apply<Parameter1, [$Actual]>, true]>
const Array_ = runtime.parameter1.not.exact.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.unknown<(arg: unknown) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.unknown<(arg: string) => any>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<ExactKind, [unknown, Kind.Apply<Parameter1, [$Actual]>, true]>
const unknown_ = runtime.parameter1.not.exact.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.any<(arg: any) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.any<(arg: string) => any>
 * ```
 */
type any_<$Actual> = Kind.Apply<ExactKind, [any, Kind.Apply<Parameter1, [$Actual]>, true]>
const any_ = runtime.parameter1.not.exact.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (p1: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter1.exact.never<(arg: never) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter1.exact.never<(arg: string) => any>
 * ```
 */
type never_<$Actual> = Kind.Apply<ExactKind, [never, Kind.Apply<Parameter1, [$Actual]>, true]>
const never_ = runtime.parameter1.not.exact.never

const ofAs_ = runtime.parameter1.not.exact.ofAs
type noExcess_ = never
const noExcess_ = runtime.parameter1.not.exact.noExcess

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
