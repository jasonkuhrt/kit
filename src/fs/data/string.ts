import { Err } from '#err/index.js'
import type { Language } from '#language/index.js'
import { Path } from '#path/index.js'
import * as NodeFs from '#platform:fs/fs.js'
import { removeMany } from '../delete.js'
import { makeDirectory } from '../directory.js'
import type { FileWriteInput } from '../fs.js'

/**
 * Write a string to a file.
 *
 * @param file - The file configuration with path, content, and optional hard write mode.
 * @param file.path - The file path to write to.
 * @param file.content - The string content to write.
 * @param file.hard - If true, deletes the file first to force changes to be detected.
 *
 * @example
 * ```ts
 * await writeString({
 *   path: './output.txt',
 *   content: 'Hello, world!',
 *   hard: false
 * })
 * ```
 */
export const writeString = async (file: FileWriteInput): Language.SideEffectAsync => {
  await makeDirectory(Path.dirname(file.path))
  if (file.hard) {
    // Delete first e.g. to force VSCode to see the change without needing a restart.
    await removeMany(file.path)
  }
  await NodeFs.writeFile(file.path, file.content, { encoding: `utf-8` })
}

/**
 * Read a file as a string.
 *
 * @param path - The file path to read from.
 * @returns The file contents as a string, or null if the file doesn't exist.
 *
 * @example
 * ```ts
 * const content = await read('./file.txt')
 * // content is 'file contents' or null
 * ```
 */
export const read = async (path: string): Promise<string | null> => {
  try {
    return await NodeFs.readFile(path, { encoding: `utf-8` })
    // eslint-disable-next-line
  } catch (error) {
    if (error instanceof Error && `code` in error && error.code === `ENOENT`) {
      return null
    }
    throw error
  }
}

/**
 * Read a file as a string, throwing an error if the file does not exist.
 *
 * @param path - The file path to read from.
 * @returns The file contents as a string.
 * @throws {Error} If the file does not exist.
 *
 * @example
 * ```ts
 * const content = await readOrThrow('./file.txt')
 * // content is 'file contents' or throws error
 * ```
 */
export const readOrThrow = Err.guardNull(read)
