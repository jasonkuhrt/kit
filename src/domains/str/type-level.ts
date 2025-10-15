/**
 * Type-level string utilities.
 *
 * Provides compile-time string manipulation and analysis types.
 */

import type { Ts } from '#ts'

/**
 * Check if a string ends with a specific suffix.
 * @category Type-Level Utilities
 */
export type EndsWith<S extends string, T extends string> = S extends `${string}${T}` ? true : false

/**
 * Check if a string starts with a specific prefix.
 * @category Type-Level Utilities
 */
export type StartsWith<S extends string, T extends string> = S extends `${T}${string}` ? true : false

/**
 * Extract the last segment from a path-like string (after the last '/').
 * @category Type-Level Utilities
 */
export type LastSegment<S extends string> = S extends `${string}/${infer Rest}` ? LastSegment<Rest>
  : S

/**
 * Remove trailing slash from a string.
 * @category Type-Level Utilities
 */
export type RemoveTrailingSlash<S extends string> = S extends `${infer Rest}/` ? Rest extends '' ? '/' : Rest
  : S

/**
 * Split a string by a delimiter, filtering out empty segments and '.' segments.
 * This is useful for path-like strings.
 * @category Type-Level Utilities
 */
export type Split<S extends string, D extends string, Acc extends string[] = []> = S extends '' ? Acc
  : S extends `${infer Segment}${D}${infer Rest}` ? Segment extends '' ? Split<Rest, D, Acc>
    : Segment extends '.' ? Split<Rest, D, Acc>
    : Split<Rest, D, [...Acc, Segment]>
  : S extends '.' ? Acc
  : [...Acc, S]

/**
 * Check if string contains a character.
 * @category Type-Level Utilities
 */
export type Contains<S extends string, C extends string> = S extends `${string}${C}${string}` ? true : false

/**
 * Constraint that only accepts literal strings.
 * Returns StaticError for non-literal string type with customizable error message.
 * @category Type-Level Utilities
 * @template T - The string type to check
 * @template $ErrorMessage - Custom error message to display when T is not a literal
 */
export type LiteralOnly<
  T extends string,
  $ErrorMessage extends string = 'Expected a literal string',
> = string extends T ? Ts.StaticError<
    $ErrorMessage,
    { ReceivedType: T },
    'Use a string literal instead of string type'
  >
  : T

/**
 * Get the length of a string type using tuple counting.
 *
 * Uses recursive template literal parsing with tuple accumulation to count characters.
 * Limited by TypeScript's recursion depth (typically ~50 levels).
 *
 * @category Type-Level Utilities
 * @template $S - The string to measure
 * @template $Acc - Accumulator tuple for counting (internal)
 *
 * @example
 * ```ts
 * type L1 = Str.Length<'hello'> // 5
 * type L2 = Str.Length<''> // 0
 * type L3 = Str.Length<'a'> // 1
 * ```
 */
export type Length<$S extends string, $Acc extends 0[] = []> = $S extends `${string}${infer __rest__}`
  ? Length<__rest__, [...$Acc, 0]>
  : $Acc['length']

/**
 * Pad a string to a target length by appending a fill character.
 *
 * If the string is already at or exceeds the target length, returns it unchanged.
 * Limited by TypeScript's recursion depth (~50 iterations).
 *
 * @category Type-Level Utilities
 * @template $S - The string to pad
 * @template $TargetLen - The desired final length
 * @template $Fill - The character to use for padding (default: '_')
 * @template $Acc - Accumulator for recursion depth tracking (internal)
 *
 * @example
 * ```ts
 * type P1 = Str.PadEnd<'foo', 10, '_'> // 'foo_______'
 * type P2 = Str.PadEnd<'hello', 3, '_'> // 'hello' (already longer)
 * type P3 = Str.PadEnd<'abc', 5, '0'> // 'abc00'
 * ```
 */
// dprint-ignore
export type PadEnd<
  $S extends string,
  $TargetLen extends number,
  $Fill extends string = '_',
  $Acc extends 0[] = [],
> = Length<$S> extends $TargetLen ? $S
  : $Acc['length'] extends 50 // Recursion limit safety
    ? $S
    : PadEnd<`${$S}${$Fill}`, $TargetLen, $Fill, [...$Acc, 0]>

/**
 * Pad a string to a target length by prepending a fill character.
 *
 * If the string is already at or exceeds the target length, returns it unchanged.
 * Limited by TypeScript's recursion depth (~50 iterations).
 *
 * @category Type-Level Utilities
 * @template $S - The string to pad
 * @template $TargetLen - The desired final length
 * @template $Fill - The character to use for padding (default: '0')
 * @template $Acc - Accumulator for recursion depth tracking (internal)
 *
 * @example
 * ```ts
 * type P1 = Str.PadStart<'42', 5, '0'> // '00042'
 * type P2 = Str.PadStart<'hello', 3, '0'> // 'hello' (already longer)
 * type P3 = Str.PadStart<'x', 3, ' '> // '  x'
 * ```
 */
// dprint-ignore
export type PadStart<
  $S extends string,
  $TargetLen extends number,
  $Fill extends string = '0',
  $Acc extends 0[] = [],
> = Length<$S> extends $TargetLen ? $S
  : $Acc['length'] extends 50 // Recursion limit safety
    ? $S
    : PadStart<`${$Fill}${$S}`, $TargetLen, $Fill, [...$Acc, 0]>
