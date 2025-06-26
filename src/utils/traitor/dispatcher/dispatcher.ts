import type { Fn } from '#fn'
import { nativeToDomainOrThrow } from '../domain.ts'
import type { Registry } from '../registry/$.ts'
import type { MethodName, TraitName } from '../types.ts'

export interface Dispatcher {
  [methodName: string]: Fn.AnyAny
}

/**
 * Creates a generic trait proxy that dispatches all method calls to the registry.
 *
 * This creates a proxy object where any method access returns a function that
 * dispatches to the appropriate domain implementation based on the first argument.
 * Methods are cached after first access for performance.
 *
 * @param registry - The trait registry to dispatch against
 * @param traitName - The name of the trait (e.g., 'Eq')
 * @returns A proxy object implementing the trait interface
 *
 * @example
 * ```ts
 * const Eq = createTraitProxy(REGISTRY, 'Eq')
 * Eq.is('hello', 'hello') // Dispatches to Str.Eq.is
 * Eq.isOn([1,2,3]) // Dispatches to Arr.Eq.isOn
 * ```
 */
export const createTraitProxy = (
  registry: Registry.Data,
  traitName: TraitName,
): Dispatcher => {
  return createCachedGetProxy<Dispatcher, {}>(createTraitDispatcher(registry, traitName))
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
  registry: Registry.Data,
  traitName: TraitName,
  thisArg?: any,
) =>
(methodName: MethodName) =>
(...args: any[]): $Return => {
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

interface GetProxyOptions {
  symbols?: boolean
}

const createCachedGetProxy = <type, options extends GetProxyOptions>(
  createValue: (propertyName: options['symbols'] extends true ? symbol | string : string) => Function,
  options?: options,
): type => {
  const cache = new Map<symbol | string, any>()
  const config = {
    symbols: options?.symbols ?? false,
  }

  return new Proxy({} as any, {
    get(target, propertyName) {
      if (!config.symbols && typeof propertyName !== 'string') {
        return undefined
      }

      // Check if property exists on the target (e.g., $ property)
      if (propertyName in target) {
        return target[propertyName]
      }

      let cachedMethod = cache.get(propertyName)
      if (cachedMethod) return cachedMethod

      const value = createValue(propertyName as any)
      cache.set(propertyName, value)

      return value
    },
  })
}
