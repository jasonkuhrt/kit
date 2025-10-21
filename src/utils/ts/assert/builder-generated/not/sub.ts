import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { SubKind } from '../../kinds/relators.js'

/**
 * base + sub relation matchers.
 *
 * Direct type assertion
 * Relation: subtype relation (extends)
 */

/**
 * Base matcher accepting any expected type.
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `sub<E, A>` instead of `sub.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.of<string, string>
 *
 * // ✗ Fail
 * type _ = Assert.sub.of<string, number>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, $Actual, true]>
const of_ = runtime.not.sub.of

/**
 * Pre-curried matcher for string.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.string<string>
 *
 * // ✗ Fail
 * type _ = Assert.sub.string<number>
 * ```
 */
type string_<$Actual> = Kind.Apply<SubKind, [string, $Actual, true]>
const string_ = runtime.not.sub.string

/**
 * Pre-curried matcher for number.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.number<number>
 *
 * // ✗ Fail
 * type _ = Assert.sub.number<string>
 * ```
 */
type number_<$Actual> = Kind.Apply<SubKind, [number, $Actual, true]>
const number_ = runtime.not.sub.number

/**
 * Pre-curried matcher for bigint.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.bigint<bigint>
 *
 * // ✗ Fail
 * type _ = Assert.sub.bigint<string>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, $Actual, true]>
const bigint_ = runtime.not.sub.bigint

/**
 * Pre-curried matcher for boolean.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.boolean<boolean>
 *
 * // ✗ Fail
 * type _ = Assert.sub.boolean<string>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, $Actual, true]>
const boolean_ = runtime.not.sub.boolean

/**
 * Pre-curried matcher for undefined.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.undefined<undefined>
 *
 * // ✗ Fail
 * type _ = Assert.sub.undefined<string>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, $Actual, true]>
const undefined_ = runtime.not.sub.undefined

/**
 * Pre-curried matcher for null.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.null<null>
 *
 * // ✗ Fail
 * type _ = Assert.sub.null<string>
 * ```
 */
type null_<$Actual> = Kind.Apply<SubKind, [null, $Actual, true]>
const null_ = runtime.not.sub.null

/**
 * Pre-curried matcher for symbol.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.symbol<symbol>
 *
 * // ✗ Fail
 * type _ = Assert.sub.symbol<string>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, $Actual, true]>
const symbol_ = runtime.not.sub.symbol

/**
 * Pre-curried matcher for Date.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.Date<Date>
 *
 * // ✗ Fail
 * type _ = Assert.sub.Date<string>
 * ```
 */
type Date_<$Actual> = Kind.Apply<SubKind, [Date, $Actual, true]>
const Date_ = runtime.not.sub.Date

/**
 * Pre-curried matcher for RegExp.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.RegExp<RegExp>
 *
 * // ✗ Fail
 * type _ = Assert.sub.RegExp<string>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, $Actual, true]>
const RegExp_ = runtime.not.sub.RegExp

/**
 * Pre-curried matcher for Error.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.Error<Error>
 *
 * // ✗ Fail
 * type _ = Assert.sub.Error<string>
 * ```
 */
type Error_<$Actual> = Kind.Apply<SubKind, [Error, $Actual, true]>
const Error_ = runtime.not.sub.Error

/**
 * Pre-curried matcher for Promise<any>.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.Promise<Promise<any>>
 *
 * // ✗ Fail
 * type _ = Assert.sub.Promise<string>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<SubKind, [Promise<any>, $Actual, true]>
const Promise_ = runtime.not.sub.Promise

/**
 * Pre-curried matcher for any[].
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.Array<any[]>
 *
 * // ✗ Fail
 * type _ = Assert.sub.Array<string>
 * ```
 */
type Array_<$Actual> = Kind.Apply<SubKind, [any[], $Actual, true]>
const Array_ = runtime.not.sub.Array

/**
 * Pre-curried matcher for unknown.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.unknown<unknown>
 *
 * // ✗ Fail
 * type _ = Assert.sub.unknown<string>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<SubKind, [unknown, $Actual, true]>
const unknown_ = runtime.not.sub.unknown

/**
 * Pre-curried matcher for any.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.any<any>
 *
 * // ✗ Fail
 * type _ = Assert.sub.any<string>
 * ```
 */
type any_<$Actual> = Kind.Apply<SubKind, [any, $Actual, true]>
const any_ = runtime.not.sub.any

/**
 * Pre-curried matcher for never.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.never<never>
 *
 * // ✗ Fail
 * type _ = Assert.sub.never<string>
 * ```
 */
type never_<$Actual> = Kind.Apply<SubKind, [never, $Actual, true]>
const never_ = runtime.not.sub.never

const ofAs_ = runtime.not.sub.ofAs

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
