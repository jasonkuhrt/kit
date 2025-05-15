import { Fs, Path } from '@wollybeard/kit'
import { argv } from './argv.js'
import { type CommandTarget, getCommandTarget } from './commend-target.js'

export const dispatch = async (commandsDirPath: string) => {
  const commandTarget = getCommandTarget(argv)
  const moduleTargetName = getModuleName(commandTarget)

  const commandsDirFiles = await Fs.readDirFilesNames(commandsDirPath)
  if (!commandsDirFiles) {
    console.error(`Error: Commands directory not found or empty. Looked at ${commandsDirPath}`)
    process.exit(1)
  }

  const commandFilePathRelative = commandsDirFiles.find((fileName) => Path.parse(fileName).name === moduleTargetName)

  if (!commandFilePathRelative) {
    console.error(`Error: Command module "${moduleTargetName}" not found in commands directory ${commandsDirPath}`)
    process.exit(1)
  }

  const commandFilePathAbsolute = Path.join(commandsDirPath, commandFilePathRelative)
  const moduleTargetId = commandFilePathAbsolute

  try {
    await import(moduleTargetId)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const getModuleName = (commandTarget: CommandTarget): string => {
  const name = commandTarget.type === `sub` ? commandTarget.name : `$default`
  return name
}
