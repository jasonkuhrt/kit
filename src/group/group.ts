import { Obj } from '#obj/index.js'
import { Ts } from '#ts/index.js'
import type { Undefined } from '#undefined/index.js'

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
          // If $Type is a union type we want to extract the relevent members for this group.
          Extract<$Type, { [_ in $Key]: __group_name__ }>[]
      }
    : never

export type ErrorInvalidGroupKey<obj extends object, key extends keyof obj> =
  // dprint-ignore
  Ts.StaticError<
    `The value at your chosen key ${Ts.Show<key>} is not a subtype of allowed property key types (${Ts.Show<PropertyKey>}) and so cannot be used to group your objects.`,
    { your_key_type: obj[key] }
  >

interface PrivateState {
  key: PropertyKey
}

export const by = <obj extends object, key extends keyof obj>(
  array: obj[],
  // dprint-ignore
  key: GuardIsGroupableKey<obj, key, ErrorInvalidGroupKey<obj, key>>,
): by<obj, key> => {
  const groupSet = array.reduce((index, item) => {
    // @ts-expect-error
    const indexKey = item[key] as PropertyKey
    index[indexKey] ??= []
    index[indexKey].push(item)
    return index
  }, {} as Record<PropertyKey, any[]>)

  Obj.setPrivateState(groupSet, { key })

  return groupSet as any
}

type GuardIsGroupableKey<
  $Obj extends object,
  $Key extends keyof $Obj,
  $Error extends Ts.StaticError,
> = $Obj[$Key] extends PropertyKey ? $Key : Ts.Simplify<$Error>

/**
 * Merge two groups.
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

export const map = <
  groupSet extends Any,
  handlers extends Mapper<groupSet>,
>(groupSet: groupSet, handlers: handlers): Ts.Simplify<map<groupSet, handlers>> => {
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
