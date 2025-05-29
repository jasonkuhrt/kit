import type { Print } from './print.js'

export * from './print.js'

/**
 * Types that TypeScript accepts being interpolated into a Template Literal Type
 */
export type Interpolatable =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol
  | object
  | unknown
  | any
  | never

/**
 * Represents a type error that can be surfaced at the type level.
 * This is useful for providing more informative error messages directly in TypeScript's
 * type checking, often used with conditional types or generic constraints.
 *
 * @template $Message A string literal type describing the error.
 * @template $Context An object type providing additional context about the error,
 *                    often including the types involved.
 */
export interface StaticError<
  $Message extends string = string,
  $Context extends object = {},
  $Hint extends string = '(none)',
> {
  ERROR: $Message
  CONTEXT: $Context
  HINT: $Hint
}

/**
 * Like {@link Print} but adds additional stlying to display the rendred type in a sentence.
 *
 * Useful for type-level error messages.
 *
 * Styling performed:
 *
 * - Wrap printed type with quotes ala markdown.
 */
export type Show<$Type> = `\`${Print<$Type>}\``

/**
* Version of {@link show} but uses single quotes instead of backticks.
*
* This can be useful in template literal types where backticks would be rendered as "\`"
* which is not ideal for readability.

Note that when working with TS-level errors if TS can instantiate all the types involved then
the result will be a string, not a string literal type.

* So when working with TS-level errors, only reach for this variant of {@link Show} if you think there is likelihood
* for users that types won't be instantiated.
*/
export type ShowInTemplate<$Type> = `'${Print<$Type>}'`

export type Simplify<$Type> =
  & {
    [_ in keyof $Type]: $Type[_]
  }
  & unknown
