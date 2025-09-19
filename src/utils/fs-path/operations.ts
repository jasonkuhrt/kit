import * as FsPath from './fs-path.js'
import * as Groups from './groups/$$.js'
import * as AbsoluteDirMod from './members/absolute-dir.ts'
import * as AbsoluteFileMod from './members/absolute-file.ts'
import * as RelativeDirMod from './members/relative-dir.ts'
import * as RelativeFileMod from './members/relative-file.ts'
import * as Segment from './types/segment.js'
import * as Target from './types/target.js'

// Type aliases from modules
type AbsoluteDir = AbsoluteDirMod.AbsoluteDir
type AbsoluteFile = AbsoluteFileMod.AbsoluteFile
type RelativeDir = RelativeDirMod.RelativeDir
type RelativeFile = RelativeFileMod.RelativeFile

// Group types
type Dir = Groups.Dir.Dir
type File = Groups.File.File
type Relative = Groups.Relative.Relative
type Absolute = Groups.Absolute.Absolute
type Path = FsPath.FsPath

/**
 * Join path segments into a file path.
 * Type-safe overloads ensure only valid combinations.
 */
export function join(base: AbsoluteDir, path: RelativeFile): AbsoluteFile
export function join(base: AbsoluteDir, path: RelativeDir): AbsoluteDir
export function join(base: RelativeDir, path: RelativeFile): RelativeFile
export function join(base: RelativeDir, path: RelativeDir): RelativeDir
export function join(base: Dir, ...paths: Relative[]): Path
export function join(base: Dir, ...paths: Relative[]): Path {
  // Start with base segments
  let segments = [...base.segments]
  let lastIsDir = true // base is always a directory

  for (const path of paths) {
    segments = [...segments, ...path.segments]
    lastIsDir = path.target === 'dir'
  }

  // Determine the result type based on base and final target
  const isAbsolute = base._tag === 'PathAbsoluteDir'

  if (isAbsolute && lastIsDir) {
    return AbsoluteDirMod.make({
      segments: segments as Segment.Segment[],
      target: 'dir' as Target.TargetDir,
    })
  } else if (isAbsolute && !lastIsDir) {
    return AbsoluteFileMod.make({
      segments: segments as Segment.Segment[],
      target: 'file' as Target.TargetFile,
    })
  } else if (!isAbsolute && lastIsDir) {
    return RelativeDirMod.make({
      segments: segments as Segment.Segment[],
      target: 'dir' as Target.TargetDir,
    })
  } else {
    return RelativeFileMod.make({
      segments: segments as Segment.Segment[],
      target: 'file' as Target.TargetFile,
    })
  }
}

/**
 * Get the parent directory of a path.
 * Returns a directory path.
 *
 * @param path - The path to get parent from
 * @returns The parent directory path
 */
export function getParentDir(path: Absolute): AbsoluteDir
export function getParentDir(path: Relative): RelativeDir
export function getParentDir(path: Path): Dir
export function getParentDir(path: Path): Dir {
  const segments = path.segments.slice(0, -1)

  if (path._tag === 'PathAbsoluteFile' || path._tag === 'PathAbsoluteDir') {
    return AbsoluteDirMod.make({
      segments: segments as Segment.Segment[],
      target: 'dir' as Target.TargetDir,
    })
  } else {
    return RelativeDirMod.make({
      segments: segments as Segment.Segment[],
      target: 'dir' as Target.TargetDir,
    })
  }
}

/**
 * Convert a file path to a directory path.
 * Useful when you know a file path actually represents a directory.
 *
 * @param path - The file path to convert
 * @returns The directory path
 */
export function toDir(path: AbsoluteFile): AbsoluteDir
export function toDir(path: RelativeFile): RelativeDir
export function toDir(path: File): Dir
export function toDir(path: File): Dir {
  if (path._tag === 'PathAbsoluteFile') {
    return AbsoluteDirMod.make({
      segments: path.segments,
      target: 'dir' as Target.TargetDir,
    })
  } else {
    return RelativeDirMod.make({
      segments: path.segments,
      target: 'dir' as Target.TargetDir,
    })
  }
}

/**
 * Convert a directory path to a file path.
 * Useful when you know a directory path actually represents a file.
 *
 * @param path - The directory path to convert
 * @returns The file path
 */
export function toFile(path: AbsoluteDir): AbsoluteFile
export function toFile(path: RelativeDir): RelativeFile
export function toFile(path: Dir): File
export function toFile(path: Dir): File {
  if (path._tag === 'PathAbsoluteDir') {
    return AbsoluteFileMod.make({
      segments: path.segments,
      target: 'file' as Target.TargetFile,
    })
  } else {
    return RelativeFileMod.make({
      segments: path.segments,
      target: 'file' as Target.TargetFile,
    })
  }
}

/**
 * Ensure a path is absolute, converting relative paths to absolute.
 *
 * @param path - The path to ensure is absolute
 * @param base - The base directory to resolve relative paths against (defaults to current working directory)
 * @returns An absolute path
 *
 * @example
 * ```ts
 * const relPath = FsPath.RelativeFile.decodeSync('./foo/bar.ts')
 * const cwd = FsPath.AbsoluteDir.decodeSync(process.cwd() + '/')
 * const absPath = ensureAbsolute(relPath, cwd) // AbsoluteFile
 * ```
 */
export function ensureAbsolute(path: AbsoluteFile, base?: AbsoluteDir): AbsoluteFile
export function ensureAbsolute(path: AbsoluteDir, base?: AbsoluteDir): AbsoluteDir
export function ensureAbsolute(path: RelativeFile, base: AbsoluteDir): AbsoluteFile
export function ensureAbsolute(path: RelativeDir, base: AbsoluteDir): AbsoluteDir
export function ensureAbsolute(path: Absolute, base?: AbsoluteDir): Absolute
export function ensureAbsolute(path: Relative, base: AbsoluteDir): Absolute
export function ensureAbsolute(path: Path, base?: AbsoluteDir): Absolute
export function ensureAbsolute(path: Path, base?: AbsoluteDir): Absolute {
  // If already absolute, return as-is
  if (path._tag === 'PathAbsoluteFile' || path._tag === 'PathAbsoluteDir') {
    return path as Absolute
  }

  // Relative path needs a base
  if (!base) {
    // Get current working directory as base
    const cwd = process.cwd()
    const cwdWithSlash = cwd.endsWith('/') ? cwd : `${cwd}/`
    base = AbsoluteDirMod.decodeSync(cwdWithSlash)
  }

  // Join base with relative path
  if (path._tag === 'PathRelativeFile') {
    return join(base, path as RelativeFile)
  } else {
    return join(base, path as RelativeDir)
  }
}

/**
 * Ensure an optional path is absolute.
 *
 * @param path - The optional path to ensure is absolute
 * @param base - The base directory to resolve relative paths against or use as default
 * @returns An absolute path or the base if path is undefined
 *
 * @example
 * ```ts
 * const base = FsPath.AbsoluteDir.decodeSync('/home/user/')
 * const path = undefined
 * const result = ensureOptionalAbsolute(path, base) // returns base
 * ```
 */
export function ensureOptionalAbsolute(
  path: AbsoluteFile | undefined,
  base: AbsoluteDir,
): AbsoluteFile | AbsoluteDir
export function ensureOptionalAbsolute(
  path: AbsoluteDir | undefined,
  base: AbsoluteDir,
): AbsoluteDir
export function ensureOptionalAbsolute(
  path: RelativeFile | undefined,
  base: AbsoluteDir,
): AbsoluteFile | AbsoluteDir
export function ensureOptionalAbsolute(
  path: RelativeDir | undefined,
  base: AbsoluteDir,
): AbsoluteDir
export function ensureOptionalAbsolute(
  path: Path | undefined,
  base: AbsoluteDir,
): Absolute
export function ensureOptionalAbsolute(
  path: Path | undefined,
  base: AbsoluteDir,
): Absolute {
  if (path === undefined) {
    return base
  }
  return ensureAbsolute(path, base)
}

/**
 * Ensure an optional path is absolute, using current working directory as default.
 *
 * @param path - The optional path to ensure is absolute
 * @returns An absolute path or current working directory if path is undefined
 *
 * @example
 * ```ts
 * const path = undefined
 * const result = ensureOptionalAbsoluteWithCwd(path) // returns cwd as AbsoluteDir
 * ```
 */
export function ensureOptionalAbsoluteWithCwd(
  path: Path | undefined,
): Absolute {
  const cwd = process.cwd()
  const cwdWithSlash = cwd.endsWith('/') ? cwd : `${cwd}/`
  const base = AbsoluteDirMod.decodeSync(cwdWithSlash)

  if (path === undefined) {
    return base
  }

  return ensureAbsolute(path, base)
}
