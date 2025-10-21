/**
 * Type utilities for detecting TypeScript edge case types: `any`, `never`, and `unknown`.
 *
 * These utilities are useful for conditional type logic that needs to handle these special types differently.
 *
 * @module
 */

/**
 * Detect if a type is `any` or `unknown`.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equal<IsAnyOrUnknown<any>, true>,
 *   Ts.Test.equal<IsAnyOrUnknown<unknown>, true>,
 *   Ts.Test.equal<IsAnyOrUnknown<never>, false>,
 *   Ts.Test.equal<IsAnyOrUnknown<string>, false>
 * >
 * ```
 */
export type IsAnyOrUnknown<T> = unknown extends T ? true : false

/**
 * Detect if a type is `any`, `unknown`, or `never`.
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equal<IsAnyOrUnknownOrNever<any>, true>,
 *   Ts.Test.equal<IsAnyOrUnknownOrNever<unknown>, true>,
 *   Ts.Test.equal<IsAnyOrUnknownOrNever<never>, true>,
 *   Ts.Test.equal<IsAnyOrUnknownOrNever<string>, false>
 * >
 * ```
 */
// dprint-ignore
export type IsAnyOrUnknownOrNever<T> =
  [T] extends [never] ? true /* never */ :
  unknown extends T   ? true /* any or unknown, we don't care which */
                      : false

// dprint-ignore
export type GetCase<T> =
    [T] extends [never]   ? Case.Never :
    unknown extends T     ? (
                              0 extends (1 & T)
                                ? Case.Any
                                : Case.Unknown
                            )
                          : Case.Proper

export type Case =
  | Case.Any
  | Case.Unknown
  | Case.Never
  | Case.Proper

export namespace Case {
  export type Any = 'any'
  export type Unknown = 'unknown'
  export type Never = 'never'
  export type Proper = 'proper'
}

/**
 * Check if a type is empty.
 *
 * Empty types:
 * - Empty array: `[]` or `readonly []`
 * - Empty object: `keyof T extends never` (no properties)
 * - Empty string: `''`
 *
 * Note: `{}` and `interface Foo {}` mean "non-nullish", NOT empty!
 *
 * @example
 * ```ts
 * type _ = Ts.Test.Cases<
 *   Ts.Test.equal<IsEmpty<[]>, true>,
 *   Ts.Test.equal<IsEmpty<readonly []>, true>,
 *   Ts.Test.equal<IsEmpty<''>, true>,
 *   Ts.Test.equal<IsEmpty<Record<string, never>>, true>,
 *   Ts.Test.equal<IsEmpty<[1]>, false>,
 *   Ts.Test.equal<IsEmpty<'hello'>, false>,
 *   Ts.Test.equal<IsEmpty<{ a: 1 }>, false>,
 *   Ts.Test.equal<IsEmpty<{}>, false>  // {} = non-nullish, not empty!
 * >
 * ```
 */
// dprint-ignore
export type IsEmpty<$T> =
  $T extends readonly [] ? true :
  $T extends '' ? true :
  $T extends object
    ? keyof $T extends never ? true : false
    : false
