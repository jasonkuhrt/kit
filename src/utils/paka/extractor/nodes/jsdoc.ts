import { JSDoc, Node } from 'ts-morph'
import type { Example } from '../../schema.js'

/**
 * Parsed JSDoc information.
 */
export type JSDocInfo = {
  description: string | undefined
  examples: Example[]
  deprecated: string | undefined
  tags: Record<string, string>
}

/**
 * Parse JSDoc from a declaration node.
 *
 * @param decl - The declaration node to extract JSDoc from
 * @returns Parsed JSDoc information
 */
export const parseJSDoc = (decl: Node): JSDocInfo => {
  const jsDocs = decl.getChildrenOfKind(Node.isJSDoc as any) as JSDoc[]

  if (jsDocs.length === 0) {
    return {
      description: undefined,
      examples: [],
      deprecated: undefined,
      tags: {},
    }
  }

  // Use the first JSDoc block (closest to declaration)
  const jsDoc = jsDocs[0]!
  const description = jsDoc.getDescription().trim() || undefined

  const examples: Example[] = []
  const tags: Record<string, string> = {}
  let deprecated: string | undefined

  for (const tag of jsDoc.getTags()) {
    const tagName = tag.getTagName()
    const tagText = tag.getCommentText()?.trim() || ''

    if (tagName === 'example') {
      const example = parseExample(tagText)
      if (example) {
        examples.push(example)
      }
    } else if (tagName === 'deprecated') {
      deprecated = tagText
    } else {
      tags[tagName] = tagText
    }
  }

  return {
    description,
    examples,
    deprecated,
    tags,
  }
}

/**
 * Parse an @example tag into an Example object.
 *
 * Supports:
 * - @example Basic usage
 * - @example-twoslash Disabled example
 * - Code fence detection
 */
const parseExample = (text: string): any | null => {
  // Extract title from first line if present
  const lines = text.split('\n')
  let title: string | undefined
  let codeStart = 0

  // Check if first line is a title (not a code fence)
  if (lines[0] && !lines[0].startsWith('```')) {
    title = lines[0].trim()
    codeStart = 1
  }

  // Find code fence
  const fenceMatch = text.match(/```(\w+)?\s*([^\n]*)\n([\s\S]*?)```/)
  if (!fenceMatch) {
    // No code fence - treat entire text as code
    const code = lines.slice(codeStart).join('\n').trim()
    return code
      ? {
        code,
        title,
        twoslashEnabled: true,
        language: 'typescript',
      }
      : null
  }

  const [, language = 'typescript', fenceMeta = '', code = ''] = fenceMatch

  // Check for twoslash disable in fence metadata or code
  const twoslashDisabled = fenceMeta.includes('twoslash=false')
    || code.includes('// twoslash-disable')
    || code.includes('// @twoslash-disable')

  return {
    code: code.trim(),
    title,
    twoslashEnabled: !twoslashDisabled,
    language,
  }
}
