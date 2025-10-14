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
 *
 * @category Type Utilities
 *
 * @example
 * ```ts
 * type Empty = IsEmpty<{}> // true
 * type NotEmpty = IsEmpty<{ a: 1 }> // false
 * ```
 */
export type IsEmpty<$Obj extends object> = keyof $Obj extends never ? true : false

/**
 * Type for an empty object.
 *
 * @category Type Utilities
 */
export type Empty = Record<string, never>

/**
 * Subtract properties present in $B from $A (shallow operation).
 *
 * Returns a new object type containing only properties that exist in $A but not in $B.
 * This is equivalent to `Omit<$A, keyof $B>` but expresses the operation as subtraction.
 *
 * @category Type Utilities
 *
 * @template $A - The object type to subtract from
 * @template $B - The object type whose properties to remove
 *
 * @example
 * ```ts
 * type User = { name: string; age: number; email: string }
 * type Public = { name: string; age: number }
 *
 * type Private = Obj.SubtractShallow<User, Public>  // { email: string }
 * type Same = Obj.SubtractShallow<User, User>        // {}
 * ```
 *
 * @example
 * ```ts
 * // Finding what's different between two object types
 * type Config = { id: string; debug?: boolean }
 * type Provided = { id: string; invalid: true; typo: string }
 *
 * type Extra = Obj.SubtractShallow<Provided, Config>  // { invalid: true; typo: string }
 * ```
 */
export type SubtractShallow<$A, $B> = Omit<$A, keyof $B>

/**
 * Create an empty object with proper type.
 * Returns a frozen empty object typed as {@link Empty}.
 *
 * @category Predicates
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
 * Enforces that a type has no excess properties beyond those defined in the expected type.
 *
 * This utility intersects the actual type with a record that marks all excess keys as `never`,
 * causing TypeScript to reject values with properties not present in the expected type.
 * Particularly useful in generic contexts where excess property checking is bypassed.
 *
 * @category Type Utilities
 *
 * @template $Expected - The type defining allowed properties
 * @template $Actual - The actual type to check for excess properties
 *
 * @example
 * ```ts
 * type User = { name: string; age: number }
 *
 * // Standard generic - allows excess properties
 * function test1<T extends User>(input: T): void {}
 * test1({ name: 'Alice', age: 30, extra: true })  // ✓ No error (excess allowed)
 *
 * // With NoExcess - rejects excess
 * function test2<T extends User>(input: Obj.NoExcess<User, T>): void {}
 * test2({ name: 'Alice', age: 30, extra: true })  // ✗ Error: 'extra' is never
 * test2({ name: 'Alice', age: 30 })  // ✓ OK
 * ```
 *
 * @example
 * ```ts
 * // Using with optional properties
 * type Config = { id: string; debug?: boolean }
 *
 * function configure<T extends Config>(config: Obj.NoExcess<Config, T>): void {}
 *
 * configure({ id: 'test' })  // ✓ OK - optional omitted
 * configure({ id: 'test', debug: true })  // ✓ OK - optional included
 * configure({ id: 'test', invalid: 'x' })  // ✗ Error: 'invalid' is never
 * ```
 *
 * @remarks
 * This works by creating a type that's the intersection of:
 * 1. The actual type as-is
 * 2. A record marking excess keys (keys in Actual but not in Expected) as `never`
 *
 * When a property is typed as `never`, TypeScript requires that it either:
 * - Not be present at all, OR
 * - Have a value that extends `never` (which is impossible for non-never types)
 *
 * This forces a type error when excess properties are provided.
 *
 * @see {@link NoExcessNonEmpty} for non-empty variant
 */
export type NoExcess<$Expected, $Actual> = $Actual & Record<Exclude<keyof $Actual, keyof $Expected>, never>

/**
 * Like {@link NoExcess} but also requires the object to be non-empty.
 *
 * Enforces that:
 * 1. Object has at least one property (not empty)
 * 2. Object has no excess properties beyond the constraint
 *
 * @category Type Utilities
 *
 * @example
 * ```ts
 * type User = { name: string }
 *
 * type T1 = NoExcessNonEmpty<{ name: 'Alice' }, User>        // ✓ Pass
 * type T2 = NoExcessNonEmpty<{}, User>                       // ✗ Fail - empty
 * type T3 = NoExcessNonEmpty<{ name: 'Bob', age: 30 }, User> // ✗ Fail - excess
 * ```
 */
export type NoExcessNonEmpty<$Value extends object, $Constraint> = IsEmpty<$Value> extends true ? never
  : NoExcess<$Constraint, $Value>

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
 * @category Predicates
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
 * @category Predicates
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
