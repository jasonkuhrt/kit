import { Str } from '#str'
import { splitWith } from '../str/split.js'

export type PropertyPathExpression = string

export type PropertyPath = readonly string[]

export type PropertyPathInput = PropertyPathExpression | PropertyPath

/**
 * Normalize a property path input to a consistent array format.
 * Accepts either a dot-notation string or an array of property names.
 *
 * @category Path Utilities
 *
 * @param pathInput - Either a dot-notation string or array of property names
 * @returns An array of property names representing the path
 *
 * @example
 * ```ts
 * normalizePropertyPathInput('user.address.city')
 * // Returns: ['user', 'address', 'city']
 * ```
 *
 * @example
 * ```ts
 * normalizePropertyPathInput(['user', 'address', 'city'])
 * // Returns: ['user', 'address', 'city'] (unchanged)
 * ```
 */
export const normalizePropertyPathInput = <pathInput extends PropertyPathInput>(
  pathInput: pathInput,
): normalizePropertyPathInput<pathInput> => {
  const result = Str.Type.is(pathInput)
    ? parsePropertyPathExpression(pathInput)
    : pathInput
  return result as any
}

// dprint-ignore
export type normalizePropertyPathInput<pathInput extends PropertyPathInput> =
  pathInput extends PropertyPathExpression
    ? parsePropertyPathExpression<pathInput>
    : pathInput extends PropertyPath
      ? pathInput
      : never

/**
 * The separator character used in property path expressions.
 * Used to split dot-notation paths like 'user.address.city'.
 */
export const PropertyPathSeparator = `.`

/**
 * Parse a dot-notation property path expression into an array of property names.
 *
 * @category Path Utilities
 *
 * @param expression - A dot-notation string like 'user.address.city'
 * @returns An array of property names ['user', 'address', 'city']
 *
 * @example
 * ```ts
 * parsePropertyPathExpression('user.name')
 * // Returns: ['user', 'name']
 * ```
 *
 * @example
 * ```ts
 * parsePropertyPathExpression('config.server.port')
 * // Returns: ['config', 'server', 'port']
 * ```
 *
 * @example
 * ```ts
 * parsePropertyPathExpression('singleProperty')
 * // Returns: ['singleProperty']
 * ```
 */
// dprint-ignore
export const parsePropertyPathExpression:
  <expression extends string>(expression: expression) => parsePropertyPathExpression<expression> =
    splitWith(PropertyPathSeparator) as any

// dprint-ignore
export type parsePropertyPathExpression<$Expression extends string> =
  $Expression extends `${infer __key__}.${infer __rest__}`
    ? [__key__, ...parsePropertyPathExpression<__rest__>]
    : [$Expression]

// dprint-ignore
export type InferShapeFromPropertyPath<$PropertyPath extends PropertyPath> =
	$PropertyPath extends readonly []
		? {}
		: _InferShapeFromPropertyPath<$PropertyPath>

/**
 * Helper type for inferring object shape from property path.
 * @internal
 */
// dprint-ignore
export type _InferShapeFromPropertyPath<$PropertyPath extends PropertyPath> =
  $PropertyPath extends readonly [infer __key__ extends string, ...infer __tail__ extends readonly string[]]
    ? { [_ in __key__]?: InferShapeFromPropertyPath<__tail__> }
    : unknown
