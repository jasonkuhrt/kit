import type { Json } from '#json'
import { parse } from 'jsonc-parser'
import type { FileWriteInput } from '../types.ts'
import { read, writeString } from './string.ts'

/**
 * Read a JSON file from the filesystem.
 *
 * @param path - The file path to read from.
 * @returns The parsed JSON data, or undefined if the file doesn't exist.
 *
 * @example
 * ```ts
 * const config = await readJson<{ port: number }>('./config.json')
 * // config is { port: 3000 } or undefined
 * ```
 */
export const readJson = async <data extends Json.Value>(path: string): Promise<data | undefined> => {
  const text = await read(path)
  if (text === null) return undefined
  const json = parse(text) as data
  return json
}

/**
 * Write JSON data to a file.
 *
 * @param file - The file configuration with path, content, and optional hard write mode.
 * @param file.path - The file path to write to.
 * @param file.content - The JSON data to write.
 * @param file.hard - If true, deletes the file first to force changes to be detected.
 *
 * @example
 * ```ts
 * await writeJson({
 *   path: './config.json',
 *   content: { port: 3000 },
 *   hard: true
 * })
 * ```
 */
export const writeJson = async (file: FileWriteInput<Json.Value>): Promise<void> => {
  await writeString({ path: file.path, content: JSON.stringify(file.content, null, 2), hard: file.hard })
}
