import { Match } from 'effect'
import type { Path } from '../_.js'
import type { Guard, Input } from '../inputs.js'
import { normalizeDynamic } from '../inputs.js'
import { Schema } from '../Schema.js'

const normalizer = normalizeDynamic(Schema)

/**
 * Get the name (last segment) of a location.
 *
 * For files: returns the filename including extension.
 * For directories: returns the directory name.
 * For root directories: returns an empty string.
 *
 * @param path - The path to get the name from
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
export const name = <$input extends Input>(path: $input): string => {
  const normalized = normalizer(path) as Path
  return Match.value(normalized).pipe(
    Match.tagsExhaustive({
      FsPathAbsFile: (file) =>
        file.fileName.extension
          ? file.fileName.stem + file.fileName.extension
          : file.fileName.stem,
      FsPathRelFile: (file) =>
        file.fileName.extension
          ? file.fileName.stem + file.fileName.extension
          : file.fileName.stem,
      FsPathAbsDir: (dir) =>
        dir.segments.length > 0
          ? dir.segments[dir.segments.length - 1]!
          : '',
      FsPathRelDir: (dir) =>
        dir.segments.length > 0
          ? dir.segments[dir.segments.length - 1]!
          : '',
    }),
  )
}
