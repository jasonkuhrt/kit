import { Registry } from './registry/$.ts'

/**
 * Global type registry for trait implementations.
 * Domain modules augment this interface to register their trait implementations.
 *
 * ALL_CAPS naming indicates this is a special global augmentation interface,
 * not a regular type.
 *
 * @example
 * declare global {
 *   interface KIT_TRAIT_REGISTRY {
 *     Eq: {
 *       Arr: { is(a: any[], b: any[]): boolean }
 *     }
 *   }
 * }
 */
declare global {
  interface KIT_TRAIT_REGISTRY {
    [traitName: string]: {
      [domainName: string]: any
    }
  }
}

/**
 * Global singleton registry instance.
 *
 * ALL_CAPS naming indicates this is a singleton with global state.
 *
 * @warning This object's data is mutated via the proxy.
 */
const REGISTRY_INSTANCE = Registry.create()

/**
 * Global mutable singleton storing all trait implementations at runtime.
 *
 * @warning This object is mutated by trait registrations.
 */
export const REGISTRY = REGISTRY_INSTANCE.data

/**
 * Global singleton Traits proxy for intuitive registration.
 *
 * @example
 * TRAITS.Eq.Arr = {
 *   is: (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
 * }
 */
export const TRAITS = REGISTRY_INSTANCE.proxy
