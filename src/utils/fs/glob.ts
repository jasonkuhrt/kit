import { Effect } from 'effect'
import * as TinyGlobby from 'tinyglobby'

/**
 * Options for globbing file patterns, excluding the patterns parameter.
 */
export type GlobOptions = Omit<TinyGlobby.GlobOptions, 'patterns'>

/**
 * Effect-based wrapper for globbing file patterns.
 * Returns an Effect that resolves to an array of matched file paths.
 *
 * @param pattern - The glob pattern(s) to match against
 * @param options - Additional globbing options
 * @returns Effect containing array of matched file paths
 *
 * @example
 * ```ts
 * import { Glob } from '#glob'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   const tsFiles = yield* Glob.glob('src/**' + '/*.js')
 *   console.log('Found', tsFiles.length, 'TypeScript files')
 * })
 *
 * Effect.runPromise(program)
 * ```
 */
export const glob = (
  pattern: string | string[],
  options?: GlobOptions,
): Effect.Effect<string[], Error> =>
  Effect.tryPromise({
    try: () => TinyGlobby.glob(pattern, options),
    catch: (error) => new Error(`Failed to glob pattern: ${String(error)}`),
  })

/**
 * Synchronous Effect-based wrapper for globbing file patterns.
 * Uses the synchronous version of glob internally.
 *
 * @param pattern - The glob pattern(s) to match against
 * @param options - Additional globbing options
 * @returns Effect containing array of matched file paths
 *
 * @example
 * ```ts
 * import { Glob } from '#glob'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   const jsFiles = yield* Glob.globSync('**' + '/*.js', { cwd: './dist' })
 *   console.log('Found', jsFiles.length, 'JavaScript files in dist')
 * })
 *
 * Effect.runSync(program)
 * ```
 */
export const globSync = (
  pattern: string | string[],
  options?: GlobOptions,
): Effect.Effect<string[], Error> =>
  Effect.try({
    try: () => TinyGlobby.globSync(pattern, options),
    catch: (error) => error instanceof Error ? error : new Error(String(error)),
  })
