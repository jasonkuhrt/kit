import type { Json } from '#json/index.js'
import { parse } from 'jsonc-parser'
import type { FileWriteInput } from '../types.js'
import { read, writeString } from './string.js'

export const readJson = async <data extends Json.Value>(path: string): Promise<data | undefined> => {
  const text = await read(path)
  if (text === null) return undefined
  const json = parse(text) as data
  return json
}

export const writeJson = async (file: FileWriteInput<Json.Value>): Promise<void> => {
  await writeString({ path: file.path, content: JSON.stringify(file.content, null, 2), hard: file.hard })
}
