import { Match, ParseResult, Schema as S } from 'effect'
import { Analyzer } from '../codec-string/$.ts'
import * as Segment from '../types/segment.js'
import { stringSeparator } from './constants.ts'

/**
 * Class representing a relative path.
 * Relative paths do not start with a forward slash.
 */
export class Rel extends S.TaggedClass<Rel>()('PathRelative', {
  segments: S.Array(Segment.Segment).pipe(
    S.propertySignature,
    S.withConstructorDefault(() => []),
  ),
}) {
  static is = S.is(Rel)

  static String = S.transformOrFail(
    S.String,
    Rel,
    {
      strict: true,
      encode: (decoded) => {
        const path = decoded.segments.join(stringSeparator)
        return ParseResult.succeed('./' + path)
      },
      decode: (input, options, ast) => {
        return Match.value(Analyzer.analyze(input)).pipe(
          Match.tagsExhaustive({
            file: (analysis) => {
              if (analysis.isPathAbsolute) {
                return ParseResult.fail(
                  new ParseResult.Type(ast, input, `Relative paths must not start with /`),
                )
              }
              // Include the filename and extension in path segments
              const filename = analysis.file.extension
                ? `${analysis.file.stem}${analysis.file.extension}`
                : analysis.file.stem
              const rawSegments = [...analysis.path, filename]

              // Validate each segment
              const segments = rawSegments.map(s => Segment.make(s))
              return ParseResult.succeed(Rel.make({ segments }))
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
              return ParseResult.succeed(Rel.make({ segments }))
            },
          }),
        )
      },
    },
  )
}
