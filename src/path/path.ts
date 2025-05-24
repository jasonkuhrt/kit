import { Fn } from '#fn/index.js'
import { tmpdir } from 'node:os'
import * as NodePath from 'node:path'
import { fileURLToPath } from 'node:url'

export {
  basename,
  delimiter,
  dirname,
  extname,
  format,
  isAbsolute,
  join,
  normalize,
  parse,
  type ParsedPath as Parsed,
  posix,
  relative,
  resolve,
  sep,
  toNamespacedPath,
  win32,
} from 'node:path'

export const ensureAbsolute = (filePath: string, basePath: string = process.cwd()): string => {
  return NodePath.isAbsolute(filePath)
    ? filePath
    : NodePath.resolve(basePath, filePath)
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

export const ensureAbsoluteWithCWD = ensureAbsoluteWith(process.cwd())

export const formatExplicitRelative = (path: string) => {
  if (NodePath.isAbsolute(path)) {
    return path
  }

  if (path.startsWith(explicitRelativePrefix)) {
    return path
  }

  return `${explicitRelativePrefix}${path}`
}

export const formatImplicitRelative = (path: string) => {
  if (NodePath.isAbsolute(path)) {
    return path
  }

  if (!path.startsWith(explicitRelativePrefix)) {
    return path
  }

  return path.slice(explicitRelativePrefix.length)
}

export const explicitRelativePrefix = `./`

export const tmpDirectory = tmpdir()

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

export const fromFileUrl = fileURLToPath
