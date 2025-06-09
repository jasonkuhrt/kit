import { Fn } from '#fn/index.js'
import { Language } from '#language/index.js'
import * as PlatformPath from '#platform:path/path.js'

export * from '#platform:path/path.js'

export const ensureAbsolute = (filePath: string, basePath: string = Language.process.cwd()): string => {
  return PlatformPath.isAbsolute(filePath)
    ? filePath
    : PlatformPath.resolve(basePath, filePath)
}

export const ensureAbsoluteOn = Fn.curry(ensureAbsolute)

/**
 * Make a path absolute if it isn't already
 *
 * @param filePath - The path to ensure is absolute
 * @param basePath - The base path to resolve against (defaults to process current working directory)
 * @returns An absolute path
 */
export const ensureAbsoluteWith = Fn.flipCurried(ensureAbsoluteOn)

export const ensureAbsoluteWithCWD = ensureAbsoluteWith(Language.process.cwd())

export const formatExplicitRelative = (path: string) => {
  if (PlatformPath.isAbsolute(path)) {
    return path
  }

  if (path.startsWith(explicitRelativePrefix)) {
    return path
  }

  return `${explicitRelativePrefix}${path}`
}

export const formatImplicitRelative = (path: string) => {
  if (PlatformPath.isAbsolute(path)) {
    return path
  }

  if (!path.startsWith(explicitRelativePrefix)) {
    return path
  }

  return path.slice(explicitRelativePrefix.length)
}

export const explicitRelativePrefix = `./`

// export const tmpDirectory = tmpdir()

// Protocol

// export const protocolPattern = /^([a-zA-z]+):\/\//i

// export const stripProtocol = Str.strip(protocolPattern)

// export const fileProtocol = `file://`

// export const stripFileProtocol = Str.stripLeading(fileProtocol)

export const executableJavaScriptExtensions = [
  // JavaScript
  '.js',
  '.mjs',
  '.cjs',
  '.jsx',
  // TypeScript
  '.ts',
  '.mts',
  '.cts',
  '.tsx',
]

export const buildArtifactExtensions = [
  '.map',
  '.d.ts',
]

// merge

export const merge = (path1: string, path2: string): string => {
  return PlatformPath.join(path1, path2)
}

export const mergeOn = Fn.curry(merge)
