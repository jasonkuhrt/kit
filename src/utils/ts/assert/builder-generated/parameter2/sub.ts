import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { Parameter2 } from '../../../path.js'
import type { SubKind, SubNoExcessKind } from '../../kinds/relators.js'

/**
 * parameter2 + sub relation matchers.
 *
 * Extraction: extracts the second parameter type from a function
 * Relation: subtype relation (extends)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `sub<E, A>` instead of `sub.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.of<string, (arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.of<string, (arg: number) => any>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>]>
const of_ = runtime.parameter2.sub.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.string<(arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.string<(arg: number) => any>
 * ```
 */
type string_<$Actual> = Kind.Apply<SubKind, [string, Kind.Apply<Parameter2, [$Actual]>]>
const string_ = runtime.parameter2.sub.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.number<(arg: number) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.number<(arg: string) => any>
 * ```
 */
type number_<$Actual> = Kind.Apply<SubKind, [number, Kind.Apply<Parameter2, [$Actual]>]>
const number_ = runtime.parameter2.sub.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.bigint<(arg: bigint) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.bigint<(arg: string) => any>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, Kind.Apply<Parameter2, [$Actual]>]>
const bigint_ = runtime.parameter2.sub.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.boolean<(arg: boolean) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.boolean<(arg: string) => any>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, Kind.Apply<Parameter2, [$Actual]>]>
const boolean_ = runtime.parameter2.sub.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.undefined<(arg: undefined) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.undefined<(arg: string) => any>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, Kind.Apply<Parameter2, [$Actual]>]>
const undefined_ = runtime.parameter2.sub.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.null<(arg: null) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.null<(arg: string) => any>
 * ```
 */
type null_<$Actual> = Kind.Apply<SubKind, [null, Kind.Apply<Parameter2, [$Actual]>]>
const null_ = runtime.parameter2.sub.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.symbol<(arg: symbol) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.symbol<(arg: string) => any>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, Kind.Apply<Parameter2, [$Actual]>]>
const symbol_ = runtime.parameter2.sub.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.Date<(arg: Date) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.Date<(arg: string) => any>
 * ```
 */
type Date_<$Actual> = Kind.Apply<SubKind, [Date, Kind.Apply<Parameter2, [$Actual]>]>
const Date_ = runtime.parameter2.sub.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.RegExp<(arg: RegExp) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.RegExp<(arg: string) => any>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, Kind.Apply<Parameter2, [$Actual]>]>
const RegExp_ = runtime.parameter2.sub.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.Error<(arg: Error) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.Error<(arg: string) => any>
 * ```
 */
type Error_<$Actual> = Kind.Apply<SubKind, [Error, Kind.Apply<Parameter2, [$Actual]>]>
const Error_ = runtime.parameter2.sub.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.Promise<(arg: Promise<any>) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.Promise<(arg: string) => any>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<SubKind, [Promise<any>, Kind.Apply<Parameter2, [$Actual]>]>
const Promise_ = runtime.parameter2.sub.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.Array<(arg: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.Array<(arg: string) => any>
 * ```
 */
type Array_<$Actual> = Kind.Apply<SubKind, [any[], Kind.Apply<Parameter2, [$Actual]>]>
const Array_ = runtime.parameter2.sub.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.unknown<(arg: unknown) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.unknown<(arg: string) => any>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<SubKind, [unknown, Kind.Apply<Parameter2, [$Actual]>]>
const unknown_ = runtime.parameter2.sub.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.any<(arg: any) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.any<(arg: string) => any>
 * ```
 */
type any_<$Actual> = Kind.Apply<SubKind, [any, Kind.Apply<Parameter2, [$Actual]>]>
const any_ = runtime.parameter2.sub.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.sub.never<(arg: never) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.sub.never<(arg: string) => any>
 * ```
 */
type never_<$Actual> = Kind.Apply<SubKind, [never, Kind.Apply<Parameter2, [$Actual]>]>
const never_ = runtime.parameter2.sub.never

const ofAs_ = runtime.parameter2.sub.ofAs
/**
 * No-excess variant of sub relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Kind.Apply<SubNoExcessKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>]>
const noExcess_ = runtime.parameter2.sub.noExcess
const noExcessAs_ = runtime.parameter2.sub.noExcessAs

export {
  any_ as any,
  Array_ as Array,
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
  Promise_ as Promise,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
  unknown_ as unknown,
}
