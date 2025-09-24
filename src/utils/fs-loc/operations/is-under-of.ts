import * as FsLoc from '../fs-loc.js'
import * as Inputs from '../inputs.js'
import { isUnder } from './is-under.js'

/**
 * Create a curried version of isUnder with the parent directory fixed.
 *
 * @param parent - The directory to check against
 * @returns A function that checks if a location is under the parent
 *
 * @example
 * ```ts
 * const projectDir = FsLoc.fromString('/home/user/project/')
 * const isInProject = FsLoc.isUnderOf(projectDir)
 *
 * isInProject(FsLoc.fromString('/home/user/project/src/index.ts')) // true
 * isInProject(FsLoc.fromString('/home/other/file.txt')) // false
 * ```
 */
export const isUnderOf = <parent extends Inputs.Input.Dir>(
  parent: Inputs.Guard.Dir<parent>,
) =>
<child extends Inputs.Input.Any>(
  child: Inputs.Guard.Any<child>,
): boolean => isUnder(child, parent)
