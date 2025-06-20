import { Fn } from '#fn'

/**
 * A codec that can encode data to string and decode string back to data.
 * @template $Data - The type of data this codec handles
 */
export interface Codec<$Data> {
  /**
   * Encode data to string representation.
   */
  encode: Encode<$Data>
  /**
   * Decode string back to typed data.
   */
  decode: Decode<$Data>
}

/**
 * Decoder function type that converts a string to typed data.
 * @template $Data - The type to decode to
 */
export type Decode<$Data> = <data extends $Data>(data: string) => data

/**
 * Encoder function type that converts typed data to a string.
 * @template $Data - The type to encode from
 */
export type Encode<$Data> = <data extends $Data>(data: data) => string

/**
 * Create a codec with custom encode/decode functions.
 * @param input - Optional configuration object
 * @param input.encode - Custom encoder function (defaults to String())
 * @param input.decode - Custom decoder function (defaults to identity)
 * @returns A codec for encoding and decoding data
 * @example
 * ```ts
 * // Default string codec
 * const stringCodec = create()
 * stringCodec.encode('hello') // 'hello'
 * stringCodec.decode('hello') // 'hello'
 *
 * // Custom JSON codec
 * const jsonCodec = create<any>({
 *   encode: JSON.stringify,
 *   decode: JSON.parse
 * })
 * jsonCodec.encode({ a: 1 }) // '{"a":1}'
 * jsonCodec.decode('{"a":1}') // { a: 1 }
 * ```
 */
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
