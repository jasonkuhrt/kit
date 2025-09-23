import * as FsLoc from '../$$.js'
import * as Groups from '../groups/$$.js'
import * as Inputs from '../inputs.js'
import { Path } from '../path/$.js'

/**
 * Type-level toDir operation.
 */
export type ToDir<F extends Groups.File.File> = F extends FsLoc.AbsFile.AbsFile ? FsLoc.AbsDir.AbsDir
  : F extends FsLoc.RelFile.RelFile ? FsLoc.RelDir.RelDir
  : Groups.Dir.Dir

/**
 * Type-level toDir wrapper for Input types.
 */
export type toDir<$File extends Inputs.Input.File> = ToDir<Inputs.normalize<$File>>

/**
 * Convert a file location to a directory location.
 * Useful when you know a file path actually represents a directory.
 *
 * @param loc - The file location to convert
 * @returns The directory location
 */
export const toDir = <F extends Inputs.Input.File>(
  loc: Inputs.Validate.File<F>,
): toDir<F> => {
  const normalized = Inputs.normalize(loc)
  const fileName = normalized.file.extension ? normalized.file.name + normalized.file.extension : normalized.file.name
  const segments = [...normalized.path.segments, fileName]

  // Create the appropriate directory type based on whether loc is absolute or relative
  const dirLoc = Groups.Abs.is(normalized)
    ? FsLoc.AbsDir.make({ path: Path.Abs.make({ segments }) })
    : FsLoc.RelDir.make({ path: Path.Rel.make({ segments }) })

  return dirLoc as toDir<F>
}
