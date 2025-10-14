import { Fn } from '#fn'
import type { Apply, Kind } from '../kind.js'
import { type ExtractorAssertionFn, runtimeExtractor, type StaticErrorAssertion } from './helpers.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • ReturnsPromise Assertion
//
//
//
//

/**
 * AwaitedReturnType extractor kind - extracts Awaited<ReturnType> from async function.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Container]
 * Returns: Awaited<ReturnType<$Container>>
 */
interface AwaitedReturnTypeExtractor {
  parameters: [$Container: Fn.AnyAny]
  return: Awaited<ReturnType<this['parameters'][0]>>
}

/**
 * ReturnsPromise assertion kind - checks if async function's resolved return type matches expected type.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected, $Actual]
 * Returns: never if $Actual extends $Expected, otherwise StaticErrorAssertion
 */
interface ReturnsPromiseAssertionKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    this['parameters'][1] extends this['parameters'][0]
      ? never
      : StaticErrorAssertion<
          'Actual async return type does not match expected type',
          this['parameters'][0],
          this['parameters'][1]
        >
}

/**
 * Assert that an async function's resolved return type matches the expected type.
 * Combines `Awaited<ReturnType<typeof fn>>` with assertion in one step.
 *
 * @example
 * ```ts
 * async function getUser() { return { name: 'John', age: 30 } }
 * type _ = Ts.Test.Cases<
 *   Ts.Test.returnsPromise<{ name: string; age: number }, Awaited<ReturnType<typeof getUser>>>,  // ✓ Pass
 *   Ts.Test.returnsPromise<{ name: string }, Awaited<ReturnType<typeof getUser>>>                // ✗ Fail - Type error
 * >
 * ```
 */
export type returnsPromise<$Expected, $Actual> = Apply<ReturnsPromiseAssertionKind, [$Expected, $Actual]>

/**
 * Runtime assertion that validates an async function's resolved return type at compile time.
 * This is the value-level equivalent of {@link returnsPromise}.
 *
 * Provides clear error messages with MESSAGE, EXPECTED, and ACTUAL fields when
 * return types don't match.
 *
 * Type-level equivalent: {@link returnsPromise}
 *
 * @example
 * ```ts
 * async function getUser() { return { name: 'John', age: 30 } }
 *
 * // Value mode (provide function in second call)
 * Ts.Test.returnsPromise<{ name: string; age: number }>()(getUser) // ✓ Pass
 * Ts.Test.returnsPromise<{ name: string }>()(getUser) // ✗ Fail - Type error
 *
 * // Type-only mode (provide type as second type parameter)
 * type ResolvedUserReturn = Awaited<ReturnType<typeof getUser>>
 * Ts.Test.returnsPromise<{ name: string; age: number }, ResolvedUserReturn>() // ✓ Pass
 * Ts.Test.returnsPromise<{ name: string }, ResolvedUserReturn>() // ✗ Fail - Type error
 * ```
 */
export const returnsPromise: ExtractorAssertionFn<AwaitedReturnTypeExtractor, ReturnsPromiseAssertionKind> =
  runtimeExtractor
