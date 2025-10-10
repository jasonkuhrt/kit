import { Fn } from '#fn'
import { Char } from './char/$.js'
import { prependWith, repeat } from './replace.js'
import { joinWith, splitWith } from './split.js'

/**
 * Default indentation size in characters.
 * @category Text Formatting
 * @default 2
 */
export const defaultIndentSize = 2

/**
 * Default character used for indentation (non-breaking space).
 * @category Text Formatting
 */
export const defaultIndentCharacter = Char.spaceNoBreak

/**
 * Default line separator character (newline).
 * @category Text Formatting
 */
export const defaultLineSeparator = Char.newline

// Lines

/**
 * Split text into an array of lines.
 * Pre-configured {@link splitWith} using newline separator.
 * @category Text Formatting
 * @param text - The text to split into lines
 * @returns Array of lines
 * @example
 * ```typescript
 * lines('hello\nworld\n!') // ['hello', 'world', '!']
 * lines('single line') // ['single line']
 * ```
 */
export const lines = splitWith(defaultLineSeparator)

/**
 * Join an array of lines into text.
 * Pre-configured {@link joinWith} using newline separator.
 * @category Text Formatting
 * @param lines - Array of lines to join
 * @returns The joined text
 * @example
 * ```typescript
 * unlines(['hello', 'world', '!']) // 'hello\nworld\n!'
 * unlines(['single line']) // 'single line'
 * ```
 */
export const unlines = joinWith(defaultLineSeparator)

// Indent

/**
 * Indent each line of text by a specified number of spaces.
 * @category Text Formatting
 * @param text - The text to indent
 * @param size - Number of spaces to indent (default: {@link defaultIndentSize})
 * @returns The indented text
 * @example
 * ```typescript
 * indent('hello\nworld') // '  hello\n  world'
 * indent('line1\nline2', 4) // '    line1\n    line2'
 * ```
 */
export const indent = (text: string, size?: number | undefined) => {
  const result = unlines(lines(text).map(prependWith(repeat(defaultIndentCharacter, size ?? defaultIndentSize))))
  return result
}

/**
 * Curried version of {@link indent} with text first.
 * @category Text Formatting
 * @param text - The text to indent
 * @returns Function that takes size and returns the indented text
 */
export const indentOn = Fn.curry(indent)

/**
 * Curried version of {@link indent} with size first.
 * @category Text Formatting
 * @param size - Number of spaces to indent
 * @returns Function that takes text and returns the indented text
 * @example
 * ```typescript
 * const indent4 = indentWith(4)
 * indent4('hello\nworld') // '    hello\n    world'
 * ```
 */
export const indentWith = Fn.flipCurried(indentOn)

/**
 * Remove common leading whitespace from all lines.
 * Finds the minimum indentation across all non-empty lines and removes that amount from every line.
 * This is useful for dedenting code blocks or template strings while preserving relative indentation.
 * @category Text Formatting
 * @param text - The text to dedent
 * @returns The dedented text
 * @example
 * ```typescript
 * stripIndent('    line1\n      line2\n    line3')
 * // 'line1\n  line2\nline3'
 *
 * stripIndent('  code\n    nested\n  code')
 * // 'code\n  nested\ncode'
 *
 * // Empty lines are ignored when calculating minimum indent
 * stripIndent('    line1\n\n    line2')
 * // 'line1\n\nline2'
 * ```
 */
export const stripIndent = (text: string): string => {
  const textLines = lines(text)

  // Find minimum indentation from non-empty lines
  const indents = textLines
    .filter((line) => line.trim().length > 0) // Skip empty lines
    .map((line) => {
      const match = line.match(/^(\s*)/)
      return match?.[1]?.length ?? 0
    })

  // If no non-empty lines, return original text
  if (indents.length === 0) return text

  const minIndent = Math.min(...indents)

  // Remove the minimum indentation from each line
  return unlines(textLines.map((line) => line.slice(minIndent)))
}
