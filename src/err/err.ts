import { Fn } from '#fn/index.js'
import { inspect, type InspectOptions } from './inspect.js'

export * from './inspect.js'

export * from './tryCatch.js'

export * from './type.js'

/**
 * Log an error to console with nice formatting.
 */
export const log = (error: Error, options?: InspectOptions): void => {
  console.log(inspect(error, options))
}

export const throwNull = <V>(value: V, message?: string): Exclude<V, null> => {
  if (value === null) throw new Error(message ?? defaultThrowNullMessage)

  return value as any
}

export const defaultThrowNullMessage = 'Unexpected null value.'

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
