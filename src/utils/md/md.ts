/**
 * Markdown rendering utilities.
 *
 * Provides utilities for generating markdown content programmatically,
 * with a focus on documentation generation and VitePress compatibility.
 */

/**
 * Wrap text in inline code backticks.
 */
export const inlineCode = (text: string): string => {
  return `\`${text}\``
}

/**
 * Create a markdown link.
 */
export const link = (text: string, url: string): string => {
  return `[${text}](${url})`
}

/**
 * Create a bold inline code link (e.g., for namespace/export names).
 */
export const boldCodeLink = (text: string, url: string): string => {
  return `[**${inlineCode(text)}**](${url})`
}

/**
 * Create a markdown heading.
 */
export const heading = (level: number, text: string): string => {
  return `${'#'.repeat(level)} ${text}`
}

/**
 * Create a code fence with optional language and modifiers.
 */
export const codeFence = (code: string, language = 'typescript', modifiers?: string): string => {
  const fence = modifiers ? `${language} ${modifiers}` : language
  return `\`\`\`${fence}\n${code}\n\`\`\``
}

/**
 * Create a VitePress code group with multiple tabs.
 *
 * @example
 * codeGroup([
 *   { label: 'npm', code: 'npm install foo', language: 'bash' },
 *   { label: 'pnpm', code: 'pnpm add foo', language: 'bash' }
 * ])
 */
export const codeGroup = (
  tabs: Array<{ label: string; code: string; language?: string; modifiers?: string }>,
): string => {
  const blocks = tabs.map((tab) => {
    const lang = tab.language || 'typescript'
    const fence = tab.modifiers ? `${lang} ${tab.modifiers} [${tab.label}]` : `${lang} [${tab.label}]`
    return `\`\`\`${fence}\n${tab.code}\n\`\`\``
  })

  return `::: code-group\n\n${blocks.join('\n\n')}\n\n:::`
}

/**
 * Create a VitePress custom container (warning, tip, etc.).
 */
export const container = (type: 'warning' | 'tip' | 'info' | 'danger', title: string, content: string): string => {
  return `:::${type} ${title}\n${content}\n:::`
}

/**
 * Create a deprecation warning with proper link conversion.
 */
export const deprecation = (message: string): string => {
  return container('warning', 'DEPRECATED', convertJSDocLinks(message))
}

/**
 * Create an unordered list item.
 */
export const listItem = (text: string, level = 0): string => {
  const indent = '  '.repeat(level)
  return `${indent}- ${text}`
}

/**
 * Create a sub-text annotation (smaller font).
 */
export const sub = (text: string): string => {
  return `<sub>${text}</sub>`
}

/**
 * Convert JSDoc {@link ...} tags to markdown links.
 *
 * Patterns:
 * - {@link Identifier} → [`Identifier`](url)
 * - {@link Identifier description} → [description](url)
 *
 * For Effect library references (String.*, Array.*, etc.), links to Effect documentation.
 */
export const convertJSDocLinks = (text: string): string => {
  return text.replace(/\{@link\s+([^\s}]+)(?:\s+([^}]+))?\}/g, (_, identifier: string, description?: string) => {
    // Detect Effect library references (e.g., String.trim, Array.join)
    let url: string | undefined
    const effectMatch = identifier.match(/^(String|Array|Number|Boolean|Object|ReadonlyArray)\.([\w]+)$/)
    if (effectMatch && effectMatch[1] && effectMatch[2]) {
      const module = effectMatch[1]
      const method = effectMatch[2]
      // Link to Effect documentation
      url = `https://effect.website/docs/reference/effect/${module}/#${method.toLowerCase()}`
    }

    if (description) {
      return url ? link(description, url) : `[${description}](${identifier})`
    }
    return url ? link(inlineCode(identifier), url) : inlineCode(identifier)
  })
}

/**
 * Demote markdown headings by adding a specified number of levels.
 *
 * This is used to ensure JSDoc descriptions don't break the document hierarchy.
 * For example, if an export is h3, its description headings should be h4+.
 *
 * @param markdown - The markdown content to transform
 * @param levels - Number of heading levels to add (e.g., 2 transforms ## to ####)
 * @returns Transformed markdown with demoted headings
 */
export const demoteHeadings = (markdown: string, levels: number): string => {
  if (!markdown || levels === 0) return markdown

  // Add 'levels' number of # to each heading
  const prefix = '#'.repeat(levels)

  // Replace headings while preserving content and whitespace
  // Matches: start of line, one or more #, space, content
  return markdown.replace(/^(#+)(\s)/gm, `$1${prefix}$2`)
}

/**
 * Join markdown sections with double newlines, filtering out empty sections.
 */
export const sections = (...parts: (string | false | undefined | null)[]): string => {
  return parts.filter(Boolean).join('\n\n')
}

/**
 * Convert string to kebab-case.
 */
export const kebab = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}
