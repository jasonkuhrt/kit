/**
 * Excludes `undefined` from a type.
 *
 * This utility type removes `undefined` from a union type, leaving all other types intact.
 * Useful for creating stricter type definitions or working with required values.
 *
 * @template T - The type to exclude `undefined` from
 *
 * @example
 * ```ts
 * type MaybeString = string | undefined
 * type DefinitelyString = Exclude<MaybeString>  // string
 *
 * type Complex = string | number | undefined | null
 * type WithoutUndefined = Exclude<Complex>  // string | number | null
 *
 * // Only undefined becomes never
 * type JustUndefined = Exclude<undefined>  // never
 * ```
 *
 * @example
 * ```ts
 * // Using with function parameters
 * function requireValue<T>(value: T): Exclude<T> {
 *   if (value === undefined) {
 *     throw new Error('Value cannot be undefined')
 *   }
 *   return value as Exclude<T>
 * }
 *
 * const result = requireValue('hello' as string | undefined)
 * // result: string
 * ```
 *
 * @example
 * ```ts
 * // Using with object properties
 * interface User {
 *   id: string
 *   name: string | undefined
 *   email: string | undefined | null
 * }
 *
 * type RequiredUser = {
 *   [K in keyof User]: Exclude<User[K]>
 * }
 * // RequiredUser: { id: string; name: string; email: string | null }
 * ```
 */
export type Exclude<T> = T extends undefined ? never : T
