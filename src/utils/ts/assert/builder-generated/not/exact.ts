import type * as Kind from '../../../kind.js'
import type { ExactKind } from '../../kinds/relators.js'
import { runtime } from '../../builder/runtime.js'

/**
 * base + exact relation matchers.
 *
 * Direct type assertion
 * Relation: exact structural equality
 */


/**
 * Base matcher accepting any expected type.
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `exact<E, A>` instead of `exact.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.of<string, string>
 *
 * // ✗ Fail
 * type _ = Assert.exact.of<string, number>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<ExactKind, [$Expected, $Actual, true]>
const of_ = runtime.not.exact.of


/**
 * Pre-curried matcher for string.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.string<string>
 *
 * // ✗ Fail
 * type _ = Assert.exact.string<number>
 * ```
 */
type string_<$Actual> = Kind.Apply<ExactKind, [string, $Actual, true]>
const string_ = runtime.not.exact.string


/**
 * Pre-curried matcher for number.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.number<number>
 *
 * // ✗ Fail
 * type _ = Assert.exact.number<string>
 * ```
 */
type number_<$Actual> = Kind.Apply<ExactKind, [number, $Actual, true]>
const number_ = runtime.not.exact.number


/**
 * Pre-curried matcher for bigint.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.bigint<bigint>
 *
 * // ✗ Fail
 * type _ = Assert.exact.bigint<string>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<ExactKind, [bigint, $Actual, true]>
const bigint_ = runtime.not.exact.bigint


/**
 * Pre-curried matcher for boolean.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.boolean<boolean>
 *
 * // ✗ Fail
 * type _ = Assert.exact.boolean<string>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<ExactKind, [boolean, $Actual, true]>
const boolean_ = runtime.not.exact.boolean


/**
 * Pre-curried matcher for undefined.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.undefined<undefined>
 *
 * // ✗ Fail
 * type _ = Assert.exact.undefined<string>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<ExactKind, [undefined, $Actual, true]>
const undefined_ = runtime.not.exact.undefined


/**
 * Pre-curried matcher for null.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.null<null>
 *
 * // ✗ Fail
 * type _ = Assert.exact.null<string>
 * ```
 */
type null_<$Actual> = Kind.Apply<ExactKind, [null, $Actual, true]>
const null_ = runtime.not.exact.null


/**
 * Pre-curried matcher for symbol.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.symbol<symbol>
 *
 * // ✗ Fail
 * type _ = Assert.exact.symbol<string>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<ExactKind, [symbol, $Actual, true]>
const symbol_ = runtime.not.exact.symbol


/**
 * Pre-curried matcher for Date.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.Date<Date>
 *
 * // ✗ Fail
 * type _ = Assert.exact.Date<string>
 * ```
 */
type Date_<$Actual> = Kind.Apply<ExactKind, [Date, $Actual, true]>
const Date_ = runtime.not.exact.Date


/**
 * Pre-curried matcher for RegExp.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.RegExp<RegExp>
 *
 * // ✗ Fail
 * type _ = Assert.exact.RegExp<string>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<ExactKind, [RegExp, $Actual, true]>
const RegExp_ = runtime.not.exact.RegExp


/**
 * Pre-curried matcher for Error.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.Error<Error>
 *
 * // ✗ Fail
 * type _ = Assert.exact.Error<string>
 * ```
 */
type Error_<$Actual> = Kind.Apply<ExactKind, [Error, $Actual, true]>
const Error_ = runtime.not.exact.Error


/**
 * Pre-curried matcher for Promise<any>.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.Promise<Promise<any>>
 *
 * // ✗ Fail
 * type _ = Assert.exact.Promise<string>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<ExactKind, [Promise<any>, $Actual, true]>
const Promise_ = runtime.not.exact.Promise


/**
 * Pre-curried matcher for any[].
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.exact.Array<any[]>
 *
 * // ✗ Fail
 * type _ = Assert.exact.Array<string>
 * ```
 */
type Array_<$Actual> = Kind.Apply<ExactKind, [any[], $Actual, true]>
const Array_ = runtime.not.exact.Array

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
