import { Match, ParseResult, Schema as S } from 'effect'
import { Analyzer } from './codec-string/$.js'
import { Abs, Rel } from './path/$$.js'
import { File } from './types/file.js'

const Encoded = S.String

/**
 * Class representing a loose filesystem location.
 */
export class FsLocLooseClass extends S.TaggedClass<FsLocLooseClass>()('FsLocLoose', {
  path: S.Union(Abs, Rel),
  file: S.NullOr(File),
}) {
  static is = S.is(FsLocLooseClass)
}

// Keep Decoded export for backward compatibility
export const Decoded = FsLocLooseClass

/**
 * Schema for parsing location strings without enforcing strict type constraints.
 * Unlike the strict location types, this allows any combination of path and file.
 * Useful when you need to parse filesystem locations without knowing their specific type.
 */
export const LocLoose = S.transformOrFail(
  Encoded,
  FsLocLooseClass,
  {
    strict: true,
    encode: (decoded) => {
      // Since decoded is the class instance, we need to encode the path properly
      const pathIsAbs = decoded.path._tag === 'PathAbs'
      const pathSegments = decoded.path.segments
      let pathEncoded: string
      if (pathIsAbs) {
        pathEncoded = pathSegments.length === 0 ? '/' : '/' + pathSegments.join('/')
      } else {
        pathEncoded = './' + pathSegments.join('/')
      }

      const fileEncoded = decoded.file ? `${decoded.file.name}${decoded.file.extension || ''}` : ''
      if (!fileEncoded) return ParseResult.succeed(pathEncoded)
      const pathEncodedForJoin = pathEncoded.endsWith('/') ? pathEncoded.slice(0, -1) : pathEncoded
      const encoded = pathEncodedForJoin + '/' + fileEncoded
      return ParseResult.succeed(encoded)
    },
    decode: (input) => {
      return Match.value(Analyzer.analyze(input)).pipe(
        Match.tagsExhaustive({
          file: (analysis) => {
            const path = analysis.isPathAbsolute
              ? new Abs({ segments: analysis.path })
              : new Rel({ segments: analysis.path })

            return ParseResult.succeed(
              FsLocLooseClass.make({
                path,
                file: new File({
                  name: analysis.file.name,
                  extension: analysis.file.extension,
                }),
              }),
            )
          },
          dir: (analysis) => {
            const path = analysis.isPathAbsolute
              ? new Abs({ segments: analysis.path })
              : new Rel({ segments: analysis.path })

            return ParseResult.succeed(
              FsLocLooseClass.make({
                path,
                file: null,
              }),
            )
          },
        }),
      )
    },
  },
)

/**
 * Type representing a loose location (any combination of path and file).
 */
export type LocLoose = typeof LocLoose.Type

/**
 * Create a loose location.
 */
export const make = FsLocLooseClass.make.bind(FsLocLooseClass)

/**
 * Check if a value is a loose location.
 */
export const is = S.is(LocLoose)

/**
 * Decode a value into a loose location.
 */
export const decode = S.decode(LocLoose)

/**
 * Synchronously decode a value into a loose location.
 */
export const decodeSync = S.decodeSync(LocLoose)

/**
 * Encode a loose location to a string.
 */
export const encode = S.encode(LocLoose)

/**
 * Synchronously encode a loose location to a string.
 */
export const encodeSync = S.encodeSync(LocLoose)
