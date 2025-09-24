import * as FsLoc from '../fs-loc.js'
import * as Inputs from '../inputs.js'
import { Path } from '../path/$.js'

/**
 * Check if a location is under (descendant of) a directory.
 * Returns false if paths are of different types (absolute vs relative).
 *
 * @param child - The location to check
 * @param parent - The directory that might contain the child
 * @returns True if child is under parent, false otherwise
 *
 * @example
 * ```ts
 * const projectDir = FsLoc.fromString('/home/user/project/')
 * const sourceFile = FsLoc.fromString('/home/user/project/src/index.ts')
 * FsLoc.isUnder(sourceFile, projectDir) // true
 *
 * const relDir = FsLoc.fromString('./src/')
 * const absFile = FsLoc.fromString('/home/file.txt')
 * FsLoc.isUnder(absFile, relDir) // false - different path types
 * ```
 */
export const isUnder = <
  child extends Inputs.Input.Any,
  parent extends Inputs.Input.Dir,
>(
  child: Inputs.Guard.Any<child>,
  parent: Inputs.Guard.Dir<parent>,
): boolean => {
  const normalizedChild = FsLoc.normalizeInput(child)
  const normalizedParent = FsLoc.normalizeInput(parent)
  // Check if both are absolute or both are relative
  const childIsAbs = normalizedChild._tag === 'LocAbsFile' || normalizedChild._tag === 'LocAbsDir'
  const parentIsAbs = normalizedParent._tag === 'LocAbsDir'

  if (childIsAbs !== parentIsAbs) {
    return false // Can't compare absolute with relative
  }

  // Special case: root directory (0 segments) contains everything except itself
  if (Path.isRoot(normalizedParent.path)) {
    // For absolute paths, root contains everything that has segments OR has a file
    // (files at root like /file.txt have 0 segments but have a file property)
    return normalizedChild.path.segments.length > 0 || 'file' in normalizedChild
  }

  // Check if child path is descendant of parent path
  const isPathDescendant = Path.isDescendantOf(normalizedChild.path, normalizedParent.path)

  // If child has fewer segments than parent, it can't be under it
  if (normalizedChild.path.segments.length < normalizedParent.path.segments.length) {
    return false
  }

  // If child has more segments and is a descendant, it's under
  if (normalizedChild.path.segments.length > normalizedParent.path.segments.length && isPathDescendant) {
    return true
  }

  // If they have the same number of segments
  if (normalizedChild.path.segments.length === normalizedParent.path.segments.length) {
    // If child is a file and paths match, the file is in the directory
    if ('file' in normalizedChild && isPathDescendant) {
      return true
    }
    // Otherwise (both dirs with same path, or paths don't match), not under
    return false
  }

  return false
}

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
