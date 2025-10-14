import type { Apply, Kind } from '../kind.js'
import { type AssertionFn, runtime, type StaticErrorAssertion } from './helpers.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Tuple Assertion
//
//
//
//

/**
 * Tuple assertion kind - checks if type is a tuple with specific element types.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected (tuple), $Actual]
 * Returns: never if $Actual extends $Expected, otherwise StaticErrorAssertion
 */
interface TupleKind {
  parameters: [$Expected: readonly any[], $Actual: unknown]
  // dprint-ignore
  return:
    this['parameters'][1] extends this['parameters'][0]
      ? never
      : StaticErrorAssertion<
          'Type is not a tuple with expected element types',
          this['parameters'][0],
          this['parameters'][1]
        >
}

/**
 * Assert that a type is a tuple with specific element types.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.tuple<[string, number], [string, number]>,  // ✓ Pass
 *   Ts.Test.tuple<[string, number], [number, string]>,  // ✗ Fail - Type error
 *   Ts.Test.tuple<[string], string>                     // ✗ Fail - Type error
 * >
 * ```
 */
export type tuple<$Expected extends readonly any[], $Actual> = Apply<TupleKind, [$Expected, $Actual]>

/**
 * Assert that a value is a tuple with specific element types.
 *
 * Type-level equivalent: {@link tuple}
 *
 * @example
 * ```ts
 * // Value mode (provide value in second call)
 * Ts.Test.tuple<[string, number]>()(['hello', 42]) // OK
 * Ts.Test.tuple<[string, number]>()([42, 'hello']) // Error - wrong order
 *
 * // Type-only mode (provide type as second type parameter)
 * Ts.Test.tuple<[string, number], [string, number]>() // OK
 * Ts.Test.tuple<[string, number], [number, string]>() // Error - wrong order
 * Ts.Test.tuple<[string, number], string>() // Error - not a tuple
 * ```
 */
export const tuple: AssertionFn<TupleKind> = runtime
