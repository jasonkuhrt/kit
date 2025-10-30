import { Fs } from '#fs'
import type { Json } from '#json'
import { Error as PlatformError, FileSystem } from '@effect/platform'
import { Effect } from 'effect'
import type { Dir } from './dir.js'
import * as Ops from './operations.js'
import type { Operation, SpecBuilder } from './spec.js'
import * as Spec from './spec.js'

// Re-export Operation for backward compatibility
export type { Operation } from './spec.js'

type FSError = PlatformError.PlatformError
type FS = FileSystem.FileSystem

/**
 * A chainable builder for directory operations.
 * Extends DirSpec with the ability to commit operations.
 */
export interface DirChain extends SpecBuilder {
  // Override return types to return DirChain instead of DirSpec
  file<path extends Fs.Path.RelFile | string>(
    path: Fs.Path.Guard.RelFile<path>,
    content: path extends Fs.Path.RelFile ? Fs.InferFileContent<path>
      : path extends string ? string | Uint8Array | Json.Object
      : never,
  ): DirChain

  dir<path extends Fs.Path.RelDir | string>(
    path: Fs.Path.Guard.RelDir<path>,
    builder?: (_: DirChain) => DirChain,
  ): DirChain

  when(
    condition: boolean,
    builder: (_: DirChain) => DirChain,
  ): DirChain

  unless(
    condition: boolean,
    builder: (_: DirChain) => DirChain,
  ): DirChain

  remove<path extends Fs.Path.$Rel | string>(
    path: Fs.Path.Guard.Rel<path>,
  ): DirChain

  clear<path extends Fs.Path.RelDir | string>(
    path: Fs.Path.Guard.RelDir<path>,
  ): DirChain

  move<
    from extends Fs.Path.RelFile | string,
    to extends Fs.Path.RelFile | string,
  >(
    from: Fs.Path.Guard.RelFile<from>,
    to: Fs.Path.Guard.RelFile<to>,
  ): DirChain

  move<
    from extends Fs.Path.RelDir | string,
    to extends Fs.Path.RelDir | string,
  >(
    from: Fs.Path.Guard.RelDir<from>,
    to: Fs.Path.Guard.RelDir<to>,
  ): DirChain

  add<path extends Fs.Path.RelFile | string>(
    path: Fs.Path.Guard.RelFile<path>,
    content: path extends Fs.Path.RelFile ? Fs.InferFileContent<path>
      : path extends string ? string | Uint8Array | Json.Object
      : never,
  ): DirChain

  add<path extends Fs.Path.RelDir | string>(
    path: Fs.Path.Guard.RelDir<path>,
    builder?: (_: DirChain) => DirChain,
  ): DirChain

  withBase(base: string | Fs.Path.AbsDir): DirChain

  merge(...specs: SpecBuilder[]): DirChain

  /**
   * Execute all accumulated operations.
   *
   * @returns An Effect that performs all operations when run
   *
   * @example
   * ```ts
   * await Effect.runPromise(
   *   dir
   *     .file('test.txt', 'content')
   *     .commit()
   * )
   * ```
   */
  commit(): Effect.Effect<void, FSError, FS>
}

/**
 * Create a new chain builder for the given directory.
 * This is a thin wrapper around DirSpec that adds the commit() method.
 *
 * @param dir - The directory to operate on
 * @returns A new DirChain builder
 */
export const chain = (dir: Dir): DirChain => {
  // Create the underlying spec
  let spec = Spec.spec(dir.base)

  // Create a proxy that wraps the spec and adds commit()
  const createChainProxy = (currentSpec: SpecBuilder): DirChain => {
    return new Proxy(currentSpec, {
      get(target, prop) {
        // Special handling for commit()
        if (prop === 'commit') {
          return () => Ops.executeOperations(dir, target.operations as Operation[])
        }

        // Special handling for builder methods that need to return DirChain
        if (
          prop === 'file' || prop === 'dir' || prop === 'when' || prop === 'unless'
          || prop === 'remove' || prop === 'clear' || prop === 'move' || prop === 'add'
          || prop === 'withBase' || prop === 'merge'
        ) {
          return (...args: any[]) => {
            // Call the underlying spec method
            const result = (target as any)[prop](...args) as SpecBuilder
            // Update our spec reference and return a new chain proxy
            spec = result
            return createChainProxy(result)
          }
        }

        // For other properties, just return from the target
        return (target as any)[prop]
      },
    }) as DirChain
  }

  return createChainProxy(spec)
}

/**
 * Extend a Dir instance with chaining methods.
 * This allows using the chaining API directly on a Dir.
 *
 * @param dir - The directory to extend
 * @returns A Dir with chaining methods
 */
export const withChaining = (dir: Dir): Dir & DirChain => {
  return Object.assign(chain(dir), dir)
}
