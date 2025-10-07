import type { Print } from './print.js'

export * from './test.js'

export * from './print.js'

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
 * Phantom type helper that makes a type parameter covariant.
 *
 * @remarks
 * Covariance allows subtypes to be assigned to supertypes (natural direction).
 * Example: `Phantom<Covariant<1>>` can be assigned to `Phantom<Covariant<number>>`.
 *
 * Use this when you want narrower types to flow to wider types:
 * - Literal types → base types (`1` → `number`, `'hello'` → `string`)
 * - Subclasses → base classes
 * - More specific → more general
 *
 * @example
 * ```ts
 * interface Container<T> {
 *   readonly __type?: Covariant<T>
 * }
 *
 * let narrow: Container<1> = {}
 * let wide: Container<number> = {}
 *
 * wide = narrow  // ✅ Allowed (1 extends number)
 * narrow = wide  // ❌ Error (number does not extend 1)
 * ```
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/type-compatibility.html | TypeScript Type Compatibility}
 */
export type Covariant<$T> = () => $T

/**
 * Phantom type helper that makes a type parameter contravariant.
 *
 * @remarks
 * Contravariance allows supertypes to be assigned to subtypes (opposite direction).
 * Example: `Phantom<Contravariant<number>>` can be assigned to `Phantom<Contravariant<1>>`.
 *
 * This is useful for function parameters where a handler that accepts wider types
 * can substitute for one that accepts narrower types.
 *
 * @example
 * ```ts
 * interface Handler<T> {
 *   readonly __type?: Contravariant<T>
 * }
 *
 * let narrow: Handler<1> = {}
 * let wide: Handler<number> = {}
 *
 * narrow = wide  // ✅ Allowed (reversed direction!)
 * wide = narrow  // ❌ Error
 * ```
 *
 * @see {@link https://www.typescriptlang.org/docs/handbook/type-compatibility.html#function-parameter-bivariance | Function Parameter Bivariance}
 */
export type Contravariant<$T> = (value: $T) => void

/**
 * Phantom type helper that makes a type parameter invariant.
 *
 * @remarks
 * Invariance requires exact type matches - no subtype or supertype assignments allowed.
 * This is the strictest variance, useful when you need precise type guarantees.
 *
 * @example
 * ```ts
 * interface Exact<T> {
 *   readonly __type?: Invariant<T>
 * }
 *
 * let one: Exact<1> = {}
 * let num: Exact<number> = {}
 *
 * num = one  // ❌ Error (no direction works)
 * one = num  // ❌ Error (no direction works)
 * ```
 */
export type Invariant<$T> = (value: $T) => $T

/**
 * Phantom type helper that makes a type parameter bivariant (unsafe).
 *
 * @remarks
 * Bivariance allows assignments in BOTH directions. This is generally unsafe as it
 * can allow runtime type errors. Only use when absolutely necessary.
 *
 * @example
 * ```ts
 * interface Unsafe<T> {
 *   readonly __type?: Bivariant<T>
 * }
 *
 * let one: Unsafe<1> = {}
 * let num: Unsafe<number> = {}
 *
 * num = one  // ⚠️ Allowed (both directions work)
 * one = num  // ⚠️ Allowed (unsafe!)
 * ```
 */
export type Bivariant<$T> = { bivariantHack(value: $T): void }['bivariantHack']

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

// Note: RemoveIndex is exported from Rec module

// Note: ExcludeNull is exported from Null module as Null.Exclude

// Note: ExcludeUndefined is exported from Undefined module as Undefined.Exclude

// Note: To exclude both null and undefined, use: Null.Exclude<Undefined.Exclude<T>>

/**
 * Alias for {@link ExtendsExact}.
 * Requires exact type matching without excess properties.
 */
export type Exact<$Value, $Constraint> = ExtendsExact<$Value, $Constraint>

// Note: Values is exported from Obj module (obj/type-utils.ts)

// Note: ValuesOrEmptyObject, GetKeyOr and other object types are exported from Obj module (obj/type-utils.ts)

// Note: Union utilities are in Union namespace (e.g., Union.ToIntersection, Union.LastOf, Union.ToTuple)

// Note: SuffixKeyNames, OmitKeysWithPrefix, PickRequiredProperties, RequireProperties, PartialOrUndefined, UnionMerge, MergeAll exported from Obj module

// Note: MaybePromise is exported from Prom module as Prom.Maybe

// Note: Include is exported from Union namespace as Union.Include

// Note: Negate is exported from Bool module as Bool.not

// Note: GuardedType is exported from Fn module (fn/base.ts)

// Note: Union.Expanded for union distribution

/**
 * Conditional type with else branch.
 *
 * @example
 * ```ts
 * type T = IfExtendsElse<string, string, 'yes', 'no'>  // 'yes'
 * ```
 */
export type IfExtendsElse<$Type, $Extends, $Then, $Else> = $Type extends $Extends ? $Then : $Else

// Note: All is exported from Arr module

// Note: AssertExtends is exported from assert.ts

// Note: Union.IgnoreAnyOrUnknown for filtering union types

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

// Note: LetterUpper, LetterLower, Letter, and Digit are exported from Str.Char module

// Note: Union.IsAnyMemberExtends for checking union members

/**
 * Convert any and unknown to never.
 */
export type AnyAndUnknownToNever<$T> = IsAny<$T> extends true ? never : IsUnknown<$T> extends true ? never : $T

// Type-fest imports (used by some types above)
type IsAny<T> = 0 extends 1 & T ? true : false

type IsUnknown<T> = unknown extends T ? (IsAny<T> extends true ? false : true) : false

export namespace Union {
  /**
   * Valid values for discriminant properties in tagged unions.
   */
  export type DiscriminantPropertyValue = string | number | symbol

  /**
   * Include only types that extend a constraint (opposite of Exclude).
   * Filters a union type to only include members that extend the constraint.
   *
   * @example
   * ```ts
   * type T = Union.Include<string | number | boolean, string | number>  // string | number
   * type T2 = Union.Include<'a' | 'b' | 1 | 2, string>  // 'a' | 'b'
   * ```
   */
  export type Include<$T, $U> = $T extends $U ? $T : never

  /**
   * Convert a union type to a tuple type.
   *
   * @example
   * ```ts
   * type T = Union.ToTuple<'a' | 'b' | 'c'>  // ['a', 'b', 'c']
   * ```
   */
  export type ToTuple<
    $Union,
    ___L = LastOf<$Union>,
    ___N = [$Union] extends [never] ? true : false,
  > = true extends ___N ? []
    : [...ToTuple<Exclude<$Union, ___L>>, ___L]

  /**
   * Convert a union type to an intersection type.
   *
   * @example
   * ```ts
   * type U = { a: string } | { b: number }
   * type I = Union.ToIntersection<U>  // { a: string } & { b: number }
   * ```
   */
  export type ToIntersection<$U> = ($U extends any ? (k: $U) => void : never) extends ((k: infer __i__) => void) ? __i__
    : never

  /**
   * Get the last type in a union.
   *
   * @example
   * ```ts
   * type T = Union.LastOf<'a' | 'b' | 'c'>  // 'c'
   * ```
   */
  export type LastOf<$T> = ToIntersection<$T extends any ? () => $T : never> extends () => infer __r__ ? __r__
    : never

  /**
   * Force union distribution in conditional types.
   *
   * @example
   * ```ts
   * type T = Union.Expanded<'a' | 'b'>  // 'a' | 'b' (forced distribution)
   * ```
   */
  export type Expanded<$Union> = $Union

  /**
   * Union that ignores any and unknown.
   */
  export type IgnoreAnyOrUnknown<$T> = unknown extends $T ? never : $T

  /**
   * Check if any member of a union extends a type.
   *
   * @example
   * ```ts
   * type T1 = Union.IsAnyMemberExtends<string | number, string>  // true
   * type T2 = Union.IsAnyMemberExtends<number | boolean, string>  // false
   * ```
   */
  export type IsAnyMemberExtends<$T, $U> = (
    $T extends any ? ($T extends $U ? true : false) : never
  ) extends false ? false
    : true

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

  /**
   * Merge all members of a union into a single type.
   *
   * @example
   * ```ts
   * type U = { a: string } | { b: number }
   * type M = Union.Merge<U>  // { a: string; b: number }
   * ```
   */
  export type Merge<$U> = {
    [
      k in (
        $U extends any ? keyof $U : never
      )
    ]: $U extends any ? (k extends keyof $U ? $U[k] : never) : never
  }
}
