import type { Argv } from './argv.js'
import { isNamedParameter } from './parameter.js'

export type CommandTarget = {
  type: `sub`
  name: string
  args: string[]
} | {
  type: `default`
  args: string[]
}

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
