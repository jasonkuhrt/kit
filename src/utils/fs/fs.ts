import { FsPath } from '#fs-path'
import { FileSystem } from '@effect/platform'
import { Effect } from 'effect'

/**
 * Find the first existing path from a list of paths.
 *
 * Useful for finding configuration files in multiple possible locations,
 * or for implementing fallback file paths.
 *
 * @param paths - Array of FsPath objects to check for existence
 * @returns The first existing path, or undefined if none exist
 *
 * @example
 * ```ts
 * import { Fs } from '#fs'
 * import { FsPath } from '#fs-path'
 * import { NodeFileSystem } from '@effect/platform-node'
 * import { Effect } from 'effect'
 *
 * const configPaths = [
 *   FsPath.RelativeFile.decodeSync('./config.local.json'),
 *   FsPath.RelativeFile.decodeSync('./config.json'),
 *   FsPath.AbsoluteFile.decodeSync('/home/user/.config/myapp/config.json')
 * ]
 *
 * const program = Effect.gen(function* () {
 *   const configPath = yield* Fs.pickFirstPathExisting(configPaths)
 *   if (configPath) {
 *     console.log(`Found config at: ${FsPath.encodeSync(configPath)}`)
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
export const pickFirstPathExisting = <T extends FsPath.FsPath>(
  paths: readonly T[],
): Effect.Effect<T | undefined, Error, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    // Check each path for existence
    const checks = yield* Effect.all(
      paths.map(path => {
        const pathStr = FsPath.encodeSync(path)
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
 * Find the first existing path from a list of path strings (backward compatibility).
 *
 * @deprecated Use the version that takes FsPath types instead
 * @param paths - Array of path strings to check for existence
 * @returns The first existing path string, or undefined if none exist
 */
export const pickFirstPathExistingString = (
  paths: readonly string[],
): Effect.Effect<string | undefined, Error, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    // Check each path for existence
    const checks = yield* Effect.all(
      paths.map(path =>
        fs.exists(path).pipe(
          Effect.map(exists => exists ? path : undefined),
          Effect.mapError(error => new Error(`Failed to check path existence: ${path} - ${error}`)),
        )
      ),
    )

    // Return the first existing path
    return checks.find(maybePath => maybePath !== undefined)
  })
