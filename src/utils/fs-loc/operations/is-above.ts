import * as FsLoc from '../fs-loc.js'
import * as Inputs from '../inputs.js'
import { isUnder } from './is-under.js'

/**
 * Check if a directory is above (ancestor of) a location.
 * Symmetrical to isUnder with swapped arguments.
 *
 * @param parent - The directory that might contain the child
 * @param child - The location to check
 * @returns True if parent is above child, false otherwise
 *
 * @example
 * ```ts
 * const projectDir = FsLoc.fromString('/home/user/project/')
 * const sourceFile = FsLoc.fromString('/home/user/project/src/index.ts')
 * FsLoc.isAbove(projectDir, sourceFile) // true
 * ```
 */
export const isAbove = <
  parent extends Inputs.Input.Dir,
  child extends Inputs.Input.Any,
>(
  parent: Inputs.Guard.Dir<parent>,
  child: Inputs.Guard.Any<child>,
): boolean => {
  return isUnder(child, parent)
}
