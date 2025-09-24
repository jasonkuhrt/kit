import * as FsLoc from '../fs-loc.js'
import * as Groups from '../groups/$$.js'
import * as Inputs from '../inputs.js'
import { Path } from '../path/$.js'

/**
 * Type-level toDir operation.
 */
export type ToDir<F extends Groups.File.File> = F extends FsLoc.AbsFile ? FsLoc.AbsDir
  : F extends FsLoc.RelFile ? FsLoc.RelDir
  : Groups.Dir.Dir

/**
 * Type-level toDir wrapper for Input types.
 */
export type toDir<$File extends Inputs.Input.File> = ToDir<Inputs.normalize<$File>>

/**
 * Drop the file from a file location, returning just the parent directory location.
 *
 * @param loc - The file location
 * @returns The parent directory location
 */
export const toDir = <F extends Inputs.Input.File>(
  loc: Inputs.Guard.File<F>,
): toDir<F> => {
  const normalized = FsLoc.normalizeInput(loc)

  // Use the file's existing path segments which represent the parent directory
  const segments = [...normalized.path.segments]

  // Create the appropriate directory type based on whether loc is absolute or relative
  const dirLoc = Groups.Abs.is(normalized)
    ? FsLoc.AbsDir.make({ path: Path.Abs.make({ segments }) })
    : FsLoc.RelDir.make({ path: Path.Rel.make({ segments }) })

  return dirLoc as toDir<F>
}
