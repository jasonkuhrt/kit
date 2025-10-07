import type { Lang } from '#lang'
import type { Rec } from '#rec'
import type { Writable } from 'type-fest'
import { entries } from './get.js'
import { Type } from './traits/type.js'
import { type Any, type IsEmpty } from './type.js'

export * from './path.js'

export * from './get.js'

export * from './merge.js'

export * from './type.js'

/**
 * Assert that a value is an object.
 * Throws a TypeError if the value is not an object (including null).
 *
 * @param value - The value to check
 * @throws {TypeError} If the value is not an object
 *
 * @example
 * ```ts
 * function process(value: unknown) {
 *   Obj.assert(value)
 *   // value is now typed as object
 *   console.log(Object.keys(value))
 * }
 * ```
 */
export function assert(value: unknown): asserts value is object {
  if (typeof value !== 'object' || value === null) {
    throw new TypeError(`Expected object but got ${typeof value}`)
  }
}

// Note: entries moved to get.ts

// Note: keyofOr moved to get.ts

/**
 * Create a type predicate function that checks if a value matches a shape specification.
 * Uses JavaScript's `typeof` operator to validate property types.
 *
 * @param spec - An object mapping property names to their expected typeof results
 * @returns A type predicate function that checks if a value matches the shape
 *
 * @example
 * ```ts
 * const isUser = isShape<{ name: string; age: number }>({
 *   name: 'string',
 *   age: 'number'
 * })
 *
 * isUser({ name: 'Alice', age: 30 }) // true
 * isUser({ name: 'Bob' }) // false - missing age
 * isUser({ name: 'Charlie', age: '30' }) // false - age is string
 * ```
 *
 * @example
 * ```ts
 * // Can check for functions and other typeof types
 * const isCallback = isShape<{ fn: Function }>({
 *   fn: 'function'
 * })
 * ```
 */
export const isShape = <type>(spec: Record<PropertyKey, Lang.TypeofTypes>) => (value: unknown): value is type => {
  if (!Type.is(value)) return false
  const obj_ = value as Rec.Any

  return entries(spec).every(([key, typeofType]) => {
    return typeof obj_[key] === typeofType
  })
}

// Note: IsEmpty, Empty, empty, isEmpty, isEmpty$ moved to type.ts

const PrivateStateSymbol = Symbol('PrivateState')

/**
 * Attach private state to an object using a non-enumerable Symbol property.
 * The state is immutable once set and cannot be discovered through enumeration.
 *
 * @param obj - The object to attach private state to
 * @param value - The state object to attach
 * @returns The original object with private state attached
 *
 * @example
 * ```ts
 * const user = { name: 'Alice' }
 * const privateData = { password: 'secret123' }
 *
 * setPrivateState(user, privateData)
 * // user still appears as { name: 'Alice' } when logged
 * // but has hidden private state accessible via getPrivateState
 * ```
 *
 * @example
 * ```ts
 * // Useful for attaching metadata without polluting the object
 * const config = { timeout: 5000 }
 * setPrivateState(config, {
 *   source: 'environment',
 *   timestamp: Date.now()
 * })
 * ```
 */
export const setPrivateState = <obj extends Any>(obj: obj, value: object): obj => {
  Object.defineProperty(obj, PrivateStateSymbol, {
    value,
    writable: false,
    enumerable: false,
    configurable: false,
  })
  return obj
}

/**
 * Retrieve private state previously attached to an object with setPrivateState.
 *
 * @param obj - The object to retrieve private state from
 * @returns The private state object
 * @throws Error if no private state is found on the object
 *
 * @example
 * ```ts
 * const user = { name: 'Alice' }
 * setPrivateState(user, { role: 'admin' })
 *
 * const privateData = getPrivateState<{ role: string }>(user)
 * console.log(privateData.role) // 'admin'
 * ```
 *
 * @example
 * ```ts
 * // Type-safe private state retrieval
 * interface Metadata {
 *   createdAt: number
 *   createdBy: string
 * }
 *
 * const doc = { title: 'Report' }
 * setPrivateState(doc, { createdAt: Date.now(), createdBy: 'system' })
 *
 * const meta = getPrivateState<Metadata>(doc)
 * // meta is typed as Metadata
 * ```
 */
export const getPrivateState = <state extends Any>(obj: Any): state => {
  const descriptor = Object.getOwnPropertyDescriptor(obj, PrivateStateSymbol)
  if (!descriptor) throw new Error('Private state not found')
  return descriptor.value
}

/**
 * Check if an object has any non-undefined values.
 *
 * @param object - The object to check
 * @returns True if at least one value is not undefined
 * @example
 * ```ts
 * hasNonUndefinedKeys({ a: undefined, b: undefined })  // false
 * hasNonUndefinedKeys({ a: undefined, b: 1 })  // true
 * hasNonUndefinedKeys({})  // false
 * ```
 */
export const hasNonUndefinedKeys = (object: object): boolean => {
  return Object.values(object).some(value => value !== undefined)
}

// Note: spreadShallow moved to merge.ts

// dprint-ignore
export type PartialDeep<$Type> =
  $Type extends Array<infer __inner__>                  ? Array<PartialDeep<__inner__>> :
  $Type extends ReadonlyArray<infer __inner__>          ? ReadonlyArray<PartialDeep<__inner__>> :
  $Type extends Promise<infer __inner__>                ? Promise<PartialDeep<__inner__>> :
  $Type extends Function                                ? $Type :
  $Type extends object                                  ? {
                                                            [key in keyof $Type]?: PartialDeep<$Type[key]>
                                                          } :
                                                        // else
                                                          $Type

// Note: HasOptionalKeys moved to predicates.ts

// Note: OptionalKeys moved to predicates.ts

// Note: RequiredKeys moved to predicates.ts

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Type Utilities
//
//
//

// Note: PickWhereValueExtends moved to filter.ts

// Note: ReplaceProperty moved to merge.ts

// Note: ExactNonEmpty moved to type.ts

// Note: KeysArray moved to get.ts

// Note: KeysReadonlyArray moved to get.ts

// Note: OnlyKeysInArray moved to filter.ts

/**
 * Make all properties of an object writable (remove readonly modifiers).
 * @example
 * ```ts
 * type ReadonlyUser = { readonly id: number; readonly name: string }
 * type WritableUser = Writeable<ReadonlyUser>
 * // Result: { id: number; name: string }
 * ```
 */
export type Writeable<$Obj extends object> = Writable<$Obj>

// Note: Keyof, PolicyFilter moved to filter.ts

// Note: Replace moved to merge.ts

// Note: PrimitiveFieldKeys moved to get.ts

// Note: GetKeyOr moved to get.ts

// Note: SuffixKeyNames, OmitKeysWithPrefix moved to filter.ts

// Note: PickRequiredProperties, RequireProperties, PartialOrUndefined moved to filter.ts

// Note: UnionMerge moved to Ts.Union.Merge

// Note: MergeAll moved to merge.ts

// Note: PickOptionalPropertyOrFallback moved to filter.ts

// Note: HasOptionalKey moved to predicates.ts

// Note: IsKeyInObjectOptional renamed to IsKeyOptional and moved to predicates.ts

// Note: IsKeyInObject renamed to HasKey and moved to predicates.ts

// Note: StringKeyof moved to get.ts

// Note: GetOrNever moved to get.ts

/**
 * Convert an object to a parameters tuple.
 */
// dprint-ignore
export type ToParameters<$Params extends object | undefined> =
  undefined extends $Params ? [params?: $Params] :
  $Params extends undefined ? [params?: $Params] :
                              [params: $Params]

/**
 * Convert an object to parameters tuple with exact matching.
 */
export type ToParametersExact<$Input extends object, $Params extends object | undefined> = IsEmpty<$Input> extends true
  ? []
  : ToParameters<$Params>

/**
 * Convert PropertyKey to string if possible.
 */
export type PropertyKeyToString<$Key extends PropertyKey> = $Key extends string ? $Key
  : $Key extends number ? `${$Key}`
  : never
