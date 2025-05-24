export type AnyIndex = Record<PropertyKey, any[]>

// dprint-ignore
export type By<
  $Type extends object,
  $Key extends keyof $Type,
> =
  $Type[$Key] extends PropertyKey
    ? { [_ in $Type[$Key]]?: $Type[] }
    : never

// dprint-ignore
export type by<
  $Type extends object,
  $Key extends keyof $Type,
  ___value = $Type[$Key]
> =
  ___value extends PropertyKey
    ? { [_ in ___value]?: $Type[] }
    : `ERROR: type of $Type[$Key] is not a subtype of PropertyKey and so $Key "${PropertyKeyToString<$Key>}" cannot be used as an indexing value.`

export const by = <obj extends object, key extends keyof obj>(
  array: obj[],
  key: key,
): by<obj, key> => {
  const index = array.reduce((index, item) => {
    const indexKey = item[key] as PropertyKey
    index[indexKey] ??= []
    index[indexKey].push(item)
    return index
  }, {} as Record<PropertyKey, any[]>)
  return index as any
}

export const merge = <index extends AnyIndex>(
  index1: index,
  index2: index,
): index => {
  const index1_ = index1 as AnyIndex
  const index2_ = index2 as AnyIndex
  for (const k2 in index2_) {
    index1_[k2] ??= []
    index1_[k2].push(...index2_[k2]!)
  }
  return index1_ as any
}

// dprint-ignore
export type PropertyKeyToString<$PropertyKey extends PropertyKey> =
  $PropertyKey extends string
    ? $PropertyKey
    : $PropertyKey extends number
      ? `${$PropertyKey}`
      : '<< SOME SYMBOL >>'
