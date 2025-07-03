export interface GetProxyOptions {
  symbols?: boolean
}

export const createCachedGetProxy = <type, options extends GetProxyOptions>(
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
