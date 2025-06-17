import type { Arr } from '#arr/index.js'
import type { Bool } from '#bool/index.js'
import { Fn } from '#fn/index.js'
import { Prom } from '#prom/index.js'
import type { AwaitedUnion } from '#prom/prom.js'
import { Value } from '#value/index.js'
import type { IsUnknown } from 'type-fest'
import { catchMaybePromise } from './maybe-promise.js'
import { ensure, is } from './type.js'
import { wrap, type WrapOptions } from './wrap.js'

export type TryCatchDefaultPredicateTypes = Error

/**
 * Transform a function to return caught errors instead of throwing them.
 * The transformed function will return either the result or the caught error.
 *
 * @param fn - The function to transform
 * @param predicates - Type predicates to filter which errors to catch (defaults to all Error instances)
 * @returns A new function that returns results or errors instead of throwing
 *
 * @example
 * ```ts
 * // Transform a throwing function
 * const parseJsonSafe = tryCatchify(JSON.parse)
 * const result = parseJsonSafe('{"valid": true}') // { valid: true }
 * const error = parseJsonSafe('invalid') // SyntaxError
 *
 * // With custom error predicates
 * const isNetworkError = (e: unknown): e is NetworkError =>
 *   e instanceof Error && e.name === 'NetworkError'
 *
 * const fetchSafe = tryCatchify(fetch, [isNetworkError])
 * const response = await fetchSafe(url) // Response | NetworkError
 * ```
 */
// dprint-ignore
export const tryCatchify = <fn extends Fn.AnyAny, thrown>(
  fn: fn,
  predicates: readonly [Bool.TypePredicate<thrown>, ...readonly Bool.TypePredicate<thrown>[]] = [is as Bool.TypePredicate<thrown>],
): (
  (...args: Parameters<fn>) =>
    AwaitedUnion<
      ReturnType<fn>,
      IsUnknown<thrown> extends true ? TryCatchDefaultPredicateTypes : thrown
    >
) => {
  const tryCatchifiedFn: Fn.AnyAny = (...args) => {
    return tryCatch(() => fn(...args), predicates)
  }
  return tryCatchifiedFn
}

// Overload for promise input

// dprint-ignore
export function tryCatch<returned, thrown>(
  promise: Promise<returned>,
  predicates?: readonly [Bool.TypePredicate<thrown>, ...readonly Bool.TypePredicate<thrown>[]],
): Promise<returned | (IsUnknown<thrown> extends true ? TryCatchDefaultPredicateTypes : thrown)>

// Overload for function input

// dprint-ignore
export function tryCatch<returned, thrown>(
  fn: () => returned,
  predicates?: Arr.NonEmptyRO<Bool.TypePredicate<thrown>>,
):
  AwaitedUnion<
    returned,
    IsUnknown<thrown> extends true ? TryCatchDefaultPredicateTypes : thrown
  >

// Implementation

export function tryCatch<returned, thrown>(
  fnOrPromise: Promise<any> | (() => returned),
  predicates: readonly [Bool.TypePredicate<thrown>, ...readonly Bool.TypePredicate<thrown>[]] = [
    is as Bool.TypePredicate<thrown>,
  ],
): any {
  // Check if input is a promise
  if (Prom.isShape(fnOrPromise)) {
    return fnOrPromise.catch((error) => ensure(error))
  }

  // Otherwise treat as function
  return catchMaybePromise(
    fnOrPromise,
    (error) => {
      if (predicates.some((predicate) => predicate(error))) {
        return error
      }
      throw error
    },
  )
}

/**
 * Try to execute a function and silently ignore any errors.
 * Returns the result if successful, or undefined if it throws.
 * For async functions, errors are silently caught without rejection.
 *
 * @param fn - The function to execute
 * @returns The result of the function if successful, undefined otherwise
 *
 * @example
 * ```ts
 * // Sync function
 * tryCatchIgnore(() => JSON.parse(invalidJson)) // returns undefined
 *
 * // Async function
 * await tryCatchIgnore(async () => {
 *   throw new Error('Network error')
 * }) // returns undefined, no rejection
 * ```
 */
export const tryCatchIgnore = <$Return>(fn: () => $Return): $Return => {
  const result = tryCatch(fn as any)
  if (Prom.isShape(result)) {
    return result.catch(Fn.noop) as any
  }
  return result as any
}

/**
 * Try to execute a function and return a fallback value if it throws.
 * Handles both synchronous and asynchronous functions automatically.
 *
 * @param fn - The function to execute
 * @param fallback - The fallback value or a function that returns the fallback value
 * @returns The result of the function if successful, or the fallback value if it throws
 *
 * @example
 * ```ts
 * // With static fallback
 * const data = tryOr(
 *   () => JSON.parse(input),
 *   { error: 'Invalid JSON' }
 * )
 *
 * // With lazy fallback
 * const config = await tryOr(
 *   async () => loadConfig(),
 *   () => getDefaultConfig()
 * )
 * ```
 */
// todo all fn being a promise directly
// todo: allow fallback returning a promise and it being awaited
export const tryOr = <success, fallback>(
  fn: () => success,
  fallback: Value.LazyMaybe<fallback>,
): AwaitedUnion<success, fallback> => {
  return catchMaybePromise(
    fn,
    () => Value.resolveLazy(fallback),
  ) as any
}

/**
 * Curried version of {@link tryOr} that takes the function first.
 * Useful for creating reusable error handlers.
 *
 * @example
 * ```ts
 * const parseJsonOr = tryOrOn(() => JSON.parse(input))
 * const data = parseJsonOr({ error: 'Invalid JSON' })
 * ```
 */
// dprint-ignore
export const tryOrOn =
  <success>(fn: () => success) =>
    <fallback>(fallback: Value.LazyMaybe<fallback>): AwaitedUnion<success, fallback> =>
      tryOr(fn, fallback)

/**
 * Curried version of {@link tryOr} that takes the fallback first.
 * Useful for creating reusable fallback patterns.
 *
 * @example
 * ```ts
 * const orDefault = tryOrWith({ status: 'unknown', data: null })
 *
 * const result1 = orDefault(() => fetchStatus())
 * const result2 = orDefault(() => getLatestData())
 * ```
 */
// dprint-ignore
export const tryOrWith =
  <fallback>(fallback: Value.LazyMaybe<fallback>) =>
    <success>(fn: () => success): AwaitedUnion<success, fallback> =>
      tryOr(fn, fallback)

/**
 * Try to execute a function and return undefined if it throws.
 * Shorthand for `tryOrWith(undefined)`.
 *
 * @example
 * ```ts
 * const data = tryOrUndefined(() => localStorage.getItem('key'))
 * // data is string | undefined
 * ```
 */
export const tryOrUndefined = tryOrWith(undefined)

/**
 * Try to execute a function and return null if it throws.
 * Shorthand for `tryOrWith(null)`.
 *
 * @example
 * ```ts
 * const user = await tryOrNull(async () => fetchUser(id))
 * // user is User | null
 * ```
 */
export const tryOrNull = tryOrWith(null)

/**
 * Try to execute a function and wrap any thrown errors with a higher-level message.
 * Handles both synchronous and asynchronous functions automatically.
 *
 * @param fn - The function to execute
 * @param wrapper - Either a string message, options object, or a function that wraps the error
 * @returns The result of the function if successful
 * @throws The wrapped error if the function throws
 *
 * @example
 * ```ts
 * // Simple string message
 * const data = await tryOrRethrow(
 *   fetchData,
 *   'Failed to fetch data'
 * )
 *
 * // With options
 * const user = await tryOrRethrow(
 *   () => fetchUser(userId),
 *   { message: 'Failed to fetch user', context: { userId } }
 * )
 *
 * // With wrapper function
 * const result = await tryOrRethrow(
 *   riskyOperation,
 *   wrapWith('Operation failed')
 * )
 *
 * // Custom error wrapper
 * const config = await tryOrRethrow(
 *   loadConfig,
 *   (cause) => new ConfigError('Failed to load config', { cause })
 * )
 * ```
 */
// dprint-ignore
export function tryOrRethrow<$Return>(
  fn: () => $Return,
  wrapper: string | WrapOptions | ((cause: Error) => Error)
): $Return extends Promise<any> ? $Return : ReturnType<typeof fn> {
  return catchMaybePromise(fn, (thrown) => {
    const cause = ensure(thrown)
    if (typeof wrapper === 'function') throw wrapper(cause)
    throw wrap(cause, wrapper)
  }) as any
}

/**
 * Try multiple functions and wrap any errors with a higher-level message.
 * If any function throws, all errors are collected into an AggregateError.
 *
 * @param fns - Array of functions to execute
 * @param wrapper - Either a string message, options object, or a function that wraps the error
 * @returns Array of results if all succeed
 * @throws AggregateError with wrapped individual errors if any fail
 *
 * @example
 * ```ts
 * const [users, posts] = await tryAllOrRethrow(
 *   [fetchUsers, fetchPosts],
 *   'Failed to load data'
 * )
 *
 * // With context
 * const [config, schema, data] = await tryAllOrRethrow(
 *   [loadConfig, loadSchema, loadData],
 *   { message: 'Failed to initialize', context: { env: 'production' } }
 * )
 * ```
 */
export async function tryAllOrRethrow<
  $Fns extends readonly [() => any, ...Array<() => any>],
>(
  fns: $Fns,
  wrapper: string | WrapOptions | ((cause: Error) => Error),
): Promise<
  {
    [K in keyof $Fns]: Awaited<ReturnType<$Fns[K]>>
  }
> {
  const results = await Promise.allSettled(
    fns.map(fn => {
      try {
        return Promise.resolve(fn())
      } catch (error) {
        return Promise.reject(error)
      }
    }),
  )

  const errors: Error[] = []
  const values: any[] = []

  results.forEach((result) => {
    if (result.status === 'rejected') {
      const cause = ensure(result.reason)
      const wrapFn = typeof wrapper === 'function'
        ? wrapper
        : (error: Error) => wrap(error, wrapper)
      errors.push(wrapFn(cause))
    } else {
      values.push(result.value)
    }
  })

  if (errors.length > 0) {
    throw new AggregateError(
      errors,
      typeof wrapper === 'string'
        ? wrapper
        : typeof wrapper === 'object'
        ? wrapper.message
        : 'Multiple operations failed',
    )
  }

  return values as any
}
