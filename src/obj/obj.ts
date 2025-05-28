import type { Language } from '#language/index.js'
import type { Rec } from '#rec/index.js'
import type { Ts } from '#ts/index.js'
import type { Undefined } from '#undefined/index.js'
import { type Any, is, isNot } from './type.js'

export * from './path.js'

export * from './get.js'

export * from './merge.js'

export * from './type.js'

export const entries = <obj extends Any>(obj: obj): Ts.Simplify<entries<obj>> => {
  return Object.entries(obj) as any
}

// dprint-ignore
export type entries<obj extends Any> = {
  [K in keyof obj]-?: // Regarding "-?": we don't care about keys being undefined when we're trying to list out all the possible entries
    undefined extends obj[K]
      ? {} extends Pick<obj, K>
        ? [K, Undefined.Exclude<obj[K]>] // Optional key - remove only undefined, preserve null
        : [K, obj[K]] // Required key with undefined - preserve exact type including undefined
      : [K, obj[K]] // Required key without undefined - preserve exact type
}[keyof obj][]

export const isShape = <type>(spec: Record<PropertyKey, Language.TypeofTypes>) => (value: unknown): value is type => {
  if (!is(value)) return false
  const obj_ = value as Rec.Any

  return entries(spec).every(([key, typeofType]) => {
    return typeof obj_[key] === typeofType
  })
}

export const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0
}

export const isEmpty$ = (obj: object): obj is {} => {
  return Object.keys(obj).length === 0
}

const PrivateStateSymbol = Symbol('PrivateState')

export const setPrivateState = <obj extends Any>(obj: obj, value: object): obj => {
  Object.defineProperty(obj, PrivateStateSymbol, {
    value,
    writable: false,
    enumerable: false,
    configurable: false,
  })
  return obj
}

export const getPrivateState = <state extends Any>(obj: Any): state => {
  const value = Object.getOwnPropertyDescriptor(obj, PrivateStateSymbol)
  if (isNot(value)) throw new Error('Private state not found')
  return value
}
