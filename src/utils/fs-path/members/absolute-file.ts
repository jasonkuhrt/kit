import { ParseResult, Schema as S } from 'effect'
import * as Segment from '../types/segment.ts'
import * as Target from '../types/target.ts'

const ENCODED_PREFIX = '/'

const Decoded = S.TaggedStruct('PathAbsoluteFile', {
  segments: S.Array(Segment.Segment),
  target: Target.TargetFile,
})

const Encoded = S.String

/**
 * Schema for absolute file paths.
 * Absolute file paths must start with a forward slash and represent a file.
 */
export const AbsoluteFile = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      const path = ENCODED_PREFIX + decoded.segments.join(Segment.SEPARATOR)
      return ParseResult.succeed(path)
    },
    decode: (input, options, ast) => {
      if (!input.startsWith(ENCODED_PREFIX)) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, `Absolute paths must start with ${ENCODED_PREFIX}`),
        )
      }

      // Cannot be just "/" or end with "/"
      if (input === ENCODED_PREFIX || input.endsWith('/')) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, `File paths cannot end with /`),
        )
      }

      const pathWithoutPrefix = input.slice(1) // Remove leading slash for splitting
      const segments = pathWithoutPrefix.split(Segment.SEPARATOR).map(s => Segment.make(s))

      return ParseResult.succeed(Decoded.make({
        segments,
        target: 'file' as Target.TargetFile,
      }))
    },
  },
)

/**
 * Type representing an absolute file path.
 */
export type AbsoluteFile = typeof AbsoluteFile.Type

/**
 * Create an absolute file path from segments.
 *
 * @param input - Object with segments array and target
 * @returns An absolute file path
 *
 * @example
 * ```ts
 * const path = make({
 *   segments: [Segment.make('home'), Segment.make('user'), Segment.make('file.js')],
 *   target: 'file' as Target.TargetFile
 * })
 * // Represents: /home/user/file.ts
 * ```
 */
export const make = Decoded.make

/**
 * Check if a value is an absolute file path.
 *
 * @param value - The value to check
 * @returns True if the value is an absolute file path
 */
export const is = S.is(AbsoluteFile)

/**
 * Decode a value into an absolute file path.
 */
export const decode = S.decode(AbsoluteFile)

/**
 * Synchronously decode a value into an absolute file path.
 */
export const decodeSync = S.decodeSync(AbsoluteFile)

/**
 * Encode an absolute file path to a string.
 */
export const encode = S.encode(AbsoluteFile)

/**
 * Synchronously encode an absolute file path to a string.
 */
export const encodeSync = S.encodeSync(AbsoluteFile)

/**
 * Equivalence for absolute file paths.
 */
export const equivalence = S.equivalence(AbsoluteFile)
