/**
 * Markdown string utilities for code documentation.
 *
 * @module
 */

/**
 * Wrap value in markdown inline code (backticks).
 *
 * @example
 * ```ts
 * code('hello') // '`hello`'
 * code('Array<T>') // '`Array<T>`'
 * ```
 */
export const code = (value: string): string => `\`${value}\``

/**
 * Create a markdown inline link.
 *
 * If text is not provided, the URL is used as both the link text and target.
 *
 * @example
 * ```ts
 * link('https://example.com')
 * // '[https://example.com](https://example.com)'
 *
 * link('https://example.com', 'Example')
 * // '[Example](https://example.com)'
 * ```
 */
export const link = (url: string, text?: string): string => {
  return text ? `[${text}](${url})` : `[${url}](${url})`
}

/**
 * Generate a markdown table from key-value pairs.
 *
 * Automatically filters out undefined and null values.
 * Returns empty string if no valid entries remain after filtering.
 *
 * @example
 * ```ts
 * table({
 *   'Name': 'Alice',
 *   'Age': '30',
 *   'City': undefined  // filtered out
 * })
 * // | | |
 * // | - | - |
 * // | **Name** | Alice |
 * // | **Age** | 30 |
 * ```
 */
export const table = (rows: Record<string, string | undefined | null>): string => {
  const entries = Object.entries(rows).filter(([_, value]) => value !== undefined && value !== null)
  if (entries.length === 0) return ''

  const lines: string[] = []
  lines.push(`| | |`)
  lines.push(`| - | - |`)
  for (const [key, value] of entries) {
    lines.push(`| **${key}** | ${value} |`)
  }
  return lines.join('\n')
}
