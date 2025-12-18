import type { Fn } from '#fn'
import type { ValidateAndExtract } from '../core.js'
import type { ReplaceAt } from './parameter-helpers.js'

type FnConstraint = (...args: any[]) => any

/**
 * Get the fifth parameter from a function.
 *
 * @example
 * ```ts
 * type T = Get<(a: 1, b: 2, c: 3, d: 4, e: 5) => void> // 5
 * ```
 */
export type Get<$T> = ValidateAndExtract<
  $T,
  FnConstraint,
  'parameter5',
  Parameters<Extract<$T, FnConstraint>>[4]
>

/**
 * Set the fifth parameter of a function.
 *
 * @example
 * ```ts
 * type T = Set<(a: 1, b: 2, c: 3, d: 4, e: 5) => void, 100>
 * // (a: 1, b: 2, c: 3, d: 4, e: 100) => void
 * ```
 */
export type Set<$T, $New> = $T extends (...args: infer __args__) => infer __return__
  ? (...args: ReplaceAt<__args__, 4, $New>) => __return__
  : never

/**
 * HKT for Get operation.
 */
export interface $Get extends Fn.Kind.Kind {
  constraint: FnConstraint
  lensName: 'parameter5'
  parameters: [$T: unknown]
  return: Get<this['parameters'][0]>
}

/**
 * HKT for Set operation.
 */
export interface $Set extends Fn.Kind.Kind {
  constraint: FnConstraint
  lensName: 'parameter5'
  parameters: [$T: unknown, $New: unknown]
  return: Set<this['parameters'][0], this['parameters'][1]>
}
