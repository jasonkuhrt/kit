import type { Fn } from '#fn'
import type { ValidateAndExtract } from '../core.js'
import type { ReplaceAt } from './parameter-helpers.js'

type FnConstraint = (...args: any[]) => any

/**
 * Get the second parameter from a function.
 *
 * @example
 * ```ts
 * type T = Get<(a: string, b: number) => void> // number
 * ```
 */
export type Get<$T> = ValidateAndExtract<
  $T,
  FnConstraint,
  'parameter2',
  Parameters<Extract<$T, FnConstraint>>[1]
>

/**
 * Set the second parameter of a function.
 *
 * @example
 * ```ts
 * type T = Set<(a: string, b: number) => void, boolean> // (a: string, b: boolean) => void
 * ```
 */
export type Set<$T, $New> = $T extends (...args: infer __args__) => infer __return__
  ? (...args: ReplaceAt<__args__, 1, $New>) => __return__
  : never

/**
 * HKT for Get operation.
 */
export interface $Get extends Fn.Kind.Kind {
  constraint: FnConstraint
  lensName: 'parameter2'
  parameters: [$T: unknown]
  return: Get<this['parameters'][0]>
}

/**
 * HKT for Set operation.
 */
export interface $Set extends Fn.Kind.Kind {
  constraint: FnConstraint
  lensName: 'parameter2'
  parameters: [$T: unknown, $New: unknown]
  return: Set<this['parameters'][0], this['parameters'][1]>
}
