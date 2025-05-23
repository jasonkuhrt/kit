import { Fn } from '../fn/index.js'
import { Prom } from '../prom/index.js'
import { inspect } from './inspect.js'
import { tryCatch } from './tryCatch.js'

export * from './inspect.js'

export * from './tryCatch.js'

export * from './type.js'

/**
 * Log an error to console with nice formatting.
 */
export const log = (error: Error): void => {
  console.log(inspect(error))
}

/**
 * Ensure that the given value is an error and return it. If it is not an error than
 * wrap it in one, passing the given value as the error message.
 */
export const ensure = (value: unknown): Error => {
  if (value instanceof Error) return value

  return new Error(String(value))
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
