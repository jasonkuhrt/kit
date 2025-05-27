import { Err } from '#err/index.js'
import type { Language } from '#language/index.js'
import { Path } from '#path/index.js'
import * as NodeFs from 'node:fs/promises'
import * as NodeFS from 'node:fs/promises'
import { removeMany } from '../delete.js'
import { makeDirectory } from '../directory.js'
import type { FileWriteInput } from '../fs.js'

export const writeString = async (file: FileWriteInput): Language.SideEffectAsync => {
  await makeDirectory(Path.dirname(file.path))
  if (file.hard) {
    // Delete first e.g. to force VSCode to see the change without needing a restart.
    await removeMany(file.path)
  }
  await NodeFs.writeFile(file.path, file.content, { encoding: `utf-8` })
}

export const read = async (path: string): Promise<string | null> => {
  try {
    return await NodeFS.readFile(path, { encoding: `utf-8` })
    // eslint-disable-next-line
  } catch (error) {
    if (error instanceof Error && `code` in error && error.code === `ENOENT`) {
      return null
    }
    throw error
  }
}

/**
 * If the file does not exist, throw an error.
 */
export const readOrThrow = Err.guardNull(read)
