import { ArrMut } from '#arr-mut'
import { Fn } from '#fn'
import type { Undefined } from '#undefined'

type MatchItem = string | undefined

// dprint-ignore
type ToGroupsProperties<$MatchItems extends readonly [MatchItem, ...readonly MatchItem[]]> = {
  [i in keyof $MatchItems]:
    $MatchItems[i] extends string
      ? { [_ in $MatchItems[i]]: string }
      : { [_ in Undefined.Exclude<$MatchItems[i]>]?: string }
}

// dprint-ignore
export type RegExpMatchResult<$Matches extends Matches> =
  | null
  | (
    & Omit<RegExpMatchArray, 'groups'>
    & {
        groups:
          $Matches['groups'] extends readonly [MatchItem,... readonly MatchItem[]]
            ? ArrMut.ReduceWithIntersection<ToGroupsProperties<$Matches['groups']>>
            : undefined
      }
    & (
        $Matches extends { indicies: readonly [MatchItem,... readonly MatchItem[]] }
          ? [originalValue: string, ...$Matches['indicies']]
          : [originalValue: string]
      )
  )

const RegExpTypeSymbol = Symbol(`RegExpType`)

interface Pattern<$Matches extends Matches> extends RegExp {
  [RegExpTypeSymbol]: $Matches
}

/**
 * Create a typed pattern from a regular expression.
 * Enables type-safe capture groups when used with {@link match}.
 * @param pattern - The regular expression pattern
 * @returns A typed pattern that preserves capture group information
 * @example
 * ```typescript
 * const p = pattern<{ groups: ['name', 'age'] }>(/(?<name>\w+) is (?<age>\d+)/)
 * const result = match('John is 25', p)
 * if (result) {
 *   console.log(result.groups.name) // 'John' (typed)
 *   console.log(result.groups.age) // '25' (typed)
 * }
 * ```
 */
export const pattern = <matches extends Matches>(pattern: RegExp): Pattern<matches> => {
  return pattern as any
}

// todo: technically undefined on its own is not valid, it is: string | (string | undefined)
export type Matches = {
  groups?: (string | undefined)[]
  indicies?: (string | undefined)[]
}

// export type MatchesToObject

/**
 * Match a string against a pattern with type-safe results.
 * @param string - The string to match against
 * @param pattern - Regular expression or typed pattern
 * @returns Match result with typed capture groups, or null if no match
 * @example
 * ```typescript
 * const result = match('hello world', /hello (\w+)/)
 * if (result) {
 *   console.log(result[0]) // 'hello world'
 *   console.log(result[1]) // 'world'
 * }
 * ```
 */
export const match = <matches extends Matches>(
  string: string,
  pattern: RegExp | Pattern<matches>,
): RegExpMatchResult<matches> => {
  return string.match(pattern) as any
}

// One

export type PatternInput = string | RegExp

/**
 * Check if a string matches a pattern.
 * @param value - The string to test
 * @param pattern - String for exact match or RegExp for pattern match
 * @returns True if the value matches the pattern
 * @example
 * ```typescript
 * isMatch('hello', 'hello') // true
 * isMatch('hello', /^h.*o$/) // true
 * isMatch('world', 'hello') // false
 * ```
 */
export const isMatch = (value: string, pattern: PatternInput): boolean => {
  if (typeof pattern === `string`) {
    return value === pattern
  }
  return pattern.test(value)
}

/**
 * Curried version of {@link isMatch} with value first.
 * @param value - The string to test
 * @returns Function that takes a pattern and returns boolean
 * @example
 * ```typescript
 * const isHello = isMatchOn('hello')
 * isHello('hello') // true
 * isHello(/^h.*o$/) // true
 * ```
 */
export const isMatchOn = Fn.curry(isMatch)

/**
 * Curried version of {@link isMatch} with pattern first.
 * @param pattern - String for exact match or RegExp for pattern match
 * @returns Function that takes a value and returns boolean
 * @example
 * ```typescript
 * const matchesHello = isMatchWith('hello')
 * matchesHello('hello') // true
 * matchesHello('world') // false
 * ```
 */
export const isMatchWith = Fn.flipCurried(isMatchOn)

/**
 * Check if a string does not match a pattern.
 * @param pattern - String for exact match or RegExp for pattern match
 * @returns Function that takes a value and returns true if it doesn't match
 * @example
 * ```typescript
 * const notHello = isntMatch('hello')
 * notHello('world') // true
 * notHello('hello') // false
 * ```
 */
export const isntMatch = (pattern: PatternInput) => (value: string): boolean => {
  return !isMatch(value, pattern)
}

/**
 * Curried version of {@link isntMatch} with value first.
 * @param value - The string to test
 * @returns Function that takes a pattern and returns boolean
 */
export const isntMatchOn = Fn.curry(isntMatch)

/**
 * Curried version of {@link isntMatch} with pattern first.
 * @param pattern - String for exact match or RegExp for pattern match
 * @returns Function that takes a value and returns boolean
 */
export const isntMatchWith = Fn.flipCurried(isntMatchOn)

// Any

export type PatternsInput = ArrMut.Maybe<string | RegExp>

/**
 * Check if a string matches any of the provided patterns.
 * @param value - The string to test
 * @param patterns - Array of strings or RegExp patterns (or a single pattern)
 * @returns True if the value matches any pattern
 * @example
 * ```typescript
 * isMatchAny('hello', ['hello', 'world']) // true
 * isMatchAny('hello', [/^h/, /o$/]) // true
 * isMatchAny('foo', ['hello', 'world']) // false
 * ```
 */
export const isMatchAny = (value: string, patterns: PatternsInput): boolean => {
  const patterns_ = ArrMut.sure(patterns)
  return patterns_.some(isMatchOn(value))
}

/**
 * Curried version of {@link isMatchAny} with value first.
 * @param value - The string to test
 * @returns Function that takes patterns and returns boolean
 */
export const isMatchAnyOn = Fn.curry(isMatchAny)

/**
 * Curried version of {@link isMatchAny} with patterns first.
 * @param patterns - Array of strings or RegExp patterns (or a single pattern)
 * @returns Function that takes a value and returns boolean
 * @example
 * ```typescript
 * const matchesGreeting = isMatchAnyWith(['hello', 'hi', /^hey/])
 * matchesGreeting('hello') // true
 * matchesGreeting('hey there') // true
 * matchesGreeting('goodbye') // false
 * ```
 */
export const isMatchAnyWith = Fn.flipCurried(isMatchAnyOn)

/**
 * Check if a string does not match any of the provided patterns.
 * @param patternOrPatterns - Array of strings or RegExp patterns (or a single pattern)
 * @returns Function that takes a value and returns true if it doesn't match any pattern
 * @example
 * ```typescript
 * const notGreeting = isNotMatchAny(['hello', 'hi'])
 * notGreeting('goodbye') // true
 * notGreeting('hello') // false
 * ```
 */
export const isNotMatchAny = (patternOrPatterns: PatternsInput) => (value: string): boolean => {
  return !isMatchAny(value, patternOrPatterns)
}

/**
 * Curried version of {@link isNotMatchAny} with value first.
 * @param value - The string to test
 * @returns Function that takes patterns and returns boolean
 */
export const isNotMatchAnyOn = Fn.curry(isNotMatchAny)

/**
 * Curried version of {@link isNotMatchAny} with patterns first.
 * @param patternOrPatterns - Array of strings or RegExp patterns (or a single pattern)
 * @returns Function that takes a value and returns boolean
 */
export const isNotMatchAnyWith = Fn.flipCurried(isNotMatchAnyOn)
