/**
 * Higher-kinded type utilities for TypeScript.
 *
 * Provides type-level functions and utilities for simulating higher-kinded
 * types in TypeScript, enabling more advanced type-level programming patterns.
 *
 * @module
 */

/**
 * Apply arguments to a kind (higher-kinded type function).
 *
 * Simulates type-level function application by using intersection types
 * to "pass" parameters and extract the return type. This is a common
 * pattern for implementing higher-kinded types in TypeScript.
 *
 * @template $Kind - The kind function to apply
 * @template $Args - The arguments to apply to the kind function
 *
 * @example
 * ```ts
 * // Define a type-level function
 * interface ArrayOf {
 *   return: Array<this['parameters'][0]>
 * }
 *
 * // Apply it to a type
 * type StringArray = Kind.Apply<ArrayOf, [string]> // string[]
 * type NumberArray = Kind.Apply<ArrayOf, [number]> // number[]
 * ```
 */
export type Apply<$Kind, $Args> =
  // @ts-expect-error - Intentional type manipulation for kind simulation
  ($Kind & { parameters: $Args })['return']

/**
 * Define a kind (higher-kinded type) function interface.
 *
 * Provides a standard structure for defining type-level functions
 * that can be applied using the Apply utility.
 *
 * @template $Params - The parameter types this kind accepts
 * @template $Return - The return type this kind produces
 *
 * @example
 * ```ts
 * interface BoxOf extends Kind<[unknown], Box<any>> {
 *   return: Box<this['parameters'][0]>
 * }
 * ```
 */
export interface Kind<$Params = unknown, $Return = unknown> {
  readonly parameters: $Params
  readonly return: $Return
}

/**
 * Extract the parameter types from a kind.
 *
 * @template $Kind - The kind to extract parameters from
 */
export type Parameters<$Kind> = $Kind extends Kind<infer P, any> ? P : never

/**
 * Extract the return type from a kind.
 *
 * @template $Kind - The kind to extract return type from
 */
export type Return<$Kind> = $Kind extends Kind<any, infer R> ? R : never

/**
 * Create a type-level identity function.
 *
 * Returns the input type unchanged. Useful as a default or
 * placeholder in kind compositions.
 *
 * @example
 * ```ts
 * type Same = Kind.Apply<Kind.Identity, [string]> // string
 * ```
 */
export interface Identity extends Kind {
  // @ts-expect-error
  return: this['parameters'][0]
}

/**
 * Create a type-level constant function.
 *
 * Always returns the same type regardless of input.
 *
 * @template $Const - The constant type to always return
 *
 * @example
 * ```ts
 * type AlwaysString = Kind.Apply<Kind.Const<string>, [number]> // string
 * ```
 */
export interface Const<$Const> extends Kind {
  return: $Const
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Private Kinds
//
//

/**
 * Private symbol for storing kind return type.
 */
export const PrivateKindReturn = Symbol()
export type PrivateKindReturn = typeof PrivateKindReturn

/**
 * Private symbol for storing kind parameters.
 */
export const PrivateKindParameters = Symbol()
export type PrivateKindParameters = typeof PrivateKindParameters

/**
 * Private kind interface using symbols instead of string keys.
 *
 * This provides a more secure way to define higher-kinded types
 * as the symbols cannot be accessed outside the module.
 *
 * @example
 * ```ts
 * interface BoxKind extends PrivateKind {
 *   // @ts-expect-error
 *   [PRIVATE_KIND_RETURN]: Box<this[PRIVATE_KIND_PARAMETERS][0]>
 *   [PRIVATE_KIND_PARAMETERS]: unknown
 * }
 * ```
 */
export interface Private {
  [PrivateKindReturn]: unknown
  [PrivateKindParameters]: unknown
}

/**
 * Apply arguments to a private kind.
 *
 * @template $Kind - The private kind to apply
 * @template $Args - The arguments to apply
 *
 * @example
 * ```ts
 * type BoxOfString = PrivateKindApply<BoxKind, [string]> // Box<string>
 * ```
 */
export type PrivateApply<$Kind extends Private, $Args> = ($Kind & { [PrivateKindParameters]: $Args })[PrivateKindReturn]

// dprint-ignore
export type MaybePrivateApplyOr<$MaybeKind, $Args, $Or> =
  $MaybeKind extends Private
    ? PrivateApply<$MaybeKind, $Args>
    : $Or

/**
 * Check if a type is a private kind.
 *
 * @template T - The type to check
 *
 * @example
 * ```ts
 * type Test1 = IsPrivateKind<BoxKind> // true
 * type Test2 = IsPrivateKind<string> // false
 * ```
 */
export type IsPrivateKind<T> = T extends Private ? true : false
