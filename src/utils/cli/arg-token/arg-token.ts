import type { Ts } from '#ts'
import { ParseResult, Schema as S } from 'effect'
import * as Analyzer from './analyzer.js'
import type * as AnalyzerTypes from './analyzer.types.js'

/**
 * CLI argument token with structural analysis.
 *
 * Represents a parsed and analyzed CLI argument token with:
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
 * const token1 = ArgToken.fromString('--verbose')
 * // { _tag: 'long-flag', name: 'verbose', value: null, original: '--verbose' }
 *
 * const token2 = ArgToken.fromString('--count=5')
 * // { _tag: 'long-flag', name: 'count', value: '5', original: '--count=5' }
 *
 * const token3 = ArgToken.fromString('-v')
 * // { _tag: 'short-flag', name: 'v', value: null, original: '-v' }
 *
 * const token4 = ArgToken.fromString('file.txt')
 * // { _tag: 'positional', value: 'file.txt', original: 'file.txt' }
 *
 * // Type-level analysis with validation
 * type Valid = ArgToken.Analyze<'--foo-bar'>
 * // { _tag: 'long-flag', name: 'fooBar', value: null, original: '--foo-bar' }
 * ```
 */
export class ArgToken extends S.Class<ArgToken>('ArgToken')({
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
   *   argToken: ArgToken.String
   * })
   * ```
   */
  static String = S.transformOrFail(
    S.String,
    ArgToken,
    {
      strict: true,
      decode: (input, _options, _ast) => {
        // Use runtime analyzer to parse the argument
        const analysis = Analyzer.analyze(input)

        // Transform analysis result into ArgToken format
        switch (analysis._tag) {
          case 'long-flag':
            return ParseResult.succeed(
              new ArgToken({
                _tag: 'long-flag',
                name: analysis.name,
                value: analysis.value,
                original: analysis.original,
              }),
            )

          case 'short-flag':
            return ParseResult.succeed(
              new ArgToken({
                _tag: 'short-flag',
                name: analysis.name,
                value: analysis.value,
                original: analysis.original,
              }),
            )

          case 'positional':
            return ParseResult.succeed(
              new ArgToken({
                _tag: 'positional',
                value: analysis.value,
                original: analysis.original,
              }),
            )

          case 'separator':
            return ParseResult.succeed(
              new ArgToken({
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
   * Create a typed ArgToken from a literal string with compile-time analysis.
   *
   * This function requires a literal string at compile time to provide
   * type-safe parsing. The return type is automatically analyzed and structured
   * based on the input string.
   *
   * For runtime strings (non-literals), use `decodeSync` instead.
   *
   * @param input - A literal string argument expression
   * @returns ArgToken instance with inferred type structure
   *
   * @example
   * ```typescript
   * const token1 = ArgToken.fromString('--verbose')
   * // Type: { _tag: 'long-flag', name: 'verbose', value: null, ... }
   *
   * const token2 = ArgToken.fromString('--count=5')
   * // Type: { _tag: 'long-flag', name: 'count', value: '5', ... }
   *
   * const token3 = ArgToken.fromString('-v')
   * // Type: { _tag: 'short-flag', name: 'v', value: null, ... }
   *
   * // This will cause a type error:
   * const expr: string = getExpression()
   * const token = ArgToken.fromString(expr)  // Error: string not assignable
   * // Use this instead: ArgToken.decodeSync(expr)
   * ```
   */
  static fromString = <const $input extends string>(
    $input: ArgToken.Analyze<$input> extends string ? Ts.Err.StaticError<ArgToken.Analyze<$input>>
      : $input,
  ) => {
    return S.decodeSync(ArgToken.String)($input as any) as any
  }

  /**
   * @see {@link Analyzer.analyze}
   */
  static Analyzer = Analyzer
}

/**
 * Type-level utilities for ArgToken.
 */
export namespace ArgToken {
  /**
   * Type-level analyzer that mirrors runtime analyze() function.
   *
   * @see {@link AnalyzerTypes.Analyze}
   */
  export type Analyze<$S extends string> = AnalyzerTypes.Analyze<$S>

  /**
   * Extract just the tag from analysis result.
   */
  export type AnalyzeTag<$S extends string> = Analyze<$S>['_tag']
}
