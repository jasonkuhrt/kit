import type { Language } from '../language/index.js'
import { Obj } from '../obj/index.js'

export type Any = {
  [key: PropertyKey]: unknown
}

export type Value = {
  [key: PropertyKey]: Language.Value
}

export const is = (value: unknown): value is Any => {
  return Obj.is(value) && !Array.isArray(value)
}
