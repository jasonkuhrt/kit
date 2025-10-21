/**
 * @generated
 * This file contains generated type-level matchers.
 * Manual edits should be made carefully and consistently across all generated files.
 */

import type * as Kind from '../../../kind.js'
import { runtime } from '../../builder/runtime.js'
import type { EquivKind, EquivNoExcessKind } from '../../kinds/relators.js'

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
 * Type-explicit matcher accepting an explicit type parameter.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * Assert.equiv.ofAs<string>()('hello')
 *
 * // ✗ Fail
 * Assert.equiv.ofAs<string>()(42)
 * ```
 */
const ofAs_ = runtime.equiv.ofAs

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

/**
 * Pre-curried matcher for unknown.
 */
type unknown_<$Actual> = Kind.Apply<EquivKind, [unknown, $Actual]>
const unknown_ = runtime.equiv.unknown

/**
 * Pre-curried matcher for any.
 */
type any_<$Actual> = Kind.Apply<EquivKind, [any, $Actual]>
const any_ = runtime.equiv.any

/**
 * Pre-curried matcher for never.
 */
type never_<$Actual> = Kind.Apply<EquivKind, [never, $Actual]>
const never_ = runtime.equiv.never

/**
 * Equivalence relation with no excess properties.
 *
 * Asserts that actual is equivalent to expected AND has no excess properties.
 *
 * @example
 * ```typescript
 * // ✓ Pass - no excess properties
 * type _ = Assert.equiv.noExcess<{ id: string }, { id: string }>
 *
 * // ✗ Fail - has excess property 'name'
 * type _ = Assert.equiv.noExcess<{ id: string }, { id: string; name: string }>
 * ```
 */
type noExcess_<$Expected, $Actual> = Kind.Apply<EquivNoExcessKind, [$Expected, $Actual]>
const noExcess_ = runtime.equiv.noExcess

/**
 * Type-explicit variant of noExcess.
 *
 * Asserts that the actual type is equivalent to the expected type AND has no excess properties.
 *
 * @example
 * ```typescript
 * // ✓ Pass
 * Assert.equiv.noExcessAs<{ id: string }>()({ id: 'abc' })
 *
 * // ✗ Fail - has excess property
 * Assert.equiv.noExcessAs<{ id: string }>()({ id: 'abc', name: 'John' })
 * ```
 */
const noExcessAs_ = runtime.equiv.noExcessAs

export {
  any_ as any,
  Array_ as Array,
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
  Promise_ as Promise,
  RegExp_ as RegExp,
  string_ as string,
  symbol_ as symbol,
  undefined_ as undefined,
  unknown_ as unknown,
}
