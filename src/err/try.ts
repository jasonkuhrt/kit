import type { Arr } from '#arr/index.js'
import type { Bool } from '#bool/index.js'
import { Fn } from '#fn/index.js'
import { Prom } from '#prom/index.js'
import type { AwaitedUnion } from '#prom/prom.js'
import { Value } from '#value/index.js'
import type { IsUnknown } from 'type-fest'
import { ensure, is } from './type.js'

export type TryCatchDefaultPredicateTypes = Error

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

// tryOr

// todo all fn being a promise directly
// todo: allow fallback returning a promise and it being awaited
export const tryOr = <success, fallback>(
  fn: () => success,
  fallback: Value.LazyMaybe<fallback>,
): AwaitedUnion<success, fallback> => {
  try {
    const result = fn()
    if (Prom.isShape(result)) {
      return result.catch(Fn.bind(Value.resolveLazy, fallback)) as any
    }
    return result as any
  } catch {
    return Value.resolveLazy(fallback) as any
  }
}

// dprint-ignore
export const tryOrOn =
  <success>(fn: () => success) =>
    <fallback>(fallback: Value.LazyMaybe<fallback>): AwaitedUnion<success, fallback> =>
      tryOr(fn, fallback)

// dprint-ignore
export const tryOrWith =
  <fallback>(fallback: Value.LazyMaybe<fallback>) =>
    <success>(fn: () => success): AwaitedUnion<success, fallback> =>
      tryOr(fn, fallback)

export const tryOrUndefined = tryOrWith(undefined)
export const tryOrNull = tryOrWith(null)
