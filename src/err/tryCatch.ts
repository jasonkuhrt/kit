import type { Bool } from '#bool/index.js'
import { Fn } from '#fn/index.js'
import { Prom } from '#prom/index.js'
import type { IsUnknown } from 'type-fest'
import { ensure } from './err.js'
import { is } from './type.js'

export type TryCatchDefaultPredicateTypes = Error

// dprint-ignore
export const tryCatchify = <fn extends Fn.AnyAny, thrown>(
  fn: fn,
  predicates: readonly [Bool.TypePredicate<thrown>, ...readonly Bool.TypePredicate<thrown>[]] = [is as Bool.TypePredicate<thrown>],
): (
  (...args: Parameters<fn>) =>
    ReturnType<fn> extends Promise<any>
      ? Promise<Awaited<ReturnType<fn>> | (IsUnknown<thrown> extends true ? TryCatchDefaultPredicateTypes : thrown)>
      : ReturnType<fn>                  | (IsUnknown<thrown> extends true ? TryCatchDefaultPredicateTypes : thrown)
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
  predicates?: readonly [Bool.TypePredicate<thrown>, ...readonly Bool.TypePredicate<thrown>[]],
):
  returned extends Prom.AnyAny
    ? Promise<Awaited<returned> | (IsUnknown<thrown> extends true ? TryCatchDefaultPredicateTypes : thrown)>
    : returned                  | (IsUnknown<thrown> extends true ? TryCatchDefaultPredicateTypes : thrown)

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
  try {
    const result = fnOrPromise() as any
    if (Prom.isShape(result)) {
      return result.catch((error) => {
        return ensure(error)
      }) as any
    }
    return result
  } catch (error) {
    if (predicates.some((predicate) => predicate(error))) {
      return error as any
    }
    throw error
  }
}

export const tryCatchIgnore = <$Return>(fn: () => $Return): $Return => {
  const result = tryCatch(fn as any)
  if (Prom.isShape(result)) {
    return result.catch(Fn.noop) as any
  }
  return result as any
}
