import type { Apply, Kind } from '../kind.js'
import type { GetRelation, IsExact } from '../relation.js'
import { type AssertionFn, runtime, runtimeUnary, type StaticErrorAssertion, type UnaryAssertionFn } from './helpers.js'

/**
 * Namespace for negative assertions - asserting that types are NOT related in specific ways.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.Not.exact<string, number>,   // ✓ Pass - they're different
 *   Ts.Test.Not.sub<number, string>,     // ✓ Pass - number doesn't extend string
 *   Ts.Test.Not.equiv<string, number>    // ✓ Pass - not mutually assignable
 * >
 * ```
 */
export namespace Not {
  //
  //
  //
  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • NotExact Assertion
  //
  //
  //
  //

  /**
   * NotExact assertion kind - checks that types are NOT exactly equal.
   *
   * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
   *
   * Parameters: [$A, $B]
   * Returns: never if types are NOT exactly equal, otherwise StaticErrorAssertion
   */
  interface NotExactKind {
    parameters: [$A: unknown, $B: unknown]
    // dprint-ignore
    return:
      IsExact<this['parameters'][0], this['parameters'][1]> extends true
        ? StaticErrorAssertion<
            'Types are exactly equal but should not be',
            this['parameters'][0],
            this['parameters'][1]
          >
        : never
  }

  /**
   * Assert that two types are NOT exactly equal.
   *
   * @example
   * ```ts
   * type _ = Ts.Test.Cases<
   *   Ts.Test.Not.exact<string, number>,          // ✓ Pass
   *   Ts.Test.Not.exact<1 | 2, 2 | 1>,            // ✗ Fail - they are exactly equal
   *   Ts.Test.Not.exact<string & {}, string>      // ✓ Pass - different structure
   * >
   * ```
   */
  export type exact<$A, $B> = Apply<NotExactKind, [$A, $B]>

  /**
   * Assert that two types are NOT exactly equal at runtime.
   *
   * Type-level equivalent: {@link exact}
   *
   * @example
   * ```ts
   * // Value mode
   * const x: string = 'hello'
   * const y: number = 42
   * Ts.Test.Not.exact<typeof x, typeof y>()  // ✓ Pass
   *
   * // Type-only mode
   * Ts.Test.Not.exact<string, number>()  // ✓ Pass
   * ```
   */
  export const exact: AssertionFn<NotExactKind> = runtime

  //
  //
  //
  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • NotSub Assertion
  //
  //
  //
  //

  /**
   * NotSub assertion kind - checks that type does NOT extend another.
   *
   * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
   *
   * Parameters: [$A, $B]
   * Returns: never if $B does NOT extend $A, otherwise StaticErrorAssertion
   */
  interface NotSubKind {
    parameters: [$A: unknown, $B: unknown]
    // dprint-ignore
    return:
      this['parameters'][1] extends this['parameters'][0]
        ? StaticErrorAssertion<
            'Type extends the type it should not extend',
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
   *   Ts.Test.Not.sub<string, number>,     // ✓ Pass - number doesn't extend string
   *   Ts.Test.Not.sub<string, 'hello'>,    // ✗ Fail - 'hello' extends string
   *   Ts.Test.Not.sub<object, { a: 1 }>    // ✗ Fail - { a: 1 } extends object
   * >
   * ```
   */
  export type sub<$A, $B> = Apply<NotSubKind, [$A, $B]>

  /**
   * Assert that a value's type does NOT extend another type at runtime.
   *
   * Type-level equivalent: {@link sub}
   *
   * @example
   * ```ts
   * // Value mode
   * const x = 42
   * Ts.Test.Not.sub<string>()(x)  // ✓ Pass - number doesn't extend string
   *
   * // Type-only mode
   * Ts.Test.Not.sub<string, number>()  // ✓ Pass
   * ```
   */
  export const sub: AssertionFn<NotSubKind> = runtime

  //
  //
  //
  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • NotEquiv Assertion
  //
  //
  //
  //

  /**
   * NotEquiv assertion kind - checks that types are NOT mutually assignable.
   *
   * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
   *
   * Parameters: [$A, $B]
   * Returns: never if types are NOT equivalent, otherwise StaticErrorAssertion
   */
  interface NotEquivKind {
    parameters: [$A: unknown, $B: unknown]
    // dprint-ignore
    return:
      GetRelation<this['parameters'][0], this['parameters'][1]> extends 'equivalent'
        ? StaticErrorAssertion<
            'Types are equivalent (mutually assignable) but should not be',
            this['parameters'][0],
            this['parameters'][1]
          >
        : never
  }

  /**
   * Assert that two types are NOT equivalent (mutually assignable).
   *
   * @example
   * ```ts
   * type _ = Ts.Test.Cases<
   *   Ts.Test.Not.equiv<string, number>,      // ✓ Pass
   *   Ts.Test.Not.equiv<string, 'hello'>,     // ✓ Pass - 'hello' is subtype, not equivalent
   *   Ts.Test.Not.equiv<string & {}, string>  // ✗ Fail - they are equivalent
   * >
   * ```
   */
  export type equiv<$A, $B> = Apply<NotEquivKind, [$A, $B]>

  /**
   * Assert that two types are NOT equivalent at runtime.
   *
   * Type-level equivalent: {@link equiv}
   *
   * @example
   * ```ts
   * // Value mode
   * const x: string = 'hello'
   * const y: number = 42
   * Ts.Test.Not.equiv<typeof x, typeof y>()  // ✓ Pass
   *
   * // Type-only mode
   * Ts.Test.Not.equiv<string, number>()  // ✓ Pass
   * ```
   */
  export const equiv: AssertionFn<NotEquivKind> = runtime

  //
  //
  //
  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • NotPromise Assertion
  //
  //
  //
  //

  /**
   * NotPromise assertion kind - checks that type is NOT a Promise.
   *
   * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
   *
   * Parameters: [$Actual]
   * Returns: never if $Actual is NOT a Promise, otherwise StaticErrorAssertion
   */
  interface NotPromiseKind {
    parameters: [$Actual: unknown]
    // dprint-ignore
    return:
      this['parameters'][0] extends Promise<any>
        ? StaticErrorAssertion<
            'Type is a Promise but should not be',
            'not a Promise',
            this['parameters'][0]
          >
        : never
  }

  /**
   * Assert that a type is NOT a Promise.
   *
   * @example
   * ```ts
   * type _ = Ts.Test.Cases<
   *   Ts.Test.Not.promise<number>,          // ✓ Pass
   *   Ts.Test.Not.promise<Promise<number>>  // ✗ Fail - Type error
   * >
   * ```
   */
  export type promise<$Actual> = Apply<NotPromiseKind, [$Actual]>

  /**
   * Assert that a value is NOT a Promise at runtime.
   *
   * Type-level equivalent: {@link promise}
   *
   * @example
   * ```ts
   * // Value mode
   * Ts.Test.Not.promise()(42)  // ✓ Pass
   * Ts.Test.Not.promise()(Promise.resolve(42))  // ✗ Fail
   *
   * // Type-only mode
   * Ts.Test.Not.promise<number>()  // ✓ Pass
   * Ts.Test.Not.promise<Promise<number>>()  // ✗ Fail
   * ```
   */
  export const promise: UnaryAssertionFn<NotPromiseKind> = runtimeUnary

  //
  //
  //
  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • NotArray Assertion
  //
  //
  //
  //

  /**
   * NotArray assertion kind - checks that type is NOT an array.
   *
   * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
   *
   * Parameters: [$Actual]
   * Returns: never if $Actual is NOT an array, otherwise StaticErrorAssertion
   */
  interface NotArrayKind {
    parameters: [$Actual: unknown]
    // dprint-ignore
    return:
      this['parameters'][0] extends any[]
        ? StaticErrorAssertion<
            'Type is an array but should not be',
            'not an array',
            this['parameters'][0]
          >
        : never
  }

  /**
   * Assert that a type is NOT an array.
   *
   * @example
   * ```ts
   * type _ = Ts.Test.Cases<
   *   Ts.Test.Not.array<string>,       // ✓ Pass
   *   Ts.Test.Not.array<string[]>      // ✗ Fail - Type error
   * >
   * ```
   */
  export type array<$Actual> = Apply<NotArrayKind, [$Actual]>

  /**
   * Assert that a value is NOT an array at runtime.
   *
   * Type-level equivalent: {@link array}
   *
   * @example
   * ```ts
   * // Value mode
   * Ts.Test.Not.array()('hello')  // ✓ Pass
   * Ts.Test.Not.array()([1, 2, 3])  // ✗ Fail
   *
   * // Type-only mode
   * Ts.Test.Not.array<string>()  // ✓ Pass
   * Ts.Test.Not.array<string[]>()  // ✗ Fail
   * ```
   */
  export const array: UnaryAssertionFn<NotArrayKind> = runtimeUnary
}
