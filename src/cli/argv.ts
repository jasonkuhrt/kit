import { Arr } from '../arr/index.js'
import { Str } from '../str/index.js'

// Process argv

/**
 * Usually there is a seconed element too, the script that was executed, but not always.
 * For example in NodeJS Repl it would be missing.
 */
export type ProcessArgv = [string, ...string[]]

export const isProcessArgvLoose = (value: unknown): value is ProcessArgv => {
  return Arr.is(value) && value.length >= 1 && value.every(Str.is)
}

// argv

export interface Argv {
  execPath: string
  /**
   * Not present for example when in a NodeJS REPL.
   */
  scriptPath: null | string
  args: string[]
}

export const parseArgvOrThrow = (value: unknown): Argv => {
  if (!isProcessArgvLoose(value)) throw new Error(`Invalid argv: ${value}`)

  const [execPath, scriptPath = null, ...args] = value

  return {
    execPath,
    scriptPath,
    args,
  }
}
