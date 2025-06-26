import type { Lang } from '#lang'
import { Obj } from '#obj'

export type Any = {
  [key: PropertyKey]: unknown
}

export type Value = {
  [key: PropertyKey]: Lang.Value
}

/**
 * Check if a value is a record (plain object that is not an array).
 * Records are objects with string, number, or symbol keys mapping to any values.
 *
 * @param value - The value to check
 * @returns True if the value is a record, false otherwise
 *
 * @example
 * ```ts
 * is({ a: 1, b: 2 }) // true
 * is({}) // true
 * is(Object.create(null)) // true
 * is([1, 2, 3]) // false - arrays are not records
 * is(null) // false
 * is(new Date()) // false - class instances are not records
 * ```
 *
 * @example
 * ```ts
 * // Type guard usage
 * function processData(data: unknown) {
 *   if (is(data)) {
 *     // data is typed as Rec.Any
 *     Object.keys(data).forEach(key => {
 *       console.log(data[key])
 *     })
 *   }
 * }
 * ```
 */
export const is = (value: unknown): value is Any => {
  return Obj.Type.is(value) && !Array.isArray(value)
}

/**
 * Deep merge two records, with properties from the second record overwriting the first.
 * This is an alias for Obj.merge that works specifically with record types.
 *
 * @param rec1 - The base record to merge into
 * @param rec2 - The record to merge from
 * @returns A new record with properties from both records merged
 *
 * @example
 * ```ts
 * merge({ a: 1, b: 2 }, { b: 3, c: 4 })
 * // Returns: { a: 1, b: 3, c: 4 }
 * ```
 *
 * @example
 * ```ts
 * // Deep merging of nested records
 * merge(
 *   { user: { name: 'Alice', settings: { theme: 'dark' } } },
 *   { user: { settings: { fontSize: 16 } } }
 * )
 * // Returns: { user: { name: 'Alice', settings: { theme: 'dark', fontSize: 16 } } }
 * ```
 *
 * @example
 * ```ts
 * // Type-safe merging
 * type Config = { api: { url: string }; timeout?: number }
 * type Overrides = { api: { key: string }; timeout: number }
 *
 * const config: Config = { api: { url: 'https://api.com' } }
 * const overrides: Overrides = { api: { key: 'secret' }, timeout: 5000 }
 * const merged = merge(config, overrides)
 * // merged is typed as Config & Overrides
 * ```
 */
export const merge = <rec1 extends Any, rec2 extends Any>(rec1: rec1, rec2: rec2): rec1 & rec2 => {
  return Obj.merge(rec1, rec2)
}

export type Optional<$Key extends PropertyKey, $Value> = {
  [K in $Key]?: $Value
}

/**
 * Create an empty record with a specific value type.
 * Useful for initializing typed record collections.
 *
 * @returns An empty record typed to hold values of the specified type
 *
 * @example
 * ```ts
 * const scores = create<number>()
 * scores['alice'] = 95
 * scores['bob'] = 87
 * // scores is typed as Record<PropertyKey, number>
 * ```
 *
 * @example
 * ```ts
 * // Creating typed lookups
 * interface User {
 *   id: string
 *   name: string
 * }
 *
 * const userLookup = create<User>()
 * userLookup['u123'] = { id: 'u123', name: 'Alice' }
 * ```
 *
 * @example
 * ```ts
 * // Useful as accumulator in reduce operations
 * const grouped = items.reduce(
 *   (acc, item) => {
 *     acc[item.category] = item
 *     return acc
 *   },
 *   create<Item>()
 * )
 * ```
 */
export const create = <value>(): Record<PropertyKey, value> => {
  return {} as any
}
