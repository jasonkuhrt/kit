import { Fn } from '#fn'
import type { Apply, Kind } from '../kind.js'
import { runtime } from './helpers.js'
import type { ___NoValue___ } from './shared.js'
import type { tuple as tupleType } from './tuple.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Parameters Assertion
//
//
//
//

/**
 * Parameters assertion kind - extracts Parameters<Fn> and delegates to tuple.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected (tuple), $Actual (tuple)]
 * Returns: Delegates to tuple assertion
 *
 * Note: For type-level, pass Parameters<typeof fn> as $Actual
 */
interface ParametersKind {
  parameters: [$Expected: readonly any[], $Actual: readonly any[]]
  // dprint-ignore
  return: tupleType<this['parameters'][0], this['parameters'][1]>
}

/**
 * Assert that a function's parameters match the expected type.
 * Combines `Parameters<typeof fn>` with assertion in one step.
 *
 * @example
 * ```ts
 * function add(a: number, b: number): number { return a + b }
 * type _ = Ts.Test.Cases<
 *   Ts.Test.parameters<[number, number], Parameters<typeof add>>,  // ✓ Pass
 *   Ts.Test.parameters<[string, string], Parameters<typeof add>>   // ✗ Fail - Type error
 * >
 * ```
 */
export type parameters<$Expected extends readonly any[], $Actual extends readonly any[]> = Apply<
  ParametersKind,
  [$Expected, $Actual]
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
 * Note: Value mode has special behavior - it accepts a function and extracts Parameters,
 * so it doesn't use the standard AssertionFn pattern.
 *
 * @example
 * ```ts
 * function add(a: number, b: number) { return a + b }
 *
 * // Value mode (provide function in second call)
 * Ts.Test.parameters<[number, number]>()(add) // ✓ Pass
 * Ts.Test.parameters<[string, string]>()(add) // ✗ Fail - Type error
 *
 * // Type-only mode (provide type as second type parameter)
 * type AddParams = Parameters<typeof add>
 * Ts.Test.parameters<[number, number], AddParams>() // ✓ Pass
 * Ts.Test.parameters<[string, string], AddParams>() // ✗ Fail - Type error
 *
 * // Your original example
 * type i1 = Interceptor.InferFromPipeline<typeof p1>
 * Ts.Test.parameters<[steps: { a: any; b: any; c: any }], i1>()
 * ```
 */
// dprint-ignore
export const parameters = <$Expected extends readonly any[], $Actual = ___NoValue___>(
  ..._:
    [$Actual] extends [___NoValue___]
      ? []
      : [Apply<ParametersKind, [$Expected, $Actual]>] extends [never]
        ? []
        : [error: Apply<ParametersKind, [$Expected, $Actual]>]
):
  [$Actual] extends [___NoValue___]
    ? <$Function extends Fn.AnyAny>(
        _fn: [Apply<ParametersKind, [$Expected, Parameters<$Function>]>] extends [never]
          ? $Function
          : Apply<ParametersKind, [$Expected, Parameters<$Function>]>
      ) => void
    : void =>
{
  return runtime as any
}
