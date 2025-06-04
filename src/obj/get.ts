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

import { isntEmpty, randomIndex } from '#arr/arr.js'
import type { Rec } from '#rec/index.js'
import {
  type InferShapeFromPropertyPath,
  normalizePropertyPathInput,
  type PropertyPath,
  type PropertyPathInput,
} from './path.js'
import { type Any, is } from './type.js'

// dprint-ignore
export const getWith =
  <pathInput extends PropertyPathInput>(pathInput: pathInput) =>
    <obj extends InferShapeFromPropertyPath<normalizePropertyPathInput<pathInput>>>(obj: obj):
			getWith<
				normalizePropertyPathInput<pathInput>,
				// @ts-expect-error
				obj
			> => {
				return _get(normalizePropertyPathInput(pathInput), obj as any) as any
			}

// dprint-ignore
export type getWith<
  $Path extends PropertyPath,
  $Obj extends Any
> =
  $Path extends readonly [infer __key__ extends string, ...infer __tail__ extends readonly string[]]
    ? __key__ extends keyof $Obj
      ? $Obj[__key__] extends Any
				? getWith<__tail__, $Obj[__key__]>
				: __tail__ extends readonly []
					? $Obj[__key__]
					: never // path/object mismatch
      : never // path/object mismatch
    : $Obj

/**
 * Inverses the parameter order of {@link getWith}.
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

/**
 * Get a random property value from an object
 * @param obj - The object to get a random value from
 * @returns A random value from the object, or undefined for empty objects
 *
 * @example
 * ```ts
 * getRandomly({ a: 1, b: 2, c: 3 }) // Could return 1, 2, or 3
 * getRandomly({ a: 1, b: undefined }) // Could return 1 or undefined
 * getRandomly({}) // Returns undefined
 * ```
 */
export const getRandomly = <obj extends Any>(obj: obj): keyof obj extends never ? undefined : obj[keyof obj] => {
  const keys = toKeys(obj)

  if (isntEmpty(keys)) {
    const i = randomIndex(keys)
    const key = keys[i]!
    return obj[key] as any
  }

  return undefined as any
}

const toKeys = <obj extends object>(obj: obj): (keyof obj)[] => Object.keys(obj) as any
