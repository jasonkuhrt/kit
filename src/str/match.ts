import { Arr } from '#arr/index.js'
import { Fn } from '#fn/index.js'

// One

export type PatternInput = string | RegExp

export const isMatch = (value: string, pattern: PatternInput): boolean => {
  if (typeof pattern === `string`) {
    return value === pattern
  }
  return pattern.test(value)
}

export const isMatchOn = Fn.curry(isMatch)

export const isMatchWith = Fn.flipCurried(isMatchOn)

export const isNotMatch = (pattern: PatternInput) => (value: string): boolean => {
  return !isMatch(value, pattern)
}

export const isNotMatchOn = Fn.curry(isNotMatch)

export const isNotMatchWith = Fn.flipCurried(isNotMatchOn)

// Any

export type PatternsInput = Arr.Maybe<string | RegExp>

export const isMatchAny = (value: string, patterns: PatternsInput): boolean => {
  const patterns_ = Arr.sure(patterns)
  return patterns_.some(isMatchOn(value))
}

export const isMatchAnyOn = Fn.curry(isMatchAny)

export const isMatchAnyWith = Fn.flipCurried(isMatchAnyOn)

export const isNotMatchAny = (patternOrPatterns: PatternsInput) => (value: string): boolean => {
  return !isMatchAny(value, patternOrPatterns)
}

export const isNotMatchAnyOn = Fn.curry(isNotMatchAny)

export const isNotMatchAnyWith = Fn.flipCurried(isNotMatchAnyOn)
