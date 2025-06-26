import type { Argv } from './argv.ts'
import { isNamedParameter } from './parameter.ts'

export type CommandTarget = {
  type: `sub`
  name: string
  args: string[]
} | {
  type: `default`
  args: string[]
}

/**
 * Determines the command target from parsed argv.
 *
 * Analyzes the first argument to determine if it's a subcommand name or if
 * the default command should be used. Named parameters (starting with '-')
 * are not considered subcommands.
 *
 * @param argv - The parsed argv object
 * @returns A CommandTarget indicating either a subcommand or default command
 *
 * @example
 * // Subcommand target
 * getCommandTarget({ execPath: 'node', scriptPath: 'cli.ts', args: ['build', '--watch'] })
 * // Returns: { type: 'sub', name: 'build', args: ['--watch'] }
 *
 * @example
 * // Default command (no subcommand)
 * getCommandTarget({ execPath: 'node', scriptPath: 'cli.ts', args: ['--help'] })
 * // Returns: { type: 'default', args: ['--help'] }
 *
 * @example
 * // Default command (empty args)
 * getCommandTarget({ execPath: 'node', scriptPath: 'cli.ts', args: [] })
 * // Returns: { type: 'default', args: [] }
 */
export const getCommandTarget = (argv: Argv): CommandTarget => {
  const { args: [maybeCommandName, ...args] } = argv

  const commandName = maybeCommandName?.trim()
  if (!commandName || isNamedParameter(commandName)) {
    return {
      type: `default`,
      args: argv.args,
    }
  }
  return {
    type: `sub`,
    name: commandName,
    args,
  }
}
