import { isTemplateStringsArray } from './base.js'

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

      state.lines.push(code.trim())
    } else {
      // Usage as function

      const linesInput = args as LinesInput
      const isEmptyInput = linesInput.length === 0

      if (isEmptyInput) {
        state.lines.push(``)
      } else {
        const lines = linesInput.filter(_ => _ !== null).map(_ => _.trim())
        state.lines.push(...lines)
      }
    }

    return builder
  }) as Builder

  builder.state = state

  builder.render = () => render(state.lines)

  builder.toString = builder.render

  return builder
}

export const separator = `\n`

export const render = (lines: Lines) => {
  return lines.join(separator)
}
