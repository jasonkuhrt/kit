import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { EquivNoExcessKind } from '../../kinds/relators.js'

/**
 * equiv + noExcess relation matchers.
 *
 * Direct type assertion
 * Relation: mutual assignability (equivalent types) with no excess properties
 */

/**
 * Base matcher accepting any expected type.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.equiv.noExcess.of<{ id: string }, { id: string }>
 *
 * // ✗ Fail - excess property
 * type _ = Assert.equiv.noExcess.of<{ id: string }, { id: string; name: string }>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<EquivNoExcessKind, [$Expected, $Actual]>
const of_ = runtime.equiv.noExcess.of

/**
 * Pre-curried matcher for string.
 */
type string_<$Actual> = Kind.Apply<EquivNoExcessKind, [string, $Actual]>
const string_ = runtime.equiv.noExcess.string

/**
 * Pre-curried matcher for number.
 */
type number_<$Actual> = Kind.Apply<EquivNoExcessKind, [number, $Actual]>
const number_ = runtime.equiv.noExcess.number

/**
 * Pre-curried matcher for bigint.
 */
type bigint_<$Actual> = Kind.Apply<EquivNoExcessKind, [bigint, $Actual]>
const bigint_ = runtime.equiv.noExcess.bigint

/**
 * Pre-curried matcher for boolean.
 */
type boolean_<$Actual> = Kind.Apply<EquivNoExcessKind, [boolean, $Actual]>
const boolean_ = runtime.equiv.noExcess.boolean

/**
 * Pre-curried matcher for undefined.
 */
type undefined_<$Actual> = Kind.Apply<EquivNoExcessKind, [undefined, $Actual]>
const undefined_ = runtime.equiv.noExcess.undefined

/**
 * Pre-curried matcher for null.
 */
type null_<$Actual> = Kind.Apply<EquivNoExcessKind, [null, $Actual]>
const null_ = runtime.equiv.noExcess.null

/**
 * Pre-curried matcher for symbol.
 */
type symbol_<$Actual> = Kind.Apply<EquivNoExcessKind, [symbol, $Actual]>
const symbol_ = runtime.equiv.noExcess.symbol

/**
 * Pre-curried matcher for Date.
 */
type Date_<$Actual> = Kind.Apply<EquivNoExcessKind, [Date, $Actual]>
const Date_ = runtime.equiv.noExcess.Date

/**
 * Pre-curried matcher for RegExp.
 */
type RegExp_<$Actual> = Kind.Apply<EquivNoExcessKind, [RegExp, $Actual]>
const RegExp_ = runtime.equiv.noExcess.RegExp

/**
 * Pre-curried matcher for Error.
 */
type Error_<$Actual> = Kind.Apply<EquivNoExcessKind, [Error, $Actual]>
const Error_ = runtime.equiv.noExcess.Error

/**
 * Pre-curried matcher for Promise<any>.
 */
type Promise_<$Actual> = Kind.Apply<EquivNoExcessKind, [Promise<any>, $Actual]>
const Promise_ = runtime.equiv.noExcess.Promise

/**
 * Pre-curried matcher for any[].
 */
type Array_<$Actual> = Kind.Apply<EquivNoExcessKind, [any[], $Actual]>
const Array_ = runtime.equiv.noExcess.Array

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
