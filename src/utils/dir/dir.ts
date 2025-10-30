import { Fs } from '#fs'
import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Schema as S } from 'effect'
import { Effect, Scope } from 'effect'
import * as NodeOs from 'node:os'
import * as NodePath from 'node:path'

/**
 * Represents a directory with an absolute base path.
 * This is the core data type that operations work with.
 */
export interface Dir {
  readonly base: Fs.Path.AbsDir
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
export const create = (
  base: Fs.Path.Input.AbsDir,
): Dir => ({
  base: Fs.Path.normalizeDynamicInput(Fs.Path.AbsDir.Schema)(base) as Fs.Path.AbsDir,
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
export const createTemp = (): Effect.Effect<Dir, PlatformError, Scope.Scope | FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const tempBase = NodePath.join(
      NodeOs.tmpdir(),
      `kit-dir-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    )
    const absDir = S.decodeSync(Fs.Path.AbsDir.Schema)(tempBase + '/')

    // Create the directory
    yield* Fs.write(absDir, { recursive: true })

    const dir = create(absDir)

    // Add cleanup finalizer
    yield* Effect.addFinalizer(() => Effect.orDie(Fs.remove(absDir, { recursive: true, force: true })))

    return dir
  })

/**
 * Create a temporary directory without automatic cleanup.
 * The caller is responsible for removing the directory when done.
 *
 * @returns An Effect that yields a Dir instance pointing to a new temp directory
 *
 * @example
 * ```ts
 * const temp = yield* Dir.createTempUnsafe()
 * // Use temp directory...
 * // Must manually clean up when done
 * yield* Fs.remove(temp.base, { recursive: true })
 * ```
 */
export const createTempUnsafe = (): Effect.Effect<Dir, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const tempBase = NodePath.join(
      NodeOs.tmpdir(),
      `kit-dir-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    )
    const absDir = S.decodeSync(Fs.Path.AbsDir.Schema)(tempBase + '/')

    // Create the directory
    yield* Fs.write(absDir, { recursive: true })

    return create(absDir)
  })
