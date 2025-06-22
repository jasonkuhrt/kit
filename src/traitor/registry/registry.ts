import type { DomainName, Implementation, TraitName } from '../types.ts'

/**
 * Runtime registry data structure.
 */
export type Data = Record<string, Record<string, any>>

/**
 * Registry instance with data and proxy access.
 */
export interface Registry {
  /**
   * The underlying registry data.
   * Mutated by register() and the proxy.
   */
  readonly data: Data

  /**
   * Proxy-based API for intuitive trait registration.
   *
   * @example
   * registry.proxy.Eq.Arr = {
   *   is: (a, b) => a.length === b.length
   * }
   */
  readonly proxy: any
}

/**
 * Create a new trait registry.
 *
 * @returns A new registry with data and proxy access
 *
 * @example
 * const registry = Registry.create()
 * registry.proxy.Eq.Num = { is: (a, b) => a === b }
 * console.log(registry.data) // { Eq: { Num: { is: [Function] } } }
 */
const create = (): Registry => {
  const data: Data = {}

  const proxy = new Proxy({} as any, {
    get(_, traitName: string) {
      return new Proxy({}, {
        get(_, domainName: string) {
          return data[traitName]?.[domainName]
        },
        set(_, domainName: string, implementation: Implementation) {
          register(data, traitName, domainName, implementation)
          return true
        },
      })
    },
  })

  return { data, proxy }
}

/**
 * Register a domain's implementation of a trait.
 *
 * Note: While trait methods can use `this` context if a thisArg is provided
 * to dispatch, it's recommended to use pure functions for simplicity.
 *
 * @param registry - The registry data to mutate
 * @param traitName - The name of the trait (e.g., 'Eq')
 * @param domainName - The domain implementing the trait (e.g., 'Arr')
 * @param implementation - Object containing the trait methods
 *
 * @example
 * register(registry.data, 'Eq', 'Arr', {
 *   is: (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
 * })
 */
export const register = (
  registry: Data,
  traitName: TraitName,
  domainName: DomainName,
  implementation: Implementation,
): void => {
  registry[traitName] ??= {}
  registry[traitName][domainName] = implementation
}

export { create }
