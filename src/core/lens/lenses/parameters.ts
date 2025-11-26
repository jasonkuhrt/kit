import type { Fn } from '#fn'
import type { ValidateAndExtract } from '../core.js'

type FnConstraint = (...args: any[]) => any

/**
 * Get all parameters as a tuple from a function.
 *
 * @example
 * ```ts
 * type T = Get<(a: string, b: number) => void> // [a: string, b: number]
 * ```
 */
export type Get<$T> = ValidateAndExtract<
  $T,
  FnConstraint,
  'parameters',
  Parameters<Extract<$T, FnConstraint>>
>

/**
 * Set all parameters of a function.
 *
 * @example
 * ```ts
 * type T = Set<(a: string) => void, [x: number, y: boolean]> // (x: number, y: boolean) => void
 * ```
 */
export type Set<$T, $New extends readonly any[]> = $T extends (...args: any[]) => infer __return__
  ? (...args: $New) => __return__
  : never

/**
 * HKT for Get operation.
 */
export interface $Get extends Fn.Kind.Kind {
  constraint: FnConstraint
  lensName: 'parameters'
  parameters: [$T: unknown]
  return: Get<this['parameters'][0]>
}

/**
 * HKT for Set operation.
 */
export interface $Set extends Fn.Kind.Kind {
  constraint: FnConstraint
  lensName: 'parameters'
  parameters: [$T: unknown, $New: readonly any[]]
  return: Set<this['parameters'][0], this['parameters'][1]>
}
