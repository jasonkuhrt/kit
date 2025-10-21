import type * as Kind from '../../../../kind.js'
import { runtime } from '../../../builder/runtime.js'
import type { Awaited$ } from '../../../../path.js'
import type { EquivKind } from '../../../kinds/relators.js'

/**
 * awaited + equiv relation matchers.
 *
 * Extraction: extracts the resolved type from a Promise
 * Relation: mutual assignability (equivalent types)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: Promise<T> → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `equiv<E, A>` instead of `equiv.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.of<string, Promise<string>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.of<string, Promise<number>>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Awaited$, [$Actual]>, true]>
const of_ = runtime.awaited.not.equiv.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.string<Promise<string>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.string<Promise<number>>
 * ```
 */
type string_<$Actual> = Kind.Apply<EquivKind, [string, Kind.Apply<Awaited$, [$Actual]>, true]>
const string_ = runtime.awaited.not.equiv.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.number<Promise<number>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.number<Promise<string>>
 * ```
 */
type number_<$Actual> = Kind.Apply<EquivKind, [number, Kind.Apply<Awaited$, [$Actual]>, true]>
const number_ = runtime.awaited.not.equiv.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.bigint<Promise<bigint>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.bigint<Promise<string>>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, Kind.Apply<Awaited$, [$Actual]>, true]>
const bigint_ = runtime.awaited.not.equiv.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.boolean<Promise<boolean>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.boolean<Promise<string>>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, Kind.Apply<Awaited$, [$Actual]>, true]>
const boolean_ = runtime.awaited.not.equiv.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.undefined<Promise<undefined>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.undefined<Promise<string>>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, Kind.Apply<Awaited$, [$Actual]>, true]>
const undefined_ = runtime.awaited.not.equiv.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.null<Promise<null>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.null<Promise<string>>
 * ```
 */
type null_<$Actual> = Kind.Apply<EquivKind, [null, Kind.Apply<Awaited$, [$Actual]>, true]>
const null_ = runtime.awaited.not.equiv.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.symbol<Promise<symbol>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.symbol<Promise<string>>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, Kind.Apply<Awaited$, [$Actual]>, true]>
const symbol_ = runtime.awaited.not.equiv.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.Date<Promise<Date>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.Date<Promise<string>>
 * ```
 */
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, Kind.Apply<Awaited$, [$Actual]>, true]>
const Date_ = runtime.awaited.not.equiv.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.RegExp<Promise<RegExp>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.RegExp<Promise<string>>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, Kind.Apply<Awaited$, [$Actual]>, true]>
const RegExp_ = runtime.awaited.not.equiv.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.Error<Promise<Error>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.Error<Promise<string>>
 * ```
 */
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, Kind.Apply<Awaited$, [$Actual]>, true]>
const Error_ = runtime.awaited.not.equiv.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.Promise<Promise<Promise<any>>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.Promise<Promise<string>>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<EquivKind, [Promise<any>, Kind.Apply<Awaited$, [$Actual]>, true]>
const Promise_ = runtime.awaited.not.equiv.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.Array<Promise<any[]>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.Array<Promise<string>>
 * ```
 */
type Array_<$Actual> = Kind.Apply<EquivKind, [any[], Kind.Apply<Awaited$, [$Actual]>, true]>
const Array_ = runtime.awaited.not.equiv.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.unknown<Promise<unknown>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.unknown<Promise<string>>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<EquivKind, [unknown, Kind.Apply<Awaited$, [$Actual]>, true]>
const unknown_ = runtime.awaited.not.equiv.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.any<Promise<any>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.any<Promise<string>>
 * ```
 */
type any_<$Actual> = Kind.Apply<EquivKind, [any, Kind.Apply<Awaited$, [$Actual]>, true]>
const any_ = runtime.awaited.not.equiv.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: Promise<T> → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.awaited.equiv.never<Promise<never>>
 *
 * // ✗ Fail
 * type _ = Assert.awaited.equiv.never<Promise<string>>
 * ```
 */
type never_<$Actual> = Kind.Apply<EquivKind, [never, Kind.Apply<Awaited$, [$Actual]>, true]>
const never_ = runtime.awaited.not.equiv.never

const ofAs_ = runtime.awaited.not.equiv.ofAs

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
