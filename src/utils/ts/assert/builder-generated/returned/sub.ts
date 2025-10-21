import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { Returned } from '../../kinds/extractors.js'
import type { SubKind, SubNoExcessKind } from '../../kinds/relators.js'

/**
 * returned + sub relation matchers.
 *
 * Extraction: extracts the return type from a function
 * Relation: subtype relation (extends)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (...args: any[]) => T → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `sub<E, A>` instead of `sub.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.of<string, () => string>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.of<string, () => number>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, Kind.Apply<Returned, [$Actual]>]>
const of_ = runtime.returned.sub.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.string<() => string>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.string<() => number>
 * ```
 */
type string_<$Actual> = Kind.Apply<SubKind, [string, Kind.Apply<Returned, [$Actual]>]>
const string_ = runtime.returned.sub.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.number<() => number>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.number<() => string>
 * ```
 */
type number_<$Actual> = Kind.Apply<SubKind, [number, Kind.Apply<Returned, [$Actual]>]>
const number_ = runtime.returned.sub.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.bigint<() => bigint>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.bigint<() => string>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, Kind.Apply<Returned, [$Actual]>]>
const bigint_ = runtime.returned.sub.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.boolean<() => boolean>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.boolean<() => string>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, Kind.Apply<Returned, [$Actual]>]>
const boolean_ = runtime.returned.sub.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.undefined<() => undefined>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.undefined<() => string>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, Kind.Apply<Returned, [$Actual]>]>
const undefined_ = runtime.returned.sub.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.null<() => null>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.null<() => string>
 * ```
 */
type null_<$Actual> = Kind.Apply<SubKind, [null, Kind.Apply<Returned, [$Actual]>]>
const null_ = runtime.returned.sub.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.symbol<() => symbol>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.symbol<() => string>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, Kind.Apply<Returned, [$Actual]>]>
const symbol_ = runtime.returned.sub.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.Date<() => Date>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.Date<() => string>
 * ```
 */
type Date_<$Actual> = Kind.Apply<SubKind, [Date, Kind.Apply<Returned, [$Actual]>]>
const Date_ = runtime.returned.sub.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.RegExp<() => RegExp>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.RegExp<() => string>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, Kind.Apply<Returned, [$Actual]>]>
const RegExp_ = runtime.returned.sub.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.Error<() => Error>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.Error<() => string>
 * ```
 */
type Error_<$Actual> = Kind.Apply<SubKind, [Error, Kind.Apply<Returned, [$Actual]>]>
const Error_ = runtime.returned.sub.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.Promise<() => Promise<any>>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.Promise<() => string>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<SubKind, [Promise<any>, Kind.Apply<Returned, [$Actual]>]>
const Promise_ = runtime.returned.sub.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.Array<() => any[]>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.Array<() => string>
 * ```
 */
type Array_<$Actual> = Kind.Apply<SubKind, [any[], Kind.Apply<Returned, [$Actual]>]>
const Array_ = runtime.returned.sub.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.unknown<() => unknown>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.unknown<() => string>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<SubKind, [unknown, Kind.Apply<Returned, [$Actual]>]>
const unknown_ = runtime.returned.sub.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.any<() => any>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.any<() => string>
 * ```
 */
type any_<$Actual> = Kind.Apply<SubKind, [any, Kind.Apply<Returned, [$Actual]>]>
const any_ = runtime.returned.sub.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.sub.never<() => never>
 *
 * // ✗ Fail
 * type _ = Assert.returned.sub.never<() => string>
 * ```
 */
type never_<$Actual> = Kind.Apply<SubKind, [never, Kind.Apply<Returned, [$Actual]>]>
const never_ = runtime.returned.sub.never

const ofAs_ = runtime.returned.sub.ofAs
/**
 * No-excess variant of sub relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Kind.Apply<SubNoExcessKind, [$Expected, Kind.Apply<Returned, [$Actual]>]>
const noExcess_ = runtime.returned.sub.noExcess
const noExcessAs_ = runtime.returned.sub.noExcessAs

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
