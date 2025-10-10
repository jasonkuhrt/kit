import type { Ts } from '#ts'
import { ParseResult, Schema as S } from 'effect'
import * as Analyzer from './analyzer.js'
import type * as AnalyzerTypes from './analyzer.types.js'

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
    $input: AnalyzerTypes.Analyze<$input> extends string ? Ts.StaticError<AnalyzerTypes.Analyze<$input>>
      : $input,
  ) => {
    return S.decodeSync(FlagName.String)($input as any) as any
  }
}
