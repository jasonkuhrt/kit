import { mergeInitWithStrategySet } from './headers.js'

export const mergeInit = (a?: RequestInit, b?: RequestInit): RequestInit => {
  const headers = mergeInitWithStrategySet(a?.headers ?? {}, b?.headers ?? {})
  return {
    ...a,
    ...b,
    headers,
  }
}
