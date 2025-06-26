//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Type
//
//

export type Unknown = readonly unknown[]

export type Any = readonly any[]

export type Empty = readonly []

/**
 * Empty array constant.
 *
 * @example
 * ```ts
 * import { Arr } from '@wollybeard/kit'
 *
 * const emptyArray = Arr.empty
 * console.log(emptyArray) // []
 * ```
 */
export const empty: Empty = []

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Implementation
//
//

// TODO: Add immutable array operations that wrap ArrMut with copy semantics
