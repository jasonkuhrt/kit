import { Schema as S } from 'effect'
import { isLiteral, isTransformation, isTypeLiteral } from 'effect/SchemaAST'
import * as AST from './ast.js'

/**
 * The standard tag property name for tagged structs.
 */
export const tagPropertyName = '_tag'

export type TagPropertyName = typeof tagPropertyName

export type TaggedStruct = { [_ in TagPropertyName]: string }

/**
 * Check if a value is a tagged struct.
 */
export const isTagged = (
  value: unknown,
): value is TaggedStruct => {
  return typeof value === 'object' && value !== null && tagPropertyName in value
}

/**
 * Delete all properties from an object except the tag property.
 * Mutates the object in place.
 */
export const clearExceptTag = (obj: TaggedStruct): void => {
  for (const prop in obj) {
    if (prop !== tagPropertyName) {
      delete (obj as any)[prop]
    }
  }
}

/**
 * Extract specific fields from a struct schema.
 * Type-safe at input/output but implementation can cheat.
 */
export const extractFields = <
  $Fields extends S.Struct.Fields,
  $Keys extends ReadonlyArray<keyof $Fields>,
>(
  schema: S.Struct<$Fields> | S.TaggedStruct<any, $Fields>,
  keys: $Keys,
): Pick<$Fields, $Keys[number]> => {
  const result = Object.fromEntries(
    keys.map(key => [key, schema.fields[key]]),
  )

  return result as Pick<$Fields, $Keys[number]>
}

// Type utilities
export type AnyStruct = S.Struct<any>

export type ExtractFields<
  $Struct extends S.Struct<any>,
> = $Struct extends S.Struct<infer __fields__> ? __fields__ : never

// Literal field utilities

export type Constructor<$Schema extends AnyStruct, $InputFields> = (
  fields: $InputFields,
) => S.Schema.Type<$Schema>

export type ConstructorUsingOmitLiteral1Algo<$Schema extends AnyStruct> = (
  fields: ConstructorFieldsUsingOmitLiteral1Algo<$Schema>,
) => S.Schema.Type<$Schema>

export const pickLiteral1FieldsAsLiterals = <schema extends AnyStruct>(
  schema: schema,
): { [k in keyof PickLiteral1Fields<schema>]: S.Schema.Type<PickLiteral1Fields<schema>[k]> } => {
  const picked = {}
  const ast = schema.ast
  if (isTypeLiteral(ast)) {
    ast.propertySignatures.forEach(prop => {
      if (isLiteral(prop.type) && prop.name !== '_tag') {
        // @ts-expect-error - Extract the literal value, not the schema
        picked[prop.name] = prop.type.literal
      }
    })
  }
  return picked as any
}

export const pickLiteral1Fields = <schema extends AnyStruct>(
  schema: schema,
): PickLiteral1Fields<schema> => {
  const picked = {}
  const ast = schema.ast
  if (isTypeLiteral(ast)) {
    ast.propertySignatures.forEach(prop => {
      if (isLiteral(prop.type)) {
        // @ts-expect-error
        picked[prop.name] = schema.fields[prop.name]
      }
    })
  }
  return picked as any
}

export type PickLiteral1Fields<$Schema extends AnyStruct> = {
  [k in keyof ExtractFields<$Schema>]: ExtractFields<$Schema>[k] extends S.Literal<infer __literals__ extends [string]>
    ? ExtractFields<$Schema>[k]
    : never
}

export type OmitLiteral1Fields<$Schema extends AnyStruct> = {
  [k in keyof ExtractFields<$Schema>]: ExtractFields<$Schema>[k] extends S.Literal<infer __literals__ extends [string]>
    ? never
    : ExtractFields<$Schema>[k]
}

export type GetLiteral1FieldsNames<$Schema extends AnyStruct> = keyof PickLiteral1Fields<$Schema>

export type ConstructorFieldsUsingOmitLiteral1Algo<$Schema extends AnyStruct> = $Schema extends
  S.Struct<infer __fields__> ? S.Struct.Constructor<Omit<__fields__, GetLiteral1FieldsNames<$Schema>>>
  : never

/**
 * Extract the literal value from a specific field in a schema.
 * Returns the exact literal type, not any.
 */
export const getValueAtField = <
  $Schema extends S.Schema.All,
  $FieldName extends string,
>(
  schema: $Schema,
  fieldName: $FieldName,
): GetFieldLiteralType<$Schema, $FieldName> => {
  const ast = schema.ast

  // Resolve any transformations to get to the struct
  let resolved = AST.resolve(ast)
  if (isTransformation(ast)) {
    resolved = AST.resolve(ast.to)
  }

  // Find the field with the given name
  if (isTypeLiteral(resolved)) {
    const field = resolved.propertySignatures.find(prop => prop.name === fieldName)
    if (field && isLiteral(field.type)) {
      return field.type.literal as GetFieldLiteralType<$Schema, $FieldName>
    }
  }

  throw new Error(`Field "${fieldName}" is not a literal or not found`)
}

/**
 * Extract the type of a literal field from a schema.
 */
export type GetFieldLiteralType<
  $Schema extends S.Schema.All,
  $FieldName extends string,
> = $Schema extends S.TaggedStruct<any, infer $Fields>
  ? $FieldName extends keyof $Fields
    ? $Fields[$FieldName] extends S.PropertySignature<any, infer $Type, any, any, any, any, any> ? $Type
    : $Fields[$FieldName] extends S.Literal<infer $Values> ? $Values extends readonly [infer $First, ...any[]] ? $First
      : never
    : never
  : never
  : never
