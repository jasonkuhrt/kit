import { Fs } from '#fs'
import { Error as PlatformError, FileSystem } from '@effect/platform'
import { Effect } from 'effect'
import type { Builder } from './builder.js'
import type { Operation } from './spec.js'

type FSError = PlatformError.PlatformError
type FS = FileSystem.FileSystem

/**
 * Execute a list of operations on a directory.
 *
 * @param builder - The base directory
 * @param operations - The operations to execute
 * @returns An Effect that executes all operations
 */
export const executeOperations = (
  builder: Builder,
  operations: Operation[],
): Effect.Effect<void, FSError, FS> =>
  Effect.gen(function*() {
    for (const op of operations) {
      yield* executeOperation(builder, op)
    }
  })

/**
 * Execute a single operation.
 */
const executeOperation = (
  builder: Builder,
  op: Operation,
): Effect.Effect<void, FSError, FS> =>
  Effect.gen(function*() {
    switch (op.type) {
      case 'file': {
        const absPath = Fs.Path.join(builder.base, op.path)
        yield* Fs.write(absPath, op.content)
        break
      }
      case 'dir': {
        const absPath = Fs.Path.join(builder.base, op.path)
        yield* Fs.write(absPath, { recursive: true })

        // Execute nested operations with updated base
        if (op.operations.length > 0) {
          const subBuilder = { base: absPath }
          for (const subOp of op.operations) {
            yield* executeOperation(subBuilder, subOp)
          }
        }
        break
      }
      case 'remove': {
        const absPath = Fs.Path.join(builder.base, op.path)
        yield* Fs.remove(absPath, { recursive: true, force: true })
        break
      }
      case 'clear': {
        const absPath = Fs.Path.join(builder.base, op.path)
        yield* Fs.clear(absPath)
        break
      }
      case 'move-file': {
        const fromPath = Fs.Path.join(builder.base, op.from) as Fs.Path.AbsFile
        const toPath = Fs.Path.join(builder.base, op.to) as Fs.Path.AbsFile
        yield* Fs.rename(fromPath, toPath)
        break
      }
      case 'move-dir': {
        const fromPath = Fs.Path.join(builder.base, op.from) as Fs.Path.AbsDir
        const toPath = Fs.Path.join(builder.base, op.to) as Fs.Path.AbsDir
        yield* Fs.rename(fromPath, toPath)
        break
      }
    }
  })
