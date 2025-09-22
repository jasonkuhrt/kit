import type { Str } from '#str'
import type { PATH_SEPARATOR } from '../constants.js'
import type { Analysis } from './analyzer.js'

/**
 * Type-level analyzer for path strings.
 * Mirrors the runtime analyzer logic for compile-time path analysis.
 */

// ============================================================================
// Extension detection
// ============================================================================

/**
 * Check if a segment has a valid extension.
 * Rules matching runtime:
 * - lastIndexOf('.') > 0 means has extension
 * - .gitignore -> no extension (lastIndexOf = 0)
 * - .env.local -> has extension (lastIndexOf = 4)
 * - file.txt -> has extension (lastIndexOf = 4)
 */
type HasExtension<S extends string> =
  // Check for files starting with dot that have another dot
  S extends `.${infer Rest}` ? Rest extends `${string}.${string}` ? true // .env.local has extension
    : false // .gitignore has no extension
    // Normal files - any dot means extension
    : S extends `${string}.${string}` ? true
    : false

/**
 * Simple approach: take everything after last dot as extension.
 * For simplicity, we'll just handle common cases.
 */
type ExtractExtension<S extends string> =
  // Handle files starting with dot
  S extends `.${infer Rest}` ? Rest extends `${string}.${infer Ext}` ? `.${Ext}` // .env.local -> .local
    : null // .gitignore -> null
    // Handle normal files
    : S extends `${string}.${infer Ext}` ? `.${Ext}` // file.txt -> .txt, file.test.ts -> .ts
    : null

/**
 * Extract the name without extension from a filename.
 */
type ExtractName<S extends string> =
  // Handle files starting with dot
  S extends `.${infer Rest}` ? Rest extends `${infer Name}.${string}` ? `.${Name}` // .env.local -> .env
    : S // .gitignore -> .gitignore
    // Handle normal files - need to get everything before last dot
    : S extends `${infer Name}.${string}` ? Name // This will get "file" from "file.txt" or "file.test" from "file.test.ts"
    : S

// ============================================================================
// Directory detection
// ============================================================================

/**
 * Check if a path string represents a directory.
 * Rules (matching runtime analyzer):
 * 1. Trailing slash = directory
 * 2. Special cases: '.', './', '..', '../' = directory
 * 3. Has extension = file
 * 4. Otherwise = directory
 */
type IsDirectory<S extends string> = S extends '' ? true
  : S extends '.' ? true
  : S extends './' ? true
  : S extends '..' ? true
  : S extends '../' ? true
  : Str.EndsWith<S, PATH_SEPARATOR> extends true ? true
  : HasExtension<Str.LastSegment<Str.RemoveTrailingSlash<S>>> extends true ? false
  : true // No extension = directory

// ============================================================================
// Path type detection
// ============================================================================

type IsAbsolute<S extends string> = Str.StartsWith<S, PATH_SEPARATOR> extends true ? true : false

type IsRelative<S extends string> = IsAbsolute<S> extends true ? false : true

// ============================================================================
// Path parsing
// ============================================================================

/**
 * Extract path segments (excluding filename for files).
 */
type ExtractPathSegments<S extends string> = IsDirectory<S> extends true
  ? Str.Split<Str.RemoveTrailingSlash<S>, PATH_SEPARATOR>
  : S extends `${infer Dir}${PATH_SEPARATOR}${infer File}` ? Str.Split<Dir, PATH_SEPARATOR>
  : []

// ============================================================================
// Main Analysis types
// ============================================================================

/**
 * File analysis result matching runtime AnalysisFile.
 */
export type AnalysisFile<S extends string = string> = {
  _tag: 'file'
  original: S
  pathType: IsAbsolute<S> extends true ? 'absolute' : 'relative'
  isPathAbsolute: IsAbsolute<S>
  isPathRelative: IsRelative<S>
  path: ExtractPathSegments<S>
  file: {
    name: ExtractName<Str.LastSegment<S>>
    extension: ExtractExtension<Str.LastSegment<S>>
  }
}

/**
 * Directory analysis result matching runtime AnalysisDir.
 */
export type AnalysisDir<S extends string = string> = {
  _tag: 'dir'
  original: S
  pathType: IsAbsolute<S> extends true ? 'absolute' : 'relative'
  isPathAbsolute: IsAbsolute<S>
  isPathRelative: IsRelative<S>
  path: ExtractPathSegments<S>
}

/**
 * Type-level analyzer that mirrors runtime analyzeEncodedLocation.
 * Determines if a path is a file or directory and extracts metadata.
 * Falls back to Analysis union when given non-literal string type.
 */
export type Analyze<S extends string> = string extends S ? Analysis // Non-literal string fallback
  : IsDirectory<S> extends true ? AnalysisDir<S>
  : AnalysisFile<S>

// ============================================================================
// Utility type exports
// ============================================================================

/**
 * Extract just the tag from analysis result.
 */
export type AnalyzeTag<S extends string> = Analyze<S>['_tag']

/**
 * Check if path would be analyzed as a file.
 */
export type IsFile<S extends string> = AnalyzeTag<S> extends 'file' ? true : false

/**
 * Check if path would be analyzed as a directory.
 */
export type IsDir<S extends string> = AnalyzeTag<S> extends 'dir' ? true : false
