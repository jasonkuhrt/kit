import { Arr } from '#arr/index.js'
import { Fn } from '#fn/index.js'
import { Obj } from '#obj/index.js'
import type { Rec } from '#rec/index.js'

export type Pattern<$Value> = Partial<$Value>

export const isMatch = <value>(value: value, pattern: Pattern<value>): boolean => {
  if (Obj.is(value)) {
    const value_ = value as Rec.Any

    return Object.entries(pattern).every(([patternKey, patternValue]) => {
      const valueValue = value_[patternKey]
      return isMatch(valueValue, patternValue as any)
    })
  }

  return value === pattern
}

export const isMatchOn = Fn.curry(isMatch)

export const isMatchWith = Fn.flipCurried(isMatchOn)
