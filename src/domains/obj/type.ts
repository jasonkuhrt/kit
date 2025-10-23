import type { Str } from '#str'
import type { Ts } from '#ts'
import type { O } from 'ts-toolbelt'

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

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Type Comparison Utilities
//
//
//
//

/**
 * Extract keys that are shared between two object types.
 *
 * Returns a union of keys that exist in both `$A` and `$B`.
 * Useful for finding common properties when comparing object types.
 *
 * @category Type Utilities
 *
 * @template $A - First object type
 * @template $B - Second object type
 *
 * @example
 * ```ts
 * type A = { a: string; b: number; c: boolean }
 * type B = { b: string; c: number; d: Date }
 *
 * type Shared = Obj.SharedKeys<A, B>  // "b" | "c"
 * ```
 *
 * @example
 * ```ts
 * // No shared keys
 * type X = { a: string }
 * type Y = { b: number }
 * type None = Obj.SharedKeys<X, Y>  // never
 *
 * // All keys shared
 * type Same = Obj.SharedKeys<{ a: 1; b: 2 }, { a: 3; b: 4 }>  // "a" | "b"
 * ```
 */
export type SharedKeys<$A extends object, $B extends object> = O.IntersectKeys<$A, $B>

/**
 * Remove specified keys from an object type, with forced evaluation.
 *
 * Similar to TypeScript's built-in `Omit`, but ensures the resulting type
 * is fully evaluated rather than showing as `Omit<T, K>` in error messages.
 * This makes type errors more readable by displaying the actual resulting object type.
 *
 * @category Type Utilities
 *
 * @template $T - The object type to remove keys from
 * @template $Keys - Union of keys to remove
 *
 * @example
 * ```ts
 * type User = { id: string; name: string; email: string; password: string }
 *
 * type Public = Obj.ExcludeKeys<User, 'password'>
 * // { id: string; name: string; email: string }
 *
 * type Minimal = Obj.ExcludeKeys<User, 'email' | 'password'>
 * // { id: string; name: string }
 * ```
 *
 * @example
 * ```ts
 * // Difference from Omit - better error messages
 * type WithOmit = Omit<User, 'password'>  // Displays as: Omit<User, "password">
 * type WithExclude = Obj.ExcludeKeys<User, 'password'>  // Displays as: { id: string; name: string; email: string }
 * ```
 */
export type ExcludeKeys<$T, $Keys> = {
  [k in Exclude<keyof $T, $Keys>]: $T[k]
}

/**
 * Find properties that exist in both object types but have different types.
 *
 * For each shared key, compares the types of the properties. If they differ,
 * returns an object with `{ expected: TypeA, actual: TypeB }` for that key.
 * If types match, returns `never` for that key (which can be filtered out with {@link OmitNever}).
 *
 * @category Type Utilities
 *
 * @template $Expected - The expected object type
 * @template $Actual - The actual object type to compare
 *
 * @example
 * ```ts
 * type Expected = { id: string; name: string; count: number }
 * type Actual = { id: number; name: string; count: string }
 *
 * type Diff = Obj.Mismatched<Expected, Actual>
 * // {
 * //   id: { expected: string; actual: number }
 * //   name: never  // Types match
 * //   count: { expected: number; actual: string }
 * // }
 * ```
 *
 * @example
 * ```ts
 * // Combined with OmitNever to get only mismatches
 * type OnlyMismatches = Obj.OmitNever<Obj.Mismatched<Expected, Actual>>
 * // {
 * //   id: { expected: string; actual: number }
 * //   count: { expected: number; actual: string }
 * // }
 * ```
 */
// dprint-ignore
export type Mismatched<$Expected extends object, $Actual extends object> = {
  [k in SharedKeys<$Expected, $Actual>]: k extends keyof $Expected
    ? k extends keyof $Actual
      ? $Expected[k] extends $Actual[k]
        ? $Actual[k] extends $Expected[k]
          ? never
          : { expected: $Expected[k]; actual: $Actual[k] }
        : { expected: $Expected[k]; actual: $Actual[k] }
      : never
    : never
}

/**
 * Remove all properties with `never` type from an object type.
 *
 * Filters out object properties whose values are `never`, leaving only
 * properties with concrete types. Useful for cleaning up conditional
 * type results that use `never` as a sentinel value.
 *
 * @category Type Utilities
 *
 * @template $T - The object type to filter
 *
 * @example
 * ```ts
 * type Mixed = {
 *   keep1: string
 *   remove: never
 *   keep2: number
 *   alsoRemove: never
 * }
 *
 * type Clean = Obj.OmitNever<Mixed>
 * // { keep1: string; keep2: number }
 * ```
 *
 * @example
 * ```ts
 * // Common pattern: conditional properties
 * type Conditional<T> = {
 *   [K in keyof T]: T[K] extends string ? T[K] : never
 * }
 *
 * type Input = { a: string; b: number; c: string }
 * type OnlyStrings = Obj.OmitNever<Conditional<Input>>
 * // { a: string; c: string }
 * ```
 */
export type OmitNever<$T> = {
  [k in keyof $T as $T[k] extends never ? never : k]: $T[k]
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Key Formatting Utilities
//
//
//
//

/**
 * Align object keys by padding with a character to a target length.
 *
 * Pads string keys to the specified length using the given fill character.
 * Non-string keys (symbols, numbers) are left unchanged.
 * Ensures consistent alignment of object keys in IDE displays.
 *
 * @category Type Utilities
 *
 * @template $T - The type whose keys should be aligned
 * @template $Length - The target length for padded keys
 * @template $Pad - The character to use for padding (defaults to '_')
 *
 * @example
 * ```ts
 * type Input = { MESSAGE: string, EXPECTED: number }
 * type Output = Obj.AlignKeys<Input, 12>
 * // { MESSAGE_____: string, EXPECTED____: number }
 *
 * // Custom padding character
 * type Output2 = Obj.AlignKeys<Input, 12, '.'>
 * // { MESSAGE.....: string, EXPECTED....: number }
 * ```
 */
export type AlignKeys<$T, $Length extends number, $Pad extends string = '_'> = {
  [k in keyof $T as k extends string ? Str.PadEnd<k, $Length, $Pad> : k]: $T[k]
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Diff Computation
//
//
//
//

/**
 * Compute a structured diff between two object types showing missing, excess, and mismatched fields.
 *
 * Creates a detailed comparison that shows:
 * - `missing`: Fields in expected but not in actual
 * - `excess`: Fields in actual but not in expected
 * - `mismatch`: Fields with different types between expected and actual
 *
 * Empty diff categories are automatically omitted from the result.
 *
 * @template $Expected - The expected object type
 * @template $Actual - The actual object type
 * @template $Prefix - Prefix for diff field names (defaults to 'diff')
 * @template $PreserveTypes - Types to preserve from simplification (defaults to never)
 *
 * @example
 * ```ts
 * type Expected = { a: string; b: number }
 * type Actual = { b: string; c: boolean }
 *
 * type Diff = Obj.ComputeDiff<Expected, Actual>
 * // {
 * //   diff_missing: { a: string }
 * //   diff_excess: { c: boolean }
 * //   diff_mismatch: { b: { expected: number; actual: string } }
 * // }
 * ```
 */
// dprint-ignore
export type ComputeDiff<
  $Expected,
  $Actual,
  $Prefix extends string = 'diff'
> =
  $Expected extends object
    ? $Actual extends object
      ? {
          [k in keyof ComputeDiffFields<$Expected, $Actual> as IsEmpty<ComputeDiffFields<$Expected, $Actual>[k]> extends true ? never : k extends string ? `${$Prefix}_${k}` : k]: ComputeDiffFields<$Expected, $Actual>[k]
        }
      : {}
    : {}

// dprint-ignore
type ComputeDiffFields<$Expected extends object, $Actual extends object> = {
  missing: Ts.Simplify.All<ExcludeKeys<$Expected, SharedKeys<$Expected, $Actual>>>
  excess: Ts.Simplify.All<ExcludeKeys<$Actual, SharedKeys<$Expected, $Actual>>>
  mismatch: Ts.Simplify.All<OmitNever<Mismatched<$Expected, $Actual>>>
}
