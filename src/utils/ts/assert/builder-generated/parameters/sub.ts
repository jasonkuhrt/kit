import type { Fn } from '#fn'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { SubKind, SubNoExcessKind } from '../../kinds/relators.js'

/**
 * parameters + sub relation matchers.
 *
 * Extraction: extracts the parameters tuple from a function
 * Relation: subtype relation (extends)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `sub<E, A>` instead of `sub.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.of<string, (...args: any[]) => string>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.of<string, (...args: any[]) => number>
 * ```
 */
type of_<$Expected, $Actual> = Fn.Kind.Apply<SubKind, [$Expected, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const of_ = builder.parameters.sub.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.string<(...args: any[]) => string>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.string<(...args: any[]) => number>
 * ```
 */
type string_<$Actual> = Fn.Kind.Apply<SubKind, [string, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const string_ = builder.parameters.sub.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.number<(...args: any[]) => number>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.number<(...args: any[]) => string>
 * ```
 */
type number_<$Actual> = Fn.Kind.Apply<SubKind, [number, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const number_ = builder.parameters.sub.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.bigint<(...args: any[]) => bigint>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.bigint<(...args: any[]) => string>
 * ```
 */
type bigint_<$Actual> = Fn.Kind.Apply<SubKind, [bigint, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const bigint_ = builder.parameters.sub.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.boolean<(...args: any[]) => boolean>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.boolean<(...args: any[]) => string>
 * ```
 */
type boolean_<$Actual> = Fn.Kind.Apply<SubKind, [boolean, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const boolean_ = builder.parameters.sub.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.undefined<(...args: any[]) => undefined>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.undefined<(...args: any[]) => string>
 * ```
 */
type undefined_<$Actual> = Fn.Kind.Apply<SubKind, [undefined, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const undefined_ = builder.parameters.sub.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.null<(...args: any[]) => null>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.null<(...args: any[]) => string>
 * ```
 */
type null_<$Actual> = Fn.Kind.Apply<SubKind, [null, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const null_ = builder.parameters.sub.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.symbol<(...args: any[]) => symbol>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.symbol<(...args: any[]) => string>
 * ```
 */
type symbol_<$Actual> = Fn.Kind.Apply<SubKind, [symbol, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const symbol_ = builder.parameters.sub.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.Date<(...args: any[]) => Date>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.Date<(...args: any[]) => string>
 * ```
 */
type Date_<$Actual> = Fn.Kind.Apply<SubKind, [Date, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const Date_ = builder.parameters.sub.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.RegExp<(...args: any[]) => RegExp>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.RegExp<(...args: any[]) => string>
 * ```
 */
type RegExp_<$Actual> = Fn.Kind.Apply<SubKind, [RegExp, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const RegExp_ = builder.parameters.sub.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.Error<(...args: any[]) => Error>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.Error<(...args: any[]) => string>
 * ```
 */
type Error_<$Actual> = Fn.Kind.Apply<SubKind, [Error, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const Error_ = builder.parameters.sub.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.unknown<(...args: any[]) => unknown>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.unknown<(...args: any[]) => string>
 * ```
 */
type unknown_<$Actual> = Fn.Kind.Apply<SubKind, [unknown, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const unknown_ = builder.parameters.sub.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.any<(...args: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.any<(...args: any[]) => string>
 * ```
 */
type any_<$Actual> = Fn.Kind.Apply<SubKind, [any, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const any_ = builder.parameters.sub.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.sub.never<(...args: any[]) => never>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.sub.never<(...args: any[]) => string>
 * ```
 */
type never_<$Actual> = Fn.Kind.Apply<SubKind, [never, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]>
const never_ = builder.parameters.sub.never

const ofAs_ = <$Type>() => builder.parameters.sub.ofAs<$Type>()
/**
 * No-excess variant of sub relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Fn.Kind.Apply<
  SubNoExcessKind,
  [$Expected, Fn.Kind.Apply<Path.Parameters$, [$Actual]>]
>
const noExcess_ = builder.parameters.sub.noExcess
const noExcessAs_ = <$Type>() => builder.parameters.sub.noExcessAs<$Type>()

export {
  any_ as any,
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
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
  unknown_ as unknown,
}
