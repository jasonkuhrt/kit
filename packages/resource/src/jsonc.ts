import { FileSystem } from '@effect/platform'
import { Jsonc } from '@kouka/jsonc'
import { Effect, ParseResult, Schema } from 'effect'
import { type Codec, createResource, EncodeError, ParseError, type Resource } from './resource.js'

export type { Resource } from './resource.js'

/**
 * JSONC codec for parsing JSON with comments
 */
export const jsoncCodec = <T>(): Codec<T> => ({
  decode: (content: string, resource: string, path: string) =>
    Effect.gen(function*() {
      const parsed = yield* Schema.decodeUnknown(Jsonc.parseJsonc())(content).pipe(
        Effect.mapError((error) =>
          new ParseError({
            path,
            resource,
            message: `Failed to parse JSONC: ${ParseResult.TreeFormatter.formatErrorSync(error)}`,
          })
        ),
      )
      return parsed as T
    }),
  encode: (value: T, resource: string) =>
    Effect.try({
      try: () => JSON.stringify(value, null, 2),
      catch: (error) =>
        new EncodeError({
          resource,
          message: `Failed to stringify JSON: ${error instanceof Error ? error.message : String(error)}`,
        }),
    }),
})

/**
 * JSONC codec with schema validation
 */
export const schemaJsoncCodec = <S extends Schema.Schema<any, any>>(
  schema: S,
): Codec<Schema.Schema.Type<S>, Schema.Schema.Context<S>> => ({
  decode: (content: string, resource: string, path: string) =>
    Effect.gen(function*() {
      // Compose parseJsonc with the provided schema
      const jsoncSchema = Schema.compose(Jsonc.parseJsonc(), schema)
      return yield* Schema.decodeUnknown(jsoncSchema)(content).pipe(
        Effect.mapError((error) =>
          new ParseError({
            path,
            resource,
            message: `Schema validation failed: ${ParseResult.TreeFormatter.formatErrorSync(error)}`,
          })
        ),
      )
    }),
  encode: (value: Schema.Schema.Type<S>, resource: string) =>
    Effect.gen(function*() {
      const encoded = yield* Schema.encode(schema)(value).pipe(
        Effect.mapError((error) =>
          new EncodeError({
            resource,
            message: `Schema encoding failed: ${ParseResult.TreeFormatter.formatErrorSync(error)}`,
          })
        ),
      )
      return JSON.stringify(encoded, null, 2)
    }),
})

/**
 * Create a JSONC (JSON with Comments) resource with Schema validation
 */
export const createSchemaJsoncResource = <S extends Schema.Schema<any, any>>(
  filename: string,
  schema: S,
  emptyValue: Schema.Schema.Type<S>,
): Resource<Schema.Schema.Type<S>, FileSystem.FileSystem | Schema.Schema.Context<S>> =>
  createResource(filename, schemaJsoncCodec(schema), emptyValue)

/**
 * Create a JSONC (JSON with Comments) resource without schema validation
 */
export const createJsoncResource = <T>(
  filename: string,
  emptyValue: T,
): Resource<T> => createResource(filename, jsoncCodec<T>(), emptyValue)
