export interface Codec<T> {
  serialize: (data: T) => string
  deserialize: (data: string) => T
}

export const create = <$Type>({
  serialize = (data: $Type) => String(data),
  deserialize = (data: string) => data as unknown as $Type,
}: {
  serialize?: (data: $Type) => string
  deserialize?: (data: string) => $Type
} = {}): Codec<$Type> => {
  return {
    serialize,
    deserialize,
  }
}
