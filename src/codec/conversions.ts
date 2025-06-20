import type { z } from 'zod/v4'
import { type Codec, create } from './codec.ts'

/**
 * Create a codec from a Zod schema.
 * The codec will encode to JSON and decode/validate using the schema.
 *
 * @param schema - The Zod schema to use for validation
 * @param options - Optional JSON stringify options
 * @returns A codec that validates data against the schema
 *
 * @example
 * ```ts
 * import { z } from 'zod/v4'
 *
 * const UserSchema = z.object({
 *   name: z.string(),
 *   age: z.number().positive(),
 * })
 *
 * const userCodec = fromZod(UserSchema)
 *
 * // Encoding
 * userCodec.encode({ name: 'John', age: 30 })
 * // '{\n  "name": "John",\n  "age": 30\n}'
 *
 * // Decoding with validation
 * userCodec.decode('{"name": "John", "age": 30}')
 * // { name: 'John', age: 30 }
 *
 * // Invalid data throws ZodError
 * userCodec.decode('{"name": "John", "age": -5}')
 * // throws: ZodError with validation details
 * ```
 *
 * @example
 * ```ts
 * // With custom JSON options
 * const compactCodec = fromZod(UserSchema, {
 *   space: 0, // No pretty printing
 * })
 *
 * // With custom replacer
 * const dateCodec = fromZod(DataSchema, {
 *   replacer: (key, value) =>
 *     value instanceof Date ? value.toISOString() : value
 * })
 * ```
 */
export const fromZod = <T>(
  schema: z.ZodType<T>,
  options?: {
    replacer?: (key: string, value: any) => any
    space?: string | number
  },
): Codec<T> => {
  return create<T>({
    encode: (data) => JSON.stringify(data, options?.replacer, options?.space ?? 2),
    decode: (raw) => {
      const parsed = JSON.parse(raw)
      return schema.parse(parsed) // Will throw ZodError on validation failure
    },
  })
}
