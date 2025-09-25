import * as FsLoc from '../fs-loc.js'
import * as Inputs from '../inputs.js'

/**
 * Get the stem (name without extension) of a location.
 *
 * For files: returns the filename without extension.
 * For directories: returns the directory name (same as name()).
 * For root directories: returns an empty string.
 *
 * @param loc - The location to get the stem from
 * @returns The stem of the file or directory name
 *
 * @example
 * ```ts
 * stem('/path/to/file.txt') // 'file'
 * stem('/path/to/archive.tar.gz') // 'archive.tar'
 * stem('/path/to/src/') // 'src'
 * stem('./docs/README.md') // 'README'
 * stem('/') // ''
 * ```
 */
export const stem = <loc extends Inputs.Input.Any>(
  loc: Inputs.Guard.Any<loc>,
): string => {
  const normalized = FsLoc.normalizeInput(loc)

  switch (normalized._tag) {
    case 'LocAbsFile':
    case 'LocRelFile':
      // For files, return just the stem without extension
      return normalized.file.stem

    case 'LocAbsDir':
    case 'LocRelDir':
      // For directories, return the last segment (same as name())
      const segments = normalized.path.segments
      return segments.length > 0
        ? segments[segments.length - 1]!
        : '' // Root directory case
  }
}
