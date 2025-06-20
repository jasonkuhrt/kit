import { Fn } from '#fn'
import { Language } from '#language'
import * as PlatformPath from '#platform:path/path'

export * from '#platform:path/path'

/**
 * Make a path absolute if it isn't already.
 *
 * @param filePath - The path to ensure is absolute.
 * @param basePath - The base path to resolve against (defaults to process current working directory).
 * @returns An absolute path.
 *
 * @example
 * ```ts
 * // with relative path
 * ensureAbsolute('foo/bar.ts', '/home/user') // '/home/user/foo/bar.ts'
 *
 * // with absolute path (returns as-is)
 * ensureAbsolute('/foo/bar.ts', '/home/user') // '/foo/bar.ts'
 * ```
 */
export const ensureAbsolute = (filePath: string, basePath: string = Language.process.cwd()): string => {
  return PlatformPath.isAbsolute(filePath)
    ? filePath
    : PlatformPath.resolve(basePath, filePath)
}

/**
 * Curried version of {@link ensureAbsolute} with filePath first.
 *
 * @param filePath - The path to ensure is absolute.
 * @returns A function that takes basePath and returns an absolute path.
 *
 * @example
 * ```ts
 * const ensureAbsoluteForFile = ensureAbsoluteOn('foo/bar.ts')
 * ensureAbsoluteForFile('/home/user') // '/home/user/foo/bar.ts'
 * ```
 */
export const ensureAbsoluteOn = Fn.curry(ensureAbsolute)

/**
 * Curried version of {@link ensureAbsolute} with basePath first.
 *
 * @param basePath - The base path to resolve against.
 * @returns A function that takes filePath and returns an absolute path.
 *
 * @example
 * ```ts
 * const ensureAbsoluteInHome = ensureAbsoluteWith('/home/user')
 * ensureAbsoluteInHome('foo/bar.ts') // '/home/user/foo/bar.ts'
 * ```
 */
export const ensureAbsoluteWith = Fn.flipCurried(ensureAbsoluteOn)

/**
 * Pre-configured version of {@link ensureAbsoluteWith} using the current working directory.
 *
 * @param filePath - The path to ensure is absolute.
 * @returns An absolute path resolved against the current working directory.
 *
 * @example
 * ```ts
 * // resolve relative to cwd
 * ensureAbsoluteWithCWD('foo/bar.ts') // '/current/working/dir/foo/bar.ts'
 * ```
 */
export const ensureAbsoluteWithCWD = ensureAbsoluteWith(Language.process.cwd())

/**
 * Format a path to have an explicit relative prefix (./) if it's relative.
 * Absolute paths are returned unchanged.
 *
 * @param path - The path to format.
 * @returns The path with explicit relative prefix if relative.
 *
 * @example
 * ```ts
 * // adds prefix to implicit relative paths
 * formatExplicitRelative('foo/bar.ts') // './foo/bar.ts'
 *
 * // leaves explicit relative paths unchanged
 * formatExplicitRelative('./foo/bar.ts') // './foo/bar.ts'
 *
 * // leaves absolute paths unchanged
 * formatExplicitRelative('/foo/bar.ts') // '/foo/bar.ts'
 * ```
 */
export const formatExplicitRelative = (path: string) => {
  if (PlatformPath.isAbsolute(path)) {
    return path
  }

  if (path.startsWith(explicitRelativePrefix)) {
    return path
  }

  return `${explicitRelativePrefix}${path}`
}

/**
 * Format a path to remove the explicit relative prefix (./) if present.
 * Absolute paths are returned unchanged.
 *
 * @param path - The path to format.
 * @returns The path without explicit relative prefix.
 *
 * @example
 * ```ts
 * // removes prefix from explicit relative paths
 * formatImplicitRelative('./foo/bar.ts') // 'foo/bar.ts'
 *
 * // leaves implicit relative paths unchanged
 * formatImplicitRelative('foo/bar.ts') // 'foo/bar.ts'
 *
 * // leaves absolute paths unchanged
 * formatImplicitRelative('/foo/bar.ts') // '/foo/bar.ts'
 * ```
 */
export const formatImplicitRelative = (path: string) => {
  if (PlatformPath.isAbsolute(path)) {
    return path
  }

  if (!path.startsWith(explicitRelativePrefix)) {
    return path
  }

  return path.slice(explicitRelativePrefix.length)
}

/**
 * The explicit relative path prefix.
 */
export const explicitRelativePrefix = `./`

// export const tmpDirectory = tmpdir()

// Protocol

// export const protocolPattern = /^([a-zA-z]+):\/\//i

// export const stripProtocol = Str.strip(protocolPattern)

// export const fileProtocol = `file://`

// export const stripFileProtocol = Str.stripLeading(fileProtocol)

/**
 * List of file extensions for executable JavaScript and TypeScript files.
 * Includes both JavaScript (.js, .mjs, .cjs, .jsx) and TypeScript (.ts, .mts, .cts, .tsx) extensions.
 */
export const executableJavaScriptExtensions = [
  // JavaScript
  '.ts',
  '.mjs',
  '.cjs',
  '.jsx',
  // TypeScript
  '.ts',
  '.mts',
  '.cts',
  '.tsx',
]

/**
 * List of file extensions for build artifacts.
 * Includes source maps (.map) and TypeScript declaration files (.d.ts).
 */
export const buildArtifactExtensions = [
  '.map',
  '.d.ts',
]

// merge

/**
 * Join two paths together.
 *
 * @param path1 - The first path segment.
 * @param path2 - The second path segment.
 * @returns The joined path.
 *
 * @example
 * ```ts
 * // join path segments
 * merge('/home/user', 'foo/bar.ts') // '/home/user/foo/bar.ts'
 *
 * // handles trailing slashes
 * merge('/home/user/', 'foo/bar.ts') // '/home/user/foo/bar.ts'
 * ```
 */
export const merge = (path1: string, path2: string): string => {
  return PlatformPath.join(path1, path2)
}

/**
 * Curried version of {@link merge} with path1 first.
 *
 * @param path1 - The first path segment.
 * @returns A function that takes path2 and returns the joined path.
 *
 * @example
 * ```ts
 * const mergeWithHome = mergeOn('/home/user')
 * mergeWithHome('foo/bar.ts') // '/home/user/foo/bar.ts'
 * ```
 */
export const mergeOn = Fn.curry(merge)
