/**
 * Type-safe filesystem operations using FsLoc types.
 *
 * These functions wrap Effect's FileSystem service to work with FsLoc types
 * instead of raw strings, providing type safety for all filesystem paths.
 *
 * @module
 */

import { FsLoc } from '#fs-loc'
import type { Json } from '#json'
import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Effect, Scope, Sink, Stream } from 'effect'

/**
 * Type utility to infer content type from file path.
 * Maps file extensions to their expected content types.
 */
// dprint-ignore
export type InferFileContent<$Path extends FsLoc.Groups.File.File> =
     $Path extends FsLoc.AbsFile.AbsFile                    ? InferContentFromExtension<$Path['file']['extension']>
   : $Path extends FsLoc.RelFile.RelFile                    ? InferContentFromExtension<$Path['file']['extension']>
   : never
/**
 * Maps file extensions to their expected content types.
 * - .json files expect Json.Value
 * - .txt, .md, .yml, .yaml, .xml, .html, .css, .js, .ts, etc expect string
 * - Binary files (.png, .jpg, .pdf, .bin, etc) expect Uint8Array
 * - No extension or unknown expects string | Uint8Array
 */
// dprint-ignore
type InferContentFromExtension<Ext> =
     Ext extends '.json'                                                                                                           ? Json.Object
   : Ext extends '.txt' | '.md' | '.yml' | '.yaml' | '.xml' | '.html' | '.css' | '.js' | '.ts' | '.jsx' | '.tsx' | '.mjs' | '.cjs' ? string
   : Ext extends '.png' | '.jpg' | '.jpeg' | '.gif' | '.bmp' | '.ico' | '.svg' | '.webp'           ? Uint8Array
   : Ext extends '.pdf' | '.doc' | '.docx' | '.xls' | '.xlsx' | '.ppt' | '.pptx'                   ? Uint8Array
   : Ext extends '.zip' | '.tar' | '.gz' | '.bz2' | '.7z' | '.rar'                                 ? Uint8Array
   : Ext extends '.bin' | '.exe' | '.dll' | '.so' | '.dylib'                                       ? Uint8Array
   : Ext extends '.mp3' | '.mp4' | '.avi' | '.mov' | '.wmv' | '.flv' | '.webm' | '.ogg' | '.wav'   ? Uint8Array
   : Ext extends null                                                                              ? string | Uint8Array | Json.Object  // No extension
   :                                                                                                 string | Uint8Array | Json.Object // Unknown/dynamic extension

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
export const exists = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
): Effect.Effect<boolean, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.exists(FsLoc.encodeSync(fsLoc))
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.access} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The location to check (any FsLoc type)
 * @param options - Access options
 */
export const access = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
  options?: FileSystem.AccessFileOptions,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.access(FsLoc.encodeSync(fsLoc), options)
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.chmod} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The location to modify (any FsLoc type)
 * @param mode - The permission mode
 */
export const chmod = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
  mode: number,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.chmod(FsLoc.encodeSync(fsLoc), mode)
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
export const chown = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
  uid: number,
  gid: number,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.chown(FsLoc.encodeSync(fsLoc), uid, gid)
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.open} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The file location to open (any FsLoc type)
 * @param options - File open options
 */
export const open = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
  options?: FileSystem.OpenFileOptions,
): Effect.Effect<FileSystem.File, PlatformError, FileSystem.FileSystem | Scope.Scope> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.open(FsLoc.encodeSync(fsLoc), options)
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
  <L extends FsLoc.Groups.File.File | string>(
    loc: FsLoc.Inputs.Validate.File<L>,
  ): Effect.Effect<Uint8Array, PlatformError, FileSystem.FileSystem>

  <L extends FsLoc.Groups.Dir.Dir | string>(
    loc: FsLoc.Inputs.Validate.Dir<L>,
    options?: FileSystem.ReadDirectoryOptions,
  ): Effect.Effect<
    readonly (L extends FsLoc.AbsDir.AbsDir ? FsLoc.Groups.Abs.Abs
      : L extends string ? FsLoc.FsLoc
      : FsLoc.Groups.Rel.Rel)[],
    PlatformError,
    FileSystem.FileSystem
  >

  <L extends FsLoc.FsLoc | string>(
    loc: FsLoc.Inputs.Validate.Any<L>,
    options?: L extends FsLoc.Groups.Dir.Dir ? FileSystem.ReadDirectoryOptions
      : L extends string ? FileSystem.ReadDirectoryOptions
      : never,
  ): Effect.Effect<
    L extends FsLoc.Groups.File.File ? Uint8Array
      : L extends string ? Uint8Array | readonly FsLoc.FsLoc[]
      : L extends FsLoc.Groups.Dir.Dir
        ? readonly (L extends FsLoc.AbsDir.AbsDir ? FsLoc.Groups.Abs.Abs : FsLoc.Groups.Rel.Rel)[]
      : never,
    PlatformError,
    FileSystem.FileSystem
  >
} = (
  loc: any,
  options?: FileSystem.ReadDirectoryOptions,
): Effect.Effect<any, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)

    if (FsLoc.Groups.File.is(fsLoc)) {
      return yield* fs.readFile(FsLoc.encodeSync(fsLoc))
    } else {
      const dirPath = FsLoc.encodeSync(fsLoc)
      const entries = yield* (options ? fs.readDirectory(dirPath, options) : fs.readDirectory(dirPath))

      // Stat each entry to determine if it's a file or directory
      const fsLocs = yield* Effect.all(
        entries.map(entry =>
          Effect.gen(function*() {
            // Create the full path for stat
            const entryPath = dirPath + entry
            const info = yield* fs.stat(entryPath)

            // Use stat info to determine type
            const isDirectory = info.type === 'Directory'

            if (isDirectory) {
              // Create directory FsLoc
              const dirEntry = entry.endsWith('/') ? entry : entry + '/'
              if (FsLoc.AbsDir.is(fsLoc)) {
                return FsLoc.AbsDir.decodeSync(entryPath + '/')
              } else {
                return FsLoc.RelDir.decodeSync('./' + dirEntry)
              }
            } else {
              // Create file FsLoc
              if (FsLoc.AbsDir.is(fsLoc)) {
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
export const readString = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.File<loc>,
  encoding: string = 'utf-8',
): Effect.Effect<string, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.readFileString(FsLoc.encodeSync(fsLoc), encoding)
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
export const readLink = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
): Effect.Effect<FsLoc.FsLocLoose.LocLoose, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    const target = yield* fs.readLink(FsLoc.encodeSync(fsLoc))
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
export const realPath = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
): Effect.Effect<FsLoc.FsLocLoose.LocLoose, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    const real = yield* fs.realPath(FsLoc.encodeSync(fsLoc))
    // We can't easily determine if it's a file or directory without stat
    // So we return FsLocLoose which can be either
    return FsLoc.FsLocLoose.decodeSync(real)
  })

/**
 * Clear all contents of a directory while keeping the directory itself.
 *
 * This function removes all files and subdirectories within the specified directory,
 * but ensures the directory itself continues to exist.
 *
 * @param loc - The directory location to clear (must be a directory type)
 * @returns An Effect that clears the directory contents
 *
 * @example
 * ```ts
 * const cache = FsLoc.AbsDir.decodeSync('/tmp/cache/')
 * yield* Fs.clear(cache)
 * // /tmp/cache/ now exists but is empty
 * ```
 */
export const clear = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Dir<loc>,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> => {
  return Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    const dirPath = FsLoc.encodeSync(fsLoc)

    // Ensure the directory exists
    yield* fs.makeDirectory(dirPath, { recursive: true })

    // Read all entries in the directory
    const entries = yield* fs.readDirectory(dirPath).pipe(
      Effect.orElseSucceed(() => []),
    )

    // Remove each entry
    for (const entry of entries) {
      const entryPath = dirPath + entry
      yield* fs.remove(entryPath, { recursive: true })
    }
  })
}

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
export const remove = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
  options: FileSystem.RemoveOptions = { recursive: false },
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.remove(FsLoc.encodeSync(fsLoc), options)
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.sink} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The file location to write to (any FsLoc type)
 * @param options - Sink options
 */
export const sink = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.File<loc>,
  options: FileSystem.SinkOptions = {},
): Sink.Sink<void, Uint8Array, never, PlatformError, FileSystem.FileSystem> => {
  return Sink.unwrapScoped(
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      const fsLoc = FsLoc.Inputs.normalize(loc)
      return fs.sink(FsLoc.encodeSync(fsLoc), options)
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
export const stat = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
): Effect.Effect<FileSystem.File.Info, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.stat(FsLoc.encodeSync(fsLoc))
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.stream} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The file location to read from (any FsLoc type)
 * @param options - Stream options
 */
export const stream = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.File<loc>,
  options: FileSystem.StreamOptions = {},
): Stream.Stream<Uint8Array, PlatformError, FileSystem.FileSystem> => {
  return Stream.unwrap(
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      const fsLoc = FsLoc.Inputs.normalize(loc)
      return fs.stream(FsLoc.encodeSync(fsLoc), options)
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
export const truncate = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.File<loc>,
  length?: FileSystem.SizeInput,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.truncate(FsLoc.encodeSync(fsLoc), length)
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
export const utimes = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
  atime: Date | number,
  mtime: Date | number,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.utimes(FsLoc.encodeSync(fsLoc), atime, mtime)
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.watch} that accepts FsLoc types.
 *
 * Takes a FsLoc location instead of a string path.
 *
 * @param loc - The location to watch (any FsLoc type)
 * @param options - Watch options
 */
export const watch = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.Any<loc>,
  options?: FileSystem.WatchOptions,
): Stream.Stream<FileSystem.WatchEvent, PlatformError, FileSystem.FileSystem> => {
  return Stream.unwrap(
    Effect.gen(function*() {
      const fs = yield* FileSystem.FileSystem
      const fsLoc = FsLoc.Inputs.normalize(loc)
      return fs.watch(FsLoc.encodeSync(fsLoc), options)
    }),
  )
}

type WriteFileParameters = [
  loc: FsLoc.Groups.File.File,
  content: string | Uint8Array | Json.Object,
  options?: FileSystem.WriteFileOptions | FileSystem.WriteFileStringOptions,
]

type WriteDirectoryParameters = [
  loc: FsLoc.Groups.Dir.Dir,
  options?: FileSystem.MakeDirectoryOptions,
]

type WriteParametersInternal = WriteFileParameters | WriteDirectoryParameters

/**
 * Wrapper for {@link FileSystem.FileSystem.writeFile} and {@link FileSystem.FileSystem.makeDirectory} that accepts FsLoc types.
 *
 * Intelligently dispatches based on location type:
 * - File locations: Writes content with type based on file extension
 *   - .json files: Accepts Json.Value and stringifies it
 *   - Text files (.md, .txt, .js, etc): Accepts strings
 *   - Binary files (.png, .pdf, etc): Accepts Uint8Array
 * - Directory locations: Creates the directory
 *
 * @param loc - The location to write to (file or directory)
 * @param content - The content to write (type inferred from file extension)
 * @param options - Write options
 *
 * @example
 * ```ts
 * // JSON file - accepts Json.Value
 * const config = FsLoc.AbsFile.decodeSync('/config.json')
 * yield* Fs.write(config, { name: 'app', version: '1.0' })
 *
 * // Text file - accepts string
 * const readme = FsLoc.AbsFile.decodeSync('/README.md')
 * yield* Fs.write(readme, '# My Project')
 *
 * // Binary file - accepts Uint8Array
 * const image = FsLoc.AbsFile.decodeSync('/logo.png')
 * yield* Fs.write(image, imageBytes)
 *
 * // Creating a directory
 * const dir = FsLoc.AbsDir.decodeSync('/data/output/')
 * yield* Fs.write(dir, { recursive: true })
 * ```
 */
export const write: {
  <loc extends FsLoc.Groups.File.File | string>(
    loc: FsLoc.Inputs.Validate.File<loc>,
    content: loc extends FsLoc.Groups.File.File ? InferFileContent<loc>
      : loc extends string ? string | Uint8Array | Json.Object // Dynamic path, allow all content types
      : never,
    options?: FileSystem.WriteFileOptions | FileSystem.WriteFileStringOptions,
  ): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
  <loc extends FsLoc.Groups.Dir.Dir | string>(
    loc: FsLoc.Inputs.Validate.Dir<loc>,
    options?: FileSystem.MakeDirectoryOptions,
  ): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
} = ((
  ...params: WriteParametersInternal
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem

    // Normalize the input to FsLoc type
    const loc = typeof params[0] === 'string' ? FsLoc.decodeSync(params[0]) : params[0]

    if (FsLoc.Groups.File.is(loc)) {
      const [, content, options] = params
      const filePath = FsLoc.encodeSync(loc)

      // Ensure parent directory exists
      // Construct the parent directory from the file's path segments
      if (loc.path.segments.length > 0) {
        const parentDir = FsLoc.Groups.Abs.is(loc)
          ? FsLoc.AbsDir.decodeSync('/' + loc.path.segments.join('/') + '/')
          : FsLoc.RelDir.decodeSync(loc.path.segments.join('/') + '/')
        const parentPath = FsLoc.encodeSync(parentDir)
        yield* fs.makeDirectory(parentPath, { recursive: true })
      }

      // Get the file extension
      const ext = 'file' in loc ? loc.file.extension : null

      // Determine how to write based on content type and extension
      if (ext === '.json' && content !== null && typeof content === 'object' && !(content instanceof Uint8Array)) {
        // JSON content
        const jsonString = JSON.stringify(content, null, 2)
        return yield* fs.writeFileString(filePath, jsonString, options as FileSystem.WriteFileStringOptions || {})
      } else if (content instanceof Uint8Array) {
        // Binary content
        return yield* fs.writeFile(filePath, content, options as FileSystem.WriteFileOptions || {})
      } else if (typeof content === 'string') {
        // String content
        return yield* fs.writeFileString(filePath, content, options as FileSystem.WriteFileStringOptions || {})
      } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(content)) {
        // Node.js Buffer
        return yield* fs.writeFile(filePath, content as any, options as FileSystem.WriteFileOptions || {})
      } else {
        // Fallback: stringify anything else
        const stringContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2)
        return yield* fs.writeFileString(filePath, stringContent, options as FileSystem.WriteFileStringOptions || {})
      }
    }

    if (FsLoc.Groups.Dir.is(loc)) {
      const [, options] = params as WriteDirectoryParameters
      return yield* fs.makeDirectory(
        FsLoc.encodeSync(loc),
        options || { recursive: false },
      )
    }

    // Exhaustive check - should never happen
    throw new Error('Invalid location type')
  })) as any

/**
 * Wrapper for {@link FileSystem.FileSystem.writeFileString} that accepts FsLoc types.
 *
 * Takes a FsLoc file location instead of a string path.
 *
 * @deprecated Use {@link write} instead - it handles all content types including strings
 * @param loc - The file location to write to (must be a file type)
 * @param data - The string to write
 * @param options - Write options
 *
 * @example
 * ```ts
 * const config = FsLoc.AbsFile.decodeSync('/etc/config.json')
 * const data = JSON.stringify({ key: 'value' }, null, 2)
 * // Old way (deprecated):
 * yield* Fs.writeString(config, data)
 * // New way:
 * yield* Fs.write(config, data)
 * ```
 */
export const writeString = <loc extends FsLoc.Inputs.Input>(
  loc: FsLoc.Inputs.Validate.File<loc>,
  data: string,
  options: FileSystem.WriteFileStringOptions = {},
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fsLoc = FsLoc.Inputs.normalize(loc)
    return yield* fs.writeFileString(FsLoc.encodeSync(fsLoc), data, options)
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
export const copy = <from extends FsLoc.Inputs.Input, to extends FsLoc.Inputs.Input>(
  from: FsLoc.Inputs.Validate.Any<from>,
  to: FsLoc.Inputs.Validate.Any<to>,
  options: FileSystem.CopyOptions = {},
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fromLoc = FsLoc.Inputs.normalize(from)
    const toLoc = FsLoc.Inputs.normalize(to)

    // If both source and destination are files, use the optimized copyFile
    if (FsLoc.Groups.File.is(fromLoc) && FsLoc.Groups.File.is(toLoc)) {
      return yield* fs.copyFile(FsLoc.encodeSync(fromLoc), FsLoc.encodeSync(toLoc))
    }

    // Otherwise use the general copy (for directories or mixed types)
    return yield* fs.copy(FsLoc.encodeSync(fromLoc), FsLoc.encodeSync(toLoc), options)
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.link} that accepts FsLoc types.
 *
 * Takes FsLoc locations instead of string paths.
 *
 * @param from - Source location (any FsLoc type)
 * @param to - Link location (any FsLoc type)
 */
export const link = <from extends FsLoc.Inputs.Input, to extends FsLoc.Inputs.Input>(
  from: FsLoc.Inputs.Validate.Any<from>,
  to: FsLoc.Inputs.Validate.Any<to>,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fromLoc = FsLoc.Inputs.normalize(from)
    const toLoc = FsLoc.Inputs.normalize(to)
    return yield* fs.link(FsLoc.encodeSync(fromLoc), FsLoc.encodeSync(toLoc))
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.rename} that accepts FsLoc types.
 *
 * Takes FsLoc locations instead of string paths. Type-safe: prevents renaming
 * files to directories and vice versa.
 *
 * @param oldPath - Current location
 * @param newPath - New location (must be same type as oldPath)
 *
 * @example
 * ```ts
 * // File to file rename
 * const old = FsLoc.AbsFile.decodeSync('/tmp/old.txt')
 * const new = FsLoc.AbsFile.decodeSync('/tmp/new.txt')
 * yield* Fs.rename(old, new)
 *
 * // Directory to directory rename
 * const oldDir = FsLoc.AbsDir.decodeSync('/tmp/old/')
 * const newDir = FsLoc.AbsDir.decodeSync('/tmp/new/')
 * yield* Fs.rename(oldDir, newDir)
 * ```
 */
export const rename: {
  <Old extends FsLoc.Groups.File.File | string, New extends FsLoc.Groups.File.File | string>(
    oldPath: FsLoc.Inputs.Validate.File<Old>,
    newPath: FsLoc.Inputs.Validate.File<New>,
  ): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
  <Old extends FsLoc.Groups.Dir.Dir | string, New extends FsLoc.Groups.Dir.Dir | string>(
    oldPath: FsLoc.Inputs.Validate.Dir<Old>,
    newPath: FsLoc.Inputs.Validate.Dir<New>,
  ): Effect.Effect<void, PlatformError, FileSystem.FileSystem>
} = (
  oldPath: any,
  newPath: any,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const oldLoc = FsLoc.Inputs.normalize(oldPath)
    const newLoc = FsLoc.Inputs.normalize(newPath)
    return yield* fs.rename(FsLoc.encodeSync(oldLoc), FsLoc.encodeSync(newLoc))
  })

/**
 * Wrapper for {@link FileSystem.FileSystem.symlink} that accepts FsLoc types.
 *
 * Takes FsLoc locations instead of string paths.
 *
 * @param from - Target location (any FsLoc type)
 * @param to - Symlink location (any FsLoc type)
 */
export const symlink = <from extends FsLoc.Inputs.Input, to extends FsLoc.Inputs.Input>(
  from: FsLoc.Inputs.Validate.Any<from>,
  to: FsLoc.Inputs.Validate.Any<to>,
): Effect.Effect<void, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const fromLoc = FsLoc.Inputs.normalize(from)
    const toLoc = FsLoc.Inputs.normalize(to)
    return yield* fs.symlink(FsLoc.encodeSync(fromLoc), FsLoc.encodeSync(toLoc))
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
