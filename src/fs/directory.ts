import type { Language } from '#language/index.js'
import * as NodeFs from 'node:fs/promises'

export const makeDirectory = async (path: string): Language.SideEffectAsync => {
  await NodeFs.mkdir(path, { recursive: true })
}
