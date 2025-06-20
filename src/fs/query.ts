import { Err } from '#err'
import * as NodeFs from '#platform:fs/fs'
import { isNotFoundError } from './error.ts'

/**
 * Check if a file or directory exists.
 *
 * @param path - The path to check.
 * @returns True if the path exists, false otherwise.
 *
 * @example
 * ```ts
 * const fileExists = await exists('./config.json')
 * // returns true or false
 * ```
 */
export const exists = async (path: string): Promise<boolean> => {
  try {
    // todo but isomoprhic
    // import { constants } from 'node:fs'
    // await NodeFs.access(path, constants.F_OK)
    await NodeFs.stat(path)
    return true
  } catch {
    return false
  }
}

/**
 * Read the names of files (not directories) in a directory.
 *
 * @param path - The directory path to read.
 * @returns Array of file names, or null if directory doesn't exist or error occurs.
 *
 * @example
 * ```ts
 * const files = await readDirFilesNames('./src')
 * // returns ['index.ts', 'utils.ts'] or null
 * ```
 */
export const readDirFilesNames = async (path: string): Promise<string[] | null> => {
  try {
    const entities = await NodeFs.readdir(path, { withFileTypes: true })
    return entities.filter((entity) => entity.isFile()).map((entity) => entity.name)
  } catch {
    return null
  }
}

/**
 * Read all entity names (files and directories) in a directory.
 *
 * @param path - The directory path to read.
 * @returns Array of all entity names, or null if directory doesn't exist or error occurs.
 *
 * @example
 * ```ts
 * const entities = await readDirEntityNames('./src')
 * // returns ['index.ts', 'utils', 'components'] or null
 * ```
 */
export const readDirEntityNames = async (path: string): Promise<string[] | null> => {
  try {
    return await NodeFs.readdir(path)
  } catch {
    return null
  }
}

/**
 * Check if a directory is empty.
 *
 * @param path - The directory path to check.
 * @returns True if the directory is empty.
 * @throws {Error} If the path doesn't exist or isn't a directory.
 *
 * @example
 * ```ts
 * const isEmpty = await isEmptyDir('./temp')
 * // returns true or false
 * ```
 */
export const isEmptyDir = async (path: string): Promise<boolean> => {
  const files = await NodeFs.readdir(path)
  return files.length === 0
}

/**
 * Get file or directory statistics.
 *
 * @param path - The path to get statistics for.
 * @returns A Result containing the stats or an error.
 *
 * @example
 * ```ts
 * const result = await stat('./file.txt')
 * if (result.success) {
 *   console.log(result.data.size)
 * }
 * ```
 */
export const stat = Err.tryCatchify(NodeFs.stat, [isNotFoundError])
