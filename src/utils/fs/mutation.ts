import type { Lang } from '#lang'
import { Path } from '#path'
import { writeJson } from './data/json.ts'
import { writeString } from './data/string.ts'
import { makeDirectory } from './directory.ts'
import type { FileWriteInputMaybeJson } from './fs.ts'
import { exists } from './query.ts'

/**
 * Create a temporary directory in the system's temp folder.
 *
 * @param name - Optional name for the directory. Defaults to current timestamp.
 * @returns The path to the created temporary directory.
 *
 * @example
 * ```ts
 * const tempDir = await makeTemporaryDirectory('my-test')
 * // returns '/tmp/my-test' or similar
 * ```
 */
export const makeTemporaryDirectory = async (name: string = Date.now().toString()): Promise<string> => {
  const { tmpdir } = await import('node:os') // todo make isomorphic
  const osTmpDirPath = tmpdir()
  const path = Path.join(osTmpDirPath, name)
  await makeDirectory(path)
  return path
}

/**
 * Write content to a file. Automatically handles JSON or string content.
 *
 * @param params - The write parameters.
 * @param params.content - The content to write (string or JSON-serializable object).
 * @param params.path - The file path to write to.
 * @param params.hard - If true, deletes the file first to force changes to be detected.
 *
 * @example
 * ```ts
 * // write string
 * await write({ path: './file.txt', content: 'Hello' })
 *
 * // write json
 * await write({ path: './config.json', content: { port: 3000 } })
 * ```
 */
export const write = async (
  { content, path, hard }: FileWriteInputMaybeJson,
): Promise<void> => {
  if (typeof content === `string`) {
    await writeString({ content, path, hard })
    return
  }

  await writeJson({ content, path, hard })
}

/**
 * Write multiple files in parallel.
 *
 * @param files - Array of file write configurations.
 *
 * @example
 * ```ts
 * await writeMany([
 *   { path: './file1.txt', content: 'Hello' },
 *   { path: './file2.json', content: { foo: 'bar' } }
 * ])
 * ```
 */
export const writeMany = async (files: FileWriteInputMaybeJson[]): Lang.SideEffectAsync => {
  await Promise.all(files.map(file => write(file)))
}

/**
 * Write a file only if it doesn't already exist.
 *
 * @param file - The file write configuration.
 *
 * @example
 * ```ts
 * await writeMissing({
 *   path: './default-config.json',
 *   content: { port: 3000 }
 * })
 * // only writes if file doesn't exist
 * ```
 */
export const writeMissing = async (file: FileWriteInputMaybeJson): Lang.SideEffectAsync => {
  if (await exists(file.path)) return
  await write(file)
}
