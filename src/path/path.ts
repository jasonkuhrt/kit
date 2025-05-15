import { tmpdir } from 'node:os'
import * as NodePath from 'node:path'

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
  posix,
  relative,
  resolve,
  sep,
  toNamespacedPath,
  win32,
} from 'node:path'

/**
 * Make a path absolute if it isn't already
 *
 * @param filePath - The path to ensure is absolute
 * @param basePath - The base path to resolve against (defaults to process current working directory)
 * @returns An absolute path
 */
export const absolutify = (basePath: string = process.cwd()) => (filePath: string): string => {
  return NodePath.isAbsolute(filePath)
    ? filePath
    : NodePath.resolve(basePath, filePath)
}

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
