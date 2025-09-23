import { Pro } from '#pro'
import { Match } from 'effect'
import * as NodePath from 'node:path'
import * as FsLoc from './$$.js'
import { Analyzer } from './analyzer/$.js'
import * as Groups from './groups/$$.js'
import * as Inputs from './inputs.js'
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
 * Infer the FsLoc type from a string literal or FsLoc type.
 * Used to preserve specific type information when strings are passed.
 */
type InferFsLocType<T> = T extends FsLoc.FsLoc ? T
  : T extends string ? (
      Analyzer.Analyze<T> extends { _tag: 'file'; isPathRelative: true } ? FsLoc.RelFile.RelFile
        : Analyzer.Analyze<T> extends { _tag: 'dir'; isPathRelative: true } ? FsLoc.RelDir.RelDir
        : Analyzer.Analyze<T> extends { _tag: 'file'; isPathAbsolute: true } ? FsLoc.AbsFile.AbsFile
        : Analyzer.Analyze<T> extends { _tag: 'dir'; isPathAbsolute: true } ? FsLoc.AbsDir.AbsDir
        : FsLoc.FsLoc
    )
  : never

/**
 * Resolve path segments by collapsing parent references (..)
 * @internal
 */
const resolveSegments = (segments: readonly string[]): string[] => {
  const resolved: string[] = []

  for (const segment of segments) {
    if (segment === '..') {
      // Remove the last segment if it exists and we're not at root
      if (resolved.length > 0) {
        resolved.pop()
      }
    } else if (segment !== '.' && segment !== '') {
      // Skip current directory references and empty segments
      resolved.push(segment)
    }
  }

  return resolved
}

/**
 * Join path segments into a file location.
 * Type-safe conditional return type ensures only valid combinations.
 */
export const join = <
  dir extends Groups.Dir.Dir | string,
  rel extends Groups.Rel.Rel | string,
>(
  dir: Inputs.Dir<dir>,
  rel: Inputs.Rel<rel>,
): Join<
  InferFsLocType<dir> extends Groups.Dir.Dir ? InferFsLocType<dir> : never,
  InferFsLocType<rel> extends Groups.Rel.Rel ? InferFsLocType<rel> : never
> => {
  const normalizedDir = Inputs.normalize.dir(dir)
  const normalizedRel = Inputs.normalize.rel(rel)
  const rawSegments = [...normalizedDir.path.segments, ...normalizedRel.path.segments]
  const segments = resolveSegments(rawSegments)
  const file = 'file' in normalizedRel ? normalizedRel.file : null

  // The result keeps the absolute/relative nature of dir and file/dir nature of rel
  // If rel is a file, we need to create a file location, not a directory
  const isAbsolute = Path.Abs.is(normalizedDir.path)

  if (file !== null) {
    // Joining with a file - create a file location
    const result = isAbsolute
      ? FsLoc.AbsFile.make({
        path: Path.Abs.make({ segments }),
        file,
      })
      : FsLoc.RelFile.make({
        path: Path.Rel.make({ segments }),
        file,
      })
    return result as Join<
      InferFsLocType<dir> extends Groups.Dir.Dir ? InferFsLocType<dir> : never,
      InferFsLocType<rel> extends Groups.Rel.Rel ? InferFsLocType<rel> : never
    >
  } else {
    // Joining with a directory - create a directory location
    const result = isAbsolute
      ? FsLoc.AbsDir.make({
        path: Path.Abs.make({ segments }),
      })
      : FsLoc.RelDir.make({
        path: Path.Rel.make({ segments }),
      })
    return result as Join<
      InferFsLocType<dir> extends Groups.Dir.Dir ? InferFsLocType<dir> : never,
      InferFsLocType<rel> extends Groups.Rel.Rel ? InferFsLocType<rel> : never
    >
  }
}

export const isRoot = <loc extends FsLoc.FsLoc | string>(
  loc: Inputs.Any<loc>,
): boolean => {
  const normalized = Inputs.normalize.any(loc)
  return normalized.path.segments.length === 0
}

/**
 * Move up by one segment on path.
 */
export const up = <loc extends FsLoc.FsLoc | string>(
  loc: Inputs.Any<loc>,
): loc extends string ? FsLoc.FsLoc : loc => {
  const normalized = Inputs.normalize.any(loc)
  return set(normalized, { segments: normalized.path.segments.slice(0, -1) }) as any
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
export const toDir = <F extends Groups.File.File | string>(
  loc: Inputs.File<F>,
): ToDir<F extends string ? Groups.File.File : F> => {
  const normalized = Inputs.normalize.file(loc)
  const fileName = normalized.file.extension ? normalized.file.name + normalized.file.extension : normalized.file.name
  const segments = [...normalized.path.segments, fileName]

  // Create the appropriate directory type based on whether loc is absolute or relative
  const dirLoc = Groups.Abs.is(normalized)
    ? FsLoc.AbsDir.make({ path: Path.Abs.make({ segments }) })
    : FsLoc.RelDir.make({ path: Path.Rel.make({ segments }) })

  return dirLoc as ToDir<F extends string ? Groups.File.File : F>
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
 * const cwd = FsLoc.AbsDir.decodeSync(process.cwd())
 * const absPath = ensureAbsolute(relPath, cwd) // AbsFile
 * ```
 */
export const ensureAbsolute = <
  loc extends FsLoc.FsLoc | string,
  base extends FsLoc.AbsDir.AbsDir | string | undefined = undefined,
>(
  loc: Inputs.Any<loc>,
  base?: base extends string ? Inputs.AbsDir<base> : base,
): EnsureAbsolute<
  loc extends string ? FsLoc.FsLoc : loc,
  base extends string ? FsLoc.AbsDir.AbsDir : base
> => {
  const normalizedLoc = Inputs.normalize.any(loc)
  // If already absolute, return as-is
  if (Groups.Abs.is(normalizedLoc)) {
    return normalizedLoc as any
  }

  // Relative location needs a base
  let resolvedBase: FsLoc.AbsDir.AbsDir
  if (!base) {
    // Get current working directory as base
    resolvedBase = Pro.cwd()
  } else {
    resolvedBase = Inputs.normalize.absDir(base as any)
  }

  // Join base with relative location
  if (FsLoc.RelFile.is(normalizedLoc)) {
    return join(resolvedBase, normalizedLoc) as any
  } else {
    return join(resolvedBase, normalizedLoc as FsLoc.RelDir.RelDir) as any
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
  loc extends FsLoc.FsLoc | string | undefined,
  base extends FsLoc.AbsDir.AbsDir | string,
>(
  loc: loc extends string ? Inputs.Any<loc> : loc,
  base: Inputs.AbsDir<base>,
): EnsureOptionalAbsolute<
  loc extends string ? FsLoc.FsLoc : loc,
  base extends string ? FsLoc.AbsDir.AbsDir : base
> => {
  const normalizedBase = Inputs.normalize.absDir(base)
  if (loc === undefined) {
    return normalizedBase as any
  }
  return ensureAbsolute(loc as any, normalizedBase) as any
}

/**
 * Type-level ensureOptionalAbsoluteWithCwd operation.
 * Returns AbsDir when undefined, preserves file/dir distinction for other inputs.
 */
type EnsureOptionalAbsoluteWithCwd<L extends FsLoc.FsLoc | undefined> = L extends undefined ? FsLoc.AbsDir.AbsDir
  : L extends FsLoc.AbsFile.AbsFile ? FsLoc.AbsFile.AbsFile
  : L extends FsLoc.AbsDir.AbsDir ? FsLoc.AbsDir.AbsDir
  : L extends FsLoc.RelFile.RelFile ? FsLoc.AbsFile.AbsFile
  : L extends FsLoc.RelDir.RelDir ? FsLoc.AbsDir.AbsDir
  : Groups.Abs.Abs

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
export const ensureOptionalAbsoluteWithCwd = <L extends FsLoc.FsLoc | string | undefined>(
  loc: L extends string ? Inputs.Any<L> : L,
): EnsureOptionalAbsoluteWithCwd<L extends string ? FsLoc.FsLoc : L> => {
  const base = Pro.cwd()

  if (loc === undefined) {
    return base as any
  }

  return ensureAbsolute(loc as any, base) as any
}

/**
 * Type-level toAbs operation.
 * Maps relative location types to their absolute counterparts.
 */
type ToAbs<R extends Groups.Rel.Rel> = R extends FsLoc.RelFile.RelFile ? FsLoc.AbsFile.AbsFile
  : R extends FsLoc.RelDir.RelDir ? FsLoc.AbsDir.AbsDir
  : Groups.Abs.Abs

/**
 * Convert a relative location to an absolute location.
 *
 * @param loc - The relative location to convert
 * @param base - Optional base directory to resolve against. If not provided, simply converts ./path to /path
 * @returns An absolute location
 *
 * @example
 * ```ts
 * const relFile = FsLoc.RelFile.decodeSync('./src/index.ts')
 * const absFile = toAbs(relFile) // /src/index.ts (just re-tags)
 *
 * const base = FsLoc.AbsDir.decodeSync('/home/user/')
 * const absFile2 = toAbs(relFile, base) // /home/user/src/index.ts (resolves against base)
 * ```
 */
export const toAbs = <R extends Groups.Rel.Rel | string>(
  loc: Inputs.Rel<R>,
  base?: FsLoc.AbsDir.AbsDir | string,
): ToAbs<R extends string ? Groups.Rel.Rel : R> => {
  const normalized = Inputs.normalize.rel(loc)
  if (base) {
    const normalizedBase = typeof base === 'string' ? Inputs.normalize.absDir(base as any) : base
    // Use join to combine base with relative location
    return join(normalizedBase, normalized) as any
  }

  // No base: just convert relative to absolute by re-tagging
  // This essentially changes ./path to /path
  if (Groups.File.is(normalized)) {
    const file = (normalized as any).file
    return FsLoc.AbsFile.make({
      path: Path.Abs.make({ segments: normalized.path.segments }),
      file,
    }) as any
  } else {
    return FsLoc.AbsDir.make({
      path: Path.Abs.make({ segments: normalized.path.segments }),
    }) as any
  }
}

/**
 * Type-level toRel operation.
 * Maps absolute location types to their relative counterparts.
 */
type ToRel<A extends Groups.Abs.Abs> = A extends FsLoc.AbsFile.AbsFile ? FsLoc.RelFile.RelFile
  : A extends FsLoc.AbsDir.AbsDir ? FsLoc.RelDir.RelDir
  : Groups.Rel.Rel
/**
 * Convert an absolute location to a relative location.
 *
 * @param loc - The absolute location to convert
 * @param base - The base directory to make the path relative to
 * @returns A relative location
 *
 * @example
 * ```ts
 * const absFile = FsLoc.AbsFile.decodeSync('/home/user/src/index.ts')
 * const base = FsLoc.AbsDir.decodeSync('/home/user/')
 * const relFile = toRel(absFile, base) // ./src/index.ts
 * ```
 */
export const toRel = <A extends Groups.Abs.Abs | string>(
  loc: Inputs.Abs<A>,
  base: FsLoc.AbsDir.AbsDir | string,
): ToRel<A extends string ? Groups.Abs.Abs : A> => {
  const normalizedLoc = Inputs.normalize.abs(loc)
  const normalizedBase = typeof base === 'string' ? Inputs.normalize.absDir(base as any) : base
  // Encode the locations to get their string representations
  const locPath = FsLoc.encodeSync(normalizedLoc)
  const basePath = FsLoc.encodeSync(normalizedBase)

  // Calculate relative path using Node.js built-in
  const relativePath = NodePath.relative(basePath, locPath)

  // If empty, it means we're at the same location
  const finalPath = relativePath === '' ? '.' : relativePath
  return FsLoc.decodeSync(finalPath) as any
}

/**
 * Get the name (last segment) of a location.
 *
 * For files: returns the filename including extension.
 * For directories: returns the directory name.
 * For root directories: returns an empty string.
 *
 * @param loc - The location to get the name from
 * @returns The name of the file or directory
 *
 * @example
 * ```ts
 * name('/path/to/file.txt') // 'file.txt'
 * name('/path/to/src/') // 'src'
 * name('./docs/README.md') // 'README.md'
 * name('/') // ''
 * ```
 */
export const name = <loc extends FsLoc.FsLoc | string>(
  loc: Inputs.Any<loc>,
): string => {
  const normalized = Inputs.normalize.any(loc)
  if ('file' in normalized) {
    // For files, combine name and extension
    return normalized.file.extension
      ? normalized.file.name + normalized.file.extension
      : normalized.file.name
  } else {
    // For directories, return the last segment
    const segments = normalized.path.segments
    return segments.length > 0
      ? segments[segments.length - 1]!
      : '' // Root directory case
  }
}

/**
 * Check if a location is under (descendant of) a directory.
 * Returns false if paths are of different types (absolute vs relative).
 *
 * @param child - The location to check
 * @param parent - The directory that might contain the child
 * @returns True if child is under parent, false otherwise
 *
 * @example
 * ```ts
 * const projectDir = FsLoc.fromString('/home/user/project/')
 * const sourceFile = FsLoc.fromString('/home/user/project/src/index.ts')
 * FsLoc.isUnder(sourceFile, projectDir) // true
 *
 * const relDir = FsLoc.fromString('./src/')
 * const absFile = FsLoc.fromString('/home/file.txt')
 * FsLoc.isUnder(absFile, relDir) // false - different path types
 * ```
 */
export const isUnder = <
  child extends FsLoc.FsLoc | string,
  parent extends Groups.Dir.Dir | string,
>(
  child: Inputs.Any<child>,
  parent: Inputs.Dir<parent>,
): boolean => {
  const normalizedChild = Inputs.normalize.any(child)
  const normalizedParent = Inputs.normalize.dir(parent)
  // Check if both are absolute or both are relative
  const childIsAbs = normalizedChild._tag === 'LocAbsFile' || normalizedChild._tag === 'LocAbsDir'
  const parentIsAbs = normalizedParent._tag === 'LocAbsDir'

  if (childIsAbs !== parentIsAbs) {
    return false // Can't compare absolute with relative
  }

  // Compare path segments
  const parentSegments = normalizedParent.path.segments
  const childSegments = normalizedChild.path.segments

  // Special case: root directory (0 segments) contains everything except itself
  if (parentSegments.length === 0) {
    // For absolute paths, root contains everything that has segments OR has a file
    // (files at root like /file.txt have 0 segments but have a file property)
    return childSegments.length > 0 || 'file' in normalizedChild
  }

  // Child must have at least as many segments as parent
  if (childSegments.length < parentSegments.length) {
    return false
  }

  // Check if parent segments match the beginning of child segments
  for (let i = 0; i < parentSegments.length; i++) {
    if (parentSegments[i] !== childSegments[i]) {
      return false
    }
  }

  // If all parent segments match and child has more segments, it's under
  // If they have the same segments but child is a file, it's under
  // (files in a directory have same segments as the directory)
  // If both are directories with same segments, they're the same path (not under)
  return childSegments.length > parentSegments.length
    || (childSegments.length === parentSegments.length && 'file' in normalizedChild)
}

/**
 * Check if a directory is above (ancestor of) a location.
 * Symmetrical to isUnder with swapped arguments.
 *
 * @param parent - The directory that might contain the child
 * @param child - The location to check
 * @returns True if parent is above child, false otherwise
 *
 * @example
 * ```ts
 * const projectDir = FsLoc.fromString('/home/user/project/')
 * const sourceFile = FsLoc.fromString('/home/user/project/src/index.ts')
 * FsLoc.isAbove(projectDir, sourceFile) // true
 * ```
 */
export const isAbove = <
  parent extends Groups.Dir.Dir | string,
  child extends FsLoc.FsLoc | string,
>(
  parent: Inputs.Dir<parent>,
  child: Inputs.Any<child>,
): boolean => {
  return isUnder(child, parent)
}

/**
 * Create a curried version of isUnder with the parent directory fixed.
 *
 * @param parent - The directory to check against
 * @returns A function that checks if a location is under the parent
 *
 * @example
 * ```ts
 * const projectDir = FsLoc.fromString('/home/user/project/')
 * const isInProject = FsLoc.isUnderOf(projectDir)
 *
 * isInProject(FsLoc.fromString('/home/user/project/src/index.ts')) // true
 * isInProject(FsLoc.fromString('/home/other/file.txt')) // false
 * ```
 */
export const isUnderOf = <parent extends Groups.Dir.Dir | string>(
  parent: Inputs.Dir<parent>,
) =>
<child extends FsLoc.FsLoc | string>(
  child: Inputs.Any<child>,
): boolean => isUnder(child, parent)

/**
 * Create a curried version of isAbove with the child location fixed.
 *
 * @param child - The location to check against
 * @returns A function that checks if a directory is above the child
 *
 * @example
 * ```ts
 * const sourceFile = FsLoc.fromString('/home/user/project/src/index.ts')
 * const hasAsParent = FsLoc.isAboveOf(sourceFile)
 *
 * hasAsParent(FsLoc.fromString('/home/user/project/')) // true
 * hasAsParent(FsLoc.fromString('/home/other/')) // false
 * ```
 */
export const isAboveOf = <child extends FsLoc.FsLoc | string>(
  child: Inputs.Any<child>,
) =>
<parent extends Groups.Dir.Dir | string>(
  parent: Inputs.Dir<parent>,
): boolean => isAbove(parent, child)
