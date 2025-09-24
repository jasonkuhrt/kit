import * as FsLoc from '../fs-loc.js'
import * as Inputs from '../inputs.js'
import { isAbove } from './is-above.js'

/**
 * Create a curried version of isAbove with the child location fixed.
 *
 * @param child - The location to check against
 * @returns A function that checks if a directory is above the child
 *
 * @example
 * ```ts
 * const sourceFile = FsLoc.fromString('/home/user/project/src/index.ts')
 * const hasAsParent = FsLoc.isAboveOf(sourceFile)
 *
 * hasAsParent(FsLoc.fromString('/home/user/project/')) // true
 * hasAsParent(FsLoc.fromString('/home/other/')) // false
 * ```
 */
export const isAboveOf = <child extends Inputs.Input.Any>(
  child: Inputs.Guard.Any<child>,
) =>
<parent extends Inputs.Input.Dir>(
  parent: Inputs.Guard.Dir<parent>,
): boolean => isAbove(parent, child)
