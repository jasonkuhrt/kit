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

import { isntEmpty, randomIndex } from '#arr/arr'
import type { Rec } from '#rec'
import {
  type InferShapeFromPropertyPath,
  normalizePropertyPathInput,
  type PropertyPath,
  type PropertyPathInput,
} from './path.ts'
import { type Any, is } from './type.ts'

/**
 * Create a getter function for a specific property path.
 * Returns a function that extracts the value at that path from any compatible object.
 *
 * @param pathInput - A dot-notation string or array of property names
 * @returns A function that extracts the value at the specified path
 *
 * @example
 * ```ts
 * const getCityName = getWith('address.city')
 * getCityName({ address: { city: 'NYC' } }) // 'NYC'
 * getCityName({ address: { city: 'LA' } }) // 'LA'
 * ```
 *
 * @example
 * ```ts
 * // Type-safe property access
 * const getAge = getWith(['user', 'profile', 'age'])
 * const data = { user: { profile: { age: 30 } } }
 * const age = getAge(data) // number
 * ```
 *
 * @example
 * ```ts
 * // Useful for mapping over arrays
 * const users = [
 *   { name: 'Alice', score: 95 },
 *   { name: 'Bob', score: 87 }
 * ]
 * users.map(getWith('score')) // [95, 87]
 * ```
 */
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
 * Create a getter function bound to a specific object.
 * Returns a function that can extract values from that object using any property path.
 * Inverse parameter order of {@link getWith}.
 *
 * @param obj - The object to extract values from
 * @returns A function that accepts a property path and returns the value at that path
 *
 * @example
 * ```ts
 * const user = {
 *   name: 'Alice',
 *   address: { city: 'NYC', zip: '10001' }
 * }
 *
 * const getUserProp = getOn(user)
 * getUserProp('name') // 'Alice'
 * getUserProp('address.city') // 'NYC'
 * getUserProp(['address', 'zip']) // '10001'
 * ```
 *
 * @example
 * ```ts
 * // Useful for extracting multiple properties
 * const config = { api: { url: 'https://api.com', key: 'secret' } }
 * const getConfig = getOn(config)
 *
 * const apiUrl = getConfig('api.url')
 * const apiKey = getConfig('api.key')
 * ```
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
