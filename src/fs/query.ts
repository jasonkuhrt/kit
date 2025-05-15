import { constants } from 'node:fs'
import * as FS from 'node:fs/promises'
import { Err } from '../err/index.js'

export const exists = async (path: string): Promise<boolean> => {
  try {
    await FS.access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export const readDirFilesNames = async (path: string): Promise<string[] | null> => {
  try {
    const entities = await FS.readdir(path, { withFileTypes: true })
    return entities.filter((entity) => entity.isFile()).map((entity) => entity.name)
  } catch {
    return null
  }
}

export const readDirEntityNames = async (path: string): Promise<string[] | null> => {
  try {
    return await FS.readdir(path)
  } catch {
    return null
  }
}

/**
 * testing
 */
export const read = async (path: string): Promise<string | null> => {
  try {
    return await FS.readFile(path, { encoding: `utf-8` })
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

export const isEmptyDir = async (path: string): Promise<boolean> => {
  const files = await FS.readdir(path)
  return files.length === 0
}
