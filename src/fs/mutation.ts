import * as NodeFs from 'node:fs/promises'
import * as Path from 'node:path'
import { Arr } from '../arr/index.js'
import type { Language } from '../language/index.js'
import type { FileWriteInput, FileWriteInputMaybeJson } from './fs.js'
import { writeJson } from './json.js'
import { exists } from './query.js'

export const tmpDir = (prefix: string = Date.now().toString() + '-') => {
  return NodeFs.mkdtemp(prefix)
}

export const makeDirectory = async (path: string): Language.SideEffectAsync => {
  await NodeFs.mkdir(path, { recursive: true })
}

export const write = async (
  { content, path, hard }: FileWriteInputMaybeJson,
): Promise<void> => {
  if (typeof content === `string`) {
    await writeString({ content, path, hard })
    return
  }

  await writeJson({ content, path, hard })
}

export const writeMany = async (files: FileWriteInputMaybeJson[]): Language.SideEffectAsync => {
  await Promise.all(files.map(file => write(file)))
}

export const writeMissing = async (file: FileWriteInputMaybeJson): Language.SideEffectAsync => {
  if (await exists(file.path)) return
  await write(file)
}

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

export const removeMany = async (path: string | string[]): Language.SideEffectAsync => {
  const path_ = Arr.sure(path)
  await Promise.all(path_.map(p => remove(p)))
}

export const writeString = async (file: FileWriteInput): Language.SideEffectAsync => {
  await makeDirectory(Path.dirname(file.path))
  if (file.hard) {
    // Delete first e.g. to force VSCode to see the change without needing a restart.
    await removeMany(file.path)
  }
  await NodeFs.writeFile(file.path, file.content, { encoding: `utf-8` })
}
