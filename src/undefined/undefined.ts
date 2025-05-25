export const is = (value: unknown): value is undefined => {
  return value === undefined
}

export type Exclude<T> = T extends undefined ? never : T

export type ExcludeFrom<T, U> = T extends U ? never : T

export const isNot = <T>(value: T): value is Exclude<T> => {
  return value !== undefined
}

export const filter = <T>(array: T[]): Exclude<T>[] => {
  return array.filter(isNot) as Exclude<T>[]
}

export const orElse = <T>(value: T | undefined, fallback: T): T => {
  return value !== undefined ? value : fallback
}

export const orElseGet = <T>(value: T | undefined, fallback: () => T): T => {
  return value !== undefined ? value : fallback()
}
