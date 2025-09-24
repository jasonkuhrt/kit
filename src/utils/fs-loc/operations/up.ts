import * as FsLoc from '../fs-loc.js'
import * as Inputs from '../inputs.js'
import { Path } from '../path/$.js'
import { set } from './_internal.js'

/**
 * Type-level up operation.
 * Returns the same FsLoc type with path segments modified.
 */
export type Up<$Loc extends FsLoc.FsLoc> = $Loc

/**
 * Type-level up wrapper for Input types.
 */
export type up<$Loc extends Inputs.Input.Any> = Up<Inputs.normalize<$Loc>>

/**
 * Move up by one segment on path.
 *
 * For files: Removes the file part, returning the parent directory.
 * For directories: Moves up one directory level.
 *
 * @param loc - The location to move up from
 * @returns The parent location
 *
 * @example
 * ```ts
 * up('/path/to/file.txt') // '/path/to/'
 * up('/path/to/dir/') // '/path/to/'
 * up('./src/lib/') // './src/'
 * ```
 */
export const up = <loc extends Inputs.Input.Any>(
  loc: Inputs.Guard.Any<loc>,
): up<loc> => {
  const normalized = FsLoc.normalizeInput(loc)

  // For both files and directories, just move up one segment in the path
  // Files keep their file part, directories stay as directories
  const parentPath = Path.up(normalized.path)
  return set(normalized, { segments: parentPath.segments }) as any
}
