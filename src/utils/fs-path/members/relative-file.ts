import { ParseResult, Schema as S } from 'effect'
import * as Segment from '../types/segment.ts'
import * as Target from '../types/target.ts'

const Encoded = S.String

const Decoded = S.TaggedStruct('PathRelativeFile', {
  segments: S.Array(Segment.Segment),
  target: Target.TargetFile,
})

/**
 * Schema for relative file paths.
 * Relative file paths must not start with a leading slash and represent a file.
 */
export const RelativeFile = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      const path = decoded.segments.join(Segment.SEPARATOR)
      return ParseResult.succeed(path)
    },
    decode: (input, options, ast) => {
      if (input.startsWith('/')) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, `Relative paths must not start with /`),
        )
      }

      if (input.endsWith('/')) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, `File paths cannot end with /`),
        )
      }

      if (input === '') {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, `File path cannot be empty`),
        )
      }

      // Strip ./ prefix if present
      let normalizedInput = input
      if (input.startsWith('./')) {
        normalizedInput = input.slice(2)
      }

      const segments = normalizedInput.split(Segment.SEPARATOR).filter(s => s).map(s => Segment.make(s))

      if (segments.length === 0) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, `File path must have at least one segment`),
        )
      }

      return ParseResult.succeed(Decoded.make({
        segments,
        target: 'file' as Target.TargetFile,
      }))
    },
  },
)

/**
 * Type representing a relative file path.
 */
export type RelativeFile = typeof RelativeFile.Type

/**
 * Create a relative file path from segments.
 *
 * @param input - Object with segments array and target
 * @returns A relative file path
 *
 * @example
 * ```ts
 * const path = make({
 *   segments: [Segment.make('src'), Segment.make('utils'), Segment.make('file.js')],
 *   target: 'file' as Target.TargetFile
 * })
 * // Represents: src/utils/file.ts
 * ```
 */
export const make = Decoded.make

/**
 * Check if a value is a relative file path.
 *
 * @param value - The value to check
 * @returns True if the value is a relative file path
 */
export const is = S.is(RelativeFile)

/**
 * Decode a value into a relative file path.
 */
export const decode = S.decode(RelativeFile)

/**
 * Synchronously decode a value into a relative file path.
 */
export const decodeSync = S.decodeSync(RelativeFile)

/**
 * Encode a relative file path to a string.
 */
export const encode = S.encode(RelativeFile)

/**
 * Synchronously encode a relative file path to a string.
 */
export const encodeSync = S.encodeSync(RelativeFile)

/**
 * Equivalence for relative file paths.
 */
export const equivalence = S.equivalence(RelativeFile)
