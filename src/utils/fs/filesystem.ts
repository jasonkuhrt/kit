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
 * Read a file or directory.
 *
 * @param loc - The location to read
 * @param options - Read options (only for directories)
 * @returns File contents as Uint8Array for files, or string array for directories
 *
 * @example
 * ```ts
 * // Reading a file returns Uint8Array
 * const file = FsLoc.AbsFile.decodeSync('/data/file.bin')
 * const bytes = yield* Fs.read(file)
 *
 * // Reading a directory returns string array
 * const dir = FsLoc.AbsDir.decodeSync('/home/user/')
 * const entries = yield* Fs.read(dir)
 * ```
 */
export const read: {
  <L extends FsLoc.Groups.File.File>(
    loc: L,
  ): Effect.Effect<Uint8Array, PlatformError, FileSystem.FileSystem>
  <L extends FsLoc.Groups.Dir.Dir>(
    loc: L,
    options?: FileSystem.ReadDirectoryOptions,
  ): Effect.Effect<readonly string[], PlatformError, FileSystem.FileSystem>
  <L extends FsLoc.FsLoc>(
    loc: L,
    options?: L extends FsLoc.Groups.Dir.Dir ? FileSystem.ReadDirectoryOptions : never,
  ): Effect.Effect<
    L extends FsLoc.Groups.File.File ? Uint8Array : L extends FsLoc.Groups.Dir.Dir ? readonly string[] : never,
    PlatformError,
    FileSystem.FileSystem
  >
} = (
  loc: FsLoc.FsLoc,
  options?: FileSystem.ReadDirectoryOptions,
): Effect.Effect<any, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    if (FsLoc.Groups.File.is(loc)) {
      return yield* fs.readFile(FsLoc.encodeSync(loc))
    } else {
      const dirPath = FsLoc.encodeSync(loc)
      const entries = yield* (options ? fs.readDirectory(dirPath, options) : fs.readDirectory(dirPath))
      return entries
    }
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
 * const content = yield* Fs.readString(config)
 * const data = JSON.parse(content)
 * ```
 */
export const readString = (
  loc: FsLoc.Groups.File.File,
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
 * Write data to a file or create a directory.
 *
 * @param loc - The location to write to
 * @param data - The data to write (Uint8Array for files, void/undefined for directories)
 * @param options - Write options (WriteFileOptions for files, MakeDirectoryOptions for directories)
 *
 * @example
 * ```ts
 * // Writing to a file
 * const file = FsLoc.AbsFile.decodeSync('/data/output.bin')
 * const bytes = new Uint8Array([1, 2, 3])
 * yield* Fs.write(file, bytes)
 *
 * // Creating a directory
 * const dir = FsLoc.AbsDir.decodeSync('/data/output/')
 * yield* Fs.write(dir, undefined, { recursive: true })
 * ```
 */
export const write: {
  <L extends FsLoc.Groups.File.File>(
    loc: L,
    data: Uint8Array,
    options?: FileSystem.WriteFileOptions,
  ): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
  <L extends FsLoc.Groups.Dir.Dir>(
    loc: L,
    data?: undefined,
    options?: FileSystem.MakeDirectoryOptions,
  ): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
  <L extends FsLoc.FsLoc>(
    loc: L,
    data: L extends FsLoc.Groups.File.File ? Uint8Array : undefined,
    options?: L extends FsLoc.Groups.File.File ? FileSystem.WriteFileOptions
      : L extends FsLoc.Groups.Dir.Dir ? FileSystem.MakeDirectoryOptions
      : never,
  ): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
} = (
  loc: FsLoc.FsLoc,
  data?: Uint8Array | undefined,
  options?: FileSystem.WriteFileOptions | FileSystem.MakeDirectoryOptions,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    if (FsLoc.Groups.File.is(loc)) {
      return yield* fs.writeFile(
        FsLoc.encodeSync(loc),
        data as Uint8Array,
        (options as FileSystem.WriteFileOptions) || {},
      )
    } else {
      return yield* fs.makeDirectory(
        FsLoc.encodeSync(loc),
        (options as FileSystem.MakeDirectoryOptions) || { recursive: false },
      )
    }
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
 * yield* Fs.writeString(config, data)
 * ```
 */
export const writeString = (
  loc: FsLoc.Groups.File.File,
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
 * Intelligently dispatches to the optimal implementation:
 * - When copying file to file: uses optimized `copyFile`
 * - When copying directories or mixed types: uses general `copy`
 *
 * @param from - Source location
 * @param to - Destination location
 * @param options - Copy options
 *
 * @example
 * ```ts
 * // File to file - uses optimized copyFile internally
 * const src = FsLoc.AbsFile.decodeSync('/src/file.txt')
 * const dst = FsLoc.AbsFile.decodeSync('/dst/file.txt')
 * yield* Fs.copy(src, dst)
 *
 * // Directory to directory - uses general copy
 * const srcDir = FsLoc.AbsDir.decodeSync('/src/dir/')
 * const dstDir = FsLoc.AbsDir.decodeSync('/dst/dir/')
 * yield* Fs.copy(srcDir, dstDir)
 * ```
 */
export const copy = (
  from: FsLoc.FsLoc,
  to: FsLoc.FsLoc,
  options: FileSystem.CopyOptions = {},
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    // If both source and destination are files, use the optimized copyFile
    if (FsLoc.Groups.File.is(from) && FsLoc.Groups.File.is(to)) {
      return yield* fs.copyFile(FsLoc.encodeSync(from), FsLoc.encodeSync(to))
    }

    // Otherwise use the general copy (for directories or mixed types)
    return yield* fs.copy(FsLoc.encodeSync(from), FsLoc.encodeSync(to), options)
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
 * Options for creating temporary files.
 */
export interface TempFileOptions {
  readonly type: 'file'
  readonly directory?: string
  readonly prefix?: string
  readonly suffix?: string
}

/**
 * Options for creating temporary directories.
 */
export interface TempDirectoryOptions {
  readonly type: 'directory'
  readonly directory?: string
  readonly prefix?: string
}

/**
 * Options for creating temporary locations.
 */
export type MakeTempOptions = TempFileOptions | TempDirectoryOptions

/**
 * Create a temporary directory.
 *
 * This is a more specific version of `makeTemp` that only creates directories
 * and directly returns `AbsDir` without requiring type narrowing.
 *
 * @param options - Options for the temporary directory
 * @returns The created directory as an AbsDir
 *
 * @example
 * ```ts
 * import { Fs } from '#fs'
 *
 * // Create a temporary directory with default options
 * const tempDir = yield* Fs.makeTempDirectory()
 *
 * // Create with a prefix
 * const testDir = yield* Fs.makeTempDirectory({ prefix: 'test-' })
 *
 * // Create in a specific parent directory
 * const buildDir = yield* Fs.makeTempDirectory({
 *   directory: '/tmp/builds',
 *   prefix: 'build-'
 * })
 * ```
 */
export const makeTempDirectory = (
  options: FileSystem.MakeTempDirectoryOptions = {},
): Effect.Effect<FsLoc.AbsDir.AbsDir, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const path = yield* fs.makeTempDirectory(options)
    return FsLoc.AbsDir.decodeSync(path.endsWith('/') ? path : path + '/')
  })

/**
 * Create a temporary directory with automatic cleanup.
 *
 * The directory will be automatically removed when the scope ends.
 * This is a more specific version of `makeTempScoped` that only creates directories
 * and directly returns `AbsDir` without requiring type narrowing.
 *
 * @param options - Options for the temporary directory
 * @returns The created directory as an AbsDir (cleaned up when scope ends)
 *
 * @example
 * ```ts
 * import { Fs } from '#fs'
 * import { Effect, Scope } from 'effect'
 *
 * Effect.gen(function*() {
 *   // Directory will be cleaned up when scope ends
 *   const tempDir = yield* Fs.makeTempDirectoryScoped({ prefix: 'test-' })
 *
 *   // Use the directory...
 *   yield* Fs.writeString(
 *     FsLoc.join(tempDir, FsLoc.RelFile.decodeSync('./data.txt')),
 *     'test data'
 *   )
 * }).pipe(Effect.scoped)
 * ```
 */
export const makeTempDirectoryScoped = (
  options: FileSystem.MakeTempDirectoryOptions = {},
): Effect.Effect<FsLoc.AbsDir.AbsDir, PlatformError, FileSystem.FileSystem | Scope.Scope> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const path = yield* fs.makeTempDirectoryScoped(options)
    return FsLoc.AbsDir.decodeSync(path.endsWith('/') ? path : path + '/')
  })

/**
 * Create a temporary file or directory.
 *
 * @param options - Options specifying the type and configuration
 * @returns The created location (file or directory based on options.type)
 *
 * @example
 * ```ts
 * // Create a temporary file
 * const tempFile = yield* Fs.makeTemp({ type: 'file', suffix: '.txt' })
 *
 * // Create a temporary directory
 * const tempDir = yield* Fs.makeTemp({ type: 'directory', prefix: 'test-' })
 * ```
 */
export const makeTemp = <T extends MakeTempOptions>(options: T): Effect.Effect<
  T extends TempFileOptions ? FsLoc.AbsFile.AbsFile : FsLoc.AbsDir.AbsDir,
  PlatformError,
  FileSystem.FileSystem
> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    if (options.type === 'file') {
      const fileOpts: FileSystem.MakeTempFileOptions = {
        ...(options.directory !== undefined && { directory: options.directory }),
        ...(options.prefix !== undefined && { prefix: options.prefix }),
        ...((options as TempFileOptions).suffix !== undefined && { suffix: (options as TempFileOptions).suffix }),
      }
      const path = yield* fs.makeTempFile(fileOpts)
      return FsLoc.AbsFile.decodeSync(path) as any
    } else {
      const dirOpts: FileSystem.MakeTempDirectoryOptions = {
        ...(options.directory !== undefined && { directory: options.directory }),
        ...(options.prefix !== undefined && { prefix: options.prefix }),
      }
      const path = yield* fs.makeTempDirectory(dirOpts)
      return FsLoc.AbsDir.decodeSync(path.endsWith('/') ? path : path + '/') as any
    }
  })

/**
 * Create a temporary file or directory with automatic cleanup.
 *
 * @param options - Options specifying the type and configuration
 * @returns The created location (cleaned up when scope ends)
 *
 * @example
 * ```ts
 * // Create a scoped temporary file
 * const tempFile = yield* Fs.makeTempScoped({ type: 'file' })
 * // File is automatically deleted when scope ends
 * ```
 */
export const makeTempScoped = <T extends MakeTempOptions>(options: T): Effect.Effect<
  T extends TempFileOptions ? FsLoc.AbsFile.AbsFile : FsLoc.AbsDir.AbsDir,
  PlatformError,
  FileSystem.FileSystem | Scope.Scope
> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    if (options.type === 'file') {
      const fileOpts: FileSystem.MakeTempFileOptions = {
        ...(options.directory !== undefined && { directory: options.directory }),
        ...(options.prefix !== undefined && { prefix: options.prefix }),
        ...((options as TempFileOptions).suffix !== undefined && { suffix: (options as TempFileOptions).suffix }),
      }
      const path = yield* fs.makeTempFileScoped(fileOpts)
      return FsLoc.AbsFile.decodeSync(path) as any
    } else {
      const dirOpts: FileSystem.MakeTempDirectoryOptions = {
        ...(options.directory !== undefined && { directory: options.directory }),
        ...(options.prefix !== undefined && { prefix: options.prefix }),
      }
      const path = yield* fs.makeTempDirectoryScoped(dirOpts)
      return FsLoc.AbsDir.decodeSync(path.endsWith('/') ? path : path + '/') as any
    }
  })
