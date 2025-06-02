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

export const todo = <type>(...args: any[]): type => {
  console.log(`TODO`)
  console.log(...args)
  throw new Error(`todo: ${JSON.stringify(args)}`)
}
