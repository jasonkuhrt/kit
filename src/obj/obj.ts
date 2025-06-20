import type { Language } from '#language'
import type { Rec } from '#rec'
import type { Ts } from '#ts'
import type { Undefined } from '#undefined'
import { type Any, is } from './type.ts'

export * from './path.ts'

export * from './get.ts'

export * from './merge.ts'

export * from './type.ts'

/**
 * Get an array of key-value pairs from an object.
 * Preserves exact types including optional properties and undefined values.
 *
 * @param obj - The object to extract entries from
 * @returns An array of tuples containing [key, value] pairs
 *
 * @example
 * ```ts
 * entries({ a: 1, b: 'hello', c: true })
 * // Returns: [['a', 1], ['b', 'hello'], ['c', true]]
 * ```
 *
 * @example
 * ```ts
 * // Handles optional properties and undefined values
 * entries({ a: 1, b?: 2, c: undefined })
 * // Returns proper types preserving optionality
 * ```
 */
export const entries = <obj extends Any>(obj: obj): Ts.Simplify<entries<obj>> => {
  return Object.entries(obj) as any
}

// dprint-ignore
export type entries<obj extends Any> = {
  [K in keyof obj]-?: // Regarding "-?": we don't care about keys being undefined when we're trying to list out all the possible entries
    undefined extends obj[K]
      ? {} extends Pick<obj, K>
        ? [K, Undefined.Exclude<obj[K]>] // Optional key - remove only undefined, preserve null
        : [K, obj[K]] // Required key with undefined - preserve exact type including undefined
      : [K, obj[K]] // Required key without undefined - preserve exact type
}[keyof obj][]

/**
 * Create a type predicate function that checks if a value matches a shape specification.
 * Uses JavaScript's `typeof` operator to validate property types.
 *
 * @param spec - An object mapping property names to their expected typeof results
 * @returns A type predicate function that checks if a value matches the shape
 *
 * @example
 * ```ts
 * const isUser = isShape<{ name: string; age: number }>({
 *   name: 'string',
 *   age: 'number'
 * })
 *
 * isUser({ name: 'Alice', age: 30 }) // true
 * isUser({ name: 'Bob' }) // false - missing age
 * isUser({ name: 'Charlie', age: '30' }) // false - age is string
 * ```
 *
 * @example
 * ```ts
 * // Can check for functions and other typeof types
 * const isCallback = isShape<{ fn: Function }>({
 *   fn: 'function'
 * })
 * ```
 */
export const isShape = <type>(spec: Record<PropertyKey, Language.TypeofTypes>) => (value: unknown): value is type => {
  if (!is(value)) return false
  const obj_ = value as Rec.Any

  return entries(spec).every(([key, typeofType]) => {
    return typeof obj_[key] === typeofType
  })
}

/**
 * Check if an object has no enumerable properties.
 *
 * @param obj - The object to check
 * @returns True if the object has no enumerable properties, false otherwise
 *
 * @example
 * ```ts
 * isEmpty({}) // true
 * isEmpty({ a: 1 }) // false
 * isEmpty(Object.create(null)) // true
 * ```
 *
 * @example
 * ```ts
 * // Only checks enumerable properties
 * const obj = {}
 * Object.defineProperty(obj, 'hidden', { value: 1, enumerable: false })
 * isEmpty(obj) // true - non-enumerable properties are ignored
 * ```
 */
export const isEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0
}

/**
 * Type predicate that checks if an object has no enumerable properties.
 * Narrows the type to an empty object literal type.
 *
 * @param obj - The object to check
 * @returns True if the object has no enumerable properties, with type narrowing
 *
 * @example
 * ```ts
 * const obj: { a?: number } = {}
 * if (isEmpty$(obj)) {
 *   // obj is now typed as {}
 * }
 * ```
 *
 * @example
 * ```ts
 * // Useful in conditional type flows
 * function processObject<T extends object>(obj: T) {
 *   if (isEmpty$(obj)) {
 *     // obj is {} here
 *     return 'empty'
 *   }
 *   // obj retains its original type here
 * }
 * ```
 */
export const isEmpty$ = (obj: object): obj is {} => {
  return Object.keys(obj).length === 0
}

const PrivateStateSymbol = Symbol('PrivateState')

/**
 * Attach private state to an object using a non-enumerable Symbol property.
 * The state is immutable once set and cannot be discovered through enumeration.
 *
 * @param obj - The object to attach private state to
 * @param value - The state object to attach
 * @returns The original object with private state attached
 *
 * @example
 * ```ts
 * const user = { name: 'Alice' }
 * const privateData = { password: 'secret123' }
 *
 * setPrivateState(user, privateData)
 * // user still appears as { name: 'Alice' } when logged
 * // but has hidden private state accessible via getPrivateState
 * ```
 *
 * @example
 * ```ts
 * // Useful for attaching metadata without polluting the object
 * const config = { timeout: 5000 }
 * setPrivateState(config, {
 *   source: 'environment',
 *   timestamp: Date.now()
 * })
 * ```
 */
export const setPrivateState = <obj extends Any>(obj: obj, value: object): obj => {
  Object.defineProperty(obj, PrivateStateSymbol, {
    value,
    writable: false,
    enumerable: false,
    configurable: false,
  })
  return obj
}

/**
 * Retrieve private state previously attached to an object with setPrivateState.
 *
 * @param obj - The object to retrieve private state from
 * @returns The private state object
 * @throws Error if no private state is found on the object
 *
 * @example
 * ```ts
 * const user = { name: 'Alice' }
 * setPrivateState(user, { role: 'admin' })
 *
 * const privateData = getPrivateState<{ role: string }>(user)
 * console.log(privateData.role) // 'admin'
 * ```
 *
 * @example
 * ```ts
 * // Type-safe private state retrieval
 * interface Metadata {
 *   createdAt: number
 *   createdBy: string
 * }
 *
 * const doc = { title: 'Report' }
 * setPrivateState(doc, { createdAt: Date.now(), createdBy: 'system' })
 *
 * const meta = getPrivateState<Metadata>(doc)
 * // meta is typed as Metadata
 * ```
 */
export const getPrivateState = <state extends Any>(obj: Any): state => {
  const descriptor = Object.getOwnPropertyDescriptor(obj, PrivateStateSymbol)
  if (!descriptor) throw new Error('Private state not found')
  return descriptor.value
}

/**
 * Create a new object with only the specified properties.
 *
 * @param obj - The object to pick properties from
 * @param keys - Array of property keys to include
 * @returns A new object containing only the specified properties
 *
 * @example
 * ```ts
 * const user = { name: 'Alice', age: 30, email: 'alice@example.com' }
 * const publicInfo = pick(user, ['name', 'email'])
 * // Result: { name: 'Alice', email: 'alice@example.com' }
 * ```
 *
 * @example
 * ```ts
 * // Type-safe property selection
 * interface User {
 *   id: number
 *   name: string
 *   password: string
 *   email: string
 * }
 *
 * function getPublicUser(user: User) {
 *   return pick(user, ['id', 'name', 'email'])
 *   // Type: Pick<User, 'id' | 'name' | 'email'>
 * }
 * ```
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Create a new object with the specified properties removed.
 *
 * @param obj - The object to omit properties from
 * @param keys - Array of property keys to exclude
 * @returns A new object without the specified properties
 *
 * @example
 * ```ts
 * const user = { name: 'Alice', age: 30, password: 'secret' }
 * const safeUser = omit(user, ['password'])
 * // Result: { name: 'Alice', age: 30 }
 * ```
 *
 * @example
 * ```ts
 * // Remove sensitive fields
 * interface User {
 *   id: number
 *   name: string
 *   password: string
 *   apiKey: string
 * }
 *
 * function sanitizeUser(user: User) {
 *   return omit(user, ['password', 'apiKey'])
 *   // Type: Omit<User, 'password' | 'apiKey'>
 * }
 * ```
 */
export const omit = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> => {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result as Omit<T, K>
}

// dprint-ignore
export type PartialDeep<$Type> =
  $Type extends Array<infer __inner__>                  ? Array<PartialDeep<__inner__>> :
  $Type extends ReadonlyArray<infer __inner__>          ? ReadonlyArray<PartialDeep<__inner__>> :
  $Type extends Promise<infer __inner__>                ? Promise<PartialDeep<__inner__>> :
  $Type extends Function                                ? $Type :
  $Type extends object                                  ? {
                                                            [key in keyof $Type]?: PartialDeep<$Type[key]>
                                                          } :
                                                        // else
                                                          $Type
