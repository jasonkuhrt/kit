import { Fn } from '../fn/index.js'
import { prepend, prependWith, repeat } from './replace.js'

export const defaultIndentSize = 2

export const characters = {
  space: ` `,
  newline: `\n`,
}

// Lines

export const lines = (text: string) => text.split(characters.newline)

export const unlines = (lines: string[]) => lines.join(characters.newline)

// Indent

export const indent = (text: string, size: number = defaultIndentSize) =>
  unlines(lines(text).map(prependWith(repeat(characters.space, size))))

export const indentOn = (text: string) => (size: number = defaultIndentSize) => indent(text, size)

export const indentWith = Fn.flipCurry(indentOn)
