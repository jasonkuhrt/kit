import { TypeofTypesEnum } from '#language/language.js'

export type Any = object

export const is = (value: unknown): value is Any => {
  return typeof value === TypeofTypesEnum.object && value !== null
}
