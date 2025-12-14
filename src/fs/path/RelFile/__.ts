import { ParseResult, Schema as S } from 'effect'
import type { RefineSchemaId, TypeId } from 'effect/Schema'
import { analyze } from '../../path-analyzer/codec-string/analyzer.js'
import { FileName } from '../types/fileName.js'
import { Segments } from '../types/segments.js'

type _ = RefineSchemaId

/**
 * Relative file location class.
 * Internal implementation - use via RelFile namespace.
 */
class RelFileClass extends S.TaggedClass<RelFileClass>()('FsPathRelFile', {
  segments: Segments,
  fileName: FileName,
}) {
  override toString() {
    return S.encodeSync(Schema)(this)
  }
}

/**
 * Schema for relative file paths with string codec baked in.
 *
 * This schema transforms between string representation (e.g., "./src/index.ts")
 * and the structured RelFile class instance.
 *
 * @example
 * ```ts
 * // Decode from string
 * const file = S.decodeSync(RelFile.Schema)('./src/index.ts')
 *
 * // Use in struct (expects string input)
 * const ConfigSchema = S.Struct({
 *   sourcePath: RelFile.Schema,
 *   outputPath: RelFile.Schema
 * })
 * ```
 */
export const Schema: S.Schema<RelFileClass, string> = S.transformOrFail(
  S.String,
  RelFileClass,
  {
    strict: true,
    encode: (decoded) => {
      // Source of truth for string conversion
      const pathString = decoded.segments.join('/')
      const fileString = decoded.fileName.extension
        ? `${decoded.fileName.stem}${decoded.fileName.extension}`
        : decoded.fileName.stem
      return ParseResult.succeed(pathString.length > 0 ? `./${pathString}/${fileString}` : `./${fileString}`)
    },
    decode: (input, options, ast) => {
      // Analyze the input string
      const analysis = analyze(input)

      // Validate it's a relative file
      if (analysis._tag !== 'file') {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Expected a file path, got a directory path'),
        )
      }
      if (analysis.isPathAbsolute) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Relative paths must not start with /'),
        )
      }

      // Valid - return as RelFile
      return ParseResult.succeed(
        RelFileClass.make({
          segments: analysis.path,
          fileName: FileName.make({
            stem: analysis.file.stem,
            extension: analysis.file.extension,
          }),
        }),
      )
    },
  },
)

/**
 * Type guard to check if a value is a RelFile instance.
 */
export const is = S.is(Schema)

/**
 * Direct constructor for RelFile from structured data.
 * Bypasses string parsing for efficient internal operations.
 */
export const make = RelFileClass.make.bind(RelFileClass)

/**
 * Decode from string to RelFile instance.
 * Throws on invalid input.
 */
export const fromString = <const input extends string>(input: input) => {
  return S.decodeSync(Schema)(input)
}

/**
 * Encode RelFile instance to string.
 */
export const toString = (instance: RelFileClass): string => {
  return S.encodeSync(Schema)(instance)
}
