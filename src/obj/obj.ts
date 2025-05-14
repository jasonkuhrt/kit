import { Language } from '../language/index.js'
import type { Rec } from '../rec/index.js'
import { Str } from '../str/index.js'

export * from './merge.js'

export type Any = object

export const is = (value: unknown): value is Any => {
  return typeof value === Language.TypeofTypesEnum.object && value !== null
}

export const entries = <obj extends Any>(obj: obj): Language.Simplify<entries<obj>> => {
  return Object.entries(obj) as any
}

export type entries<obj extends Any> = {
  [__key__ in keyof obj]: [__key__, obj[__key__]]
}[keyof obj][]

export const isIsh = <type>(spec: Record<PropertyKey, Language.TypeofTypes>) => (value: unknown): value is type => {
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

// Path

/**
 * Access a nested property in an object using a dot-notation path string
 * @example
 * ```ts
 * get(`user.address.city`, { user: { address: { city: `New York` } } })
 * // Returns: `New York`
 * ```
 * @example
 * ```ts
 * get([`user`, `address`, `city`], { user: { address: { city: `New York` } } })
 * // Returns: `New York`
 * ```
 */
export const get = (pathInput: PropertyPathInput) => (obj: Any): unknown => {
  return _get(normalizePropertyPathInput(pathInput), obj)
}

/**
 * Inverses the parameter order of {@link get}.
 */
export const getOn = (obj: Any) => (pathInput: PropertyPathInput): unknown => {
  return _get(normalizePropertyPathInput(pathInput), obj)
}

const _get = (propertyPath: PropertyPath, obj: Any): unknown => {
  return propertyPath.reduce<unknown>((acc, part) => {
    return is(acc)
      ? (acc as Rec.Any)[part]
      : undefined
  }, obj)
}

export type PropertyPath = string[]

export type PropertyPathInput = string | PropertyPath

export const normalizePropertyPathInput = (pathInput: PropertyPathInput): PropertyPath => {
  return Str.is(pathInput)
    ? parsePropertyPath(pathInput)
    : pathInput
}

export const PropertyPathSeparator = `.`

export const parsePropertyPath = Str.split(PropertyPathSeparator)
