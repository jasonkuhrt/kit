import { Fn } from '../fn/index.js'
import { Prom } from '../prom/index.js'

type AnyPromise = Promise<any>

export const is = (value: unknown): value is Error => {
  // TODO: use upcoming Error.isError() once its widely available.
  // See: https://github.com/tc39/proposal-error-is-error
  return value instanceof Error
}

export const tryCatch = <r, e extends Error = Error>(
  fn: () => r,
): r extends AnyPromise ? Promise<Awaited<r> | e> : r | e => {
  try {
    const result = fn() as any
    if (Prom.isIsh(result)) {
      return result.catch((error) => {
        return ensure(error)
      }) as any
    }
    return result
  } catch (error) {
    return ensure(error) as any
  }
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

export const tryCatchIgnore = <$Return>(fn: () => $Return): $Return => {
  const result = tryCatch(fn)
  if (Prom.isIsh(result)) {
    return result.catch(Fn.noop) as any
  }
  return result as any
}
