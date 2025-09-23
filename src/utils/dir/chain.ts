import { Fs } from '#fs'
import { FsLoc } from '#fs-loc'
import type { Json } from '#json'
import { Error as PlatformError, FileSystem } from '@effect/platform'
import { Effect } from 'effect'
import type { Dir } from './dir.js'
import * as Ops from './operations.js'

type FSError = PlatformError.PlatformError
type FS = FileSystem.FileSystem

/**
 * Represents a single file system operation to be executed.
 */
export type Operation =
  | { type: 'file'; path: FsLoc.RelFile.RelFile; content: any } // Keep as any to preserve original types
  | { type: 'dir'; path: FsLoc.RelDir.RelDir; operations: Operation[] }
  | { type: 'remove'; path: FsLoc.RelFile.RelFile | FsLoc.RelDir.RelDir }
  | { type: 'clear'; path: FsLoc.RelDir.RelDir }
  | { type: 'move-file'; from: FsLoc.RelFile.RelFile; to: FsLoc.RelFile.RelFile }
  | { type: 'move-dir'; from: FsLoc.RelDir.RelDir; to: FsLoc.RelDir.RelDir }

/**
 * A chainable builder for directory operations.
 * Operations are accumulated and executed when commit() is called.
 */
export interface DirChain {
  /**
   * Add a file to the directory.
   *
   * @param path - The file path (relative to base)
   * @param content - The file content (type depends on extension)
   * @returns The chain for further operations
   *
   * @example
   * ```ts
   * dir
   *   .file('README.md', '# My Project')
   *   .file('data.json', { version: '1.0' })
   *   .file('image.png', uint8Array)
   * ```
   */
  file<path extends FsLoc.RelFile.RelFile | string>(
    path: FsLoc.Inputs.RelFile<path>,
    content: path extends FsLoc.RelFile.RelFile ? Fs.InferFileContent<path>
      : path extends string ? string | Uint8Array | Json.Object // Dynamic path, allow all content types
      : never,
  ): DirChain

  /**
   * Add a directory to the file system.
   *
   * @param path - The directory path (relative to base)
   * @param builder - Optional function to add contents to the directory
   * @returns The chain for further operations
   *
   * @example
   * ```ts
   * dir
   *   .dir('src', _ =>
   *     _.file('index.ts', 'export const x = 1'))
   *   .dir('tests') // empty directory
   * ```
   */
  dir<path extends FsLoc.RelDir.RelDir | string>(
    path: FsLoc.Inputs.RelDir<path>,
    builder?: (_: DirChain) => DirChain,
  ): DirChain

  /**
   * Conditionally apply operations.
   *
   * @param condition - Whether to apply the operations
   * @param builder - Function that builds operations to apply
   * @returns The chain for further operations
   *
   * @example
   * ```ts
   * dir
   *   .when(isDev, _ =>
   *     _.file('.env', 'DEBUG=true'))
   * ```
   */
  when(
    condition: boolean,
    builder: (_: DirChain) => DirChain,
  ): DirChain

  /**
   * Conditionally apply operations (inverse of when).
   *
   * @param condition - Whether to skip the operations
   * @param builder - Function that builds operations to apply
   * @returns The chain for further operations
   *
   * @example
   * ```ts
   * dir
   *   .unless(isProd, _ =>
   *     _.file('dev.config.js', devConfig))
   * ```
   */
  unless(
    condition: boolean,
    builder: (_: DirChain) => DirChain,
  ): DirChain

  /**
   * Remove a file or directory.
   *
   * @param path - The path to remove (relative to base)
   * @returns The chain for further operations
   *
   * @example
   * ```ts
   * dir.remove('old-file.txt')
   * ```
   */
  remove<path extends FsLoc.Groups.Rel.Rel | string>(
    path: FsLoc.Inputs.Rel<path>,
  ): DirChain

  /**
   * Clear the contents of a directory (keep the directory itself).
   *
   * @param path - The directory path to clear (relative to base)
   * @returns The chain for further operations
   *
   * @example
   * ```ts
   * dir.clear('build/')
   * ```
   */
  clear<path extends FsLoc.RelDir.RelDir | string>(
    path: FsLoc.Inputs.RelDir<path>,
  ): DirChain

  /**
   * Move/rename a file.
   *
   * @param from - The source file path (relative to base)
   * @param to - The destination file path (relative to base)
   * @returns The chain for further operations
   *
   * @example
   * ```ts
   * dir.move('draft.md', 'README.md')
   * ```
   */
  move<
    from extends FsLoc.RelFile.RelFile | string,
    to extends FsLoc.RelFile.RelFile | string,
  >(
    from: FsLoc.Inputs.RelFile<from>,
    to: FsLoc.Inputs.RelFile<to>,
  ): DirChain

  /**
   * Move/rename a directory.
   *
   * @param from - The source directory path (relative to base)
   * @param to - The destination directory path (relative to base)
   * @returns The chain for further operations
   *
   * @example
   * ```ts
   * dir.move('old-dir/', 'new-dir/')
   * ```
   */
  move<
    from extends FsLoc.RelDir.RelDir | string,
    to extends FsLoc.RelDir.RelDir | string,
  >(
    from: FsLoc.Inputs.RelDir<from>,
    to: FsLoc.Inputs.RelDir<to>,
  ): DirChain

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
 *
 * @param dir - The directory to operate on
 * @returns A new DirChain builder
 */
export const chain = (dir: Dir): DirChain => {
  const operations: Operation[] = []

  const self: DirChain = {
    file(path, content) {
      const relFile = typeof path === 'string'
        ? FsLoc.RelFile.decodeSync(path as string)
        : path as FsLoc.RelFile.RelFile
      operations.push({ type: 'file', path: relFile, content })
      return self
    },

    dir(path, builder?) {
      const relDir = typeof path === 'string'
        ? FsLoc.RelDir.decodeSync(path as string)
        : path as FsLoc.RelDir.RelDir
      if (builder) {
        // Create a sub-chain to collect nested operations
        const subChain = chain(dir)
        builder(subChain)
        // Extract operations from the sub-chain
        const subOps = (subChain as any).__operations__ || []
        operations.push({ type: 'dir', path: relDir, operations: subOps })
      } else {
        operations.push({ type: 'dir', path: relDir, operations: [] })
      }
      return self
    },

    when(condition: boolean, builder: (_: DirChain) => DirChain): DirChain {
      if (condition) {
        builder(self)
      }
      return self
    },

    unless(condition: boolean, builder: (_: DirChain) => DirChain): DirChain {
      if (!condition) {
        builder(self)
      }
      return self
    },

    remove(path) {
      const fsPath = typeof path === 'string'
        ? FsLoc.decodeSync(path) as FsLoc.Groups.Rel.Rel
        : path
      // Determine if it's a file or directory for the operation
      const operationPath = FsLoc.Groups.File.is(fsPath)
        ? fsPath as FsLoc.RelFile.RelFile
        : fsPath as FsLoc.RelDir.RelDir
      operations.push({ type: 'remove', path: operationPath })
      return self
    },

    clear(path) {
      let relDir: FsLoc.RelDir.RelDir
      if (typeof path === 'string') {
        // Handle special case for current directory
        const dirPath = path === '.' ? './' : path as string
        relDir = FsLoc.RelDir.decodeSync(dirPath)
      } else {
        relDir = path as FsLoc.RelDir.RelDir
      }
      operations.push({ type: 'clear', path: relDir })
      return self
    },

    move(from: any, to: any) {
      // Handle string inputs
      if (typeof from === 'string' && typeof to === 'string') {
        const fromLoc = FsLoc.FsLocLoose.decodeSync(from)
        const toLoc = FsLoc.FsLocLoose.decodeSync(to)

        // Check if both are files or both are directories
        if (fromLoc.file && toLoc.file) {
          // Both are files - reconstruct as RelFile
          const fromFile = FsLoc.RelFile.make({
            path: fromLoc.path as typeof FsLoc.Path.Rel.Decoded.Type,
            file: fromLoc.file,
          })
          const toFile = FsLoc.RelFile.make({
            path: toLoc.path as typeof FsLoc.Path.Rel.Decoded.Type,
            file: toLoc.file,
          })
          operations.push({ type: 'move-file', from: fromFile, to: toFile })
        } else if (!fromLoc.file && !toLoc.file) {
          // Both are directories - reconstruct as RelDir
          const fromDir = FsLoc.RelDir.make({
            path: fromLoc.path as typeof FsLoc.Path.Rel.Decoded.Type,
          })
          const toDir = FsLoc.RelDir.make({
            path: toLoc.path as typeof FsLoc.Path.Rel.Decoded.Type,
          })
          operations.push({ type: 'move-dir', from: fromDir, to: toDir })
        } else {
          throw new Error('Cannot move between file and directory')
        }
      } else {
        // Already typed - TypeScript ensures they match via overloads
        if (FsLoc.Groups.File.is(from)) {
          operations.push({
            type: 'move-file',
            from: from as FsLoc.RelFile.RelFile,
            to: to as FsLoc.RelFile.RelFile,
          })
        } else {
          operations.push({
            type: 'move-dir',
            from: from as FsLoc.RelDir.RelDir,
            to: to as FsLoc.RelDir.RelDir,
          })
        }
      }
      return self
    },

    commit(): Effect.Effect<void, FSError, FS> {
      return Ops.executeOperations(dir, operations)
    },
  } // Expose operations for nested dir() calls
  ;(self as any).__operations__ = operations

  return self
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
