import type { Apply, Kind } from '../kind.ts'
import { type AssertionFn, runtime, type StaticErrorAssertion } from './helpers.ts'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Sup Assertion
//
//
//
//

/**
 * Sup assertion kind - encapsulates the supertype check logic.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Supertype, $Actual]
 * Returns: never if $Actual extends $Supertype, otherwise StaticErrorAssertion
 */
interface SupKind {
  parameters: [$Supertype: unknown, $Actual: unknown]
  // dprint-ignore
  return:
    this['parameters'][1] extends this['parameters'][0]
      ? never
      : StaticErrorAssertion<
          'Actual type does not extend expected supertype',
          this['parameters'][0],
          this['parameters'][1]
        >
}

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
export type sup<$Supertype, $Actual> = Apply<SupKind, [$Supertype, $Actual]>

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
 * // Value mode (provide value in second call)
 * const extended: Extended = { id: '1', name: 'test' }
 * Ts.Test.sup<Base>()(extended)     // OK - Extended extends Base
 * Ts.Test.sup<Extended>()(extended) // OK - Extended extends Extended
 *
 * const base: Base = { id: '1' }
 * Ts.Test.sup<Extended>()(base)     // Error - Base doesn't extend Extended
 *
 * // Type-only mode (provide type as second type parameter)
 * Ts.Test.sup<object, { a: 1 }>() // OK - { a: 1 } extends object
 * Ts.Test.sup<string, 'hello'>() // OK - 'hello' extends string
 * ```
 */
export const sup: AssertionFn<SupKind> = runtime
