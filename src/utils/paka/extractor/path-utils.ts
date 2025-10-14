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
    .replace(/\$\$\.js$/, '$$$$.ts') // $$$$ = two literal $ chars in replacement
    .replace(/\.js$/, '.ts')
}

/**
 * Convert an absolute file path to a relative path from project root.
 *
 * Handles both real filesystem paths (with cwd prefix) and virtual
 * in-memory filesystem paths (starting with /).
 *
 * @example
 * // Real filesystem
 * absoluteToRelative('/Users/foo/project/src/index.ts')
 * // => 'src/index.ts' (if cwd is /Users/foo/project)
 *
 * @example
 * // Virtual filesystem (in-memory ts-morph)
 * absoluteToRelative('/src/index.ts')
 * // => 'src/index.ts'
 */
export const absoluteToRelative = (absolutePath: string): string => {
  // Try to make it relative to cwd (for real filesystem)
  const relative = absolutePath.replace(process.cwd() + '/', '')
  if (relative !== absolutePath) {
    // Successfully made relative to cwd
    return relative
  }
  // If that didn't work, assume it's a virtual absolute path (starts with /)
  // Strip leading / to make it relative
  if (absolutePath.startsWith('/')) {
    return absolutePath.slice(1)
  }
  return absolutePath
}
