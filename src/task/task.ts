import type { Mask } from '#mask'
import type { Report } from './report.ts'
import { exitWithReport } from './report.ts'

export interface Definition<$Input = any, $Output = any> {
  name: string
  mask?: MaskOptions<$Input, $Output> | undefined
}

export interface Task<$Input, $Output> {
  (input: $Input): Promise<Report<$Input, $Output>>
  definition: Definition<$Input, $Output>
}

export interface MaskOptions<$Input, $Output> {
  /**
   * Mask to apply to input values when formatting reports.
   * @default true (show all)
   */
  input?: Mask.InferOptions<$Input> | undefined
  /**
   * Mask to apply to output values when formatting reports.
   * @default true (show all)
   */
  output?: Mask.InferOptions<$Output> | undefined
}

/**
 * Create a task wrapper around an async function.
 *
 * Tasks provide:
 * - Automatic timing measurements
 * - Error capture and reporting
 * - Optional data masking for sensitive values
 * - Structured report generation
 *
 * @param fn - The async function to wrap
 * @param options - Configuration options
 * @returns A task function that returns execution reports
 *
 * @example
 * ```ts
 * const fetchUser = Task.create(
 *   async (id: string) => {
 *     const user = await db.users.findById(id)
 *     if (!user) throw new Error('User not found')
 *     return user
 *   },
 *   {
 *     name: 'fetch-user',
 *     mask: {
 *       output: { password: false, apiKey: false }
 *     }
 *   }
 * )
 *
 * const report = await fetchUser('123')
 * console.log(Task.formatReport(report))
 * ```
 */
export const create = <$Input, $Output>(
  fn: (input: $Input) => Promise<$Output>,
  options?: {
    /**
     * Name for the task, used in reports.
     * @default The function name or 'anonymous'
     */
    name?: string | undefined
    /**
     * Optional masks to apply when formatting reports.
     * Does not affect the actual execution or returned data.
     */
    mask?: MaskOptions<$Input, $Output> | undefined
  } | undefined,
): Task<$Input, $Output> => {
  const definition: Definition<$Input, $Output> = {
    name: options?.name ?? (fn.name || 'anonymous'),
    ...(options?.mask ? { mask: options.mask } : {}),
  }

  const task = async (input: $Input): Promise<Report<$Input, $Output>> => {
    const start = performance.now()

    try {
      const output = await fn(input)
      const end = performance.now()

      return {
        task: definition,
        execution: {
          input,
          output,
          timings: {
            start,
            end,
            duration: end - start,
          },
        },
      }
    } catch (error) {
      const end = performance.now()

      return {
        task: definition,
        execution: {
          input,
          output: error as Error,
          timings: {
            start,
            end,
            duration: end - start,
          },
        },
      }
    }
  }

  task.definition = definition

  return task
}

/**
 * Create and execute a task, then exit the process with the report.
 *
 * This is a convenience function that combines:
 * 1. Creating a task
 * 2. Executing it with input
 * 3. Formatting and printing the report
 * 4. Exiting with appropriate status code (0 for success, 1 for error)
 *
 * Useful for CLI tools and scripts.
 *
 * @param fn - The function to wrap as a task
 * @param input - Input to pass to the task
 * @param options - Combined task creation and format options
 * @returns Never returns (exits the process)
 *
 * @example
 * ```ts
 * // In a CLI script
 * await Task.runAndExit(
 *   async (args: string[]) => {
 *     const config = parseArgs(args)
 *     const result = await processData(config)
 *     return result
 *   },
 *   process.argv.slice(2),
 *   {
 *     name: 'process-data',
 *     mask: { input: { apiKey: false } }
 *   }
 * )
 * ```
 */
export const runAndExit = async <$Input, $Output>(
  fn: (input: $Input) => Promise<$Output>,
  input: $Input,
  options?: {
    name?: string | undefined
    mask?: MaskOptions<$Input, $Output> | undefined
    /**
     * Force all masks to show data (useful for debugging)
     */
    debug?: boolean | undefined
  } | undefined,
): Promise<never> => {
  const task = create(fn, {
    ...(options?.name ? { name: options.name } : {}),
    ...(options?.mask ? { mask: options.mask } : {}),
  })
  const report = await task(input)
  return exitWithReport(report, {
    ...(options?.debug ? { debug: options.debug } : {}),
    ...(options?.mask ? { mask: options.mask } : {}),
  })
}
