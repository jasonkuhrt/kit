import type { Fn } from '#fn'
import type * as Path from '../../../../path.js'
import { builder } from '../../../builder-singleton.js'
import type { ExactKind } from '../../../kinds/relators.js'

/**
 * parameters + exact relation matchers.
 *
 * Extraction: extracts the parameters tuple from a function
 * Relation: exact structural equality
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `exact<E, A>` instead of `exact.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.of<string, (...args: any[]) => string>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.of<string, (...args: any[]) => number>
 * ```
 */
type of_<$Expected, $Actual> = Fn.Kind.Apply<ExactKind, [$Expected, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const of_ = builder.parameters.not.exact.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.string<(...args: any[]) => string>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.string<(...args: any[]) => number>
 * ```
 */
type string_<$Actual> = Fn.Kind.Apply<ExactKind, [string, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const string_ = builder.parameters.not.exact.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.number<(...args: any[]) => number>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.number<(...args: any[]) => string>
 * ```
 */
type number_<$Actual> = Fn.Kind.Apply<ExactKind, [number, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const number_ = builder.parameters.not.exact.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.bigint<(...args: any[]) => bigint>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.bigint<(...args: any[]) => string>
 * ```
 */
type bigint_<$Actual> = Fn.Kind.Apply<ExactKind, [bigint, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const bigint_ = builder.parameters.not.exact.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.boolean<(...args: any[]) => boolean>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.boolean<(...args: any[]) => string>
 * ```
 */
type boolean_<$Actual> = Fn.Kind.Apply<ExactKind, [boolean, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const boolean_ = builder.parameters.not.exact.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.undefined<(...args: any[]) => undefined>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.undefined<(...args: any[]) => string>
 * ```
 */
type undefined_<$Actual> = Fn.Kind.Apply<ExactKind, [undefined, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const undefined_ = builder.parameters.not.exact.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.null<(...args: any[]) => null>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.null<(...args: any[]) => string>
 * ```
 */
type null_<$Actual> = Fn.Kind.Apply<ExactKind, [null, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const null_ = builder.parameters.not.exact.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.symbol<(...args: any[]) => symbol>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.symbol<(...args: any[]) => string>
 * ```
 */
type symbol_<$Actual> = Fn.Kind.Apply<ExactKind, [symbol, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const symbol_ = builder.parameters.not.exact.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.Date<(...args: any[]) => Date>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.Date<(...args: any[]) => string>
 * ```
 */
type Date_<$Actual> = Fn.Kind.Apply<ExactKind, [Date, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const Date_ = builder.parameters.not.exact.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.RegExp<(...args: any[]) => RegExp>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.RegExp<(...args: any[]) => string>
 * ```
 */
type RegExp_<$Actual> = Fn.Kind.Apply<ExactKind, [RegExp, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const RegExp_ = builder.parameters.not.exact.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.Error<(...args: any[]) => Error>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.Error<(...args: any[]) => string>
 * ```
 */
type Error_<$Actual> = Fn.Kind.Apply<ExactKind, [Error, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const Error_ = builder.parameters.not.exact.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.unknown<(...args: any[]) => unknown>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.unknown<(...args: any[]) => string>
 * ```
 */
type unknown_<$Actual> = Fn.Kind.Apply<ExactKind, [unknown, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const unknown_ = builder.parameters.not.exact.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.any<(...args: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.any<(...args: any[]) => string>
 * ```
 */
type any_<$Actual> = Fn.Kind.Apply<ExactKind, [any, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const any_ = builder.parameters.not.exact.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.exact.never<(...args: any[]) => never>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.exact.never<(...args: any[]) => string>
 * ```
 */
type never_<$Actual> = Fn.Kind.Apply<ExactKind, [never, Fn.Kind.Apply<Path.Parameters$, [$Actual]>, true]>
const never_ = builder.parameters.not.exact.never

const ofAs_ = <$Type>() => builder.parameters.not.exact.ofAs<$Type>()
type noExcess_ = never
const noExcess_ = builder.parameters.not.exact.noExcess

export {
  any_ as any,
  bigint_ as bigint,
  boolean_ as boolean,
  Date_ as Date,
  Error_ as Error,
  never_ as never,
  noExcess_ as noExcess,
  null_ as null,
  number_ as number,
  of_ as of,
  ofAs_ as ofAs,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
  unknown_ as unknown,
}
