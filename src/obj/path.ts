import { Str } from '#str/index.js'
import { splitWith } from '#str/split.js'

export type PropertyPathExpression = string

export type PropertyPath = readonly string[]

export type PropertyPathInput = PropertyPathExpression | PropertyPath

export const normalizePropertyPathInput = <pathInput extends PropertyPathInput>(
  pathInput: pathInput,
): normalizePropertyPathInput<pathInput> => {
  const result = Str.is(pathInput)
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

export const PropertyPathSeparator = `.`

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

// dprint-ignore
export type _InferShapeFromPropertyPath<$PropertyPath extends PropertyPath> =
  $PropertyPath extends readonly [infer __key__ extends string, ...infer __tail__ extends readonly string[]]
    ? { [_ in __key__]?: InferShapeFromPropertyPath<__tail__> }
    : unknown
