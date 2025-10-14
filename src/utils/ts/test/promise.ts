import type { Apply, Kind } from '../kind.js'
import { type AssertionFn, runtime, type StaticErrorAssertion } from './helpers.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Promise Assertion
//
//
//
//

// TODO: Consider renaming to `resolves` to align with vitest/expect-type naming conventions

/**
 * Promise assertion kind - checks if type is Promise with specific element type.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Type, $Actual]
 * Returns: never if $Actual is Promise<$Type>, otherwise StaticErrorAssertion
 */
interface PromiseKind {
  parameters: [$Type: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    this['parameters'][1] extends Promise<this['parameters'][0]>
      ? never
      : StaticErrorAssertion<
          'Type is not a Promise with expected element type',
          Promise<this['parameters'][0]>,
          this['parameters'][1]
        >
}

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
export type promise<$Type, $Actual> = Apply<PromiseKind, [$Type, $Actual]>

/**
 * Assert that a value is a Promise of a specific type.
 *
 * Type-level equivalent: {@link promise}
 *
 * @example
 * ```ts
 * const result = async () => 42
 *
 * // Value mode (provide value in second call)
 * Ts.Test.promise<number>()(await result()) // OK
 * Ts.Test.promise<string>()(42) // Error - not a Promise<string>
 *
 * // Type-only mode (provide type as second type parameter)
 * Ts.Test.promise<number, Promise<number>>() // OK
 * Ts.Test.promise<string, Promise<number>>() // Error - wrong type
 * Ts.Test.promise<number, number>() // Error - not a Promise
 * ```
 */
export const promise: AssertionFn<PromiseKind> = runtime
