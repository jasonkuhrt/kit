import type { Str } from '#str'
import type { Ts } from '#ts'

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
  // All variants naturally extend Ts.Err (detected by Ts.Err.Is) through the ERROR_________ field
  [$Meta] extends [never]
    ? // No meta - just error, expected, actual
      Ts.Simplify.Deep<{
        [k in keyof { ERROR: $Message; expected: $Expected; actual: $Actual } as k extends string
          ? Str.PadEnd<k, ___$ErrorKeyLength, '_'>
          : k]: { ERROR: $Message; expected: $Expected; actual: $Actual }[k]
      }>
    : [$Meta] extends [string]
      ? // String tip - render as { tip: $Meta }
        Ts.Simplify.Deep<{
          [k in keyof ({ ERROR: $Message; expected: $Expected; actual: $Actual } & { tip: $Meta }) as k extends string
            ? Str.PadEnd<k, ___$ErrorKeyLength, '_'>
            : k]: ({ ERROR: $Message; expected: $Expected; actual: $Actual } & { tip: $Meta })[k]
        }>
      : [$Meta] extends [readonly string[]]
        ? // Tuple of tips - render as { tip_a, tip_b, ... }
          Ts.Simplify.Deep<{
            [k in keyof ({ ERROR: $Message; expected: $Expected; actual: $Actual } & Ts.TupleToLettered<$Meta>) as k extends string
              ? Str.PadEnd<k, ___$ErrorKeyLength, '_'>
              : k]: ({ ERROR: $Message; expected: $Expected; actual: $Actual } & Ts.TupleToLettered<$Meta>)[k]
          }>
        : // Object - spread $Meta directly
          Ts.Simplify.Deep<{
            [k in keyof ({ ERROR: $Message; expected: $Expected; actual: $Actual } & $Meta) as k extends string
              ? Str.PadEnd<k, ___$ErrorKeyLength, '_'>
              : k]: ({ ERROR: $Message; expected: $Expected; actual: $Actual } & $Meta)[k]
          }>
