/**
 * HTML entity constants for escaping special characters.
 */
const ENTITY_QUOT = `&quot;`
const ENTITY_AMP = `&amp;`
const ENTITY_APOS = `&#39;`
const ENTITY_LT = `&lt;`
const ENTITY_GT = `&gt;`

/**
 * Regex to test if string contains characters that need HTML escaping.
 */
const escapeRE = /["'&<>]/

/**
 * Escape HTML special characters to prevent XSS vulnerabilities.
 *
 * Converts the following characters to their HTML entity equivalents:
 * - `"` → `&quot;`
 * - `'` → `&#39;`
 * - `&` → `&amp;`
 * - `<` → `&lt;`
 * - `>` → `&gt;`
 *
 * @param string - The string to escape (will be coerced to string if not already)
 * @returns The escaped string safe for use in HTML
 *
 * @example
 * ```ts
 * escape('Use Array<T> or Record<K, V>')
 * // => 'Use Array&lt;T&gt; or Record&lt;K, V&gt;'
 *
 * escape('<script>alert("xss")</script>')
 * // => '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export const escape = (string: unknown): string => {
  const str = String(string)
  const match = escapeRE.exec(str)

  // Fast path: no characters to escape
  if (!match) {
    return str
  }

  let html = ``
  let escaped: string
  let index: number
  let lastIndex = 0

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escaped = ENTITY_QUOT
        break
      case 38: // &
        escaped = ENTITY_AMP
        break
      case 39: // '
        escaped = ENTITY_APOS
        break
      case 60: // <
        escaped = ENTITY_LT
        break
      case 62: // >
        escaped = ENTITY_GT
        break
      default:
        continue
    }

    if (lastIndex !== index) {
      html += str.slice(lastIndex, index)
    }

    lastIndex = index + 1
    html += escaped
  }

  return lastIndex !== index ? html + str.slice(lastIndex, index) : html
}
