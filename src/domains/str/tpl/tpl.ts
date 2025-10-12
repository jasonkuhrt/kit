import { Prox } from '#prox'
import { stripIndent } from '../text.js'

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
  return Array.isArray(value) && `raw` in value
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

/**
 * A passthrough tagged template literal that returns the interpolated string as-is.
 * Useful for semantic clarity in code without any processing.
 * @category Template
 * @param strings - Template string parts
 * @param values - Interpolated values
 * @returns The composed string with values interpolated
 * @example
 * ```typescript
 * const template = passthrough
 * const message = template`Hello ${name}, you have ${count} items.`
 * // Result: "Hello Alice, you have 5 items."
 * ```
 */
export const passthrough = (strings: TemplateStringsArray, ...values: unknown[]): string => {
  return render([strings, ...values])
}

/**
 * Tagged template literal that removes common indentation from all lines.
 * Automatically indents multi-line interpolated values to match their context.
 *
 * Uses the raw template strings to preserve escape sequences (e.g., `\n` stays as backslash-n).
 * Trims leading and trailing blank lines from the result.
 *
 * @category Template
 * @param strings - Template string parts (uses raw strings to preserve escapes)
 * @param values - Interpolated values
 * @returns Dedented string with common indentation removed
 * @example
 * ```typescript
 * const code = dedent`
 *   function greet() {
 *     console.log('Hello')
 *   }
 * `
 * // Result: "function greet() {\n  console.log('Hello')\n}"
 * ```
 * @example
 * ```typescript
 * // Multi-line values are auto-indented
 * const inner = 'line1\nline2'
 * const code = dedent`
 *   outer:
 *     ${inner}
 * `
 * // Result: "outer:\n  line1\n  line2"
 * ```
 * @example
 * ```typescript
 * // Escape sequences are preserved
 * const path = dedent`
 *   C:\Users\name\Documents
 * `
 * // Result: "C:\\Users\\name\\Documents" (backslashes preserved)
 * ```
 */
export const dedent = (strings: TemplateStringsArray, ...values: unknown[]): string => {
  const raw = strings.raw

  // Build the interpolated string first
  let result = ``
  for (let i = 0; i < raw.length; i++) {
    result += raw[i]

    if (i < values.length) {
      const value = String(values[i])

      // If value contains newlines, indent subsequent lines to match current position
      if (value.includes(`\n`)) {
        // Find the indentation of the current line (last line in result so far)
        const lines = result.split(`\n`)
        const currentLine = lines[lines.length - 1]
        const match = currentLine.match(/^(\s*)/)
        const indent = match ? match[1] : ``

        // Add value with indented continuation lines
        const valueLines = value.split(`\n`)
        result += valueLines
          .map((line, index) => (index === 0 ? line : indent + line))
          .join(`\n`)
      } else {
        result += value
      }
    }
  }

  // Strip common indentation using existing utility
  const dedented = stripIndent(result)

  // Trim leading and trailing blank lines/whitespace
  return dedented.replace(/^\n+/, ``).replace(/\s+$/, ``)
}

/**
 * Type for a tagged template literal function used for syntax highlighting.
 * @category Template
 */
export type HighlightTag = typeof passthrough

/**
 * Object containing language-specific template tag functions for syntax highlighting.
 * Each property is a tagged template function that provides editor syntax highlighting
 * for that language (when supported by the editor).
 *
 * Implemented as a Proxy that returns the same passthrough function for all properties,
 * allowing destructuring and property access to work seamlessly.
 *
 * Supported languages are based on common supported editor injection patterns:
 *
 * @see {@link https://github.com/zed-industries/zed/blob/main/crates/languages/src/typescript/injections.scm Zed Editor - TypeScript Injections}
 * @see {@link https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide VS Code - Syntax Highlighting Guide}
 *
 * @category Template
 * @example
 * ```typescript
 * import { Str } from '@wollybeard/kit'
 *
 * const { ts, html, sql } = Str.Tpl.highlight
 *
 * const code = ts`
 *   export const add = (a: number, b: number) => a + b
 * ` // Gets TypeScript syntax highlighting in editor
 *
 * const markup = html`
 *   <div class="container">Hello</div>
 * ` // Gets HTML syntax highlighting
 *
 * const query = sql`
 *   SELECT * FROM users WHERE id = ${userId}
 * ` // Gets SQL syntax highlighting
 * ```
 */
export const highlight: {
  /**
   * Passthrough template literal with TypeScript syntax highlighting.
   * @example
   * ```typescript
   * const { ts } = Str.Tpl.highlight
   * const code = ts`
   *   export const add = (a: number, b: number): number => {
   *     return a + b
   *   }
   * `
   * ```
   */
  ts: HighlightTag
  /**
   * Passthrough template literal with JavaScript syntax highlighting.
   * @example
   * ```typescript
   * const { js } = Str.Tpl.highlight
   * const code = js`
   *   function greet(name) {
   *     return 'Hello ' + name
   *   }
   * `
   * ```
   */
  js: HighlightTag
  /**
   * Passthrough template literal with HTML syntax highlighting.
   * @example
   * ```typescript
   * const { html } = Str.Tpl.highlight
   * const markup = html`
   *   <div class="container">
   *     <h1>Welcome</h1>
   *     <p>Hello ${user.name}</p>
   *   </div>
   * `
   * ```
   */
  html: HighlightTag
  /**
   * Passthrough template literal with CSS syntax highlighting.
   * @example
   * ```typescript
   * const { css } = Str.Tpl.highlight
   * const styles = css`
   *   .button {
   *     background: hotpink;
   *     border-radius: 4px;
   *   }
   * `
   * ```
   */
  css: HighlightTag
  /**
   * Passthrough template literal with SQL syntax highlighting.
   * @example
   * ```typescript
   * const { sql } = Str.Tpl.highlight
   * const query = sql`
   *   SELECT id, name, email
   *   FROM users
   *   WHERE status = 'active'
   *   ORDER BY created_at DESC
   * `
   * ```
   */
  sql: HighlightTag
  /**
   * Passthrough template literal with JSON syntax highlighting.
   * @example
   * ```typescript
   * const { json } = Str.Tpl.highlight
   * const data = json`
   *   {
   *     "name": "Alice",
   *     "age": 30,
   *     "active": true
   *   }
   * `
   * ```
   */
  json: HighlightTag
  /**
   * Passthrough template literal with YAML syntax highlighting.
   * @example
   * ```typescript
   * const { yaml } = Str.Tpl.highlight
   * const config = yaml`
   *   name: my-app
   *   version: 1.0.0
   *   dependencies:
   *     - react
   *     - typescript
   * `
   * ```
   */
  yaml: HighlightTag
  /**
   * Passthrough template literal with YAML syntax highlighting (alias for `yaml`).
   * @example
   * ```typescript
   * const { yml } = Str.Tpl.highlight
   * const config = yml`
   *   port: 3000
   *   host: localhost
   * `
   * ```
   */
  yml: HighlightTag
  /**
   * Passthrough template literal with GraphQL syntax highlighting.
   * @example
   * ```typescript
   * const { graphql } = Str.Tpl.highlight
   * const query = graphql`
   *   query GetUser($id: ID!) {
   *     user(id: $id) {
   *       name
   *       email
   *     }
   *   }
   * `
   * ```
   */
  graphql: HighlightTag
  /**
   * Passthrough template literal with GraphQL syntax highlighting (alias for `graphql`).
   * @example
   * ```typescript
   * const { gql } = Str.Tpl.highlight
   * const mutation = gql`
   *   mutation UpdateUser($id: ID!, $name: String!) {
   *     updateUser(id: $id, name: $name) {
   *       id
   *     }
   *   }
   * `
   * ```
   */
  gql: HighlightTag
  /**
   * Passthrough template literal with Isograph syntax highlighting.
   * @example
   * ```typescript
   * const { iso } = Str.Tpl.highlight
   * const query = iso`
   *   field User.name
   *   field User.email
   * `
   * ```
   */
  iso: HighlightTag
} = Prox.createCachedGetProxy(() => passthrough)
