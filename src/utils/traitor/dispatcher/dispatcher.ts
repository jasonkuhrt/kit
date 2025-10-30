import type { Fn } from '#fn'
import { Prox } from '#prox'
import type { MethodConfig } from '../definition.js'
import { defaultDomainCheck, traitMethodConfigs } from '../definition.js'
import { detectDomain } from '../domain.js'
import type { Registry } from '../registry/_.js'
import type { MethodName, TraitName } from '../types.js'

export const createTraitProxy = <$Interface>(
  registry: Registry.Registry,
  traitName: TraitName,
): $Interface => {
  return Prox.createCachedGetProxy<$Interface, {}>(
    (propertyName: string) => createTraitDispatcher(registry, traitName)(propertyName as MethodName),
  )
}

export interface Dispatcher {
  [methodName: string]: Fn.AnyAny
}

/**
 * Pure dispatch function for trait method calls.
 *
 * @param registry - The trait registry to dispatch against
 * @param traitName - The trait to dispatch (e.g., 'Eq')
 * @param methodName - The method to call (e.g., 'is')
 * @param args - Arguments to pass to the method
 * @param thisArg - Optional `this` context for the method call
 * @returns The result of calling the domain's implementation
 * @throws If trait, domain, or method is not found
 *
 * @example
 * dispatchOrThrow(registry, 'Eq', 'is', [[1, 2], [1, 2]]) // calls Arr.Eq.is
 */
export const createTraitDispatcher = <$Return>(
  registry: Registry.Registry,
  traitName: TraitName,
) =>
(methodName: MethodName) =>
(...args: any[]): $Return => {
  const traitRegistry = registry[traitName]
  if (!traitRegistry) {
    throw new Error(`Trait "${traitName}" not found in registry`)
  }

  return dispatchMethodCall(traitRegistry, traitName, methodName, args)
}

const resolveDomainInfer = (args: any[], strategy: number[]): string | null => {
  const doamins = detectDomains(args, strategy)
  const domain = allDomainsMatch(doamins)
  return domain
}

/**
 * Detect domains from arguments based on detection strategy.
 */
const detectDomains = (args: any[], strategy: number[]): (string | null)[] => {
  if (strategy.length === 0) {
    // Empty array means all arguments
    return args.map(arg => detectDomain(arg))
  }

  // Specific indices
  return strategy.map(index => {
    if (index >= args.length) return null
    return detectDomain(args[index])
  })
}

/**
 * Check if all detected domains are the same (and not null).
 */
const allDomainsMatch = (domains: (string | null)[]): string | null => {
  const firstDomain = domains[0]
  if (!firstDomain) return null

  for (const domain of domains) {
    if (domain !== firstDomain) return null
  }

  return firstDomain
}

/**
 * Dispatch a method call directly without creating a dispatcher function.
 * Lower-level building block for compiled output.
 */
export const dispatchMethodCall = <T>(
  registry: Registry.TraitRegistry<T>,
  traitName: string,
  methodName: string,
  args: any[],
): any => {
  // If initialize is provided and hasn't been called yet, call it now
  if (registry.initialize && !registry.isInitialized) {
    registry.initialize()
    registry.isInitialized = true
  }

  // Get method configuration from global store
  const traitConfigs = traitMethodConfigs.get(traitName)
  const methodConfig = traitConfigs?.[methodName] as MethodConfig<any> | undefined
  const domainCheckStrategy = methodConfig?.domainCheck ?? defaultDomainCheck

  let domainName: string | null = null

  // Always use infer strategy (brand types handled elsewhere)
  domainName = resolveDomainInfer(args, domainCheckStrategy)

  if (!domainName && methodConfig?.domainMissing) {
    // Call domainMissing hook if domain detection failed
    return methodConfig.domainMissing(...args)
  }

  if (!domainName) {
    throw new Error(`No valid domain detected for ${traitName}.${methodName}`)
  }

  const domain = registry.implementations[domainName] as Record<string, Fn.AnyAny>
  if (!domain) {
    throw new Error(`No ${traitName} implementation for domain: ${domainName}`)
  }

  const method = domain[methodName]
  if (typeof method !== 'function') {
    throw new Error(`Method ${methodName} not found on ${traitName} for domain ${domainName}`)
  }

  return method(...args)
}
