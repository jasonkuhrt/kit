import type { Fn } from '#fn'
import type * as Path from '../../../../path.js'
import { builder } from '../../../builder-singleton.js'
import type { SubKind } from '../../../kinds/relators.js'

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
type of_<$Expected, $Actual> = Fn.Kind.Apply<SubKind, [$Expected, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const of_ = builder.returned.not.sub.of

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
type string_<$Actual> = Fn.Kind.Apply<SubKind, [string, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const string_ = builder.returned.not.sub.string

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
type number_<$Actual> = Fn.Kind.Apply<SubKind, [number, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const number_ = builder.returned.not.sub.number

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
type bigint_<$Actual> = Fn.Kind.Apply<SubKind, [bigint, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const bigint_ = builder.returned.not.sub.bigint

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
type boolean_<$Actual> = Fn.Kind.Apply<SubKind, [boolean, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const boolean_ = builder.returned.not.sub.boolean

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
type undefined_<$Actual> = Fn.Kind.Apply<SubKind, [undefined, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const undefined_ = builder.returned.not.sub.undefined

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
type null_<$Actual> = Fn.Kind.Apply<SubKind, [null, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const null_ = builder.returned.not.sub.null

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
type symbol_<$Actual> = Fn.Kind.Apply<SubKind, [symbol, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const symbol_ = builder.returned.not.sub.symbol

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
type Date_<$Actual> = Fn.Kind.Apply<SubKind, [Date, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const Date_ = builder.returned.not.sub.Date

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
type RegExp_<$Actual> = Fn.Kind.Apply<SubKind, [RegExp, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const RegExp_ = builder.returned.not.sub.RegExp

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
type Error_<$Actual> = Fn.Kind.Apply<SubKind, [Error, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const Error_ = builder.returned.not.sub.Error

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
type unknown_<$Actual> = Fn.Kind.Apply<SubKind, [unknown, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const unknown_ = builder.returned.not.sub.unknown

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
type any_<$Actual> = Fn.Kind.Apply<SubKind, [any, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const any_ = builder.returned.not.sub.any

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
type never_<$Actual> = Fn.Kind.Apply<SubKind, [never, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const never_ = builder.returned.not.sub.never

const ofAs_ = <$Type>() => builder.returned.not.sub.ofAs<$Type>()

export {
  any_ as any,
  bigint_ as bigint,
  boolean_ as boolean,
  Date_ as Date,
  Error_ as Error,
  never_ as never,
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
