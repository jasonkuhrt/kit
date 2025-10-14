import type { Obj } from '#obj'
import type { Apply, Kind } from '../kind.js'
import { runtimeUnary, type StaticErrorAssertion, type UnaryAssertionFn } from './helpers.js'

/**
 * EqualNever assertion kind - checks if type is exactly never.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Actual]
 * Returns: never if type is never, otherwise StaticErrorAssertion
 */
interface EqualNeverKind {
  parameters: [$Actual: unknown]
  // dprint-ignore
  return:
    [this['parameters'][0]] extends [never]
      ? never
      : StaticErrorAssertion<'Type is not never', never, this['parameters'][0]>
}

/**
 * Assert that a type is exactly `never`.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equalNever<never>,  // ✓ Pass
 *   Ts.Test.equalNever<string>  // ✗ Fail - Type error
 * >
 * ```
 */
export type equalNever<$Actual> = Apply<EqualNeverKind, [$Actual]>

/**
 * Assert that a type is exactly `never`.
 *
 * Type-level equivalent: {@link equalNever}
 *
 * @example
 * ```ts
 * equalNever<never>() // OK
 * equalNever()(value) // OK if value is never
 * equalNever<string>() // Error
 * ```
 */
export const equalNever: UnaryAssertionFn<EqualNeverKind> = runtimeUnary

/**
 * EqualAny assertion kind - checks if type is exactly any.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Uses the `0 extends 1 & T` trick to detect `any`.
 *
 * Parameters: [$Actual]
 * Returns: never if type is any, otherwise StaticErrorAssertion
 */
interface EqualAnyKind {
  parameters: [$Actual: unknown]
  // dprint-ignore
  return:
    0 extends 1 & this['parameters'][0]
      ? never
      : StaticErrorAssertion<'Type is not any', any, this['parameters'][0]>
}

/**
 * Assert that a type is exactly `any`.
 *
 * Uses the `0 extends 1 & T` trick to detect `any`.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equalAny<any>,      // ✓ Pass
 *   Ts.Test.equalAny<unknown>,  // ✗ Fail - Type error
 *   Ts.Test.equalAny<string>    // ✗ Fail - Type error
 * >
 * ```
 */
export type equalAny<$Actual> = Apply<EqualAnyKind, [$Actual]>

/**
 * Assert that a type is exactly `any`.
 *
 * Type-level equivalent: {@link equalAny}
 *
 * @example
 * ```ts
 * equalAny<any>() // OK
 * equalAny()(value) // OK if value is any
 * equalAny<unknown>() // Error
 * ```
 */
export const equalAny: UnaryAssertionFn<EqualAnyKind> = runtimeUnary

/**
 * EqualUnknown assertion kind - checks if type is exactly unknown.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Parameters: [$Actual]
 * Returns: never if type is unknown (but not any), otherwise StaticErrorAssertion
 */
interface EqualUnknownKind {
  parameters: [$Actual: unknown]
  // dprint-ignore
  return:
    unknown extends this['parameters'][0]
      ? 0 extends 1 & this['parameters'][0]
        ? StaticErrorAssertion<
            'Type is any, not unknown',
            unknown,
            this['parameters'][0]
          >
        : never
      : StaticErrorAssertion<'Type is not unknown', unknown, this['parameters'][0]>
}

/**
 * Assert that a type is exactly `unknown`.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equalUnknown<unknown>,  // ✓ Pass
 *   Ts.Test.equalUnknown<any>,      // ✗ Fail - Type error
 *   Ts.Test.equalUnknown<string>    // ✗ Fail - Type error
 * >
 * ```
 */
export type equalUnknown<$Actual> = Apply<EqualUnknownKind, [$Actual]>

/**
 * Assert that a type is exactly `unknown`.
 *
 * Type-level equivalent: {@link equalUnknown}
 *
 * @example
 * ```ts
 * equalUnknown<unknown>() // OK
 * equalUnknown()(value) // OK if value is unknown
 * equalUnknown<any>() // Error
 * ```
 */
export const equalUnknown: UnaryAssertionFn<EqualUnknownKind> = runtimeUnary

/**
 * EqualEmptyObject assertion kind - checks if type is an empty object.
 *
 * Part of the Higher-Kinded Types (HKT) pattern. See {@link helpers.ts} for detailed explanation.
 *
 * Uses {@link Obj.IsEmpty} from kit to check if the object has no keys.
 *
 * Parameters: [$Actual]
 * Returns: never if type is empty object, otherwise StaticErrorAssertion
 */
interface EqualEmptyObjectKind {
  parameters: [$Actual: object]
  // dprint-ignore
  return:
    Obj.IsEmpty<this['parameters'][0]> extends true
      ? never
      : StaticErrorAssertion<'Type is not an empty object (has keys)', Obj.Empty, this['parameters'][0]>
}

/**
 * Assert that a type is an empty object (no properties).
 *
 * Uses {@link Obj.IsEmpty} from kit to check if the object has no keys.
 * Note: `{}` in TypeScript means "any non-nullish value", not an empty object.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equalEmptyObject<Record<string, never>>,  // ✓ Pass
 *   Ts.Test.equalEmptyObject<{}>,                      // ✗ Fail - {} is not empty
 *   Ts.Test.equalEmptyObject<{ a: 1 }>                 // ✗ Fail - has properties
 * >
 * ```
 */
export type equalEmptyObject<$Actual extends object> = Apply<EqualEmptyObjectKind, [$Actual]>

/**
 * Assert that a value's type is an empty object (no properties).
 *
 * Uses {@link Obj.IsEmpty} from kit to check if the object has no keys.
 * Note: `{}` in TypeScript means "any non-nullish value", not an empty object.
 *
 * Type-level equivalent: {@link equalEmptyObject}
 *
 * @example
 * ```ts
 * // Using Obj.empty() factory (recommended)
 * Ts.Test.equalEmptyObject()(Obj.empty())  // ✓ Pass
 *
 * // Using Obj.Empty type explicitly
 * Ts.Test.equalEmptyObject()({} as Obj.Empty)  // ✓ Pass
 *
 * // Type-only mode
 * Ts.Test.equalEmptyObject<Obj.Empty>()  // ✓ Pass
 *
 * // Plain {} infers as the problematic {} type
 * Ts.Test.equalEmptyObject()({})                // ✗ Fail - inferred as {}
 * Ts.Test.equalEmptyObject()({ a: 1 })          // ✗ Fail - has properties
 * ```
 */
export const equalEmptyObject: UnaryAssertionFn<EqualEmptyObjectKind> = runtimeUnary
