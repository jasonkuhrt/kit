import { Fn } from '#fn'
import type { Apply, Kind } from '../kind.js'
import { type ExtractorAssertionFn, runtimeExtractor, type StaticErrorAssertion } from './helpers.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Returns Assertion
//
//
//
//

/**
 * ReturnType extractor kind - extracts ReturnType from function.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Container]
 * Returns: ReturnType<$Container>
 */
interface ReturnTypeExtractor {
  parameters: [$Container: Fn.AnyAny]
  return: ReturnType<this['parameters'][0]>
}

/**
 * Returns assertion kind - checks if return type matches expected type.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected, $Actual]
 * Returns: never if $Actual extends $Expected, otherwise StaticErrorAssertion
 */
interface ReturnsAssertionKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    this['parameters'][1] extends this['parameters'][0]
      ? never
      : StaticErrorAssertion<
          'Actual return type does not match expected return type',
          this['parameters'][0],
          this['parameters'][1]
        >
}

/**
 * Assert that a function's return type matches the expected type.
 * Combines `ReturnType<typeof fn>` with assertion in one step.
 *
 * @example
 * ```ts
 * function getUser() { return { name: 'John', age: 30 } }
 * type _ = Ts.Test.Cases<
 *   Ts.Test.returns<{ name: string; age: number }, ReturnType<typeof getUser>>,  // ✓ Pass
 *   Ts.Test.returns<{ name: string }, ReturnType<typeof getUser>>                // ✗ Fail - Type error
 * >
 * ```
 */
export type returns<$Expected, $Actual> = Apply<ReturnsAssertionKind, [$Expected, $Actual]>

/**
 * Runtime assertion that validates a function's return type at compile time.
 * This is the value-level equivalent of {@link returns}.
 *
 * Provides clear error messages with MESSAGE, EXPECTED, and ACTUAL fields when
 * return types don't match.
 *
 * Type-level equivalent: {@link returns}
 *
 * @example
 * ```ts
 * function getUser() { return { name: 'John', age: 30 } }
 *
 * // Value mode (provide function in second call)
 * Ts.Test.returns<{ name: string; age: number }>()(getUser) // ✓ Pass
 * Ts.Test.returns<{ name: string }>()(getUser) // ✗ Fail - Type error
 *
 * // Type-only mode (provide type as second type parameter)
 * type UserReturn = ReturnType<typeof getUser>
 * Ts.Test.returns<{ name: string; age: number }, UserReturn>() // ✓ Pass
 * Ts.Test.returns<{ name: string }, UserReturn>() // ✗ Fail - Type error
 * ```
 */
export const returns: ExtractorAssertionFn<ReturnTypeExtractor, ReturnsAssertionKind> = runtimeExtractor
