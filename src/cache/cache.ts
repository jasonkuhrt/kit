import { Err } from '#err'
import { Prom } from '#prom'

/**
 * Options for memoization behavior.
 */
export interface MemoizeOptions<fn extends ((...args: any[]) => unknown)> {
  /**
   * Function to create cache keys from arguments.
   * - If `null`, arguments are used by reference as the cache key
   * - If provided, this function should return a unique key for the arguments
   * - Defaults to `JSON.stringify` which converts arguments to a JSON string
   */
  createKey?: null | ((parameters: Parameters<fn>) => unknown)

  /**
   * Whether to cache returned Error instances.
   * This only affects functions that return Error objects as values (not thrown errors).
   * Thrown errors are never cached regardless of this setting.
   * When false, returned errors will not be cached and the function will be re-executed on subsequent calls.
   * @default false
   */
  cacheErrors?: boolean

  /**
   * Optional cache Map to use for storage.
   * If provided, the memoized function will use this cache instead of creating its own.
   * This allows sharing cache between multiple memoized functions.
   */
  cache?: Map<unknown, unknown>
}

/**
 * Creates a memoized version of a function that caches its results.
 *
 * Memoization is an optimization technique that stores the results of expensive function calls
 * and returns the cached result when the same inputs occur again.
 *
 * @template fn - The function type to memoize
 * @param func - The function to memoize
 * @param options - Memoization options or createKey function for backward compatibility
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
 *
 * @example
 * ```ts
 * // Skip caching errors
 * const fetchData = async (id: string) => {
 *   const response = await fetch(`/api/data/${id}`)
 *   if (!response.ok) throw new Error('Failed to fetch')
 *   return response.json()
 * }
 *
 * const memoizedFetch = memoize(fetchData, {
 *   cacheErrors: false // Errors won't be cached, will retry on next call
 * })
 * ```
 *
 * @example
 * ```ts
 * // Sharing cache between multiple memoized functions
 * const sharedCache = new Map<unknown, unknown>()
 *
 * const getUserById = memoize(fetchUserById, { cache: sharedCache })
 * const getUserByEmail = memoize(fetchUserByEmail, { cache: sharedCache })
 *
 * // Both functions share the same cache storage
 * await getUserById(123) // Fetches and caches with key 123
 * await getUserByEmail('user@example.com') // Fetches and caches with key 'user@example.com'
 * // Later calls to either function will use the shared cache
 * ```
 *
 * @example
 * ```ts
 * // Clear cache across multiple functions
 * const cache = new Map<unknown, unknown>()
 * const readFile = memoize(fs.readFile, { cache })
 * const parseFile = memoize(parseConfig, { cache })
 *
 * // Clear all cached data at once
 * cache.clear()
 * ```
 */
/**
 * A memoized function with cache management methods.
 */
export type MemoizedFunction<fn extends ((...args: any[]) => unknown)> = fn & {
  /**
   * Clear the entire cache.
   */
  clear: () => void

  /**
   * Clear a specific cache entry.
   */
  clearKey: (key: unknown) => void
}

// Internal envelope to distinguish between "not cached" and "cached undefined"
interface CacheEnvelope<T> {
  value: T
}

export const memoize = <fn extends ((...args: any[]) => unknown)>(
  func: fn,
  optionsOrCreateKey?: MemoizeOptions<fn> | null | ((parameters: Parameters<fn>) => unknown),
): MemoizedFunction<fn> => {
  // Handle backward compatibility
  const options: MemoizeOptions<fn> = optionsOrCreateKey === null || typeof optionsOrCreateKey === 'function'
    ? { createKey: optionsOrCreateKey }
    : optionsOrCreateKey ?? {}

  const { createKey, cacheErrors = false, cache = new Map<unknown, unknown>() } = options
  const createKey_ = createKey === null ? null : createKey ? createKey : JSON.stringify

  const memoizedFn = ((...args: Parameters<fn>) => {
    const cacheKey = createKey_?.(args) ?? args

    if (cache.has(cacheKey)) {
      const envelope = cache.get(cacheKey) as CacheEnvelope<unknown>
      return envelope.value
    }

    const result = func(...args)

    // Handle successful results (both sync and async)
    return Prom.maybeAsync(
      () => result,
      {
        then: (resultResolved) => {
          // Cache the result if:
          // 1. It's not an Error instance, OR
          // 2. It IS an Error instance AND cacheErrors is true
          if (!Err.is(resultResolved) || cacheErrors) {
            cache.set(cacheKey, { value: resultResolved })
          }
          return resultResolved
        },
      },
    )
  }) as MemoizedFunction<fn>

  // Add cache management methods
  memoizedFn.clear = () => cache.clear()
  memoizedFn.clearKey = (key: unknown) => cache.delete(key)

  return memoizedFn
}
