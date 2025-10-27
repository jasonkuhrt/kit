import type { Fn } from '#fn'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, EquivNoExcessKind } from '../../kinds/relators.js'

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
type of_<$Expected, $Actual> = Fn.Kind.Apply<EquivKind, [$Expected, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const of_ = builder.returned.equiv.of

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
type string_<$Actual> = Fn.Kind.Apply<EquivKind, [string, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const string_ = builder.returned.equiv.string

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
type number_<$Actual> = Fn.Kind.Apply<EquivKind, [number, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const number_ = builder.returned.equiv.number

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
type bigint_<$Actual> = Fn.Kind.Apply<EquivKind, [bigint, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const bigint_ = builder.returned.equiv.bigint

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
type boolean_<$Actual> = Fn.Kind.Apply<EquivKind, [boolean, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const boolean_ = builder.returned.equiv.boolean

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
type undefined_<$Actual> = Fn.Kind.Apply<EquivKind, [undefined, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const undefined_ = builder.returned.equiv.undefined

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
type null_<$Actual> = Fn.Kind.Apply<EquivKind, [null, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const null_ = builder.returned.equiv.null

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
type symbol_<$Actual> = Fn.Kind.Apply<EquivKind, [symbol, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const symbol_ = builder.returned.equiv.symbol

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
type Date_<$Actual> = Fn.Kind.Apply<EquivKind, [Date, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const Date_ = builder.returned.equiv.Date

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
type RegExp_<$Actual> = Fn.Kind.Apply<EquivKind, [RegExp, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const RegExp_ = builder.returned.equiv.RegExp

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
type Error_<$Actual> = Fn.Kind.Apply<EquivKind, [Error, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const Error_ = builder.returned.equiv.Error

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
type unknown_<$Actual> = Fn.Kind.Apply<EquivKind, [unknown, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const unknown_ = builder.returned.equiv.unknown

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
type any_<$Actual> = Fn.Kind.Apply<EquivKind, [any, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const any_ = builder.returned.equiv.any

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
type never_<$Actual> = Fn.Kind.Apply<EquivKind, [never, Fn.Kind.Apply<Path.Returned, [$Actual]>]>
const never_ = builder.returned.equiv.never

const ofAs_ = <$Type>() => builder.returned.equiv.ofAs<$Type>()
/**
 * No-excess variant of equiv relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Fn.Kind.Apply<
  EquivNoExcessKind,
  [$Expected, Fn.Kind.Apply<Path.Returned, [$Actual]>]
>
const noExcess_ = builder.returned.equiv.noExcess
const noExcessAs_ = <$Type>() => builder.returned.equiv.noExcessAs<$Type>()

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
