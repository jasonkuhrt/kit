import { Fs } from '#fs'
import { Effect, Schema as S } from 'effect'
import * as TinyGlobby from 'tinyglobby'

/**
 * Options for globbing file patterns, excluding the patterns parameter.
 * The `cwd` option only accepts {@link Fs.Path.AbsDir} or URL for type safety.
 */
export type GlobOptions = Omit<TinyGlobby.GlobOptions, 'patterns' | 'cwd'> & {
  /**
   * The working directory in which to search. Results will be returned relative to this directory.
   * Only accepts {@link Fs.Path.AbsDir} or URL for type-safe filesystem paths.
   * @default process.cwd() as Fs.Path.AbsDir
   */
  cwd?: Fs.Path.AbsDir | URL
}

/**
 * Type helper to infer FsLoc return type based on glob options.
 * - If onlyFiles is true (default), returns only File types
 * - If onlyDirectories is true, returns only Dir types
 * - If onlyFiles is false, returns both File and Dir types
 * - If absolute is true, returns absolute locations
 * - Otherwise returns relative locations
 */
type InferGlobReturn<O extends GlobOptions | undefined> = O extends undefined ? Fs.Path.RelFile // Explicit undefined type param
  : O extends { onlyDirectories: true; absolute: true } ? Fs.Path.AbsDir
  : O extends { onlyDirectories: true } ? Fs.Path.RelDir
  : O extends { onlyFiles: false; absolute: true } ? Fs.Path.$Abs
  : O extends { onlyFiles: false } ? Fs.Path.$Rel
  : O extends { onlyFiles: true; absolute: true } ? Fs.Path.AbsFile
  : O extends { onlyFiles: true } ? Fs.Path.RelFile
  : O extends { absolute: true } ? Fs.Path.AbsFile // onlyFiles defaults to true
  : O extends GlobOptions ? Fs.Path.RelFile // Default case for bare GlobOptions/{}
  : never // Should never reach here

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
 * import { Fs } from '#fs'
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
 *   // Search from a specific directory using FsLoc
 *   const srcDir = Fs.Path.AbsDir.decodeStringSync('/path/to/project/')
 *   const srcFiles = yield* Fs.glob('**' + '/*.ts', { cwd: srcDir })
 *
 *   // Get string path from FsLoc
 *   const path = Fs.Path.encodeSync(relFiles[0])
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
    try: () => {
      // Convert Fs.Path.AbsDir to string for TinyGlobby
      const tinyGlobbyOptions = options && options.cwd && Fs.Path.AbsDir.is(options.cwd)
        ? { ...options, cwd: S.encodeSync(Fs.Path.AbsDir.Schema)(options.cwd) }
        : options
      return TinyGlobby.glob(pattern, tinyGlobbyOptions as TinyGlobby.GlobOptions)
    },
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
            return Fs.Path.fromString(normalizedPath) as InferGlobReturn<O>
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
 * import { Fs } from '#fs'
 * import { Effect } from 'effect'
 *
 * const program = Effect.gen(function* () {
 *   // Search from a specific directory using FsLoc
 *   const distDir = Fs.Path.AbsDir.decodeStringSync('./dist/')
 *   const relFiles = yield* Fs.globSync('**' + '/*.js', { cwd: distDir })
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
    try: () => {
      // Convert Fs.Path.AbsDir to string for TinyGlobby
      const tinyGlobbyOptions = options && options.cwd && Fs.Path.AbsDir.is(options.cwd)
        ? { ...options, cwd: S.encodeSync(Fs.Path.AbsDir.Schema)(options.cwd) }
        : options
      return TinyGlobby.globSync(pattern, tinyGlobbyOptions as TinyGlobby.GlobOptions)
    },
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
            return Fs.Path.fromString(normalizedPath) as InferGlobReturn<O>
          }),
        catch: (error) => new Error(`Failed to decode glob results: ${String(error)}`),
      })
    ),
  )
