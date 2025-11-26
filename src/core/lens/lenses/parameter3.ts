import type { Fn } from '#fn'
import type { ValidateAndExtract } from '../core.js'
import type { ReplaceAt } from './parameter-helpers.js'

type FnConstraint = (...args: any[]) => any

/**
 * Get the third parameter from a function.
 *
 * @example
 * ```ts
 * type T = Get<(a: string, b: number, c: boolean) => void> // boolean
 * ```
 */
export type Get<$T> = ValidateAndExtract<
  $T,
  FnConstraint,
  'parameter3',
  Parameters<Extract<$T, FnConstraint>>[2]
>

/**
 * Set the third parameter of a function.
 *
 * @example
 * ```ts
 * type T = Set<(a: string, b: number, c: boolean) => void, symbol> // (a: string, b: number, c: symbol) => void
 * ```
 */
export type Set<$T, $New> = $T extends (...args: infer __args__) => infer __return__
  ? (...args: ReplaceAt<__args__, 2, $New>) => __return__
  : never

/**
 * HKT for Get operation.
 */
export interface $Get extends Fn.Kind.Kind {
  constraint: FnConstraint
  lensName: 'parameter3'
  parameters: [$T: unknown]
  return: Get<this['parameters'][0]>
}

/**
 * HKT for Set operation.
 */
export interface $Set extends Fn.Kind.Kind {
  constraint: FnConstraint
  lensName: 'parameter3'
  parameters: [$T: unknown, $New: unknown]
  return: Set<this['parameters'][0], this['parameters'][1]>
}
