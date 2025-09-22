/**
 * Type-level string utilities.
 *
 * Provides compile-time string manipulation and analysis types.
 */

/**
 * Check if a string ends with a specific suffix.
 */
export type EndsWith<S extends string, T extends string> = S extends `${string}${T}` ? true : false

/**
 * Check if a string starts with a specific prefix.
 */
export type StartsWith<S extends string, T extends string> = S extends `${T}${string}` ? true : false

/**
 * Extract the last segment from a path-like string (after the last '/').
 */
export type LastSegment<S extends string> = S extends `${string}/${infer Rest}` ? LastSegment<Rest>
  : S

/**
 * Remove trailing slash from a string.
 */
export type RemoveTrailingSlash<S extends string> = S extends `${infer Rest}/` ? Rest extends '' ? '/' : Rest
  : S

/**
 * Split a string by a delimiter, filtering out empty segments and '.' segments.
 * This is useful for path-like strings.
 */
export type Split<S extends string, D extends string, Acc extends string[] = []> = S extends '' ? Acc
  : S extends `${infer Segment}${D}${infer Rest}` ? Segment extends '' ? Split<Rest, D, Acc>
    : Segment extends '.' ? Split<Rest, D, Acc>
    : Split<Rest, D, [...Acc, Segment]>
  : S extends '.' ? Acc
  : [...Acc, S]

/**
 * Check if string contains a character.
 */
export type Contains<S extends string, C extends string> = S extends `${string}${C}${string}` ? true : false

/**
 * Constraint that only accepts literal strings.
 * Returns never for non-literal string type.
 */
export type LiteralOnly<T extends string> = string extends T ? never : T
