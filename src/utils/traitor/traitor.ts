import type { Fn } from '#fn'
import type { Ts } from '#ts'
import { Dispatcher } from './dispatcher/$.ts'
import { Registry } from './registry/$.ts'
import type { GetDeps as GetDepsFromTrait, GetInternal } from './trait-interface.ts'
import type { Domain } from './types.ts'

/**
 * Define a domain for trait implementations.
 *
 * @param name - The domain name (e.g., 'Str', 'Num', 'Arr')
 * @param typeWitness - A representative value of the type this domain handles
 * @returns A domain definition that can be passed to trait implementations
 *
 * @example
 * ```ts
 * const strDomain = domain('Str', '')
 * export const Eq = EqTrait.implement(strDomain, {
 *   is(a, b) { return typeof b === 'string' && a === b }
 * })
 * ```
 */
export const domain = <
  const $Name extends string,
  $Type,
>(name: $Name, _typeWitness: $Type): Domain<$Type, $Name> => ({
  name,
  _type: undefined as any,
})

declare global {
  /**
   * Centralized trait metadata registry
   */
  interface TRAITOR_TRAITS {
    // Example:
    // Eq: {
    //   kind: EqKind
    //   interface: Eq
    //   deps: [TRAITOR_TRAITS['Type']]
    // }
  }
}

// Helper types to work with TRAITOR_TRAITS
export type GetInterface<T extends keyof TRAITOR_TRAITS> = TRAITOR_TRAITS[T]
// Note: Kind is now embedded in the trait interface itself using private symbols
export type GetDeps<T extends keyof TRAITOR_TRAITS> = GetDepsFromTrait<TRAITOR_TRAITS[T]>

// Build object with dependencies as trait implementations
export type DepsObject<T extends keyof TRAITOR_TRAITS> = GetDeps<T> extends readonly (infer D)[]
  ? D extends keyof TRAITOR_TRAITS ? { [K in D]: GetInternal<TRAITOR_TRAITS[K]> }
  : {}
  : {}

/**
 * Configuration options for trait registration.
 *
 * @template name - The name of the trait being configured
 */
export interface TraitOptions<name extends keyof TRAITOR_TRAITS> {
  /**
   * Base implementation factory for the trait.
   *
   * Provides default behavior that can be overridden by domain-specific
   * implementations. The base receives a dispatch function to delegate
   * to domain implementations when needed.
   *
   * @param dispatch - Function to dispatch method calls to domain implementations
   * @returns Partial implementation of the trait interface
   */
  base?: (
    domain: { [K in name]: GetInternal<GetInterface<name>> } & DepsObject<name>,
    self: GetInternal<GetInterface<name>>,
  ) => Partial<GetInternal<GetInterface<name>>>
}

/**
 * Core interface for the Traitor trait system.
 *
 * Provides polymorphic dispatch for trait methods across different data types
 * in Kit. Enables domains to register trait implementations that are dynamically
 * resolved at runtime based on the input types.
 */
export interface Traitor {
  /**
   * Direct access to all registered trait implementations.
   *
   * Provides typed access to trait methods for direct invocation.
   * Primarily used internally by the trait system.
   */
  traits: {
    [K in keyof TRAITOR_TRAITS]: GetInterface<K>
  }
  /**
   * The underlying registry storing all trait implementations.
   *
   * Exposes the mutable registry for advanced use cases like
   * runtime inspection or dynamic trait registration.
   */
  registry: Registry.Registry
  /**
   * Registers a new trait with optional base implementation.
   *
   * Creates a polymorphic trait that can be implemented by different
   * domains. Returns both the trait instance and an implement function
   * for registering domain-specific implementations.
   *
   * @param name - The name of the trait to register
   * @param options - Configuration options including base implementation
   * @returns Object containing the trait instance and implement function
   *
   * @example
   * ```ts
   * const { Eq, implement } = traitor.trait('Eq', {
   *   base: (dispatch) => ({
   *     is: (a, b) => dispatch('is', a, b),
   *     isOn: (a) => (b) => dispatch('is', a, b)
   *   })
   * })
   *
   * // Register domain implementation
   * implement<string>()('Str', {
   *   is: (a, b) => a === b
   * })
   * ```
   */
  trait<name extends keyof TRAITOR_TRAITS>(name: name, options?: TraitOptions<name>): RuntimeDefinition<name>
}

/**
 * Internal utilities for a trait.
 */
export interface DefinitionInternals<$TraitName extends keyof TRAITOR_TRAITS> {
  /**
   * Function to register domain-specific implementations of this trait.
   */
  implement: <
    $Domain extends Domain<any, any>,
    implementation extends GetInternal<Ts.Kind.PrivateKindApply<GetInterface<$TraitName>, [$Domain['_type']]>>,
  >(
    domain: $Domain,
    implementation: implementation,
  ) => Ts.Kind.PrivateKindApply<GetInterface<$TraitName>, [$Domain['_type']]>
}

/**
 * Result of registering a trait with the Traitor system.
 *
 * The trait instance is directly returned with internal utilities nested under $.
 *
 * @template $TraitName - The name of the registered trait
 */
export type RuntimeDefinition<$TraitName extends keyof TRAITOR_TRAITS> =
  & GetInterface<$TraitName>
  & {
    $: DefinitionInternals<$TraitName>
  }

/**
 * Creates a new Traitor instance with its own registry.
 *
 * @param customRegistry - Optional custom registry to use. If not provided,
 *                         creates a new empty registry.
 * @returns A new Traitor instance
 *
 * @example
 * ```ts
 * // Create with default registry
 * const traitor = create()
 *
 * // Create with custom registry
 * const registry = Registry.create()
 * const traitor = create(registry)
 * ```
 */
export const create = (customRegistry?: Registry.Registry): Traitor => {
  const registry = customRegistry ?? Registry.create()
  return {
    registry,
    traits: registry.data as any,
    trait(traitName, traitOptions) {
      const baseBuilder = traitOptions?.base as any as BaseBuilderInternal

      const implement: ImplementInternal = (domain, implementation) => {
        const baseSelf: any = {}

        if (baseBuilder) {
          // Create lazy base methods that build domain object on first call
          const baseResult = baseBuilder({} as any, baseSelf)

          for (const methodName in baseResult) {
            const baseMethod = baseResult[methodName]
            if (typeof baseMethod === 'function') {
              baseSelf[methodName] = function(...args: any[]) {
                // Build domain object with dependencies on first call
                const domainWithDeps: any = {}

                // Add all trait implementations for this domain as dependencies
                for (const trait in registry.data) {
                  const traitImpl = registry.data[trait]?.[domain.name]
                  if (traitImpl) {
                    domainWithDeps[trait] = traitImpl
                  }
                }

                // Add the current trait implementation (only the domain's implementation, not the merged one)
                domainWithDeps[traitName] = implementation

                // Rebuild the base method with the actual domain
                const actualBase = baseBuilder(domainWithDeps, finalInterface)
                const actualMethod = actualBase[methodName]
                if (typeof actualMethod === 'function') {
                  return actualMethod(...args)
                }
                throw new Error(`Base method ${methodName} not found`)
              }
            }
          }
        }

        const finalInterface = {
          ...implementation,
          ...baseSelf,
        }

        // Register the merged implementation
        registry.data[traitName] ??= {}
        registry.data[traitName][domain.name] = finalInterface

        return finalInterface
      }

      const traitDispatcher = Dispatcher.createTraitProxy(registry.data, traitName)

      // Attach internal utilities under $ property
      const trait = Object.assign(traitDispatcher, {
        $: {
          implement,
        },
      })

      return trait as any
    },
  }
}

interface ImplementInternal {
  (domain: Domain<any>, implementation: Record<string, Fn.AnyAny>): Record<string, Fn.AnyAny>
}

interface BaseBuilderInternal {
  (domain: Record<string, Fn.AnyAny>, self: Record<string, Fn.AnyAny>): Record<string, Fn.AnyAny>
}
