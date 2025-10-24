import { Str } from '#str'
import type { Ts } from '#ts'
import { ParseResult, Schema as S } from 'effect'

// ============================================================================
// Analysis Result Types
// ============================================================================

/**
 * Analysis result for a CLI argument token.
 *
 * Discriminated union representing different types of CLI arguments:
 * - Long flags: `--verbose`, `--count=5`
 * - Short flags: `-v`, `-n=10`
 * - Positional arguments: `file.txt`, `123`
 * - Separator: `--`
 */
export type Analysis =
  | AnalysisLongFlag
  | AnalysisShortFlag
  | AnalysisPositional
  | AnalysisSeparator

/**
 * Long flag analysis (starts with `--`).
 */
export interface AnalysisLongFlag {
  _tag: 'long-flag'
  /** Flag name in camelCase, without dashes (e.g., "fooBar" from "--foo-bar") */
  name: string
  /** Value from equals syntax, or null if no value (e.g., "5" from "--count=5") */
  value: string | null
  /** Original input string */
  original: string
}

/**
 * Short flag analysis (starts with `-` but not `--`).
 */
export interface AnalysisShortFlag {
  _tag: 'short-flag'
  /** Flag name - single character (e.g., "v" from "-v") */
  name: string
  /** Value from equals syntax, or null if no value (e.g., "5" from "-v=5") */
  value: string | null
  /** Original input string */
  original: string
}

/**
 * Positional argument analysis (doesn't start with `-`).
 */
export interface AnalysisPositional {
  _tag: 'positional'
  /** The positional argument value */
  value: string
  /** Original input string (same as value) */
  original: string
}

/**
 * Separator analysis (exactly `--`).
 *
 * Used to separate flags from positional arguments.
 * Everything after `--` should be treated as positional, even if it looks like a flag.
 */
export interface AnalysisSeparator {
  _tag: 'separator'
  /** Always "--" */
  original: '--'
}

// ============================================================================
// Runtime Analyzer
// ============================================================================

/**
 * Analyze a single CLI argument token into its structural components.
 *
 * This is a pure syntax parser - it only understands the structure of ONE argument.
 * It does NOT:
 * - Handle arrays of arguments (use Line Parser for that)
 * - Expand clustered short flags like `-abc` (use Line Parser for that)
 * - Validate against a schema (use Layer 2 validator for that)
 *
 * @param input - A single CLI argument string
 * @returns Analyzed token structure
 *
 * @example
 * ```typescript
 * analyze('--verbose')
 * // { _tag: 'long-flag', name: 'verbose', value: null, original: '--verbose' }
 *
 * analyze('--count=5')
 * // { _tag: 'long-flag', name: 'count', value: '5', original: '--count=5' }
 *
 * analyze('-v')
 * // { _tag: 'short-flag', name: 'v', value: null, original: '-v' }
 *
 * analyze('-n=10')
 * // { _tag: 'short-flag', name: 'n', value: '10', original: '-n=10' }
 *
 * analyze('file.txt')
 * // { _tag: 'positional', value: 'file.txt', original: 'file.txt' }
 *
 * analyze('--')
 * // { _tag: 'separator', original: '--' }
 *
 * analyze('--foo-bar')
 * // { _tag: 'long-flag', name: 'fooBar', value: null, original: '--foo-bar' }
 * ```
 */
export function analyze<const input extends string>(input: input): Arg.Analyze<input> {
  return analyze_(input) as Arg.Analyze<input>
}

/**
 * Internal runtime analyzer implementation.
 */
export function analyze_(input: string): Analysis {
  // Separator: exactly "--"
  if (input === '--') {
    return {
      _tag: 'separator',
      original: '--',
    }
  }

  // Long flag: starts with "--"
  if (input.startsWith('--')) {
    const withoutPrefix = input.slice(2)

    // Guard: If it starts with another dash, it's malformed (handled as positional)
    if (withoutPrefix.startsWith('-')) {
      return {
        _tag: 'positional',
        value: input,
        original: input,
      }
    }

    const [rawName, ...valueParts] = withoutPrefix.split('=')
    const name = Str.Case.camel(rawName ?? '')
    const value = valueParts.length > 0 ? valueParts.join('=') : null

    return {
      _tag: 'long-flag',
      name,
      value,
      original: input,
    }
  }

  // Short flag: starts with "-" (but not "--")
  if (input.startsWith('-')) {
    const withoutPrefix = input.slice(1)

    // Guard: If it starts with another dash, it's malformed (handled as positional)
    if (withoutPrefix.startsWith('-')) {
      return {
        _tag: 'positional',
        value: input,
        original: input,
      }
    }

    const [rawName, ...valueParts] = withoutPrefix.split('=')
    const name = rawName ?? '' // Short flags are already single char, no case conversion needed
    const value = valueParts.length > 0 ? valueParts.join('=') : null

    return {
      _tag: 'short-flag',
      name,
      value,
      original: input,
    }
  }

  // Positional: doesn't match any flag pattern
  return {
    _tag: 'positional',
    value: input,
    original: input,
  }
}

// ============================================================================
// Effect Schema Class
// ============================================================================

/**
 * CLI argument token with structural analysis.
 *
 * Represents a parsed and analyzed CLI argument with:
 * - Tag indicating type (long-flag, short-flag, positional, separator)
 * - Name (for flags)
 * - Value (for flags with equals syntax)
 * - Original input string
 *
 * This is a pure structural parser - it only understands syntax.
 * It does NOT validate against schemas or handle semantic concerns.
 *
 * @example
 * ```typescript
 * // Create from string
 * const arg1 = Arg.fromString('--verbose')
 * // { _tag: 'long-flag', name: 'verbose', value: null, original: '--verbose' }
 *
 * const arg2 = Arg.fromString('--count=5')
 * // { _tag: 'long-flag', name: 'count', value: '5', original: '--count=5' }
 *
 * const arg3 = Arg.fromString('-v')
 * // { _tag: 'short-flag', name: 'v', value: null, original: '-v' }
 *
 * const arg4 = Arg.fromString('file.txt')
 * // { _tag: 'positional', value: 'file.txt', original: 'file.txt' }
 *
 * // Type-level analysis with validation
 * type Valid = Arg.Analyze<'--foo-bar'>
 * // { _tag: 'long-flag', name: 'fooBar', value: null, original: '--foo-bar' }
 * ```
 */
export class Arg extends S.Class<Arg>('Arg')({
  _tag: S.Literal('long-flag', 'short-flag', 'positional', 'separator'),
  name: S.optional(S.String),
  value: S.NullOr(S.String),
  original: S.String,
}) {
  /**
   * Schema for parsing from/encoding to string representation.
   * Use this when you need to accept string argument expressions.
   *
   * @example
   * ```typescript
   * const ConfigSchema = S.Struct({
   *   arg: Arg.String
   * })
   * ```
   */
  static String = S.transformOrFail(
    S.String,
    Arg,
    {
      strict: true,
      decode: (input, _options, _ast) => {
        // Use runtime analyzer to parse the argument
        const analysis = analyze(input)

        // Transform analysis result into Arg format
        switch (analysis._tag) {
          case 'long-flag':
            return ParseResult.succeed(
              new Arg({
                _tag: 'long-flag',
                name: analysis.name,
                value: analysis.value,
                original: analysis.original,
              }),
            )

          case 'short-flag':
            return ParseResult.succeed(
              new Arg({
                _tag: 'short-flag',
                name: analysis.name,
                value: analysis.value,
                original: analysis.original,
              }),
            )

          case 'positional':
            return ParseResult.succeed(
              new Arg({
                _tag: 'positional',
                value: analysis.value,
                original: analysis.original,
              }),
            )

          case 'separator':
            return ParseResult.succeed(
              new Arg({
                _tag: 'separator',
                value: null,
                original: analysis.original,
              }),
            )
        }
      },
      encode: (decoded) => {
        // Encode back to original string
        return ParseResult.succeed(decoded.original)
      },
    },
  )

  /**
   * Create a typed Arg from a literal string with compile-time analysis.
   *
   * This function requires a literal string at compile time to provide
   * type-safe parsing. The return type is automatically analyzed and structured
   * based on the input string.
   *
   * For runtime strings (non-literals), use `decodeSync` instead.
   *
   * @param input - A literal string argument expression
   * @returns Arg instance with inferred type structure
   *
   * @example
   * ```typescript
   * const arg1 = Arg.fromString('--verbose')
   * // Type: { _tag: 'long-flag', name: 'verbose', value: null, ... }
   *
   * const arg2 = Arg.fromString('--count=5')
   * // Type: { _tag: 'long-flag', name: 'count', value: '5', ... }
   *
   * const arg3 = Arg.fromString('-v')
   * // Type: { _tag: 'short-flag', name: 'v', value: null, ... }
   *
   * // This will cause a type error:
   * const expr: string = getExpression()
   * const arg = Arg.fromString(expr)  // Error: string not assignable
   * // Use this instead: Arg.decodeSync(expr)
   * ```
   */
  static fromString = <const $input extends string>(
    $input: Arg.Analyze<$input> extends string ? Ts.Err.StaticError<Arg.Analyze<$input>>
      : $input,
  ) => {
    return S.decodeSync(Arg.String)($input as any) as any
  }

  /**
   * Runtime analyzer function.
   * @see {@link analyze}
   */
  static analyze = analyze
}

/**
 * Type-level utilities for Arg.
 */
export namespace Arg {
  // ==========================================================================
  // Helper Types (Internal)
  // ==========================================================================

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

  // ==========================================================================
  // Analysis Result Types (Type-Level)
  // ==========================================================================

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

  // ==========================================================================
  // Main Type-Level Analyzer
  // ==========================================================================

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

  // ==========================================================================
  // Utility Type Exports
  // ==========================================================================

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
}
