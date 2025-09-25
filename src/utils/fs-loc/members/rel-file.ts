import { ParseResult, Schema as S } from 'effect'
import * as LocLoose from '../fs-loc-loose.js'
import * as Inputs from '../inputs.js'
import { Path } from '../path/$.js'
import { File } from '../types/file.js'

/**
 * Relative file location.
 *
 * Represents a file with a relative path (starting with ./).
 *
 * @example
 * // For structured data (e.g., from API)
 * const schema1 = S.Struct({ file: RelFile })
 *
 * // For string input (e.g., from config)
 * const schema2 = S.Struct({ path: RelFile.String })
 */
export class RelFile extends S.TaggedClass<RelFile>()('LocRelFile', {
  path: Path.Rel.pipe(
    S.propertySignature,
    S.withConstructorDefault(() => Path.Rel.make({ segments: [] })),
  ),
  file: File,
}) {
  static is = S.is(RelFile)

  override toString() {
    return S.encodeSync(RelFile.String)(this)
  }

  /**
   * Schema for parsing from/encoding to string representation.
   * Use this when you need to accept string paths (e.g., from user input, config files).
   *
   * @example
   * const ConfigSchema = S.Struct({
   *   sourcePath: RelFile.String,
   *   outputPath: RelFile.String
   * })
   */
  static String = S.transformOrFail(
    S.String,
    RelFile,
    {
      strict: true,
      encode: (decoded) => {
        // Source of truth for string conversion
        const pathString = decoded.path.segments.join('/')
        const fileString = decoded.file.extension ? `${decoded.file.stem}${decoded.file.extension}` : decoded.file.stem
        return ParseResult.succeed(pathString.length > 0 ? `./${pathString}/${fileString}` : `./${fileString}`)
      },
      decode: (input, options, ast) => {
        // First decode with LocLoose
        const looseResult = LocLoose.decodeSync(input)

        // Validate it's a relative file
        if (looseResult.path._tag !== 'PathRelative') {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, 'Relative paths must not start with /'),
          )
        }
        if (!looseResult.file) {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, 'Expected a file path, got a directory or root path'),
          )
        }

        // Valid - return as RelFile
        return ParseResult.succeed(
          new RelFile({
            path: Path.Rel.make({ segments: (looseResult.path as any).segments }),
            file: File.make({
              stem: looseResult.file.stem,
              extension: looseResult.file.extension,
            }),
          }),
        )
      },
    },
  )

  static get fromString() {
    return Inputs.normalize(RelFile.String)
  }
}
