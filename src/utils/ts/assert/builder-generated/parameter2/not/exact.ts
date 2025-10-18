import type * as Kind from '../../../../kind.js'
import type { Parameter2 } from '../../../kinds/extractors.js'
import type { ExactKind } from '../../../kinds/relators.js'
import { runtime } from '../../../builder/runtime.js'

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
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>, true]>
const of_ = runtime.parameter2.not.exact.of


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
type string_<$Actual> = Kind.Apply<ExactKind, [string, Kind.Apply<Parameter2, [$Actual]>, true]>
const string_ = runtime.parameter2.not.exact.string


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
type number_<$Actual> = Kind.Apply<ExactKind, [number, Kind.Apply<Parameter2, [$Actual]>, true]>
const number_ = runtime.parameter2.not.exact.number


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
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, Kind.Apply<Parameter2, [$Actual]>, true]>
const bigint_ = runtime.parameter2.not.exact.bigint


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
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, Kind.Apply<Parameter2, [$Actual]>, true]>
const boolean_ = runtime.parameter2.not.exact.boolean


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
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, Kind.Apply<Parameter2, [$Actual]>, true]>
const undefined_ = runtime.parameter2.not.exact.undefined


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
type null_<$Actual> = Kind.Apply<ExactKind, [null, Kind.Apply<Parameter2, [$Actual]>, true]>
const null_ = runtime.parameter2.not.exact.null


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
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, Kind.Apply<Parameter2, [$Actual]>, true]>
const symbol_ = runtime.parameter2.not.exact.symbol


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
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, Kind.Apply<Parameter2, [$Actual]>, true]>
const Date_ = runtime.parameter2.not.exact.Date


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
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, Kind.Apply<Parameter2, [$Actual]>, true]>
const RegExp_ = runtime.parameter2.not.exact.RegExp


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
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, Kind.Apply<Parameter2, [$Actual]>, true]>
const Error_ = runtime.parameter2.not.exact.Error


/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.Promise<(arg: Promise<any>) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.Promise<(arg: string) => any>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<ExactKind, [Promise<any>, Kind.Apply<Parameter2, [$Actual]>, true]>
const Promise_ = runtime.parameter2.not.exact.Promise


/**
 * Pre-curried matcher for any[].
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.exact.Array<(arg: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.exact.Array<(arg: string) => any>
 * ```
 */
type Array_<$Actual> = Kind.Apply<ExactKind, [any[], Kind.Apply<Parameter2, [$Actual]>, true]>
const Array_ = runtime.parameter2.not.exact.Array

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
