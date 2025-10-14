export interface RenderContext {
  maxWidth?: undefined | number
  height?: undefined | number
  color?: undefined | ((text: string) => string)
  index: {
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
