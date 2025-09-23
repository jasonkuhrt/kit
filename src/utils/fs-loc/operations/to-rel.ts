import * as NodePath from 'node:path'
import * as FsLoc from '../$$.js'
import * as Groups from '../groups/$$.js'
import * as Inputs from '../inputs.js'

/**
 * Type-level ToRel operation.
 * Maps absolute location types to their relative counterparts.
 */
export type ToRel<A extends Groups.Abs.Abs> = A extends FsLoc.AbsFile.AbsFile ? FsLoc.RelFile.RelFile
  : A extends FsLoc.AbsDir.AbsDir ? FsLoc.RelDir.RelDir
  : Groups.Rel.Rel

/**
 * Type-level toRel wrapper for Input types.
 */
export type toRel<$Abs extends Inputs.Input.Abs> = ToRel<Inputs.normalize<$Abs>>

/**
 * Convert an absolute location to a relative location.
 *
 * @param loc - The absolute location to convert
 * @param base - The base directory to make the path relative to
 * @returns A relative location
 *
 * @example
 * ```ts
 * const absFile = FsLoc.AbsFile.decodeSync('/home/user/src/index.ts')
 * const base = FsLoc.AbsDir.decodeSync('/home/user/')
 * const relFile = toRel(absFile, base) // ./src/index.ts
 * ```
 */
export const toRel = <A extends Inputs.Input.Abs>(
  loc: Inputs.Validate.Abs<A>,
  base: FsLoc.AbsDir.AbsDir | string,
): toRel<A> => {
  const normalizedLoc = Inputs.normalize(loc)
  const normalizedBase = typeof base === 'string' ? FsLoc.AbsDir.decodeSync(base) : base
  // Encode the locations to get their string representations
  const locPath = FsLoc.encodeSync(normalizedLoc)
  const basePath = FsLoc.encodeSync(normalizedBase)

  // Calculate relative path using Node.js built-in
  const relativePath = NodePath.relative(basePath, locPath)

  // If empty, it means we're at the same location
  const finalPath = relativePath === '' ? '.' : relativePath
  return FsLoc.decodeSync(finalPath) as any
}
