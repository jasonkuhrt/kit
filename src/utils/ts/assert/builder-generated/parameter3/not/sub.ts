import type * as Kind from '../../../../kind.js'
import { runtime } from '../../../builder/runtime.js'
import type { Parameter3 } from '../../../../path.js'
import type { SubKind } from '../../../kinds/relators.js'

/**
 * parameter3 + sub relation matchers.
 *
 * Extraction: extracts the third parameter type from a function
 * Relation: subtype relation (extends)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `sub<E, A>` instead of `sub.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.of<string, (arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.of<string, (arg: number) => any>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Parameter3, [$Actual]>, true]>
const of_ = runtime.parameter3.not.sub.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.string<(arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.string<(arg: number) => any>
 * ```
 */
type string_<$Actual> = Kind.Apply<SubKind, [string, Kind.Apply<Parameter3, [$Actual]>, true]>
const string_ = runtime.parameter3.not.sub.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.number<(arg: number) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.number<(arg: string) => any>
 * ```
 */
type number_<$Actual> = Kind.Apply<SubKind, [number, Kind.Apply<Parameter3, [$Actual]>, true]>
const number_ = runtime.parameter3.not.sub.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.bigint<(arg: bigint) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.bigint<(arg: string) => any>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, Kind.Apply<Parameter3, [$Actual]>, true]>
const bigint_ = runtime.parameter3.not.sub.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.boolean<(arg: boolean) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.boolean<(arg: string) => any>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, Kind.Apply<Parameter3, [$Actual]>, true]>
const boolean_ = runtime.parameter3.not.sub.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.undefined<(arg: undefined) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.undefined<(arg: string) => any>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, Kind.Apply<Parameter3, [$Actual]>, true]>
const undefined_ = runtime.parameter3.not.sub.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.null<(arg: null) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.null<(arg: string) => any>
 * ```
 */
type null_<$Actual> = Kind.Apply<SubKind, [null, Kind.Apply<Parameter3, [$Actual]>, true]>
const null_ = runtime.parameter3.not.sub.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.symbol<(arg: symbol) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.symbol<(arg: string) => any>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, Kind.Apply<Parameter3, [$Actual]>, true]>
const symbol_ = runtime.parameter3.not.sub.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.Date<(arg: Date) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.Date<(arg: string) => any>
 * ```
 */
type Date_<$Actual> = Kind.Apply<SubKind, [Date, Kind.Apply<Parameter3, [$Actual]>, true]>
const Date_ = runtime.parameter3.not.sub.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.RegExp<(arg: RegExp) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.RegExp<(arg: string) => any>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, Kind.Apply<Parameter3, [$Actual]>, true]>
const RegExp_ = runtime.parameter3.not.sub.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.Error<(arg: Error) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.Error<(arg: string) => any>
 * ```
 */
type Error_<$Actual> = Kind.Apply<SubKind, [Error, Kind.Apply<Parameter3, [$Actual]>, true]>
const Error_ = runtime.parameter3.not.sub.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.Promise<(arg: Promise<any>) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.Promise<(arg: string) => any>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<SubKind, [Promise<any>, Kind.Apply<Parameter3, [$Actual]>, true]>
const Promise_ = runtime.parameter3.not.sub.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.Array<(arg: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.Array<(arg: string) => any>
 * ```
 */
type Array_<$Actual> = Kind.Apply<SubKind, [any[], Kind.Apply<Parameter3, [$Actual]>, true]>
const Array_ = runtime.parameter3.not.sub.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.unknown<(arg: unknown) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.unknown<(arg: string) => any>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<SubKind, [unknown, Kind.Apply<Parameter3, [$Actual]>, true]>
const unknown_ = runtime.parameter3.not.sub.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.any<(arg: any) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.any<(arg: string) => any>
 * ```
 */
type any_<$Actual> = Kind.Apply<SubKind, [any, Kind.Apply<Parameter3, [$Actual]>, true]>
const any_ = runtime.parameter3.not.sub.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (p1: any, p2: any, p3: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter3.sub.never<(arg: never) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter3.sub.never<(arg: string) => any>
 * ```
 */
type never_<$Actual> = Kind.Apply<SubKind, [never, Kind.Apply<Parameter3, [$Actual]>, true]>
const never_ = runtime.parameter3.not.sub.never

const ofAs_ = runtime.parameter3.not.sub.ofAs

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
