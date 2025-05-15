import { Arr } from '../arr/index.js'
import { Str } from '../str/index.js'

// Process argv

export type ProcessArgv = [string, string, ...string[]]

export const isProcessArgvLoose = (value: unknown): value is ProcessArgv => {
  return Arr.is(value) && value.length >= 2 && value.every(Str.is)
}

// argv

export interface Argv {
  execPath: string
  scriptPath: string
  args: string[]
}

export const parseArgvOrThrow = (value: unknown): Argv => {
  if (!isProcessArgvLoose(value)) throw new Error(`Invalid argv: ${value}`)

  const [execPath, scriptPath, ...args] = value

  return {
    execPath,
    scriptPath,
    args,
  }
}

export const argv = parseArgvOrThrow(process.argv)
