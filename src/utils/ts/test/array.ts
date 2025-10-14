import type { Apply, Kind } from '../kind.js'
import { type AssertionFn, runtime, type StaticErrorAssertion } from './helpers.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Array Assertion
//
//
//
//

// TODO: Consider renaming to `item` to align with vitest/expect-type naming conventions

/**
 * Array assertion kind - checks if type is array with specific element type.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$ElementType, $Actual]
 * Returns: never if $Actual is $ElementType[], otherwise StaticErrorAssertion
 */
interface ArrayKind {
  parameters: [$ElementType: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    this['parameters'][1] extends this['parameters'][0][]
      ? never
      : StaticErrorAssertion<
          'Type is not an array with expected element type',
          this['parameters'][0][],
          this['parameters'][1]
        >
}

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
export type array<$ElementType, $Actual> = Apply<ArrayKind, [$ElementType, $Actual]>

/**
 * Assert that a value is an array of a specific type.
 *
 * Type-level equivalent: {@link array}
 *
 * @example
 * ```ts
 * //Value mode (provide value in second call)
 * Ts.Test.array<string>()(strings) // OK if strings is string[]
 * Ts.Test.array<number>()([1, 2, 3]) // OK
 * Ts.Test.array<string>()([1, 2, 3]) // Error - not string[]
 *
 * // Type-only mode (provide type as second type parameter)
 * Ts.Test.array<string, string[]>() // OK
 * Ts.Test.array<number, string[]>() // Error - wrong element type
 * Ts.Test.array<string, string>() // Error - not an array
 * ```
 */
export const array: AssertionFn<ArrayKind> = runtime
