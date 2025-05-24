// dprint-ignore
export type IndexBy<
  $Type extends object,
  $Key extends keyof $Type,
> =
  $Type[$Key] extends PropertyKey
    ? { [_ in $Type[$Key]]?: $Type[] }
    : never

// dprint-ignore
export type indexBy<
  $Type extends object,
  $Key extends keyof $Type,
  ___value = $Type[$Key]
> =
  ___value extends PropertyKey
    ? { [_ in ___value]?: $Type[] }
    : `ERROR: type of $Type[$Key] is not a subtype of PropertyKey and so $Key "${PropertyKeyToString<$Key>}" cannot be used as an indexing value.`

export const indexBy = <obj extends object, key extends keyof obj>(
  array: obj[],
  key: key,
): indexBy<obj, key> => {
  const index = array.reduce((index, item) => {
    const indexKey = item[key] as PropertyKey
    index[indexKey] ??= []
    index[indexKey].push(item)
    return index
  }, {} as Record<PropertyKey, any[]>)
  return index as any
}

// dprint-ignore
export type PropertyKeyToString<$PropertyKey extends PropertyKey> =
  $PropertyKey extends string
    ? $PropertyKey
    : $PropertyKey extends number
      ? `${$PropertyKey}`
      : '<< SOME SYMBOL >>'
