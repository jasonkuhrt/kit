import { flipCurried } from '#fn/curry.js'
import { curry } from '#fn/curry.js'

export const split = (value: string, separator: string): string[] => {
  return value.split(separator)
}

export const splitOn = curry(split)

export const splitWith = flipCurried(splitOn)

export const join = (value: string[], separator: string): string => {
  return value.join(separator)
}

export const joinOn = curry(join)

export const joinWith = flipCurried(joinOn)

// merge

export const merge = (string1: string, string2: string): string => {
  return string1 + string2
}

export const mergeOn = curry(merge)
