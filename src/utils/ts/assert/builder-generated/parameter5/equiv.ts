import type { Fn } from '#fn'
import type * as Path from '../../../path.js'
import { builder } from '../../builder-singleton.js'
import type { EquivKind, EquivNoExcessKind } from '../../kinds/relators.js'

/**
 * parameter5 + equiv relation matchers.
 *
 * Extraction: extracts the fifth parameter type from a function
 * Relation: mutual assignability (equivalent types)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `equiv<E, A>` instead of `equiv.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.of<string, (arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.of<string, (arg: number) => any>
 * ```
 */
type of_<$Expected, $Actual> = Fn.Kind.Apply<EquivKind, [$Expected, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const of_ = builder.parameter5.equiv.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.string<(arg: string) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.string<(arg: number) => any>
 * ```
 */
type string_<$Actual> = Fn.Kind.Apply<EquivKind, [string, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const string_ = builder.parameter5.equiv.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.number<(arg: number) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.number<(arg: string) => any>
 * ```
 */
type number_<$Actual> = Fn.Kind.Apply<EquivKind, [number, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const number_ = builder.parameter5.equiv.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.bigint<(arg: bigint) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.bigint<(arg: string) => any>
 * ```
 */
type bigint_<$Actual> = Fn.Kind.Apply<EquivKind, [bigint, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const bigint_ = builder.parameter5.equiv.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.boolean<(arg: boolean) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.boolean<(arg: string) => any>
 * ```
 */
type boolean_<$Actual> = Fn.Kind.Apply<EquivKind, [boolean, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const boolean_ = builder.parameter5.equiv.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.undefined<(arg: undefined) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.undefined<(arg: string) => any>
 * ```
 */
type undefined_<$Actual> = Fn.Kind.Apply<EquivKind, [undefined, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const undefined_ = builder.parameter5.equiv.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.null<(arg: null) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.null<(arg: string) => any>
 * ```
 */
type null_<$Actual> = Fn.Kind.Apply<EquivKind, [null, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const null_ = builder.parameter5.equiv.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.symbol<(arg: symbol) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.symbol<(arg: string) => any>
 * ```
 */
type symbol_<$Actual> = Fn.Kind.Apply<EquivKind, [symbol, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const symbol_ = builder.parameter5.equiv.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.Date<(arg: Date) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.Date<(arg: string) => any>
 * ```
 */
type Date_<$Actual> = Fn.Kind.Apply<EquivKind, [Date, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const Date_ = builder.parameter5.equiv.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.RegExp<(arg: RegExp) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.RegExp<(arg: string) => any>
 * ```
 */
type RegExp_<$Actual> = Fn.Kind.Apply<EquivKind, [RegExp, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const RegExp_ = builder.parameter5.equiv.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.Error<(arg: Error) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.Error<(arg: string) => any>
 * ```
 */
type Error_<$Actual> = Fn.Kind.Apply<EquivKind, [Error, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const Error_ = builder.parameter5.equiv.Error

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.unknown<(arg: unknown) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.unknown<(arg: string) => any>
 * ```
 */
type unknown_<$Actual> = Fn.Kind.Apply<EquivKind, [unknown, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const unknown_ = builder.parameter5.equiv.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.any<(arg: any) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.any<(arg: string) => any>
 * ```
 */
type any_<$Actual> = Fn.Kind.Apply<EquivKind, [any, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const any_ = builder.parameter5.equiv.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (p1: any, p2: any, p3: any, p4: any, p5: T) => any → T
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameter5.equiv.never<(arg: never) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameter5.equiv.never<(arg: string) => any>
 * ```
 */
type never_<$Actual> = Fn.Kind.Apply<EquivKind, [never, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]>
const never_ = builder.parameter5.equiv.never

const ofAs_ = <$Type>() => builder.parameter5.equiv.ofAs<$Type>()
/**
 * No-excess variant of equiv relation.
 * Checks that actual has no excess properties beyond expected.
 */
type noExcess_<$Expected, $Actual> = Fn.Kind.Apply<
  EquivNoExcessKind,
  [$Expected, Fn.Kind.Apply<Path.Parameter5, [$Actual]>]
>
const noExcess_ = builder.parameter5.equiv.noExcess
const noExcessAs_ = <$Type>() => builder.parameter5.equiv.noExcessAs<$Type>()

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
