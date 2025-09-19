import { Match, ParseResult, Schema as S } from 'effect'
import * as Analyzer from '../utils/analyzer.ts'
import * as Extension from './extension.ts'

export const Encoded = S.String

export const Decoded = S.TaggedStruct('File', {
  name: S.String,
  extension: S.NullOr(Extension.Extension),
})

/**
 * Schema for file metadata.
 * Transforms between filename strings and structured data with name and extension.
 */
export const File = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      const filename = decoded.extension
        ? `${decoded.name}${decoded.extension}`
        : decoded.name
      return ParseResult.succeed(filename)
    },
    decode: (input, options, ast) => {
      return Match.value(Analyzer.analyzeEncodedLocation(input)).pipe(
        Match.tagsExhaustive({
          file: (file) => {
            // File should be just a filename, not a path
            if (file.path.length > 0 || file.path.some(s => s === '..')) {
              return ParseResult.fail(
                new ParseResult.Type(ast, input, `File should be a filename only, not a path`),
              )
            }

            // The analysis already extracts the extension but we need to validate it
            if (file.file.extension) {
              const extResult = Extension.decodeEither(file.file.extension)
              if (extResult._tag === 'Left') {
                return ParseResult.fail(
                  new ParseResult.Type(ast, input, `Invalid file extension: ${file.file.extension}`),
                )
              }
              return ParseResult.succeed(Decoded.make({
                name: file.file.name,
                extension: extResult.right,
              }))
            } else {
              return ParseResult.succeed(Decoded.make({
                name: file.file.name,
                extension: null,
              }))
            }
          },
          dir: () =>
            ParseResult.fail(
              new ParseResult.Type(ast, input, `File cannot be a directory`),
            ),
        }),
      )
    },
  },
)

/**
 * Type representing file metadata.
 */
export type File = typeof File.Type

/**
 * Create file metadata from structured data.
 *
 * @param input - Object with name and optional extension
 * @returns File metadata
 *
 * @example
 * ```ts
 * const file = make({ name: 'index', extension: Extension.decodeSync('.ts') })
 * const fileNoExt = make({ name: 'README', extension: null })
 * ```
 */
export const make = Decoded.make

/**
 * Create file metadata from a filename string.
 *
 * @param filename - The filename string
 * @returns File metadata
 *
 * @example
 * ```ts
 * const file = fromString('index.ts')
 * const fileNoExt = fromString('README')
 * ```
 */
export const fromString = (filename: string): File => decodeSync(filename)

/**
 * Type guard to check if a value is file metadata.
 */
export const is = S.is(File)

/**
 * Decode a value into file metadata.
 */
export const decode = S.decode(File)

/**
 * Synchronously decode a value into file metadata.
 */
export const decodeSync = S.decodeSync(File)

/**
 * Decode a value into file metadata, returning Either.
 */
export const decodeEither = S.decodeEither(File)

/**
 * Encode file metadata.
 */
export const encode = S.encode(File)

/**
 * Synchronously encode file metadata.
 */
export const encodeSync = S.encodeSync(File)
