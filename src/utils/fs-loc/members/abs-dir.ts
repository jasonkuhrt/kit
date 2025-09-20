import { ParseResult, Schema as S } from 'effect'
import * as LocLoose from '../fs-loc-loose.js'
import { Path } from '../path/$.js'

const Encoded = S.String

const Decoded = S.TaggedStruct('LocAbsDir', {
  path: Path.Abs.Decoded.pipe(
    S.propertySignature,
    S.withConstructorDefault(() => Path.Abs.Decoded.make({ segments: [] })),
  ),
})

/**
 * Schema for absolute directory locations.
 * Absolute directory paths must start with a leading slash and represent a directory.
 */
export const AbsDir = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      const pathString = decoded.path.segments.join('/')
      // Root is just "/", others end with trailing slash
      const encoded = pathString.length === 0 ? '/' : `/${pathString}/`
      return ParseResult.succeed(encoded)
    },
    decode: (input, options, ast) => {
      // First decode with LocLoose
      const looseResult = LocLoose.decodeSync(input)

      // Validate it's an absolute directory
      if (looseResult.path._tag !== 'PathAbs') {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Absolute paths must start with /'),
        )
      }
      if (looseResult.file) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Expected a directory path, got a file path'),
        )
      }

      // Valid - return as AbsDir
      return ParseResult.succeed(
        Decoded.make({
          path: looseResult.path as typeof Path.Abs.Decoded.Type,
        }),
      )
    },
  },
)

/**
 * Type representing an absolute directory location.
 */
export type AbsDir = typeof AbsDir.Type

/**
 * Create an absolute directory location.
 */
export const make = Decoded.make

/**
 * Check if a value is an absolute directory location.
 */
export const is = S.is(AbsDir)

/**
 * Decode a value into an absolute directory location.
 */
export const decode = S.decode(AbsDir)

/**
 * Synchronously decode a value into an absolute directory location.
 */
export const decodeSync = S.decodeSync(AbsDir)

/**
 * Encode an absolute directory location to a string.
 */
export const encode = S.encode(AbsDir)

/**
 * Synchronously encode an absolute directory location to a string.
 */
export const encodeSync = S.encodeSync(AbsDir)

/**
 * Equivalence for absolute directory locations.
 */
export const equivalence = S.equivalence(AbsDir)
