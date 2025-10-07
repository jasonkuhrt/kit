import type { Fn } from '#fn'
import type { Obj } from '#obj'

/**
 * Type-level assertion utilities for testing type correctness.
 *
 * ## Configuration
 *
 * Assertion behavior can be configured via global settings.
 * See {@link KitLibrarySettings.Ts.Test.Settings} for available options.
 *
 * @example
 * ```typescript
 * // Enable strict linting in your project
 * // types/kit-settings.d.ts
 * declare global {
 *   namespace KitLibrarySettings {
 *     namespace Ts {
 *       namespace Test {
 *         interface Settings {
 *           lintBidForExactPossibility: true
 *         }
 *       }
 *     }
 *   }
 * }
 * export {}
 * ```
 */

import type { GetTestSetting } from './test-settings.js'
import type { StaticErrorAssertion } from './ts.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Type-Level Utilities
//
//

/**
 * Assert that two types are exactly equal (structurally).
 *
 * Uses a conditional type inference trick to check exact structural equality,
 * correctly handling any, never, and unknown edge cases.
 *
 * This checks for structural equality - types must have the same structure,
 * not just compute to the same result. For bidirectional extends, use {@link bid}.
 *
 * When exact equality fails but bidirectional assignability passes, provides
 * a helpful tip about using {@link bid} or applying {@link Simplify} from `#ts`.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.exact<string, string>,           // ✓ Pass
 *   Ts.Test.exact<string | number, string>,  // ✗ Fail - Type error
 *   Ts.Test.exact<{ a: 1 }, { a: 1 }>,       // ✓ Pass
 *   Ts.Test.exact<any, unknown>,             // ✗ Fail - Type error
 *   Ts.Test.exact<1 | 2, 2 | 1>              // ✗ Fail with tip - types are mutually assignable but not structurally equal
 * >
 * ```
 */
export type exact<$Expected, $Actual> = (<T>() => T extends $Actual ? 1 : 2) extends
  (<T>() => T extends $Expected ? 1 : 2) ? true
  // If structural equality fails, check if bidirectional assignability passes
  : $Actual extends $Expected ? $Expected extends $Actual ? StaticErrorAssertion<
        'Types are mutually assignable but not structurally equal',
        $Expected,
        $Actual,
        'Use bid() for mutual assignability OR apply Simplify<T> to normalize types'
      >
    : StaticErrorAssertion<'Types are not structurally equal', $Expected, $Actual>
  : StaticErrorAssertion<'Types are not structurally equal', $Expected, $Actual>

/**
 * Assert that two types are exactly equal (structurally) at compile time.
 * More strict than extends as it checks structural equality.
 *
 * When exact equality fails but bidirectional assignability passes, provides
 * a helpful tip about using {@link bid} or applying Simplify from `#ts`.
 *
 * Type-level equivalent: {@link exact}
 *
 * @example
 * ```ts
 * Ts.Test.exact<string>()('hello') // OK - string exactly equals string
 * Ts.Test.exact<string | number>()('hello') // Error - string does not exactly equal string | number
 * Ts.Test.exact<{ a: 1 }>()({ a: 1 }) // OK
 * Ts.Test.exact<{ a: 1; b?: 2 }>()({ a: 1 }) // Error - not exactly equal
 * ```
 */
export const exact = <$Expected>() =>
<$Actual>(
  _actual: (<T>() => T extends $Actual ? 1 : 2) extends (<T>() => T extends $Expected ? 1 : 2) ? $Actual
    : $Actual extends $Expected ? $Expected extends $Actual ? StaticErrorAssertion<
          'Actual value types are mutually assignable but not structurally equal',
          $Expected,
          $Actual,
          'Use bid() for mutual assignability OR apply Simplify<T> to normalize types'
        >
      : StaticErrorAssertion<'Actual value type is not structurally equal to expected type', $Expected, $Actual>
    : StaticErrorAssertion<'Actual value type is not structurally equal to expected type', $Expected, $Actual>,
): void => {}

/**
 * Assert that two types are bidirectionally assignable (mutually assignable).
 *
 * This checks that types are mutually assignable (A extends B and B extends A),
 * which means they compute to the same result even if their structure differs.
 *
 * Use this when you care about semantic equality rather than structural equality.
 * For strict structural equality, use {@link exact}.
 *
 * **Linting:** When `KitLibrarySettings.Ts.Test.Settings.lintBidForExactPossibility` is `true`,
 * this will show an error if {@link exact} would work, encouraging use of the stricter assertion.
 * See module documentation for configuration example.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.bid<string, string>,      // ✓ Pass (or error if linting enabled - should use exact)
 *   Ts.Test.bid<1 | 2, 2 | 1>,        // ✓ Pass (or error if linting enabled - should use exact)
 *   Ts.Test.bid<string & {}, string>, // ✓ Pass - both compute to string (exact would fail)
 *   Ts.Test.bid<string, number>       // ✗ Fail - Type error
 * >
 * ```
 *
 * @see Module documentation for how to enable strict linting
 */
export type bid<$Expected, $Actual> = $Actual extends $Expected ? $Expected extends $Actual
    // Both directions pass - check if exact would also pass
    ? (<T>() => T extends $Actual ? 1 : 2) extends (<T>() => T extends $Expected ? 1 : 2)
      // Exact also passes - check if linting is enabled
      ? GetTestSetting<'lintBidForExactPossibility'> extends true ? StaticErrorAssertion<
          'Types are structurally equal',
          $Expected,
          $Actual,
          'Use exact() instead - bid() is only needed when types are mutually assignable but not structurally equal'
        >
      : true // Linting disabled, allow it
    : true // Only bid passes (not exact) - this is correct usage
  : StaticErrorAssertion<
    'Types are not bidirectionally assignable (Expected does not extend Actual)',
    $Expected,
    $Actual
  >
  : StaticErrorAssertion<
    'Types are not bidirectionally assignable (Actual does not extend Expected)',
    $Expected,
    $Actual
  >

/**
 * Assert that two types are bidirectionally assignable (mutually assignable) at compile time.
 * Checks mutual assignability rather than structural equality.
 *
 * **Linting:** When `KitLibrarySettings.Ts.Test.Settings.lintBidForExactPossibility` is `true`,
 * this will show an error if {@link exact} would work, encouraging use of the stricter assertion.
 * See module documentation for configuration example.
 *
 * Type-level equivalent: {@link bid}
 *
 * @example
 * ```ts
 * Ts.Test.bid<string>()('hello') // OK (or error if linting enabled - should use exact)
 * Ts.Test.bid<string | number>()(Math.random() > 0.5 ? 'hello' : 42) // OK - mutually assignable
 * Ts.Test.bid<number>()('hello') // Error
 * ```
 *
 * @see Module documentation for how to enable strict linting
 */
export const bid = <$Expected>() =>
<$Actual>(
  // For value-level, we just need $Actual extends $Expected (subtype check)
  // The bidirectional check is conceptual - we're checking if the value's type
  // is compatible with the expected type
  _actual: $Actual extends $Expected ? $Actual
    : StaticErrorAssertion<
      'Actual value type is not assignable to expected type',
      $Expected,
      $Actual
    >,
): void => {}

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
export type sub<$Expected, $Actual> = $Actual extends $Expected ? true
  : StaticErrorAssertion<
    'Actual type does not extend expected type',
    $Expected,
    $Actual
  >

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
 * // Type checks happen at compile time
 * Ts.Test.sub<string>()('hello')       // OK - 'hello' extends string
 * Ts.Test.sub<'hello'>()('hello')      // OK - 'hello' extends 'hello'
 * Ts.Test.sub<'hello'>()('world')      // Error - 'world' doesn't extend 'hello'
 * Ts.Test.sub<number>()('hello')       // Error - string doesn't extend number
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
export const sub = <$Expected>() =>
<$Actual>(
  _actual: $Actual extends $Expected ? $Actual
    : StaticErrorAssertion<
      'Actual value type does not extend expected type',
      $Expected,
      $Actual
    >,
): void => {}

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
export type subNoExcess<$Expected, $Actual> = $Actual extends $Expected
  ? Exclude<keyof $Actual, keyof $Expected> extends never ? true
  : StaticErrorAssertion<
    'Type has excess properties not present in expected type',
    $Expected,
    $Actual
  >
  : StaticErrorAssertion<
    'Actual type does not extend expected type',
    $Expected,
    $Actual
  >

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
 * // These pass:
 * Ts.Test.subNoExcess<Config>()({ id: true })
 * Ts.Test.subNoExcess<Config>()({ id: true, name: 'test' })
 *
 * // These fail:
 * // @ts-expect-error - Excess property
 * Ts.Test.subNoExcess<Config>()({ id: true, $skip: true })
 *
 * // @ts-expect-error - Wrong type
 * Ts.Test.subNoExcess<Config>()({ id: 'wrong' })
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
export const subNoExcess = <$Expected>() =>
<$Actual>(
  _actual: $Actual extends $Expected ? Obj.NoExcess<$Expected, $Actual>
    : StaticErrorAssertion<
      'Actual value type does not extend expected type',
      $Expected,
      $Actual
    >,
): void => {}

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
export type subNot<$NotExpected, $Actual> = $Actual extends $NotExpected ? StaticErrorAssertion<
    'Actual type extends type it should not extend',
    $NotExpected,
    $Actual
  >
  : true

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
 * // Type checks happen at compile time
 * Ts.Test.subNot<number>()('hello')    // OK - string doesn't extend number
 * Ts.Test.subNot<string>()('hello')    // Error - 'hello' extends string
 * Ts.Test.subNot<string>()(42)         // OK - number doesn't extend string
 *
 * // Validating mutually exclusive types
 * type Positive = number & { __positive: true }
 * type Negative = number & { __negative: true }
 * const neg: Negative = -5 as Negative
 * Ts.Test.subNot<Positive>()(neg)      // OK - Negative doesn't extend Positive
 * ```
 */
export const subNot = <$NotExpected>() =>
<$Actual>(
  _actual: $Actual extends $NotExpected ? StaticErrorAssertion<
      'Actual value type extends type it should not extend',
      $NotExpected,
      $Actual
    >
    : $Actual,
): void => {}

/**
 * Assert that a type is exactly `never`.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equalNever<never>,  // ✓ Pass
 *   Ts.Test.equalNever<string>  // ✗ Fail - Type error
 * >
 * ```
 */
export type equalNever<$Actual> = [$Actual] extends [never] ? true
  : StaticErrorAssertion<'Type is not never', never, $Actual>

/**
 * Assert that a type is exactly `never`.
 *
 * Type-level equivalent: {@link equalNever}
 *
 * @example
 * ```ts
 * Never<never>()(value) // OK if value is never
 * Never<string>()(value) // Error
 * ```
 */
export const equalNever = <$Actual>() =>
(
  _actual: [$Actual] extends [never] ? $Actual
    : StaticErrorAssertion<
      'Actual value type is not never',
      never,
      $Actual
    >,
): void => {}

/**
 * Assert that a type is exactly `any`.
 *
 * Uses the `0 extends 1 & T` trick to detect `any`.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equalAny<any>,      // ✓ Pass
 *   Ts.Test.equalAny<unknown>,  // ✗ Fail - Type error
 *   Ts.Test.equalAny<string>    // ✗ Fail - Type error
 * >
 * ```
 */
export type equalAny<$Actual> = 0 extends 1 & $Actual ? true
  : StaticErrorAssertion<'Type is not any', never, $Actual>

/**
 * Assert that a type is exactly `any`.
 *
 * Type-level equivalent: {@link equalAny}
 *
 * @example
 * ```ts
 * equalAny<any>()(value) // OK if value is any
 * equalAny<unknown>()(value) // Error
 * ```
 */
export const equalAny = <$Actual>() =>
(
  _actual: 0 extends 1 & $Actual ? $Actual
    : StaticErrorAssertion<
      'Actual value type is not any',
      any,
      $Actual
    >,
): void => {}

/**
 * Assert that a type is exactly `unknown`.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equalUnknown<unknown>,  // ✓ Pass
 *   Ts.Test.equalUnknown<any>,      // ✗ Fail - Type error
 *   Ts.Test.equalUnknown<string>    // ✗ Fail - Type error
 * >
 * ```
 */
export type equalUnknown<$Actual> = unknown extends $Actual ? (0 extends 1 & $Actual ? StaticErrorAssertion<
      'Type is any, not unknown',
      unknown,
      $Actual
    >
    : true)
  : StaticErrorAssertion<'Type is not unknown', never, $Actual>

/**
 * Assert that a type is exactly `unknown`.
 *
 * Type-level equivalent: {@link equalUnknown}
 *
 * @example
 * ```ts
 * equalUnknown<unknown>()(value) // OK if value is unknown
 * equalUnknown<any>()(value) // Error
 * ```
 */
export const equalUnknown = <$Actual>() =>
(
  _actual: unknown extends $Actual ? (0 extends 1 & $Actual ? StaticErrorAssertion<
        'Actual value type is any, not unknown',
        unknown,
        $Actual
      >
      : $Actual)
    : StaticErrorAssertion<
      'Actual value type is not unknown',
      unknown,
      $Actual
    >,
): void => {}

/**
 * Assert that a type is an empty object (no properties).
 *
 * Uses {@link Obj.IsEmpty} from kit to check if the object has no keys.
 * Note: `{}` in TypeScript means "any non-nullish value", not an empty object.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equalEmptyObject<Record<string, never>>,  // ✓ Pass
 *   Ts.Test.equalEmptyObject<{}>,                      // ✗ Fail - {} is not empty
 *   Ts.Test.equalEmptyObject<{ a: 1 }>                 // ✗ Fail - has properties
 * >
 * ```
 */
export type equalEmptyObject<$Actual extends object> = Obj.IsEmpty<$Actual> extends true ? true
  : StaticErrorAssertion<'Type is not an empty object (has keys)', Obj.Empty, $Actual>

/**
 * Assert that a value's type is an empty object (no properties).
 *
 * Uses {@link Obj.IsEmpty} from kit to check if the object has no keys.
 * Note: `{}` in TypeScript means "any non-nullish value", not an empty object.
 *
 * Type-level equivalent: {@link equalEmptyObject}
 *
 * @example
 * ```ts
 * // Using Obj.empty() factory (recommended)
 * Ts.Test.equalEmptyObject()(Obj.empty())  // ✓ Pass
 *
 * // Using Obj.Empty type explicitly
 * Ts.Test.equalEmptyObject()({} as Obj.Empty)  // ✓ Pass
 *
 * // Plain {} infers as the problematic {} type
 * Ts.Test.equalEmptyObject()({})                // ✗ Fail - inferred as {}
 * Ts.Test.equalEmptyObject()({ a: 1 })          // ✗ Fail - has properties
 * ```
 */
export const equalEmptyObject = <$Actual extends object>() =>
(
  _actual: Obj.IsEmpty<$Actual> extends true ? $Actual
    : StaticErrorAssertion<
      'Actual value type is not an empty object (has keys)',
      Obj.Empty,
      $Actual
    >,
): void => {}

/**
 * Assert that a type is a supertype of (i.e., extended by) another type.
 *
 * Equivalent to TypeScript's `extends` keyword: checks if `$Actual extends $Supertype`.
 * This is the reverse parameter order of {@link sub} - the expected type is the supertype.
 * Less commonly used than `sub` - most cases should use `sub` with reversed parameters for clarity.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.sup<object, { a: 1 }>,  // ✓ Pass - { a: 1 } extends object (object is supertype)
 *   Ts.Test.sup<{ a: 1 }, object>,  // ✗ Fail - object doesn't extend { a: 1 }
 *   Ts.Test.sup<string, 'hello'>    // ✓ Pass - 'hello' extends string (string is supertype)
 * >
 * ```
 */
export type sup<$Supertype, $Actual> = $Actual extends $Supertype ? true
  : StaticErrorAssertion<'Actual type does not extend expected supertype', $Supertype, $Actual>

/**
 * Assert that a value's type extends a supertype (i.e., the supertype is extended by the value).
 *
 * Equivalent to TypeScript's `extends` keyword: checks if value type extends the supertype.
 * This is the reverse parameter order of {@link sub} - the expected type is the supertype.
 * Less commonly used - most cases should use `sub` with reversed parameters for clarity.
 *
 * The function is a no-op at runtime; all checking happens at compile time.
 *
 * Type-level equivalent: {@link sup}
 *
 * @example
 * ```ts
 * interface Base { id: string }
 * interface Extended extends Base { name: string }
 *
 * const extended: Extended = { id: '1', name: 'test' }
 * Ts.Test.sup<Base>()(extended)     // OK - Extended extends Base
 * Ts.Test.sup<Extended>()(extended) // OK - Extended extends Extended
 *
 * const base: Base = { id: '1' }
 * Ts.Test.sup<Extended>()(base)     // Error - Base doesn't extend Extended
 * ```
 */
export const sup = <$Supertype>() =>
<$Actual>(
  _actual: $Actual extends $Supertype ? $Actual
    : StaticErrorAssertion<
      'Actual value type does not extend expected supertype',
      $Supertype,
      $Actual
    >,
): void => {}

/**
 * Assert that a function's parameters match the expected type.
 * Combines `Parameters<typeof fn>` with assertion in one step.
 *
 * @typeParam $Expected - The expected parameter tuple type
 * @typeParam $Function - The function whose parameters to check (use `typeof fn`)
 *
 * @example
 * ```ts
 * function add(a: number, b: number): number { return a + b }
 * type _ = Ts.Test.Cases<
 *   Ts.Test.parameters<[number, number], typeof add>,  // ✓ Pass
 *   Ts.Test.parameters<[string, string], typeof add>   // ✗ Fail - Type error
 * >
 * ```
 */
export type parameters<$Expected extends readonly any[], $Function extends (...args: any[]) => any> = sub<
  $Expected,
  Parameters<$Function>
>

/**
 * Runtime assertion that validates a function's parameter types at compile time.
 * This is the value-level equivalent of {@link parameters}.
 *
 * Provides clear error messages with MESSAGE, EXPECTED, and ACTUAL fields when
 * parameter types don't match.
 *
 * Type-level equivalent: {@link parameters}
 *
 * @example
 * ```ts
 * function add(a: number, b: number) { return a + b }
 * Parameters<[number, number]>()(add) // ✓ Pass
 * Parameters<[string, string]>()(add) // ✗ Fail - Type error
 * ```
 */
export const parameters = <$Expected extends readonly any[]>() =>
<$Function extends Fn.AnyAny>(
  _fn: Parameters<$Function> extends $Expected ? $Function
    : StaticErrorAssertion<
      'Actual function parameters do not match expected parameters',
      $Expected,
      Parameters<$Function>
    >,
): void => {}

/**
 * Assert that a type is a Promise with specific element type.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.promise<number, Promise<number>>,  // ✓ Pass
 *   Ts.Test.promise<string, Promise<number>>,  // ✗ Fail - Type error
 *   Ts.Test.promise<number, number>            // ✗ Fail - Type error
 * >
 * ```
 */
export type promise<$Type, $Actual> = $Actual extends Promise<$Type> ? true
  : StaticErrorAssertion<
    'Type is not a Promise with expected element type',
    Promise<$Type>,
    $Actual
  >

/**
 * Assert that a value is a Promise of a specific type.
 *
 * Type-level equivalent: {@link promise}
 *
 * @example
 * ```ts
 * const result = async () => 42
 * Promise<number>()(await result()) // OK
 * Promise<string>()(42) // Error - not a Promise<string>
 * ```
 */
export const promise = <$Type>() =>
<$Actual>(
  _actual: $Actual extends Promise<$Type> ? $Actual
    : StaticErrorAssertion<
      'Actual value type is not a Promise with expected element type',
      Promise<$Type>,
      $Actual
    >,
): void => {}

/**
 * Assert that a type is NOT a Promise.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.promiseNot<number>,          // ✓ Pass
 *   Ts.Test.promiseNot<Promise<number>>  // ✗ Fail - Type error
 * >
 * ```
 */
export type promiseNot<$Actual> = $Actual extends Promise<any> ? StaticErrorAssertion<
    'Type is a Promise but should not be',
    never,
    $Actual
  >
  : true

/**
 * Assert that a value is NOT a Promise.
 *
 * Type-level equivalent: {@link promiseNot}
 *
 * @example
 * ```ts
 * Ts.Test.promiseNot()(42) // OK
 * Ts.Test.promiseNot()(Promise.resolve(42)) // Error - is a Promise
 * ```
 */
export const promiseNot = <$Actual>(
  _actual: $Actual extends Promise<any> ? StaticErrorAssertion<
      'Actual value type is a Promise but expected non-Promise type',
      'not a Promise',
      $Actual
    >
    : $Actual,
): void => {}

/**
 * Assert that a type is an array with specific element type.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.array<string, string[]>,  // ✓ Pass
 *   Ts.Test.array<number, string[]>,  // ✗ Fail - Type error
 *   Ts.Test.array<string, string>     // ✗ Fail - Type error
 * >
 * ```
 */
export type array<$ElementType, $Actual> = $Actual extends $ElementType[] ? true
  : StaticErrorAssertion<
    'Type is not an array with expected element type',
    $ElementType[],
    $Actual
  >

/**
 * Assert that a value is an array of a specific type.
 *
 * Type-level equivalent: {@link array}
 *
 * @example
 * ```ts
 * Array<string>()(strings) // OK if strings is string[]
 * Array<number>()([1, 2, 3]) // OK
 * Array<string>()([1, 2, 3]) // Error - not string[]
 * ```
 */
export const array = <$ElementType>() =>
<$Actual>(
  _actual: $Actual extends $ElementType[] ? $Actual
    : StaticErrorAssertion<
      'Actual value type is not an array with expected element type',
      $ElementType[],
      $Actual
    >,
): void => {}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Const Variants
//
// These variants use `const` type parameters to preserve literal types,
// eliminating the need for `as` casts when testing exact types.
//
//

/**
 * Assert that a value exactly equals the expected type, using const to preserve literal types.
 * This eliminates the need for `as` casts when testing with literal values.
 *
 * Related: {@link exact} (non-const variant)
 *
 * @example
 * ```ts
 * // Without const - requires cast
 * Ts.Test.exact<{ a: 1 }>()({ a: 1 } as { a: 1 })
 *
 * // With const - no cast needed!
 * Ts.Test.exactConst<{ a: 1 }>()({ a: 1 })
 *
 * // Works with any literal type
 * Ts.Test.exactConst<'hello'>()('hello')
 * Ts.Test.exactConst<42>()(42)
 * Ts.Test.exactConst<true>()(true)
 * ```
 */
export const exactConst = <$Expected>() =>
<const $Actual>(
  _actual: (<T>() => T extends $Actual ? 1 : 2) extends (<T>() => T extends $Expected ? 1 : 2) ? $Actual
    : StaticErrorAssertion<
      'Actual value type is not exactly equal to expected type',
      $Expected,
      $Actual
    >,
): void => {}

/**
 * Assert that a value extends the expected type, using const to preserve literal types.
 * This eliminates the need for `as` casts when testing with literal values.
 *
 * Related: {@link sub} (non-const variant)
 *
 * @example
 * ```ts
 * // Without const - type may widen
 * sub<string>()('hello')  // 'hello' widens to string
 *
 * // With const - preserves literal
 * subConst<string>()('hello')  // keeps 'hello' literal type
 *
 * // Useful for object literals
 * subConst<{ a: number }>()({ a: 1 })  // preserves { readonly a: 1 }
 * ```
 */
export const subConst = <$Expected>() =>
<const $Actual>(
  _actual: $Actual extends $Expected ? $Actual
    : StaticErrorAssertion<
      'Actual value type does not extend expected type',
      $Expected,
      $Actual
    >,
): void => {}

/**
 * Assert that a value is mutually assignable with the expected type, using const to preserve literal types.
 * This eliminates the need for `as` casts when testing with literal values.
 *
 * Related: {@link bid} (non-const variant)
 *
 * @example
 * ```ts
 * // Without const - requires cast for exact match
 * Ts.Test.bid<1 | 2>()(1 as 1 | 2)
 *
 * // With const - no cast needed
 * Ts.Test.bidConst<1 | 2>()(1)  // preserves literal 1
 *
 * // Useful for union types
 * type Status = 'pending' | 'complete'
 * Ts.Test.bidConst<Status>()('pending')  // keeps 'pending' literal
 * ```
 */
export const bidConst = <$Expected>() =>
<const $Actual>(
  _actual: $Actual extends $Expected ? $Expected extends $Actual ? $Actual
    : StaticErrorAssertion<
      'Types are not bidirectionally assignable (Expected does not extend Actual)',
      $Expected,
      $Actual
    >
    : StaticErrorAssertion<
      'Types are not bidirectionally assignable (Actual does not extend Expected)',
      $Expected,
      $Actual
    >,
): void => {}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Helper Utilities
//
//

/**
 * Type-level test assertion that requires the result to be true.
 * Used in type-level test suites to ensure a type evaluates to true.
 *
 * @example
 * ```ts
 * type MyTests = [
 *   Ts.Test.Case<Equal<string, string>>,  // OK - evaluates to true
 *   Ts.Test.Case<Equal<string, number>>,  // Error - doesn't extend true
 * ]
 * ```
 */
export type Case<$Result extends true> = $Result

/**
 * Type-level batch assertion helper that accepts multiple assertions.
 * Each type parameter must extend true, allowing batch type assertions.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Equal<string, string>,     // ✓ Pass
 *   Extends<string, 'hello'>,  // ✓ Pass
 *   Never<never>               // ✓ Pass
 * >
 *
 * // Type error if any assertion fails
 * type _ = Ts.Test.Cases<
 *   Equal<string, string>,     // ✓ Pass
 *   Equal<string, number>,     // ✗ Fail - Type error here
 *   Extends<string, 'hello'>   // ✓ Pass
 * >
 * ```
 */
export type Cases<
  _T1 extends true = true,
  _T2 extends true = true,
  _T3 extends true = true,
  _T4 extends true = true,
  _T5 extends true = true,
  _T6 extends true = true,
  _T7 extends true = true,
  _T8 extends true = true,
  _T9 extends true = true,
  _T10 extends true = true,
  _T11 extends true = true,
  _T12 extends true = true,
  _T13 extends true = true,
  _T14 extends true = true,
  _T15 extends true = true,
  _T16 extends true = true,
  _T17 extends true = true,
  _T18 extends true = true,
  _T19 extends true = true,
  _T20 extends true = true,
  _T21 extends true = true,
  _T22 extends true = true,
  _T23 extends true = true,
  _T24 extends true = true,
  _T25 extends true = true,
  _T26 extends true = true,
  _T27 extends true = true,
  _T28 extends true = true,
  _T29 extends true = true,
  _T30 extends true = true,
  _T31 extends true = true,
  _T32 extends true = true,
  _T33 extends true = true,
  _T34 extends true = true,
  _T35 extends true = true,
  _T36 extends true = true,
  _T37 extends true = true,
  _T38 extends true = true,
  _T39 extends true = true,
  _T40 extends true = true,
  _T41 extends true = true,
  _T42 extends true = true,
  _T43 extends true = true,
  _T44 extends true = true,
  _T45 extends true = true,
  _T46 extends true = true,
  _T47 extends true = true,
  _T48 extends true = true,
  _T49 extends true = true,
  _T50 extends true = true,
  _T51 extends true = true,
  _T52 extends true = true,
  _T53 extends true = true,
  _T54 extends true = true,
  _T55 extends true = true,
  _T56 extends true = true,
  _T57 extends true = true,
  _T58 extends true = true,
  _T59 extends true = true,
  _T60 extends true = true,
  _T61 extends true = true,
  _T62 extends true = true,
  _T63 extends true = true,
  _T64 extends true = true,
  _T65 extends true = true,
  _T66 extends true = true,
  _T67 extends true = true,
  _T68 extends true = true,
  _T69 extends true = true,
  _T70 extends true = true,
  _T71 extends true = true,
  _T72 extends true = true,
  _T73 extends true = true,
  _T74 extends true = true,
  _T75 extends true = true,
  _T76 extends true = true,
  _T77 extends true = true,
  _T78 extends true = true,
  _T79 extends true = true,
  _T80 extends true = true,
  _T81 extends true = true,
  _T82 extends true = true,
  _T83 extends true = true,
  _T84 extends true = true,
  _T85 extends true = true,
  _T86 extends true = true,
  _T87 extends true = true,
  _T88 extends true = true,
  _T89 extends true = true,
  _T90 extends true = true,
  _T91 extends true = true,
  _T92 extends true = true,
  _T93 extends true = true,
  _T94 extends true = true,
  _T95 extends true = true,
  _T96 extends true = true,
  _T97 extends true = true,
  _T98 extends true = true,
  _T99 extends true = true,
  _T100 extends true = true,
> = true

//
//
