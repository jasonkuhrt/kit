import type { Prom } from '../prom/index.js'

export * from './never.js'

export const identity = <value>(value: value): value => value

export const constant = <value>(value: value): () => value => () => value

// TypeScript

export type Simplify<$Type> = { [_ in keyof $Type]: $Type[_] } & unknown

// typeof

export const TypeofTypesEnum = {
  string: 'string',
  number: 'number',
  bigint: 'bigint',
  boolean: 'boolean',
  symbol: 'symbol',
  undefined: 'undefined',
  object: 'object',
  function: 'function',
}

export type TypeofTypes = keyof typeof TypeofTypesEnum

// Type Guard

export type TypeGuard<$Type> = (value: unknown) => value is $Type

export type TypeGuardImplementation = (value: unknown) => boolean

export type TypeGuardImplementationInput = TypeGuardImplementation | Primitive

export const typeGuard = <type>(typeGuard: TypeGuardImplementationInput): TypeGuard<type> => {
  if (typeof typeGuard === TypeofTypesEnum.function) return typeGuard as any
  return (value): value is type => value === typeGuard
}

export type NegatedTypeGuard<$Type> = (value: unknown) => value is Exclude<typeof value, $Type>

export const negatedTypeGuard = <type>(typeGuard: TypeGuardImplementation): NegatedTypeGuard<type> => {
  if (typeof typeGuard === TypeofTypesEnum.function) return typeGuard as any
  return (value): value is Exclude<typeof value, type> => value !== typeGuard
}

// Async

export type Async<$Value> = Promise<$Value>

export type SideEffectAsync = Promise<void>

export type SideEffect = void

export type SideEffectAsyncMaybe = Prom.Maybe<void>

// Workflow

export const todo = (): never => {
  throw new Error(`TODO`)
}

// Value

export type Value = Primitive | object

export type Primitive = string | number | bigint | boolean | symbol | null | undefined

export const isPrimitive = (value: unknown): value is Primitive => {
  const type = typeof value
  // todo: use Obj.is
  return (type !== TypeofTypesEnum.object || value === null) && type !== TypeofTypesEnum.function
}
