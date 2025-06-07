import { Fn } from '#fn/index.js'

export interface Codec<$Data> {
  encode: Encode<$Data>
  decode: Decode<$Data>
}

export type Decode<$Data> = <data extends $Data>(data: string) => data

export type Encode<$Data> = <data extends $Data>(data: data) => string

export const create = <$Data = string>(
  input?: {
    encode?: undefined | ((data: $Data) => string)
    decode?: undefined | ((data: string) => $Data)
  } | undefined,
): Codec<$Data> => {
  const encode = input?.encode ?? String
  const decode = input?.decode ?? Fn.identity

  const codec = {
    encode,
    decode,
  }

  return codec as any
}
