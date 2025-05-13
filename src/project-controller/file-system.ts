import { FsLayout } from '../fs-layout/index.js'
import type { FsRelative } from '../fs-relative/index.js'

export namespace FileStorage {
  export interface FileStorage {
    utilities: FsRelative.FsRelative
    cwd: string
    set: <directoryLayout extends FsLayout.Tree>(
      directoryLayout: directoryLayout,
    ) => Promise<directoryLayout>
  }

  export const create = (parameters: { fsRelative: FsRelative.FsRelative }): FileStorage => {
    const fsRelative = parameters.fsRelative

    return {
      utilities: fsRelative,
      cwd: fsRelative.cwd,
      set: async layout => {
        const flat = FsLayout.normalizeToFlat(layout)
        const entries = Object.entries(flat)
        await Promise.all(entries.map(async ([path, content]) => {
          await fsRelative.write({ path, content })
        }))

        const tree = FsLayout.normalizeToTree(layout)
        return tree as any
      },
    }
  }
}
