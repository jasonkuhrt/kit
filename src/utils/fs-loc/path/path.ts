import { S } from '#deps/effect'
import { Abs } from './abs.js'
import { Rel } from './rel.js'

export { Abs } from './abs.js'
export { Rel } from './rel.js'

/**
 * Union of all path types (Absolute | Relative).
 */
export const Path = S.Union(Abs, Rel)

/**
 * Type representing any path.
 */
export type Path = typeof Path.Type

/**
 * Type guard to check if a value is a Path.
 */
export const is = S.is(Path)
