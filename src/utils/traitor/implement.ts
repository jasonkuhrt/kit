import {
  applyTraitMethods,
  type Definition,
  domainParam,
  type GetAppliedInterface,
  type GetAppliedInternalInterface,
  type Internal,
  type ParamContextGeneric,
} from './definition.js'
import { getInternal } from './definition.js'
import type { Domain } from './domain.js'
import { Registry } from './registry/$.js'

// Internal default registry for when none is provided
const defaultRegistry = Registry.create()

/**
 * A domain's implementation of a trait.
 *
 * Intentionally loose type as implementations may include:
 * - Methods (the primary use case)
 * - Properties for trait-specific metadata
 * - Nested namespaces for complex traits
 *
 * The trait system itself will provide stricter typing.
 */
export type Implementation = Record<string, any>

/**
 * Implement a trait for a specific domain.
 *
 * This function registers a domain's implementation of a trait and applies
 * any hooks defined by the trait. The process works as follows:
 *
 * 1. **Base Implementation**: The domain provides its core implementation
 *    of the trait methods (e.g., how strings implement equality).
 *
 * 2. **Hooks Processing**: If the trait defines hooks, they are applied to
 *    enhance or modify the base implementation. Hooks can:
 *    - Add pre-processing logic (e.g., type checking)
 *    - Completely override methods (e.g., for curried variants)
 *    - Access other trait implementations via the domain parameter
 *
 * 3. **Registration**: The final enhanced implementation is registered in
 *    the global registry, making it available for polymorphic dispatch.
 *
 * The hooks receive two key parameters:
 * - `domain`: All trait implementations for this domain (for cross-trait dependencies)
 * - `trait`: A proxy to the final trait interface (for method delegation)
 *
 * @template $Definition - The trait interface definition
 * @template $Domain - The domain type
 * @param trait - The trait to implement (created with Traitor.define)
 * @param domain - The domain to implement for
 * @param implementation - The implementation conforming to the trait's internal interface
 * @returns The enhanced implementation with hooks applied
 *
 * @example
 * ```ts
 * import { Traitor } from '#traitor'
 * import { Eq } from '#eq'
 *
 * // Simple implementation without hooks
 * export const StrEq = Traitor.implement(Eq, Traitor.domain('Str', ''), {
 *   is(a, b) {
 *     return a === b
 *   }
 * })
 *
 * // The Eq trait might have hooks that:
 * // 1. Add type checking via domain.Type.is(b)
 * // 2. Create isOn method using trait.is(a, b)
 * // So the final implementation includes both enhancements
 * ```
 */
export const implement = <
  $Definition extends Definition,
  $Domain extends Domain,
  implementation extends GetAppliedInternalInterface<$Definition, $Domain>,
>(
  trait: $Definition,
  domain: $Domain,
  implementation: implementation,
  registry = defaultRegistry,
): GetAppliedInterface<$Definition, $Domain> => {
  const trait$ = getInternal(trait)

  // Apply methods configuration if defined, otherwise use implementation as-is
  const finalImplementation = finalizeDomainImplementation(
    registry,
    trait$,
    domain,
    implementation,
  )

  // Register the final implementation
  Registry.register(
    registry,
    trait$.name,
    domain.name,
    finalImplementation,
  )

  return finalImplementation as any
}

/**
 * Apply trait methods configuration to a domain implementation.
 *
 * If the trait has methods defined, this will:
 * 1. Create a domain parameter object with all trait implementations
 * 2. Call the methods function to get method configurations
 * 3. Apply method enhancements (pre/post hooks, defaults)
 * 4. Return the enhanced implementation
 *
 * If no methods are defined, returns the implementation as-is.
 *
 * @param trait$ - The trait's internal metadata
 * @param domain - The domain being implemented
 * @param implementation - The base domain implementation
 * @returns The implementation with methods applied (or unchanged if no methods)
 */
const finalizeDomainImplementation = <$Interface extends object>(
  registry: Registry.Registry,
  trait$: Internal,
  domain: Domain,
  implementation: $Interface,
): $Interface => {
  if (!trait$.methods) {
    // No methods defined, return implementation as-is
    return implementation
  }

  // Build context for defaultWith/preWith/postWith
  const context = {
    domain: domainParam(registry, domain.name, trait$.name, implementation),
    trait: {}, // Will be populated with final implementation
  } as ParamContextGeneric

  // Process methods to create enhanced implementation
  const finalImplementation = applyTraitMethods(trait$.methods, implementation, context)

  // Update trait reference in context to point to final implementation
  Object.assign(context.trait, finalImplementation)

  return finalImplementation as any
}
