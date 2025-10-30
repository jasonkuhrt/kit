import type { Analyze } from './analyzer.types.js'

interface AnalysisBase {
  /** Original input string */
  original: string
}

interface AnalysisNonRoot extends AnalysisBase {
  /** Original input string */
  original: string
  pathType: 'absolute' | 'relative'
  isPathAbsolute: boolean
  isPathRelative: boolean
}

export type Analysis =
  | AnalysisFile
  | AnalysisDir

export interface AnalysisFile extends AnalysisNonRoot {
  _tag: 'file'
  /** Original input string */
  original: string
  /** Path segments (excluding the filename) */
  path: string[]
  /** File metadata */
  file: {
    stem: string
    extension: string | null
  }
}

export interface AnalysisDir extends AnalysisNonRoot {
  _tag: 'dir'
  /** Original input string */
  original: string
  /** Path segments (including all directory names) */
  path: string[]
}

/**
 * Analyze a location string to extract its components.
 *
 * @param input - The location string to analyze
 * @returns Analyzed location components
 *
 * @example
 * ```ts
 * analyze('/src/index.ts')   // { isAbsolute: true, isDirectory: false, filename: 'index.ts', ... }
 * analyze('./docs/')         // { isAbsolute: false, isDirectory: true, dirname: 'docs', ... }
 * analyze('/')               // { isAbsolute: true, isDirectory: true, dirname: undefined, ... }
 * analyze('../src/file.ts')  // { isAbsolute: false, parentRefs: 1, filename: 'file.ts', ... }
 * ```
 */
export function analyze<const input extends string>(input: input): Analyze<input> {
  return analyze_(input) as Analyze<input>
}

export function analyze_(input: string): Analysis {
  const isAbsolute = input.startsWith('/')

  // Handle root case as an absolute directory with empty path
  if (input === '/') {
    return {
      _tag: 'dir',
      pathType: 'absolute',
      isPathAbsolute: true,
      isPathRelative: false,
      path: [],
      original: input,
    }
  }

  // Determine if it's a directory or file
  // 1. Trailing slash = directory
  // 2. Has extension = file
  // 3. Otherwise = directory
  let isDirectory: boolean

  if (input === '' || input === '.' || input === './' || input === '..' || input === '../' || input.endsWith('/')) {
    isDirectory = true
  } else {
    // Check if last segment has an extension
    const segments = input.split('/').filter(s => s !== '')
    const lastSegment = segments[segments.length - 1]

    if (lastSegment) {
      // Has extension if there's a dot that's not at the beginning
      // .gitignore -> no extension (hidden file)
      // file.txt -> has extension
      const dotIndex = lastSegment.lastIndexOf('.')
      const hasExtension = dotIndex > 0
      isDirectory = !hasExtension
    } else {
      // No last segment, treat as directory
      isDirectory = true
    }
  }

  // Normalize the input for segment extraction
  let normalized = input
  let parentRefs = 0

  // Remove leading slash for absolute paths
  if (isAbsolute) {
    normalized = input.slice(1)
  }

  // Count and remove parent directory references
  while (normalized.startsWith('../')) {
    parentRefs++
    normalized = normalized.slice(3)
  }

  // Handle current directory prefix
  if (normalized.startsWith('./')) {
    normalized = normalized.slice(2)
  }

  // Remove trailing slash for directories (except root)
  if (isDirectory && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }

  // Extract all segments (not including parent refs)
  const rawSegments = normalized
    ? normalized.split('/').filter(s => s !== '' && s !== '.')
    : []

  // Add parent refs as '..' segments at the beginning
  const allSegments = [
    ...Array(parentRefs).fill('..'),
    ...rawSegments,
  ]

  const pathType: 'absolute' | 'relative' = isAbsolute ? 'absolute' : 'relative'
  const isPathAbsolute = isAbsolute
  const isPathRelative = !isAbsolute

  if (isDirectory) {
    // For directories, all segments are part of the path
    return {
      _tag: 'dir',
      pathType,
      isPathAbsolute,
      isPathRelative,
      path: allSegments,
      original: input,
    }
  }

  // For files, the last segment is the filename
  if (allSegments.length === 0) {
    // Edge case: empty filename
    return {
      _tag: 'file',
      pathType,
      isPathAbsolute,
      isPathRelative,
      path: [],
      file: {
        stem: '',
        extension: null,
      },
      original: input,
    }
  }

  const path = allSegments.slice(0, -1)
  const filename = allSegments[allSegments.length - 1]

  // Extract extension
  const dotIndex = filename.lastIndexOf('.')
  const extension = dotIndex > 0 ? filename.substring(dotIndex) : null
  const stem = dotIndex > 0 ? filename.substring(0, dotIndex) : filename

  return {
    _tag: 'file',
    pathType,
    isPathAbsolute,
    isPathRelative,
    path,
    file: {
      stem,
      extension,
    },
    original: input,
  }
}
