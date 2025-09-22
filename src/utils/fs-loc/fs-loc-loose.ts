import { Match, ParseResult, Schema as S } from 'effect'
import { Analyzer } from './analyzer/$.js'
import { Path } from './path/$.js'
import * as File from './types/file.js'

const Encoded = S.String

export const Decoded = S.TaggedStruct('FsLocLoose', {
  path: S.Union(Path.Abs.Decoded, Path.Rel.Decoded),
  file: S.NullOr(File.Decoded),
})

/**
 * Schema for parsing location strings without enforcing strict type constraints.
 * Unlike the strict location types, this allows any combination of path and file.
 * Useful when you need to parse filesystem locations without knowing their specific type.
 */
export const LocLoose = S.transformOrFail(
  Encoded,
  Decoded,
  {
    strict: true,
    encode: (decoded) => {
      const pathEncoded = Path.encodeSync(decoded.path)
      const fileEncoded = decoded.file ? File.encodeSync(decoded.file) : ''
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
              ? Path.Abs.Decoded.make({ segments: analysis.path })
              : Path.Rel.Decoded.make({ segments: analysis.path })

            return ParseResult.succeed(
              Decoded.make({
                path,
                file: File.Decoded.make({
                  name: analysis.file.name,
                  extension: analysis.file.extension,
                }),
              }),
            )
          },
          dir: (analysis) => {
            const path = analysis.isPathAbsolute
              ? Path.Abs.Decoded.make({ segments: analysis.path })
              : Path.Rel.Decoded.make({ segments: analysis.path })

            return ParseResult.succeed(
              Decoded.make({
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
export const make = Decoded.make

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
