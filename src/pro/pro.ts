import { Fs } from '#fs'
import { Lang } from '#lang'

/**
 * Get the current working directory as an AbsDir.
 * @returns The current working directory as a {@link Fs.Path.AbsDir}
 * @example
 * ```ts
 * import { Pro } from '#pro'
 *
 * const currentDir = Pro.cwd()
 * // Returns Fs.Path.AbsDir
 * ```
 */
export const cwd = (): Fs.Path.AbsDir => {
  return Fs.Path.AbsDir.fromString(Lang.process.cwd())
}
