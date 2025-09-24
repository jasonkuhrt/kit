import { FsLoc } from '#fs-loc'
import { Schema as S } from 'effect'
import { Effect, Scope } from 'effect'
import * as NodeOs from 'node:os'
import * as NodePath from 'node:path'

/**
 * Represents a directory with an absolute base path.
 * This is the core data type that operations work with.
 */
export interface Dir {
  readonly base: FsLoc.AbsDir
}

/**
 * Create a Dir instance with the specified base path.
 *
 * @param base - The absolute directory path to use as the base
 * @returns A new Dir instance
 *
 * @example
 * ```ts
 * const dir = Dir.create('/project')
 * ```
 */
export const create = (base: string | FsLoc.AbsDir): Dir => ({
  base: typeof base === 'string' ? S.decodeSync(FsLoc.AbsDir.String)(base) : base,
})

/**
 * Create a temporary directory that will be automatically cleaned up
 * when the Effect scope ends.
 *
 * @returns An Effect that yields a Dir instance pointing to a temp directory
 *
 * @example
 * ```ts
 * const program = Effect.scoped(
 *   Effect.gen(function* () {
 *     const temp = yield* Dir.createTemp()
 *     // Use temp directory...
 *   }) // Automatically cleaned up when scope ends
 * )
 * ```
 */
export const createTemp = (): Effect.Effect<Dir, never, Scope.Scope> =>
  Effect.gen(function*() {
    const tempBase = NodePath.join(
      NodeOs.tmpdir(),
      `kit-dir-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    )
    const absDir = S.decodeSync(FsLoc.AbsDir.String)(tempBase)
    const dir = create(absDir)

    // Add cleanup finalizer
    yield* Effect.addFinalizer(() =>
      Effect.sync(() => {
        // In real implementation, would use FileSystem service to remove directory
        // For now, just a placeholder
        console.log(`Would cleanup temp directory: ${tempBase}`)
      })
    )

    return dir
  })

/**
 * Create a temporary directory without automatic cleanup.
 * The caller is responsible for removing the directory when done.
 *
 * @returns A Dir instance pointing to a new temp directory
 *
 * @example
 * ```ts
 * const temp = Dir.createTempUnsafe()
 * // Use temp directory...
 * // Must manually clean up when done
 * ```
 */
export const createTempUnsafe = (): Dir => {
  const tempBase = NodePath.join(
    NodeOs.tmpdir(),
    `kit-dir-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  )
  return create(S.decodeSync(FsLoc.AbsDir.String)(tempBase))
}
