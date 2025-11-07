import { Ts } from '#ts'
import type { Undefined } from '#undefined'

export type Unknown = Record<PropertyKey, unknown[]>

export type Any = Record<PropertyKey, any[]>

// dprint-ignore
export type by<
  $Type extends object,
  $Key extends keyof $Type,
> =
  $Type[$Key] extends PropertyKey
    ? {
        [__group_name__ in $Type[$Key]]?:
        Array<
          (
            // If $Type is a union type we want to extract the relevent members for this group.
            //
            // If Extraction results in never then that means its not a union of types but rather
            // the key value itself is a union. In this case each group  gets the type but narrowed
            // for the key property.
            //
            Ts.Simplify.Top<
              Extract<$Type, { [_ in $Key]: __group_name__ }> extends never
                ? $Type & { [_ in $Key]: __group_name__ }
                : Extract<$Type, { [_ in $Key]: __group_name__ }>
            >
          )
        >
      }
    : never

// dprint-ignore
export interface ErrorInvalidGroupKey<obj extends object, key extends keyof obj> extends Ts.Err.StaticError<
  readonly ['group', 'invalid-key'],
  {
    message: `The value at your chosen key ${Ts.Show<key>} is not a subtype of allowed property key types (${Ts.Show<PropertyKey>}) and so cannot be used to group your objects.`
    your_key_type: obj[key]
  }
> {}

// interface PrivateState {
//   key: PropertyKey
// }

/**
 * Groups an array of objects by the value at a specified key.
 *
 * Creates an index where each unique value at the given key becomes a property
 * containing an array of all objects that have that value.
 *
 * @template obj - The type of objects in the array
 * @template key - The key to group by
 * @param array - The array of objects to group
 * @param key - The object key whose values will be used for grouping. Must be a valid property key type (string, number, or symbol)
 * @returns An object where keys are the unique values found at the specified key, and values are arrays of objects
 *
 * @example
 * const users = [
 *   { id: 1, role: 'admin', name: 'Alice' },
 *   { id: 2, role: 'user', name: 'Bob' },
 *   { id: 3, role: 'admin', name: 'Charlie' }
 * ]
 *
 * const usersByRole = Group.by(users, 'role')
 * // Result:
 * // {
 * //   admin: [{ id: 1, role: 'admin', name: 'Alice' }, { id: 3, role: 'admin', name: 'Charlie' }],
 * //   user: [{ id: 2, role: 'user', name: 'Bob' }]
 * // }
 *
 * @example
 * // Grouping by numeric keys
 * const items = [
 *   { categoryId: 1, name: 'Laptop' },
 *   { categoryId: 2, name: 'Mouse' },
 *   { categoryId: 1, name: 'Keyboard' }
 * ]
 *
 * const itemsByCategory = Group.by(items, 'categoryId')
 * // Result:
 * // {
 * //   1: [{ categoryId: 1, name: 'Laptop' }, { categoryId: 1, name: 'Keyboard' }],
 * //   2: [{ categoryId: 2, name: 'Mouse' }]
 * // }
 */
export const by = <obj extends object, key extends keyof obj>(
  array: obj[],
  // dprint-ignore
  key: ValidateIsGroupableKey<obj, key, ErrorInvalidGroupKey<obj, key>>,
): by<obj, key> => {
  const groupSet = array.reduce((index, item) => {
    // @ts-expect-error
    const indexKey = item[key] as PropertyKey
    index[indexKey] ??= []
    index[indexKey].push(item)
    return index
  }, {} as Record<PropertyKey, any[]>)

  // Obj.setPrivateState(groupSet, { key }) // Commented out for simplified migration

  return groupSet as any
}

type ValidateIsGroupableKey<
  $Obj extends object,
  $Key extends keyof $Obj,
  $Error extends Ts.Err.StaticError,
> = $Obj[$Key] extends PropertyKey ? $Key : Ts.Simplify.Top<$Error>

/**
 * Merges two group sets together.
 *
 * Combines the arrays for each group key. If a key exists in both groups,
 * the arrays are concatenated with group2's items appended to group1's items.
 *
 * @template groupSet - The type of the group set
 * @param group1 - The first group set (will be mutated)
 * @param group2 - The second group set to merge into the first
 * @returns The merged group set (same reference as group1)
 *
 * @example
 * const group1 = {
 *   admin: [{ id: 1, role: 'admin', name: 'Alice' }],
 *   user: [{ id: 2, role: 'user', name: 'Bob' }]
 * }
 *
 * const group2 = {
 *   admin: [{ id: 3, role: 'admin', name: 'Charlie' }],
 *   guest: [{ id: 4, role: 'guest', name: 'David' }]
 * }
 *
 * const merged = Group.merge(group1, group2)
 * // Result:
 * // {
 * //   admin: [{ id: 1, role: 'admin', name: 'Alice' }, { id: 3, role: 'admin', name: 'Charlie' }],
 * //   user: [{ id: 2, role: 'user', name: 'Bob' }],
 * //   guest: [{ id: 4, role: 'guest', name: 'David' }]
 * // }
 */
export const merge = <groupSet extends Any>(
  group1: groupSet,
  group2: groupSet,
): groupSet => {
  const group1_ = group1 as Any
  const group2_ = group2 as Any

  for (const k2 in group2_) {
    group1_[k2] ??= []
    group1_[k2].push(...group2_[k2]!)
  }
  return group1_ as any
}

export type Mapper<$GroupSet extends Any> = {
  [__group_name__ in keyof $GroupSet]: (value: Undefined.Exclude<$GroupSet[__group_name__]>) => unknown
}

export type map<$GroupSet extends Any, $Mapper extends Mapper<$GroupSet>> = {
  [__group_name__ in keyof $GroupSet]: ReturnType<$Mapper[__group_name__]>
}

/**
 * Maps over each group in a group set, transforming the arrays with provided handler functions.
 *
 * Applies a specific handler function to each group based on the group's key.
 * Each handler receives the array of items for its corresponding group.
 *
 * @template groupSet - The type of the group set
 * @template handlers - The type of the handler functions object
 * @param groupSet - The group set to map over
 * @param handlers - An object where keys match group keys and values are transformation functions
 * @returns A new group set with transformed values
 * @throws {Error} If a handler is not provided for a group key that exists in the group set
 *
 * @example
 * const usersByRole = {
 *   admin: [{ id: 1, role: 'admin', name: 'Alice' }, { id: 3, role: 'admin', name: 'Charlie' }],
 *   user: [{ id: 2, role: 'user', name: 'Bob' }]
 * }
 *
 * const userCounts = Group.map(usersByRole, {
 *   admin: (admins) => admins.length,
 *   user: (users) => users.length
 * })
 * // Result: { admin: 2, user: 1 }
 *
 * @example
 * // Transforming to different types
 * const userNames = Group.map(usersByRole, {
 *   admin: (admins) => admins.map(a => a.name),
 *   user: (users) => users.map(u => u.name.toUpperCase())
 * })
 * // Result: { admin: ['Alice', 'Charlie'], user: ['BOB'] }
 */
export const map = <
  groupSet extends Any,
  handlers extends Mapper<groupSet>,
>(groupSet: groupSet, handlers: handlers): Ts.Simplify.Top<map<groupSet, handlers>> => {
  for (const groupName in groupSet) {
    const handler = handlers[groupName]
    if (!handler) throw new Error(`No handler for group "${groupName}"`)
    groupSet[groupName] = handler(groupSet[groupName] as any) as any
  }
  return groupSet as any
}

// export const dispatcherManual = <
//   key extends string,
//   groupSet extends Any,
//   handlers extends Mapper<groupSet>,
// >(groupSet: groupSet, handlers: handlers) => {
//   const { key } = Obj.getPrivateState<PrivateState>(groupSet)

//   const dispatch = (value: groupSet[keyof groupSet][number]) => {
//     const groupName = value[key]
//     if (!groupName) throw new Error(`Invalid value, missing key ${key} expected by group dispatcher`)

//     const handler = handlers[groupName]
//     if (!handler) throw new Error(`No handler for group "${groupName}"`)

//     return handler(value)
//   }
//   return dispatch
// }
