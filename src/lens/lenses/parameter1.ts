import type { Fn } from '#fn'
import type { ValidateAndExtract } from '../core.js'
import type { ReplaceAt } from './parameter-helpers.js'

type FnConstraint = (...args: any[]) => any

/**
 * Get the first parameter from a function.
 *
 * @example
 * ```ts
 * type T = Get<(a: string, b: number) => void> // string
 * ```
 */
export type Get<$T> = ValidateAndExtract<
  $T,
  FnConstraint,
  'parameter1',
  Parameters<Extract<$T, FnConstraint>>[0]
>

/**
 * Set the first parameter of a function.
 *
 * @example
 * ```ts
 * type T = Set<(a: string, b: number) => void, boolean> // (a: boolean, b: number) => void
 * ```
 */
export type Set<$T, $New> = $T extends (...args: infer __args__) => infer __return__
  ? (...args: ReplaceAt<__args__, 0, $New>) => __return__
  : never

/**
 * HKT for Get operation.
 */
export interface $Get extends Fn.Kind.Kind {
  constraint: FnConstraint
  lensName: 'parameter1'
  parameters: [$T: unknown]
  return: Get<this['parameters'][0]>
}

/**
 * HKT for Set operation.
 */
export interface $Set extends Fn.Kind.Kind {
  constraint: FnConstraint
  lensName: 'parameter1'
  parameters: [$T: unknown, $New: unknown]
  return: Set<this['parameters'][0], this['parameters'][1]>
}
