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
