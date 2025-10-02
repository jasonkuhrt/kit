/**
 * A deferred promise with exposed resolve and reject functions.
 *
 * @example
 * ```ts
 * const deferred = createDeferred<number>()
 *
 * // Later resolve it
 * deferred.resolve(42)
 *
 * // Or reject it
 * deferred.reject(new Error('failed'))
 *
 * // Use the promise
 * await deferred.promise  // 42
 * ```
 */
export interface Deferred<$T> {
  /**
   * The promise that will be resolved or rejected.
   */
  promise: Promise<$T>
  /**
   * Resolve the promise with a value.
   */
  resolve: (value: $T) => void
  /**
   * Reject the promise with an error.
   */
  reject: (error: unknown) => void
}

/**
 * Create a deferred promise with exposed resolve and reject functions.
 *
 * @param options - Configuration options
 * @param options.strict - If true, throws error when resolve/reject called multiple times
 * @returns A deferred promise object
 *
 * @example
 * ```ts
 * const deferred = createDeferred<number>()
 *
 * setTimeout(() => {
 *   deferred.resolve(42)
 * }, 1000)
 *
 * const result = await deferred.promise  // 42
 * ```
 *
 * @example
 * ```ts
 * // Strict mode prevents multiple resolutions
 * const deferred = createDeferred<number>({ strict: true })
 *
 * deferred.resolve(1)
 * deferred.resolve(2)  // Throws error
 * ```
 */
export const createDeferred = <$T>(options?: { strict?: boolean }): Deferred<$T> => {
  let resolve: ((value: $T) => void) | undefined
  let reject: ((error: unknown) => void) | undefined
  let settled = false

  const promise = new Promise<$T>((res, rej) => {
    resolve = res
    reject = rej
  })

  const strictGuard = (fn: () => void) => {
    if (options?.strict && settled) {
      throw new Error('Deferred promise already settled')
    }
    settled = true
    fn()
  }

  return {
    promise,
    resolve: (value: $T) => {
      if (options?.strict) {
        strictGuard(() => resolve!(value))
      } else {
        resolve!(value)
      }
    },
    reject: (error: unknown) => {
      if (options?.strict) {
        strictGuard(() => reject!(error))
      } else {
        reject!(error)
      }
    },
  }
}
