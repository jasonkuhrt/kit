import { ArrMut } from '#arr-mut'
import { Str } from '#str'

// Process argv

/**
 * Usually there is a seconed element too, the script that was executed, but not always.
 * For example in NodeJS Repl it would be missing.
 */
export type ProcessArgv = [string, ...string[]]

/**
 * Type guard to check if a value is a valid process argv array.
 *
 * Validates that the value is an array with at least one element (the executable path)
 * and that all elements are strings.
 *
 * @param value - The value to check
 * @returns true if the value is a valid ProcessArgv array
 *
 * @example
 * isProcessArgvLoose(['node', 'script.ts', '--flag']) // true
 * isProcessArgvLoose(['node']) // true (valid in REPL)
 * isProcessArgvLoose([]) // false (no executable path)
 * isProcessArgvLoose(['node', 123]) // false (non-string element)
 */
export const isProcessArgvLoose = (value: unknown): value is ProcessArgv => {
  return ArrMut.Type.is(value) && value.length >= 1 && value.every(Str.Type.is)
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

/**
 * Parses a process argv array into a structured Argv object.
 *
 * Extracts the executable path, script path (if present), and remaining arguments.
 * Throws an error if the input is not a valid argv array.
 *
 * @param value - The value to parse as argv
 * @returns A structured Argv object with execPath, scriptPath, and args
 * @throws {Error} If the value is not a valid argv array
 *
 * @example
 * // Normal CLI execution
 * parseArgvOrThrow(['node', 'script.ts', '--verbose', 'input.txt'])
 * // Returns: {
 * //   execPath: 'node',
 * //   scriptPath: 'script.ts',
 * //   args: ['--verbose', 'input.txt']
 * // }
 *
 * @example
 * // REPL execution (no script path)
 * parseArgvOrThrow(['node'])
 * // Returns: {
 * //   execPath: 'node',
 * //   scriptPath: null,
 * //   args: []
 * // }
 */
export const parseArgvOrThrow = (value: unknown): Argv => {
  if (!isProcessArgvLoose(value)) throw new Error(`Invalid argv: ${value}`)

  const [execPath, scriptPath = null, ...args] = value

  return {
    execPath,
    scriptPath,
    args,
  }
}
