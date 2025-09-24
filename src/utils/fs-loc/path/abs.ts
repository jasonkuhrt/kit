import { Match, ParseResult, Schema as S } from 'effect'
import { Analyzer } from '../codec-string/$.ts'
import * as Segment from '../types/segment.js'
import { stringSeparator } from './constants.ts'

export const Encoded = S.String

/**
 * Class representing an absolute path.
 * Absolute paths start with a forward slash.
 */
export class Abs extends S.TaggedClass<Abs>()('PathAbs', {
  segments: S.Array(Segment.Segment).pipe(
    S.propertySignature,
    S.withConstructorDefault(() => []),
  ),
}) {
  static is = S.is(Abs)

  /**
   * Check if this is the root path.
   */
  get isRoot(): boolean {
    return this.segments.length === 0
  }

  /**
   * Schema for transforming between string and Abs class.
   */
  static String = S.transformOrFail(
    S.String,
    Abs,
    {
      strict: true,
      encode: (decoded) => {
        if (decoded.segments.length === 0) {
          return ParseResult.succeed('')
        }
        const path = decoded.segments.join(stringSeparator)
        return ParseResult.succeed('/' + path)
      },
      decode: (input, options, ast) => {
        return Match.value(Analyzer.analyze(input)).pipe(
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
              return ParseResult.succeed(Abs.make({ segments }))
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
              return ParseResult.succeed(Abs.make({ segments }))
            },
          }),
        )
      },
    },
  )
}
