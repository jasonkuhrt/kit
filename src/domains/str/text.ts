import { Fn } from '#fn'
import { Char } from './char/$.js'
import { prependWith, repeat } from './replace.js'
import { joinWith, splitWith } from './split.js'

/**
 * Default indentation size in characters.
 * @default 2
 */
export const defaultIndentSize = 2

/**
 * Default character used for indentation (non-breaking space).
 */
export const defaultIndentCharacter = Char.spaceNoBreak

/**
 * Default line separator character (newline).
 */
export const defaultLineSeparator = Char.newline

// Lines

/**
 * Split text into an array of lines.
 * Pre-configured {@link splitWith} using newline separator.
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
 * @param text - The text to indent
 * @returns Function that takes size and returns the indented text
 */
export const indentOn = Fn.curry(indent)

/**
 * Curried version of {@link indent} with size first.
 * @param size - Number of spaces to indent
 * @returns Function that takes text and returns the indented text
 * @example
 * ```typescript
 * const indent4 = indentWith(4)
 * indent4('hello\nworld') // '    hello\n    world'
 * ```
 */
export const indentWith = Fn.flipCurried(indentOn)
