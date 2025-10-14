import { Str } from '#str'
import type { RenderContext } from './helpers.js'
import { Node } from './node.js'

export class Leaf extends Node {
  value: string
  constructor(value: string) {
    super()
    this.value = value
  }
  render(context: RenderContext) {
    const lines = Str.Visual.wrap(this.value, context.maxWidth ?? 1000)
    const value = lines.join(Str.Char.newline)
    const intrinsicWidth = Math.max(...lines.map((_) => Str.Visual.width(_)))
    const intrinsicHeight = lines.length
    const valueColored = context.color ? context.color(value) : value
    return {
      shape: {
        intrinsicWidth,
        intrinsicHeight,
        desiredWidth: null,
      },
      value: valueColored,
    }
  }
}
