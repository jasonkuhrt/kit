import { Str } from '#str'
import type { Analyze } from './analyzer.types.js'

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
export function analyze<const input extends string>(input: input): Analyze<input> {
  return analyze_(input) as Analyze<input>
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
