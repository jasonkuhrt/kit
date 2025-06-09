import type { Language } from '#language/index.js'
import { Path } from '#path/index.js'
import { writeJson } from './data/json.js'
import { writeString } from './data/string.js'
import { makeDirectory } from './directory.js'
import type { FileWriteInputMaybeJson } from './fs.js'
import { exists } from './query.js'

export const makeTemporaryDirectory = async (name: string = Date.now().toString()): Promise<string> => {
  const { tmpdir } = await import('node:os') // todo make isomorphic
  const osTmpDirPath = tmpdir()
  const path = Path.join(osTmpDirPath, name)
  await makeDirectory(path)
  return path
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
