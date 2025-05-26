import { Language } from '#language/index.js'
import type { Rec } from '#rec/index.js'
import type { Undefined } from '#undefined/index.js'

export * from './path.js'

export * from './get.js'

export * from './merge.js'

export type Any = object

export const is = (value: unknown): value is Any => {
  return typeof value === Language.TypeofTypesEnum.object && value !== null
}

export const entries = <obj extends Any>(obj: obj): Language.Simplify<entries<obj>> => {
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
