import { Arr } from '#arr/index.js'
import { Cache } from '#cache/index.js'
import { Rec } from '#rec/index.js'

export interface Idx<$Item, $Key extends PropertyKey = PropertyKey> {
  get(item: $Item): $Item | undefined
  set(item: $Item): void
  getKey(key: $Key): $Item | undefined
  setKey(key: $Key, item: $Item): void
  data: {
    array: $Item[]
    record: Record<$Key, { item: $Item; index: number }>
  }
}

export const create = <item, key extends PropertyKey>(input?: { toKey?: (item: item) => key }): Idx<item, key> => {
  const array = Arr.create<item>()
  // todo use map so that key can be any type?
  const record = Rec.create<{ item: item; index: number }>()
  const itemToKey = Cache.memoize(input?.toKey ?? String, null)

  const index = {
    get(item: item) {
      return index.getKey(itemToKey(item))
    },
    set(item: item) {
      index.setKey(itemToKey(item), item)
    },
    getKey(key: PropertyKey) {
      return record[key]?.item
    },
    setKey(key: PropertyKey, item: item) {
      if (record[key]) {
        record[key].item = item
        array.splice(record[key].index, 1, item)
      } else {
        const index = array.push(item)
        record[key] = { item, index }
      }
    },
    data: {
      array,
      record,
    },
  }

  return index as any
}

// todo: fromIterable?
export const fromArray = <item, key extends PropertyKey>(
  items: item[],
  options?: { toKey?: (item: item) => key },
): Idx<item, key> => {
  const index = create(options)

  for (const item of items) {
    index.set(item)
  }

  return index
}
