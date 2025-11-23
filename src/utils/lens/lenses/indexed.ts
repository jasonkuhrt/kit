import type { Fn } from '#fn'
import type { Either } from 'effect'
import type { LensErrorKeyNotFound } from '../core.js'

/**
 * Get a property by key from an object.
 *
 * @example
 * ```ts
 * type T = Get<{ a: string; b: number }, 'a'> // string
 * ```
 */
export type Get<$T, $Key extends PropertyKey> = $Key extends keyof $T ? Either.Right<never, $T[$Key]>
  : Either.Left<LensErrorKeyNotFound<$Key, $T>, never>

/**
 * Set a property by key in an object.
 *
 * @example
 * ```ts
 * type T = Set<{ a: string; b: number }, 'a', boolean> // { a: boolean; b: number }
 * ```
 */
export type Set<$T, $Key extends PropertyKey, $New> = $Key extends keyof $T
  ? { [k in keyof $T]: k extends $Key ? $New : $T[k] }
  : never

/**
 * HKT for Get operation.
 */
export interface $Get extends Fn.Kind.Kind {
  constraint: unknown
  lensName: 'indexed'
  parameters: [$T: unknown, $Key: PropertyKey]
  return: Get<this['parameters'][0], this['parameters'][1]>
}

/**
 * HKT for Set operation.
 */
export interface $Set extends Fn.Kind.Kind {
  constraint: unknown
  lensName: 'indexed'
  parameters: [$T: unknown, $Key: PropertyKey, $New: unknown]
  return: Set<this['parameters'][0], this['parameters'][1], this['parameters'][2]>
}
