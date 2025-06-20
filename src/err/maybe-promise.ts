import { Prom } from '#prom'

/**
 * Handle a function that might return a promise or a regular value,
 * executing error handling in both sync and async cases.
 *
 * @param fn - Function to execute that might return a promise
 * @param onError - Error handler that receives the caught error and can either throw or return a value
 * @returns The result of fn if successful, or the result of onError if it fails
 *
 * @example
 * ```ts
 * // Throwing case:
 * return catchMaybePromise(fn, error => {
 *   throw new Error('Failed', { cause: error })
 * })
 *
 * // Returning case:
 * const result = await catchMaybePromise(
 *   () => fetchData(),
 *   (error) => ({ success: false, error })
 * )
 * ```
 */
export function catchMaybePromise<T, E>(
  fn: () => T,
  onError: (error: unknown) => E,
): T extends Promise<infer U> ? Promise<U | E> : T | E {
  try {
    const result = fn()

    if (Prom.isShape(result)) {
      return (result as any).catch(onError) as any
    }

    return result as any
  } catch (error) {
    return onError(error) as any
  }
}
