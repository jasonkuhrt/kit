import type * as TF from 'type-fest'

/**
 * Pick properties from an object where the values extend a given constraint.
 * @example
 * ```ts
 * type User = { name: string; age: number; isActive: boolean; flag: boolean }
 * type BooleanProps = PickWhereValueExtends<User, boolean>
 * // Result: { isActive: boolean; flag: boolean }
 * ```
 */
export type PickWhereValueExtends<$Obj extends object, $Constraint> = {
  [k in keyof $Obj as $Obj[k] extends $Constraint ? k : never]: $Obj[k]
}

/**
 * Extract a union type of all values in an object.
 * @example
 * ```ts
 * type Config = { host: string; port: number; secure: boolean }
 * type ConfigValues = Values<Config>
 * // Result: string | number | boolean
 * ```
 */
export type Values<$Obj extends object> = $Obj[keyof $Obj]

/**
 * Replace the type of a specific property in an object.
 * @example
 * ```ts
 * type User = { id: number; name: string; age: number }
 * type UpdatedUser = ReplaceProperty<User, 'id', string>
 * // Result: { id: string; name: string; age: number }
 * ```
 */
export type ReplaceProperty<$Obj extends object, $Key extends keyof $Obj, $NewType> =
  & Omit<$Obj, $Key>
  & {
    [_ in $Key]: $NewType
  }

/**
 * Type-level check to determine if an object type has no keys.
 * @example
 * ```ts
 * type Empty = IsEmpty<{}> // true
 * type NotEmpty = IsEmpty<{ a: 1 }> // false
 * ```
 */
export type IsEmpty<$Obj extends object> = keyof $Obj extends never ? true : false

/**
 * Create an array type containing the keys of an object.
 * @example
 * ```ts
 * type User = { name: string; age: number; email: string }
 * type UserKeys = KeysArray<User>
 * // Result: Array<'name' | 'age' | 'email'>
 * ```
 */
export type KeysArray<$Obj extends object> = Array<keyof $Obj>

/**
 * Create a readonly array type containing the keys of an object.
 * @example
 * ```ts
 * type User = { name: string; age: number; email: string }
 * type UserKeys = KeysReadonlyArray<User>
 * // Result: ReadonlyArray<'name' | 'age' | 'email'>
 * ```
 */
export type KeysReadonlyArray<$Obj extends object> = ReadonlyArray<keyof $Obj>

/**
 * Pick only the properties from an object that exist in a provided array of keys.
 * @example
 * ```ts
 * type User = { id: number; name: string; age: number; email: string }
 * type PublicUser = OnlyKeysInArray<User, ['name', 'email']>
 * // Result: { name: string; email: string }
 * ```
 */
export type OnlyKeysInArray<$Obj extends object, $KeysArray extends readonly string[]> = {
  [k in keyof $Obj as k extends $KeysArray[number] ? k : never]: $Obj[k]
}

/**
 * Make all properties of an object writable (remove readonly modifiers).
 * This is an alias for type-fest's Writable type.
 * @example
 * ```ts
 * type ReadonlyUser = { readonly id: number; readonly name: string }
 * type WritableUser = Writeable<ReadonlyUser>
 * // Result: { id: number; name: string }
 * ```
 */
export type Writeable<$Obj extends object> = TF.Writable<$Obj>

/**
 * Like keyof but returns PropertyKey for object type.
 * Helper type for generic object key operations.
 */
export type Keyof<$Object extends object> = object extends $Object ? PropertyKey : (keyof $Object)

/**
 * Filter object properties based on a policy mode and set of keys.
 * @example
 * ```ts
 * type User = { id: number; name: string; email: string; password: string }
 * // Allow mode: keep only specified keys
 * type PublicUser = PolicyFilter<User, 'id' | 'name', 'allow'>
 * // Result: { id: number; name: string }
 *
 * // Deny mode: remove specified keys
 * type SafeUser = PolicyFilter<User, 'password', 'deny'>
 * // Result: { id: number; name: string; email: string }
 * ```
 */
// dprint-ignore
export type PolicyFilter<
  $Object extends object,
  $Key extends Keyof<$Object>,
  $Mode extends 'allow' | 'deny',
> = $Mode extends 'allow'
      ? Pick<$Object, Extract<$Key, keyof $Object>>
      : Omit<$Object, Extract<$Key, keyof $Object>>

/**
 * Replace properties in an object type with new types.
 * Useful for overriding specific property types.
 * @example
 * ```ts
 * type User = { id: number; name: string; createdAt: Date }
 * type SerializedUser = Replace<User, { createdAt: string }>
 * // Result: { id: number; name: string; createdAt: string }
 * ```
 */
export type Replace<$Object1, $Object2> = Omit<$Object1, keyof $Object2> & $Object2

/**
 * Extract keys from an object type that have primitive values.
 * Useful for serialization scenarios where only primitive values can be safely transferred.
 * @example
 * ```ts
 * type User = {
 *   id: number
 *   name: string
 *   createdAt: Date
 *   metadata: { tags: string[] }
 *   isActive: boolean
 * }
 * type SerializableKeys = PrimitiveFieldKeys<User>
 * // Result: 'id' | 'name' | 'createdAt' | 'isActive'
 * // Note: Date is considered primitive for serialization purposes
 * ```
 */
export type PrimitiveFieldKeys<$T> = {
  [K in keyof $T]: $T[K] extends string | number | boolean | bigint | null | undefined ? K
    : $T[K] extends Date ? K
    : never
}[keyof $T]
