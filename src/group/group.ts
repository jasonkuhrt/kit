import { Ts } from '#ts/index.js'

export type AnyIndex = Record<PropertyKey, any[]>

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

export const by = <obj extends object, key extends keyof obj>(
  array: obj[],
  // dprint-ignore
  key: GuardIsGroupableKey<obj, key, ErrorInvalidGroupKey<obj, key>>,
): by<obj, key> => {
  const index = array.reduce((index, item) => {
    // @ts-expect-error
    const indexKey = item[key] as PropertyKey
    index[indexKey] ??= []
    index[indexKey].push(item)
    return index
  }, {} as Record<PropertyKey, any[]>)
  return index as any
}

type GuardIsGroupableKey<
  $Obj extends object,
  $Key extends keyof $Obj,
  $Error extends Ts.StaticError,
> = $Obj[$Key] extends PropertyKey ? $Key : Ts.Simplify<$Error>

/**
 * Merge two groups.
 */
export const merge = <index extends AnyIndex>(
  group1: index,
  group2: index,
): index => {
  const group1_ = group1 as AnyIndex
  const group2_ = group2 as AnyIndex

  for (const k2 in group2_) {
    group1_[k2] ??= []
    group1_[k2].push(...group2_[k2]!)
  }
  return group1_ as any
}
