import { FsLoc } from '#fs-loc'
import { Lang } from '#lang'
import { Schema as S } from 'effect'

/**
 * Get the current working directory as an AbsDir.
 * @returns The current working directory as a {@link FsLoc.AbsDir}
 * @example
 * ```ts
 * import { Pro } from '#pro'
 *
 * const currentDir = Pro.cwd()
 * // Returns FsLoc.AbsDir
 * ```
 */
export const cwd = (): FsLoc.AbsDir => {
  return S.decodeSync(FsLoc.AbsDir.String)(Lang.process.cwd())
}
