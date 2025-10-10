/**
 * Path transformation utilities for converting between build and source paths.
 *
 * The paka extractor works with both build artifacts (JS) and source files (TS).
 * These utilities handle the conversions between these different path formats.
 */

/**
 * Convert a build path to its corresponding source path.
 *
 * Transformation rules:
 * 1. Replace build directory prefix with source directory prefix
 * 2. Replace barrel file extension ($$.js -> $$.ts)
 * 3. Replace regular JS extension with TS extension
 *
 * @example
 * buildToSourcePath('./build/utils/test/$.js')
 * // => './src/utils/test/$.ts'
 *
 * @example
 * buildToSourcePath('./build/arr/$$.js')
 * // => './src/arr/$$.ts'
 */
export const buildToSourcePath = (buildPath: string): string => {
  return buildPath
    .replace(/^\.\/build\//, './src/')
    .replace(/\$\$\.js$/, '$$.ts')
    .replace(/\.js$/, '.ts')
}

/**
 * Convert an absolute file path to a relative path from project root.
 *
 * Removes the current working directory prefix to create a portable
 * relative path that works across different environments.
 *
 * @example
 * absoluteToRelative('/Users/foo/project/src/index.ts')
 * // => './src/index.ts' (if cwd is /Users/foo/project)
 */
export const absoluteToRelative = (absolutePath: string): string => {
  return absolutePath.replace(process.cwd() + '/', './')
}
