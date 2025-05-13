import { Arr } from '../arr/index.js'

export const is = (value: unknown): value is string => typeof value === `string`

export const isTemplateStringsArray = (args: unknown): args is TemplateStringsArray => {
  return Array.isArray(args) && args.length > 0 && args[0] instanceof Object && `raw` in args[0] as any
}

export type Pattern = Arr.Maybe<string | RegExp>

export const isMatchPattern = (patternOrPatterns: Pattern) => (value: string): boolean => {
  const patterns = Arr.sure(patternOrPatterns)
  return patterns.some(_match(value))
}

export const isMatchValue = (value: string) => (patternOrPatterns: Arr.Maybe<string | RegExp>): boolean => {
  const patterns = Arr.sure(patternOrPatterns)
  return patterns.some(_match(value))
}

const _match = (value: string) => (pattern: string | RegExp): boolean => {
  if (typeof pattern === `string`) {
    return value === pattern
  }
  return pattern.test(value)
}
