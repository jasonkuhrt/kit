import { Arr } from '../arr/index.js'
import { Fn } from '../fn/index.js'

export type PatternInput = Arr.Maybe<string | RegExp>

export const isMatchWith = (patternOrPatterns: PatternInput) => (value: string): boolean => {
  const patterns = Arr.sure(patternOrPatterns)
  return patterns.some(_match(value))
}

export const isMatchOn = Fn.flipCurried(isMatchWith)

const _match = (value: string) => (pattern: string | RegExp): boolean => {
  if (typeof pattern === `string`) {
    return value === pattern
  }
  return pattern.test(value)
}
