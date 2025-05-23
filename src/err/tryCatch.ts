import { Fn } from '../fn/index.js'
import { Prom } from '../prom/index.js'
import { ensure } from './err.js'

// Overload for promise input

export function tryCatch<returns, throws extends Error = Error>(
  promise: Promise<returns>,
): Promise<returns | throws>
// Overload for function input

export function tryCatch<returns, throws extends Error = Error>(
  fn: () => returns,
): returns extends Prom.AnyAny ? Promise<Awaited<returns> | throws> : returns | throws
// Implementation

export function tryCatch<R, E extends Error = Error>(
  input: Promise<any> | (() => R),
): any {
  // Check if input is a promise
  if (Prom.isIsh(input)) {
    return (input as Promise<any>).catch((error) => ensure(error))
  }

  // Otherwise treat as function
  const fn = input as () => R
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

export const tryCatchIgnore = <$Return>(fn: () => $Return): $Return => {
  const result = tryCatch(fn)
  if (Prom.isIsh(result)) {
    return result.catch(Fn.noop) as any
  }
  return result as any
}
