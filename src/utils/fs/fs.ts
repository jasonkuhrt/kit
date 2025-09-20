import { FsLoc } from '#fs-loc'
import { FileSystem } from '@effect/platform'
import { Effect } from 'effect'

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
