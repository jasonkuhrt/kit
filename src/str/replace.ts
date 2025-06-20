import { sure } from '#arr/arr'
import { curry, flipCurried } from '#fn/curry'
import { Empty } from '#str/type'
import { spaceNoBreak, spaceRegular } from './char/char.ts'
import type { PatternsInput } from './match.ts'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Builtins
//
//

/**
 * Remove whitespace from both ends of a string.
 * @param value - The string to trim
 * @returns The trimmed string
 * @example
 * ```typescript
 * trim('  hello  ') // 'hello'
 * trim('\n\thello\n\t') // 'hello'
 * ```
 */
export const trim = (value: string): string => {
  return value.trim()
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • replaceLeading
//
//

/**
 * Replace the leading occurrence of a matcher string with a replacement.
 * @param replacement - The string to replace the matcher with
 * @param matcher - The string to match at the beginning
 * @param value - The string to operate on
 * @returns The string with leading matcher replaced
 * @example
 * ```typescript
 * replaceLeading('$', '//', '// comment') // '$ comment'
 * replaceLeading('', 'www.', 'www.example.com') // 'example.com'
 * ```
 */
export const replaceLeading = (replacement: string, matcher: string, value: string): string => {
  if (!value.startsWith(matcher)) return value
  return replacement + value.slice(matcher.length)
}

/**
 * Curried version of {@link replaceLeading} with replacement first.
 * @param replacement - The string to replace the matcher with
 * @returns Function that takes matcher, then value
 */
export const replaceLeadingWith = (replacement: string) => (matcher: string) => (value: string): string => {
  return replaceLeading(replacement, matcher, value)
}

/**
 * Curried version of {@link replaceLeading} with value first.
 * @param value - The string to operate on
 * @returns Function that takes replacement, then matcher
 */
export const replaceLeadingOn = (value: string) => (replacement: string) => (matcher: string): string => {
  return replaceLeading(replacement, matcher, value)
}

/**
 * Remove the leading occurrence of a matcher string.
 * Alias for `replaceLeadingWith('')`.
 * @param matcher - The string to remove from the beginning
 * @returns Function that takes a value and returns the stripped string
 * @example
 * ```typescript
 * const removePrefix = stripLeading('//')
 * removePrefix('// comment') // ' comment'
 * ```
 */
export const stripLeading = replaceLeadingWith(``)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • replace
//
//

/**
 * Replace all occurrences of patterns with a replacement string.
 * @param replacement - The string to replace matches with
 * @param matcher - String or RegExp pattern(s) to match
 * @param value - The string to operate on
 * @returns The string with all matches replaced
 * @example
 * ```typescript
 * replace('_', ' ', 'hello world') // 'hello_world'
 * replace('X', /[aeiou]/g, 'hello') // 'hXllX'
 * replace('-', [' ', '_'], 'hello world_test') // 'hello-world-test'
 * ```
 */
export const replace = (replacement: string, matcher: PatternsInput, value: string): string => {
  const patterns = sure(matcher)
  return patterns.reduce<string>((value, pattern) => {
    return value.replaceAll(pattern, replacement)
  }, value)
}

/**
 * Curried version of {@link replace} with replacement first.
 * @param replacement - The string to replace matches with
 * @returns Function that takes matcher, then value
 */
export const replaceWith = (replacement: string) => (matcher: PatternsInput) => (value: string): string => {
  return replace(replacement, matcher, value)
}

/**
 * Curried version of {@link replace} with value first.
 * @param value - The string to operate on
 * @returns Function that takes replacement, then matcher
 */
export const replaceOn = (value: string) => (replacement: string) => (matcher: PatternsInput): string => {
  return replace(replacement, matcher, value)
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • append
//
//

/**
 * Append a string to another string.
 * @param value1 - The base string
 * @param value2 - The string to append
 * @returns The concatenated string
 * @example
 * ```typescript
 * append('hello', ' world') // 'hello world'
 * append('foo', 'bar') // 'foobar'
 * ```
 */
export const append = (value1: string, value2: string): string => {
  return value1 + value2
}

/**
 * Curried version of {@link append} with value1 first.
 * @param value1 - The base string
 * @returns Function that takes value2 and returns the concatenated string
 */
export const appendOn = curry(append)

/**
 * Curried version of {@link append} with value2 first.
 * @param value2 - The string to append
 * @returns Function that takes value1 and returns the concatenated string
 * @example
 * ```typescript
 * const addWorld = appendWith(' world')
 * addWorld('hello') // 'hello world'
 * ```
 */
export const appendWith = flipCurried(appendOn)

// prepend

/**
 * Prepend a string to another string.
 * @param value1 - The string to prepend
 * @param value2 - The base string
 * @returns The concatenated string with value1 first
 * @example
 * ```typescript
 * prepend('hello ', 'world') // 'hello world'
 * prepend('pre', 'fix') // 'prefix'
 * ```
 */
export const prepend = (value1: string, value2: string): string => {
  return value2 + value1
}

/**
 * Curried version of {@link prepend} with value1 first.
 * @param value1 - The string to prepend
 * @returns Function that takes value2 and returns the concatenated string
 */
export const prependOn = curry(prepend)

/**
 * Curried version of {@link prepend} with value2 first.
 * @param value2 - The base string
 * @returns Function that takes value1 and returns the concatenated string
 * @example
 * ```typescript
 * const toWorld = prependWith('world')
 * toWorld('hello ') // 'hello world'
 * ```
 */
export const prependWith = flipCurried(prependOn)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • repeat
//
//

/**
 * Repeat a string a specified number of times.
 * @param value - The string to repeat
 * @param count - The number of times to repeat
 * @returns The repeated string
 * @example
 * ```typescript
 * repeat('a', 3) // 'aaa'
 * repeat('hello', 2) // 'hellohello'
 * repeat('-', 10) // '----------'
 * ```
 */
export const repeat = (value: string, count: number): string => {
  return value.repeat(count)
}

/**
 * Curried version of {@link repeat} with value first.
 * @param value - The string to repeat
 * @returns Function that takes count and returns the repeated string
 */
export const repeatOn = curry(repeat)

/**
 * Curried version of {@link repeat} with count first.
 * @param count - The number of times to repeat
 * @returns Function that takes value and returns the repeated string
 * @example
 * ```typescript
 * const triple = repeatWith(3)
 * triple('ha') // 'hahaha'
 * ```
 */
export const repeatWith = flipCurried(repeatOn)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • removeSurrounding
//
//

/**
 * Remove all occurrences of a target character from the beginning and end of a string.
 * @param str - The string to process
 * @param target - The character to remove from both ends
 * @returns The string with surrounding target characters removed
 * @example
 * ```typescript
 * removeSurrounding('   hello   ', ' ') // 'hello'
 * removeSurrounding('***test***', '*') // 'test'
 * removeSurrounding('aaa', 'a') // ''
 * ```
 */
export const removeSurrounding = (str: string, target: string): string => {
  if (!str) return str

  let start = 0
  let end = str.length - 1

  // Remove from start
  while (start <= end && str[start] === target) {
    start++
  }

  // Remove from end
  while (end >= start && str[end] === target) {
    end--
  }

  // Return remaining portion
  return start > 0 || end < str.length - 1 ? str.substring(start, end + 1) : str
}

/**
 * Curried version of {@link removeSurrounding} with str first.
 * @param str - The string to process
 * @returns Function that takes target and returns the processed string
 */
export const removeSurroundingOn = curry(removeSurrounding)

/**
 * Curried version of {@link removeSurrounding} with target first.
 * @param target - The character to remove from both ends
 * @returns Function that takes str and returns the processed string
 */
export const removeSurroundingWith = flipCurried(removeSurroundingOn)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • truncate
//
//

/**
 * Truncate a string to a maximum length, adding ellipsis if truncated.
 * @param str - The string to truncate
 * @param maxLength - Maximum length of the result (default: 80)
 * @returns The truncated string with ellipsis if needed
 * @example
 * ```typescript
 * truncate('hello world', 8) // 'hello...'
 * truncate('short', 10) // 'short'
 * truncate('very long text that needs truncating') // 'very long text that needs truncating...' (if > 80 chars)
 * ```
 */
export const truncate = (str: string, maxLength: number = 80): string => {
  if (str.length <= maxLength) return str
  const indicator = '...'
  // No negative slice size
  const sliceSize = Math.max(maxLength - indicator.length, 0)
  return `${str.slice(0, sliceSize)}${indicator}`
}

/**
 * Curried version of {@link truncate} with str first.
 * @param str - The string to truncate
 * @returns Function that takes maxLength and returns the truncated string
 */
export const truncateOn = curry(truncate)

/**
 * Curried version of {@link truncate} with maxLength first.
 * @param maxLength - Maximum length of the result
 * @returns Function that takes str and returns the truncated string
 * @example
 * ```typescript
 * const truncate10 = truncateWith(10)
 * truncate10('hello world') // 'hello w...'
 * ```
 */
export const truncateWith = flipCurried(truncateOn)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Unorized
//
//

/**
 * Remove all occurrences of patterns from a string.
 * Alias for `replaceWith('')`.
 * @param matcher - String or RegExp pattern(s) to remove
 * @returns Function that takes a value and returns the stripped string
 * @example
 * ```typescript
 * const removeVowels = strip(/[aeiou]/g)
 * removeVowels('hello world') // 'hll wrld'
 * ```
 */
export const strip = replaceWith(Empty)

/**
 * Remove regular spaces from the beginning and end of a string.
 * Pre-configured {@link removeSurroundingWith} for regular spaces.
 * @param str - The string to process
 * @returns The string with surrounding spaces removed
 */
export const removeSurroundingSpaceRegular = removeSurroundingWith(spaceRegular)

/**
 * Remove non-breaking spaces from the beginning and end of a string.
 * Pre-configured {@link removeSurroundingWith} for non-breaking spaces.
 * @param str - The string to process
 * @returns The string with surrounding non-breaking spaces removed
 */
export const removeSurroundingSpaceNoBreak = removeSurroundingWith(spaceNoBreak)
