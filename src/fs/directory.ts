import type { Language } from '#language/index.js'
import * as NodeFs from '#platform:fs/fs.js'

export const makeDirectory = async (path: string): Language.SideEffectAsync => {
  await NodeFs.mkdir(path, { recursive: true })
}
