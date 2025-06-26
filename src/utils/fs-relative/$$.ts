import { Fs } from '#fs'
import { Path } from '#path'

/**
 * A filesystem interface with relative path operations.
 */
export interface FsRelative {
  cwd: string
  changeDirectory: (path: string) => FsRelative
  write: typeof Fs.write
}

/**
 * Create a filesystem interface rooted at a specific directory.
 *
 * @param parameters - The creation parameters.
 * @param parameters.directory - The root directory for relative operations.
 * @returns A filesystem interface with relative path operations.
 *
 * @example
 * ```ts
 * const fs = create({ directory: './src' })
 * await fs.write({ path: 'index.ts', content: 'export {}' })
 * // writes to '#/src'
 * ```
 */
export const create = (parameters: { directory: string }): FsRelative => {
  const ensureAbsolute = Path.ensureAbsoluteWith(parameters.directory)

  const cwd = ensureAbsolute('./')

  const absolutifyFile = (file: Fs.FileWriteInputMaybeJson) => {
    file.path = ensureAbsolute(file.path)
  }

  return {
    cwd,
    changeDirectory: path => {
      const fsRelative = create({ directory: Path.ensureAbsolute(path, cwd) })
      return fsRelative
    },
    write: (file) => {
      absolutifyFile(file)
      return Fs.write(file)
    },
  }
}
