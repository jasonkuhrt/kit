import { ParseResult, Schema as S } from 'effect'
import * as Segment from '../types/segment.ts'
import * as Target from '../types/target.ts'

const ENCODED_PREFIX = '/'

const Decoded = S.TaggedStruct('PathAbsoluteDir', {
  segments: S.Array(Segment.Segment),
  target: Target.TargetDir,
})

const Encoded = S.String

/**
 * Schema for absolute directory paths.
 * Absolute directory paths must start with a forward slash and represent a directory.
 */
export const AbsoluteDir = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      // Root directory is just "/"
      if (decoded.segments.length === 0) {
        return ParseResult.succeed(ENCODED_PREFIX)
      }
      // Non-root directories end with "/"
      const path = ENCODED_PREFIX + decoded.segments.join(Segment.SEPARATOR) + '/'
      return ParseResult.succeed(path)
    },
    decode: (input, options, ast) => {
      if (!input.startsWith(ENCODED_PREFIX)) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, `Absolute paths must start with ${ENCODED_PREFIX}`),
        )
      }

      // Root directory
      if (input === ENCODED_PREFIX) {
        return ParseResult.succeed(Decoded.make({
          segments: [],
          target: 'dir' as Target.TargetDir,
        }))
      }

      // Must end with "/" for non-root directories
      if (!input.endsWith('/')) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, `Directory paths must end with /`),
        )
      }

      // Remove leading and trailing slashes for splitting
      const pathWithoutSlashes = input.slice(1, -1)
      const segments = pathWithoutSlashes.split(Segment.SEPARATOR).map(s => Segment.make(s))

      return ParseResult.succeed(Decoded.make({
        segments,
        target: 'dir' as Target.TargetDir,
      }))
    },
  },
)

/**
 * Type representing an absolute directory path.
 */
export type AbsoluteDir = typeof AbsoluteDir.Type

/**
 * Create an absolute directory path from segments.
 *
 * @param input - Object with segments array and target
 * @returns An absolute directory path
 *
 * @example
 * ```ts
 * const path = make({
 *   segments: [Segment.make('home'), Segment.make('user')],
 *   target: 'dir' as Target.TargetDir
 * })
 * // Represents: /home/user/
 * ```
 */
export const make = Decoded.make

/**
 * Check if a value is an absolute directory path.
 *
 * @param value - The value to check
 * @returns True if the value is an absolute directory path
 */
export const is = S.is(AbsoluteDir)

/**
 * Decode a value into an absolute directory path.
 */
export const decode = S.decode(AbsoluteDir)

/**
 * Synchronously decode a value into an absolute directory path.
 */
export const decodeSync = S.decodeSync(AbsoluteDir)

/**
 * Encode an absolute directory path to a string.
 */
export const encode = S.encode(AbsoluteDir)

/**
 * Synchronously encode an absolute directory path to a string.
 */
export const encodeSync = S.encodeSync(AbsoluteDir)

/**
 * Equivalence for absolute directory paths.
 */
export const equivalence = S.equivalence(AbsoluteDir)
