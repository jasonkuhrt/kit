import { ParseResult, Schema as S } from 'effect'
import type { RefineSchemaId, TypeId } from 'effect/Schema'
import { analyze } from '../../path-analyzer/codec-string/analyzer.js'
import { Segments } from '../types/segments.js'

type _ = RefineSchemaId

/**
 * Relative directory location class.
 * Internal implementation - use via RelDir namespace.
 */
class RelDirClass extends S.TaggedClass<RelDirClass>()('FsPathRelDir', {
  segments: Segments,
}) {
  override toString() {
    return S.encodeSync(Schema)(this)
  }
}

/**
 * Schema for relative directory paths with string codec baked in.
 *
 * This schema transforms between string representation (e.g., "./src/")
 * and the structured RelDir class instance.
 *
 * @example
 * ```ts
 * // Decode from string
 * const dir = S.decodeSync(RelDir.Schema)('./src/')
 *
 * // Use in struct (expects string input)
 * const ConfigSchema = S.Struct({
 *   sourcePath: RelDir.Schema,
 *   outputPath: RelDir.Schema
 * })
 * ```
 */
export const Schema: S.Schema<RelDirClass, string> = S.transformOrFail(
  S.String,
  RelDirClass,
  {
    strict: true,
    encode: (decoded) => {
      // Source of truth for string conversion
      const pathString = decoded.segments.join('/')
      // Always end directories with trailing slash to distinguish from files
      return ParseResult.succeed(pathString.length > 0 ? `./${pathString}/` : './')
    },
    decode: (input, options, ast) => {
      // Analyze the input string
      const analysis = analyze(input)

      // Validate it's a relative directory
      if (analysis._tag !== 'dir') {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Expected a directory path, got a file path'),
        )
      }
      if (analysis.isPathAbsolute) {
        return ParseResult.fail(
          new ParseResult.Type(ast, input, 'Relative paths must not start with /'),
        )
      }

      // Valid - return as RelDir
      return ParseResult.succeed(
        RelDirClass.make({
          segments: analysis.path,
        }),
      )
    },
  },
)

/**
 * Type guard to check if a value is a RelDir instance.
 */
export const is = S.is(Schema)

/**
 * Direct constructor for RelDir from structured data.
 * Bypasses string parsing for efficient internal operations.
 */
export const make = RelDirClass.make.bind(RelDirClass)

/**
 * Decode from string to RelDir instance.
 * Throws on invalid input.
 */
export const fromString = <const input extends string>(input: input) => {
  return S.decodeSync(Schema)(input)
}

/**
 * Encode RelDir instance to string.
 */
export const toString = (instance: RelDirClass): string => {
  return S.encodeSync(Schema)(instance)
}
