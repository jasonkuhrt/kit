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
 *
 * // Template literals vs string concatenation:
 * const ext = '.ts'
 * // ✅ Template literal preserves literal type
 * const file1 = FsLoc.fromString(`src/index${ext}`)  // works!
 *
 * // ❌ String concatenation loses literal type
 * const file2 = FsLoc.fromString('src/index' + ext)  // Type error!
 * ```
 *
 * NOTE: Template literal syntax (e.g., fromString`/path/file.txt`) is not supported
 * due to a TypeScript limitation where literal types cannot be preserved through
 * TemplateStringsArray. The type system cannot infer the literal string value from
 * a tagged template, making compile-time path analysis impossible.
 *
 * Tracking issue: https://github.com/microsoft/TypeScript/issues/33304
 *
 * If this limitation is ever resolved, we could add template literal support.
 */
export const fromString: <const input extends string>(
  input: Str.LiteralOnly<
    input,
    'FsLoc.fromString requires a literal string. Use FsLoc.decodeSync() for runtime strings.'
  >,
) => AnalysisToFsLoc<Analyzer.Analyze<input>> = decodeSync as any

/**
 * Map Analysis result to specific FsLoc member type.
 */
// dprint-ignore
export type AnalysisToFsLoc<T> =
    T extends { _tag: 'file'; pathType: 'absolute' } ? AbsFile.AbsFile
  : T extends { _tag: 'file'; pathType: 'relative' } ? RelFile.RelFile
  : T extends { _tag: 'dir'; pathType: 'absolute' } ? AbsDir.AbsDir
  : T extends { _tag: 'dir'; pathType: 'relative' } ? RelDir.RelDir
  : never
