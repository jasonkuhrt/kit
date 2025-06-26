import type { Lang } from '#lang'
import { Obj } from '#obj'
import { Path } from '#path'
import * as NodeFs from '#platform:fs/fs'
import { Str } from '#str'
import { makeDirectory } from './directory.ts'

/**
 * Default options for directory copying operations.
 */
export const defaultCopyDirOptions: CopyDirConfig = Object.freeze({
  ignore: [],
})

/**
 * Options for directory copying operations.
 */
export interface CopyDirOptions {
  ignore?: Str.PatternsInput
}

/**
 * Create a directory copy function with default options.
 *
 * @param options - Default options to apply to all copy operations.
 * @returns A copy function with the specified defaults.
 *
 * @example
 * ```ts
 * const copyIgnoringNodeModules = copyDirFactory({
 *   ignore: ['node_modules']
 * })
 * await copyIgnoringNodeModules({ from: './src', to: './dist' })
 * ```
 */
export const copyDirFactory = (options?: CopyDirOptions) => {
  const factoryDefaultOptions = Obj.merge(structuredClone(defaultCopyDirOptions), options ?? {})

  const _ = async (
    parameters: { from: string; to: string; options?: CopyDirOptions },
  ): Lang.SideEffectAsync => {
    const config = Obj.merge(structuredClone(factoryDefaultOptions), parameters.options ?? {})
    await _copyDir({ ...parameters, config })
  }

  return _
}

/**
 * Copy a directory recursively.
 *
 * @param parameters - The copy parameters.
 * @param parameters.from - The source directory path.
 * @param parameters.to - The destination directory path.
 * @param parameters.options - Optional copy configuration.
 * @param parameters.options.ignore - Patterns to ignore during copy.
 *
 * @example
 * ```ts
 * await copyDir({
 *   from: './source',
 *   to: './destination',
 *   options: { ignore: ['*.tmp', '.DS_Store'] }
 * })
 * ```
 */
export const copyDir = copyDirFactory()

// --- Internal

type CopyDirConfig = Required<CopyDirOptions>

const _copyDir = async (parameters: { from: string; to: string; config: CopyDirConfig }): Lang.SideEffectAsync => {
  const { from, to, config } = parameters

  // Create target directory if it doesn't exist
  await makeDirectory(to)

  // Read all entities in the source directory
  const entries = await NodeFs.readdir(from, { withFileTypes: true })

  // Process each entity, skipping any that match the ignore patterns
  await Promise.all(
    entries
      .filter(entry => !Str.isMatchAnyWith(config.ignore)(entry.name))
      .map(async entry => {
        const sourcePath = Path.join(from, entry.name)
        const targetPath = Path.join(to, entry.name)

        if (entry.isDirectory()) {
          // Recursively copy subdirectories
          await _copyDir({
            from: sourcePath,
            to: targetPath,
            config,
          })
        } else if (entry.isFile()) {
          // Copy files
          await NodeFs.copyFile(sourcePath, targetPath)
        } else if (entry.isSymbolicLink()) {
          // Handle symbolic links by copying the link target
          const linkTarget = await NodeFs.readlink(sourcePath)
          await NodeFs.symlink(linkTarget, targetPath)
        }
        // Other file types are ignored
      }),
  )
}
