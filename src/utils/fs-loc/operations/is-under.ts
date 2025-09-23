import * as Groups from '../groups/$$.js'
import * as Inputs from '../inputs.js'

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
  child: Inputs.Validate.Any<child>,
  parent: Inputs.Validate.Dir<parent>,
): boolean => {
  const normalizedChild = Inputs.normalize(child)
  const normalizedParent = Inputs.normalize(parent)
  // Check if both are absolute or both are relative
  const childIsAbs = normalizedChild._tag === 'LocAbsFile' || normalizedChild._tag === 'LocAbsDir'
  const parentIsAbs = normalizedParent._tag === 'LocAbsDir'

  if (childIsAbs !== parentIsAbs) {
    return false // Can't compare absolute with relative
  }

  // Compare path segments
  const parentSegments = normalizedParent.path.segments
  const childSegments = normalizedChild.path.segments

  // Special case: root directory (0 segments) contains everything except itself
  if (parentSegments.length === 0) {
    // For absolute paths, root contains everything that has segments OR has a file
    // (files at root like /file.txt have 0 segments but have a file property)
    return childSegments.length > 0 || 'file' in normalizedChild
  }

  // Child must have at least as many segments as parent
  if (childSegments.length < parentSegments.length) {
    return false
  }

  // Check if parent segments match the beginning of child segments
  for (let i = 0; i < parentSegments.length; i++) {
    if (parentSegments[i] !== childSegments[i]) {
      return false
    }
  }

  // If all parent segments match and child has more segments, it's under
  // If they have the same segments but child is a file, it's under
  // (files in a directory have same segments as the directory)
  // If both are directories with same segments, they're the same path (not under)
  return childSegments.length > parentSegments.length
    || (childSegments.length === parentSegments.length && 'file' in normalizedChild)
}
