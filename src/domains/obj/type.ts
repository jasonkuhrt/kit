import type { Ts } from '#ts'

// todo: Arr.Any/Unknown, Prom.Any/Unknown, etc. -- but this has no generics, we need a new term pattern here, e.g.: "Some", "Data", "Datum", "Item", "Element", "Value", "$", ... ?
export type Any = object

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Types
//
//
//
//

/**
 * Type-level check to determine if an object type has no keys.
 * @example
 * ```ts
 * type Empty = IsEmpty<{}> // true
 * type NotEmpty = IsEmpty<{ a: 1 }> // false
 * ```
 */
export type IsEmpty<$Obj extends object> = keyof $Obj extends never ? true : false

/**
 * Type for an empty object.
 */
export type Empty = Record<string, never>

/**
 * Create an empty object with proper type.
 * Returns a frozen empty object typed as {@link Empty}.
 *
 * @returns An empty object with type `Record<string, never>`
 *
 * @example
 * ```ts
 * const opts = options ?? Obj.empty()
 * ```
 *
 * @example
 * ```ts
 * // Type is properly inferred as Empty
 * const emptyObj = Obj.empty()
 * type T = typeof emptyObj  // Record<string, never>
 * ```
 */
export const empty = (): Empty => Object.freeze({}) as Empty

/**
 * Like Ts.Exact but also requires the value to be non-empty.
 *
 * @example
 * ```ts
 * type T1 = ExactNonEmpty<{}, { a: string }>  // never (empty object)
 * type T2 = ExactNonEmpty<{ a: string }, { a: string }>  // { a: string }
 * ```
 */
export type ExactNonEmpty<$Value extends object, $Constraint> = IsEmpty<$Value> extends true ? never
  : Ts.Exact<$Value, $Constraint>

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Runtime Functions
//
//
//
//

/**
 * Check if an object has no enumerable properties.
 *
 * @param obj - The object to check
 * @returns True if the object has no enumerable properties
 *
 * @example
 * ```ts
 * isEmpty({}) // true
 * isEmpty({ a: 1 }) // false
 * ```
 *
 * @example
 * ```ts
 * // Non-enumerable properties are ignored
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
 * Narrows the type to an empty object type.
 *
 * @param obj - The object to check
 * @returns True if the object has no enumerable properties, with type narrowing to Empty
 *
 * @example
 * ```ts
 * const obj: { a?: number } = {}
 * if (isEmpty$(obj)) {
 *   // obj is now typed as Empty
 * }
 * ```
 *
 * @example
 * ```ts
 * // Useful in conditional type flows
 * function processObject<T extends object>(obj: T) {
 *   if (isEmpty$(obj)) {
 *     // obj is Empty here
 *     return 'empty'
 *   }
 *   // obj retains its original type here
 * }
 * ```
 */
export const isEmpty$ = <$T extends object>(obj: $T): obj is $T & Empty => {
  return Object.keys(obj).length === 0
}
