import { ParseResult, Schema as S } from 'effect'
import type { ParseOptions } from 'effect/SchemaAST'
import * as LocLoose from '../fs-loc-loose.js'
import { Path } from '../path/$.js'
import * as File from '../types/file.js'

const Encoded = S.String

const Decoded = S.TaggedStruct('LocRelFile', {
  path: Path.Rel.Decoded.pipe(
    S.propertySignature,
    S.withConstructorDefault(() => Path.Rel.Decoded.make({ segments: [] })),
  ),
  file: File.Decoded,
})

/**
 * Schema for relative file locations.
 * Relative file paths must not start with a leading slash and represent a file.
 */
export const RelFile = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      const pathString = decoded.path.segments.join('/')
      const fileString = File.encodeSync(decoded.file)
      const encoded = pathString.length > 0 ? `./${pathString}/${fileString}` : `./${fileString}`
      return ParseResult.succeed(encoded)
    },
    decode: (input, options, ast) => {
      // First decode with LocLoose
      const looseResult = LocLoose.decodeSync(input)

      // Validate it's a relative file
      if (looseResult.path._tag !== 'PathRelative') {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Relative paths must not start with /'),
        )
      }
      if (!looseResult.file) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Expected a file path, got a directory or root path'),
        )
      }

      // Valid - return as RelFile
      return ParseResult.succeed(
        Decoded.make({
          path: looseResult.path as typeof Path.Rel.Decoded.Type,
          file: looseResult.file,
        }),
      )
    },
  },
)

/**
 * Type representing a relative file location.
 */
export type RelFile = typeof RelFile.Type

/**
 * Create a relative file location.
 */
export const make = Decoded.make

/**
 * Check if a value is a relative file location.
 */
export const is = S.is(RelFile)

/**
 * Decode a value into a relative file location.
 */
export const decode = S.decode(RelFile)

/**
 * Synchronously decode a value into a relative file location.
 */
export const decodeSync = S.decodeSync(RelFile)

/**
 * Encode a relative file location to a string.
 */
export const encode = S.encode(RelFile)

/**
 * Synchronously encode a relative file location to a string.
 */
export const encodeSync = S.encodeSync(RelFile)

/**
 * Equivalence for relative file locations.
 */
export const equivalence = S.equivalence(RelFile)

/**
 * Assert that a value is a relative file location.
 * @throws {ParseError} if the value is not a relative file location
 */
export const assert: (input: unknown, options?: ParseOptions) => asserts input is RelFile = S.asserts(RelFile)
