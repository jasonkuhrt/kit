import * as Inputs from '../inputs.js'

/**
 * Get the name (last segment) of a location.
 *
 * For files: returns the filename including extension.
 * For directories: returns the directory name.
 * For root directories: returns an empty string.
 *
 * @param loc - The location to get the name from
 * @returns The name of the file or directory
 *
 * @example
 * ```ts
 * name('/path/to/file.txt') // 'file.txt'
 * name('/path/to/src/') // 'src'
 * name('./docs/README.md') // 'README.md'
 * name('/') // ''
 * ```
 */
export const name = <loc extends Inputs.Input.Any>(
  loc: Inputs.Validate.Any<loc>,
): string => {
  const normalized = Inputs.normalize(loc)
  if ('file' in normalized) {
    // For files, combine name and extension
    return normalized.file.extension
      ? normalized.file.name + normalized.file.extension
      : normalized.file.name
  } else {
    // For directories, return the last segment
    const segments = normalized.path.segments
    return segments.length > 0
      ? segments[segments.length - 1]!
      : '' // Root directory case
  }
}
