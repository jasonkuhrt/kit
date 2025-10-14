import type { Apply, Kind } from '../kind.js'
import type { GetRelation, IsExact } from '../relation.js'
import { type AssertionFn, runtime, type StaticErrorAssertion } from './helpers.js'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • PropertiesSub Assertion
//
//
//
//

/**
 * PropertiesSub assertion kind - checks if specified properties are subtypes.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected (object shape), $Actual (object)]
 * Returns: never if for each key in $Expected, $Actual[key] extends $Expected[key], otherwise StaticErrorAssertion
 */
interface PropertiesSubKind {
  parameters: [$Expected: object, $Actual: object]
  // dprint-ignore
  return:
    {
      [k in keyof this['parameters'][0]]:
        k extends keyof this['parameters'][1]
          ? this['parameters'][1][k] extends this['parameters'][0][k]
            ? never
            : StaticErrorAssertion<
                `Property '${k & string}' is not a subtype`,
                this['parameters'][0][k],
                this['parameters'][1][k]
              >
          : StaticErrorAssertion<
              `Property '${k & string}' is missing in actual type`,
              this['parameters'][0][k],
              'property not found'
            >
    }[keyof this['parameters'][0]]
}

/**
 * Assert that specified properties in an object are subtypes of expected types.
 *
 * Checks that for each property in the expected shape, the actual object has that property
 * and its type extends the expected type. Only checks properties explicitly listed in
 * the expected shape - additional properties in the actual object are ignored.
 *
 * @example
 * ```ts
 * type User = { name: string; age: number; email?: string }
 *
 * type _ = Ts.Test.Cases<
 *   Ts.Test.propertiesSub<{ name: string }, User>,              // ✓ Pass
 *   Ts.Test.propertiesSub<{ name: string; age: number }, User>, // ✓ Pass
 *   Ts.Test.propertiesSub<{ name: number }, User>               // ✗ Fail - wrong type
 * >
 * ```
 */
export type propertiesSub<$Expected extends object, $Actual extends object> = Apply<
  PropertiesSubKind,
  [$Expected, $Actual]
>

/**
 * Assert that specified properties in a value's object type are subtypes of expected types.
 *
 * Type-level equivalent: {@link propertiesSub}
 *
 * @example
 * ```ts
 * const user = { name: 'John', age: 30, email: 'john@example.com' }
 *
 * // Value mode (provide value in second call)
 * Ts.Test.propertiesSub<{ name: string }>()(user)              // ✓ Pass
 * Ts.Test.propertiesSub<{ name: string; age: number }>()(user) // ✓ Pass
 *
 * // Type-only mode (provide type as second type parameter)
 * type User = typeof user
 * Ts.Test.propertiesSub<{ name: string }, User>()              // ✓ Pass
 * Ts.Test.propertiesSub<{ name: number }, User>()              // ✗ Fail
 * ```
 */
export const propertiesSub: AssertionFn<PropertiesSubKind> = runtime

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • PropertiesExact Assertion
//
//
//
//

/**
 * PropertiesExact assertion kind - checks if specified properties are exactly equal.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected (object shape), $Actual (object)]
 * Returns: never if for each key in $Expected, $Actual[key] is exactly $Expected[key], otherwise StaticErrorAssertion
 */
interface PropertiesExactKind {
  parameters: [$Expected: object, $Actual: object]
  // dprint-ignore
  return:
    {
      [k in keyof this['parameters'][0]]:
        k extends keyof this['parameters'][1]
          ? IsExact<this['parameters'][1][k], this['parameters'][0][k]> extends true
            ? never
            : StaticErrorAssertion<
                `Property '${k & string}' is not exactly equal`,
                this['parameters'][0][k],
                this['parameters'][1][k]
              >
          : StaticErrorAssertion<
              `Property '${k & string}' is missing in actual type`,
              this['parameters'][0][k],
              'property not found'
            >
    }[keyof this['parameters'][0]]
}

/**
 * Assert that specified properties in an object are exactly equal to expected types.
 *
 * Checks that for each property in the expected shape, the actual object has that property
 * and its type is structurally identical. Only checks properties explicitly listed in
 * the expected shape - additional properties in the actual object are ignored.
 *
 * @example
 * ```ts
 * type User = { name: string; age: number; role: 'admin' | 'user' }
 *
 * type _ = Ts.Test.Cases<
 *   Ts.Test.propertiesExact<{ name: string }, User>,             // ✓ Pass
 *   Ts.Test.propertiesExact<{ role: 'admin' | 'user' }, User>,   // ✓ Pass
 *   Ts.Test.propertiesExact<{ role: 'admin' }, User>             // ✗ Fail - not exact
 * >
 * ```
 */
export type propertiesExact<$Expected extends object, $Actual extends object> = Apply<
  PropertiesExactKind,
  [$Expected, $Actual]
>

/**
 * Assert that specified properties in a value's object type are exactly equal to expected types.
 *
 * Type-level equivalent: {@link propertiesExact}
 *
 * @example
 * ```ts
 * const user = { name: 'John', age: 30, role: 'admin' as const }
 *
 * // Value mode
 * Ts.Test.propertiesExact<{ name: string }>()(user)  // ✓ Pass
 *
 * // Type-only mode
 * type User = typeof user
 * Ts.Test.propertiesExact<{ name: string }, User>()  // ✓ Pass
 * ```
 */
export const propertiesExact: AssertionFn<PropertiesExactKind> = runtime

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • PropertiesEquiv Assertion
//
//
//
//

/**
 * PropertiesEquiv assertion kind - checks if specified properties are equivalent (mutually assignable).
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Expected (object shape), $Actual (object)]
 * Returns: never if for each key in $Expected, $Actual[key] is equivalent to $Expected[key], otherwise StaticErrorAssertion
 */
interface PropertiesEquivKind {
  parameters: [$Expected: object, $Actual: object]
  // dprint-ignore
  return:
    {
      [k in keyof this['parameters'][0]]:
        k extends keyof this['parameters'][1]
          ? GetRelation<this['parameters'][0][k], this['parameters'][1][k]> extends 'equivalent'
            ? never
            : StaticErrorAssertion<
                `Property '${k & string}' is not equivalent`,
                this['parameters'][0][k],
                this['parameters'][1][k]
              >
          : StaticErrorAssertion<
              `Property '${k & string}' is missing in actual type`,
              this['parameters'][0][k],
              'property not found'
            >
    }[keyof this['parameters'][0]]
}

/**
 * Assert that specified properties in an object are equivalent (mutually assignable) to expected types.
 *
 * Checks that for each property in the expected shape, the actual object has that property
 * and its type is mutually assignable (equivalent but not necessarily structurally equal).
 * Only checks properties explicitly listed in the expected shape.
 *
 * @example
 * ```ts
 * type User = { name: string; count: number & {} }
 *
 * type _ = Ts.Test.Cases<
 *   Ts.Test.propertiesEquiv<{ name: string }, User>,     // ✓ Pass
 *   Ts.Test.propertiesEquiv<{ count: number }, User>,    // ✓ Pass - number & {} equiv to number
 *   Ts.Test.propertiesEquiv<{ name: number }, User>      // ✗ Fail - not equivalent
 * >
 * ```
 */
export type propertiesEquiv<$Expected extends object, $Actual extends object> = Apply<
  PropertiesEquivKind,
  [$Expected, $Actual]
>

/**
 * Assert that specified properties in a value's object type are equivalent to expected types.
 *
 * Type-level equivalent: {@link propertiesEquiv}
 *
 * @example
 * ```ts
 * const user = { name: 'John', count: 42 }
 *
 * // Value mode
 * Ts.Test.propertiesEquiv<{ name: string }>()(user)  // ✓ Pass
 *
 * // Type-only mode
 * type User = typeof user
 * Ts.Test.propertiesEquiv<{ count: number }, User>()  // ✓ Pass
 * ```
 */
export const propertiesEquiv: AssertionFn<PropertiesEquivKind> = runtime
