import { Err } from '#err/index.js'
import { constants } from 'node:fs'
import * as NodeFS from 'node:fs/promises'
import { isNotFoundError } from './error.js'

export const exists = async (path: string): Promise<boolean> => {
  try {
    await NodeFS.access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export const readDirFilesNames = async (path: string): Promise<string[] | null> => {
  try {
    const entities = await NodeFS.readdir(path, { withFileTypes: true })
    return entities.filter((entity) => entity.isFile()).map((entity) => entity.name)
  } catch {
    return null
  }
}

export const readDirEntityNames = async (path: string): Promise<string[] | null> => {
  try {
    return await NodeFS.readdir(path)
  } catch {
    return null
  }
}

export const isEmptyDir = async (path: string): Promise<boolean> => {
  const files = await NodeFS.readdir(path)
  return files.length === 0
}

export const stat = Err.tryCatchify(NodeFS.stat, [isNotFoundError])
