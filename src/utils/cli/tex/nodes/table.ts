import { Arr } from '#arr'
import { Str } from '#str'
import type { Block } from './block.js'
import type { RenderContext } from './helpers.js'
import { Node } from './node.js'

/**
 * Table layout and separator configuration.
 *
 * @category CLI/Text Rendering
 */
export interface TableParameters {
  /**
   * Separators between rows and columns.
   */
  separators?: {
    /**
     * Row separator string.
     * - `string` - Character(s) repeated across table width between rows
     * - `null` - No separator, just a newline
     * - `undefined` - Default separator (`'-'`)
     *
     * @example
     * ```typescript
     * // Dash separator (default)
     * { row: '-' }
     *
     * // No separator
     * { row: null }
     *
     * // Custom separator
     * { row: '=' }
     * ```
     */
    row?: string | null

    /**
     * Column separator string placed between cells.
     *
     * @default `' | '`
     *
     * @example
     * ```typescript
     * // Pipe separator (default)
     * { column: ' | ' }
     *
     * // Space separator
     * { column: ' ' }
     *
     * // Tab separator
     * { column: '\t' }
     * ```
     */
    column?: string
  }
}

export class Table extends Node {
  rows: Block[][]
  headers: Block[]
  parameters: TableParameters
  constructor(rows?: Block[][]) {
    super()
    this.rows = rows ?? []
    this.headers = []
    this.parameters = {}
  }
  setParameters(parameters: TableParameters) {
    this.parameters = parameters
    return this
  }
  render(context: RenderContext) {
    const separators = {
      column: this.parameters.separators?.column ?? ` ${Str.Char.pipe} `,
      row: (width: number) => {
        const separator = this.parameters.separators?.row === undefined ? `-` : this.parameters.separators?.row
        if (separator === null) {
          return Str.Char.newline
        }
        return `${Str.Char.newline}${separator.repeat(width)}${Str.Char.newline}`
      },
    }
    // Render all cells
    const rows = this.rows.map((row) => {
      return row.map((cell, index) => {
        return cell.render({
          color: context.color,
          maxWidth: context.maxWidth,
          height: context.height,
          index: {
            total: row.length,
            isFirst: index === 0,
            isLast: index === row.length - 1,
            position: index,
          },
        }).value
      })
    })
    const headers = this.headers.map((cell) => cell.render(context).value)
    const rowsAndHeaders = this.headers.length > 0 ? [headers, ...rows] : rows
    const maxWidthOfEachColumn = Arr.transpose(rowsAndHeaders).map((col) =>
      Math.max(...col.flatMap(Str.lines).map((_) => Str.Visual.width(_)))
    )
    const rowsWithCellWidthsNormalized = rowsAndHeaders.map((row) => {
      const maxNumberOfLinesAmongColumns = Math.max(...row.map(Str.lines).map((lines) => lines.length))
      const row_ = row.map((col) => {
        const numberOfLines = Str.lines(col).length
        if (numberOfLines < maxNumberOfLinesAmongColumns) {
          return col + Str.Char.newline.repeat(maxNumberOfLinesAmongColumns - numberOfLines)
        }
        return col
      })
      const row__ = row_.map((col, i) =>
        Str.mapLines(col, (line) => Str.Visual.pad(line, maxWidthOfEachColumn[i] ?? 0, `right`))
      )
      return row__
    })
    const rowsWithCellsJoined = rowsWithCellWidthsNormalized.map((r) =>
      Str.Visual.Table.render(Arr.transpose(r.map(Str.lines)), { separator: separators.column, align: `left` })
    )
    const width = Math.max(...rowsWithCellsJoined.flatMap(Str.lines).map((_) => Str.Visual.width(_)))
    const value = rowsWithCellsJoined.join(separators.row(width))

    return {
      shape: {
        intrinsicWidth: 0,
        intrinsicHeight: 0,
        desiredWidth: 0,
      },
      value: value,
    }
  }
}
