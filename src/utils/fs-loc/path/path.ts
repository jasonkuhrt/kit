import { Schema as S } from 'effect'
import * as AbsoluteMod from './abs.js'
import * as RelativeMod from './rel.js'

/**
 * Union of all path types (Absolute | Relative).
 */
export const Path = S.Union(AbsoluteMod.Abs, RelativeMod.Rel)

/**
 * Type representing any path.
 */
export type Path = typeof Path.Type

/**
 * Type guard to check if a value is a Path.
 */
export const is = S.is(Path)

/**
 * Decode a value into a Path.
 */
export const decode = S.decode(Path)

/**
 * Synchronously decode a value into a Path.
 */
export const decodeSync = S.decodeSync(Path)

/**
 * Encode a Path.
 */
export const encode = S.encode(Path)

/**
 * Synchronously encode a Path.
 */
export const encodeSync = S.encodeSync(Path)
