import type * as Kind from '../../../kind.js'
import type { Parameter4 } from '../../kinds/extractors.js'
import type { SubKind } from '../../kinds/relators.js'
import { runtime } from '../../builder/runtime.js'

/**
 * parameter4 + sub relation matchers.
 *
 * Extraction: extracts the fourth parameter type from a function
 * Relation: subtype relation (extends)
 */


/**
 * Base matcher accepting any expected type.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `sub<E, A>` instead of `sub.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.of<string, (arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.of<string, (arg: number) => any>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Parameter4, [$Actual]>]>
const of_ = runtime.parameter4.sub.of


/**
 * Pre-curried matcher for string.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.string<(arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.string<(arg: number) => any>
 * ```
 */
type string_<$Actual> = Kind.Apply<SubKind, [string, Kind.Apply<Parameter4, [$Actual]>]>
const string_ = runtime.parameter4.sub.string


/**
 * Pre-curried matcher for number.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.number<(arg: number) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.number<(arg: string) => any>
 * ```
 */
type number_<$Actual> = Kind.Apply<SubKind, [number, Kind.Apply<Parameter4, [$Actual]>]>
const number_ = runtime.parameter4.sub.number


/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.bigint<(arg: bigint) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.bigint<(arg: string) => any>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, Kind.Apply<Parameter4, [$Actual]>]>
const bigint_ = runtime.parameter4.sub.bigint


/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.boolean<(arg: boolean) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.boolean<(arg: string) => any>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, Kind.Apply<Parameter4, [$Actual]>]>
const boolean_ = runtime.parameter4.sub.boolean


/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.undefined<(arg: undefined) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.undefined<(arg: string) => any>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, Kind.Apply<Parameter4, [$Actual]>]>
const undefined_ = runtime.parameter4.sub.undefined


/**
 * Pre-curried matcher for null.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.null<(arg: null) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.null<(arg: string) => any>
 * ```
 */
type null_<$Actual> = Kind.Apply<SubKind, [null, Kind.Apply<Parameter4, [$Actual]>]>
const null_ = runtime.parameter4.sub.null


/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.symbol<(arg: symbol) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.symbol<(arg: string) => any>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, Kind.Apply<Parameter4, [$Actual]>]>
const symbol_ = runtime.parameter4.sub.symbol


/**
 * Pre-curried matcher for Date.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.Date<(arg: Date) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.Date<(arg: string) => any>
 * ```
 */
type Date_<$Actual> = Kind.Apply<SubKind, [Date, Kind.Apply<Parameter4, [$Actual]>]>
const Date_ = runtime.parameter4.sub.Date


/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.RegExp<(arg: RegExp) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.RegExp<(arg: string) => any>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, Kind.Apply<Parameter4, [$Actual]>]>
const RegExp_ = runtime.parameter4.sub.RegExp


/**
 * Pre-curried matcher for Error.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.Error<(arg: Error) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.Error<(arg: string) => any>
 * ```
 */
type Error_<$Actual> = Kind.Apply<SubKind, [Error, Kind.Apply<Parameter4, [$Actual]>]>
const Error_ = runtime.parameter4.sub.Error


/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.Promise<(arg: Promise<any>) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.Promise<(arg: string) => any>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<SubKind, [Promise<any>, Kind.Apply<Parameter4, [$Actual]>]>
const Promise_ = runtime.parameter4.sub.Promise


/**
 * Pre-curried matcher for any[].
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.Array<(arg: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.Array<(arg: string) => any>
 * ```
 */
type Array_<$Actual> = Kind.Apply<SubKind, [any[], Kind.Apply<Parameter4, [$Actual]>]>
const Array_ = runtime.parameter4.sub.Array

export {
  of_ as of,
  string_ as string,
  number_ as number,
  bigint_ as bigint,
  boolean_ as boolean,
  undefined_ as undefined,
  null_ as null,
  symbol_ as symbol,
  Date_ as Date,
  RegExp_ as RegExp,
  Error_ as Error,
  Promise_ as Promise,
  Array_ as Array,
}
