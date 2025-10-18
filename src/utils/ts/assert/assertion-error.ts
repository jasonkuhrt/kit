import type { Lang } from '#lang'
import type { Obj } from '#obj'
import type { Str } from '#str'
import type { A } from 'ts-toolbelt'
import type { Simplify } from 'type-fest'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Assertion Error
//
//
//
//

export interface AssertionErrorHash {
  ERROR_________: string
}

/**
 * Renders an assertion error based on the `renderAssertionErrors` setting.
 *
 * When `renderAssertionErrors` is `true` (default), returns the full error object.
 * When `false`, extracts just the error message string for cleaner IDE hovers.
 *
 * @template $Error - The full StaticErrorAssertion object or error type
 *
 * @example
 * ```ts
 * // With renderAssertionErrors: true
 * type E = RenderAssertionError<StaticErrorAssertion<'msg', string, number>>
 * // { ERROR_________: 'msg', expected______: string, actual________: number }
 *
 * // With renderAssertionErrors: false
 * type E = RenderAssertionError<StaticErrorAssertion<'msg', string, number>>
 * // 'msg'
 * ```
 */
// dprint-ignore
export type RenderAssertionError<$Error extends AssertionErrorHash> =
  KitLibrarySettings.Ts.Assert.Settings['renderAssertionErrors'] extends false
    ? $Error
    : $Error['ERROR_________']

/**
 * Represents a static assertion error at the type level, optimized for type testing.
 *
 * This is a simpler, more focused error type compared to {@link StaticError}. It's specifically
 * designed for type assertions where you need to communicate expected vs. actual types.
 *
 * Supports three forms of metadata:
 * - Single string tip: `StaticErrorAssertion<'msg', E, A, 'tip'>`
 * - Tuple of tips: `StaticErrorAssertion<'msg', E, A, ['tip1', 'tip2']>`
 * - Metadata object: `StaticErrorAssertion<'msg', E, A, { custom: 'data' }>`
 * - Object with tip: `StaticErrorAssertion<'msg', E, A, { tip: 'advice', ...meta }>`
 *
 * @template $Message - A string literal type describing the assertion failure
 * @template $Expected - The expected type
 * @template $Actual - The actual type that was provided
 * @template $Meta - Optional metadata: string tip, tuple of tips, or object with custom fields
 *
 * @example
 * ```ts
 * // Simple error with message only
 * type E1 = StaticErrorAssertion<'Types mismatch', string, number>
 *
 * // With a single tip
 * type E2 = StaticErrorAssertion<'Types mismatch', string, number, 'Use String() to convert'>
 *
 * // With multiple tips
 * type E3 = StaticErrorAssertion<'Types mismatch', string, number, ['Tip 1', 'Tip 2']>
 *
 * // With metadata object
 * type E4 = StaticErrorAssertion<'Types mismatch', string, number, { operation: 'concat' }>
 *
 * // With tip and metadata
 * type E5 = StaticErrorAssertion<'Types mismatch', string, number, { tip: 'Use String()', diff_missing: { x: number } }>
 * ```
 *
 * @category Error Messages
 */
// dprint-ignore
export type StaticErrorAssertion<
  $Message extends string = string,
  $Expected = unknown,
  $Actual = unknown,
  $Meta extends string | readonly string[] | Record<string, any> = never,
  ___$ErrorKeyLength extends number = KitLibrarySettings.Ts.Assert.Settings['errorKeyLength']
> =
  // Check what kind of $Meta we have
  [$Meta] extends [never]
    ? // No meta - just error, expected, actual
      {
        [k in keyof { ERROR: $Message; expected: $Expected; actual: $Actual } as k extends string ? Str.PadEnd<k, ___$ErrorKeyLength, '_'> : k]:
          { ERROR: $Message; expected: $Expected; actual: $Actual }[k]
      }
    : [$Meta] extends [string]
      ? // String tip - render as { tip: $Meta }
        Simplify<{
          [k in keyof ({ ERROR: $Message; expected: $Expected; actual: $Actual } & { tip: $Meta }) as k extends string ? Str.PadEnd<k, ___$ErrorKeyLength, '_'> : k]:
            ({ ERROR: $Message; expected: $Expected; actual: $Actual } & { tip: $Meta })[k]
        }>
      : [$Meta] extends [readonly string[]]
        ? // Tuple of tips - render as { tip_a, tip_b, ... }
          Simplify<{
            [k in keyof ({ ERROR: $Message; expected: $Expected; actual: $Actual } & TupleToTips<$Meta>) as k extends string ? Str.PadEnd<k, ___$ErrorKeyLength, '_'> : k]:
              ({ ERROR: $Message; expected: $Expected; actual: $Actual } & TupleToTips<$Meta>)[k]
          }>
        : // Object - spread $Meta directly
          Simplify<{
            [k in keyof ({ ERROR: $Message; expected: $Expected; actual: $Actual } & $Meta) as k extends string ? Str.PadEnd<k, ___$ErrorKeyLength, '_'> : k]:
              ({ ERROR: $Message; expected: $Expected; actual: $Actual } & $Meta)[k]
          }>

/**
 * Align object keys by padding with a character to configured length.
 *
 * Test-specific wrapper around {@link Obj.AlignKeys} that uses the `errorKeyLength`
 * setting from global test configuration. Ensures consistent alignment of error
 * message keys in IDE displays.
 *
 * @template $T - The type whose keys should be aligned
 * @template $Pad - The character to use for padding (defaults to '_')
 *
 * @example
 * ```ts
 * // With errorKeyLength: 12, default padding
 * type Input = { MESSAGE: string, EXPECTED: number }
 * type Output = AlignKeys<Input>
 * // { MESSAGE_____: string, EXPECTED____: number }
 *
 * // Custom padding character
 * type Output2 = AlignKeys<Input, '.'>
 * // { MESSAGE.....: string, EXPECTED....: number }
 * ```
 *
 * @see {@link Obj.AlignKeys} for the general-purpose version
 */
export type AlignKeys<$T, $Pad extends string = '_'> = Obj.AlignKeys<
  $T,
  KitLibrarySettings.Ts.Assert.Settings['errorKeyLength'],
  $Pad
>

/**
 * Smart type expansion for error displays.
 *
 * Expands user-defined types while preserving built-in primitives and registered types.
 * Prevents error messages from expanding types like `Array`, `Promise`, `Record` into
 * their raw structural definitions.
 *
 * Preserved types:
 * - All primitives (string, number, boolean, etc.)
 * - Built-in generics (Array, Promise, Record, etc.)
 * - Types registered in {@link KitLibrarySettings.Ts.Assert.PreserveTypes}
 *
 * @template $T - The type to selectively expand
 *
 * @example
 * ```ts
 * type Custom = { x: number }
 * type A = DisplaySimplify<Custom>  // { x: number } - expands custom types
 * type B = DisplaySimplify<Array<number>>  // number[] - preserves built-in
 * type C = DisplaySimplify<Promise<string>>  // Promise<string> - preserves built-in
 * ```
 */
// dprint-ignore
export type DisplaySimplify<$T> =
  $T extends KitLibrarySettings.Ts.Assert.GetPreservedTypes<KitLibrarySettings.Ts.Assert.PreserveTypes> ? $T
  : $T extends Lang.BuiltInTypes ? $T
  : $T extends object
    ? { [k in keyof $T]: DisplaySimplify<$T[k]> }
    : $T

/**
 * Convert a tuple of tip strings into lettered tip fields.
 *
 * Transforms `[string, string, ...]` into `{ tip_a: string, tip_b: string, ... }`.
 * Used to display multiple tips in error messages with alphabetic labels.
 *
 * @template $Tips - Readonly array of tip strings
 *
 * @example
 * ```ts
 * type T1 = TupleToTips<['First tip', 'Second tip']>
 * // { tip_a: 'First tip', tip_b: 'Second tip' }
 *
 * type T2 = TupleToTips<['Only one']>
 * // { tip_a: 'Only one' }
 * ```
 */
export type TupleToTips<$Tips extends readonly string[]> = {
  [i in keyof $Tips as i extends `${infer __n__ extends number}` ? `tip_${Str.Char.LettersLower[__n__]}` : never]:
    $Tips[i]
}

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

/**
 * Compute structured diff between Expected and Actual object types.
 *
 * Returns a flat object with `diff_` prefixed fields:
 * - `diff_missing` - Properties in Expected but not in Actual (only if non-empty)
 * - `diff_excess` - Properties in Actual but not in Expected (only if non-empty)
 * - `diff_mismatch` - Properties in both but with different types (only if non-empty)
 *
 * Empty diff fields are completely omitted from the result.
 * If either type is not an object, returns an empty object (no diff).
 *
 * @internal
 */
// dprint-ignore
type DiffFields<$Expected extends object, $Actual extends object> = {
  diff_missing: DisplaySimplify<A.Compute<Obj.ExcludeKeys<$Expected, Obj.SharedKeys<$Expected, $Actual>>>>
  diff_excess: DisplaySimplify<A.Compute<Obj.ExcludeKeys<$Actual, Obj.SharedKeys<$Expected, $Actual>>>>
  diff_mismatch: DisplaySimplify<A.Compute<Obj.OmitNever<Obj.Mismatched<$Expected, $Actual>>>>
}

// dprint-ignore
export type ComputeDiff<$Expected, $Actual> =
  $Expected extends object
    ? $Actual extends object
      ? {
          [k in keyof DiffFields<$Expected, $Actual> as Obj.IsEmpty<DiffFields<$Expected, $Actual>[k]> extends true ? never : k]: DiffFields<$Expected, $Actual>[k]
        }
      : {}
    : {}
