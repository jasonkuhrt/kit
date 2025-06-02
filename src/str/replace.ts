import { sure } from '#arr/arr.js'
import { curry, flipCurried } from '#fn/curry.js'
import { Empty } from '#str/type.js'
import { spaceNoBreak, spaceRegular } from './char/char.js'
import type { PatternsInput } from './match.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Builtins
//
//

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

export const replaceLeading = (replacement: string, matcher: string, value: string): string => {
  if (!value.startsWith(matcher)) return value
  return replacement + value.slice(matcher.length)
}

export const replaceLeadingWith = (replacement: string) => (matcher: string) => (value: string): string => {
  return replaceLeading(replacement, matcher, value)
}

export const replaceLeadingOn = (value: string) => (replacement: string) => (matcher: string): string => {
  return replaceLeading(replacement, matcher, value)
}

export const stripLeading = replaceLeadingWith(``)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • replace
//
//

export const replace = (replacement: string, matcher: PatternsInput, value: string): string => {
  const patterns = sure(matcher)
  return patterns.reduce<string>((value, pattern) => {
    return value.replaceAll(pattern, replacement)
  }, value)
}

export const replaceWith = (replacement: string) => (matcher: PatternsInput) => (value: string): string => {
  return replace(replacement, matcher, value)
}

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

export const append = (value1: string, value2: string): string => {
  return value1 + value2
}

export const appendOn = curry(append)

export const appendWith = flipCurried(appendOn)

// prepend

export const prepend = (value1: string, value2: string): string => {
  return value2 + value1
}

export const prependOn = curry(prepend)

export const prependWith = flipCurried(prependOn)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • repeat
//
//

export const repeat = (value: string, count: number): string => {
  return value.repeat(count)
}

export const repeatOn = curry(repeat)

export const repeatWith = flipCurried(repeatOn)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • removeSurrounding
//
//

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

export const removeSurroundingOn = curry(removeSurrounding)

export const removeSurroundingWith = flipCurried(removeSurroundingOn)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • truncate
//
//

export const truncate = (str: string, maxLength: number = 80): string => {
  if (str.length <= maxLength) return str
  const indicator = '...'
  // No negative slice size
  const sliceSize = Math.max(maxLength - indicator.length, 0)
  return `${str.slice(0, sliceSize)}${indicator}`
}

export const truncateOn = curry(truncate)

export const truncateWith = flipCurried(truncateOn)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Unorized
//
//

export const strip = replaceWith(Empty)

export const removeSurroundingSpaceRegular = removeSurroundingWith(spaceRegular)

export const removeSurroundingSpaceNoBreak = removeSurroundingWith(spaceNoBreak)
