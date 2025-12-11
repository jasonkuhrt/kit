/**
 * Maximum width for a single column of text for readability.
 *
 * Text columns beyond 70 characters wide are hard to read.
 * This caps individual column widths regardless of terminal width.
 */
export const MAX_COLUMN_WIDTH = 70

export interface RenderContext {
  maxWidth?: undefined | number
  height?: undefined | number
  index?: {
    total: number
    isLast: boolean
    isFirst: boolean
    position: number
  }
}

export interface Shape {
  intrinsicWidth: number
  intrinsicHeight: number
  desiredWidth: number | null
}
