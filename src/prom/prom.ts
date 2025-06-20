// import { isShape as Obj_isShape } from '#obj/obj' // Temporarily disabled for migration

/**
 * Type representing a Promise of unknown type.
 * Useful for generic promise handling where the resolved type is not important.
 */
export type Any = Promise<unknown>

/**
 * Type representing a Promise of any type.
 * Less type-safe than {@link Any}, use with caution.
 */
export type AnyAny = Promise<any>

/**
 * Type representing a value that may or may not be wrapped in a Promise.
 *
 * @typeParam $Type - The type that may be wrapped in a Promise.
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
 * @typeParam $MaybePromise - A value that may or may not be a Promise.
 * @typeParam $Additional - The type to add to the union.
 *
 * @example
 * ```ts
 * // with promise input
 * type Result1 = AwaitedUnion<Promise<string>, number> // Promise<string | number>
 *
 * // with non-promise input
 * type Result2 = AwaitedUnion<string, number> // string | number
 * ```
 */
// dprint-ignore
export type AwaitedUnion<$MaybePromise, $Additional> =
  $MaybePromise extends Promise<infer __promised__>
    ? Promise<Awaited<__promised__ | $Additional>>
    : $MaybePromise | $Additional

/**
 * Handle a function that might return a promise or a regular value,
 * executing error handling in both sync and async cases.
 *
 * @param fn - Function to execute that might return a promise
 * @param onError - Error handler that receives the caught error and isAsync flag
 * @returns The result of fn if successful, or the result of onError if it fails
 *
 * @example
 * ```ts
 * // Throwing case:
 * return maybeAsyncCatch(fn, (error, isAsync) => {
 *   throw new Error(`Failed ${isAsync ? 'async' : 'sync'}`, { cause: error })
 * })
 *
 * // Returning case:
 * const result = await maybeAsyncCatch(
 *   () => fetchData(),
 *   (error, isAsync) => ({ success: false, error, isAsync })
 * )
 * ```
 */
export function maybeAsyncCatch<T, E>(
  fn: () => T,
  onError: (error: unknown, isAsync: boolean) => E,
): T extends Promise<infer U> ? Promise<U | E> : T | E {
  try {
    const result = fn()

    if (isShape(result)) {
      return (result as any).catch((error: unknown) => onError(error, true)) as any
    }

    return result as any
  } catch (error) {
    return onError(error, false) as any
  }
}

/**
 * Handle a value that might be a promise or a regular value,
 * executing success handling in both sync and async cases.
 *
 * @param value - Value that might be a promise
 * @param onSuccess - Success handler that receives the resolved value
 * @returns The result of onSuccess
 *
 * @example
 * ```ts
 * const result = thenMaybePromise(
 *   fetchData(),
 *   (data) => processData(data)
 * )
 * ```
 */
export function maybeAsyncThen<T, R>(
  value: T,
  onSuccess: (value: T extends Promise<infer U> ? U : T) => R,
): T extends Promise<any> ? Promise<R> : R {
  if (isShape(value)) {
    return (value as any).then(onSuccess) as any
  }

  return onSuccess(value as any) as any
}
