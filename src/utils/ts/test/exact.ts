import { Fn } from '#fn'
import type { Apply, Kind } from '../kind.js'
import type { GetRelation, IsExact } from '../relation.js'
import { type AssertionFn, type ConstAssertionFn, runtime, runtimeConst, type StaticErrorAssertion } from './helpers.js'
import type { _ExactError } from './shared.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Exact Assertion
//
//
//
//

/**
 * Exact assertion kind - checks for exact structural equality.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected, $Actual]
 * Returns: never if types are exactly equal, otherwise StaticErrorAssertion or _ExactError
 */
interface ExactKind {
  parameters: [$Expected: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    IsExact<this['parameters'][1], this['parameters'][0]> extends true
      ? never
      : GetRelation<this['parameters'][0], this['parameters'][1]> extends 'equivalent'
        ? _ExactError<this['parameters'][0], this['parameters'][1]>
        : StaticErrorAssertion<
            'Types are not exactly equal',
            this['parameters'][0],
            this['parameters'][1]
          >
}

/**
 * Assert that two types are exactly equal (structurally).
 *
 * Uses a conditional type inference trick to check exact structural equality,
 * correctly handling any, never, and unknown edge cases.
 *
 * This checks for structural equality - types must have the same structure,
 * not just compute to the same result. For mutual assignability, use {@link equiv}.
 *
 * When types are equivalent but not exact (mutually assignable), provides a helpful
 * error suggesting to use equiv(). For other mismatches, TypeScript's native error
 * messages show the specific structural differences.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.exact<string, string>,           // ✓ Pass
 *   Ts.Test.exact<string | number, string>,  // ✗ Fail - TypeScript shows mismatch
 *   Ts.Test.exact<{ a: 1 }, { a: 1 }>,       // ✓ Pass
 *   Ts.Test.exact<any, unknown>,             // ✗ Fail - TypeScript shows mismatch
 *   Ts.Test.exact<1 | 2, 2 | 1>              // ✗ Fail with tip - types are equivalent but not structurally equal
 * >
 * ```
 */
export type exact<$Expected, $Actual> = Apply<ExactKind, [$Expected, $Actual]>

/**
 * Assert that two types are exactly equal (structurally) at compile time.
 * More strict than extends as it checks structural equality.
 *
 * When types are equivalent but not exact (mutually assignable), provides
 * a helpful tip about using {@link equiv} or applying Simplify from `#ts`.
 * For other mismatches, TypeScript's native error messages show the
 * specific structural differences.
 *
 * Type-level equivalent: {@link exact}
 *
 * @example
 * ```ts
 * // Value mode (provide value in second call)
 * Ts.Test.exact<string>()('hello') // OK - string exactly equals string
 * Ts.Test.exact<string | number>()('hello') // Error - string does not exactly equal string | number
 * Ts.Test.exact<{ a: 1 }>()({ a: 1 }) // OK
 * Ts.Test.exact<{ a: 1; b?: 2 }>()({ a: 1 }) // Error - not exactly equal
 *
 * // Type-only mode (provide type as second type parameter)
 * Ts.Test.exact<string, string>() // OK
 * Ts.Test.exact<string, number>() // Error - types not equal
 * Ts.Test.exact<never, never>() // OK - can test never directly
 * ```
 */
export const exact: AssertionFn<ExactKind> = runtime

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
export const exactConst: ConstAssertionFn<ExactKind> = runtimeConst
