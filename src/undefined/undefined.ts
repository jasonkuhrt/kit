import { isNotTypeWith, isTypeWith } from '#eq/type.js'

export const is = isTypeWith(undefined)

export const isNot = isNotTypeWith(undefined)

// export const is = (value: unknown): value is undefined => {
//   return value === undefined
// }

// export const isNot = <T>(value: T): value is Exclude<T> => {
//   return value !== undefined
// }

export type Exclude<T> = T extends undefined ? never : T
