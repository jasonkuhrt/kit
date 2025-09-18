import { Codec } from '#codec'
import { Schema } from 'effect'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Types
//
//

/**
 * JSON primitive type.
 * Matches: string, number, boolean, or null.
 */
export type Primitive = string | number | boolean | null

/**
 * JSON object type.
 */
export type Obj = { [key in string]?: Value }

/**
 * JSON value type.
 * Matches any valid JSON value: primitives, objects, or arrays (recursively).
 */
export type Value = Primitive | Obj | Value[]

// Export object type with alias
export { type Obj as Object }

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Type Guards
//
//

/**
 * Type guard to check if a value is a JSON primitive.
 */
export const isPrimitive = (value: unknown): value is Primitive => {
  return (
    typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
    || value === null
  )
}

/**
 * Type guard to check if a value is a valid JSON value.
 */
export const isValue = (value: unknown): value is Value => {
  // Recursive implementation for JSON value checking
  if (isPrimitive(value)) return true
  if (Array.isArray(value)) {
    return value.every(isValue)
  }
  if (typeof value === 'object' && value !== null) {
    // Reject non-plain objects (Date, RegExp, etc.)
    const proto = Object.getPrototypeOf(value)
    if (proto !== Object.prototype && proto !== null) {
      return false
    }
    return Object.values(value).every(isValue)
  }
  return false
}

/**
 * Type guard to check if a value is a JSON object.
 */
export const isObject = (value: unknown): value is Obj => {
  return (
    typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && isValue(value)
  )
}

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Schemas
//
//

/**
 * JSON primitive value schema.
 * Matches: string, number, boolean, or null.
 */
export const PrimitiveSchema = Schema.Union(
  Schema.String,
  Schema.Number,
  Schema.Boolean,
  Schema.Null,
)

/**
 * JSON value schema.
 * Matches any valid JSON value: primitives, objects, or arrays (recursively).
 */
// @ts-expect-error - Recursive type inference limitation
export const ValueSchema: Schema.Schema<Value> = Schema.suspend(() =>
  Schema.Union(
    PrimitiveSchema,
    Schema.Array(ValueSchema),
    Schema.Record({ key: Schema.String, value: ValueSchema }),
  )
)

/**
 * JSON object schema.
 * Matches objects with string keys and JSON values.
 */
export const ObjectSchema = Schema.Record({ key: Schema.String, value: ValueSchema })

/**
 * Schema for parsing JSON strings to unknown values.
 * Uses Effect's parseJson for better error handling.
 */
export const parseJsonSchema = Schema.parseJson()

/**
 * Schema for parsing JSON with type validation.
 */
export const parseJsonAs = <A>(schema: Schema.Schema<A>) => Schema.parseJson(schema)

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Codec
//
//

/**
 * Codec for JSON values with pretty-printing.
 * Uses Effect's parseJson for decoding.
 */
export const codec = Codec.create<Value>({
  encode: (json) => JSON.stringify(json, null, 2),
  decode: (str) => Schema.decodeUnknownSync(parseJsonSchema)(str) as Value,
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
 */
export const encode = codec.encode

/**
 * Parse a JSON string to a typed value.
 * Uses Effect's parseJson for better error messages.
 */
export const decode = codec.decode

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Schema Exports for Tests
//
//

/**
 * Exported schemas for parsing JSON types.
 * These are used in tests and provide parse methods.
 */
export const Primitive = {
  parse: (value: unknown) => Schema.decodeUnknownSync(PrimitiveSchema)(value),
}

export const Value = {
  parse: (value: unknown) => Schema.decodeUnknownSync(ValueSchema)(value),
}

export const ObjectParser = {
  parse: (value: unknown) => Schema.decodeUnknownSync(ObjectSchema)(value),
}
