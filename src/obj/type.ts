import { TypeofTypesEnum } from '../language/language.ts'

// todo: Arr.Any/Unknown, Prom.Any/Unknown, etc. -- but this has no generics, we need a new term pattern here, e.g.: "Some", "Data", "Datum", "Item", "Element", "Value", "$", ... ?
export type Any = object

export const is = (value: unknown): value is Any => {
  return typeof value === TypeofTypesEnum.object && value !== null
}

export const isnt = (value: unknown): value is Exclude<typeof value, Any> => {
  return !is(value)
}
