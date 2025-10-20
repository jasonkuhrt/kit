import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { SubNoExcessKind } from '../../kinds/relators.js'

/**
 * sub + noExcess relation matchers.
 *
 * Direct type assertion
 * Relation: subtype relation (extends) with no excess properties
 */

/**
 * Base matcher accepting any expected type.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.sub.noExcess.of<{ id: string }, { id: string }>
 *
 * // ✗ Fail - excess property
 * type _ = Assert.sub.noExcess.of<{ id: string }, { id: string; name: string }>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<SubNoExcessKind, [$Expected, $Actual]>
const of_ = runtime.sub.noExcess.of

/**
 * Pre-curried matcher for string.
 */
type string_<$Actual> = Kind.Apply<SubNoExcessKind, [string, $Actual]>
const string_ = runtime.sub.noExcess.string

/**
 * Pre-curried matcher for number.
 */
type number_<$Actual> = Kind.Apply<SubNoExcessKind, [number, $Actual]>
const number_ = runtime.sub.noExcess.number

/**
 * Pre-curried matcher for bigint.
 */
type bigint_<$Actual> = Kind.Apply<SubNoExcessKind, [bigint, $Actual]>
const bigint_ = runtime.sub.noExcess.bigint

/**
 * Pre-curried matcher for boolean.
 */
type boolean_<$Actual> = Kind.Apply<SubNoExcessKind, [boolean, $Actual]>
const boolean_ = runtime.sub.noExcess.boolean

/**
 * Pre-curried matcher for undefined.
 */
type undefined_<$Actual> = Kind.Apply<SubNoExcessKind, [undefined, $Actual]>
const undefined_ = runtime.sub.noExcess.undefined

/**
 * Pre-curried matcher for null.
 */
type null_<$Actual> = Kind.Apply<SubNoExcessKind, [null, $Actual]>
const null_ = runtime.sub.noExcess.null

/**
 * Pre-curried matcher for symbol.
 */
type symbol_<$Actual> = Kind.Apply<SubNoExcessKind, [symbol, $Actual]>
const symbol_ = runtime.sub.noExcess.symbol

/**
 * Pre-curried matcher for Date.
 */
type Date_<$Actual> = Kind.Apply<SubNoExcessKind, [Date, $Actual]>
const Date_ = runtime.sub.noExcess.Date

/**
 * Pre-curried matcher for RegExp.
 */
type RegExp_<$Actual> = Kind.Apply<SubNoExcessKind, [RegExp, $Actual]>
const RegExp_ = runtime.sub.noExcess.RegExp

/**
 * Pre-curried matcher for Error.
 */
type Error_<$Actual> = Kind.Apply<SubNoExcessKind, [Error, $Actual]>
const Error_ = runtime.sub.noExcess.Error

/**
 * Pre-curried matcher for Promise<any>.
 */
type Promise_<$Actual> = Kind.Apply<SubNoExcessKind, [Promise<any>, $Actual]>
const Promise_ = runtime.sub.noExcess.Promise

/**
 * Pre-curried matcher for any[].
 */
type Array_<$Actual> = Kind.Apply<SubNoExcessKind, [any[], $Actual]>
const Array_ = runtime.sub.noExcess.Array

export {
  Array_ as Array,
  bigint_ as bigint,
  boolean_ as boolean,
  Date_ as Date,
  Error_ as Error,
  null_ as null,
  number_ as number,
  of_ as of,
  Promise_ as Promise,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
}
