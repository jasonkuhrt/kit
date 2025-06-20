import { Codec } from '#codec'
import { ZodAid } from '#zod-aid'
import { z } from 'zod'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Types
//
//

/**
 * JSON primitive value schema.
 * Matches: string, number, boolean, or null.
 */
export const Primitive = z.union([z.string(), z.number(), z.boolean(), z.null()])
export type Primitive = z.infer<typeof Primitive>
/**
 * Type guard to check if a value is a JSON primitive.
 * @param value - The value to check
 * @returns True if the value is a JSON primitive (string, number, boolean, or null)
 * @example
 * ```ts
 * isPrimitive('hello') // true
 * isPrimitive(42) // true
 * isPrimitive(true) // true
 * isPrimitive(null) // true
 * isPrimitive({}) // false
 * isPrimitive([]) // false
 * ```
 */
export const isPrimitive = ZodAid.typeGuard(Primitive)

/**
 * JSON value schema.
 * Matches any valid JSON value: primitives, objects, or arrays (recursively).
 */
export const Value: z.ZodType<Value> = z.lazy(() => z.union([Primitive, z.array(Value), z.record(Value)]))
export type Value = Primitive | Obj | Value[]

/**
 * Type guard to check if a value is a valid JSON value.
 * @param value - The value to check
 * @returns True if the value is a valid JSON value
 * @example
 * ```ts
 * isValue('hello') // true
 * isValue({ a: 1, b: [2, 3] }) // true
 * isValue([1, 'two', { three: 3 }]) // true
 * isValue(undefined) // false
 * isValue(new Date()) // false
 * ```
 */
export const isValue = ZodAid.typeGuard(Value)

const Obj: z.ZodType<Obj> = z.record(Value)
type Obj = { [key in string]?: Value }
/**
 * Type guard to check if a value is a JSON object.
 * @param value - The value to check
 * @returns True if the value is a JSON object (not array or primitive)
 * @example
 * ```ts
 * isObject({ a: 1, b: 'hello' }) // true
 * isObject({}) // true
 * isObject([]) // false
 * isObject('hello') // false
 * isObject(null) // false
 * ```
 */
export const isObject = ZodAid.typeGuard(Obj)

/**
 * JSON object schema.
 * Matches objects with string keys and JSON values.
 */
// If we name this "Object" then Vitest fails with "cannot reference Object before initialization"
// TODO: open issue with Vitest team
export { Obj as Object }

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Codec
//
//

/**
 * Codec for JSON values with pretty-printing.
 * Encodes to JSON string with 2-space indentation.
 * @example
 * ```ts
 * codec.encode({ a: 1, b: 2 }) // '{\n  "a": 1,\n  "b": 2\n}'
 * codec.decode('{"a":1}') // { a: 1 }
 * ```
 */
export const codec = Codec.create<Value>({
  encode: json => JSON.stringify(json, null, 2),
  decode: JSON.parse,
})

/**
 * Create a typed JSON codec for a specific data type.
 * @returns A codec that encodes/decodes the specified type
 * @example
 * ```ts
 * interface User { name: string; age: number }
 * const userCodec = codecAs<User>()
 *
 * const encoded = userCodec.encode({ name: 'John', age: 30 })
 * // '{\n  "name": "John",\n  "age": 30\n}'
 *
 * const decoded = userCodec.decode(encoded)
 * // { name: 'John', age: 30 } (typed as User)
 * ```
 */
export const codecAs = <$Data>() =>
  Codec.create<$Data>({
    encode: json => JSON.stringify(json, null, 2),
    decode: JSON.parse,
  })

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Convenience
//
//

/**
 * Encode a JSON value to a pretty-printed string.
 * Alias for {@link codec.encode}.
 * @param json - The JSON value to encode
 * @returns JSON string with 2-space indentation
 * @example
 * ```ts
 * encode({ a: 1, b: [2, 3] })
 * // '{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}'
 * ```
 */
export const encode = codec.encode

/**
 * Parse a JSON string to a typed value.
 * Alias for {@link codec.decode}.
 * @param json - The JSON string to parse
 * @returns The parsed JSON value
 * @throws SyntaxError if the string is not valid JSON
 * @example
 * ```ts
 * decode('{"a":1,"b":"hello"}') // { a: 1, b: 'hello' }
 * decode('[1, 2, 3]') // [1, 2, 3]
 * ```
 */
export const decode = codec.decode
