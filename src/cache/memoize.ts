/**
 * Creates a memoized version of a function that caches its results.
 *
 * Memoization is an optimization technique that stores the results of expensive function calls
 * and returns the cached result when the same inputs occur again.
 *
 * @template fn - The function type to memoize
 * @param func - The function to memoize
 * @param createKey - Optional function to create cache keys from arguments.
 *                    - If `null`, arguments are used by reference as the cache key
 *                    - If provided, this function should return a unique key for the arguments
 *                    - Defaults to `JSON.stringify` which converts arguments to a JSON string
 * @returns A memoized version of the input function with the same signature
 *
 * @example
 * ```ts
 * // Simple memoization with default JSON.stringify key
 * const expensiveAdd = (a: number, b: number) => {
 *   console.log('Computing...')
 *   return a + b
 * }
 *
 * const memoizedAdd = memoize(expensiveAdd)
 *
 * memoizedAdd(1, 2) // logs: "Computing...", returns: 3
 * memoizedAdd(1, 2) // returns: 3 (from cache, no log)
 * ```
 *
 * @example
 * ```ts
 * // Custom key function for object arguments
 * const getUserData = async (user: { id: string; name: string }) => {
 *   return await fetchUserData(user.id)
 * }
 *
 * const memoizedGetUser = memoize(
 *   getUserData,
 *   ([user]) => user.id // Only cache by user ID
 * )
 * ```
 *
 * @example
 * ```ts
 * // Reference-based caching (using null)
 * // When key is null, the entire arguments array is used as the cache key by reference
 * const processObject = (obj: any) => ({ ...obj, processed: true })
 *
 * const memoizedProcess = memoize(processObject, null)
 *
 * const obj = { a: 1 }
 * memoizedProcess(obj) // Computes result
 * memoizedProcess(obj) // Returns cached (same object reference)
 * memoizedProcess({ a: 1 }) // Computes again (different object reference, even though content is identical)
 * ```
 */
export const memoize = <fn extends ((...args: any[]) => unknown)>(
  func: fn,
  /**
   * If `null` then key is by value reference.

   * @default JSON.stringify.
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
