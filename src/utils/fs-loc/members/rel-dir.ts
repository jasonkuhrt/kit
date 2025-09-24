import { ParseResult, Schema as S } from 'effect'
import * as LocLoose from '../fs-loc-loose.js'
import * as Inputs from '../inputs.js'
import { Rel } from '../path/rel.js'

/**
 * Relative directory location.
 *
 * Represents a directory with a relative path (starting with ./).
 *
 * @example
 * // For structured data (e.g., from API)
 * const schema1 = S.Struct({ dir: RelDir })
 *
 * // For string input (e.g., from config)
 * const schema2 = S.Struct({ path: RelDir.String })
 */
export class RelDir extends S.TaggedClass<RelDir>()('LocRelDir', {
  path: Rel.pipe(
    S.propertySignature,
    S.withConstructorDefault(() => new Rel({ segments: [] })),
  ),
}) {
  static is = S.is(RelDir)

  override toString() {
    return S.encodeSync(RelDir.String)(this)
  }

  /**
   * Schema for parsing from/encoding to string representation.
   * Use this when you need to accept string paths (e.g., from user input, config files).
   *
   * @example
   * const ConfigSchema = S.Struct({
   *   sourcePath: RelDir.String,
   *   outputPath: RelDir.String
   * })
   */
  static String = S.transformOrFail(
    S.String,
    RelDir,
    {
      strict: true,
      encode: (decoded) => {
        // Source of truth for string conversion
        const pathString = decoded.path.segments.join('/')
        // Always end directories with trailing slash to distinguish from files
        return ParseResult.succeed(pathString.length > 0 ? `./${pathString}/` : './')
      },
      decode: (input, options, ast) => {
        // First decode with LocLoose
        const looseResult = LocLoose.decodeSync(input)

        // Validate it's a relative directory
        if (looseResult.path._tag !== 'PathRelative') {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, 'Relative paths must not start with /'),
          )
        }
        if (looseResult.file) {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, 'Expected a directory path, got a file path'),
          )
        }

        // Valid - return as RelDir
        return ParseResult.succeed(
          new RelDir({
            path: new Rel({ segments: (looseResult.path as any).segments }),
          }),
        )
      },
    },
  )

  static get fromString() {
    return Inputs.normalize(RelDir.String)
  }
}
