import type { Analysis } from './analyzer.js'

/**
 * Type-level analyzer for CLI argument tokens.
 *
 * Mirrors the runtime analyzer logic for compile-time argument analysis.
 * Determines the type of argument (long flag, short flag, positional, separator)
 * and extracts metadata at the type level.
 */

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Convert a string type to camelCase.
 *
 * Handles:
 * - kebab-case → camelCase
 * - snake_case → camelCase
 * - Already camelCase → unchanged
 */
type CamelCase<$S extends string> = $S extends `${infer __first__}-${infer __rest__}`
  ? `${__first__}${Capitalize<CamelCase<__rest__>>}`
  : $S extends `${infer __first__}_${infer __rest__}` ? `${__first__}${Capitalize<CamelCase<__rest__>>}`
  : $S

/**
 * Split a string on "=" and extract name and value.
 * Returns tuple: [name, value | null]
 */
type SplitOnEquals<$S extends string> = $S extends `${infer __name__}=${infer __value__}` ? [__name__, __value__]
  : [$S, null]

// ============================================================================
// Analysis Result Types (matching runtime)
// ============================================================================

/**
 * Long flag analysis type.
 * @param $stripped - The flag without the `--` prefix
 * @param $original - The original input (with `--` prefix)
 */
export type AnalysisLongFlag<
  $stripped extends string = string,
  $original extends string = $stripped,
> = {
  _tag: 'long-flag'
  name: CamelCase<SplitOnEquals<$stripped>[0]>
  value: SplitOnEquals<$stripped>[1]
  original: $original
}

/**
 * Short flag analysis type.
 * @param $stripped - The flag without the `-` prefix
 * @param $original - The original input (with `-` prefix)
 */
export type AnalysisShortFlag<
  $stripped extends string = string,
  $original extends string = $stripped,
> = {
  _tag: 'short-flag'
  name: SplitOnEquals<$stripped>[0]
  value: SplitOnEquals<$stripped>[1]
  original: $original
}

/**
 * Positional argument analysis type.
 */
export type AnalysisPositional<$S extends string = string> = {
  _tag: 'positional'
  value: $S
  original: $S
}

/**
 * Separator analysis type.
 */
export type AnalysisSeparator = {
  _tag: 'separator'
  original: '--'
}

// ============================================================================
// Main Analyzer
// ============================================================================

/**
 * Type-level analyzer that mirrors runtime analyze() function.
 *
 * Determines the structure of a CLI argument token at compile time.
 * Falls back to Analysis union when given non-literal string type.
 *
 * @example
 * ```typescript
 * type A = Analyze<'--verbose'>
 * // { _tag: 'long-flag', name: 'verbose', value: null, original: '--verbose' }
 *
 * type B = Analyze<'--count=5'>
 * // { _tag: 'long-flag', name: 'count', value: '5', original: '--count=5' }
 *
 * type C = Analyze<'-v'>
 * // { _tag: 'short-flag', name: 'v', value: null, original: '-v' }
 *
 * type D = Analyze<'file.txt'>
 * // { _tag: 'positional', value: 'file.txt', original: 'file.txt' }
 *
 * type E = Analyze<'--'>
 * // { _tag: 'separator', original: '--' }
 *
 * type F = Analyze<'--foo-bar'>
 * // { _tag: 'long-flag', name: 'fooBar', value: null, original: '--foo-bar' }
 * ```
 */
export type Analyze<$S extends string> =
  // Non-literal string fallback
  string extends $S ? Analysis
    // Separator: exactly "--"
    : $S extends '--' ? AnalysisSeparator
    // Long flag: starts with "--" (but not "---")
    : $S extends `--${infer __rest__}` ? __rest__ extends `-${string}` ? AnalysisPositional<$S> // Malformed: "---something"
      : AnalysisLongFlag<__rest__, $S>
    // Short flag: starts with "-" (but not "--")
    : $S extends `-${infer __rest__}` ? __rest__ extends `-${string}` ? AnalysisPositional<$S> // Malformed: "---something" (caught above, but defensive)
      : AnalysisShortFlag<__rest__, $S>
    // Positional: doesn't match any flag pattern
    : AnalysisPositional<$S>

// ============================================================================
// Utility Type Exports
// ============================================================================

/**
 * Extract just the tag from analysis result.
 */
export type AnalyzeTag<$S extends string> = Analyze<$S>['_tag']

/**
 * Check if argument would be analyzed as a long flag.
 */
export type IsLongFlag<$S extends string> = AnalyzeTag<$S> extends 'long-flag' ? true : false

/**
 * Check if argument would be analyzed as a short flag.
 */
export type IsShortFlag<$S extends string> = AnalyzeTag<$S> extends 'short-flag' ? true : false

/**
 * Check if argument would be analyzed as positional.
 */
export type IsPositional<$S extends string> = AnalyzeTag<$S> extends 'positional' ? true : false

/**
 * Check if argument would be analyzed as separator.
 */
export type IsSeparator<$S extends string> = AnalyzeTag<$S> extends 'separator' ? true : false

/**
 * Check if argument would be analyzed as any kind of flag (long or short).
 */
export type IsFlag<$S extends string> = AnalyzeTag<$S> extends 'long-flag' | 'short-flag' ? true : false
