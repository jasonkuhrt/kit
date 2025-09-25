import { FsLoc } from '#fs-loc'
import { FileSystem } from '@effect/platform'
import { Effect, Option } from 'effect'

/**
 * Type helper to infer return type based on input relative paths.
 * - If all paths are RelFile, returns AbsFile
 * - If all paths are RelDir, returns AbsDir
 * - If mixed, returns union of AbsFile | AbsDir
 */
type InferReturnType<T extends FsLoc.Groups.Rel.Rel> = T extends FsLoc.RelFile ? FsLoc.AbsFile
  : T extends FsLoc.RelDir ? FsLoc.AbsDir
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
 * const dir = FsLoc.AbsDir.decodeStringSync('/project/')
 * const paths = [
 *   FsLoc.RelFile.decodeStringSync('./config.local.json'),
 *   FsLoc.RelFile.decodeStringSync('./config.json')
 * ]
 *
 * const result = yield* Fs.findFirstUnderDir(dir)(paths)
 * // result: Option<AbsFile> since all inputs are RelFile
 * ```
 */
export const findFirstUnderDir = (
  dir: FsLoc.AbsDir,
) =>
<paths extends FsLoc.Groups.Rel.Rel>(
  paths: readonly paths[],
): Effect.Effect<
  Option.Option<InferReturnType<paths>>,
  Error,
  FileSystem.FileSystem
> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    // Check each path for existence, maintaining the index relationship
    const checks = yield* Effect.all(
      paths.map((relativePath) => {
        // Join to get absolute path for checking
        const absolutePath = FsLoc.join(dir, relativePath as FsLoc.Groups.Rel.Rel)
        const pathStr = FsLoc.encodeSync(absolutePath)
        return fs.exists(pathStr).pipe(
          // Return the absolute path if it exists (this is what we want!)
          Effect.map(exists => exists ? absolutePath : undefined),
          Effect.mapError(error => new Error(`Failed to check path existence: ${pathStr} - ${error}`)),
        )
      }),
    )

    // Find the first existing path and wrap in Option
    const firstExisting = checks.find(maybePath => maybePath !== undefined)
    return firstExisting === undefined
      ? Option.none()
      : Option.some(firstExisting as InferReturnType<paths>)
  })
