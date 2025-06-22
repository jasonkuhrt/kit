import { nativeToDomainOrThrow } from './domain.ts'
import type { Registry } from './registry/$.ts'
import type { MethodName, TraitName } from './types.ts'

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
export const dispatchOrThrow = <$Return>(
  registry: Registry.Data,
  traitName: TraitName,
  methodName: MethodName,
  args: any[],
  thisArg?: any,
): $Return => {
  const [firstArg] = args

  // Determine domain from first argument
  const domainName = nativeToDomainOrThrow(firstArg)

  const trait = registry[traitName]
  if (!trait) {
    throw new Error(`Trait "${traitName}" not found in registry`)
  }

  const domain = trait[domainName]
  if (!domain) {
    throw new Error(`Domain "${domainName}" not registered for trait "${traitName}"`)
  }

  const method = domain[methodName]
  if (!method) {
    throw new Error(`Method "${methodName}" not found for domain "${domainName}" in trait "${traitName}"`)
  }

  return thisArg ? method.call(thisArg, ...args) : method(...args)
}
