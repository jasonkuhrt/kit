import type { Prom } from '../prom/index.js'

export * from './never.js'

export const identity = <value>(value: value): value => value

export const constant = <value>(value: value): () => value => () => value

export type Simplify<$Type> = { [_ in keyof $Type]: $Type[_] } & unknown

export type TypeofTypes =
  | 'string'
  | 'number'
  | 'boolean'
  | 'bigint'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function'

export type Async<$Value> = Promise<$Value>

export type SideEffectAsync = Promise<void>

export type SideEffect = void

export type SideEffectAsyncMaybe = Prom.Maybe<void>

export const todo = (): never => {
  throw new Error(`TODO`)
}

export type Value = Primitive | object

export type Primitive = string | number | bigint | boolean | symbol | null | undefined

export const isPrimitive = (value: unknown): value is Primitive => {
  const type = typeof value
  return type !== 'object' && type !== 'function' && type !== null
}
