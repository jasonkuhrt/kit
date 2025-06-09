import { Err } from '#err/index.js'
import * as NodeFs from '#platform:fs/fs.js'
import { isNotFoundError } from './error.js'

export const exists = async (path: string): Promise<boolean> => {
  try {
    // todo but isomoprhic
    // import { constants } from 'node:fs'
    // await NodeFs.access(path, constants.F_OK)
    await NodeFs.stat(path)
    return true
  } catch {
    return false
  }
}

export const readDirFilesNames = async (path: string): Promise<string[] | null> => {
  try {
    const entities = await NodeFs.readdir(path, { withFileTypes: true })
    return entities.filter((entity) => entity.isFile()).map((entity) => entity.name)
  } catch {
    return null
  }
}

export const readDirEntityNames = async (path: string): Promise<string[] | null> => {
  try {
    return await NodeFs.readdir(path)
  } catch {
    return null
  }
}

export const isEmptyDir = async (path: string): Promise<boolean> => {
  const files = await NodeFs.readdir(path)
  return files.length === 0
}

export const stat = Err.tryCatchify(NodeFs.stat, [isNotFoundError])
