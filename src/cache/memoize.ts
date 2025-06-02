export const memoize = <fn extends ((...args: any[]) => unknown)>(
  func: fn,
  /**
   * If `null` then key is by value reference.

   * @default JSON.stringify
   */
  createKey?: null | ((parameters: Parameters<fn>) => unknown),
): fn => {
  const cache = new Map<unknown, unknown>()
  const createKey_ = createKey === null ? null : createKey ? createKey : JSON.stringify

  return ((...args: Parameters<fn>) => {
    const cacheKey = createKey_?.(args) ?? args
    const cachedValue = cache.get(cacheKey)

    if (cachedValue !== undefined) {
      return cachedValue
    }

    const result = func(...args)

    if (result instanceof Promise) {
      return result.then(resultResolved => {
        cache.set(cacheKey, resultResolved)
        return resultResolved
      })
    }

    cache.set(cacheKey, result)
    return result
  }) as fn
}
