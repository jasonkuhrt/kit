import * as FsLoc from '../fs-loc.js'
import * as Inputs from '../inputs.js'

/**
 * Get the extension of a file location.
 *
 * For files: returns the extension including the leading dot, or null if no extension.
 * For directories: always returns null.
 *
 * @param loc - The location to get the extension from
 * @returns The extension with leading dot (e.g., '.txt'), or null for directories and files without extensions
 *
 * @example
 * ```ts
 * extension('/path/to/file.txt') // '.txt'
 * extension('/path/to/archive.tar.gz') // '.gz'
 * extension('/path/to/README') // null
 * extension('/path/to/src/') // null
 * extension('./docs/README.md') // '.md'
 * ```
 */
export const extension = <loc extends Inputs.Input.Any>(
  loc: Inputs.Guard.Any<loc>,
): extension_return<loc> => {
  const normalized = FsLoc.normalizeInput(loc)

  switch (normalized._tag) {
    case 'LocAbsFile':
    case 'LocRelFile':
      // For files, return the extension or null
      return normalized.file.extension as extension_return<loc>

    case 'LocAbsDir':
    case 'LocRelDir':
      // For directories, always return null
      return null as extension_return<loc>
  }
}

type extension_return<T extends Inputs.Input.Any> = T extends Inputs.Input.File ? string | null : null
