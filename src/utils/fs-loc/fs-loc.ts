import type { Str } from '#str'
import { Schema as S } from 'effect'
import { Analyzer } from './analyzer/$.js'
import * as AbsDir from './members/abs-dir.js'
import * as AbsFile from './members/abs-file.js'
import * as RelDir from './members/rel-dir.js'
import * as RelFile from './members/rel-file.js'

export { AbsDir, AbsFile, RelDir, RelFile }

/**
 * Union of all location types.
 */
export const FsLoc = S.Union(
  AbsFile.AbsFile,
  AbsDir.AbsDir,
  RelFile.RelFile,
  RelDir.RelDir,
)

/**
 * Type representing any location.
 */
export type FsLoc = typeof FsLoc.Type

export const encodeSync = S.encodeSync(FsLoc)
export const encode = S.encode(FsLoc)
export const decodeSync = S.decodeSync(FsLoc)
export const decode = S.decode(FsLoc)

/**
 * Equivalence for FsLoc union type.
 */
export const equivalence = S.equivalence(FsLoc)

/**
 * Create a typed FsLoc from a literal string.
 *
 * This function requires a literal string at compile time to provide
 * type-safe parsing. The return type is automatically narrowed to the
 * specific FsLoc member type based on the input string.
 *
 * For runtime strings (non-literals), use `decodeSync` instead.
 *
 * @param input - A literal string path
 * @returns The specific FsLoc member type (AbsFile, RelFile, AbsDir, or RelDir)
 *
 * @example
 * ```ts
 * const absFile = FsLoc.fromString('/path/file.txt')  // type: AbsFile
 * const relDir = FsLoc.fromString('./src/')           // type: RelDir
 *
 * // This will cause a type error:
 * const path: string = getPath()
 * const loc = FsLoc.fromString(path)  // Error: string not assignable
 * // Use this instead: FsLoc.decodeSync(path)
 * ```
 */
export const fromString: <const input extends string>(
  input: Str.LiteralOnly<input>,
) => AnalysisToFsLoc<Analyzer.Analyze<input>> = decodeSync as any

/**
 * Map Analysis result to specific FsLoc member type.
 */
export type AnalysisToFsLoc<T> = T extends { _tag: 'file'; pathType: 'absolute' } ? AbsFile.AbsFile
  : T extends { _tag: 'file'; pathType: 'relative' } ? RelFile.RelFile
  : T extends { _tag: 'dir'; pathType: 'absolute' } ? AbsDir.AbsDir
  : T extends { _tag: 'dir'; pathType: 'relative' } ? RelDir.RelDir
  : never
