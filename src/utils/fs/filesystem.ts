/**
 * Type-safe filesystem operations using FsLoc types.
 *
 * These functions wrap Effect's FileSystem service to work with FsLoc types
 * instead of raw strings, providing type safety for all filesystem paths.
 *
 * @module
 */

import { FsLoc } from '#fs-loc'
import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Effect, Scope, Sink, Stream } from 'effect'

// Re-export types from FileSystem for convenience
export type {
  AccessFileOptions,
  CopyOptions,
  MakeDirectoryOptions,
  MakeTempDirectoryOptions,
  MakeTempFileOptions,
  OpenFileOptions,
  ReadDirectoryOptions,
  RemoveOptions,
  SinkOptions,
  StreamOptions,
  WatchOptions,
  WriteFileOptions,
  WriteFileStringOptions,
} from '@effect/platform/FileSystem'

// ============================================================================
// Single-path operations
// ============================================================================

/**
 * Check if a file or directory exists.
 *
 * @param loc - The location to check
 * @returns true if the path exists, false otherwise
 *
 * @example
 * ```ts
 * const file = FsLoc.AbsFile.decodeSync('/etc/passwd')
 * const exists = yield* Fs.exists(file)
 * ```
 */
export const exists = (
  loc: FsLoc.FsLoc,
): Effect.Effect<boolean, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.exists(FsLoc.encodeSync(loc))
  })

/**
 * Check file access permissions.
 *
 * @param loc - The location to check
 * @param options - Access options
 */
export const access = (
  loc: FsLoc.FsLoc,
  options?: FileSystem.AccessFileOptions,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.access(FsLoc.encodeSync(loc), options)
  })

/**
 * Change file permissions.
 *
 * @param loc - The location to modify
 * @param mode - The permission mode
 */
export const chmod = (
  loc: FsLoc.FsLoc,
  mode: number,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.chmod(FsLoc.encodeSync(loc), mode)
  })

/**
 * Change file ownership.
 *
 * @param loc - The location to modify
 * @param uid - User ID
 * @param gid - Group ID
 */
export const chown = (
  loc: FsLoc.FsLoc,
  uid: number,
  gid: number,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.chown(FsLoc.encodeSync(loc), uid, gid)
  })

/**
 * Create a directory.
 *
 * @param loc - The directory location to create
 * @param options - Directory creation options
 *
 * @example
 * ```ts
 * const dir = FsLoc.AbsDir.decodeSync('/tmp/myapp/')
 * yield* Fs.makeDirectory(dir, { recursive: true })
 * ```
 */
export const makeDirectory = (
  loc: FsLoc.FsLoc,
  options: FileSystem.MakeDirectoryOptions = { recursive: false },
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.makeDirectory(FsLoc.encodeSync(loc), options)
  })

/**
 * Open a file.
 *
 * @param loc - The file location to open
 * @param options - File open options
 */
export const open = (
  loc: FsLoc.FsLoc,
  options?: FileSystem.OpenFileOptions,
): Effect.Effect<FileSystem.File, PlatformError, FileSystem.FileSystem | Scope.Scope> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.open(FsLoc.encodeSync(loc), options)
  })

/**
 * Read a directory's contents.
 *
 * @param loc - The directory location to read
 * @param options - Read options
 * @returns Array of FsLoc items in the directory
 *
 * @example
 * ```ts
 * const dir = FsLoc.AbsDir.decodeSync('/home/user/')
 * const entries = yield* Fs.readDirectory(dir)
 * // entries are FsLoc objects, not strings
 * ```
 */
export const readDirectory = (
  loc: FsLoc.FsLoc,
  options?: FileSystem.ReadDirectoryOptions,
): Effect.Effect<readonly string[], PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const dirPath = FsLoc.encodeSync(loc)
    const entries = yield* (options ? fs.readDirectory(dirPath, options) : fs.readDirectory(dirPath))

    // Return just the string names as the FileSystem API does
    return entries
  })

/**
 * Read a file as a Uint8Array.
 *
 * @param loc - The file location to read
 */
export const readFile = (
  loc: FsLoc.FsLoc,
): Effect.Effect<Uint8Array, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.readFile(FsLoc.encodeSync(loc))
  })

/**
 * Read a file as a string.
 *
 * @param loc - The file location to read
 * @param encoding - Text encoding (default: utf-8)
 *
 * @example
 * ```ts
 * const config = FsLoc.AbsFile.decodeSync('/etc/config.json')
 * const content = yield* Fs.readFileString(config)
 * const data = JSON.parse(content)
 * ```
 */
export const readFileString = (
  loc: FsLoc.FsLoc,
  encoding: string = 'utf-8',
): Effect.Effect<string, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.readFileString(FsLoc.encodeSync(loc), encoding)
  })

/**
 * Read a symbolic link.
 *
 * @param loc - The symlink location to read
 * @returns The target location as a FsLocLoose
 */
export const readLink = (
  loc: FsLoc.FsLoc,
): Effect.Effect<FsLoc.FsLocLoose.LocLoose, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const target = yield* fs.readLink(FsLoc.encodeSync(loc))
    return FsLoc.FsLocLoose.decodeSync(target)
  })

/**
 * Get the real path (canonical path) of a location.
 *
 * @param loc - The location to resolve
 * @returns The canonical location
 */
export const realPath = (
  loc: FsLoc.FsLoc,
): Effect.Effect<FsLoc.FsLocLoose.LocLoose, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const real = yield* fs.realPath(FsLoc.encodeSync(loc))
    // We can't easily determine if it's a file or directory without stat
    // So we return FsLocLoose which can be either
    return FsLoc.FsLocLoose.decodeSync(real)
  })

/**
 * Remove a file or directory.
 *
 * @param loc - The location to remove
 * @param options - Removal options
 *
 * @example
 * ```ts
 * const tempDir = FsLoc.AbsDir.decodeSync('/tmp/build/')
 * yield* Fs.remove(tempDir, { recursive: true })
 * ```
 */
export const remove = (
  loc: FsLoc.FsLoc,
  options: FileSystem.RemoveOptions = { recursive: false },
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.remove(FsLoc.encodeSync(loc), options)
  })

/**
 * Create a sink for writing data to a file.
 *
 * @param loc - The file location to write to
 * @param options - Sink options
 */
export const sink = (
  loc: FsLoc.FsLoc,
  options: FileSystem.SinkOptions = {},
): Sink.Sink<void, Uint8Array, never, PlatformError, FileSystem.FileSystem> => {
  return Sink.unwrapScoped(
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      return fs.sink(FsLoc.encodeSync(loc), options)
    }),
  )
}

/**
 * Get file or directory statistics.
 *
 * @param loc - The location to stat
 */
export const stat = (
  loc: FsLoc.FsLoc,
): Effect.Effect<FileSystem.File.Info, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.stat(FsLoc.encodeSync(loc))
  })

/**
 * Create a stream for reading data from a file.
 *
 * @param loc - The file location to read from
 * @param options - Stream options
 */
export const stream = (
  loc: FsLoc.FsLoc,
  options: FileSystem.StreamOptions = {},
): Stream.Stream<Uint8Array, PlatformError, FileSystem.FileSystem> => {
  return Stream.unwrap(
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      return fs.stream(FsLoc.encodeSync(loc), options)
    }),
  )
}

/**
 * Truncate a file to a specified length.
 *
 * @param loc - The file location to truncate
 * @param length - The new length
 */
export const truncate = (
  loc: FsLoc.FsLoc,
  length?: FileSystem.SizeInput,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.truncate(FsLoc.encodeSync(loc), length)
  })

/**
 * Update file access and modification times.
 *
 * @param loc - The file location to update
 * @param atime - Access time
 * @param mtime - Modification time
 */
export const utimes = (
  loc: FsLoc.FsLoc,
  atime: Date | number,
  mtime: Date | number,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.utimes(FsLoc.encodeSync(loc), atime, mtime)
  })

/**
 * Watch a file or directory for changes.
 *
 * @param loc - The location to watch
 * @param options - Watch options
 */
export const watch = (
  loc: FsLoc.FsLoc,
  options?: FileSystem.WatchOptions,
): Stream.Stream<FileSystem.WatchEvent, PlatformError, FileSystem.FileSystem> => {
  return Stream.unwrap(
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      return fs.watch(FsLoc.encodeSync(loc), options)
    }),
  )
}

/**
 * Write a Uint8Array to a file.
 *
 * @param loc - The file location to write to
 * @param data - The data to write
 * @param options - Write options
 */
export const writeFile = (
  loc: FsLoc.FsLoc,
  data: Uint8Array,
  options: FileSystem.WriteFileOptions = {},
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.writeFile(FsLoc.encodeSync(loc), data, options)
  })

/**
 * Write a string to a file.
 *
 * @param loc - The file location to write to
 * @param data - The string to write
 * @param options - Write options
 *
 * @example
 * ```ts
 * const config = FsLoc.AbsFile.decodeSync('/etc/config.json')
 * const data = JSON.stringify({ key: 'value' }, null, 2)
 * yield* Fs.writeFileString(config, data)
 * ```
 */
export const writeFileString = (
  loc: FsLoc.FsLoc,
  data: string,
  options: FileSystem.WriteFileStringOptions = {},
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.writeFileString(FsLoc.encodeSync(loc), data, options)
  })

// ============================================================================
// Two-path operations
// ============================================================================

/**
 * Copy a file or directory.
 *
 * @param from - Source location
 * @param to - Destination location
 * @param options - Copy options
 *
 * @example
 * ```ts
 * const src = FsLoc.AbsFile.decodeSync('/src/file.txt')
 * const dst = FsLoc.AbsFile.decodeSync('/dst/file.txt')
 * yield* Fs.copy(src, dst)
 * ```
 */
export const copy = (
  from: FsLoc.FsLoc,
  to: FsLoc.FsLoc,
  options: FileSystem.CopyOptions = {},
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.copy(FsLoc.encodeSync(from), FsLoc.encodeSync(to), options)
  })

/**
 * Copy a file (not a directory).
 *
 * @param from - Source file location
 * @param to - Destination file location
 */
export const copyFile = (
  from: FsLoc.FsLoc,
  to: FsLoc.FsLoc,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.copyFile(FsLoc.encodeSync(from), FsLoc.encodeSync(to))
  })

/**
 * Create a hard link.
 *
 * @param from - Source location
 * @param to - Link location
 */
export const link = (
  from: FsLoc.FsLoc,
  to: FsLoc.FsLoc,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.link(FsLoc.encodeSync(from), FsLoc.encodeSync(to))
  })

/**
 * Rename or move a file or directory.
 *
 * @param oldPath - Current location
 * @param newPath - New location
 *
 * @example
 * ```ts
 * const old = FsLoc.AbsFile.decodeSync('/tmp/old.txt')
 * const new = FsLoc.AbsFile.decodeSync('/tmp/new.txt')
 * yield* Fs.rename(old, new)
 * ```
 */
export const rename = (
  oldPath: FsLoc.FsLoc,
  newPath: FsLoc.FsLoc,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.rename(FsLoc.encodeSync(oldPath), FsLoc.encodeSync(newPath))
  })

/**
 * Create a symbolic link.
 *
 * @param from - Target location
 * @param to - Symlink location
 */
export const symlink = (
  from: FsLoc.FsLoc,
  to: FsLoc.FsLoc,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.symlink(FsLoc.encodeSync(from), FsLoc.encodeSync(to))
  })

// ============================================================================
// Special operations that return paths
// ============================================================================

/**
 * Create a temporary directory.
 *
 * @param options - Options for temporary directory creation
 * @returns The created directory location
 */
export const makeTempDirectory = (
  options?: FileSystem.MakeTempDirectoryOptions,
): Effect.Effect<FsLoc.AbsDir.AbsDir, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const path = yield* (options ? fs.makeTempDirectory(options) : fs.makeTempDirectory())
    // Temp directories are always absolute paths
    return FsLoc.AbsDir.decodeSync(path.endsWith('/') ? path : path + '/')
  })

/**
 * Create a temporary directory with automatic cleanup.
 *
 * @param options - Options for temporary directory creation
 * @returns The created directory location (cleaned up when scope ends)
 */
export const makeTempDirectoryScoped = (
  options?: FileSystem.MakeTempDirectoryOptions,
): Effect.Effect<FsLoc.AbsDir.AbsDir, PlatformError, FileSystem.FileSystem | Scope.Scope> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const path = yield* fs.makeTempDirectoryScoped(options)
    // Temp directories are always absolute paths
    return FsLoc.AbsDir.decodeSync(path.endsWith('/') ? path : path + '/')
  })

/**
 * Create a temporary file.
 *
 * @param options - Options for temporary file creation
 * @returns The created file location
 */
export const makeTempFile = (
  options?: FileSystem.MakeTempFileOptions,
): Effect.Effect<FsLoc.AbsFile.AbsFile, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const path = yield* (options ? fs.makeTempFile(options) : fs.makeTempFile())
    // Temp files are always absolute paths
    return FsLoc.AbsFile.decodeSync(path)
  })

/**
 * Create a temporary file with automatic cleanup.
 *
 * @param options - Options for temporary file creation
 * @returns The created file location (cleaned up when scope ends)
 */
export const makeTempFileScoped = (
  options?: FileSystem.MakeTempFileOptions,
): Effect.Effect<FsLoc.AbsFile.AbsFile, PlatformError, FileSystem.FileSystem | Scope.Scope> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const path = yield* fs.makeTempFileScoped(options)
    // Temp files are always absolute paths
    return FsLoc.AbsFile.decodeSync(path)
  })
