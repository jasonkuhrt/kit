import { FileSystem } from '@effect/platform'
import { Effect, Option, ParseResult, Schema } from 'effect'
import * as path from 'node:path'

/**
 * Errors that can occur during resource operations
 */
export class FileNotFound extends Schema.TaggedError<FileNotFound>()('FileNotFound', {
  path: Schema.String,
  resource: Schema.String,
  message: Schema.String,
}) {}

export class ReadError extends Schema.TaggedError<ReadError>()('ReadError', {
  path: Schema.String,
  resource: Schema.String,
  message: Schema.String,
}) {}

export class WriteError extends Schema.TaggedError<WriteError>()('WriteError', {
  path: Schema.String,
  resource: Schema.String,
  message: Schema.String,
}) {}

export class ParseError extends Schema.TaggedError<ParseError>()('ParseError', {
  path: Schema.String,
  resource: Schema.String,
  message: Schema.String,
}) {}

export class EncodeError extends Schema.TaggedError<EncodeError>()('EncodeError', {
  resource: Schema.String,
  message: Schema.String,
}) {}

export type ResourceError = FileNotFound | ReadError | WriteError | ParseError | EncodeError

/**
 * A Resource represents a configuration file that can be read and written
 * with a specific codec for encoding/decoding
 */
export interface Resource<T = unknown, R = FileSystem.FileSystem> {
  /**
   * Read the resource from disk
   */
  read: (dirPath: string) => Effect.Effect<Option.Option<T>, ResourceError, R>

  /**
   * Write the resource to disk
   */
  write: (value: T, dirPath: string) => Effect.Effect<void, ResourceError, R>

  /**
   * Read the resource or return empty value if not found
   */
  readOrEmpty: (dirPath: string) => Effect.Effect<T, ResourceError, R>
}

/**
 * Codec for encoding/decoding resource content
 */
export interface Codec<T, R = never> {
  decode: (content: string, resource: string, path: string) => Effect.Effect<T, ParseError, R>
  encode: (value: T, resource: string) => Effect.Effect<string, EncodeError, R>
}

/**
 * JSON codec for parsing and stringifying JSON
 */
export const jsonCodec = <T>(): Codec<T> => ({
  decode: (content: string, resource: string, path: string) =>
    Effect.try({
      try: () => JSON.parse(content) as T,
      catch: (error) =>
        new ParseError({
          path,
          resource,
          message: `Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`,
        }),
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
 * Text codec for plain text files
 */
export const textCodec: Codec<string> = {
  decode: (content: string) => Effect.succeed(content) as Effect.Effect<string, ParseError>,
  encode: (value: string) => Effect.succeed(value) as Effect.Effect<string, EncodeError>,
}

/**
 * Create a resource with a specific codec
 */
export const createResource = <T, R = never>(
  filename: string,
  codec: Codec<T, R>,
  emptyValue: T,
): Resource<T, FileSystem.FileSystem | R> => ({
  read: (dirPath: string) =>
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      const filePath = path.join(dirPath, filename)
      const exists = yield* fs.exists(filePath).pipe(
        Effect.mapError((error) =>
          new ReadError({
            path: filePath,
            resource: filename,
            message: `Failed to check if resource exists: ${(error as any).message || String(error)}`,
          })
        ),
      )

      if (!exists) return Option.none()

      const content = yield* fs.readFileString(filePath).pipe(
        Effect.mapError((error) =>
          new ReadError({
            path: filePath,
            resource: filename,
            message: `Failed to read file: ${(error as any).message || String(error)}`,
          })
        ),
      )

      const decoded = yield* codec.decode(content, filename, filePath)

      return Option.some(decoded)
    }),

  write: (value: T, dirPath: string) =>
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      const filePath = path.join(dirPath, filename)
      const parentDir = path.dirname(filePath)

      const content = yield* codec.encode(value, filename)

      yield* fs.makeDirectory(parentDir, { recursive: true }).pipe(
        Effect.mapError((error) =>
          new WriteError({
            path: filePath,
            resource: filename,
            message: `Failed to create directory: ${(error as any).message || String(error)}`,
          })
        ),
      )

      yield* fs.writeFileString(filePath, content).pipe(
        Effect.mapError((error) =>
          new WriteError({
            path: filePath,
            resource: filename,
            message: `Failed to write file: ${(error as any).message || String(error)}`,
          })
        ),
      )
    }),

  readOrEmpty: (dirPath: string) =>
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      const filePath = path.join(dirPath, filename)
      const exists = yield* fs.exists(filePath).pipe(
        Effect.mapError((error) =>
          new ReadError({
            path: filePath,
            resource: filename,
            message: `Failed to check if resource exists: ${(error as any).message || String(error)}`,
          })
        ),
      )

      if (!exists) return emptyValue

      const content = yield* fs.readFileString(filePath).pipe(
        Effect.catchAll(() => Effect.succeed('')),
      )

      if (content === '') return emptyValue

      return yield* codec.decode(content, filename, filePath).pipe(
        Effect.catchAll(() => Effect.succeed(emptyValue)),
      )
    }),
})

/**
 * Create a JSON resource with a specific filename
 */
export const createJsonResource = <T>(
  filename: string,
  emptyValue: T,
): Resource<T> => createResource(filename, jsonCodec<T>(), emptyValue)

/**
 * Schema codec for parsing with validation
 */
export const schemaCodec = <S extends Schema.Schema<any, any>>(
  schema: S,
): Codec<Schema.Schema.Type<S>, Schema.Schema.Context<S>> => ({
  decode: (content: string, resource: string, path: string) =>
    Effect.gen(function*() {
      const parsed = yield* Effect.try({
        try: () => JSON.parse(content),
        catch: (error) =>
          new ParseError({
            path,
            resource,
            message: `Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`,
          }),
      })

      return yield* Schema.decodeUnknown(schema)(parsed).pipe(
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

      return yield* Effect.try({
        try: () => JSON.stringify(encoded, null, 2),
        catch: (error) =>
          new EncodeError({
            resource,
            message: `Failed to stringify JSON: ${error instanceof Error ? error.message : String(error)}`,
          }),
      })
    }),
})

/**
 * Create a JSON resource with Effect Schema validation
 */
export const createSchemaResource = <S extends Schema.Schema<any, any>>(
  filename: string,
  schema: S,
  emptyValue: Schema.Schema.Type<S>,
): Resource<Schema.Schema.Type<S>, FileSystem.FileSystem | Schema.Schema.Context<S>> =>
  createResource(filename, schemaCodec(schema), emptyValue)

/**
 * Create a text resource with a specific filename
 */
export const createTextResource = (
  filename: string,
  emptyValue = '',
): Resource<string> => createResource(filename, textCodec, emptyValue)

//
// Type guards for error types
//

export const isFileNotFound = (error: ResourceError): error is FileNotFound => error._tag === 'FileNotFound'

export const isReadError = (error: ResourceError): error is ReadError => error._tag === 'ReadError'

export const isWriteError = (error: ResourceError): error is WriteError => error._tag === 'WriteError'

export const isParseError = (error: ResourceError): error is ParseError => error._tag === 'ParseError'

export const isEncodeError = (error: ResourceError): error is EncodeError => error._tag === 'EncodeError'

export const isResourceError = (u: unknown): u is ResourceError =>
  typeof u === 'object' && u !== null && '_tag' in u
  && (u._tag === 'FileNotFound' || u._tag === 'ReadError'
    || u._tag === 'WriteError' || u._tag === 'ParseError' || u._tag === 'EncodeError')
