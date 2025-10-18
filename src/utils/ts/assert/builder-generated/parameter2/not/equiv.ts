import type * as Kind from '../../../../kind.js'
import type { Parameter2 } from '../../../kinds/extractors.js'
import type { EquivKind } from '../../../kinds/relators.js'
import { runtime } from '../../../builder/runtime.js'

/**
 * parameter2 + equiv relation matchers.
 *
 * Extraction: extracts the second parameter type from a function
 * Relation: mutual assignability (equivalent types)
 */


/**
 * Base matcher accepting any expected type.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `equiv<E, A>` instead of `equiv.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.of<string, (arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.of<string, (arg: number) => any>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Parameter2, [$Actual]>, true]>
const of_ = runtime.parameter2.not.equiv.of


/**
 * Pre-curried matcher for string.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.string<(arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.string<(arg: number) => any>
 * ```
 */
type string_<$Actual> = Kind.Apply<EquivKind, [string, Kind.Apply<Parameter2, [$Actual]>, true]>
const string_ = runtime.parameter2.not.equiv.string


/**
 * Pre-curried matcher for number.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.number<(arg: number) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.number<(arg: string) => any>
 * ```
 */
type number_<$Actual> = Kind.Apply<EquivKind, [number, Kind.Apply<Parameter2, [$Actual]>, true]>
const number_ = runtime.parameter2.not.equiv.number


/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.bigint<(arg: bigint) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.bigint<(arg: string) => any>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, Kind.Apply<Parameter2, [$Actual]>, true]>
const bigint_ = runtime.parameter2.not.equiv.bigint


/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.boolean<(arg: boolean) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.boolean<(arg: string) => any>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, Kind.Apply<Parameter2, [$Actual]>, true]>
const boolean_ = runtime.parameter2.not.equiv.boolean


/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.undefined<(arg: undefined) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.undefined<(arg: string) => any>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, Kind.Apply<Parameter2, [$Actual]>, true]>
const undefined_ = runtime.parameter2.not.equiv.undefined


/**
 * Pre-curried matcher for null.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.null<(arg: null) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.null<(arg: string) => any>
 * ```
 */
type null_<$Actual> = Kind.Apply<EquivKind, [null, Kind.Apply<Parameter2, [$Actual]>, true]>
const null_ = runtime.parameter2.not.equiv.null


/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.symbol<(arg: symbol) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.symbol<(arg: string) => any>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, Kind.Apply<Parameter2, [$Actual]>, true]>
const symbol_ = runtime.parameter2.not.equiv.symbol


/**
 * Pre-curried matcher for Date.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.Date<(arg: Date) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.Date<(arg: string) => any>
 * ```
 */
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, Kind.Apply<Parameter2, [$Actual]>, true]>
const Date_ = runtime.parameter2.not.equiv.Date


/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.RegExp<(arg: RegExp) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.RegExp<(arg: string) => any>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, Kind.Apply<Parameter2, [$Actual]>, true]>
const RegExp_ = runtime.parameter2.not.equiv.RegExp


/**
 * Pre-curried matcher for Error.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.Error<(arg: Error) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.Error<(arg: string) => any>
 * ```
 */
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, Kind.Apply<Parameter2, [$Actual]>, true]>
const Error_ = runtime.parameter2.not.equiv.Error


/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.Promise<(arg: Promise<any>) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.Promise<(arg: string) => any>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<EquivKind, [Promise<any>, Kind.Apply<Parameter2, [$Actual]>, true]>
const Promise_ = runtime.parameter2.not.equiv.Promise


/**
 * Pre-curried matcher for any[].
 * Extraction chain: (p1: any, p2: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter2.equiv.Array<(arg: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter2.equiv.Array<(arg: string) => any>
 * ```
 */
type Array_<$Actual> = Kind.Apply<EquivKind, [any[], Kind.Apply<Parameter2, [$Actual]>, true]>
const Array_ = runtime.parameter2.not.equiv.Array

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
