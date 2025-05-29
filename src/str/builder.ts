import { Fn } from '#fn/index.js'
import { Null } from '#null/index.js'
import { trimSpaceRegular } from './replace.js'
import { isTemplateStringsArray } from './template.js'
import { unlines } from './text.js'

export const defaultRender = unlines

export interface Builder {
  (...linesInput: LinesInput): Builder
  (strings: TemplateStringsArray, ...values: string[]): Builder
  state: State
  render: () => string
  toString(): string
}

export type LinesInput = (Line | null)[]

export type Lines = Line[]

export type Line = string

export interface State {
  lines: Lines
}

export const Builder = (): Builder => {
  const state: State = {
    lines: [],
  }

  const builder = ((...args: unknown[]) => {
    if (isTemplateStringsArray(args)) {
      // Usage as template string

      const strings = args[0] as string
      const values = args.slice(1) as string[]

      let code = ``
      for (const string of strings) {
        code += string
        if (values.length > 0) {
          code += values.shift()!
        }
      }

      state.lines.push(trimSpaceRegular(code))
    } else {
      // Usage as function

      const linesInput = args as LinesInput
      const isEmptyInput = linesInput.length === 0

      if (isEmptyInput) {
        state.lines.push(``)
      } else {
        const lines = linesInput.filter(Null.isnt).map(trimSpaceRegular)
        state.lines.push(...lines)
      }
    }

    return builder
  }) as Builder

  builder.state = state

  builder.render = Fn.bind(defaultRender, state.lines)

  builder.toString = builder.render

  return builder
}
