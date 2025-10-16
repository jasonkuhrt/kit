import type { Obj } from '#obj'
import type { Apply } from '../kind.ts'
import type { ShowInTemplate } from '../ts.ts'
import { type AssertionFn, runtime, type StaticErrorAssertion } from './helpers.ts'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Sub Assertion
//
//
//
//

/**
 * Sub assertion kind - encapsulates the subtype check logic.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected, $Actual]
 * Returns: never if $Actual extends $Expected, otherwise StaticErrorAssertion
 */
interface SubKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    this['parameters'][1] extends this['parameters'][0]
      ? never
      : StaticErrorAssertion<
          'Actual type does not extend expected type',
          this['parameters'][0],
          this['parameters'][1]
        >
}

/**
 * Assert that a type extends (is a subtype of) another type.
 *
 * Equivalent to TypeScript's `extends` keyword: checks if `$Actual extends $Expected`.
 * This is useful for validating type relationships and narrowing.
 *
 * For exact type equality (not just subtyping), use {@link exact} instead.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.sub<string, 'hello'>,           // ✓ Pass - 'hello' extends string
 *   Ts.Test.sub<'hello', string>,           // ✗ Fail - string doesn't extend 'hello'
 *   Ts.Test.sub<{ a: 1 }, { a: 1; b: 2 }>,  // ✓ Pass - more specific extends less specific
 *   Ts.Test.sub<object, { a: 1 }>           // ✓ Pass - { a: 1 } extends object
 * >
 * ```
 */
export type sub<$Expected, $Actual> = Apply<SubKind, [$Expected, $Actual]>

/**
 * Assert that a value's type extends (is a subtype of) the expected type.
 *
 * Equivalent to TypeScript's `extends` keyword: checks if value type extends expected type.
 * Useful for validating that narrowed types or returned types satisfy minimum requirements.
 *
 * The function is a no-op at runtime; all checking happens at compile time.
 *
 * For exact type equality (not just subtyping), use {@link exact} instead.
 *
 * Type-level equivalent: {@link sub}
 *
 * @example
 * ```ts
 * // Value mode (provide value in second call)
 * Ts.Test.sub<string>()('hello')       // OK - 'hello' extends string
 * Ts.Test.sub<'hello'>()('hello')      // OK - 'hello' extends 'hello'
 * Ts.Test.sub<'hello'>()('world')      // Error - 'world' doesn't extend 'hello'
 * Ts.Test.sub<number>()('hello')       // Error - string doesn't extend number
 *
 * // Type-only mode (provide type as second type parameter)
 * Ts.Test.sub<string, 'hello'>() // OK - 'hello' extends string
 * Ts.Test.sub<object, { a: 1 }>() // OK - { a: 1 } extends object
 * Ts.Test.sub<'hello', string>() // Error - string doesn't extend 'hello'
 *
 * // Validating narrowed types
 * if (isPositive(value)) {
 *   Ts.Test.sub<Positive>()(value)     // OK - narrowing produces Positive
 * }
 *
 * // Validating constructor return types (consider using equal for exact types)
 * const result = someConstructor()
 * Ts.Test.sub<BaseType>()(result)      // OK if result extends BaseType
 * ```
 */
export const sub: AssertionFn<SubKind> = runtime

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • SubNoExcess Assertion
//
//
//
//

/**
 * SubNoExcess assertion kind - checks subtype AND no excess properties.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected, $Actual]
 * Returns: never if $Actual extends $Expected with no excess, otherwise StaticErrorAssertion
 */
interface SubNoExcessKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    this['parameters'][1] extends this['parameters'][0]
      ? [keyof Obj.SubtractShallow<this['parameters'][1], this['parameters'][0]>] extends [never]
        ? never
        : StaticErrorAssertion<
            'Type has excess properties not present in expected type',
            this['parameters'][0],
            this['parameters'][1],
            `Excess properties: ${ShowInTemplate<keyof Obj.SubtractShallow<this['parameters'][1], this['parameters'][0]>>}`
          >
      : StaticErrorAssertion<
          'Actual type does not extend expected type',
          this['parameters'][0],
          this['parameters'][1]
        >
}

/**
 * Assert that a type extends the expected type AND has no excess properties.
 *
 * Similar to {@link sub} but also rejects excess properties beyond those defined
 * in the expected type. This catches common bugs like typos in configuration objects
 * or accidentally passing extra properties.
 *
 * This is particularly useful for:
 * - Validating configuration objects
 * - Checking function parameters that shouldn't have extra properties
 * - Testing that types don't have unexpected fields
 *
 * @example
 * ```ts
 * type Config = { id: boolean; name?: string }
 *
 * type _ = Ts.Test.Cases<
 *   Ts.Test.subNoExcess<Config, { id: true }>,               // ✓ Pass
 *   Ts.Test.subNoExcess<Config, { id: true; name: 'test' }>, // ✓ Pass - optional included
 *   Ts.Test.subNoExcess<Config, { id: true; $skip: true }>,  // ✗ Fail - excess property
 *   Ts.Test.subNoExcess<Config, { id: 'wrong' }>             // ✗ Fail - wrong type
 * >
 * ```
 *
 * @example
 * ```ts
 * // Compare with .sub (allows excess):
 * type Q = { id: boolean }
 *
 * type T1 = Ts.Test.sub<Q, { id: true; extra: 1 }>         // ✓ Pass (sub allows excess)
 * type T2 = Ts.Test.subNoExcess<Q, { id: true; extra: 1 }> // ✗ Fail (subNoExcess rejects)
 * ```
 *
 * @see {@link sub} for standard subtype checking (allows excess properties)
 * @see {@link exact} for exact structural equality
 */
export type subNoExcess<$Expected, $Actual> = Apply<SubNoExcessKind, [$Expected, $Actual]>

/**
 * Assert that a value's type extends the expected type AND has no excess properties.
 *
 * Similar to {@link sub} but also rejects excess properties beyond those defined
 * in the expected type. This catches common bugs like typos in configuration objects
 * or accidentally passing extra properties that would be silently ignored.
 *
 * Generic functions bypass TypeScript's normal excess property checking, so this
 * assertion is essential for catching bugs that would otherwise slip through.
 *
 * The function is a no-op at runtime; all checking happens at compile time.
 *
 * Type-level equivalent: {@link subNoExcess}
 *
 * @example
 * ```ts
 * type Config = { id: boolean; name?: string }
 *
 * // Value mode (provide value in second call)
 * Ts.Test.subNoExcess<Config>()({ id: true })
 * Ts.Test.subNoExcess<Config>()({ id: true, name: 'test' })
 *
 * // @ts-expect-error - Excess property
 * Ts.Test.subNoExcess<Config>()({ id: true, $skip: true })
 *
 * // @ts-expect-error - Wrong type
 * Ts.Test.subNoExcess<Config>()({ id: 'wrong' })
 *
 * // Type-only mode (provide type as second type parameter)
 * Ts.Test.subNoExcess<Config, { id: true }>() // OK
 * Ts.Test.subNoExcess<Config, { id: true; extra: 1 }>() // Error - excess property
 * ```
 *
 * @example
 * ```ts
 * // Real-world example: catching config typos
 * type QueryOptions = { limit?: number; offset?: number }
 *
 * // This would silently fail with .sub():
 * Ts.Test.sub<QueryOptions>()({ limit: 10, offest: 20 })  // ✓ Passes (typo missed!)
 *
 * // But .subNoExcess() catches it:
 * // @ts-expect-error - Did you mean 'offset'?
 * Ts.Test.subNoExcess<QueryOptions>()({ limit: 10, offest: 20 })
 * ```
 *
 * @see {@link sub} for standard subtype checking (allows excess properties)
 * @see {@link exact} for exact structural equality
 */
export const subNoExcess: AssertionFn<SubNoExcessKind> = runtime

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • SubNot Assertion
//
//
//
//

/**
 * SubNot assertion kind - checks that a type does NOT extend another type.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$NotExpected, $Actual]
 * Returns: never if $Actual does NOT extend $NotExpected, otherwise StaticErrorAssertion
 */
interface SubNotKind {
  parameters: [$NotExpected: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    this['parameters'][1] extends this['parameters'][0]
      ? StaticErrorAssertion<
          'Actual type extends type it should not extend',
          this['parameters'][0],
          this['parameters'][1]
        >
      : never
}

/**
 * Assert that a type does NOT extend another type.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.subNot<number, string>,  // ✓ Pass
 *   Ts.Test.subNot<string, 'hello'>  // ✗ Fail - 'hello' extends string
 * >
 * ```
 */
export type subNot<$NotExpected, $Actual> = Apply<SubNotKind, [$NotExpected, $Actual]>

/**
 * Assert that a value's type does NOT extend the given type.
 *
 * Equivalent to checking that `$Actual extends $NotExpected` is false.
 * Useful for validating that types are properly distinct or mutually exclusive.
 *
 * The function is a no-op at runtime; all checking happens at compile time.
 *
 * Type-level equivalent: {@link subNot}
 *
 * @example
 * ```ts
 * // Value mode (provide value in second call)
 * Ts.Test.subNot<number>()('hello')    // OK - string doesn't extend number
 * Ts.Test.subNot<string>()('hello')    // Error - 'hello' extends string
 * Ts.Test.subNot<string>()(42)         // OK - number doesn't extend string
 *
 * // Type-only mode (provide type as second type parameter)
 * Ts.Test.subNot<number, string>() // OK - string doesn't extend number
 * Ts.Test.subNot<string, 'hello'>() // Error - 'hello' extends string
 *
 * // Validating mutually exclusive types
 * type Positive = number & { __positive: true }
 * type Negative = number & { __negative: true }
 * const neg: Negative = -5 as Negative
 * Ts.Test.subNot<Positive>()(neg)      // OK - Negative doesn't extend Positive
 * ```
 */
export const subNot: AssertionFn<SubNotKind> = runtime
