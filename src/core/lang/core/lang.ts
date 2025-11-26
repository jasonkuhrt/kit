/**
 * Enumeration of JavaScript typeof operator results.
 */
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

/**
 * Union type of all possible typeof operator results.
 */
export type TypeofTypes = keyof typeof TypeofTypesEnum

/**
 * A function that narrows the type of a value.
 */
export type TypeGuard<$Type> = (value: unknown) => value is $Type

/**
 * A function that checks if a value matches a type (without type narrowing).
 */
export type TypeGuardImplementation = (value: unknown) => boolean

/**
 * JavaScript primitive types.
 */
export type Primitive = string | number | bigint | boolean | symbol | null | undefined

/**
 * Input type for creating type guards - either a guard function or a primitive value to check against.
 */
export type TypeGuardImplementationInput = TypeGuardImplementation | Primitive

/**
 * Create a type guard from a guard function or primitive value.
 *
 * @param typeGuard - A guard function or primitive value to check against.
 * @returns A type guard function.
 *
 * @example
 * ```ts
 * const isString = typeGuard<string>('string')
 * const isCustom = typeGuard<MyType>(value => value instanceof MyType)
 * ```
 */
export const typeGuard = <type>(typeGuard: TypeGuardImplementationInput): TypeGuard<type> => {
  if (typeof typeGuard === TypeofTypesEnum.function) return typeGuard as any
  return (value): value is type => value === typeGuard
}
