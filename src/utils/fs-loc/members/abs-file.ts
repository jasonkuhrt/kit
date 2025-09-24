import { ParseResult, Schema as S } from 'effect'
import type { ParseOptions } from 'effect/SchemaAST'
import * as LocLoose from '../fs-loc-loose.js'
import { Abs } from '../path/abs.js'
import { File } from '../types/file.js'

/**
 * Absolute file location.
 *
 * Represents a file with an absolute path (starting with /).
 *
 * @example
 * // For structured data (e.g., from API)
 * const schema1 = S.Struct({ file: AbsFile })
 *
 * // For string input (e.g., from config)
 * const schema2 = S.Struct({ path: AbsFile.FromString })
 */
export class AbsFile extends S.TaggedClass<AbsFile>()('LocAbsFile', {
  path: Abs.pipe(
    S.propertySignature,
    S.withConstructorDefault(() => new Abs({ segments: [] })),
  ),
  file: File,
}) {
  static is = S.is(AbsFile)

  override toString() {
    return S.encodeSync(AbsFile.String)(this)
  }

  /**
   * Schema for parsing from/encoding to string representation.
   * Use this when you need to accept string paths (e.g., from user input, config files).
   *
   * @example
   * const ConfigSchema = S.Struct({
   *   sourcePath: AbsFile.String,
   *   outputPath: AbsFile.String
   * })
   */
  static String = S.transformOrFail(
    S.String,
    AbsFile,
    {
      strict: true,
      encode: (decoded) => {
        // Source of truth for string conversion
        const pathString = decoded.path.segments.join('/')
        const fileString = decoded.file.extension ? `${decoded.file.name}${decoded.file.extension}` : decoded.file.name
        return ParseResult.succeed(pathString.length > 0 ? `/${pathString}/${fileString}` : `/${fileString}`)
      },
      decode: (input, options, ast) => {
        // First decode with LocLoose
        const looseResult = LocLoose.decodeSync(input)

        // Validate it's an absolute file
        if (looseResult.path._tag !== 'PathAbs') {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, 'Absolute paths must start with /'),
          )
        }
        if (!looseResult.file) {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, 'Expected a file path, got a directory or root path'),
          )
        }

        // Valid - return as AbsFile
        return ParseResult.succeed(
          new AbsFile({
            path: new Abs({ segments: (looseResult.path as any).segments }),
            file: new File({
              name: looseResult.file.name,
              extension: looseResult.file.extension,
            }),
          }),
        )
      },
    },
  )

  static fromString = <const input extends string>(input: input) => {
    return S.decodeSync(AbsFile.String)(input) as any
  }
}
