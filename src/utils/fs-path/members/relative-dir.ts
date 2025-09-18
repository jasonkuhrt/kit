import { ParseResult, Schema as S } from 'effect'
import * as Segment from '../types/segment.ts'
import * as Target from '../types/target.ts'

const Encoded = S.String

const Decoded = S.TaggedStruct('PathRelativeDir', {
  segments: S.Array(Segment.Segment),
  target: Target.TargetDir,
})

/**
 * Schema for relative directory paths.
 * Relative directory paths must not start with a leading slash and represent a directory.
 */
export const RelativeDir = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      if (decoded.segments.length === 0) {
        // Current directory
        return ParseResult.succeed('./')
      }
      const path = decoded.segments.join(Segment.SEPARATOR) + '/'
      return ParseResult.succeed(path)
    },
    decode: (input, options, ast) => {
      if (input.startsWith('/')) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, `Relative paths must not start with /`),
        )
      }

      // Current directory representations
      if (input === '.' || input === './') {
        return ParseResult.succeed(Decoded.make({
          segments: [],
          target: 'dir' as Target.TargetDir,
        }))
      }

      // Must end with "/" for directories (except special cases above)
      if (!input.endsWith('/')) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, `Directory paths must end with /`),
        )
      }

      // Strip ./ prefix if present and trailing /
      let normalizedInput = input
      if (input.startsWith('./')) {
        normalizedInput = input.slice(2)
      }
      // Remove trailing slash for splitting
      normalizedInput = normalizedInput.slice(0, -1)

      const segments = normalizedInput.split(Segment.SEPARATOR).filter(s => s).map(s => Segment.make(s))

      return ParseResult.succeed(Decoded.make({
        segments,
        target: 'dir' as Target.TargetDir,
      }))
    },
  },
)

/**
 * Type representing a relative directory path.
 */
export type RelativeDir = typeof RelativeDir.Type

/**
 * Create a relative directory path from segments.
 *
 * @param input - Object with segments array and target
 * @returns A relative directory path
 *
 * @example
 * ```ts
 * const path = make({
 *   segments: [Segment.make('src'), Segment.make('utils')],
 *   target: 'dir' as Target.TargetDir
 * })
 * // Represents: src/utils/
 * ```
 */
export const make = Decoded.make

/**
 * Check if a value is a relative directory path.
 *
 * @param value - The value to check
 * @returns True if the value is a relative directory path
 */
export const is = S.is(RelativeDir)

/**
 * Decode a value into a relative directory path.
 */
export const decode = S.decode(RelativeDir)

/**
 * Synchronously decode a value into a relative directory path.
 */
export const decodeSync = S.decodeSync(RelativeDir)

/**
 * Encode a relative directory path to a string.
 */
export const encode = S.encode(RelativeDir)

/**
 * Synchronously encode a relative directory path to a string.
 */
export const encodeSync = S.encodeSync(RelativeDir)

/**
 * Equivalence for relative directory paths.
 */
export const equivalence = S.equivalence(RelativeDir)
