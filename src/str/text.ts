import { Fn } from '#fn/index.js'
import { Char } from './char/index.js'
import { prependWith, repeat } from './replace.js'
import { joinWith, splitWith } from './split.js'

export const defaultIndentSize = 2
export const defaultIndentCharacter = Char.spaceNoBreak
export const defaultLineSeparator = Char.newline

// Lines

export const lines = splitWith(defaultLineSeparator)

export const unlines = joinWith(defaultLineSeparator)

// Indent

export const indent = (text: string, size?: number | undefined) => {
  const result = unlines(lines(text).map(prependWith(repeat(defaultIndentCharacter, size ?? defaultIndentSize))))
  return result
}

export const indentOn = Fn.curry(indent)

export const indentWith = Fn.flipCurried(indentOn)
