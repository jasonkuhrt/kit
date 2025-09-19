import { Match } from 'effect'
import * as FsLoc from './$$.js'
import * as Groups from './groups/$$.js'
import { Path } from './path/$.js'
import * as File from './types/file.js'

/**
 * Internal unsafe setter for FsLoc operations.
 * Updates segments and/or file properties while preserving the location's type structure.
 *
 * @internal
 */
const set = (
  loc: FsLoc.FsLoc,
  options: { segments?: readonly string[]; file?: File.File | null },
): FsLoc.FsLoc => {
  const segments = options.segments ?? loc.path.segments
  const file = options.file !== undefined ? options.file : ('file' in loc ? loc.file : undefined)

  return Match.value(loc).pipe(
    Match.tagsExhaustive({
      LocAbsFile: () =>
        FsLoc.AbsFile.make({
          path: Path.Abs.make({ segments }),
          file: file!,
        }),
      LocRelFile: () =>
        FsLoc.RelFile.make({
          path: Path.Rel.make({ segments }),
          file: file!,
        }),
      LocAbsDir: () =>
        FsLoc.AbsDir.make({
          path: Path.Abs.make({ segments }),
        }),
      LocRelDir: () =>
        FsLoc.RelDir.make({
          path: Path.Rel.make({ segments }),
        }),
    }),
  )
}

/**
 * Type-level join operation.
 * Maps base and path types to their result type.
 */
type Join<
  Base extends Groups.Dir.Dir,
  Path extends Groups.Rel.Rel,
> = Base extends FsLoc.AbsDir.AbsDir ? (
    Path extends FsLoc.RelFile.RelFile ? FsLoc.AbsFile.AbsFile
      : Path extends FsLoc.RelDir.RelDir ? FsLoc.AbsDir.AbsDir
      : never
  )
  : Base extends FsLoc.RelDir.RelDir ? (
      Path extends FsLoc.RelFile.RelFile ? FsLoc.RelFile.RelFile
        : Path extends FsLoc.RelDir.RelDir ? FsLoc.RelDir.RelDir
        : never
    )
  : never

/**
 * Join path segments into a file location.
 * Type-safe conditional return type ensures only valid combinations.
 */
export const join = <
  dir extends Groups.Dir.Dir,
  rel extends Groups.Rel.Rel,
>(dir: dir, rel: rel): Join<dir, rel> => {
  const segments = [...dir.path.segments, ...rel.path.segments]
  const file = 'file' in rel ? rel.file : null

  // The result keeps the absolute/relative nature of dir and file/dir nature of rel
  const result = set(dir as FsLoc.FsLoc, { segments, file })
  return result as Join<dir, rel>
}

export const isRoot = <loc extends FsLoc.FsLoc>(
  loc: loc,
): boolean => {
  return loc.path.segments.length === 0
}

/**
 * Move up by one segment on path.
 */
export const up = <loc extends FsLoc.FsLoc>(
  loc: loc,
): loc => {
  return set(loc, { segments: loc.path.segments.slice(0, -1) }) as loc
}

// /**
//  * Change the path segments of a location while preserving its type and file metadata.
//  * Returns AbsDir with empty segments (root) if an absolute location's path becomes empty.
//  */
// export const setPathSegments = <loc extends FsLoc.FsLoc>(
//   loc: loc,
//   segments: readonly string[],
// ): loc => {
//   return set(loc, { segments }) as loc
// }

/**
 * Type-level toDir operation.
 */
type ToDir<F extends Groups.File.File> = F extends FsLoc.AbsFile.AbsFile ? FsLoc.AbsDir.AbsDir
  : F extends FsLoc.RelFile.RelFile ? FsLoc.RelDir.RelDir
  : Groups.Dir.Dir

/**
 * Convert a file location to a directory location.
 * Useful when you know a file path actually represents a directory.
 *
 * @param loc - The file location to convert
 * @returns The directory location
 */
export const toDir = <F extends Groups.File.File>(loc: F): ToDir<F> => {
  const fileName = loc.file.extension ? loc.file.name + loc.file.extension : loc.file.name
  const segments = [...loc.path.segments, fileName]

  // Create the appropriate directory type based on whether loc is absolute or relative
  const dirLoc = Groups.Abs.is(loc)
    ? FsLoc.AbsDir.make({ path: Path.Abs.make({ segments }) })
    : FsLoc.RelDir.make({ path: Path.Rel.make({ segments }) })

  return dirLoc as ToDir<F>
}

/**
 * Type-level ensureAbsolute operation.
 */
type EnsureAbsolute<
  L extends FsLoc.FsLoc,
  B extends FsLoc.AbsDir.AbsDir | undefined = undefined,
> = L extends FsLoc.AbsFile.AbsFile ? FsLoc.AbsFile.AbsFile
  : L extends FsLoc.AbsDir.AbsDir ? FsLoc.AbsDir.AbsDir
  : L extends FsLoc.RelFile.RelFile ? (B extends undefined ? Groups.Abs.Abs : FsLoc.AbsFile.AbsFile)
  : L extends FsLoc.RelDir.RelDir ? (B extends undefined ? Groups.Abs.Abs : FsLoc.AbsDir.AbsDir)
  : L extends Groups.Abs.Abs ? Groups.Abs.Abs
  : L extends Groups.Rel.Rel ? Groups.Abs.Abs
  : Groups.Abs.Abs

/**
 * Ensure a location is absolute, converting relative locations to absolute.
 *
 * @param loc - The location to ensure is absolute
 * @param base - The base directory to resolve relative locations against (defaults to current working directory)
 * @returns An absolute location
 *
 * @example
 * ```ts
 * const relPath = FsLoc.RelFile.decodeSync('./foo/bar.ts')
 * const cwd = FsLoc.AbsDir.decodeSync(process.cwd() + '/')
 * const absPath = ensureAbsolute(relPath, cwd) // AbsFile
 * ```
 */
export const ensureAbsolute = <
  loc extends FsLoc.FsLoc,
  base extends FsLoc.AbsDir.AbsDir | undefined = undefined,
>(
  loc: loc,
  base?: base,
): EnsureAbsolute<loc, base> => {
  // If already absolute, return as-is
  if (Groups.Abs.is(loc)) {
    return loc as EnsureAbsolute<loc, base>
  }

  // Relative location needs a base
  let resolvedBase = base
  if (!resolvedBase) {
    // Get current working directory as base
    const cwd = process.cwd()
    const cwdWithSlash = cwd.endsWith('/') ? cwd : `${cwd}/`
    resolvedBase = FsLoc.AbsDir.decodeSync(cwdWithSlash) as base
  }

  // Join base with relative location
  if (FsLoc.RelFile.is(loc)) {
    return join(resolvedBase as FsLoc.AbsDir.AbsDir, loc as FsLoc.RelFile.RelFile) as EnsureAbsolute<
      loc,
      base
    >
  } else {
    return join(resolvedBase as FsLoc.AbsDir.AbsDir, loc as FsLoc.RelDir.RelDir) as EnsureAbsolute<
      loc,
      base
    >
  }
}

/**
 * Type-level ensureOptionalAbsolute operation.
 */
type EnsureOptionalAbsolute<
  L extends FsLoc.FsLoc | undefined,
  B extends FsLoc.AbsDir.AbsDir,
> = L extends undefined ? B
  : L extends FsLoc.AbsFile.AbsFile ? FsLoc.AbsFile.AbsFile
  : L extends FsLoc.AbsDir.AbsDir ? FsLoc.AbsDir.AbsDir
  : L extends FsLoc.RelFile.RelFile ? FsLoc.AbsFile.AbsFile
  : L extends FsLoc.RelDir.RelDir ? FsLoc.AbsDir.AbsDir
  : Groups.Abs.Abs

/**
 * Ensure an optional location is absolute.
 *
 * @param loc - The optional location to ensure is absolute
 * @param base - The base directory to resolve relative locations against or use as default
 * @returns An absolute location or the base if loc is undefined
 *
 * @example
 * ```ts
 * const base = FsLoc.AbsDir.decodeSync('/home/user/')
 * const loc = undefined
 * const result = ensureOptionalAbsolute(loc, base) // returns base
 * ```
 */
export const ensureOptionalAbsolute = <
  loc extends FsLoc.FsLoc | undefined,
  base extends FsLoc.AbsDir.AbsDir,
>(
  loc: loc,
  base: base,
): EnsureOptionalAbsolute<loc, base> => {
  if (loc === undefined) {
    return base as any
  }
  return ensureAbsolute(loc, base) as any
}

/**
 * Ensure an optional location is absolute, using current working directory as default.
 *
 * @param loc - The optional location to ensure is absolute
 * @returns An absolute location or current working directory if loc is undefined
 *
 * @example
 * ```ts
 * const loc = undefined
 * const result = ensureOptionalAbsoluteWithCwd(loc) // returns cwd as AbsDir
 * ```
 */
export const ensureOptionalAbsoluteWithCwd = (
  loc: FsLoc.FsLoc | undefined,
): Groups.Abs.Abs => {
  const cwd = process.cwd()
  const cwdWithSlash = cwd.endsWith('/') ? cwd : `${cwd}/`
  const base = FsLoc.AbsDir.decodeSync(cwdWithSlash)

  if (loc === undefined) {
    return base
  }

  return ensureAbsolute(loc, base)
}
