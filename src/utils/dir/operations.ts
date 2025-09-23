import { Fs } from '#fs'
import { FsLoc } from '#fs-loc'
import { Error as PlatformError, FileSystem } from '@effect/platform'
import { Effect } from 'effect'
import type { Operation } from './chain.js'
import type { Dir } from './dir.js'

type FSError = PlatformError.PlatformError
type FS = FileSystem.FileSystem

/**
 * Execute a list of operations on a directory.
 *
 * @param dir - The base directory
 * @param operations - The operations to execute
 * @returns An Effect that executes all operations
 */
export const executeOperations = (
  dir: Dir,
  operations: Operation[],
): Effect.Effect<void, FSError, FS> =>
  Effect.gen(function*() {
    for (const op of operations) {
      yield* executeOperation(dir, op)
    }
  })

/**
 * Execute a single operation.
 */
const executeOperation = (
  dir: Dir,
  op: Operation,
): Effect.Effect<void, FSError, FS> =>
  Effect.gen(function*() {
    switch (op.type) {
      case 'file': {
        const absPath = FsLoc.join(dir.base, op.path)
        yield* Fs.write(absPath, op.content)
        break
      }
      case 'dir': {
        const absPath = FsLoc.join(dir.base, op.path)
        yield* Fs.write(absPath, { recursive: true })

        // Execute nested operations with updated base
        if (op.operations.length > 0) {
          const subDir = { base: absPath }
          for (const subOp of op.operations) {
            yield* executeOperation(subDir, subOp)
          }
        }
        break
      }
      case 'remove': {
        const absPath = FsLoc.join(dir.base, op.path)
        yield* Fs.remove(absPath, { recursive: true, force: true })
        break
      }
      case 'clear': {
        const absPath = FsLoc.join(dir.base, op.path)
        yield* Fs.clear(absPath)
        break
      }
      case 'move-file': {
        const fromPath = FsLoc.join(dir.base, op.from)
        const toPath = FsLoc.join(dir.base, op.to)
        yield* Fs.rename(fromPath, toPath)
        break
      }
      case 'move-dir': {
        const fromPath = FsLoc.join(dir.base, op.from)
        const toPath = FsLoc.join(dir.base, op.to)
        yield* Fs.rename(fromPath, toPath)
        break
      }
    }
  })
