import { Fn } from '../fn/index.js'

export const splitWith = (separator: string) => (value: string): string[] => {
  return value.split(separator)
}

export const splitOn = Fn.flipCurry(splitWith)
