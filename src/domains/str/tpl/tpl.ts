/**
 * Convenience re-export of the built-in TemplateStringsArray type.
 * Contains the string parts of a tagged template literal along with a `raw` property.
 * @category Template
 * @example
 * ```typescript
 * function tag(strings: Tpl.Array, ...values: unknown[]) {
 *   // strings is TemplateStringsArray
 *   // strings[0] = "Hello "
 *   // strings[1] = "!"
 *   // strings.raw contains raw string values
 * }
 * tag`Hello ${name}!`
 * ```
 */
export type Tpl = TemplateStringsArray

/**
 * Type guard to check if a value is a TemplateStringsArray.
 * Used to detect when a function is called as a tagged template literal.
 * @category Template
 * @param value - Value to check
 * @returns True if value is a TemplateStringsArray
 * @example
 * ```typescript
 * function tag(...args: unknown[]) {
 *   if (isArray(args[0])) {
 *     // Called as tag`template`
 *   } else {
 *     // Called as tag()
 *   }
 * }
 * ```
 */
export const is = (value: unknown): value is Tpl => {
  return Array.isArray(value) && value.length > 0 && value[0] instanceof Object && `raw` in (value[0] as any)
}

/**
 * Tagged template literal arguments tuple.
 * First element is the template strings array, followed by interpolated values.
 * @category Template
 * @example
 * ```typescript
 * function tag(...args: unknown[]) {
 *   if (isArgs(args)) {
 *     const [strings, ...values] = args
 *     // Process template literal
 *   }
 * }
 * tag`Hello ${name}!`
 * ```
 */
export type CallInput = [Tpl, ...unknown[]]

/**
 * Type guard to check if function arguments are from a tagged template literal.
 * @category Template
 * @param value - Function arguments to check
 * @returns True if args are tagged template literal arguments
 * @example
 * ```typescript
 * function tag(...args: unknown[]) {
 *   if (isArgs(args)) {
 *     const [strings, ...values] = args
 *     // Process as template literal
 *   }
 * }
 * tag`Hello ${name}!`
 * ```
 */
export const isCallInput = (value: unknown): value is CallInput => {
  return Array.isArray(value) && is(value[0])
}

export interface Call {
  template: Tpl
  args: unknown[]
}

/**
 * Parse tagged template literal arguments into structured parts and values.
 * @category Template
 * @param callInput - Tagged template literal arguments
 * @returns Object with parts (TemplateStringsArray) and values (unknown[])
 * @example
 * ```typescript
 * function tag(...args: unknown[]) {
 *   if (isArgs(args)) {
 *     const { parts, values } = parse(args)
 *     // parts[0] = "Hello "
 *     // parts[1] = "!"
 *     // values[0] = name
 *   }
 * }
 * tag`Hello ${name}!`
 * ```
 */
export const normalizeCall = (callInput: CallInput): Call => {
  const [template, ...args] = callInput
  return { template, args }
}

/**
 * Render tagged template literal arguments using a custom value renderer.
 * @category Template
 * @param mapper - Function to convert interpolated values to strings
 * @returns Function that takes template args and returns rendered string
 * @example
 * ```typescript
 * // Custom renderer for JSON values
 * const renderJson = renderWith(v => JSON.stringify(v))
 * function tag(...args: unknown[]) {
 *   if (isArgs(args)) return renderJson(args)
 * }
 * tag`Value: ${{ foo: 'bar' }}` // "Value: {\"foo\":\"bar\"}"
 *
 * // Custom renderer that prefixes values
 * const renderPrefixed = renderWith(v => `[${v}]`)
 * ```
 */
export const renderWith = (mapper: (value: unknown) => string) => (callInput: CallInput): string => {
  const call = normalizeCall(callInput)
  return call.template.reduce(
    (result, part, i) => `${result}${part}${i in call.args ? mapper(call.args[i]) : ``}`,
    ``,
  )
}

/**
 * Render tagged template literal arguments to a string.
 * Interpolated values are converted using plain `String()` coercion.
 * @category Template
 * @param args - Tagged template literal arguments
 * @returns Rendered string with all parts and values concatenated
 * @example
 * ```typescript
 * function tag(...args: unknown[]) {
 *   if (isArgs(args)) {
 *     return render(args)
 *   }
 * }
 * tag`Hello ${name}!` // "Hello World!"
 * tag`Count: ${42}` // "Count: 42"
 * ```
 */
export const render = renderWith(String)
