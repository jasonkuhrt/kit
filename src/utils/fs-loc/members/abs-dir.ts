import { ParseResult, Schema as S } from 'effect'
import * as LocLoose from '../fs-loc-loose.js'
import * as Inputs from '../inputs.js'
import { Path } from '../path/$.js'
import { Abs } from '../path/abs.js'

/**
 * Absolute directory location.
 *
 * Represents a directory with an absolute path (starting with /).
 *
 * @example
 * // For structured data (e.g., from API)
 * const schema1 = S.Struct({ dir: AbsDir })
 *
 * // For string input (e.g., from config)
 * const schema2 = S.Struct({ path: AbsDir.String })
 */
export class AbsDir extends S.TaggedClass<AbsDir>()('LocAbsDir', {
  path: Abs.pipe(
    S.propertySignature,
    S.withConstructorDefault(() => new Abs({ segments: [] })),
  ),
}) {
  override toString() {
    return S.encodeSync(AbsDir.String)(this)
  }

  // static fromString<input extends Inputs.Input.AbsDir>(input: Inputs.Validate.AbsDir<input>): Inputs.normalize<input> {
  //   return S.decodeSync(AbsDir.String)(input as string) as any
  // }

  static is = S.is(AbsDir)

  /**
   * Schema for parsing from/encoding to string representation.
   * Use this when you need to accept string paths (e.g., from user input, config files).
   *
   * @example
   * const ConfigSchema = S.Struct({
   *   sourcePath: AbsDir.String,
   *   outputPath: AbsDir.String
   * })
   */
  static String = S.transformOrFail(
    S.String,
    AbsDir,
    {
      strict: true,
      encode: (decoded) => {
        const pathString = decoded.path.segments.join(Path.stringSeparator)
        const string = decoded.path.segments.length === 0 ? '/' : `/${pathString}/`
        return ParseResult.succeed(string)
      },
      decode: (input, options, ast) => {
        // First decode with LocLoose
        const looseResult = LocLoose.decodeSync(input)

        // Validate it's an absolute directory
        if (looseResult.path._tag !== 'PathAbs') {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, 'Absolute paths must start with /'),
          )
        }
        if (looseResult.file) {
          return ParseResult.fail(
            new ParseResult.Type(ast, input, 'Expected a directory path, got a file path'),
          )
        }

        // Valid - return as AbsDir
        return ParseResult.succeed(
          new AbsDir({
            path: new Abs({ segments: (looseResult.path as any).segments }),
          }),
        )
      },
    },
  )

  static fromString = Inputs.normalize(AbsDir.String)
}
