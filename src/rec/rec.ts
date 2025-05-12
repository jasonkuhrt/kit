import { Obj } from '../obj/index.js'

export type Any = {
  [key: PropertyKey]: unknown
}

export const is = (value: unknown): value is Any => {
  return Obj.is(value) && !Array.isArray(value)
}
