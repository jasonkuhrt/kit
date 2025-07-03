import type { DomainName } from '../domain.ts'
import type { Implementation } from '../implement.ts'
import type { TraitName } from '../types.ts'

/**
 * Type-safe trait registry for a single trait.
 * Used both internally and in compiled output.
 */
export interface TraitRegistry<T> {
  implementations: Record<string, T>
  domainDetector: ((value: unknown) => string | null) | null
  methodConfigs?: Record<string, any> // Stores method configurations from trait definition
  initialize?: () => void
  isInitialized?: boolean
}

/**
 * Factory for creating trait registries.
 */
export const TraitRegistry = {
  create<T = any>(initialize?: () => void): TraitRegistry<T> {
    const registry: TraitRegistry<T> = {
      implementations: {},
      domainDetector: null,
    }
    if (initialize) {
      registry.initialize = initialize
    }
    return registry
  },
}

/**
 * Runtime registry data structure - now uses TraitRegistry internally.
 */
export type Registry = Record<string, TraitRegistry<any>>

/**
 * Create a new trait registry.
 *
 * @returns A new empty registry
 *
 * @example
 * const registry = Registry.create()
 * Registry.register(registry, 'Eq', 'Num', { is: (a, b) => a === b })
 * console.log(registry) // { Eq: { implementations: { Num: { is: [Function] } } } }
 */
const create = (): Registry => {
  return {}
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
 * register(registry, 'Eq', 'Arr', {
 *   is: (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
 * })
 */
export const register = (
  registry: Registry,
  traitName: TraitName,
  domainName: DomainName,
  implementation: Implementation,
): void => {
  if (!registry[traitName]) {
    registry[traitName] = TraitRegistry.create()
  }
  registry[traitName].implementations[domainName] = implementation
}

export { create }
