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
 * - Short flag clusters: `-abc` (expands to `-a`, `-b`, `-c`)
 * - Positional arguments: `file.txt`, `123`
 * - Separator: `--`
 */
export type Analysis =
  | AnalysisLongFlag
  | AnalysisShortFlag
  | AnalysisShortFlagCluster
  | AnalysisPositional
  | AnalysisSeparator

/**
 * Long flag analysis (starts with `--`).
 *
 * Generic interface that extends the Effect Schema class to preserve literal types
 * for type-level analysis while maintaining structural compatibility.
 */
export interface AnalysisLongFlagLiteral<
  $Name extends string = string,
  $Negated extends boolean = boolean,
  $Value extends string | null = string | null,
  $Original extends string = string,
> extends ArgLongFlag {
  /**
   * Flag name in camelCase, without dashes and without negation prefix.
   *
   * @example
   * - `"--foo-bar"` → `"fooBar"`
   * - `"--no-verbose"` → `"verbose"` (negation prefix stripped)
   */
  name: $Name
  /**
   * Whether this flag has a negation prefix (`--no-*` pattern).
   *
   * @example
   * - `"--verbose"` → `false`
   * - `"--no-verbose"` → `true`
   */
  negated: $Negated
  /** Value from equals syntax, or null if no value (e.g., "5" from "--count=5") */
  value: $Value
  /** Original input string */
  original: $Original
}

/**
 * Long flag analysis with widened types (for runtime use).
 */
export type AnalysisLongFlag = AnalysisLongFlagLiteral

/**
 * Short flag analysis (starts with `-` but not `--`).
 *
 * Generic interface that extends the Effect Schema class to preserve literal types.
 */
export interface AnalysisShortFlagLiteral<
  $Name extends string = string,
  $Value extends string | null = string | null,
  $Original extends string = string,
> extends ArgShortFlag {
  /** Flag name - single character (e.g., "v" from "-v") */
  name: $Name
  /** Value from equals syntax, or null if no value (e.g., "5" from "-v=5") */
  value: $Value
  /** Original input string */
  original: $Original
}

/**
 * Short flag analysis with widened types (for runtime use).
 */
export type AnalysisShortFlag = AnalysisShortFlagLiteral

/**
 * Short flag cluster analysis (multi-character short flag like `-abc`).
 *
 * Generic interface that extends the Effect Schema class to preserve literal types.
 * Represents clustered short flags where the last flag receives any value.
 *
 * @example
 * ```typescript
 * // analyze('-abc')
 * {
 *   _tag: 'short-flag-cluster',
 *   additionalShortFlagNames: ['a', 'b'],
 *   shortFlag: { _tag: 'short-flag', name: 'c', value: null, original: '-c' },
 *   original: '-abc'
 * }
 * ```
 */
export interface AnalysisShortFlagClusterLiteral<
  $AdditionalNames extends string[] = string[],
  $ShortFlag extends AnalysisShortFlagLiteral = AnalysisShortFlagLiteral,
  $Original extends string = string,
> extends ArgShortFlagCluster {
  /** Names of all flags except the last (minimum 1) */
  additionalShortFlagNames: $AdditionalNames
  /** The last flag in the cluster (receives any value) */
  shortFlag: $ShortFlag
  /** Original input string */
  original: $Original
}

/**
 * Short flag cluster analysis with widened types (for runtime use).
 */
export type AnalysisShortFlagCluster = AnalysisShortFlagClusterLiteral

/**
 * Positional argument analysis (doesn't start with `-`).
 *
 * Generic interface that extends the Effect Schema class to preserve literal types.
 */
export interface AnalysisPositionalLiteral<
  $Value extends string = string,
  $Original extends string = string,
> extends ArgPositional {
  /** The positional argument value */
  value: $Value
  /** Original input string (same as value) */
  original: $Original
}

/**
 * Positional argument analysis with widened types (for runtime use).
 */
export type AnalysisPositional = AnalysisPositionalLiteral

/**
 * Separator analysis (exactly `--`).
 *
 * Used to separate flags from positional arguments.
 * Everything after `--` should be treated as positional, even if it looks like a flag.
 *
 * Generic interface that extends the Effect Schema class.
 */
export interface AnalysisSeparatorLiteral extends ArgSeparator {
  value: null
  /** Always "--" */
  original: '--'
}

/**
 * Separator analysis (for runtime use).
 */
export type AnalysisSeparator = AnalysisSeparatorLiteral

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
 * // { _tag: 'long-flag', name: 'verbose', negated: false, value: null, original: '--verbose' }
 *
 * analyze('--no-verbose')
 * // { _tag: 'long-flag', name: 'verbose', negated: true, value: null, original: '--no-verbose' }
 *
 * analyze('--count=5')
 * // { _tag: 'long-flag', name: 'count', negated: false, value: '5', original: '--count=5' }
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
 * // { _tag: 'long-flag', name: 'fooBar', negated: false, value: null, original: '--foo-bar' }
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
      value: null,
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
    const camelName = Str.Case.camel(rawName ?? '')
    const value = valueParts.length > 0 ? valueParts.join('=') : null

    // Detect negation prefix pattern: /^no([A-Z])/
    const negationMatch = /^no([A-Z])/.exec(camelName)
    const negated = negationMatch !== null
    const name = negated
      ? camelName.charAt(2).toLowerCase() + camelName.slice(3) // Strip 'no' prefix and lowercase first char
      : camelName

    return {
      _tag: 'long-flag',
      name,
      negated,
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
    const name = rawName ?? ''
    const value = valueParts.length > 0 ? valueParts.join('=') : null

    // Cluster expansion: multi-character short flag (e.g., "-abc")
    if (name.length > 1) {
      const chars = name.split('')
      const lastChar = chars[chars.length - 1]!
      const additionalChars = chars.slice(0, -1)

      return {
        _tag: 'short-flag-cluster',
        additionalShortFlagNames: additionalChars,
        shortFlag: {
          _tag: 'short-flag',
          name: lastChar,
          value,
          original: value !== null ? `-${lastChar}=${value}` : `-${lastChar}`,
        },
        original: input,
      }
    }

    // Single character short flag
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
// Effect Schema Definitions
// ============================================================================

/**
 * Schema for long flag argument (`--verbose`, `--count=5`).
 */
export class ArgLongFlag extends S.TaggedClass<ArgLongFlag>()('long-flag', {
  name: S.String,
  negated: S.Boolean,
  value: S.NullOr(S.String),
  original: S.String,
}) {
  static is = S.is(ArgLongFlag)
}

/**
 * Schema for short flag argument (`-v`, `-n=10`).
 */
export class ArgShortFlag extends S.TaggedClass<ArgShortFlag>()('short-flag', {
  name: S.String,
  value: S.NullOr(S.String),
  original: S.String,
}) {
  static is = S.is(ArgShortFlag)
}

/**
 * Schema for short flag cluster argument (`-abc`, `-xyz=value`).
 *
 * Represents a multi-character short flag that expands into individual flags.
 */
export class ArgShortFlagCluster extends S.TaggedClass<ArgShortFlagCluster>()('short-flag-cluster', {
  shortFlag: ArgShortFlag,
  additionalShortFlagNames: S.Array(S.String),
  original: S.String,
}) {
  static is = S.is(ArgShortFlagCluster)
}

/**
 * Schema for positional argument (`file.txt`, `123`).
 */
export class ArgPositional extends S.TaggedClass<ArgPositional>()('positional', {
  value: S.String,
  original: S.String,
}) {
  static is = S.is(ArgPositional)
}

/**
 * Schema for separator argument (`--`).
 */
export class ArgSeparator extends S.TaggedClass<ArgSeparator>()('separator', {
  value: S.Null,
  original: S.Literal('--'),
}) {
  static is = S.is(ArgSeparator)
}

const _ArgSchema = S.Union(ArgLongFlag, ArgShortFlag, ArgShortFlagCluster, ArgPositional, ArgSeparator)

const ArgNamespace = {
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
  String: S.transformOrFail(
    S.String,
    _ArgSchema,
    {
      strict: true,
      decode: (input, _options, _ast) => {
        // Use runtime analyzer to parse the argument
        const analysis = analyze_(input)

        // Transform analysis result into Arg format
        switch (analysis._tag) {
          case 'long-flag':
            return ParseResult.succeed(
              new ArgLongFlag({
                name: analysis.name,
                negated: analysis.negated,
                value: analysis.value,
                original: analysis.original,
              }),
            )

          case 'short-flag':
            return ParseResult.succeed(
              new ArgShortFlag({
                name: analysis.name,
                value: analysis.value,
                original: analysis.original,
              }),
            )

          case 'short-flag-cluster':
            return ParseResult.succeed(
              new ArgShortFlagCluster({
                additionalShortFlagNames: analysis.additionalShortFlagNames,
                shortFlag: new ArgShortFlag({
                  name: analysis.shortFlag.name,
                  value: analysis.shortFlag.value,
                  original: analysis.shortFlag.original,
                }),
                original: analysis.original,
              }),
            )

          case 'positional':
            return ParseResult.succeed(
              new ArgPositional({
                value: analysis.value,
                original: analysis.original,
              }),
            )

          case 'separator':
            return ParseResult.succeed(
              new ArgSeparator({
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
  ) as any,

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
   * // Type: { _tag: 'long-flag', name: 'verbose', negated: false, value: null, ... }
   *
   * const arg2 = Arg.fromString('--no-verbose')
   * // Type: { _tag: 'long-flag', name: 'verbose', negated: true, value: null, ... }
   *
   * const arg3 = Arg.fromString('--count=5')
   * // Type: { _tag: 'long-flag', name: 'count', negated: false, value: '5', ... }
   *
   * const arg4 = Arg.fromString('-v')
   * // Type: { _tag: 'short-flag', name: 'v', value: null, ... }
   *
   * // This will cause a type error:
   * const expr: string = getExpression()
   * const arg = Arg.fromString(expr)  // Error: string not assignable
   * // Use this instead: Arg.decodeSync(expr)
   * ```
   */
  fromString: <const $input extends string>(
    $input: Arg.Analyze<$input> extends string ? Ts.Err.StaticError<Arg.Analyze<$input>>
      : $input,
  ): Arg.Analyze<$input> => {
    return S.decodeSync(ArgNamespace.String)($input as any) as any
  },

  /**
   * Runtime analyzer function.
   * @see {@link analyze}
   */
  analyze: analyze_,
}

/**
 * CLI argument token with structural analysis.
 *
 * Represents a parsed and analyzed CLI argument with:
 * - Tag indicating type (long-flag, short-flag, positional, separator)
 * - Name (for flags)
 * - Negation status (for long flags with --no-* pattern)
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
 * // { _tag: 'long-flag', name: 'verbose', negated: false, value: null, original: '--verbose' }
 *
 * const arg2 = Arg.fromString('--no-verbose')
 * // { _tag: 'long-flag', name: 'verbose', negated: true, value: null, original: '--no-verbose' }
 *
 * const arg3 = Arg.fromString('--count=5')
 * // { _tag: 'long-flag', name: 'count', negated: false, value: '5', original: '--count=5' }
 *
 * const arg4 = Arg.fromString('-v')
 * // { _tag: 'short-flag', name: 'v', value: null, original: '-v' }
 *
 * const arg5 = Arg.fromString('file.txt')
 * // { _tag: 'positional', value: 'file.txt', original: 'file.txt' }
 *
 * // Type-level analysis (literal preservation)
 * type Valid = Arg.Analyze<'--foo-bar'>
 * // { _tag: 'long-flag', name: 'fooBar', negated: false, value: null, original: '--foo-bar' }
 * ```
 */
export const Arg: typeof _ArgSchema & typeof ArgNamespace = Object.assign(_ArgSchema, ArgNamespace)

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

  /**
   * Extract first character from a string.
   */
  type FirstChar<$S extends string> = $S extends `${infer __first__}${string}` ? __first__ : never

  /**
   * Detect negation prefix pattern in camelCase names.
   *
   * Pattern: `/^no([A-Z].+)/` - 'no' followed by a capital letter
   *
   * @example
   * ```typescript
   * type A = DetectNegation<'noVerbose'>
   * // { negated: true, baseName: 'verbose' }
   *
   * type B = DetectNegation<'verbose'>
   * // { negated: false, baseName: 'verbose' }
   *
   * type C = DetectNegation<'notice'>
   * // { negated: false, baseName: 'notice' } - lowercase after 'no'
   * ```
   */
  type DetectNegation<$Name extends string> = $Name extends `no${infer __rest__}`
    ? FirstChar<__rest__> extends Uppercase<FirstChar<__rest__>> ? { negated: true; baseName: Uncapitalize<__rest__> }
    : { negated: false; baseName: $Name }
    : { negated: false; baseName: $Name }

  /**
   * Split a string into an array of characters.
   *
   * @example
   * ```typescript
   * type A = SplitChars<'abc'>
   * // ['a', 'b', 'c']
   *
   * type B = SplitChars<'x'>
   * // ['x']
   * ```
   */
  type SplitChars<$S extends string> = $S extends `${infer __first__}${infer __rest__}`
    ? [__first__, ...SplitChars<__rest__>]
    : []

  /**
   * Split an array of characters into all-but-last (additionalNames) and last character.
   *
   * @example
   * ```typescript
   * type A = SplitLastChar<['a', 'b', 'c']>
   * // { additionalNames: ['a', 'b'], lastChar: 'c' }
   *
   * type B = SplitLastChar<['x', 'y']>
   * // { additionalNames: ['x'], lastChar: 'y' }
   * ```
   */
  type SplitLastChar<$chars extends [string, ...string[]]> = $chars extends
    [...infer __rest__ extends string[], infer __last__ extends string]
    ? { additionalNames: __rest__; lastChar: __last__ }
    : never

  // ==========================================================================
  // Analysis Result Types (Type-Level)
  // ==========================================================================


  // ==========================================================================
  // Main Type-Level Analyzer
  // ==========================================================================

  /**
   * Type-level analyzer that determines CLI argument structure at compile time.
   *
   * Preserves literal types for precise type-level parsing.
   * Falls back to Analysis union when given non-literal string type.
   *
   * @example
   * ```typescript
   * type A = Arg.Analyze<'--verbose'>
   * // { _tag: 'long-flag', name: 'verbose', negated: false, value: null, original: '--verbose' }
   *
   * type B = Arg.Analyze<'--count=5'>
   * // { _tag: 'long-flag', name: 'count', negated: false, value: '5', original: '--count=5' }
   *
   * type C = Arg.Analyze<'-v'>
   * // { _tag: 'short-flag', name: 'v', value: null, original: '-v' }
   *
   * type D = Arg.Analyze<'-abc'>
   * // { _tag: 'short-flag-cluster', additionalShortFlagNames: ['a', 'b'], ... }
   *
   * type E = Arg.Analyze<'file.txt'>
   * // { _tag: 'positional', value: 'file.txt', original: 'file.txt' }
   *
   * type F = Arg.Analyze<'--'>
   * // { _tag: 'separator', original: '--' }
   * ```
   */
  export type Analyze<$S extends string> =
    // Non-literal string fallback
    string extends $S ? Analysis
      // Separator: exactly "--"
      : $S extends '--' ? AnalysisSeparatorLiteral
      // Long flag: starts with "--" (but not "---")
      : $S extends `--${infer __rest__}` ? __rest__ extends `-${string}` ? AnalysisPositionalLiteral<$S, $S> // Malformed: "---something"
        : AnalysisLongFlagLiteral<
          DetectNegation<CamelCase<SplitOnEquals<__rest__>[0]>>['baseName'],
          DetectNegation<CamelCase<SplitOnEquals<__rest__>[0]>>['negated'],
          SplitOnEquals<__rest__>[1],
          $S
        >
      // Short flag or cluster: starts with "-" (but not "--")
      : $S extends `-${infer __rest__}` ? __rest__ extends `-${string}` ? AnalysisPositionalLiteral<$S, $S> // Malformed: "---something"
        : SplitOnEquals<__rest__>[0] extends `${string}${string}${infer ___}` // Multi-char (2+)
          ? SplitChars<SplitOnEquals<__rest__>[0]> extends infer __chars__ extends [string, string, ...string[]]
            ? SplitLastChar<__chars__> extends
              { additionalNames: infer __additional__ extends string[]; lastChar: infer __last__ extends string }
              ? AnalysisShortFlagClusterLiteral<
                __additional__,
                AnalysisShortFlagLiteral<
                  __last__,
                  SplitOnEquals<__rest__>[1],
                  SplitOnEquals<__rest__>[1] extends null ? `-${__last__}` : `-${__last__}=${SplitOnEquals<__rest__>[1]}`
                >,
                $S
              >
            : never
            : never
          : AnalysisShortFlagLiteral<
            SplitOnEquals<__rest__>[0],
            SplitOnEquals<__rest__>[1],
            $S
          >
      // Positional: doesn't match any flag pattern
      : AnalysisPositionalLiteral<$S, $S>

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
