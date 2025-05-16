import { Arr } from '../arr/index.js'
import { flipCurry } from '../fn/base.js'
import type { PatternInput } from './match.js'

// Leading

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

// General

export const replace = (replacement: string, matcher: PatternInput, value: string): string => {
  const patterns = Arr.sure(matcher)
  return patterns.reduce<string>((value, pattern) => {
    return value.replaceAll(pattern, replacement)
  }, value)
}

export const replaceWith = (replacement: string) => (matcher: PatternInput) => (value: string): string => {
  return replace(replacement, matcher, value)
}

export const replaceOn = (value: string) => (replacement: string) => (matcher: PatternInput): string => {
  return replace(replacement, matcher, value)
}

export const strip = replaceWith(``)

// append

export const append = (value1: string, value2: string): string => {
  return value2 + value1
}

export const appendOn = (value1: string) => (value2: string): string => {
  return append(value1, value2)
}

export const appendWith = flipCurry(appendOn)

// prepend

export const prepend = (value1: string, value2: string): string => {
  return value1 + value2
}

export const prependOn = (value1: string) => (value2: string): string => {
  return prepend(value1, value2)
}

export const prependWith = flipCurry(prependOn)

// repeat

export const repeat = (value: string, count: number): string => {
  return value.repeat(count)
}

export const repeatOn = (value: string) => (count: number): string => {
  return repeat(value, count)
}

export const repeatWith = flipCurry(repeatOn)
