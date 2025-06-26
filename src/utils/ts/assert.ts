import type { ArrMut } from '#arr-mut'

/**
 * Type-level assertion utilities for testing type correctness.
 */

/**
 * Assert that two types are exactly equal.
 *
 * @example
 * ```ts
 * type _1 = AssertEqual<string, string> // true
 * type _2 = AssertEqual<string | number, string> // false
 * type _3 = AssertEqual<{ a: 1 }, { a: 1 }> // true
 * ```
 */
export type AssertEqual<$Actual, $Expected> = (<T>() => T extends $Actual ? 1 : 2) extends
  (<T>() => T extends $Expected ? 1 : 2) ? true
  : false

/**
 * Assert that a type extends another type.
 *
 * @example
 * ```ts
 * type _1 = AssertExtends<'hello', string> // true
 * type _2 = AssertExtends<string, 'hello'> // false
 * type _3 = AssertExtends<{ a: 1; b: 2 }, { a: 1 }> // true
 * ```
 */
export type AssertExtends<$Actual, $Expected> = $Actual extends $Expected ? true : false

/**
 * Assert that a type does not extend another type.
 *
 * @example
 * ```ts
 * type _1 = AssertNotExtends<string, number> // true
 * type _2 = AssertNotExtends<'hello', string> // false
 * ```
 */
export type AssertNotExtends<$Actual, $NotExpected> = $Actual extends $NotExpected ? false : true

/**
 * Assert that a type is true.
 *
 * @example
 * ```ts
 * type _1 = AssertTrue<true> // true
 * type _2 = AssertTrue<false> // never (error)
 * ```
 */
export type AssertTrue<_$Type extends true> = true

/**
 * Assert that a type is false.
 *
 * @example
 * ```ts
 * type _1 = AssertFalse<false> // true
 * type _2 = AssertFalse<true> // never (error)
 * ```
 */
export type AssertFalse<_$Type extends false> = true

/**
 * Assert that a type is never.
 *
 * @example
 * ```ts
 * type _1 = AssertNever<never> // true
 * type _2 = AssertNever<string> // false
 * ```
 */
export type AssertNever<$Type> = [$Type] extends [never] ? true : false

/**
 * Runtime assertion function that validates types at compile time.
 * The function itself is a no-op at runtime.
 *
 * @example
 * ```ts
 * // Type checks happen at compile time
 * assert<string>('hello') // OK
 * assert<number>('hello') // Type error
 *
 * // Can be used for more complex assertions
 * const result = someFunction()
 * assert<{ id: string; name: string }>(result)
 * ```
 */
import type { StaticError } from './ts.ts'

export const assert = <$Expected>() =>
<$Actual>(
  _actual: $Actual extends $Expected ? $Actual : StaticError<
    'Type assertion failed',
    { Expected: $Expected; Actual: $Actual },
    'Use the correct type or fix the implementation'
  >,
): void => {}

/**
 * Simplified assertion that doesn't require double function call.
 * Useful for inline assertions where the type is obvious from context.
 *
 * @example
 * ```ts
 * const result = someFunction()
 * assertTypeSimple<string>(result) // Type error if result is not string
 * ```
 */
export const assertSimple = <$Expected>(
  _actual: $Expected,
): void => {}

/**
 * Assert that a type is a subtype of another type.
 * This checks that $Actual extends $Expected (subtype relationship).
 *
 * @example
 * ```ts
 * assertSub<string>()('hello') // OK - 'hello' extends string
 * assertSub<object>()({ a: 1 }) // OK - { a: 1 } extends object
 * assertSub<'hello'>()('world') // Error - 'world' does not extend 'hello'
 * ```
 */
export const assertSub = <$Expected>() =>
<$Actual>(
  _actual: $Actual extends $Expected ? $Actual : StaticError<
    'Subtype assertion failed',
    { Expected: $Expected; Actual: $Actual },
    '$Actual must be a subtype of $Expected'
  >,
): void => {}

/**
 * Alias for {@link assertSub}.
 * Assert that a type is assignable to (extends) another type.
 */
export const assertAssignable = assertSub

/**
 * Assert that a type extends another type.
 * Same as {@link assertSub} but with different parameter order for readability.
 *
 * @example
 * ```ts
 * assertExtendsRuntime<'hello'>()<string>() // OK - 'hello' extends string
 * assertExtendsRuntime<{ a: 1 }>()<{ a: 1; b: 2 }>() // OK - { a: 1; b: 2 } extends { a: 1 }
 * ```
 */
export const assertExtendsRuntime = <$Sub>() =>
<$Super>(
  _actual: $Sub extends $Super ? $Sub : StaticError<
    'Extension assertion failed',
    { Sub: $Sub; Super: $Super },
    '$Sub must extend $Super'
  >,
): void => {}

/**
 * Assert that a type is a supertype of another type.
 * This checks that $Actual extends $Supertype (reverse of sub).
 *
 * @example
 * ```ts
 * assertSuper<object>()(obj) // OK if obj's type extends object
 * assertSuper<{ a: 1 }>()(extendedObj) // OK if extendedObj extends { a: 1 }
 * ```
 */
export const assertSuper = <$Supertype>() =>
<$Actual>(
  _actual: $Actual extends $Supertype ? $Actual : StaticError<
    'Supertype assertion failed',
    { Supertype: $Supertype; Actual: $Actual },
    '$Actual must extend $Supertype'
  >,
): void => {}

/**
 * Alias for {@link assertSuper}.
 * Assert that a type is a supertype of another type.
 */
export const assertSupertype = assertSuper

/**
 * Assert that a value is a Promise of a specific type.
 *
 * @example
 * ```ts
 * const result = async () => 42
 * assertPromise<number>()(await result()) // OK
 * assertPromise<string>()(42) // Error - not a Promise<string>
 * ```
 */
export const assertPromise = <$Type>() =>
<$Actual>(
  _actual: $Actual extends Promise<$Type> ? $Actual : StaticError<
    'Promise type assertion failed',
    { Expected: `Promise<${$Type & any}>`; Actual: $Actual },
    'Value must be a Promise of the specified type'
  >,
): void => {}

/**
 * Assert that a value is NOT a Promise.
 *
 * @example
 * ```ts
 * assertNotPromise()(42) // OK
 * assertNotPromise()(Promise.resolve(42)) // Error - is a Promise
 * ```
 */
export const assertNotPromise = <$Actual>(
  _actual: $Actual extends Promise<any> ? StaticError<
      'Non-Promise assertion failed',
      { Actual: $Actual },
      'Value must not be a Promise'
    >
    : $Actual,
): void => {}

/**
 * Assert that a value is a function with specific signature.
 *
 * @example
 * ```ts
 * assertFunction<(x: number) => string>()(fn) // OK if fn matches signature
 * assertFunction<() => void>()(42) // Error - not a function
 * ```
 */
export const assertFunction = <$Signature extends (...args: any[]) => any>() =>
<$Actual>(
  _actual: $Actual extends $Signature ? $Actual : StaticError<
    'Function type assertion failed',
    { Expected: $Signature; Actual: $Actual },
    'Value must be a function with the specified signature'
  >,
): void => {}

/**
 * Assert that a value is an array of a specific type.
 *
 * @example
 * ```ts
 * assertArray<string>()(strings) // OK if strings is string[]
 * assertArray<number>()([1, 2, 3]) // OK
 * assertArray<string>()([1, 2, 3]) // Error - not string[]
 * ```
 */
export const assertArray = <$ElementType>() =>
<$Actual>(
  _actual: $Actual extends $ElementType[] ? $Actual : StaticError<
    'Array type assertion failed',
    { Expected: `${$ElementType & any}[]`; Actual: $Actual },
    'Value must be an array of the specified element type'
  >,
): void => {}

/**
 * Assert that two types are exactly equal at compile time.
 * More strict than assertSub as it checks both directions.
 *
 * @example
 * ```ts
 * assertExact<string>()('hello') // OK - string exactly equals string
 * assertExact<string | number>()('hello') // Error - string does not exactly equal string | number
 * assertExact<{ a: 1 }>()({ a: 1 }) // OK
 * assertExact<{ a: 1; b?: 2 }>()({ a: 1 }) // Error - not exactly equal
 * ```
 */
export const assertExact = <$Expected>() =>
<$Actual>(
  _actual: AssertEqual<$Actual, $Expected> extends true ? $Actual : StaticError<
    'Exact type equality assertion failed',
    { Expected: $Expected; Actual: $Actual },
    'Types must be exactly equal (not just assignable)'
  >,
): void => {}

/**
 * Alias for {@link assertExact}.
 * Assert that two types are exactly equal at compile time.
 */
export const assertEqual = assertExact

/**
 * Create a type test that must pass type checking.
 * Useful for organizing type-level tests.
 *
 * @example
 * ```ts
 * test('string operations', () => {
 *   assertType<string>()('hello')
 *   assertType<number>()('hello'.length)
 * })
 * ```
 */
export const test = (_name: string, _fn: () => void): void => {}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Type-Level Only Utilities
//
//

/**
 * Type-level assertion that returns true if the assertion passes, or a StaticError if it fails.
 * Use this for purely type-level testing without runtime functions.
 *
 * @example
 * ```ts
 * type Tests = [
 *   Ts.Assert<string, 'hello'>,      // true - 'hello' extends string
 *   Ts.Assert<number, string>,       // StaticError - string does not extend number
 *   Ts.Assert<Promise<number>, Promise<42>>, // true - Promise<42> extends Promise<number>
 * ]
 * ```
 */
export type Assert<$Expected, $Actual> = $Actual extends $Expected ? true
  : StaticError<
    'Type assertion failed',
    { Expected: $Expected; Actual: $Actual },
    '$Actual must extend $Expected'
  >

/**
 * Type-level test runner that accepts up to 40 test assertions.
 *
 * Each test parameter must extend `true`, causing TypeScript to error
 * at the exact position where a test fails. This provides clear,
 * inline error messages for failed assertions.
 *
 * @returns `true` if all tests pass, or a tuple of passing test indices (1-based)
 *          if there are failures (though compilation will fail on any failure).
 *
 * @example
 * ```ts
 * // All tests pass
 * type _ = Ts.Test<
 *   Ts.Assert<string, 'hello'>,   // ✓ Pass
 *   Ts.Assert<number, 42>,         // ✓ Pass
 *   Ts.AssertExact<any[], any[]>   // ✓ Pass
 * > // Returns: true
 *
 * // Test failure - TypeScript errors on the failing parameter
 * type _ = Ts.Test<
 *   Ts.Assert<string, 'hello'>,   // ✓ Pass (position 1)
 *   Ts.Assert<number, 'oops'>,     // ✗ Fail - Type error here!
 *   Ts.Assert<boolean, true>       // ✓ Pass (position 3)
 * > // Would return [1, 3] if it compiled
 *
 * // Use with reference equality tests
 * type _ = Ts.Test<
 *   Ts.Assert<boolean, typeof Ref.is({}, {})>,      // ✓ Pass
 *   Ts.Assert<[any,any], Parameters<typeof Ref.is<1,1>>> // ✗ Fail - StaticError
 * >
 * ```
 */
export type Test<
  T1 extends true = true,
  T2 extends true = true,
  T3 extends true = true,
  T4 extends true = true,
  T5 extends true = true,
  T6 extends true = true,
  T7 extends true = true,
  T8 extends true = true,
  T9 extends true = true,
  T10 extends true = true,
  T11 extends true = true,
  T12 extends true = true,
  T13 extends true = true,
  T14 extends true = true,
  T15 extends true = true,
  T16 extends true = true,
  T17 extends true = true,
  T18 extends true = true,
  T19 extends true = true,
  T20 extends true = true,
  T21 extends true = true,
  T22 extends true = true,
  T23 extends true = true,
  T24 extends true = true,
  T25 extends true = true,
  T26 extends true = true,
  T27 extends true = true,
  T28 extends true = true,
  T29 extends true = true,
  T30 extends true = true,
  T31 extends true = true,
  T32 extends true = true,
  T33 extends true = true,
  T34 extends true = true,
  T35 extends true = true,
  T36 extends true = true,
  T37 extends true = true,
  T38 extends true = true,
  T39 extends true = true,
  T40 extends true = true,
> = [
  T1,
  T2,
  T3,
  T4,
  T5,
  T6,
  T7,
  T8,
  T9,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  T16,
  T17,
  T18,
  T19,
  T20,
  T21,
  T22,
  T23,
  T24,
  T25,
  T26,
  T27,
  T28,
  T29,
  T30,
  T31,
  T32,
  T33,
  T34,
  T35,
  T36,
  T37,
  T38,
  T39,
  T40,
] extends [
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
] ? true
  : ArrMut.Omit<[
    T1 extends true ? 1 : never,
    T2 extends true ? 2 : never,
    T3 extends true ? 3 : never,
    T4 extends true ? 4 : never,
    T5 extends true ? 5 : never,
    T6 extends true ? 6 : never,
    T7 extends true ? 7 : never,
    T8 extends true ? 8 : never,
    T9 extends true ? 9 : never,
    T10 extends true ? 10 : never,
    T11 extends true ? 11 : never,
    T12 extends true ? 12 : never,
    T13 extends true ? 13 : never,
    T14 extends true ? 14 : never,
    T15 extends true ? 15 : never,
    T16 extends true ? 16 : never,
    T17 extends true ? 17 : never,
    T18 extends true ? 18 : never,
    T19 extends true ? 19 : never,
    T20 extends true ? 20 : never,
    T21 extends true ? 21 : never,
    T22 extends true ? 22 : never,
    T23 extends true ? 23 : never,
    T24 extends true ? 24 : never,
    T25 extends true ? 25 : never,
    T26 extends true ? 26 : never,
    T27 extends true ? 27 : never,
    T28 extends true ? 28 : never,
    T29 extends true ? 29 : never,
    T30 extends true ? 30 : never,
    T31 extends true ? 31 : never,
    T32 extends true ? 32 : never,
    T33 extends true ? 33 : never,
    T34 extends true ? 34 : never,
    T35 extends true ? 35 : never,
    T36 extends true ? 36 : never,
    T37 extends true ? 37 : never,
    T38 extends true ? 38 : never,
    T39 extends true ? 39 : never,
    T40 extends true ? 40 : never,
  ], never>

/**
 * Assert that a function's parameters match the expected type.
 * Combines `Parameters<typeof fn>` with assertion in one step.
 *
 * @typeParam $Expected - The expected parameter tuple type
 * @typeParam $Function - The function whose parameters to check (use `typeof fn`)
 *
 * @example
 * ```ts
 * // Instead of:
 * type params = Parameters<typeof Ref.is<1,1>>
 * type _ = Ts.Test<Ts.Assert<[any,any], params>>
 *
 * // You can write:
 * type _ = Ts.Test<
 *   Ts.AssertParameters<[any,any], typeof Ref.is<1,1>>
 * >
 *
 * // More examples:
 * function add(a: number, b: number): number { return a + b }
 * type _ = Ts.Test<
 *   Ts.AssertParameters<[number, number], typeof add>,        // ✓ Pass
 *   Ts.AssertParameters<[string, string], typeof add>,        // ✗ Fail
 *   Ts.AssertParameters<[object, object], typeof Ref.is<{},{}>>, // ✓ Pass
 * >
 * ```
 */
export type AssertParameters<$Expected extends readonly any[], $Function extends (...args: any[]) => any> = Assert<
  $Expected,
  Parameters<$Function>
>

/**
 * Type-level subtype assertion.
 * Alias for {@link Assert}.
 */
export type AssertSub<$Expected, $Actual> = Assert<$Expected, $Actual>

/**
 * Type-level supertype assertion.
 * Checks that $Expected extends $Actual (reverse of Assert).
 *
 * @example
 * ```ts
 * type Tests = [
 *   Ts.AssertSuper<object, { a: 1 }>,  // true - { a: 1 } extends object
 *   Ts.AssertSuper<{ a: 1 }, object>,  // StaticError - object does not extend { a: 1 }
 * ]
 * ```
 */
export type AssertSuper<$Actual, $Supertype> = $Actual extends $Supertype ? true
  : StaticError<
    'Supertype assertion failed',
    { Supertype: $Supertype; Actual: $Actual },
    '$Actual must extend $Supertype'
  >

/**
 * Type-level exact equality assertion.
 * Uses {@link AssertEqual} for bidirectional type checking.
 *
 * @example
 * ```ts
 * type Tests = [
 *   Ts.AssertExact<string, string>,           // true - exactly equal
 *   Ts.AssertExact<string, 'hello'>,          // StaticError - not exactly equal
 *   Ts.AssertExact<{ a: 1 }, { a: 1 }>,       // true - exactly equal
 * ]
 * ```
 */
export type AssertExact<$Expected, $Actual> = AssertEqual<$Actual, $Expected> extends true ? true
  : StaticError<
    'Exact type equality assertion failed',
    { Expected: $Expected; Actual: $Actual },
    'Types must be exactly equal (not just assignable)'
  >

/**
 * Type-level extension assertion with clear sub/super parameter names.
 * Note: This has a different signature than the existing {@link AssertExtends} type.
 *
 * @example
 * ```ts
 * type Tests = [
 *   Ts.AssertExtendsTyped<'hello', string>,        // true - 'hello' extends string
 *   Ts.AssertExtendsTyped<string, 'hello'>,        // StaticError - string does not extend 'hello'
 * ]
 * ```
 */
export type AssertExtendsTyped<$Sub, $Super> = $Sub extends $Super ? true
  : StaticError<
    'Extension assertion failed',
    { Sub: $Sub; Super: $Super },
    '$Sub must extend $Super'
  >

type PassingTests = readonly true[]

/**
 * Type-level test suite helper.
 * Accepts an array of type assertions and ensures they all pass.
 *
 * @example
 * ```ts
 * type MyTests = Ts.TestSuite<[
 *   Ts.Assert<string, 'hello'>,
 *   Ts.AssertExact<number, number>,
 *   Ts.AssertSuper<object, { a: 1 }>,
 *   Ts.AssertExtends<'hello', string>,
 * ]>
 * // MyTests will be true if all pass, or show StaticError for first failure
 * ```
 */
export type TestSuite<$Tests extends PassingTests> = $Tests extends readonly [infer First, ...infer Rest]
  ? First extends true ? Rest extends ArrMut.AnyRO ? TestSuite<Rest>
    : true
  : First // Return the failed assertion (StaticError)
  : true

/**
 * Type-level test case with a name for better debugging.
 *
 * @example
 * ```ts
 * type StringTests = Ts.TestCase<'string operations', [
 *   Ts.Assert<string, 'hello'>,
 *   Ts.Assert<string, `template`>,
 * ]>
 * ```
 */
export type TestCase<_$Name extends string, $Tests extends readonly any[]> = TestSuite<$Tests>

/**
 * Inline assertion for complex type expressions.
 * Useful when you want to assert the type of a complex expression inline.
 *
 * @example
 * ```ts
 * // Instead of:
 * const result = tryOr(() => 42, async () => 'fallback')
 * assertType<Promise<number | string>>()(result)
 *
 * // You can do:
 * inline<Promise<number | string>>(tryOr(() => 42, async () => 'fallback'))
 * ```
 */
export const inline = <$Expected>(
  value: $Expected,
): $Expected => value
