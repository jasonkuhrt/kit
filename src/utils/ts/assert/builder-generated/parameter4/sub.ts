import type { Fn } from '#fn'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { SubKind, SubNoExcessKind } from '../../kinds/relators.js'

/**
 * parameter4 + sub relation matchers.
 *
 * Extraction: extracts the fourth parameter type from a function
 * Relation: subtype relation (extends)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `sub<E, A>` instead of `sub.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.of<string, (arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.of<string, (arg: number) => any>
 * ```
 */
type of_<$Expected, $Actual> = Fn.Kind.Apply<SubKind, [$Expected, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const of_ = builder.parameter4.sub.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.string<(arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.string<(arg: number) => any>
 * ```
 */
type string_<$Actual> = Fn.Kind.Apply<SubKind, [string, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const string_ = builder.parameter4.sub.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.number<(arg: number) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.number<(arg: string) => any>
 * ```
 */
type number_<$Actual> = Fn.Kind.Apply<SubKind, [number, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const number_ = builder.parameter4.sub.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.bigint<(arg: bigint) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.bigint<(arg: string) => any>
 * ```
 */
type bigint_<$Actual> = Fn.Kind.Apply<SubKind, [bigint, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const bigint_ = builder.parameter4.sub.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.boolean<(arg: boolean) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.boolean<(arg: string) => any>
 * ```
 */
type boolean_<$Actual> = Fn.Kind.Apply<SubKind, [boolean, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const boolean_ = builder.parameter4.sub.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.undefined<(arg: undefined) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.undefined<(arg: string) => any>
 * ```
 */
type undefined_<$Actual> = Fn.Kind.Apply<SubKind, [undefined, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const undefined_ = builder.parameter4.sub.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.null<(arg: null) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.null<(arg: string) => any>
 * ```
 */
type null_<$Actual> = Fn.Kind.Apply<SubKind, [null, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const null_ = builder.parameter4.sub.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.symbol<(arg: symbol) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.symbol<(arg: string) => any>
 * ```
 */
type symbol_<$Actual> = Fn.Kind.Apply<SubKind, [symbol, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const symbol_ = builder.parameter4.sub.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.Date<(arg: Date) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.Date<(arg: string) => any>
 * ```
 */
type Date_<$Actual> = Fn.Kind.Apply<SubKind, [Date, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const Date_ = builder.parameter4.sub.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.RegExp<(arg: RegExp) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.RegExp<(arg: string) => any>
 * ```
 */
type RegExp_<$Actual> = Fn.Kind.Apply<SubKind, [RegExp, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const RegExp_ = builder.parameter4.sub.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.Error<(arg: Error) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.Error<(arg: string) => any>
 * ```
 */
type Error_<$Actual> = Fn.Kind.Apply<SubKind, [Error, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const Error_ = builder.parameter4.sub.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.unknown<(arg: unknown) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.unknown<(arg: string) => any>
 * ```
 */
type unknown_<$Actual> = Fn.Kind.Apply<SubKind, [unknown, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const unknown_ = builder.parameter4.sub.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.any<(arg: any) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.any<(arg: string) => any>
 * ```
 */
type any_<$Actual> = Fn.Kind.Apply<SubKind, [any, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const any_ = builder.parameter4.sub.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: T, ...) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter4.sub.never<(arg: never) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter4.sub.never<(arg: string) => any>
 * ```
 */
type never_<$Actual> = Fn.Kind.Apply<SubKind, [never, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]>
const never_ = builder.parameter4.sub.never

const ofAs_ = <$Type>() => builder.parameter4.sub.ofAs<$Type>()
/**
 * No-excess variant of sub relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Fn.Kind.Apply<
  SubNoExcessKind,
  [$Expected, Fn.Kind.Apply<Path.Parameter4, [$Actual]>]
>
const noExcess_ = builder.parameter4.sub.noExcess
const noExcessAs_ = <$Type>() => builder.parameter4.sub.noExcessAs<$Type>()

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
