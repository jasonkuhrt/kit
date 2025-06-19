import { Path } from '#path/index.js'
import { Rec } from '#rec/index.js'

/**
 * Represents a directory tree structure where keys are paths and values are leaves.
 */
// eslint-ignore
export interface Tree {
  [path: string]: TreeLeaf
}

/**
 * A leaf in the tree can be either a directory (nested tree) or a file (string content).
 */
export type TreeLeaf = TreeLeafDirectory | TreeLeafFile
/**
 * A directory leaf is a nested tree structure.
 */
export type TreeLeafDirectory = Tree
/**
 * A file leaf contains string content.
 */
export type TreeLeafFile = string

/**
 * Enumeration of tree leaf types.
 */
export const TreeLeafTypeEnum = {
  directory: `directory`,
  file: `file`,
} as const

/**
 * The type of a tree leaf (either 'directory' or 'file').
 */
export type TreeLeafType = keyof typeof TreeLeafTypeEnum

/**
 * A flattened representation of a directory layout where keys are full paths and values are file contents.
 */
export type DirectoryLayoutFlat = Record<string, string>

/**
 * File content type.
 */
export type Content = string

/**
 * Check if a value is a file leaf (string content).
 *
 * @param value - The value to check.
 * @returns True if the value is a file leaf.
 *
 * @example
 * ```ts
 * isLeafTypeFile('file content') // true
 * isLeafTypeFile({ nested: 'dir' }) // false
 * ```
 */
export const isLeafTypeFile = (value: unknown): value is TreeLeafFile => typeof value === `string`

/**
 * Check if a value is a directory leaf (nested tree).
 *
 * @param value - The value to check.
 * @returns True if the value is a directory leaf.
 *
 * @example
 * ```ts
 * isLeafTypeDir({ file: 'content' }) // true
 * isLeafTypeDir('string') // false
 * ```
 */
export const isLeafTypeDir = (value: unknown): value is TreeLeafDirectory => Rec.is(value)

/**
 * Get the type of a tree leaf.
 *
 * @param leaf - The tree leaf to inspect.
 * @returns The type of the leaf ('file' or 'directory').
 * @throws {Error} If the leaf type is unknown.
 *
 * @example
 * ```ts
 * getLeafType('content') // 'file'
 * getLeafType({ nested: 'dir' }) // 'directory'
 * ```
 */
export const getLeafType = (leaf: TreeLeaf): TreeLeafType => {
  if (isLeafTypeFile(leaf)) return TreeLeafTypeEnum.file
  if (isLeafTypeDir(leaf)) return TreeLeafTypeEnum.directory
  throw new Error(`Unknown kind of leaf.`)
}

/**
 * Create a nested directory path in a tree structure.
 *
 * @param dir - The tree to create the path in.
 * @param segments - Path segments to create.
 * @returns The leaf directory at the created path.
 * @throws {Error} If trying to create a directory where a file already exists.
 *
 * @example
 * ```ts
 * const tree = {}
 * const leaf = makePath(tree, ['src', 'components'])
 * // tree is now { src: { components: {} } }
 * ```
 */
export const makePath = (
  dir: Tree,
  segments: string[],
): TreeLeafDirectory => {
  let currentDir = dir

  for (const segment of segments) {
    if (currentDir[segment] === undefined) {
      currentDir[segment] = {}
      currentDir = currentDir[segment]
    } else {
      const newCurrentDir = currentDir[segment]
      if (isLeafTypeFile(newCurrentDir)) {
        throw new Error(`file where directory trying to be created: \${currentDir[segment]}`)
      }
      currentDir = newCurrentDir
    }
  }

  return currentDir
}

/**
 * Type helper for normalizing to tree structure.
 */
export type NormalizeToTree<Tree> = Tree

/**
 * Normalize a directory layout to a tree structure.
 *
 * @param directoryLayout - The layout to normalize.
 * @param baseDir - Optional base directory to merge into.
 * @returns The normalized tree structure.
 *
 * @example
 * ```ts
 * const flat = { 'src/index.ts': 'export {}', 'src/utils.ts': 'export {}' }
 * const tree = normalizeToTree(flat)
 * // tree is { src: { 'index.ts': 'export {}', 'utils.ts': 'export {}' } }
 * ```
 */
export const normalizeToTree = <directoryLayout extends Tree>(
  directoryLayout: directoryLayout,
  baseDir: Tree = {},
): NormalizeToTree<directoryLayout> => {
  for (const [path, contentOrDirectory] of Object.entries(directoryLayout)) {
    const pathSegments = Path.posix.normalize(path).split(Path.posix.sep)
    if (isLeafTypeFile(contentOrDirectory)) {
      const fileName = pathSegments.pop()
      if (!fileName) {
        throw new Error(`invalid path: \${path}`)
      }
      const fileParentDir = makePath(baseDir, pathSegments)
      fileParentDir[fileName] = contentOrDirectory
    } else {
      normalizeToTree(contentOrDirectory, makePath(baseDir, pathSegments))
    }
  }
  return baseDir as any
}

/**
 * Type helper for normalizing to flat structure.
 *
 * @typeParam $FileLayout - The file layout type.
 * @typeParam $Base - The base path prefix.
 */
export type NormalizeToFlat<$FileLayout, $Base extends string = ``> = {
  [k in keyof $FileLayout & string as `${$Base}${k}`]: $FileLayout[k] extends string ? $FileLayout[k]
    : k
}

/**
 * Normalize a tree structure to a flat directory layout.
 *
 * @param directoryLayout - The tree structure to flatten.
 * @param basePath - Optional base path prefix.
 * @returns The flattened directory layout.
 *
 * @example
 * ```ts
 * const tree = { src: { 'index.ts': 'export {}', 'utils.ts': 'export {}' } }
 * const flat = normalizeToFlat(tree)
 * // flat is { 'src/index.ts': 'export {}', 'src/utils.ts': 'export {}' }
 * ```
 */
export const normalizeToFlat = <directoryLayout extends Tree>(
  directoryLayout: directoryLayout,
  basePath = ``,
): NormalizeToFlat<directoryLayout> => {
  return Object.fromEntries(
    Object.entries(directoryLayout).flatMap(
      ([path, contentOrDirectory]): [path: string, content: string][] => {
        const fullPath = Path.join(basePath, path)

        if (isLeafTypeFile(contentOrDirectory)) {
          return [[fullPath, contentOrDirectory]]
        }

        return Object.entries(normalizeToFlat(contentOrDirectory, fullPath))
      },
    ),
  ) as any
}
