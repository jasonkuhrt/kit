import { FsLoc } from '#fs-loc'
import { FileSystem } from '@effect/platform'
import { Effect, Option } from 'effect'

/**
 * Find the first existing path from a list of paths.
 *
 * Useful for finding configuration files in multiple possible locations,
 * or for implementing fallback file paths.
 *
 * @param locs - Array of FsLoc objects to check for existence
 * @returns The first existing path, or undefined if none exist
 *
 * @example
 * ```ts
 * import { Fs } from '#fs'
 * import { FsLoc } from '#fs-loc'
 * import { NodeFileSystem } from '@effect/platform-node'
 * import { Effect } from 'effect'
 *
 * const configPaths = [
 *   FsLoc.RelFile.decodeSync('./config.local.json'),
 *   FsLoc.RelFile.decodeSync('./config.json'),
 *   FsLoc.AbsFile.decodeSync('/home/user/.config/myapp/config.json')
 * ]
 *
 * const program = Effect.gen(function* () {
 *   const configPath = yield* Fs.pickFirstPathExisting(configPaths)
 *   if (configPath) {
 *     console.log(`Found config at: ${FsLoc.encodeSync(configPath)}`)
 *   } else {
 *     console.log('No config file found')
 *   }
 * })
 *
 * Effect.runPromise(
 *   Effect.provide(program, NodeFileSystem.layer)
 * )
 * ```
 */
export const pickFirstPathExisting = <loc extends FsLoc.FsLoc>(
  locs: readonly loc[],
): Effect.Effect<loc | undefined, Error, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    // Check each path for existence
    const checks = yield* Effect.all(
      locs.map(path => {
        const pathStr = FsLoc.encodeSync(path)
        return fs.exists(pathStr).pipe(
          Effect.map(exists => exists ? path : undefined),
          Effect.mapError(error => new Error(`Failed to check path existence: ${pathStr} - ${error}`)),
        )
      }),
    )

    // Return the first existing path
    return checks.find(maybePath => maybePath !== undefined)
  })

/**
 * Type helper to infer return type based on input relative paths.
 * - If all paths are RelFile, returns AbsFile
 * - If all paths are RelDir, returns AbsDir
 * - If mixed, returns union of AbsFile | AbsDir
 */
type InferReturnType<T extends FsLoc.Groups.Rel.Rel> = T extends FsLoc.RelFile.RelFile ? FsLoc.AbsFile.AbsFile
  : T extends FsLoc.RelDir.RelDir ? FsLoc.AbsDir.AbsDir
  : FsLoc.Groups.Abs.Abs

/**
 * Find the first existing path under a directory.
 *
 * Takes an absolute directory and a list of relative paths,
 * and returns the first one that exists on the filesystem.
 *
 * @param dir - The absolute directory to search under
 * @param paths - Array of relative paths (files or directories) to check
 * @returns The first existing absolute path, or None if none exist
 *
 * @example
 * ```ts
 * import { Fs } from '#fs'
 * import { FsLoc } from '#fs-loc'
 *
 * const dir = FsLoc.AbsDir.decodeSync('/project/')
 * const paths = [
 *   FsLoc.RelFile.decodeSync('./config.local.json'),
 *   FsLoc.RelFile.decodeSync('./config.json')
 * ]
 *
 * const result = yield* Fs.findFirstUnderDir(dir)(paths)
 * // result: Option<AbsFile> since all inputs are RelFile
 * ```
 */
export const findFirstUnderDir = (
  dir: FsLoc.AbsDir.AbsDir,
) =>
<paths extends FsLoc.Groups.Rel.Rel>(
  paths: readonly paths[],
): Effect.Effect<
  Option.Option<InferReturnType<paths>>,
  Error,
  FileSystem.FileSystem
> => {
  const locs = paths.map(path => FsLoc.join(dir, path))
  return Effect.map(
    pickFirstPathExisting(locs),
    (result) => result === undefined ? Option.none() : Option.some(result as InferReturnType<paths>),
  )
}
