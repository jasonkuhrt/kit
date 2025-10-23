import type { Str } from '#str'
import type { Simplify } from '#ts/ts'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Base Error Types
//
//
//
//

/**
 * Structural interface for all static type-level errors.
 *
 * All type-level error types must extend this interface by having an `ERROR_________` field.
 * This allows error detection via structural typing.
 *
 * @example
 * ```ts
 * // Check if a type is an error
 * type IsError<$T> = $T extends StaticErrorLike ? true : false
 *
 * // Pass through errors in type transformations
 * type Transform<$T> = $T extends StaticErrorLike ? $T : ActualTransform<$T>
 * ```
 *
 * @category Error Messages
 */
export interface StaticErrorLike<$Message extends string = string> {
  ERROR_________: $Message
}

/**
 * Pad a key to 14 characters with underscores - optimized with zero recursion.
 * @internal
 */
// dprint-ignore
type PadKeyTo14<$Key extends string> =
  Str.Length<$Key> extends infer __len extends number
    ? __len extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
      ? {
          0: '______________'
          1: `${$Key}_____________`
          2: `${$Key}____________`
          3: `${$Key}___________`
          4: `${$Key}__________`
          5: `${$Key}_________`
          6: `${$Key}________`
          7: `${$Key}_______`
          8: `${$Key}______`
          9: `${$Key}_____`
          10: `${$Key}____`
          11: `${$Key}___`
          12: `${$Key}__`
          13: `${$Key}_`
        }[__len]
      : $Key  // >= 14, already long enough
    : $Key

/**
 * General-purpose static type-level error with flexible metadata.
 *
 * This is the base error type for creating custom error messages at the type level.
 * For assertion-specific errors with expected/actual fields, use {@link StaticErrorAssertion}.
 *
 * The error message and metadata fields are automatically padded to align keys for better readability.
 *
 * @template $Message - A string literal type describing the error
 * @template $Meta - Optional metadata object with custom fields
 *
 * @example
 * ```ts
 * // Simple error with just a message
 * type E1 = StaticError<'Invalid operation'>
 * // { ERROR_________: 'Invalid operation' }
 *
 * // Error with metadata
 * type E2 = StaticError<'Key not found', { key: 'foo'; available: ['bar', 'baz'] }>
 * // {
 * //   ERROR_________: 'Key not found'
 * //   key___________: 'foo'
 * //   available_____: ['bar', 'baz']
 * // }
 * ```
 *
 * @category Error Messages
 */
// dprint-ignore
export type StaticError<
  $Message extends string = string,
  $Meta extends Record<string, any> = {},
  ___$Obj = StaticErrorLike<$Message> & $Meta
> = Simplify.Shallow<{
  [k  in keyof ___$Obj
      as k extends string
        ? PadKeyTo14<k>
        : k
  ]: ___$Obj[k]
}>

/**
 * Type alias for any static error with default generic parameters.
 * Useful for union types or constraints where any error should be accepted.
 *
 * @category Error Messages
 */
export type StaticErrorAny = StaticError<string, {}>

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Error Utilities (Err namespace)
//
//
//
//

/**
 * Check if a type is a static error.
 *
 * This type distributes over unions, checking each member.
 *
 * @template $T - The type to check
 * @returns true if $T extends StaticErrorLike, false otherwise
 *
 * @example
 * ```ts
 * type A = Is<StaticError<'msg'>>  // true
 * type B = Is<string>  // false
 * type C = Is<{ ERROR_________: 'msg' }>  // true (structural)
 * type D = Is<string | StaticError<'msg'>>  // boolean (distributes: false | true)
 * ```
 *
 * @category Error Utilities
 */
export type Is<$T> = $T extends StaticErrorLike ? true : false

/**
 * Renders an error based on the `renderErrors` setting.
 *
 * When `renderErrors` is `true` (default), returns the full error object.
 * When `false`, extracts just the error message string for cleaner IDE hovers.
 *
 * Uses the generic {@link KitLibrarySettings.Ts.Error.Settings.renderErrors} setting.
 *
 * @template $Error - The full StaticErrorLike object or error type
 *
 * @example
 * ```ts
 * // With renderErrors: true (default)
 * type E = Render<StaticError<'msg', { key: 'value' }>>
 * // { ERROR_________: 'msg', key___________: 'value' }
 *
 * // With renderErrors: false
 * type E = Render<StaticError<'msg', { key: 'value' }>>
 * // 'msg'
 * ```
 *
 * @category Error Utilities
 */
// dprint-ignore
export type Render<$Error extends StaticErrorLike> =
  KitLibrarySettings.Ts.Error.Settings['renderErrors'] extends false
    ? $Error['ERROR_________']
    : $Error

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Unicode Symbols
//
//
//
//

/**
 * Cross mark - indicates an error or type mismatch occurred.
 * Used in error messages to denote failures or incompatibilities.
 */
export const CROSS = `✕`

/**
 * Warning sign - indicates a potential issue or cautionary note.
 * Used when types are equivalent but not structurally exact.
 */
export const WARNING = `⚠`

/**
 * Lightning bolt - indicates type coercion or transformation.
 * Used when automatic type conversions occur.
 */
export const LIGHTNING = `⚡`

/**
 * Exclusion symbol - indicates type exclusion or prohibition.
 * Used when certain types are explicitly not allowed.
 */
export const EXCLUSION = `⊘`

/**
 * Empty set - indicates an empty type or no valid values.
 * Used when a type has no inhabitants (like never in certain contexts).
 */
export const EMPTY_SET = `∅`
