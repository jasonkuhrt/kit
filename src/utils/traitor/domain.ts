/**
 * Name of a domain (e.g., 'Arr', 'Str', 'Num').
 * Domains represent data types that can implement traits.
 */
export type DomainName = string

/**
 * Domain definition for trait implementations.
 *
 * @template $Type - The type this domain represents
 * @template $Name - The literal name of the domain (e.g., 'Str', 'Arr')
 */
export interface Domain<$Type = any, $Name extends string = string> {
  name: $Name
  _type: $Type
}

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
const nativeToDomainMap = {
  'null': 'Null',
  'undefined': 'Undefined',
  'boolean': 'Bool',
  'number': 'Num',
  'string': 'Str',
  'array': 'Arr',
  'object': 'Obj',
  'function': 'Fn',
} as const

/**
 * Type-level domain detection utility.
 * Maps types to their corresponding domain names.
 */
// dprint-ignore
export type detectDomain<$Value> =
    $Value extends null ? 'Null'
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
export const detectDomain = <value>(value: value): detectDomain<value> | null => {
  const type = typeof value

  if (type === 'object') {
    if (value === null) return nativeToDomainMap.null as any
    if (Array.isArray(value)) return nativeToDomainMap.array as any
    return nativeToDomainMap.object as any
  }

  if (type === 'bigint') return null
  if (type === 'symbol') return null

  return nativeToDomainMap[type] as any
}

export const detectDomainOrThrow = <value>(value: value): detectDomain<value> => {
  const result = detectDomain(value)
  if (result === null) {
    throw new Error(`Cannot detect domain for value of type ${typeof value}`)
  }
  return result
}

/**
 * Define a domain for trait implementations.
 *
 * @param name - The domain name (e.g., 'Str', 'Num', 'Arr')
 * @param typeWitness - A representative value of the type this domain handles
 * @returns A domain definition that can be passed to trait implementations
 *
 * @example
 * ```ts
 * const strDomain = domain('Str', '')
 * export const Eq = EqTrait.implement(strDomain, {
 *   is(a, b) { return typeof b === 'string' && a === b }
 * })
 * ```
 */
export const domain = <
  const $Name extends string,
  $Type,
>(name: $Name, _typeWitness: $Type): Domain<$Type, $Name> => ({
  name,
  _type: undefined as any,
})

/**
 * Domain definition for trait implementations.
 *
 * @template $Type - The type this domain represents
 * @template $Name - The literal name of the domain (e.g., 'Str', 'Arr')
 */
export interface Domain<$Type = any, $Name extends string = string> {
  name: $Name
  _type: $Type
}
