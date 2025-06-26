import { ArrMut } from '#arr-mut'
import type { Lang } from '#lang'
import * as NodeFs from '#platform:fs/fs'

// todo: rename to "delete"

/**
 * Remove a file or directory recursively.
 *
 * @param path - The path to remove.
 *
 * @example
 * ```ts
 * await remove('./temp-dir')
 * // removes directory and all contents
 * ```
 */
export const remove = async (path: string): Promise<void> => {
  try {
    await NodeFs.rm(path, { recursive: true, force: true })
  } catch (error_) {
    const error = error_ as NodeJS.ErrnoException
    if (error.code !== `ENOENT`) {
      throw error
    }
  }
}

/**
 * Remove multiple files or directories recursively.
 *
 * @param path - A single path or array of paths to remove.
 *
 * @example
 * ```ts
 * await removeMany(['./temp1', './temp2', './temp3'])
 * // removes all specified paths
 * ```
 */
export const removeMany = async (path: string | string[]): Lang.SideEffectAsync => {
  const path_ = ArrMut.sure(path)
  await Promise.all(path_.map(p => remove(p)))
}
