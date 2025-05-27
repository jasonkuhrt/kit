import { Arr } from '#arr/index.js'
import type { Language } from '#language/index.js'
import * as NodeFs from 'node:fs/promises'

// todo: rename to "delete"

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
