import { FsLoc } from '#fs-loc'
import { Effect } from 'effect'
import * as TinyGlobby from 'tinyglobby'

/**
 * Options for globbing file patterns, excluding the patterns parameter.
 */
export type GlobOptions = Omit<TinyGlobby.GlobOptions, 'patterns'>

/**
 * Type helper to infer FsLoc return type based on glob options.
 * - If onlyFiles is true (default), returns only File types
 * - If onlyDirectories is true, returns only Dir types
 * - If onlyFiles is false, returns both File and Dir types
 * - If absolute is true, returns absolute locations
 * - Otherwise returns relative locations
 */
type InferGlobReturn<O extends GlobOptions | undefined> = O extends { onlyDirectories: true }
  ? O extends { absolute: true } ? FsLoc.AbsDir.AbsDir
  : FsLoc.RelDir.RelDir
  : O extends { onlyFiles: false } ? O extends { absolute: true } ? FsLoc.Groups.Abs.Abs
    : FsLoc.Groups.Rel.Rel
  // Default behavior: onlyFiles is true
  : O extends { absolute: true } ? FsLoc.AbsFile.AbsFile
  : FsLoc.RelFile.RelFile

/**
 * Effect-based wrapper for globbing file patterns.
 * Returns an Effect that resolves to an array of matched FsLoc objects.
 *
 * The return type is determined by the options:
 * - With `onlyFiles: true` (default), returns only file locations
 * - With `onlyDirectories: true`, returns only directory locations
 * - With `absolute: true`, returns absolute locations
 * - Otherwise, returns relative locations
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
 *   // Returns relative files (onlyFiles defaults to true)
 *   const relFiles = yield* Fs.glob('src/**' + '/*.ts')
 *
 *   // Returns absolute files only
 *   const absFiles = yield* Fs.glob('src/**' + '/*.ts', { absolute: true, onlyFiles: true })
 *
 *   // Returns directories only
 *   const dirs = yield* Fs.glob('src/**', { onlyDirectories: true })
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
 * The return type is determined by the options:
 * - With `onlyFiles: true` (default), returns only file locations
 * - With `onlyDirectories: true`, returns only directory locations
 * - With `absolute: true`, returns absolute locations
 * - Otherwise, returns relative locations
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
 *   // Returns relative files (onlyFiles defaults to true)
 *   const relFiles = yield* Fs.globSync('**' + '/*.js', { cwd: './dist' })
 *
 *   // Returns absolute files only
 *   const absFiles = yield* Fs.globSync('**' + '/*.js', { absolute: true, onlyFiles: true })
 *
 *   // Returns directories only
 *   const dirs = yield* Fs.globSync('src/**', { onlyDirectories: true })
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
