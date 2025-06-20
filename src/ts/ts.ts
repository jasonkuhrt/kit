import type { Print } from './print.ts'

export * from './assert.ts'

export * from './print.ts'

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

export namespace Union {
  /**
   * Checks if a union type contains a specific type.
   *
   * Returns `true` if any member of the union type extends the target type,
   * `false` otherwise. This is useful for conditional type logic based on
   * union membership.
   *
   * @template $Type - The union type to search within
   * @template $LookingFor - The type to search for
   *
   * @example
   * ```ts
   * type HasString = Union.IsHas<string | number | boolean, string>  // true
   * type HasDate = Union.IsHas<string | number, Date>                // false
   * type HasLiteral = Union.IsHas<'a' | 'b' | 'c', 'b'>             // true
   *
   * // Useful in conditional types
   * type ProcessValue<T> = Union.IsHas<T, Promise<any>> extends true
   *   ? 'async'
   *   : 'sync'
   *
   * type R1 = ProcessValue<string | Promise<string>>  // 'async'
   * type R2 = ProcessValue<string | number>           // 'sync'
   * ```
   *
   * @example
   * ```ts
   * // Works with complex types
   * type Events = { type: 'click' } | { type: 'hover' } | { type: 'focus' }
   * type HasClick = Union.IsHas<Events, { type: 'click' }>  // true
   *
   * // Check for any promise in union
   * type MaybeAsync<T> = Union.IsHas<T, Promise<any>>
   * type R3 = MaybeAsync<string | Promise<number>>  // true
   * type R4 = MaybeAsync<string | number>           // false
   * ```
   */
  // dprint-ignore
  export type IsHas<$Type, $LookingFor> =
    _IsHas<$Type, $LookingFor> extends false
      ? false
      : true

  // dprint-ignore
  type _IsHas<$Type, $LookingFor> =
    $Type extends $LookingFor
      ? true
      : false
}
