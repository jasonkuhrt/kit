import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { Parameter5 } from '../../kinds/extractors.js'
import type { SubKind, SubNoExcessKind } from '../../kinds/relators.js'

/**
 * parameter5 + sub relation matchers.
 *
 * Extraction: extracts the fifth parameter type from a function
 * Relation: subtype relation (extends)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `sub<E, A>` instead of `sub.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.of<string, (arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.of<string, (arg: number) => any>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Parameter5, [$Actual]>]>
const of_ = runtime.parameter5.sub.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.string<(arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.string<(arg: number) => any>
 * ```
 */
type string_<$Actual> = Kind.Apply<SubKind, [string, Kind.Apply<Parameter5, [$Actual]>]>
const string_ = runtime.parameter5.sub.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.number<(arg: number) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.number<(arg: string) => any>
 * ```
 */
type number_<$Actual> = Kind.Apply<SubKind, [number, Kind.Apply<Parameter5, [$Actual]>]>
const number_ = runtime.parameter5.sub.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.bigint<(arg: bigint) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.bigint<(arg: string) => any>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, Kind.Apply<Parameter5, [$Actual]>]>
const bigint_ = runtime.parameter5.sub.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.boolean<(arg: boolean) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.boolean<(arg: string) => any>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, Kind.Apply<Parameter5, [$Actual]>]>
const boolean_ = runtime.parameter5.sub.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.undefined<(arg: undefined) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.undefined<(arg: string) => any>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, Kind.Apply<Parameter5, [$Actual]>]>
const undefined_ = runtime.parameter5.sub.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.null<(arg: null) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.null<(arg: string) => any>
 * ```
 */
type null_<$Actual> = Kind.Apply<SubKind, [null, Kind.Apply<Parameter5, [$Actual]>]>
const null_ = runtime.parameter5.sub.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.symbol<(arg: symbol) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.symbol<(arg: string) => any>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, Kind.Apply<Parameter5, [$Actual]>]>
const symbol_ = runtime.parameter5.sub.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.Date<(arg: Date) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.Date<(arg: string) => any>
 * ```
 */
type Date_<$Actual> = Kind.Apply<SubKind, [Date, Kind.Apply<Parameter5, [$Actual]>]>
const Date_ = runtime.parameter5.sub.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.RegExp<(arg: RegExp) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.RegExp<(arg: string) => any>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, Kind.Apply<Parameter5, [$Actual]>]>
const RegExp_ = runtime.parameter5.sub.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.Error<(arg: Error) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.Error<(arg: string) => any>
 * ```
 */
type Error_<$Actual> = Kind.Apply<SubKind, [Error, Kind.Apply<Parameter5, [$Actual]>]>
const Error_ = runtime.parameter5.sub.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.Promise<(arg: Promise<any>) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.Promise<(arg: string) => any>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<SubKind, [Promise<any>, Kind.Apply<Parameter5, [$Actual]>]>
const Promise_ = runtime.parameter5.sub.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.Array<(arg: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.Array<(arg: string) => any>
 * ```
 */
type Array_<$Actual> = Kind.Apply<SubKind, [any[], Kind.Apply<Parameter5, [$Actual]>]>
const Array_ = runtime.parameter5.sub.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.unknown<(arg: unknown) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.unknown<(arg: string) => any>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<SubKind, [unknown, Kind.Apply<Parameter5, [$Actual]>]>
const unknown_ = runtime.parameter5.sub.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.any<(arg: any) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.any<(arg: string) => any>
 * ```
 */
type any_<$Actual> = Kind.Apply<SubKind, [any, Kind.Apply<Parameter5, [$Actual]>]>
const any_ = runtime.parameter5.sub.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.sub.never<(arg: never) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.sub.never<(arg: string) => any>
 * ```
 */
type never_<$Actual> = Kind.Apply<SubKind, [never, Kind.Apply<Parameter5, [$Actual]>]>
const never_ = runtime.parameter5.sub.never

const ofAs_ = runtime.parameter5.sub.ofAs
/**
 * No-excess variant of sub relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Kind.Apply<SubNoExcessKind, [$Expected, Kind.Apply<Parameter5, [$Actual]>]>
const noExcess_ = runtime.parameter5.sub.noExcess
const noExcessAs_ = runtime.parameter5.sub.noExcessAs

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
