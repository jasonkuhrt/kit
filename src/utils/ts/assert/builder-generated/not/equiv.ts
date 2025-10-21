import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { EquivKind } from '../../kinds/relators.js'

/**
 * base + equiv relation matchers.
 *
 * Direct type assertion
 * Relation: mutual assignability (equivalent types)
 */

/**
 * Base matcher accepting any expected type.
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `equiv<E, A>` instead of `equiv.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.of<string, string>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.of<string, number>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, $Actual, true]>
const of_ = runtime.not.equiv.of

/**
 * Pre-curried matcher for string.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.string<string>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.string<number>
 * ```
 */
type string_<$Actual> = Kind.Apply<EquivKind, [string, $Actual, true]>
const string_ = runtime.not.equiv.string

/**
 * Pre-curried matcher for number.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.number<number>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.number<string>
 * ```
 */
type number_<$Actual> = Kind.Apply<EquivKind, [number, $Actual, true]>
const number_ = runtime.not.equiv.number

/**
 * Pre-curried matcher for bigint.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.bigint<bigint>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.bigint<string>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, $Actual, true]>
const bigint_ = runtime.not.equiv.bigint

/**
 * Pre-curried matcher for boolean.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.boolean<boolean>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.boolean<string>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, $Actual, true]>
const boolean_ = runtime.not.equiv.boolean

/**
 * Pre-curried matcher for undefined.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.undefined<undefined>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.undefined<string>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, $Actual, true]>
const undefined_ = runtime.not.equiv.undefined

/**
 * Pre-curried matcher for null.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.null<null>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.null<string>
 * ```
 */
type null_<$Actual> = Kind.Apply<EquivKind, [null, $Actual, true]>
const null_ = runtime.not.equiv.null

/**
 * Pre-curried matcher for symbol.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.symbol<symbol>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.symbol<string>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, $Actual, true]>
const symbol_ = runtime.not.equiv.symbol

/**
 * Pre-curried matcher for Date.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.Date<Date>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.Date<string>
 * ```
 */
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, $Actual, true]>
const Date_ = runtime.not.equiv.Date

/**
 * Pre-curried matcher for RegExp.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.RegExp<RegExp>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.RegExp<string>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, $Actual, true]>
const RegExp_ = runtime.not.equiv.RegExp

/**
 * Pre-curried matcher for Error.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.Error<Error>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.Error<string>
 * ```
 */
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, $Actual, true]>
const Error_ = runtime.not.equiv.Error

/**
 * Pre-curried matcher for Promise<any>.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.Promise<Promise<any>>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.Promise<string>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<EquivKind, [Promise<any>, $Actual, true]>
const Promise_ = runtime.not.equiv.Promise

/**
 * Pre-curried matcher for any[].
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.Array<any[]>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.Array<string>
 * ```
 */
type Array_<$Actual> = Kind.Apply<EquivKind, [any[], $Actual, true]>
const Array_ = runtime.not.equiv.Array

/**
 * Pre-curried matcher for unknown.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.unknown<unknown>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.unknown<string>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<EquivKind, [unknown, $Actual, true]>
const unknown_ = runtime.not.equiv.unknown

/**
 * Pre-curried matcher for any.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.any<any>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.any<string>
 * ```
 */
type any_<$Actual> = Kind.Apply<EquivKind, [any, $Actual, true]>
const any_ = runtime.not.equiv.any

/**
 * Pre-curried matcher for never.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.never<never>
 *
 * // ✗ Fail
 * type _ = Assert.equiv.never<string>
 * ```
 */
type never_<$Actual> = Kind.Apply<EquivKind, [never, $Actual, true]>
const never_ = runtime.not.equiv.never

const ofAs_ = runtime.not.equiv.ofAs

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
