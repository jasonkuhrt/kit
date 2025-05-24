import { Fn } from '#fn/index.js'

export const split = (value: string, separator: string): string[] => {
  return value.split(separator)
}

export const splitOn = Fn.curry(split)

export const splitWith = Fn.flipCurried(splitOn)

export const join = (value: string[], separator: string): string => {
  return value.join(separator)
}

export const joinOn = Fn.curry(join)

export const joinWith = Fn.flipCurried(joinOn)
