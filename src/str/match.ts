import { Arr } from '#arr/index.js'
import { Fn } from '#fn/index.js'
import type { Undefined } from '#undefined/index.js'

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
            ? Arr.ReduceWithIntersection<ToGroupsProperties<$Matches['groups']>>
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

export const pattern = <matches extends Matches>(pattern: RegExp): Pattern<matches> => {
  return pattern as any
}

// todo: technically undefined on its own is not valid, it is: string | (string | undefined)
export type Matches = {
  groups?: (string | undefined)[]
  indicies?: (string | undefined)[]
}

// export type MatchesToObject

export const match = <matches extends Matches>(
  string: string,
  pattern: RegExp | Pattern<matches>,
): RegExpMatchResult<matches> => {
  return string.match(pattern) as any
}

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

export const isntMatch = (pattern: PatternInput) => (value: string): boolean => {
  return !isMatch(value, pattern)
}

export const isntMatchOn = Fn.curry(isntMatch)

export const isntMatchWith = Fn.flipCurried(isntMatchOn)

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
