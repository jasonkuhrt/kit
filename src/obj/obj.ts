import type { Rec, Simplify, TypeofTypes } from '../exports/index.js'

export type Any = object

export const is = (value: unknown): value is Any => {
  return typeof value === `object` && value !== null
}

export const entries = <obj extends Any>(obj: obj): Simplify<entries<obj>> => {
  return Object.entries(obj) as any
}

export type entries<obj extends Any> = {
  [__key__ in keyof obj]: [__key__, obj[__key__]]
}[keyof obj][]

export const isIsh = <type>(spec: Record<PropertyKey, TypeofTypes>) => (value: unknown): value is type => {
  if (!is(value)) return false
  const obj_ = value as Rec.Any

  return entries(spec).every(([key, typeofType]) => {
    return typeof obj_[key] === typeofType
  })
}
