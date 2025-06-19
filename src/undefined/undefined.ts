import { isntTypeWith, isTypeWith } from '#eq/type.js'

/**
 * Checks if a value is `undefined`.
 *
 * This is a type guard that narrows the type to `undefined` when it returns `true`.
 *
 * @param value - The value to check
 * @returns `true` if the value is `undefined`, `false` otherwise
 *
 * @example
 * ```ts
 * const value: string | undefined = getValue()
 *
 * if (is(value)) {
 *   // value is undefined here
 *   console.log('Value is undefined')
 * } else {
 *   // value is string here
 *   console.log(value.toUpperCase())
 * }
 * ```
 *
 * @example
 * ```ts
 * // Filtering arrays
 * const items = ['a', undefined, 'b', undefined, 'c']
 * const defined = items.filter(item => !is(item))
 * // defined: string[]
 *
 * // With optional properties
 * interface User {
 *   name: string
 *   email?: string
 * }
 *
 * function sendEmail(user: User) {
 *   if (is(user.email)) {
 *     console.log('No email address provided')
 *   } else {
 *     // user.email is string here
 *     send(user.email)
 *   }
 * }
 * ```
 */
export const is = isTypeWith(undefined)

/**
 * Checks if a value is not `undefined`.
 *
 * This is a type guard that narrows the type by excluding `undefined` when it returns `true`.
 * The opposite of {@link is}.
 *
 * @param value - The value to check
 * @returns `true` if the value is not `undefined`, `false` otherwise
 *
 * @example
 * ```ts
 * const value: string | undefined = getValue()
 *
 * if (isnt(value)) {
 *   // value is string here (undefined is excluded)
 *   console.log(value.toUpperCase())
 * } else {
 *   // value is undefined here
 *   console.log('Value is undefined')
 * }
 * ```
 *
 * @example
 * ```ts
 * // Filtering out undefined values
 * const items: (string | undefined)[] = ['a', undefined, 'b', undefined, 'c']
 * const defined = items.filter(isnt)
 * // defined: string[] (all undefined values removed)
 *
 * // Using with map
 * const maybeNumbers: (number | undefined)[] = [1, undefined, 2, undefined, 3]
 * const doubled = maybeNumbers
 *   .filter(isnt)
 *   .map(n => n * 2)
 * // doubled: number[] = [2, 4, 6]
 * ```
 *
 * @example
 * ```ts
 * // Type narrowing in conditionals
 * function processValue(value: string | number | undefined) {
 *   if (isnt(value)) {
 *     // value is string | number here
 *     if (typeof value === 'string') {
 *       return value.toUpperCase()
 *     } else {
 *       return value * 2
 *     }
 *   }
 *   return 'undefined'
 * }
 * ```
 */
export const isnt = isntTypeWith(undefined)

// export const is = (value: unknown): value is undefined => {
//   return value === undefined
// }

// export const isNot = <T>(value: T): value is Exclude<T> => {
//   return value !== undefined
// }

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
