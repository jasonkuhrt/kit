import { FsLoc } from '#fs-loc'
import { Effect } from 'effect'
import * as TinyGlobby from 'tinyglobby'

/**
 * Options for globbing file patterns, excluding the patterns parameter.
 */
export type GlobOptions = Omit<TinyGlobby.GlobOptions, 'patterns'>

/**
 * Type helper to infer FsLoc return type based on absolute option.
 * - If absolute is true, returns Abs (AbsFile | AbsDir)
 * - Otherwise returns Rel (RelFile | RelDir)
 */
type InferGlobReturn<O extends GlobOptions | undefined> = O extends { absolute: true } ? FsLoc.Groups.Abs.Abs
  : FsLoc.Groups.Rel.Rel

/**
 * Effect-based wrapper for globbing file patterns.
 * Returns an Effect that resolves to an array of matched FsLoc objects.
 *
 * The return type is determined by the `absolute` option:
 * - With `absolute: true`, returns absolute locations (AbsFile | AbsDir)
 * - Otherwise, returns relative locations (RelFile | RelDir)
 *
 * @param pattern - The glob pattern(s) to match against
 * @param options - Additional globbing options
 * @returns Effect containing array of matched FsLoc objects
 *
 * @example
 * ```ts
 * import { Fs } from '#fs'
 * import { FsLoc } from '#fs-loc'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   // Returns relative FsLocs
 *   const relFiles = yield* Fs.glob('src/**' + '/*.ts')
 *
 *   // Returns absolute FsLocs
 *   const absFiles = yield* Fs.glob('src/**' + '/*.ts', { absolute: true })
 *
 *   // Get string path from FsLoc
 *   const path = FsLoc.encodeSync(relFiles[0])
 * })
 *
 * Effect.runPromise(program)
 * ```
 */
export const glob = <O extends GlobOptions | undefined = undefined>(
  pattern: string | string[],
  options?: O,
): Effect.Effect<InferGlobReturn<O>[], Error> =>
  Effect.tryPromise({
    try: () => TinyGlobby.glob(pattern, options),
    catch: (error) => new Error(`Failed to glob pattern: ${String(error)}`),
  }).pipe(
    Effect.flatMap((paths) =>
      Effect.try({
        try: () =>
          paths.map(path => {
            // Normalize relative paths to start with ./
            const normalizedPath = path.startsWith('/') || path.startsWith('./') || path.startsWith('../')
              ? path
              : `./${path}`
            return FsLoc.decodeSync(normalizedPath) as InferGlobReturn<O>
          }),
        catch: (error) => new Error(`Failed to decode glob results: ${String(error)}`),
      })
    ),
  )

/**
 * Synchronous Effect-based wrapper for globbing file patterns.
 * Uses the synchronous version of glob internally.
 *
 * The return type is determined by the `absolute` option:
 * - With `absolute: true`, returns absolute locations (AbsFile | AbsDir)
 * - Otherwise, returns relative locations (RelFile | RelDir)
 *
 * @param pattern - The glob pattern(s) to match against
 * @param options - Additional globbing options
 * @returns Effect containing array of matched FsLoc objects
 *
 * @example
 * ```ts
 * import { Fs } from '#fs'
 * import { FsLoc } from '#fs-loc'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   // Returns relative FsLocs
 *   const relFiles = yield* Fs.globSync('**' + '/*.js', { cwd: './dist' })
 *
 *   // Returns absolute FsLocs
 *   const absFiles = yield* Fs.globSync('**' + '/*.js', { absolute: true })
 * })
 *
 * Effect.runSync(program)
 * ```
 */
export const globSync = <O extends GlobOptions | undefined = undefined>(
  pattern: string | string[],
  options?: O,
): Effect.Effect<InferGlobReturn<O>[], Error> =>
  Effect.try({
    try: () => TinyGlobby.globSync(pattern, options),
    catch: (error) => error instanceof Error ? error : new Error(String(error)),
  }).pipe(
    Effect.flatMap((paths) =>
      Effect.try({
        try: () =>
          paths.map(path => {
            // Normalize relative paths to start with ./
            const normalizedPath = path.startsWith('/') || path.startsWith('./') || path.startsWith('../')
              ? path
              : `./${path}`
            return FsLoc.decodeSync(normalizedPath) as InferGlobReturn<O>
          }),
        catch: (error) => new Error(`Failed to decode glob results: ${String(error)}`),
      })
    ),
  )
