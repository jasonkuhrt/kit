import { Arr } from '../arr/index.js'
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
