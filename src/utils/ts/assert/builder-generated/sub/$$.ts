/**
 * @generated
 * This file contains generated type-level matchers.
 * Manual edits should be made carefully and consistently across all generated files.
 */

import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { SubKind } from '../../kinds/relators.js'


export * as noExcess from './noExcess.js'
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
type of_<$Expected, $Actual> = Kind.Apply<SubKind, [$Expected, $Actual]>
const of_ = runtime.sub.of

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
type string_<$Actual> = Kind.Apply<SubKind, [string, $Actual]>
const string_ = runtime.sub.string

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
type number_<$Actual> = Kind.Apply<SubKind, [number, $Actual]>
const number_ = runtime.sub.number

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
type bigint_<$Actual> = Kind.Apply<SubKind, [bigint, $Actual]>
const bigint_ = runtime.sub.bigint

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
type boolean_<$Actual> = Kind.Apply<SubKind, [boolean, $Actual]>
const boolean_ = runtime.sub.boolean

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
type undefined_<$Actual> = Kind.Apply<SubKind, [undefined, $Actual]>
const undefined_ = runtime.sub.undefined

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
type null_<$Actual> = Kind.Apply<SubKind, [null, $Actual]>
const null_ = runtime.sub.null

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
type symbol_<$Actual> = Kind.Apply<SubKind, [symbol, $Actual]>
const symbol_ = runtime.sub.symbol

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
type Date_<$Actual> = Kind.Apply<SubKind, [Date, $Actual]>
const Date_ = runtime.sub.Date

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
type RegExp_<$Actual> = Kind.Apply<SubKind, [RegExp, $Actual]>
const RegExp_ = runtime.sub.RegExp

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
type Error_<$Actual> = Kind.Apply<SubKind, [Error, $Actual]>
const Error_ = runtime.sub.Error

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
type Promise_<$Actual> = Kind.Apply<SubKind, [Promise<any>, $Actual]>
const Promise_ = runtime.sub.Promise

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
type Array_<$Actual> = Kind.Apply<SubKind, [any[], $Actual]>
const Array_ = runtime.sub.Array

/**
 * Pre-curried matcher for unknown.
 */
type unknown_<$Actual> = Kind.Apply<SubKind, [unknown, $Actual]>
const unknown_ = runtime.sub.unknown

/**
 * Pre-curried matcher for any.
 */
type any_<$Actual> = Kind.Apply<SubKind, [any, $Actual]>
const any_ = runtime.sub.any

/**
 * Pre-curried matcher for never.
 */
type never_<$Actual> = Kind.Apply<SubKind, [never, $Actual]>
const never_ = runtime.sub.never

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
  Promise_ as Promise,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
  unknown_ as unknown,
}
