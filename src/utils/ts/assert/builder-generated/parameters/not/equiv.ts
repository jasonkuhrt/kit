import type * as Kind from '../../../../kind.js'
import { runtime } from '../../../builder/runtime.js'
import type { Parameters$ } from '../../../../path.js'
import type { EquivKind } from '../../../kinds/relators.js'

/**
 * parameters + equiv relation matchers.
 *
 * Extraction: extracts the parameters tuple from a function
 * Relation: mutual assignability (equivalent types)
 */

/**
 * Base matcher accepting any expected type.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * Note: This exists for symmetry with the value-level API.
 * At the type-level, you can omit `.of` for simpler syntax (e.g., `equiv<E, A>` instead of `equiv.of<E, A>`).
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.of<string, (...args: any[]) => string>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.of<string, (...args: any[]) => number>
 * ```
 */
type of_<$Expected, $Actual> = Kind.Apply<EquivKind, [$Expected, Kind.Apply<Parameters$, [$Actual]>, true]>
const of_ = runtime.parameters.not.equiv.of

/**
 * Pre-curried matcher for string.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.string<(...args: any[]) => string>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.string<(...args: any[]) => number>
 * ```
 */
type string_<$Actual> = Kind.Apply<EquivKind, [string, Kind.Apply<Parameters$, [$Actual]>, true]>
const string_ = runtime.parameters.not.equiv.string

/**
 * Pre-curried matcher for number.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.number<(...args: any[]) => number>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.number<(...args: any[]) => string>
 * ```
 */
type number_<$Actual> = Kind.Apply<EquivKind, [number, Kind.Apply<Parameters$, [$Actual]>, true]>
const number_ = runtime.parameters.not.equiv.number

/**
 * Pre-curried matcher for bigint.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.bigint<(...args: any[]) => bigint>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.bigint<(...args: any[]) => string>
 * ```
 */
type bigint_<$Actual> = Kind.Apply<EquivKind, [bigint, Kind.Apply<Parameters$, [$Actual]>, true]>
const bigint_ = runtime.parameters.not.equiv.bigint

/**
 * Pre-curried matcher for boolean.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.boolean<(...args: any[]) => boolean>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.boolean<(...args: any[]) => string>
 * ```
 */
type boolean_<$Actual> = Kind.Apply<EquivKind, [boolean, Kind.Apply<Parameters$, [$Actual]>, true]>
const boolean_ = runtime.parameters.not.equiv.boolean

/**
 * Pre-curried matcher for undefined.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.undefined<(...args: any[]) => undefined>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.undefined<(...args: any[]) => string>
 * ```
 */
type undefined_<$Actual> = Kind.Apply<EquivKind, [undefined, Kind.Apply<Parameters$, [$Actual]>, true]>
const undefined_ = runtime.parameters.not.equiv.undefined

/**
 * Pre-curried matcher for null.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.null<(...args: any[]) => null>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.null<(...args: any[]) => string>
 * ```
 */
type null_<$Actual> = Kind.Apply<EquivKind, [null, Kind.Apply<Parameters$, [$Actual]>, true]>
const null_ = runtime.parameters.not.equiv.null

/**
 * Pre-curried matcher for symbol.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.symbol<(...args: any[]) => symbol>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.symbol<(...args: any[]) => string>
 * ```
 */
type symbol_<$Actual> = Kind.Apply<EquivKind, [symbol, Kind.Apply<Parameters$, [$Actual]>, true]>
const symbol_ = runtime.parameters.not.equiv.symbol

/**
 * Pre-curried matcher for Date.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.Date<(...args: any[]) => Date>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.Date<(...args: any[]) => string>
 * ```
 */
type Date_<$Actual> = Kind.Apply<EquivKind, [Date, Kind.Apply<Parameters$, [$Actual]>, true]>
const Date_ = runtime.parameters.not.equiv.Date

/**
 * Pre-curried matcher for RegExp.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.RegExp<(...args: any[]) => RegExp>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.RegExp<(...args: any[]) => string>
 * ```
 */
type RegExp_<$Actual> = Kind.Apply<EquivKind, [RegExp, Kind.Apply<Parameters$, [$Actual]>, true]>
const RegExp_ = runtime.parameters.not.equiv.RegExp

/**
 * Pre-curried matcher for Error.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.Error<(...args: any[]) => Error>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.Error<(...args: any[]) => string>
 * ```
 */
type Error_<$Actual> = Kind.Apply<EquivKind, [Error, Kind.Apply<Parameters$, [$Actual]>, true]>
const Error_ = runtime.parameters.not.equiv.Error

/**
 * Pre-curried matcher for Promise<any>.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.Promise<(...args: any[]) => Promise<any>>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.Promise<(...args: any[]) => string>
 * ```
 */
type Promise_<$Actual> = Kind.Apply<EquivKind, [Promise<any>, Kind.Apply<Parameters$, [$Actual]>, true]>
const Promise_ = runtime.parameters.not.equiv.Promise

/**
 * Pre-curried matcher for any[].
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.Array<(...args: any[]) => any[]>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.Array<(...args: any[]) => string>
 * ```
 */
type Array_<$Actual> = Kind.Apply<EquivKind, [any[], Kind.Apply<Parameters$, [$Actual]>, true]>
const Array_ = runtime.parameters.not.equiv.Array

/**
 * Pre-curried matcher for unknown.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.unknown<(...args: any[]) => unknown>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.unknown<(...args: any[]) => string>
 * ```
 */
type unknown_<$Actual> = Kind.Apply<EquivKind, [unknown, Kind.Apply<Parameters$, [$Actual]>, true]>
const unknown_ = runtime.parameters.not.equiv.unknown

/**
 * Pre-curried matcher for any.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.any<(...args: any[]) => any>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.any<(...args: any[]) => string>
 * ```
 */
type any_<$Actual> = Kind.Apply<EquivKind, [any, Kind.Apply<Parameters$, [$Actual]>, true]>
const any_ = runtime.parameters.not.equiv.any

/**
 * Pre-curried matcher for never.
 * Extraction chain: (...args: any[]) => T → Parameters<Function>
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * type _ = Assert.parameters.equiv.never<(...args: any[]) => never>
 *
 * // ✗ Fail
 * type _ = Assert.parameters.equiv.never<(...args: any[]) => string>
 * ```
 */
type never_<$Actual> = Kind.Apply<EquivKind, [never, Kind.Apply<Parameters$, [$Actual]>, true]>
const never_ = runtime.parameters.not.equiv.never

const ofAs_ = runtime.parameters.not.equiv.ofAs

export {
  any_ as any,
  Array_ as Array,
  bigint_ as bigint,
  boolean_ as boolean,
  Date_ as Date,
  Error_ as Error,
  never_ as never,
  null_ as null,
  number_ as number,
  of_ as of,
  ofAs_ as ofAs,
  Promise_ as Promise,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
  unknown_ as unknown,
}
