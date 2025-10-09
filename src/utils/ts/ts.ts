import type { Print } from './print.js'

/**
 * Cast any value to a specific type for testing purposes.
 * Useful for type-level testing where you need to create a value with a specific type.
 *
 * @template $value - The type to cast to
 * @param value - The value to cast (defaults to undefined)
 * @returns The value cast to the specified type
 *
 * @example
 * ```ts
 * // Creating typed test values
 * const user = as<{ id: string; name: string }>({ id: '1', name: 'Alice' })
 *
 * // Testing type inference
 * declare let _: any
 * const result = someFunction()
 * assertExtends<string>()(_ as typeof result)
 * ```
 */
export const as = <$value>(value?: unknown): $value => value as any

/**
 * Types that TypeScript accepts being interpolated into a Template Literal Type.
 *
 * These are the types that can be used within template literal types without causing
 * a TypeScript error. When a value of one of these types is interpolated into a
 * template literal type, TypeScript will properly convert it to its string representation.
 *
 * @example
 * ```ts
 * // All these types can be interpolated:
 * type Valid1 = `Value: ${string}`
 * type Valid2 = `Count: ${number}`
 * type Valid3 = `Flag: ${boolean}`
 * type Valid4 = `ID: ${123n}`
 *
 * // Example usage in conditional types:
 * type Stringify<T extends Interpolatable> = `${T}`
 * type Result1 = Stringify<42>        // "42"
 * type Result2 = Stringify<true>      // "true"
 * type Result3 = Stringify<'hello'>   // "hello"
 * ```
 */
export type Interpolatable =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol
  | object
  | unknown
  | any
  | never

/**
 * Represents a type error that can be surfaced at the type level.
 *
 * This is useful for providing more informative error messages directly in TypeScript's
 * type checking, often used with conditional types or generic constraints. When TypeScript
 * encounters this type, it will display the error information in a structured way.
 *
 * @template $Message - A string literal type describing the error
 * @template $Context - An object type providing additional context about the error,
 *                      often including the types involved
 * @template $Hint - A string literal type providing a hint for resolving the error
 *
 * @example
 * ```ts
 * // Creating a custom type error
 * type RequireString<T> = T extends string ? T : StaticError<
 *   'Type must be a string',
 *   { Received: T },
 *   'Consider using string or a string literal type'
 * >
 *
 * type Good = RequireString<'hello'>  // 'hello'
 * type Bad = RequireString<number>    // StaticError<...>
 * ```
 *
 * @example
 * ```ts
 * // Using in function constraints
 * function processString<T>(
 *   value: T extends string ? T : StaticError<
 *     'Argument must be a string',
 *     { ProvidedType: T }
 *   >
 * ): void {
 *   // Implementation
 * }
 *
 * processString('hello')  // OK
 * processString(42)       // Type error with custom message
 * ```
 */
export interface StaticError<
  $Message extends string = string,
  $Context extends object = {},
  $Hint extends string = '(none)',
> {
  ERROR: $Message
  CONTEXT: $Context
  HINT: $Hint
}

export type StaticErrorAny = StaticError<string, object, string>

/**
 * Represents a static assertion error at the type level, optimized for type testing.
 *
 * This is a simpler, more focused error type compared to {@link StaticError}. It's specifically
 * designed for type assertions where you need to communicate expected vs. actual types.
 *
 * @template $Message - A string literal type describing the assertion failure
 * @template $Expected - The expected type
 * @template $Actual - The actual type that was provided
 *
 * @example
 * ```ts
 * // Using in parameter assertions
 * function assertParameters<T extends readonly any[]>(
 *   fn: Parameters<typeof fn> extends T ? typeof fn
 *     : StaticErrorAssertion<
 *       'Parameters mismatch',
 *       T,
 *       Parameters<typeof fn>
 *     >
 * ): void {}
 *
 * // Error shows:
 * // MESSAGE: 'Parameters mismatch'
 * // EXPECTED: [string, number]
 * // ACTUAL: [number, string]
 * ```
 */
export interface StaticErrorAssertion<
  $Message extends string = string,
  $Expected = unknown,
  $Actual = unknown,
  $Tip extends string = never,
> {
  MESSAGE: $Message
  EXPECTED: $Expected
  ACTUAL: $Actual
  TIP: $Tip
}

/**
 * Like {@link Print} but adds additional styling to display the rendered type in a sentence.
 *
 * Useful for type-level error messages where you want to clearly distinguish type names
 * from surrounding text. Wraps the printed type with backticks (\`) like inline code in Markdown.
 *
 * @template $Type - The type to format and display
 *
 * @example
 * ```ts
 * type Message1 = `Expected ${Show<string>} but got ${Show<number>}`
 * // Result: "Expected `string` but got `number`"
 *
 * type Message2 = `The type ${Show<'hello' | 'world'>} is not assignable`
 * // Result: "The type `'hello' | 'world'` is not assignable"
 *
 * // Using in error messages
 * type TypeError<Expected, Actual> = StaticError<
 *   `Type mismatch: expected ${Show<Expected>} but got ${Show<Actual>}`,
 *   { Expected, Actual }
 * >
 * ```
 */
export type Show<$Type> = `\`${Print<$Type>}\``

/**
 * Version of {@link Show} but uses single quotes instead of backticks.
 *
 * This can be useful in template literal types where backticks would be rendered as "\`"
 * which is not ideal for readability. Use this when the output will be used within
 * another template literal type or when backticks cause display issues.
 *
 * Note that when working with TS-level errors, if TS can instantiate all the types involved then
 * the result will be a string, not a string literal type. So when working with TS-level errors,
 * only reach for this variant of {@link Show} if you think there is likelihood that types won't be instantiated.
 *
 * @template $Type - The type to format and display
 *
 * @example
 * ```ts
 * // When backticks would be escaped in output
 * type ErrorInTemplate = `Error: ${ShowInTemplate<string>} is required`
 * // Result: "Error: 'string' is required"
 *
 * // Comparing Show vs ShowInTemplate
 * type WithShow = `Type is ${Show<number>}`
 * // May display as: "Type is \`number\`" (escaped backticks)
 *
 * type WithShowInTemplate = `Type is ${ShowInTemplate<number>}`
 * // Displays as: "Type is 'number'" (cleaner)
 * ```
 */
export type ShowInTemplate<$Type> = `'${Print<$Type>}'`

/**
 * Simplifies complex type intersections and mapped types for better readability.
 *
 * Forces TypeScript to evaluate and flatten a type, which is especially useful for:
 * - Intersection types that appear as `A & B & C` in tooltips
 * - Complex mapped types that show their internal structure
 * - Making type aliases more readable in IDE tooltips
 *
 * @template $Type - The type to simplify
 *
 * @example
 * ```ts
 * // Without Simplify
 * type Complex = { a: string } & { b: number } & { c: boolean }
 * // Tooltip shows: { a: string } & { b: number } & { c: boolean }
 *
 * // With Simplify
 * type Simple = Simplify<Complex>
 * // Tooltip shows: { a: string; b: number; c: boolean }
 * ```
 *
 * @example
 * ```ts
 * // Simplifying complex mapped types
 * type UserPermissions =
 *   & { read: boolean }
 *   & { write: boolean }
 *   & { admin: boolean }
 *
 * type FlatPermissions = Simplify<UserPermissions>
 * // Shows as: { read: boolean; write: boolean; admin: boolean }
 *
 * // Useful with generic constraints
 * function processUser<T extends Simplify<UserPermissions>>(user: T) {
 *   // T will show flattened structure in errors and tooltips
 * }
 * ```
 */
export type Simplify<$Type> =
  & {
    [_ in keyof $Type]: $Type[_]
  }
  & unknown

/**
 * Simplify a nullable type while preserving null.
 *
 * @example
 * ```ts
 * type T1 = SimplifyNullable<{ a: 1 } | null>  // { a: 1 } | null
 * type T2 = SimplifyNullable<{ a: 1 }>  // { a: 1 }
 * ```
 */
export type SimplifyNullable<$T> = null extends $T ? (Simplify<$T> & {}) | null : Simplify<$T> & {}

/**
 * Utilities for working with union types at the type level.
 */
/**
 * Type-level helper that ensures a type exactly matches a constraint.
 *
 * Unlike standard `extends`, this requires bidirectional compatibility:
 * the input must extend the constraint AND the constraint must extend the input.
 * This enforces exact type matching without allowing excess properties.
 *
 * @template $Input - The input type to check
 * @template $Constraint - The constraint type that must be exactly matched
 *
 * @example
 * ```ts
 * type User = { name: string; age: number }
 *
 * // Standard extends allows excess properties
 * type T1 = { name: string; age: number; extra: boolean } extends User ? true : false  // true
 *
 * // ExtendsExact requires exact match
 * type T2 = ExtendsExact<{ name: string; age: number; extra: boolean }, User>  // never
 * type T3 = ExtendsExact<{ name: string; age: number }, User>  // { name: string; age: number }
 * type T4 = ExtendsExact<{ name: string }, User>  // never (missing property)
 * ```
 *
 * @example
 * ```ts
 * // Useful for strict function parameters
 * function updateUser<T>(user: ExtendsExact<T, User>): void {
 *   // Only accepts objects that exactly match User type
 * }
 *
 * updateUser({ name: 'Alice', age: 30 })  // OK
 * updateUser({ name: 'Bob', age: 25, extra: true })  // Type error
 * ```
 */
// dprint-ignore
export type ExtendsExact<$Input, $Constraint> =
  $Input extends $Constraint
    ? $Constraint extends $Input
      ? $Input
      : never
    : never

/**
 * Type-level utility that checks if a type does NOT extend another type.
 *
 * Returns `true` if type A does not extend type B, `false` otherwise.
 * Useful for conditional type logic where you need to check the absence
 * of a type relationship.
 *
 * @template $A - The type to check
 * @template $B - The type to check against
 * @returns `true` if $A does not extend $B, `false` otherwise
 *
 * @example
 * ```ts
 * type T1 = NotExtends<string, number>      // true (string doesn't extend number)
 * type T2 = NotExtends<'hello', string>     // false ('hello' extends string)
 * type T3 = NotExtends<42, number>          // false (42 extends number)
 * type T4 = NotExtends<{ a: 1 }, { b: 2 }>  // true (different properties)
 * ```
 *
 * @example
 * ```ts
 * // Using in conditional types for optional handling
 * type VarBuilderToType<$Type, $VarBuilder> =
 *   $VarBuilder['required'] extends true                     ? Exclude<$Type, undefined> :
 *   NotExtends<$VarBuilder['default'], undefined> extends true ? $Type | undefined :
 *                                                               $Type
 *
 * // If default is undefined, type is just $Type
 * // If default is not undefined, type is $Type | undefined
 * ```
 *
 * @example
 * ```ts
 * // Checking for specific type exclusions
 * type SafeDivide<T> = NotExtends<T, 0> extends true
 *   ? number
 *   : StaticError<'Cannot divide by zero'>
 *
 * type Result1 = SafeDivide<5>   // number
 * type Result2 = SafeDivide<0>   // StaticError<'Cannot divide by zero'>
 * ```
 */
export type NotExtends<$A, $B> = [$A] extends [$B] ? false : true

/**
 * Make all properties in an object mutable (removes readonly modifiers).
 *
 * @example
 * ```ts
 * type Readonly = { readonly x: number; readonly y: string }
 * type Mutable = Writeable<Readonly>  // { x: number; y: string }
 * ```
 */
export type Writeable<$Object> = {
  -readonly [k in keyof $Object]: $Object[k]
}

/**
 * @deprecated - Commented out 2025-01-07
 *
 * This utility was too strict - requires BIDIRECTIONAL extends, which rejects
 * valid narrowed types (e.g., { id: true } for { id: boolean }).
 *
 * Use Obj.NoExcess instead, which:
 * - ✓ Rejects excess properties (what you want)
 * - ✓ Allows valid subtypes/narrowing (what you need)
 *
 * If a use case for true bidirectional exact matching emerges, uncomment.
 * Otherwise, remove after 3-6 months (target: ~2025-07-01).
 *
 * Original implementation:
 */
// export type ExtendsExact<$Input, $Constraint> =
//   $Input extends $Constraint
//     ? $Constraint extends $Input
//       ? $Input
//       : never
//     : never

// /**
//  * Alias for {@link ExtendsExact}.
//  * Requires exact type matching without excess properties.
//  */

/**
 * Conditional type with else branch.
 *
 * @example
 * ```ts
 * type T = IfExtendsElse<string, string, 'yes', 'no'>  // 'yes'
 * ```
 */
export type IfExtendsElse<$Type, $Extends, $Then, $Else> = $Type extends $Extends ? $Then : $Else

/**
 * Intersection that ignores never and any.
 */
export type IntersectionIgnoreNeverOrAny<$T> = IsAny<$T> extends true ? unknown : $T extends never ? unknown : $T

/**
 * Convert never or any to unknown.
 */
export type NeverOrAnyToUnknown<$T> = IsAny<$T> extends true ? unknown : $T extends never ? unknown : $T

/**
 * Any narrowable primitive type.
 */
export type Narrowable = string | number | bigint | boolean | []

/**
 * Convert any and unknown to never.
 */
export type AnyAndUnknownToNever<$T> = IsAny<$T> extends true ? never : IsUnknown<$T> extends true ? never : $T

// Type-fest imports (used by some types above)
type IsAny<T> = 0 extends 1 & T ? true : false

type IsUnknown<T> = unknown extends T ? (IsAny<T> extends true ? false : true) : false
