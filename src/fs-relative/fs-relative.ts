import { Fs } from '../fs/index.js'
import { Path } from '../path/index.js'

export interface FsRelative {
  cwd: string
  changeDirectory: (path: string) => FsRelative
  write: typeof Fs.write
}

export const create = (parameters: { directory: string }): FsRelative => {
  const ensureAbsolute = Path.ensureAbsoluteWith(parameters.directory)

  const cwd = ensureAbsolute('./')

  const absolutifyFile = (file: Fs.FileWriteInputMaybeJson) => {
    file.path = ensureAbsolute(file.path)
  }

  return {
    cwd,
    changeDirectory: path => {
      const fsRelative = create({ directory: Path.ensureAbsolute(path, cwd) })
      return fsRelative
    },
    write: (file) => {
      absolutifyFile(file)
      return Fs.write(file)
    },
  }
}
