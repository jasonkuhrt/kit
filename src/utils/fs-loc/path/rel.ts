import { Match, ParseResult, Schema as S } from 'effect'
import * as Segment from '../types/segment.js'
import * as Analyzer from '../utils/analyzer.ts'

const Encoded = S.String

export const Decoded = S.TaggedStruct('PathRelative', {
  segments: S.Array(Segment.Segment).pipe(
    S.propertySignature,
    S.withConstructorDefault(() => []),
  ),
})

/**
 * Schema for relative paths.
 * Relative paths do not start with a forward slash.
 */
export const Rel = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      const path = decoded.segments.join('/')
      return ParseResult.succeed('./' + path)
    },
    decode: (input, options, ast) => {
      return Match.value(Analyzer.analyzeEncodedLocation(input)).pipe(
        Match.tagsExhaustive({
          file: (analysis) => {
            if (analysis.isPathAbsolute) {
              return ParseResult.fail(
                new ParseResult.Type(ast, input, `Relative paths must not start with /`),
              )
            }
            // Include the filename and extension in path segments
            const filename = analysis.file.extension
              ? `${analysis.file.name}${analysis.file.extension}`
              : analysis.file.name
            const rawSegments = [...analysis.path, filename]

            // Validate each segment
            const segments = rawSegments.map(s => Segment.make(s))
            return ParseResult.succeed(Decoded.make({ segments }))
          },
          dir: (analysis) => {
            if (analysis.isPathAbsolute) {
              return ParseResult.fail(
                new ParseResult.Type(ast, input, `Relative paths must not start with /`),
              )
            }
            // For directories, path already contains all segments
            const rawSegments = analysis.path

            // Validate each segment
            const segments = rawSegments.map(s => Segment.make(s))
            return ParseResult.succeed(Decoded.make({ segments }))
          },
        }),
      )
    },
  },
)

/**
 * Type representing a relative path.
 */
export type Rel = typeof Rel.Type

/**
 * Create a relative path from segments.
 */
export const make = Decoded.make

/**
 * Check if a value is a relative path.
 */
export const is = S.is(Rel)

/**
 * Decode a value into a relative path.
 */
export const decode = S.decode(Rel)

/**
 * Synchronously decode a value into a relative path.
 */
export const decodeSync = S.decodeSync(Rel)

/**
 * Encode a relative path to a string.
 */
export const encode = S.encode(Rel)

/**
 * Synchronously encode a relative path to a string.
 */
export const encodeSync = S.encodeSync(Rel)
