import { FsLoc } from '#fs-loc'
import { Lang } from '#lang'

/**
 * Get the current working directory as an AbsDir.
 * @returns The current working directory as a {@link FsLoc.AbsDir.AbsDir}
 * @example
 * ```ts
 * import { Pro } from '#pro'
 *
 * const currentDir = Pro.cwd()
 * // Returns FsLoc.AbsDir.AbsDir
 * ```
 */
export const cwd = (): FsLoc.AbsDir.AbsDir => {
  return FsLoc.AbsDir.decodeSync(Lang.process.cwd())
}
