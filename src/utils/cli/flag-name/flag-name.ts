import type { Ts } from '#ts'
import { ParseResult, Schema as S } from 'effect'
import * as Analyzer from './analyzer.ts'

// ============================================================================
// Type-Level Utilities (Internal)
// ============================================================================

/**
 * Get the length of a string type.
 *
 * Uses recursive character counting since string literals don't have numeric length at type-level.
 */
type Length<$S extends string, $Acc extends any[] = []> = $S extends `${infer _First}${infer Rest}`
  ? Length<Rest, [...$Acc, any]>
  : $Acc['length']

/**
 * Convert a string type to camelCase.
 *
 * Handles:
 * - kebab-case → camelCase
 * - snake_case → camelCase
 * - Already camelCase → unchanged
 *
 * @example
 * ```typescript
 * type A = CamelCase<'foo-bar'>  // 'fooBar'
 * type B = CamelCase<'foo_bar'>  // 'fooBar'
 * type C = CamelCase<'fooBar'>   // 'fooBar'
 * ```
 */
type CamelCase<$S extends string> = $S extends `${infer First}-${infer Rest}` ? `${First}${Capitalize<CamelCase<Rest>>}`
  : $S extends `${infer First}_${infer Rest}` ? `${First}${Capitalize<CamelCase<Rest>>}`
  : $S

/**
 * Simplify an intersection type into a single object type.
 * Creates a clean object type from complex intersections.
 */
type Simplify<$T> = { [k in keyof $T]: $T[k] } & {}

/**
 * Update a nested object property by path.
 *
 * @example
 * ```typescript
 * type Obj = { a: { b: number } }
 * type Updated = Update<Obj, 'a.b', string>  // { a: { b: string } }
 * ```
 */
type Update<$Obj, $Path extends string, $Value> = $Path extends `${infer Key}.${infer Rest}`
  ? $Obj extends Record<any, any>
    ? Key extends keyof $Obj ? Simplify<Omit<$Obj, Key> & { [k in Key]: Update<$Obj[k], Rest, $Value> }>
    : $Obj
  : $Obj
  : $Obj extends Record<any, any> ? $Path extends keyof $Obj ? Simplify<Omit<$Obj, $Path> & { [k in $Path]: $Value }>
    : $Obj
  : $Obj

/**
 * Append an element to a tuple type.
 *
 * @example
 * ```typescript
 * type Arr = ['a', 'b']
 * type Extended = Append<Arr, 'c'>  // ['a', 'b', 'c']
 * ```
 */
type Append<$Tuple extends readonly any[], $Element> = [...$Tuple, $Element]

// ============================================================================
// CLI Flag Name Class
// ============================================================================

/**
 * CLI flag name with validation.
 *
 * Represents a parsed and validated CLI flag name with:
 * - Canonical name (the primary name used for the flag)
 * - Optional short name (single character)
 * - Optional long name (multiple characters, camelCased)
 * - Aliases (additional short and long names)
 * - Original expression
 *
 * @example
 * ```typescript
 * // Create from string
 * const flag1 = FlagName.fromString('-v --verbose')
 * // { canonical: 'verbose', short: 'v', long: 'verbose', aliases: { short: [], long: [] }, expression: '-v --verbose' }
 *
 * const flag2 = FlagName.fromString('--foo-bar')
 * // { canonical: 'fooBar', short: null, long: 'fooBar', aliases: { short: [], long: [] }, expression: '--foo-bar' }
 *
 * // Type-level parsing with validation
 * type Valid = FlagName.Analyze<'-v --verbose'>
 * // { canonical: 'verbose', short: 'v', long: 'verbose', ... }
 *
 * type Invalid = FlagName.Analyze<'--v'>
 * // Error: "A long flag must be two (2) or more characters..."
 * ```
 */
export class FlagName extends S.Class<FlagName>('FlagName')({
  /**
   * The canonical (primary) name for the flag.
   * Long names take precedence over short names.
   */
  canonical: S.String,

  /**
   * Single-character short name (e.g., 'v' from '-v').
   */
  short: S.NullOr(S.String),

  /**
   * Multi-character long name in camelCase (e.g., 'verbose' from '--verbose', 'fooBar' from '--foo-bar').
   */
  long: S.NullOr(S.String),

  /**
   * Additional alias names.
   */
  aliases: S.Struct({
    short: S.Array(S.String),
    long: S.Array(S.String),
  }),

  /**
   * Original flag expression string.
   */
  expression: S.String,
}) {
  /**
   * Schema for parsing from/encoding to string representation.
   * Use this when you need to accept string flag expressions.
   *
   * @example
   * ```typescript
   * const ConfigSchema = S.Struct({
   *   flagName: FlagName.String
   * })
   * ```
   */
  static String = S.transformOrFail(
    S.String,
    FlagName,
    {
      strict: true,
      decode: (input, options, ast) => {
        // Validate input BEFORE analyzer (to catch prefix-based errors)
        const trimmed = input.trim()

        // Validate: Empty check
        if (!trimmed) {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, 'You must specify at least one name for your flag.'),
          )
        }

        // Validate: Check each flag in the expression
        const flags = trimmed.split(/\s+/)
        for (const flag of flags) {
          // Short flag with too many characters: -vv
          if (flag.startsWith('-') && !flag.startsWith('--')) {
            const name = flag.slice(1)
            if (name.length !== 1) {
              return ParseResult.fail(
                new ParseResult.Type(ast, input, `Short flag must be exactly one character: '${flag}'`),
              )
            }
          }
          // Long flag with too few characters: --v
          if (flag.startsWith('--')) {
            const name = flag.slice(2)
            if (name.length < 2) {
              return ParseResult.fail(
                new ParseResult.Type(ast, input, `Long flag must be two or more characters: '${flag}'`),
              )
            }
          }
        }

        // Use runtime analyzer to parse the flag expression
        const analysis = Analyzer.analyze(input)

        // Validate: No duplicates (check after camelCase normalization)
        const allNames = [
          analysis.short,
          analysis.long,
          ...analysis.aliases.short,
          ...analysis.aliases.long,
        ].filter((name): name is string => name !== null)
        const seen = new Set<string>()
        for (const name of allNames) {
          if (seen.has(name)) {
            return ParseResult.fail(
              new ParseResult.Type(ast, input, `Duplicate alias: "${name}"`),
            )
          }
          seen.add(name)
        }

        // Create FlagName instance from analysis
        return ParseResult.succeed(
          new FlagName({
            canonical: analysis.canonical,
            short: analysis.short,
            long: analysis.long,
            aliases: analysis.aliases,
            expression: analysis.expression,
          }),
        )
      },
      encode: (decoded) => {
        // Encode back to original expression string
        return ParseResult.succeed(decoded.expression)
      },
    },
  )

  /**
   * Create a typed FlagName from a literal string with compile-time validation.
   *
   * This function requires a literal string at compile time to provide
   * type-safe parsing. The return type is automatically validated and structured
   * based on the input string.
   *
   * For runtime strings (non-literals), use `decodeSync` instead.
   *
   * @param input - A literal string flag expression
   * @returns FlagName instance with inferred type structure
   *
   * @example
   * ```typescript
   * const flag1 = FlagName.fromString('-v --verbose')
   * // Type: { canonical: 'verbose', short: 'v', long: 'verbose', ... }
   *
   * const flag2 = FlagName.fromString('--foo-bar')
   * // Type: { canonical: 'fooBar', long: 'fooBar', ... } (kebab → camel)
   *
   * // Type error: long flag too short
   * const flag3 = FlagName.fromString('--v')
   * // Error: "A long flag must be two (2) or more characters..."
   *
   * // This will cause a type error:
   * const expr: string = getExpression()
   * const flag = FlagName.fromString(expr)  // Error: string not assignable
   * // Use this instead: FlagName.decodeSync(expr)
   * ```
   */
  static fromString = <const $input extends string>(
    $input: FlagName.Analyze<$input> extends string ? Ts.StaticError<FlagName.Analyze<$input>>
      : $input,
  ) => {
    return S.decodeSync(FlagName.String)($input as any) as any
  }

  /**
   * @see {@link Analyzer.analyze}
   */
  static Analyzer = Analyzer
}

// ============================================================================
// Type-Level API
// ============================================================================

/**
 * Type-level utilities for FlagName.
 */
export namespace FlagName {
  // ==========================================================================
  // Public Name Types
  // ==========================================================================

  /**
   * Parsed flag name structure.
   */
  export type Name = {
    expression: string
    canonical: string | null
    aliases: {
      short: [...string[]]
      long: [...string[]]
    }
    long: string | null
    short: string | null
  }

  /**
   * Empty flag name (initial parsing state).
   */
  export type NameEmpty = {
    expression: string
    canonical: null
    aliases: {
      short: []
      long: []
    }
    long: null
    short: null
  }

  /**
   * Limits/constraints for parsing (reserved and already-used names).
   */
  export interface SomeLimits {
    reservedNames: string | undefined
    usedNames: string | undefined
  }

  // ==========================================================================
  // Parser Error Types
  // ==========================================================================

  /**
   * Parser error types.
   */
  export namespace Errors {
    export type TrailingPipe =
      `Error: You have a trailing pipe. Pipes are for adding aliases. Add more names after your pipe or remove it.`
    export type Empty = `Error: You must specify at least one name for your flag.`
    export type Unknown = `Error: Cannot parse your flag expression.`
  }

  // ==========================================================================
  // Validation Checks
  // ==========================================================================

  /**
   * Validation checks for flag names.
   */
  export namespace Checks {
    /**
     * Error message types for flag name validation failures.
     */
    export namespace Messages {
      export type WithHeader<$Body extends string> = `Error(s):\n${$Body}`
      export type LongTooShort<$Variant extends string> =
        `A long flag must be two (2) or more characters but you have: '--${$Variant}'.`
      export type AliasDuplicate<$Variant extends string> = `Your alias "${$Variant}" is a duplicate.`
      export type ShortTooLong<$Variant extends string> =
        `A short flag must be exactly one (1) character but you have: '-${$Variant}'.`
      export type AlreadyTaken<$Variant extends string> =
        `The name "${$Variant}" cannot be used because it is already used for another flag.`
      export type Reserved<$Variant extends string> = `The name "${$Variant}" cannot be used because it is reserved.`
    }

    /**
     * Validation check types for flag names.
     * Each check has a predicate and an error message.
     */
    export namespace Kinds {
      export type LongTooShort<$Variant extends string> = {
        predicate: Length<$Variant> extends 1 ? true : false
        message: Messages.LongTooShort<$Variant>
      }

      export type ShortTooLong<$Variant extends string> = {
        predicate: Length<$Variant> extends 1 ? false : true
        message: Messages.ShortTooLong<$Variant>
      }

      export type AliasDuplicate<$Name extends Name, $Variant extends string> = {
        predicate: CamelCase<$Variant> extends $Name['long'] | $Name['short'] ? true : false
        message: Messages.AliasDuplicate<$Variant>
      }

      export type AlreadyTaken<$Limits extends SomeLimits, $Variant extends string> = {
        predicate: $Limits['usedNames'] extends undefined ? false
          : CamelCase<$Variant> extends CamelCase<Exclude<$Limits['usedNames'], undefined>> ? true
          : false
        message: Messages.AlreadyTaken<$Variant>
      }

      export type Reserved<$Limits extends SomeLimits, $Variant extends string> = {
        predicate: $Limits['reservedNames'] extends undefined ? false
          : CamelCase<$Variant> extends CamelCase<Exclude<$Limits['reservedNames'], undefined>> ? true
          : false
        message: Messages.Reserved<$Variant>
      }
    }

    /**
     * A validation check result with predicate and error message.
     */
    export interface Result {
      predicate: boolean
      message: string
    }

    /**
     * Non-empty array of validation failures.
     */
    export type SomeFailures = [Result, ...Result[]]

    /**
     * Base validation checks that apply to all flag variants (short and long).
     */
    export type BaseChecks<
      $Variant extends string,
      $limits extends SomeLimits,
      $FlagName extends Name,
    > = FilterFailures<
      [
        Kinds.AliasDuplicate<$FlagName, $Variant>,
        Kinds.AlreadyTaken<$limits, $Variant>,
        Kinds.Reserved<$limits, $Variant>,
      ]
    >

    /**
     * Validation checks specific to long flags (--flag).
     */
    export type LongChecks<
      $Variant extends string,
      $limits extends SomeLimits,
      $FlagName extends Name,
    > = FilterFailures<[...BaseChecks<$Variant, $limits, $FlagName>, Kinds.LongTooShort<$Variant>]>

    /**
     * Validation checks specific to short flags (-f).
     */
    export type ShortChecks<
      $Variant extends string,
      $limits extends SomeLimits,
      $FlagName extends Name,
    > = FilterFailures<[...BaseChecks<$Variant, $limits, $FlagName>, Kinds.ShortTooLong<$Variant>]>

    /**
     * Format validation failures into a single error message string.
     */
    export type ReportFailures<$Results extends [...Result[]], $Accumulator extends string = ''> = $Results extends
      [infer Head extends Result, ...infer Tail extends Result[]]
      ? Head['predicate'] extends true
        ? $Accumulator extends '' ? ReportFailures<Tail, Messages.WithHeader<Head['message']>>
        : ReportFailures<Tail, `${$Accumulator}\n${Head['message']}`>
      : ReportFailures<Tail, $Accumulator>
      : $Accumulator

    /**
     * Filter a list of validation checks down to only the failures (predicate = true).
     */
    type FilterFailures<$Results extends [...Result[]], $Accumulator extends Result[] = []> = $Results extends
      [infer Head extends Result, ...infer Tail extends Result[]]
      ? Head['predicate'] extends true ? FilterFailures<Tail, [...$Accumulator, Head]>
      : FilterFailures<Tail, $Accumulator>
      : $Accumulator
  }

  // ==========================================================================
  // Type-Level Analyzer (Recursive Parser)
  // ==========================================================================

  interface SomeLimitsNone {
    reservedNames: undefined
    usedNames: undefined
  }

  /**
   * Add a name variant to the Name being built during parsing.
   */
  type Add<
    $Kind extends 'short' | 'long',
    $Name extends Name,
    $Variant extends string,
  > = $Kind extends 'short' ? $Name['short'] extends null ? AddShort<$Name, $Variant>
    : AddAliasShort<$Name, $Variant>
    : $Kind extends 'long' ? $Name['long'] extends null ? AddLong<$Name, $Variant>
      : AddAliasLong<$Name, $Variant>
    : never

  /**
   * Add a long alias to an existing Name (long already set).
   */
  type AddAliasLong<$Name extends Name, $Variant extends string> = Update<
    $Name,
    'aliases.long',
    Append<$Name['aliases']['long'], CamelCase<$Variant>>
  >

  /**
   * Add a short alias to an existing Name (short already set).
   */
  type AddAliasShort<$Name extends Name, $Variant extends string> = Update<
    $Name,
    'aliases.short',
    Append<$Name['aliases']['short'], $Variant>
  >

  /**
   * Set the primary long name (first long encountered).
   */
  type AddLong<$Name extends Name, $Variant extends string> = Update<$Name, 'long', CamelCase<$Variant>>

  /**
   * Set the primary short name (first short encountered).
   */
  type AddShort<$Name extends Name, $Variant extends string> = Update<$Name, 'short', $Variant>

  /**
   * Set the canonical name (long takes precedence over short).
   */
  type addCanonical<$Name extends Name> = Update<
    $Name,
    'canonical',
    $Name['long'] extends string ? $Name['long']
      : $Name['short'] extends string ? $Name['short']
      : never // A valid flag always has either a long or short name
  >

  /**
   * Analyze a CLI flag expression into a Name type.
   *
   * This is a recursive type-level parser that handles:
   * - Short flags: `-v`
   * - Long flags: `--verbose`
   * - Multiple flags: `-v --verbose`
   * - Aliases: `-v --verbose -x --extra`
   * - Whitespace: trimmed automatically
   * - No prefix: `v verbose` (infers short/long by length)
   *
   * @example
   * ```typescript
   * type A = Analyze<'-v'>                      // { short: 'v', long: null, ... }
   * type B = Analyze<'--verbose'>               // { short: null, long: 'verbose', ... }
   * type C = Analyze<'-v --verbose'>            // { short: 'v', long: 'verbose', canonical: 'verbose', ... }
   * type D = Analyze<'-v --verbose -x'>         // { short: 'v', long: 'verbose', aliases: { short: ['x'], long: [] }, ... }
   * type E = Analyze<'--foo-bar'>               // { long: 'fooBar', ... } (kebab → camel)
   * type F = Analyze<'v version'>               // { short: 'v', long: 'version', ... } (no prefix)
   * type G = Analyze<'--v'>                     // Error: long flag must be 2+ chars
   * type H = Analyze<'-vv'>                     // Error: short flag must be 1 char
   * type I = Analyze<''>                        // Error: must specify at least one name
   * ```
   */
  export type Analyze<
    $E extends string,
    $limits extends SomeLimits = SomeLimitsNone,
    $names extends Name = NameEmpty,
  > = _Analyze<$E, $limits, $names>

  type _Analyze<$E extends string, $Limits extends SomeLimits, $Name extends Name> =
    // Done!
    $E extends `` ? NameEmpty extends $Name ? Errors.Empty : addCanonical<$Name>
      // Trim leading and trailing whitespace
      : $E extends ` ${infer tail}` ? _Analyze<tail, $Limits, $Name>
      : $E extends `${infer initial} ` ? _Analyze<initial, $Limits, $Name>
      // Capture a long flag & continue
      : $E extends `--${infer v} ${infer tail}`
        ? Checks.LongChecks<v, $Limits, $Name> extends Checks.SomeFailures
          ? Checks.ReportFailures<Checks.LongChecks<v, $Limits, $Name>>
        : _Analyze<tail, $Limits, Add<'long', $Name, v>>
      // Capture a long name & Done!
      : $E extends `--${infer v}`
        ? Checks.LongChecks<v, $Limits, $Name> extends Checks.SomeFailures
          ? Checks.ReportFailures<Checks.LongChecks<v, $Limits, $Name>>
        : _Analyze<'', $Limits, Add<'long', $Name, v>>
      // Capture a short flag & continue
      : $E extends `-${infer v} ${infer tail}`
        ? Checks.ShortChecks<v, $Limits, $Name> extends Checks.SomeFailures
          ? Checks.ReportFailures<Checks.ShortChecks<v, $Limits, $Name>>
        : _Analyze<tail, $Limits, Add<'short', $Name, v>>
      // Capture a short name & Done!
      : $E extends `-${infer v}`
        ? Checks.ShortChecks<v, $Limits, $Name> extends Checks.SomeFailures
          ? Checks.ReportFailures<Checks.ShortChecks<v, $Limits, $Name>>
        : _Analyze<'', $Limits, Add<'short', $Name, v>>
      // Capture a long flag & continue (no prefix, inferred by length)
      : $E extends `${infer v} ${infer tail}`
        ? Checks.BaseChecks<v, $Limits, $Name> extends Checks.SomeFailures
          ? Checks.ReportFailures<Checks.BaseChecks<v, $Limits, $Name>>
        : _Analyze<tail, $Limits, Add<Length<v> extends 1 ? 'short' : 'long', $Name, v>>
      // Capture final name (no prefix, inferred by length)
      : $E extends `${infer v}`
        ? Checks.BaseChecks<v, $Limits, $Name> extends Checks.SomeFailures
          ? Checks.ReportFailures<Checks.BaseChecks<v, $Limits, $Name>>
        : _Analyze<'', $Limits, Add<Length<v> extends 1 ? 'short' : 'long', $Name, v>>
      : Errors.Unknown

  // ==========================================================================
  // Result Extraction Utilities
  // ==========================================================================

  /**
   * Check if an {@link Analyze} result is a parse error.
   *
   * Returns `true` if the result is an error string, `false` if it's a parsed name.
   *
   * @example
   * ```typescript
   * type Valid = IsParseError<Analyze<'-v --verbose'>>  // false
   * type Invalid = IsParseError<Analyze<'--v'>>         // true
   * ```
   */
  export type IsParseError<$result> = $result extends string ? true : false

  /**
   * Extract the canonical name from a successful parse, or the error message from a failed parse.
   *
   * @example
   * ```typescript
   * type Success = GetCanonicalNameOrError<Analyze<'-v --verbose'>>  // 'verbose'
   * type Error = GetCanonicalNameOrError<Analyze<'--v'>>             // 'Error: A long flag must be two (2) or more characters...'
   * ```
   */
  export type GetCanonicalNameOrError<$result> = $result extends string ? $result
    : $result extends FlagName ? $result['canonical']
    : never

  /**
   * Extract all possible flag names as a union type from a successful parse.
   *
   * Returns `never` if the parse failed.
   *
   * Includes:
   * - Primary long name (if present)
   * - Primary short name (if present)
   * - All long aliases
   * - All short aliases
   *
   * @example
   * ```typescript
   * type Names = GetNames<Analyze<'-v --verbose -x --extra'>>
   * // 'v' | 'verbose' | 'x' | 'extra'
   *
   * type Error = GetNames<Analyze<'--v'>>
   * // never
   * ```
   */
  export type GetNames<$result> = $result extends FlagName ?
      | ($result['long'] extends string ? $result['long'] : never)
      | ($result['short'] extends string ? $result['short'] : never)
      | $result['aliases']['long'][number]
      | $result['aliases']['short'][number]
    : never
}
