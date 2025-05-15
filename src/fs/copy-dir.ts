import * as NodeFs from 'node:fs/promises'
import type { Language } from '../language/index.js'
import { Obj } from '../obj/index.js'
import { Path } from '../path/index.js'
import { Str } from '../str/index.js'
import { makeDirectory } from './mutation.js'

export const defaultCopyDirOptions: CopyDirConfig = Object.freeze({
  ignore: [],
})

export interface CopyDirOptions {
  ignore?: Str.PatternInput
}

export const copyDirFactory = (options?: CopyDirOptions) => {
  const factoryDefaultOptions = Obj.merge(structuredClone(defaultCopyDirOptions), options ?? {})

  const _ = async (
    parameters: { from: string; to: string; options?: CopyDirOptions },
  ): Language.SideEffectAsync => {
    const config = Obj.merge(structuredClone(factoryDefaultOptions), parameters.options ?? {})
    await _copyDir({ ...parameters, config })
  }

  return _
}

export const copyDir = copyDirFactory()

// --- Internal

type CopyDirConfig = Required<CopyDirOptions>

const _copyDir = async (parameters: { from: string; to: string; config: CopyDirConfig }): Language.SideEffectAsync => {
  const { from, to, config } = parameters

  // Create target directory if it doesn't exist
  await makeDirectory(to)

  // Read all entities in the source directory
  const entries = await NodeFs.readdir(from, { withFileTypes: true })

  // Process each entity, skipping any that match the ignore patterns
  await Promise.all(
    entries
      .filter(entry => !Str.isMatchWith(config.ignore)(entry.name))
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
