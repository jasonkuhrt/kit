import type { Language } from '#language/index.js'
import { Obj } from '#obj/index.js'

export type Any = {
  [key: PropertyKey]: unknown
}

export type Value = {
  [key: PropertyKey]: Language.Value
}

export const is = (value: unknown): value is Any => {
  return Obj.is(value) && !Array.isArray(value)
}

export const merge = <rec1 extends Any, rec2 extends Any>(rec1: rec1, rec2: rec2): rec1 & rec2 => {
  return Obj.merge(rec1, rec2)
}

export type Optional<$Key extends PropertyKey, $Value> = {
  [K in $Key]?: $Value
}

export const create = <value>(): Record<PropertyKey, value> => {
  return {} as any
}
