/**
 * Domain detection utilities.
 */

import type { DomainName } from './types.ts'

/**
 * Lookup table for native type to domain mapping.
 * Kept at module level for performance.
 *
 * @todo Add support for additional native types:
 * - Date -> 'Date'
 * - RegExp -> 'Regex'
 * - Map -> 'Map'
 * - Set -> 'Set'
 * - Promise -> 'Prom'
 * - Error -> 'Err'
 * - Function -> 'Fn'
 * - Symbol -> 'Symbol'
 * - BigInt -> 'BigInt'
 */
const nativeToDomain = {
  'null': 'Null',
  'undefined': 'Undefined',
  'boolean': 'Bool',
  'number': 'Num',
  'string': 'Str',
  'array': 'Arr',
  'object': 'Obj',
} as const

/**
 * Type-level domain detection utility.
 * Maps types to their corresponding domain names.
 */
export type GetDomain<$Value> = $Value extends null ? 'Null'
  : $Value extends undefined ? 'Undefined'
  : $Value extends boolean ? 'Bool'
  : $Value extends number ? 'Num'
  : $Value extends string ? 'Str'
  : $Value extends readonly any[] ? 'Arr' // Catches both readonly and regular arrays
  : $Value extends object ? 'Obj'
  : never

/**
 * Map a native JavaScript value to its domain name.
 *
 * @param value - The value to inspect
 * @returns The domain name (e.g., 'Arr', 'Str', 'Num')
 * @throws If the value type cannot be mapped to a domain
 */
export const nativeToDomainOrThrow = (value: unknown): DomainName => {
  const type = typeof value

  switch (type) {
    case 'undefined':
      return nativeToDomain.undefined
    case 'boolean':
      return nativeToDomain.boolean
    case 'number':
      return nativeToDomain.number
    case 'string':
      return nativeToDomain.string
    case 'object':
      if (value === null) return nativeToDomain.null
      return Array.isArray(value) ? nativeToDomain.array : nativeToDomain.object
    default:
      throw new Error(`Cannot determine domain for value of type "${type}": ${value}`)
  }
}
