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
 * Wrapper for {@link FileSystem.FileSystem.exists} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The location to check (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.access} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The location to check (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.chmod} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The location to modify (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.chown} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The location to modify (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.open} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The file location to open (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.readFile} and {@link FileSystem.FileSystem.readDirectory} that accepts FsLoc types.
 *
 * Dispatches to the appropriate underlying function based on the FsLoc type:
 * - File locations call `readFile` and return `Uint8Array`
 * - Directory locations call `readDirectory`, stat each entry, and return an array of FsLoc types
 *
 * @param loc - The location to read (file or directory)
 * @param options - Read options (only for directories)
 * @returns File contents as Uint8Array for files, or FsLoc array for directories
 *
 * @example
 * ```ts
 * // Reading a file returns Uint8Array
 * const file = FsLoc.AbsFile.decodeSync('/data/file.bin')
 * const bytes = yield* Fs.read(file)
 *
 * // Reading a directory returns FsLoc array
 * const dir = FsLoc.AbsDir.decodeSync('/home/user/')
 * const entries = yield* Fs.read(dir)
 * // entries is FsLoc.Groups.Abs.Abs[] (union of AbsFile | AbsDir)
 * ```
 */
export const read: {
  <L extends FsLoc.Groups.File.File>(
    loc: L,
  ): Effect.Effect<Uint8Array, PlatformError, FileSystem.FileSystem>
  <L extends FsLoc.Groups.Dir.Dir>(
    loc: L,
    options?: FileSystem.ReadDirectoryOptions,
  ): Effect.Effect<
    readonly (L extends FsLoc.AbsDir.AbsDir ? FsLoc.Groups.Abs.Abs : FsLoc.Groups.Rel.Rel)[],
    PlatformError,
    FileSystem.FileSystem
  >
  <L extends FsLoc.FsLoc>(
    loc: L,
    options?: L extends FsLoc.Groups.Dir.Dir ? FileSystem.ReadDirectoryOptions : never,
  ): Effect.Effect<
    L extends FsLoc.Groups.File.File ? Uint8Array
      : L extends FsLoc.Groups.Dir.Dir
        ? readonly (L extends FsLoc.AbsDir.AbsDir ? FsLoc.Groups.Abs.Abs : FsLoc.Groups.Rel.Rel)[]
      : never,
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

      // Stat each entry to determine if it's a file or directory
      const fsLocs = yield* Effect.all(
        entries.map(entry =>
          Effect.gen(function*() {
            // Create the full path for stat
            const entryPath = dirPath.endsWith('/') ? dirPath + entry : dirPath + '/' + entry
            const info = yield* fs.stat(entryPath)

            // Use stat info to determine type
            const isDirectory = info.type === 'Directory'

            if (isDirectory) {
              // Create directory FsLoc
              const dirEntry = entry.endsWith('/') ? entry : entry + '/'
              if (FsLoc.AbsDir.is(loc)) {
                return FsLoc.AbsDir.decodeSync(entryPath + '/')
              } else {
                return FsLoc.RelDir.decodeSync('./' + dirEntry)
              }
            } else {
              // Create file FsLoc
              if (FsLoc.AbsDir.is(loc)) {
                return FsLoc.AbsFile.decodeSync(entryPath)
              } else {
                return FsLoc.RelFile.decodeSync('./' + entry)
              }
            }
          })
        ),
      )

      return fsLocs
    }
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.readFileString} that accepts FsLoc types.
 *
 * Takes a FsLoc file location instead of a string path.
 *
 * @param loc - The file location to read (must be a file type)
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
 * Wrapper for {@link FileSystem.FileSystem.readLink} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path and returns a FsLocLoose
 * instead of a string.
 *
 * @param loc - The symlink location to read (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.realPath} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path and returns a FsLocLoose
 * instead of a string.
 *
 * @param loc - The location to resolve (any FsLoc type)
 * @returns The canonical location as a FsLocLoose
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
 * Wrapper for {@link FileSystem.FileSystem.remove} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The location to remove (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.sink} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The file location to write to (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.stat} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The location to stat (any FsLoc type)
 */
export const stat = (
  loc: FsLoc.FsLoc,
): Effect.Effect<FileSystem.File.Info, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    return yield* fs.stat(FsLoc.encodeSync(loc))
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.stream} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The file location to read from (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.truncate} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The file location to truncate (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.utimes} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The file location to update (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.watch} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The location to watch (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.writeFile} and {@link FileSystem.FileSystem.makeDirectory} that accepts FsLoc types.
 *
 * Dispatches to the appropriate underlying function based on the FsLoc type:
 * - File locations call `writeFile` with the provided data
 * - Directory locations call `makeDirectory`
 *
 * @param loc - The location to write to (file or directory)
 * @param data - The data to write (Uint8Array for files, omitted for directories)
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
 * yield* Fs.write(dir)
 * yield* Fs.write(dir, { recursive: true })
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
    options?: FileSystem.MakeDirectoryOptions,
  ): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
  <L extends FsLoc.FsLoc>(
    loc: L,
    ...args: L extends FsLoc.Groups.File.File ? [data: Uint8Array, options?: FileSystem.WriteFileOptions]
      : L extends FsLoc.Groups.Dir.Dir ? [options?: FileSystem.MakeDirectoryOptions]
      : never
  ): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
} = (
  loc: FsLoc.FsLoc,
  ...args: any[]
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    if (FsLoc.Groups.File.is(loc)) {
      const [data, options] = args as [Uint8Array, FileSystem.WriteFileOptions | undefined]
      return yield* fs.writeFile(
        FsLoc.encodeSync(loc),
        data,
        options || {},
      )
    } else {
      const [options] = args as [FileSystem.MakeDirectoryOptions | undefined]
      return yield* fs.makeDirectory(
        FsLoc.encodeSync(loc),
        options || { recursive: false },
      )
    }
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.writeFileString} that accepts FsLoc types.
 *
 * Takes a FsLoc file location instead of a string path.
 *
 * @param loc - The file location to write to (must be a file type)
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
 * Wrapper for {@link FileSystem.FileSystem.copy} and {@link FileSystem.FileSystem.copyFile} that accepts FsLoc types.
 *
 * Takes FsLoc locations instead of string paths. Intelligently dispatches:
 * - When both locations are files: uses optimized `copyFile`
 * - Otherwise: uses general `copy`
 *
 * @param from - Source location (any FsLoc type)
 * @param to - Destination location (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.link} that accepts FsLoc types.
 *
 * Takes FsLoc locations instead of string paths.
 *
 * @param from - Source location (any FsLoc type)
 * @param to - Link location (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.rename} that accepts FsLoc types.
 *
 * Takes FsLoc locations instead of string paths.
 *
 * @param oldPath - Current location (any FsLoc type)
 * @param newPath - New location (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.symlink} that accepts FsLoc types.
 *
 * Takes FsLoc locations instead of string paths.
 *
 * @param from - Target location (any FsLoc type)
 * @param to - Symlink location (any FsLoc type)
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
 * Wrapper for {@link FileSystem.FileSystem.makeTempDirectory} that returns FsLoc types.
 *
 * Creates a temporary directory and returns an AbsDir instead of a string path.
 * Ensures the path has a trailing slash for proper directory representation.
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
    return FsLoc.AbsDir.decodeSync(path)
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.makeTempDirectoryScoped} that returns FsLoc types.
 *
 * Creates a temporary directory with automatic cleanup and returns an AbsDir instead
 * of a string path. The directory is automatically removed when the scope ends.
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
    return FsLoc.AbsDir.decodeSync(path)
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.makeTempFile} and {@link FileSystem.FileSystem.makeTempDirectory} that returns FsLoc types.
 *
 * Dispatches based on `options.type` and returns the appropriate FsLoc type:
 * - `type: 'file'` returns AbsFile
 * - `type: 'directory'` returns AbsDir
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
      return FsLoc.AbsDir.decodeSync(path) as any
    }
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.makeTempFileScoped} and {@link FileSystem.FileSystem.makeTempDirectoryScoped} that returns FsLoc types.
 *
 * Dispatches based on `options.type` and returns the appropriate FsLoc type.
 * The created file or directory is automatically removed when the scope ends.
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
      return FsLoc.AbsDir.decodeSync(path) as any
    }
  })
