import { Mask } from '#mask'
import type { InferOptions } from '#mask/mask'
import { Prom } from '#prom'
import type { Debug } from './debug.ts'

/**
 * Payload for function start event.
 */
interface TraceStartPayload {
  /** Function arguments (when input logging is enabled) */
  input?: unknown
  /** Call number for this traced function (when call counting is enabled) */
  call?: number
}

/**
 * Payload for function completion event.
 */
interface TraceEndPayload {
  /** Function result (when output logging is enabled) */
  result?: unknown
  /** Execution duration in milliseconds (when duration logging is enabled) */
  duration?: number
  /** Call number for this traced function (when call counting is enabled) */
  call?: number
}

/**
 * Payload for function error event.
 */
interface TraceErrorPayload {
  /** Error that occurred during execution */
  error: unknown
  /** Execution duration in milliseconds (when duration logging is enabled) */
  duration?: number
  /** Call number for this traced function (when call counting is enabled) */
  call?: number
}

/**
 * Options for configuring function tracing.
 */
export interface TraceOptions<Args extends any[], Result> {
  /**
   * Custom name to use in logs instead of function name.
   * @default The function's name property, or 'anonymous' if unnamed
   */
  name?: string

  /**
   * Whether to log input arguments.
   * - `true`: Show all arguments
   * - `false`: Hide arguments (default)
   * - `InferOptions<T>`: Create mask for first argument (if object)
   * - `Function`: Custom mask function for arguments
   *
   * Note: Mask options only apply to the first argument if it's an object.
   */
  input?: boolean | InferOptions<Args[0]> | ((args: Args) => unknown)

  /**
   * Whether to log output/result.
   * - `true`: Show result
   * - `false`: Hide result (default)
   * - `InferOptions<Result>`: Create mask using same options as Mask.create()
   * - `Function`: Custom mask function for result
   */
  output?: boolean | InferOptions<Result> | ((result: Result) => unknown)

  /**
   * Whether to log execution duration.
   * @default false
   */
  duration?: boolean

  /**
   * Whether to track and log call count.
   * @default false
   */
  count?: boolean

  /**
   * Conditional logging - only log when this returns true.
   */
  when?: (args: Args) => boolean
}

/**
 * Process masking options to transform data.
 */
const processMask = <T>(
  maskOption: boolean | InferOptions<T> | ((data: T) => unknown) | undefined,
  data: T,
): unknown => {
  if (maskOption === true) return data
  if (!maskOption) return undefined
  if (typeof maskOption === 'function') return maskOption(data)

  // Object mask options - for input args, mask first arg if it's an object
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const mask = Mask.create(maskOption as InferOptions<any>)
    const maskedFirstArg = Mask.apply(data[0], mask)
    return [maskedFirstArg, ...data.slice(1)]
  }

  // For non-array data (like result), apply mask directly if it's an object
  if (typeof data === 'object' && data !== null) {
    const mask = Mask.create(maskOption as InferOptions<T>)
    return Mask.apply(data, mask)
  }

  // Can't apply object mask to non-object data
  return data
}

/**
 * Wrap a function to add debug logging for its execution.
 * Works seamlessly with both synchronous and asynchronous functions.
 *
 * @param debugLogger - The debug instance to use for logging
 * @param fn - The function to trace
 * @param options - Configuration options for tracing
 * @returns The wrapped function with the same signature
 *
 * @example
 * ```ts
 * import { Debug } from '@wollybeard/kit/debug'
 *
 * const debug = Debug.create('myapp')
 *
 * // Using the bound method (recommended)
 * const traced = debug.trace(myFunction)
 *
 * // With options
 * const traced2 = debug.trace(fetchUser, {
 *   name: 'fetchUser',
 *   duration: true
 * })
 *
 * // Direct usage with debug logger
 * const traced3 = trace(debug, calculate, {
 *   input: true,
 *   output: true
 * })
 *
 * // With masking using custom functions
 * const traced4 = debug.trace(createUser, {
 *   input: (args) => ({ ...args[0], password: '***' }),
 *   output: (user) => ({ ...user, token: '***' })
 * })
 *
 * // With masking using Mask options
 * const traced5 = debug.trace(createUser, {
 *   input: { password: false }, // Hide password field
 *   output: ['id', 'name', 'email'] // Only show these fields
 * })
 *
 * // Conditional logging with call counting
 * const traced6 = debug.trace(apiCall, {
 *   when: (args) => args[0].length > 100,
 *   count: true,
 *   duration: true
 * })
 * ```
 */
export const trace = <Args extends any[], Result>(
  debugLogger: Debug,
  fn: (...args: Args) => Result,
  options: TraceOptions<Args, Result> = {},
): (...args: Args) => Result => {
  const fnName = options.name ?? fn.name ?? 'anonymous'

  // Call count state within this trace closure
  let callCount = 0

  return function traced(this: any, ...args: Args): Result {
    // Check conditional logging
    if (options.when && !options.when(args)) {
      return fn.apply(this, args)
    }

    // Increment call count
    if (options.count) {
      callCount++
    }

    // Create a child debug instance namespaced to the function name
    const fnDebugger = debugLogger.sub(fnName)

    // Process input masking
    const inputData = processMask(options.input, args)

    const startTime = options.duration ? performance.now() : 0

    // Log start
    const startPayload: TraceStartPayload = {}
    if (inputData !== undefined) startPayload.input = inputData
    if (options.count) startPayload.call = callCount
    fnDebugger('start', Object.keys(startPayload).length > 0 ? startPayload : undefined)

    // Use Prom utilities to handle both sync and async cases elegantly
    return Prom.maybeAsync(
      () => fn.apply(this, args),
      {
        // oxlint-disable-next-line
        then(result: any) {
          // Log completion inline
          const duration = options.duration ? performance.now() - startTime : 0

          // Process output masking
          const outputData = processMask(options.output, result)

          const payload: TraceEndPayload = {}
          if (options.duration) payload.duration = duration
          if (outputData !== undefined) payload.result = outputData
          if (options.count) payload.call = callCount

          fnDebugger('end', Object.keys(payload).length > 0 ? payload : undefined)

          return result
        },
        catch(error) {
          // Log error inline
          const duration = options.duration ? performance.now() - startTime : 0

          const payload: TraceErrorPayload = { error }
          if (options.duration) payload.duration = duration
          if (options.count) payload.call = callCount

          fnDebugger('error', payload)
          throw error
        },
      },
    ) as any
  }
}
