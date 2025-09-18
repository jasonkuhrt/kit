import { ArrMut } from '#arr-mut'
import { FsPath } from '#fs-path'
import { Lang } from '#lang'
import { Str } from '#str'
import { Array, pipe } from 'effect'
import * as NodeFileSystem from 'node:fs/promises'
import { parseArgvOrThrow } from './argv.js'
import { type CommandTarget, getCommandTarget } from './commend-target.js'

/**
 * Dispatches CLI commands by discovering and executing command modules.
 *
 * Scans the specified directory for command files, matches the command from argv,
 * and dynamically imports and executes the appropriate command module.
 *
 * @param commandsDirPath - The absolute path to the directory containing command modules
 * @returns A promise that resolves when the command execution completes
 *
 * @example
 * // Directory structure:
 * // commands/
 * //   build.js
 * //   test.js
 * //   $default.js
 *
 * await dispatch('/path/to/commands')
 * // If argv is ['node', 'cli.js', 'build'], imports and executes build.js
 * // If argv is ['node', 'cli.js'], imports and executes $default.js
 */
export const dispatch = async (commandsDirPath: string) => {
  const commandPointers = await discoverCommandPointers(commandsDirPath)

  const argv = parseArgvOrThrow(Lang.process.argv)
  const commandTarget = getCommandTarget(argv)
  const moduleTargetName = getModuleName(commandTarget)
  const commandPointer = ArrMut.findFirstMatching(commandPointers, { name: moduleTargetName })

  if (!commandPointer) {
    const availableCommands = commandPointers.map(({ name }) => name).map(_ => `${Str.Char.rightwardsArrow} ${_}`).join(
      Str.Char.newline,
    )
    if (moduleTargetName === `$default`) {
      console.error(`Error: You must specify a command.\n\nAvailable commands:\n${availableCommands}`)
    } else {
      console.error(`Error: No such command "${moduleTargetName}".\n\nAvailable commands:\n${availableCommands}`)
    }
    Lang.process.exit(1)
  }

  try {
    await import(commandPointer.filePath)
  } catch (error) {
    console.error(error)
    Lang.process.exit(1)
  }
}

const getModuleName = (commandTarget: CommandTarget): string => {
  const name = commandTarget.type === `sub` ? commandTarget.name : `$default`
  return name
}

/**
 * Discovers available command modules in a directory.
 *
 * Scans the directory for JavaScript/TypeScript files and returns pointers
 * to each command with its name and file path. Filters out build artifacts.
 *
 * @param commandsDirPath - The absolute path to the directory containing command modules
 * @returns A promise resolving to an array of command pointers with name and filePath
 * @throws {Error} Exits process if the commands directory is not found
 *
 * @example
 * const commands = await discoverCommandPointers('/path/to/commands')
 * // Returns:
 * // [
 * //   { name: 'build', filePath: '/path/to/commands/build.js' },
 * //   { name: 'test', filePath: '/path/to/commands/test.js' },
 * //   { name: '$default', filePath: '/path/to/commands/$default.js' }
 * // ]
 */
export const discoverCommandPointers = async (
  commandsDirPath: string,
): Promise<{ name: string; filePath: string }[]> => {
  let commandsDirFileNamesRelative: string[] | null = null

  try {
    const entries = await NodeFileSystem.readdir(commandsDirPath, { withFileTypes: true })
    commandsDirFileNamesRelative = entries.filter(entry => entry.isFile()).map(entry => entry.name)
  } catch {
    commandsDirFileNamesRelative = null
  }

  if (!commandsDirFileNamesRelative) {
    console.error(`Error: Commands directory not found. Looked at ${commandsDirPath}`)
    Lang.process.exit(1)
  }

  const commandsDirPathDecoded = FsPath.AbsoluteDir.decodeSync(
    commandsDirPath.endsWith('/') ? commandsDirPath : `${commandsDirPath}/`,
  )

  return pipe(
    commandsDirFileNamesRelative,
    Array.map((fileName) => FsPath.RelativeFile.decodeSync(fileName)),
    Array.filter(filePath => {
      const lastSegment = filePath.segments[filePath.segments.length - 1]
      if (!lastSegment) return true
      return !FsPath.Extension.Extensions.buildArtifacts.some((ext: string) => lastSegment.endsWith(ext))
    }),
    Array.map(filePath => {
      const lastSegment = filePath.segments[filePath.segments.length - 1] || ''
      const name = lastSegment.includes('.')
        ? lastSegment.slice(0, lastSegment.lastIndexOf('.'))
        : lastSegment
      const absolutePath = FsPath.join(commandsDirPathDecoded, filePath)
      return {
        name,
        filePath: FsPath.encodeSync(absolutePath),
      }
    }),
  )
}
