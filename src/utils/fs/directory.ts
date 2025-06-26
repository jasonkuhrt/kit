import type { Lang } from '#lang'
import * as NodeFs from '#platform:fs/fs'

/**
 * Create a directory recursively.
 *
 * @param path - The directory path to create.
 *
 * @example
 * ```ts
 * await makeDirectory('./deeply/nested/directory')
 * // creates all directories in the path
 * ```
 */
export const makeDirectory = async (path: string): Lang.SideEffectAsync => {
  await NodeFs.mkdir(path, { recursive: true })
}
