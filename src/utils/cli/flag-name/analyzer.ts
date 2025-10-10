import { Str } from '#str'
import type { FlagName } from './flag-name.ts'

/**
 * Runtime analyzer for CLI flag expressions.
 *
 * Analyzes a flag expression string into a structured analysis object with:
 * - Primary short and long names
 * - Additional aliases
 * - Canonical name (long takes precedence)
 *
 * All names are normalized to camelCase.
 *
 * @param expression - The flag expression to analyze (e.g., "-v --verbose -x --extra")
 * @returns Analyzed Name object with canonical name, short/long, and aliases
 *
 * @example
 * ```typescript
 * analyze('-v')
 * // { expression: '-v', canonical: 'v', short: 'v', long: null, aliases: { short: [], long: [] } }
 *
 * analyze('--verbose')
 * // { expression: '--verbose', canonical: 'verbose', short: null, long: 'verbose', aliases: { short: [], long: [] } }
 *
 * analyze('-v --verbose')
 * // { expression: '-v --verbose', canonical: 'verbose', short: 'v', long: 'verbose', aliases: { short: [], long: [] } }
 *
 * analyze('-v --verbose -x --extra')
 * // {
 * //   expression: '-v --verbose -x --extra',
 * //   canonical: 'verbose',
 * //   short: 'v',
 * //   long: 'verbose',
 * //   aliases: { short: ['x'], long: ['extra'] }
 * // }
 *
 * analyze('--foo-bar')
 * // { expression: '--foo-bar', canonical: 'fooBar', short: null, long: 'fooBar', aliases: { short: [], long: [] } }
 *
 * analyze('v verbose')  // No prefix - inferred by length
 * // { expression: 'v verbose', canonical: 'verbose', short: 'v', long: 'verbose', aliases: { short: [], long: [] } }
 * ```
 */
export function analyze<const $input extends string>($input: $input): FlagName {
  const names = $input
    .trim()
    .split(` `)
    .map((_) => _.trim())
    .map(stripeDashPrefix)
    .map(Str.Case.camel)
    .filter((_) => _.length > 0)

  const longs = names.filter((name): name is string => name.length > 1)
  const shorts = names.filter((name): name is string => name.length === 1)
  const short = (shorts.shift() ?? null)!
  const long = (longs.shift() ?? null)!
  const canonical = (long ?? short)!

  return {
    expression: $input,
    canonical,
    short,
    long,
    aliases: {
      short: shorts,
      long: longs,
    },
  }
}

/**
 * Remove leading dashes from a flag name.
 */
const stripeDashPrefix = (name: string): string => {
  if (name.startsWith(`--`)) {
    return name.slice(2)
  }
  if (name.startsWith(`-`)) {
    return name.slice(1)
  }
  return name
}
