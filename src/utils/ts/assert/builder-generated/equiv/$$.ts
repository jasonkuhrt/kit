import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { EquivKind } from '../../kinds/relators.js'


export * as noExcess from './noExcess.js'
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
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, $Actual]>
const of_ = runtime.equiv.of

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
type string_<$Actual> = Kind.Apply<EquivKind, [string, $Actual]>
const string_ = runtime.equiv.string

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
type number_<$Actual> = Kind.Apply<EquivKind, [number, $Actual]>
const number_ = runtime.equiv.number

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
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, $Actual]>
const bigint_ = runtime.equiv.bigint

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
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, $Actual]>
const boolean_ = runtime.equiv.boolean

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
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, $Actual]>
const undefined_ = runtime.equiv.undefined

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
type null_<$Actual> = Kind.Apply<EquivKind, [null, $Actual]>
const null_ = runtime.equiv.null

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
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, $Actual]>
const symbol_ = runtime.equiv.symbol

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
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, $Actual]>
const Date_ = runtime.equiv.Date

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
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, $Actual]>
const RegExp_ = runtime.equiv.RegExp

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
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, $Actual]>
const Error_ = runtime.equiv.Error

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
type Promise_<$Actual> = Kind.Apply<EquivKind, [Promise<any>, $Actual]>
const Promise_ = runtime.equiv.Promise

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
type Array_<$Actual> = Kind.Apply<EquivKind, [any[], $Actual]>
const Array_ = runtime.equiv.Array

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
