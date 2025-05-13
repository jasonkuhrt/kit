import { Fs } from '../fs/index.js'
import { Path } from '../path/index.js'

export interface FsRelative {
  cwd: string
  changeDirectory: (path: string) => FsRelative
  write: typeof Fs.write
}

export const create = (parameters: { directory: string }): FsRelative => {
  const absolutify = Path.absolutify(parameters.directory)

  const cwd = absolutify('./')

  const absolutifyFile = (file: Fs.FileWriteInputMaybeJson) => {
    file.path = absolutify(file.path)
  }

  return {
    cwd,
    changeDirectory: path => {
      const fsRelative = create({ directory: Path.absolutify(cwd)(path) })
      return fsRelative
    },
    write: (file) => {
      absolutifyFile(file)
      return Fs.write(file)
    },
  }
}
