import { Arr, Fs, Path, Str } from '@wollybeard/kit'
import { parseArgvOrThrow } from './argv.js'
import { type CommandTarget, getCommandTarget } from './commend-target.js'

export const dispatch = async (commandsDirPath: string) => {
  const commandPointers = await discoverCommandPointers(commandsDirPath)

  const argv = parseArgvOrThrow(process.argv)
  const commandTarget = getCommandTarget(argv)
  const moduleTargetName = getModuleName(commandTarget)
  const commandPointer = Arr.findFirstMatching(commandPointers, { name: moduleTargetName })

  if (!commandPointer) {
    const availableCommands = commandPointers.map(({ name }) => name).map(_ => `${Str.Char.rightwardsArrow} ${_}`).join(
      Str.Char.newline,
    )
    if (moduleTargetName === `$default`) {
      console.error(`Error: You must specify a command.\n\nAvailable commands:\n${availableCommands}`)
    } else {
      console.error(`Error: No such command "${moduleTargetName}".\n\nAvailable commands:\n${availableCommands}`)
    }
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
