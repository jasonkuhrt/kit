/**
 * This case of thrown value is impossible.
 * If it happens, then that means there is a defect in our code.
 */
export const neverCatch = (value: unknown): never => {
  never({ type: 'catch', value })
}

/**
 * This case is impossible.
 * If it happens, then that means there is a defect in our code.
 */
export const neverCase = (value: never): never => {
  never({ type: 'case', value })
}

/**
 * This code cannot be reached.
 * If it is reached, then that means there is a defect in our code.
 */
export const never: (context?: object | string) => never = context => {
  throw new Error('Something that should be impossible happened', { cause: context })
}

/**
 * Mark a code path as not yet implemented with optional debug arguments.
 *
 * @param args - Optional debug arguments to log.
 * @returns Never returns (throws an error).
 * @throws {Error} Always throws with todo message and arguments.
 *
 * @example
 * ```ts
 * const result = todo<string>('implement parser', { context: data })
 * ```
 */
export const todo = <type>(...args: any[]): type => {
  console.log(`TODO`)
  console.log(...args)
  throw new Error(`todo: ${JSON.stringify(args)}`)
}
