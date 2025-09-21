import * as AbsDir from './members/abs-dir.js'
import * as RelDir from './members/rel-dir.js'

/**
 * The root directory of the file system.
 * Represents the absolute path `/`.
 */
export const absDirRoot = AbsDir.decodeSync('/')

/**
 * The current directory in relative paths.
 * Represents the relative path `.`.
 */
export const relDirCurrent = RelDir.decodeSync('.')

/**
 * The parent directory in relative paths.
 * Represents the relative path `..`.
 */
export const relDirParent = RelDir.decodeSync('..')
