import { ParseResult, Schema as S } from 'effect'
import * as LocLoose from '../fs-loc-loose.js'
import { Path } from '../path/$.js'

const Encoded = S.String

const Decoded = S.TaggedStruct('LocRelDir', {
  path: Path.Rel.Decoded,
})

/**
 * Schema for relative directory locations.
 * Relative directory paths must not start with a leading slash and represent a directory.
 */
export const RelDir = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      const pathString = decoded.path.segments.join('/')
      // Always end directories with trailing slash to distinguish from files
      const encoded = pathString.length > 0 ? `./${pathString}/` : './'
      return ParseResult.succeed(encoded)
    },
    decode: (input, options, ast) => {
      // First decode with LocLoose
      const looseResult = LocLoose.decodeSync(input)

      // Validate it's a relative directory
      if (looseResult.path._tag !== 'PathRelative') {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Relative paths must not start with /'),
        )
      }
      if (looseResult.file) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Expected a directory path, got a file path'),
        )
      }

      // Valid - return as RelDir
      return ParseResult.succeed(
        Decoded.make({
          path: looseResult.path as typeof Path.Rel.Decoded.Type,
        }),
      )
    },
  },
)

/**
 * Type representing a relative directory location.
 */
export type RelDir = typeof RelDir.Type

/**
 * Create a relative directory location.
 */
export const make = Decoded.make

/**
 * Check if a value is a relative directory location.
 */
export const is = S.is(RelDir)

/**
 * Decode a value into a relative directory location.
 */
export const decode = S.decode(RelDir)

/**
 * Synchronously decode a value into a relative directory location.
 */
export const decodeSync = S.decodeSync(RelDir)

/**
 * Encode a relative directory location to a string.
 */
export const encode = S.encode(RelDir)

/**
 * Synchronously encode a relative directory location to a string.
 */
export const encodeSync = S.encodeSync(RelDir)

/**
 * Equivalence for relative directory locations.
 */
export const equivalence = S.equivalence(RelDir)
