import { Schema } from 'effect'
import { type Codec, create } from './codec.js'

/**
 * Create a codec from an Effect Schema.
 * The codec will encode to JSON and decode/validate using the schema.
 *
 * @param schema - The Effect Schema to use for validation
 * @param options - Optional JSON stringify options
 * @returns A codec that validates data against the schema
 *
 * @example
 * ```ts
 * import { Schema } from 'effect'
 *
 * const UserSchema = Schema.Struct({
 *   name: Schema.String,
 *   age: Schema.Number.pipe(Schema.positive()),
 * })
 *
 * const userCodec = fromEffectSchema(UserSchema)
 *
 * // Encoding
 * userCodec.encode({ name: 'John', age: 30 })
 * // '{\n  "name": "John",\n  "age": 30\n}'
 *
 * // Decoding with validation
 * userCodec.decode('{"name": "John", "age": 30}')
 * // { name: 'John', age: 30 }
 *
 * // Invalid data throws ParseError
 * userCodec.decode('{"name": "John", "age": -5}')
 * // throws: ParseError with validation details
 * ```
 *
 * @example
 * ```ts
 * // With custom JSON options
 * const compactCodec = fromEffectSchema(UserSchema, {
 *   space: 0, // No pretty printing
 * })
 *
 * // With custom replacer
 * const dateCodec = fromEffectSchema(DataSchema, {
 *   replacer: (key, value) =>
 *     value instanceof Date ? value.toISOString() : value
 * })
 * ```
 */
export const fromEffectSchema = <A, I = A>(
  schema: Schema.Schema<A, I>,
  options?: {
    replacer?: (key: string, value: any) => any
    space?: string | number
  },
): Codec<A> => {
  const decode = Schema.decodeUnknownSync(schema)
  const encode = Schema.encodeSync(schema)

  return create<A>({
    encode: (data) => {
      const encoded = encode(data)
      return JSON.stringify(encoded, options?.replacer, options?.space ?? 2)
    },
    decode: (raw) => {
      const parsed = JSON.parse(raw)
      return decode(parsed) // Will throw ParseError on validation failure
    },
  })
}
