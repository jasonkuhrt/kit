// import { isShape as Obj_isShape } from '#obj/obj' // Temporarily disabled for migration

/**
 * Type representing a Promise of unknown type.
 * Useful for generic promise handling where the resolved type is not important.
 *
 * @category Types
 */
export type Any = Promise<unknown>

/**
 * Type representing a Promise of any type.
 * Less type-safe than {@link Any}, use with caution.
 *
 * @category Types
 */
export type AnyAny = Promise<any>

/**
 * Type representing a value that may or may not be wrapped in a Promise.
 *
 * @example
 * ```ts
 * // function that accepts sync or async values
 * function process<T>(value: Maybe<T>): Promise<T> {
 *   return Promise.resolve(value)
 * }
 *
 * process(42) // accepts number
 * process(Promise.resolve(42)) // accepts Promise<number>
 * ```
 *
 * @category Types
 */
export type Maybe<$Type> = $Type | Promise<$Type>

/**
 * Check if a value has the shape of a Promise.
 * Tests for the presence of then, catch, and finally methods.
 *
 * @param value - The value to test.
 * @returns True if the value has Promise-like shape.
 *
 * @example
 * ```ts
 * // with a promise
 * isShape(Promise.resolve(42)) // true
 *
 * // with a thenable object
 * isShape({ then: () => {}, catch: () => {}, finally: () => {} }) // true
 *
 * // with non-promise values
 * isShape(42) // false
 * isShape({}) // false
 * ```
 *
 * @category Type Guards
 */
export const isShape = (value: unknown): value is AnyAny => {
  return (
    typeof value === 'object'
    && value !== null
    && typeof (value as any).then === 'function'
    && typeof (value as any).catch === 'function'
    && typeof (value as any).finally === 'function'
  )
}

/**
 * Type that adds an additional type to a potentially promised union.
 * If the input is a Promise, the additional type is added to the promised value.
 * If the input is not a Promise, creates a union with the additional type.
 *
 * @example
 * ```ts
 * // with promise input
 * type Result1 = AwaitedUnion<Promise<string>, number> // Promise<string | number>
 *
 * // with non-promise input
 * type Result2 = AwaitedUnion<string, number> // string | number
 * ```
 *
 * @category Types
 */
// dprint-ignore
export type AwaitedUnion<$MaybePromise, $Additional> =
  $MaybePromise extends Promise<infer __promised__>
    ? Promise<Awaited<__promised__ | $Additional>>
    : $MaybePromise | $Additional

/**
 * Options for handling values that might be promises.
 *
 * @category Utilities
 */
export interface MaybeAsyncHandlers<T, R = T, E = unknown> {
  /**
   * Handler for successful values (sync or async).
   */
  then?: (value: T) => R

  /**
   * Handler for errors (sync or async).
   * @param error - The caught error
   * @param isAsync - Whether the error occurred asynchronously
   */
  catch?: (error: unknown, isAsync: boolean) => E
}

/**
 * Handle a function that might return a promise or a regular value,
 * with unified handlers for both sync and async cases.
 *
 * @param fn - Function to execute that might return a promise
 * @param handlers - Object with then/catch handlers
 * @returns The result, potentially wrapped in a Promise
 *
 * @example
 * ```ts
 * // Basic usage
 * const result = maybeAsync(
 *   () => fetchData(),
 *   {
 *     then: (data) => processData(data),
 *     catch: (error) => ({ success: false, error })
 *   }
 * )
 *
 * // Just error handling
 * const safeResult = maybeAsync(
 *   () => riskyOperation(),
 *   {
 *     catch: (error, isAsync) => {
 *       console.error(`Failed ${isAsync ? 'async' : 'sync'}:`, error)
 *       return null
 *     }
 *   }
 * )
 *
 * // Just success handling
 * const transformed = maybeAsync(
 *   () => getValue(),
 *   {
 *     then: (value) => value.toUpperCase()
 *   }
 * )
 * ```
 *
 * @category Utilities
 */
export function maybeAsync<T, R = T, E = unknown>(
  fn: () => T,
  handlers: MaybeAsyncHandlers<T extends Promise<infer U> ? U : T, R, E> = {},
): T extends Promise<infer U> ? Promise<R | U | E> : R | T | E {
  try {
    const result = fn()

    if (isShape(result)) {
      // Handle async result
      let promiseChain = result as any

      if (handlers.then) {
        promiseChain = promiseChain.then(handlers.then)
      }

      if (handlers.catch) {
        promiseChain = promiseChain.catch((error: unknown) => handlers.catch!(error, true))
      }

      return promiseChain as any
    }

    // Handle sync result
    if (handlers.then) {
      return handlers.then(result as any) as any
    }

    return result as any
  } catch (error) {
    // Handle sync error
    if (handlers.catch) {
      return handlers.catch(error, false) as any
    }
    throw error
  }
}
