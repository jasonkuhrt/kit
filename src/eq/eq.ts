import { Fn } from '../fn/index.js'

export * from './type.js'

// Strict Equality Operator

export const is = (value1: unknown, value2: unknown): boolean => {
  return value1 === value2
}

export const isWith = Fn.curry(is)

export const isNot = (value1: unknown, value2: unknown): boolean => {
  return value1 !== value2
}

export const isNotWith = Fn.curry(isNot)
