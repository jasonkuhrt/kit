import type { Fn } from '#fn'
import type * as Path from '../../../../path.js'
import { builder } from '../../../builder-singleton.js'
import type { EquivKind } from '../../../kinds/relators.js'

/**
 * returned + equiv relation matchers.
 *
 * Extraction: extracts the return type from a function
 * Relation: mutual assignability (equivalent types)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (...args: any[]) => T → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `equiv<E, A>` instead of `equiv.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.of<string, () => string>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.of<string, () => number>
 * ```
 */
type of_<$Expected, $Actual> = Fn.Kind.Apply<EquivKind, [$Expected, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const of_ = builder.returned.not.equiv.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.string<() => string>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.string<() => number>
 * ```
 */
type string_<$Actual> = Fn.Kind.Apply<EquivKind, [string, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const string_ = builder.returned.not.equiv.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.number<() => number>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.number<() => string>
 * ```
 */
type number_<$Actual> = Fn.Kind.Apply<EquivKind, [number, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const number_ = builder.returned.not.equiv.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.bigint<() => bigint>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.bigint<() => string>
 * ```
 */
type bigint_<$Actual> = Fn.Kind.Apply<EquivKind, [bigint, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const bigint_ = builder.returned.not.equiv.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.boolean<() => boolean>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.boolean<() => string>
 * ```
 */
type boolean_<$Actual> = Fn.Kind.Apply<EquivKind, [boolean, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const boolean_ = builder.returned.not.equiv.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.undefined<() => undefined>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.undefined<() => string>
 * ```
 */
type undefined_<$Actual> = Fn.Kind.Apply<EquivKind, [undefined, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const undefined_ = builder.returned.not.equiv.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.null<() => null>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.null<() => string>
 * ```
 */
type null_<$Actual> = Fn.Kind.Apply<EquivKind, [null, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const null_ = builder.returned.not.equiv.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.symbol<() => symbol>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.symbol<() => string>
 * ```
 */
type symbol_<$Actual> = Fn.Kind.Apply<EquivKind, [symbol, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const symbol_ = builder.returned.not.equiv.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.Date<() => Date>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.Date<() => string>
 * ```
 */
type Date_<$Actual> = Fn.Kind.Apply<EquivKind, [Date, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const Date_ = builder.returned.not.equiv.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.RegExp<() => RegExp>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.RegExp<() => string>
 * ```
 */
type RegExp_<$Actual> = Fn.Kind.Apply<EquivKind, [RegExp, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const RegExp_ = builder.returned.not.equiv.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.Error<() => Error>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.Error<() => string>
 * ```
 */
type Error_<$Actual> = Fn.Kind.Apply<EquivKind, [Error, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const Error_ = builder.returned.not.equiv.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.unknown<() => unknown>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.unknown<() => string>
 * ```
 */
type unknown_<$Actual> = Fn.Kind.Apply<EquivKind, [unknown, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const unknown_ = builder.returned.not.equiv.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.any<() => any>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.any<() => string>
 * ```
 */
type any_<$Actual> = Fn.Kind.Apply<EquivKind, [any, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const any_ = builder.returned.not.equiv.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (...args: any[]) => T → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.returned.equiv.never<() => never>
 *
 * // ✗ Fail
 * type _ = Assert.returned.equiv.never<() => string>
 * ```
 */
type never_<$Actual> = Fn.Kind.Apply<EquivKind, [never, Fn.Kind.Apply<Path.Returned, [$Actual]>, true]>
const never_ = builder.returned.not.equiv.never

const ofAs_ = <$Type>() => builder.returned.not.equiv.ofAs<$Type>()

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
