import type { Path } from '#fs/fs'
import { Pro } from '#pro'
import { Schema as S } from 'effect'
import type { $Abs } from '../$Abs/_.js'
import { $Abs as Abs } from '../$Abs/_.js'
import type { AbsDir } from '../AbsDir/_.js'
import { join } from './join.js'

/**
 * Type-level ensureAbsolute operation.
 */
export type ensureAbsolute<
  L extends Path,
  B extends AbsDir | undefined = undefined,
> = L extends $Abs ? L : $Abs

/**
 * Ensure a location is absolute, converting relative locations to absolute.
 *
 * @param path - The path to ensure is absolute
 * @param base - The base directory to resolve relative paths against (defaults to current working directory)
 * @returns An absolute path
 *
 * @example
 * ```ts
 * const relPath = Path.RelFile.make({
 *   segments: ['foo'],
 *   fileName: { stem: 'bar', extension: '.ts' }
 * })
 * const cwd = Path.AbsDir.make({ segments: ['home', 'user'] })
 * const absPath = ensureAbsolute(relPath, cwd) // AbsFile /home/user/foo/bar.ts
 * ```
 */
export const ensureAbsolute = <
  L extends Path,
  B extends AbsDir | undefined = undefined,
>(
  path: L,
  base?: B,
): ensureAbsolute<L, B> => {
  // If already absolute, return as-is
  if (S.is(Abs.Schema)(path)) {
    return path as any
  }

  // Relative path needs a base
  const resolvedBase = base ?? Pro.cwd()

  // Convert relative to absolute using join
  return join(resolvedBase, path as any) as any
}

/**
 * Type-level ensureOptionalAbsolute operation.
 */
export type ensureOptionalAbsolute<
  L extends Path | undefined,
  B extends AbsDir | undefined = undefined,
> = L extends undefined ? undefined : L extends Path ? ensureAbsolute<L, B> : never

/**
 * Ensure an optional location is absolute.
 *
 * @param path - The optional path to ensure is absolute
 * @param base - Optional base directory to resolve against
 * @returns An absolute path or undefined if path is undefined
 *
 * @example
 * ```ts
 * const path: Path.RelFile | undefined = undefined
 * const result = ensureOptionalAbsolute(path) // undefined
 * ```
 */
export const ensureOptionalAbsolute = <
  L extends Path | undefined,
  B extends AbsDir | undefined = undefined,
>(
  path: L,
  base?: B,
): ensureOptionalAbsolute<L, B> => {
  if (path === undefined) {
    return undefined as any
  }

  return ensureAbsolute(path, base) as any
}

/**
 * Type-level ensureOptionalAbsoluteWithCwd operation.
 * Returns AbsDir when undefined, preserves file/dir distinction for other inputs.
 */
export type ensureOptionalAbsoluteWithCwd<L extends Path | undefined> = L extends undefined ? AbsDir
  : L extends Path ? ensureAbsolute<L, AbsDir>
  : never

/**
 * Ensure an optional location is absolute, using current working directory as default.
 *
 * @param path - The optional path to ensure is absolute
 * @returns An absolute path or current working directory if path is undefined
 *
 * @example
 * ```ts
 * const path = undefined
 * const result = ensureOptionalAbsoluteWithCwd(path) // returns cwd as AbsDir
 * ```
 */
export const ensureOptionalAbsoluteWithCwd = <L extends Path | undefined>(
  path: L,
): ensureOptionalAbsoluteWithCwd<L> => {
  const base = Pro.cwd()

  if (path === undefined) {
    return base as any
  }

  return ensureAbsolute(path, base) as any
}
