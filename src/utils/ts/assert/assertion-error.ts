import type { Str } from '#str'
import type { Ts } from '#ts'
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

/**
 * Renders an assertion error based on the `renderErrors` setting.
 *
 * When `renderErrors` is `true` (default), returns the full error object.
 * When `false`, extracts just the error message string for cleaner IDE hovers.
 *
 * Uses the generic {@link KitLibrarySettings.Ts.Error.Settings.renderErrors} setting.
 *
 * @template $Error - The full StaticErrorAssertion object or error type
 *
 * @example
 * ```ts
 * // With renderErrors: true (default)
 * type E = RenderAssertionError<StaticErrorAssertion<'msg', string, number>>
 * // { ERROR_________: 'msg', expected______: string, actual________: number }
 *
 * // With renderErrors: false
 * type E = RenderAssertionError<StaticErrorAssertion<'msg', string, number>>
 * // 'msg'
 * ```
 */
// dprint-ignore
export type RenderAssertionError<$Error extends Ts.Error> =
  KitLibrarySettings.Ts.Error.Settings['renderErrors'] extends false
    ? $Error['ERROR_________']
    : $Error

/**
 * Represents a static assertion error at the type level, optimized for type testing.
 *
 * This is a simpler, more focused error type compared to {@link Ts.StaticError}. It's specifically
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
 * @category Utils
 */
// dprint-ignore
export type StaticErrorAssertion<
  $Message extends string = string,
  $Expected = unknown,
  $Actual = unknown,
  $Meta extends string | readonly string[] | Record<string, any> = never,
  ___$ErrorKeyLength extends number = KitLibrarySettings.Ts.Error.Settings['errorKeyLength']
> =
  // Check what kind of $Meta we have
  // All variants naturally extend Ts.Error through the ERROR_________ field
  [$Meta] extends [never]
    ? // No meta - just error, expected, actual
      {
        [k in keyof { ERROR: $Message; expected: $Expected; actual: $Actual } as k extends string
          ? Str.PadEnd<k, ___$ErrorKeyLength, '_'>
          : k]: { ERROR: $Message; expected: $Expected; actual: $Actual }[k]
      }
    : [$Meta] extends [string]
      ? // String tip - render as { tip: $Meta }
        Simplify<{
          [k in keyof ({ ERROR: $Message; expected: $Expected; actual: $Actual } & { tip: $Meta }) as k extends string
            ? Str.PadEnd<k, ___$ErrorKeyLength, '_'>
            : k]: ({ ERROR: $Message; expected: $Expected; actual: $Actual } & { tip: $Meta })[k]
        }>
      : [$Meta] extends [readonly string[]]
        ? // Tuple of tips - render as { tip_a, tip_b, ... }
          Simplify<{
            [k in keyof ({ ERROR: $Message; expected: $Expected; actual: $Actual } & Ts.ErrorDisplay.TupleToLettered<$Meta>) as k extends string
              ? Str.PadEnd<k, ___$ErrorKeyLength, '_'>
              : k]: ({ ERROR: $Message; expected: $Expected; actual: $Actual } & Ts.ErrorDisplay.TupleToLettered<$Meta>)[k]
          }>
        : // Object - spread $Meta directly
          Simplify<{
            [k in keyof ({ ERROR: $Message; expected: $Expected; actual: $Actual } & $Meta) as k extends string
              ? Str.PadEnd<k, ___$ErrorKeyLength, '_'>
              : k]: ({ ERROR: $Message; expected: $Expected; actual: $Actual } & $Meta)[k]
          }>
