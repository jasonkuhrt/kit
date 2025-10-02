/**
 * Makes a type nullable by adding `null` to it.
 *
 * @template $T - The type to make nullable
 *
 * @example
 * ```ts
 * type RequiredString = string
 * type NullableString = Maybe<RequiredString>  // string | null
 *
 * // Useful for database-like values
 * function findUser(id: string): Maybe<User> {
 *   // Returns User | null
 *   return users.find(u => u.id === id) ?? null
 * }
 * ```
 *
 * @example
 * ```ts
 * // Using with object properties
 * interface DatabaseRecord {
 *   deletedAt: Maybe<Date>
 *   updatedBy: Maybe<string>
 * }
 *
 * const record: DatabaseRecord = {
 *   deletedAt: null,
 *   updatedBy: 'admin'
 * }
 * ```
 */
export type Maybe<$T> = $T | null

/**
 * Excludes `null` from a type.
 *
 * This utility type removes `null` from a union type, leaving all other types intact.
 * Useful for creating stricter type definitions or working with required values.
 *
 * @template T - The type to exclude `null` from
 *
 * @example
 * ```ts
 * type MaybeString = string | null
 * type DefinitelyString = Exclude<MaybeString>  // string
 *
 * type Complex = string | number | null | undefined
 * type WithoutNull = Exclude<Complex>  // string | number | undefined
 *
 * // Only null becomes never
 * type JustNull = Exclude<null>  // never
 * ```
 *
 * @example
 * ```ts
 * // Using with function parameters
 * function requireValue<T>(value: T): Exclude<T> {
 *   if (value === null) {
 *     throw new Error('Value cannot be null')
 *   }
 *   return value as Exclude<T>
 * }
 *
 * const result = requireValue('hello' as string | null)
 * // result: string
 * ```
 *
 * @example
 * ```ts
 * // Using with object properties
 * interface User {
 *   id: string
 *   name: string | null
 *   email: string | null | undefined
 * }
 *
 * type RequiredUser = {
 *   [K in keyof User]: Exclude<User[K]>
 * }
 * // RequiredUser: { id: string; name: string; email: string | undefined }
 * ```
 */
export type Exclude<T> = T extends null ? never : T
