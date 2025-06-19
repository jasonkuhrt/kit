import type { Json } from '#json/index.js'
import { Obj } from '#obj/index.js'

/**
 * Interpolate variables into a template string using ${variable} syntax.
 * @param template - Template string containing ${variable} placeholders
 * @returns Function that takes args object and returns interpolated string
 * @example
 * ```typescript
 * const greeting = interpolate('Hello ${name}, you are ${age} years old')
 * greeting({ name: 'John', age: 25 }) // 'Hello John, you are 25 years old'
 *
 * const template = interpolate('${greeting} ${name}!')
 * template({ greeting: 'Hi', name: 'Alice' }) // 'Hi Alice!'
 * ```
 */
export const interpolate = (template: string) => (args: TemplateArgs) => {
  const get = Obj.getOn(args)
  return template.replace(templateVariablePattern, (_, parameterName: string) => {
    return String(get(parameterName))
  })
}

/**
 * Regular expression pattern to match template variables in ${variable} format.
 * Captures the variable name inside the braces.
 */
export const templateVariablePattern = /\${([^}]+)}/g

/**
 * Arguments object for template interpolation.
 * Maps variable names to their JSON-serializable values.
 */
export type TemplateArgs = Record<string, Json.Value>

/**
 * Type guard to check if a value is a TemplateStringsArray.
 * Used to detect when a function is called as a tagged template literal.
 * @param args - Value to check
 * @returns True if args is a TemplateStringsArray
 * @example
 * ```typescript
 * function tag(...args: unknown[]) {
 *   if (isTemplateStringsArray(args)) {
 *     // Called as tag`template`
 *   } else {
 *     // Called as tag()
 *   }
 * }
 * ```
 */
export const isTemplateStringsArray = (args: unknown): args is TemplateStringsArray => {
  return Array.isArray(args) && args.length > 0 && args[0] instanceof Object && `raw` in args[0] as any
}
