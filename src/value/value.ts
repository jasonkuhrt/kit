import { Fn } from '#fn/index.js'

export type Lazy<$Value> = () => $Value

export const lazy = <const value>(value: value): Lazy<typeof value> => () => value

export type LazyMaybe<$Value = unknown> = $Value | Lazy<$Value>

// dprint-ignore
export type resolveLazy<$LazyMaybeValue extends LazyMaybe<any>> =
  $LazyMaybeValue extends Lazy<infer __value__> ? __value__ : $LazyMaybeValue

export const resolveLazy = <lazyMaybeValue extends LazyMaybe>(
  lazyMaybeValue: lazyMaybeValue,
): resolveLazy<lazyMaybeValue> => {
  if (Fn.is(lazyMaybeValue)) return lazyMaybeValue()
  return lazyMaybeValue as any
}

export const resolveLazyFactory = <value>(lazyMaybeValue: LazyMaybe<value>) => (): value =>
  resolveLazy(lazyMaybeValue) as any
