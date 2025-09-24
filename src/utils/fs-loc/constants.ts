import { AbsDir } from './members/abs-dir.js'
import { RelDir } from './members/rel-dir.js'

/**
 * The path separator character used in filesystem paths.
 */
export const PATH_SEPARATOR = '/' as const

export type PATH_SEPARATOR = typeof PATH_SEPARATOR

/**
 * The root directory of the file system.
 * Represents the absolute path `/`.
 */
export const absDirRoot = AbsDir.fromString('/')

/**
 * The current directory in relative paths.
 * Represents the relative path `.`.
 */
export const relDirCurrent = RelDir.fromString('.')

/**
 * The parent directory in relative paths.
 * Represents the relative path `..`.
 */
export const relDirParent = RelDir.fromString('..')
