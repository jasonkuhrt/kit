import { Arr, Fs, Path } from '@wollybeard/kit'
import { pipe } from '../fn/pipe.js'
import { argv } from './argv.js'
import { type CommandTarget, getCommandTarget } from './commend-target.js'

export const dispatch = async (commandsDirPath: string) => {
  const commandPointers = await discoverCommandPointers(commandsDirPath)

  const commandTarget = getCommandTarget(argv)
  const moduleTargetName = getModuleName(commandTarget)
  const commandPointer = Arr.findFirstMatching(commandPointers, { name: moduleTargetName })

  if (!commandPointer) {
    console.error(`Error: Command module "${moduleTargetName}" not found in commands directory ${commandsDirPath}`)
    process.exit(1)
  }

  try {
    await import(commandPointer.filePath)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const getModuleName = (commandTarget: CommandTarget): string => {
  const name = commandTarget.type === `sub` ? commandTarget.name : `$default`
  return name
}

export const discoverCommandPointers = async (
  commandsDirPath: string,
): Promise<{ name: string; filePath: string }[]> => {
  const commandsDirFileNamesRelative = await Fs.readDirFilesNames(commandsDirPath)
  if (!commandsDirFileNamesRelative) {
    console.error(`Error: Commands directory not found. Looked at ${commandsDirPath}`)
    process.exit(1)
  }

  // todo:
  // pipe(
  //   commandsDirFileNamesRelative,
  //   Arr.filterOutWith({
  //     base: Pat.any(Path.buildArtifactExtensions)
  //   }),
  //   Arr.map((parsedPath) => {
  //     return {
  //       name: parsedPath.name,
  //       filePath: Path.join(commandsDirPath, parsedPath.base),
  //     }
  //   })
  // )

  return commandsDirFileNamesRelative
    .map(Path.parse)
    .filter(parsedPath => {
      return !Path.buildArtifactExtensions.some(ext => parsedPath.base.endsWith(ext))
    })
    .map(parsedPath => {
      return {
        name: parsedPath.name,
        filePath: Path.join(commandsDirPath, parsedPath.base),
      }
    })
}
