import { Match, ParseResult, Schema as S } from 'effect'
import * as Segment from '../types/segment.js'
import * as Analyzer from '../utils/analyzer.ts'
import { encodedSeparator } from './utils.js'

export const Encoded = S.String

export const Decoded = S.TaggedStruct('PathAbs', {
  segments: S.Array(Segment.Segment).pipe(
    S.propertySignature,
    S.withConstructorDefault(() => []),
  ),
})

/**
 * Schema for absolute paths.
 * Absolute paths start with a forward slash.
 */
export const Abs = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      if (decoded.segments.length === 0) {
        return ParseResult.succeed('')
      }
      const path = decoded.segments.join(encodedSeparator)
      return ParseResult.succeed('/' + path)
    },
    decode: (input, options, ast) => {
      return Match.value(Analyzer.analyzeEncodedLocation(input)).pipe(
        Match.tagsExhaustive({
          file: (analysis) => {
            if (!analysis.isPathAbsolute) {
              return ParseResult.fail(
                new ParseResult.Type(ast, input, `Absolute paths must start with /`),
              )
            }
            // Include the filename and extension in path segments
            const filename = analysis.file.extension
              ? `${analysis.file.name}${analysis.file.extension}`
              : analysis.file.name
            const rawSegments = [...analysis.path, filename].filter(s => s !== '..')

            // Validate each segment
            const segments = rawSegments.map(s => Segment.make(s))
            return ParseResult.succeed(Decoded.make({ segments }))
          },
          dir: (analysis) => {
            if (!analysis.isPathAbsolute) {
              return ParseResult.fail(
                new ParseResult.Type(ast, input, `Absolute paths must start with /`),
              )
            }
            // For directories, path already contains all segments
            const rawSegments = analysis.path

            // Validate each segment
            const segments = rawSegments.filter(s => s !== '..').map(s => Segment.make(s))
            return ParseResult.succeed(Decoded.make({ segments }))
          },
        }),
      )
    },
  },
)

/**
 * Type representing an absolute path.
 */
export type Abs = typeof Abs.Type

/**
 * Create an absolute path from segments.
 */
export const make = Decoded.make

/**
 * Check if a value is an absolute path.
 */
export const is = S.is(Abs)

/**
 * Decode a value into an absolute path.
 */
export const decode = S.decode(Abs)

/**
 * Synchronously decode a value into an absolute path.
 */
export const decodeSync = S.decodeSync(Abs)

/**
 * Encode an absolute path to a string.
 */
export const encode = S.encode(Abs)

/**
 * Synchronously encode an absolute path to a string.
 */
export const encodeSync = S.encodeSync(Abs)
