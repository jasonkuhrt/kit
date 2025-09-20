import { ParseResult, Schema as S } from 'effect'
import * as LocLoose from '../fs-loc-loose.js'
import { Path } from '../path/$.js'
import * as File from '../types/file.js'

const Encoded = S.String

const Decoded = S.TaggedStruct('LocAbsFile', {
  path: Path.Abs.Decoded.pipe(
    S.propertySignature,
    S.withConstructorDefault(() => Path.Abs.Decoded.make({ segments: [] })),
  ),
  file: File.Decoded,
})

/**
 * Schema for absolute file locations.
 * Absolute file paths must start with a leading slash and represent a file.
 */
export const AbsFile = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      const pathString = decoded.path.segments.join('/')
      const fileString = File.encodeSync(decoded.file)
      const encoded = pathString.length > 0 ? `/${pathString}/${fileString}` : `/${fileString}`
      return ParseResult.succeed(encoded)
    },
    decode: (input, options, ast) => {
      // First decode with LocLoose
      const looseResult = LocLoose.decodeSync(input)

      // Validate it's an absolute file
      if (looseResult.path._tag !== 'PathAbs') {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Absolute paths must start with /'),
        )
      }
      if (!looseResult.file) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Expected a file path, got a directory or root path'),
        )
      }

      // Valid - return as AbsFile
      return ParseResult.succeed(
        Decoded.make({
          path: looseResult.path as typeof Path.Abs.Decoded.Type,
          file: looseResult.file,
        }),
      )
    },
  },
)

/**
 * Type representing an absolute file location.
 */
export type AbsFile = typeof AbsFile.Type

/**
 * Create an absolute file location.
 */
export const make = Decoded.make

/**
 * Check if a value is an absolute file location.
 */
export const is = S.is(AbsFile)

/**
 * Decode a value into an absolute file location.
 */
export const decode = S.decode(AbsFile)

/**
 * Synchronously decode a value into an absolute file location.
 */
export const decodeSync = S.decodeSync(AbsFile)

/**
 * Encode an absolute file location to a string.
 */
export const encode = S.encode(AbsFile)

/**
 * Synchronously encode an absolute file location to a string.
 */
export const encodeSync = S.encodeSync(AbsFile)

/**
 * Equivalence for absolute file locations.
 */
export const equivalence = S.equivalence(AbsFile)
