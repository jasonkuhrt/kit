import { Fn } from '#fn'
import { Lang } from '#lang'
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
export const ensureAbsolute = (filePath: string, basePath: string = Lang.process.cwd()): string => {
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
export const ensureAbsoluteWithCWD = ensureAbsoluteWith(Lang.process.cwd())

/**
 * Make a path absolute if it isn't already, with support for undefined paths.
 * If the path is undefined, returns the current working directory.
 *
 * @param pathExp - The path to ensure is absolute (or undefined).
 * @returns An absolute path or the current working directory if undefined.
 *
 * @example
 * ```ts
 * // with undefined
 * ensureOptionalAbsoluteWithCwd(undefined) // '/current/working/dir'
 *
 * // with relative path
 * ensureOptionalAbsoluteWithCwd('foo/bar.ts') // '/current/working/dir/foo/bar.ts'
 *
 * // with absolute path
 * ensureOptionalAbsoluteWithCwd('/foo/bar.ts') // '/foo/bar.ts'
 * ```
 */
export const ensureOptionalAbsoluteWithCwd = (pathExp: string | undefined): string => {
  if (pathExp === undefined) return Lang.process.cwd()
  return PlatformPath.isAbsolute(pathExp) ? pathExp : PlatformPath.resolve(Lang.process.cwd(), pathExp)
}

/**
 * Make a path absolute if it isn't already, with support for undefined paths.
 * If the path is undefined, returns the base path.
 *
 * @param pathExp - The path to ensure is absolute (or undefined).
 * @param basePathExp - The base path to resolve against or return if pathExp is undefined.
 * @returns An absolute path or the base path if undefined.
 *
 * @example
 * ```ts
 * // with undefined
 * ensureOptionalAbsolute(undefined, '/home/user') // '/home/user'
 *
 * // with relative path
 * ensureOptionalAbsolute('foo/bar.ts', '/home/user') // '/home/user/foo/bar.ts'
 *
 * // with absolute path
 * ensureOptionalAbsolute('/foo/bar.ts', '/home/user') // '/foo/bar.ts'
 * ```
 */
export const ensureOptionalAbsolute = (pathExp: string | undefined, basePathExp: string): string => {
  assertAbsolute(basePathExp)
  if (pathExp === undefined) return basePathExp
  return PlatformPath.isAbsolute(pathExp) ? pathExp : PlatformPath.resolve(basePathExp, pathExp)
}

/**
 * Assert that a path is absolute, throwing an error if it's not.
 *
 * @param pathExpression - The path to check.
 * @throws Error if the path is not absolute.
 *
 * @example
 * ```ts
 * assertAbsolute('/foo/bar.ts') // passes
 * assertAbsolute('foo/bar.ts') // throws Error: Path must be absolute: foo/bar.ts
 * ```
 */
export const assertAbsolute = (pathExpression: string): void => {
  if (PlatformPath.isAbsolute(pathExpression)) return
  throw new Error(`Path must be absolute: ${pathExpression}`)
}

/**
 * Assert that a path is absolute if defined, throwing an error if it's relative.
 * Undefined paths are allowed and will not throw.
 *
 * @param pathExpression - The path to check (or undefined).
 * @param message - Optional custom error message.
 * @throws Error if the path is defined but not absolute.
 *
 * @example
 * ```ts
 * assertOptionalAbsolute(undefined) // passes
 * assertOptionalAbsolute('/foo/bar.ts') // passes
 * assertOptionalAbsolute('foo/bar.ts') // throws Error: Path must be absolute: foo/bar.ts
 * assertOptionalAbsolute('foo/bar.ts', 'Custom error') // throws Error: Custom error
 * ```
 */
export const assertOptionalAbsolute = (pathExpression: string | undefined, message?: string): void => {
  if (pathExpression === undefined) return
  if (PlatformPath.isAbsolute(pathExpression)) return
  const message_ = message ?? `Path must be absolute: ${pathExpression}`
  throw new Error(message_)
}

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
