import { FileSystem } from '@effect/platform'
import { Effect } from 'effect'

/**
 * Find the first existing path from a list of paths.
 *
 * Useful for finding configuration files in multiple possible locations,
 * or for implementing fallback file paths.
 *
 * @param paths - Array of paths to check for existence
 * @returns The first existing path, or undefined if none exist
 *
 * @example
 * ```ts
 * import { Fs } from '#fs'
 * import { NodeFileSystem } from '@effect/platform-node'
 * import { Effect } from 'effect'
 *
 * const configPaths = [
 *   './config.local.json',
 *   './config.json',
 *   '~/.config/myapp/config.json'
 * ]
 *
 * const program = Effect.gen(function* () {
 *   const configPath = yield* Fs.pickFirstPathExisting(configPaths)
 *   if (configPath) {
 *     console.log(`Found config at: ${configPath}`)
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
export const pickFirstPathExisting = (
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
