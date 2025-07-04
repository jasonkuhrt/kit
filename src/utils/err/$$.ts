import { Fn } from '#fn'
import { inspect, type InspectOptions } from './inspect.ts'

export * from './inspect.ts'

export * from './stack.ts'

export * from './try.ts'

export * from './type.ts'

export * from './types.ts'

export * from './wrap.ts'

/**
 * Log an error to console with nice formatting.
 */
export const log = (error: Error, options?: InspectOptions): void => {
  console.log(inspect(error, options))
}

/**
 * Throw an error if the value is null, otherwise return the non-null value.
 * @param value - The value to check
 * @param message - Optional custom error message
 * @returns The value if not null
 * @throws Error if the value is null
 * @example
 * ```ts
 * const result = throwNull(maybeNull) // throws if null
 * const safe = throwNull(maybeNull, 'Custom error message')
 * ```
 */
export const throwNull = <V>(value: V, message?: string): Exclude<V, null> => {
  if (value === null) throw new Error(message ?? defaultThrowNullMessage)

  return value as any
}

/**
 * Default error message used by {@link throwNull} when no custom message is provided.
 */
export const defaultThrowNullMessage = 'Unexpected null value.'

/**
 * Wrap a function to throw an error if it returns null.
 * @param fn - The function to wrap
 * @param message - Optional custom error message when null is returned
 * @returns A wrapped function that throws on null return values
 * @example
 * ```ts
 * const find = (id: string) => items.find(item => item.id === id) ?? null
 * const findOrThrow = guardNull(find, 'Item not found')
 *
 * const item = findOrThrow('123') // throws if not found
 * ```
 */
export const guardNull = <fn extends Fn.AnyAny>(
  fn: fn,
  /**
   * The message to use when a null value is encountered.
   */
  message?: string,
): Fn.ReturnExcludeNull<fn> => {
  // @ts-expect-error
  return (...args) => {
    const result = fn(...args)
    return throwNull(result, message)
  }
}
