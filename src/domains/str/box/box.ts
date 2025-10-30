import { ParseResult, Schema as S } from 'effect'
import { Char } from '../char/_.js'
import { indentBy, lines, unlines } from '../text.js'
import { applyStyle, extractChar, extractStyle } from './ansi.js'
import { AxisHand } from './axishand/_.js'
import { Clockhand } from './clockhand/_.js'
import type { CharStyle, Style, StyledText } from './style.js'

/**
 * Box model utilities for text layout.
 *
 * Provides CSS-like box model operations for text using a structural approach.
 * Build up a Box structure with padding and borders, then encode to string.
 *
 * **Conventions**:
 * - Instance methods with `$` suffix mutate in place and return `this` for chaining
 * - Static methods are immutable and return new Box instances
 *
 * @category Text Formatting
 *
 * @example
 * ```typescript
 * import { Str } from '@wollybeard/kit'
 *
 * // Mutable API (instance methods with $)
 * const box = Str.Box.make({ content: 'Hello' })
 * box.pad$({ top: 1, left: 2 })
 * box.border$({ style: 'single' })
 * console.log(box.toString())
 *
 * // Immutable API (static methods)
 * const box2 = Str.Box.make({ content: 'Hello' })
 * const padded = Str.Box.pad(box2, { top: 1, left: 2 })
 * const bordered = Str.Box.border(padded, { style: 'single' })
 * console.log(bordered.toString())
 *
 * // Reuse styling with different content
 * const styledBox = Str.Box.make({ content: '' })
 *   .pad$({ left: 2 })
 *   .border$({ style: 'double' })
 *
 * styledBox.content$('Message 1')
 * console.log(styledBox.toString())
 *
 * styledBox.content$('Message 2')
 * console.log(styledBox.toString())
 * ```
 */

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Hook Type System
//

/**
 * Context categories available to hooks during rendering.
 * Maps rendering position categories to their available context.
 *
 * @internal
 * @category Text Formatting
 */
type HookContextMap = {
  'border-vertical': { lineIndex: number; totalLines: number; char: string }
  'border-horizontal': { colIndex: number; totalCols: number; char: string }
  'border-corner': { char: string }
  'padding-main': { lineIndex: number; totalLines: number }
  'padding-cross': Record<string, never>
  'margin-main': { lineIndex: number; totalLines: number }
  'margin-cross': Record<string, never>
}

/**
 * Maps style paths to their rendering context category.
 * Defines which context each style position receives during rendering.
 *
 * @internal
 * @category Text Formatting
 */
type StyleCategoryMap = {
  'border.edges.top': 'border-horizontal'
  'border.edges.bottom': 'border-horizontal'
  'border.edges.left': 'border-vertical'
  'border.edges.right': 'border-vertical'
  'border.corners.topLeft': 'border-corner'
  'border.corners.topRight': 'border-corner'
  'border.corners.bottomRight': 'border-corner'
  'border.corners.bottomLeft': 'border-corner'
  'padding.mainStart': 'padding-main'
  'padding.mainEnd': 'padding-main'
  'padding.crossStart': 'padding-cross'
  'padding.crossEnd': 'padding-cross'
  'margin.mainStart': 'margin-main'
  'margin.mainEnd': 'margin-main'
  'margin.crossStart': 'margin-cross'
  'margin.crossEnd': 'margin-cross'
}

/**
 * A value that can be static or computed via hook function.
 *
 * Supports two hook patterns:
 * - Generator: `(ctx) => value` - Compute value from context
 * - Transformer: `(ctx) => (value) => value` - Transform existing value with context
 *
 * @internal
 * @category Text Formatting
 */
type WithHook<$value, $category extends keyof HookContextMap> =
  | $value
  | ((ctx: HookContextMap[$category]) => $value)
  | ((ctx: HookContextMap[$category]) => (value: $value) => $value)

/**
 * Add hook support to an object type based on path prefix.
 * Each property gets hook support with the correct context category.
 *
 * @internal
 * @category Text Formatting
 */
type WithHooks<$obj, $pathPrefix extends string> = {
  [K in keyof $obj]: `${$pathPrefix}.${K & string}` extends keyof StyleCategoryMap
    ? WithHook<$obj[K], StyleCategoryMap[`${$pathPrefix}.${K & string}`]>
    : $obj[K]
}

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Schemas
//

/**
 * Orientation determines the flow direction of the box.
 *
 * - `vertical`: Content flows top-to-bottom (main axis = vertical)
 * - `horizontal`: Content flows left-to-right (main axis = horizontal)
 *
 * @category Text Formatting
 */
export const OrientationSchema = S.Literal('vertical', 'horizontal')

/**
 * Orientation type.
 *
 * @category Text Formatting
 */
export type Orientation = typeof OrientationSchema.Type

/**
 * Padding configuration using logical properties.
 *
 * Logical properties adapt to orientation:
 * - `mainStart`/`mainEnd`: Along the flow direction
 * - `crossStart`/`crossEnd`: Perpendicular to flow
 *
 * @category Text Formatting
 */
export const PaddingSchema = S.Struct({
  /**
   * Padding at the start of the main axis.
   * - Vertical: top
   * - Horizontal: left
   */
  mainStart: S.optional(S.Number),

  /**
   * Padding at the end of the main axis.
   * - Vertical: bottom
   * - Horizontal: right
   */
  mainEnd: S.optional(S.Number),

  /**
   * Padding at the start of the cross axis.
   * - Vertical: left
   * - Horizontal: top
   */
  crossStart: S.optional(S.Number),

  /**
   * Padding at the end of the cross axis.
   * - Vertical: right
   * - Horizontal: bottom
   */
  crossEnd: S.optional(S.Number),
})

/**
 * Padding configuration type.
 *
 * @category Text Formatting
 */
export type Padding = typeof PaddingSchema.Type

/**
 * Padding input accepting AxisHand notation and hook functions.
 *
 * Supports AxisHand patterns:
 * - Single value: `2` → all sides
 * - Axis shorthands: `[2, 4]` → [main, cross]
 * - Binary axis: `[[1, 2], [3, 4]]` → [[mainStart, mainEnd], [crossStart, crossEnd]]
 * - Per-axis arrays: `[[1, 2], 4]` → asymmetric main, symmetric cross
 * - Object: `{ main: [1, 2], cross: 4 }`
 * - With hooks: `{ main: { start: (ctx) => 2 } }`
 *
 * @category Text Formatting
 */
export type PaddingInput = AxisHand.Input | WithHooks<Padding, 'padding'>

/**
 * Margin configuration using logical properties.
 *
 * Logical properties adapt to orientation (same as Padding).
 *
 * @category Text Formatting
 */
export const MarginSchema = S.Struct({
  /**
   * Margin at the start of the main axis (outside border).
   * - Vertical: top
   * - Horizontal: left
   */
  mainStart: S.optional(S.Number),

  /**
   * Margin at the end of the main axis (outside border).
   * - Vertical: bottom
   * - Horizontal: right
   */
  mainEnd: S.optional(S.Number),

  /**
   * Margin at the start of the cross axis (outside border).
   * - Vertical: left
   * - Horizontal: top
   */
  crossStart: S.optional(S.Number),

  /**
   * Margin at the end of the cross axis (outside border).
   * - Vertical: right
   * - Horizontal: bottom
   */
  crossEnd: S.optional(S.Number),
})

/**
 * Margin configuration type.
 *
 * @category Text Formatting
 */
export type Margin = typeof MarginSchema.Type

/**
 * Margin input accepting AxisHand notation and hook functions.
 *
 * Supports AxisHand patterns (same as PaddingInput).
 *
 * @category Text Formatting
 */
export type MarginInput = AxisHand.Input | WithHooks<Margin, 'margin'>

/**
 * Span value type - size in characters or percentage of parent.
 *
 * - `number` (>1): Absolute size in characters
 * - `bigint`: Percentage of parent span (e.g., `50n` = 50%)
 *
 * @category Text Formatting
 */
export type SpanValue = number | bigint

/**
 * Span configuration using logical properties.
 *
 * Defines exact/desired size along each axis:
 * - `main`: Size along flow direction (mainSpan)
 * - `cross`: Size perpendicular to flow (crossSpan)
 *
 * Percentage values (bigint) are resolved relative to parent's available span.
 *
 * @category Text Formatting
 */
export const SpanSchema = S.Struct({
  /**
   * Size along the main axis.
   * - Vertical: height
   * - Horizontal: width
   *
   * Value can be absolute (number) or percentage of parent (bigint).
   */
  main: S.optional(S.Union(S.Number, S.BigIntFromSelf)),

  /**
   * Size along the cross axis.
   * - Vertical: width
   * - Horizontal: height
   *
   * Value can be absolute (number) or percentage of parent (bigint).
   */
  cross: S.optional(S.Union(S.Number, S.BigIntFromSelf)),
})

/**
 * Span configuration type.
 *
 * @category Text Formatting
 */
export type Span = typeof SpanSchema.Type

/**
 * Span input accepting AxisHand notation.
 *
 * Supports AxisHand patterns with SpanValue (number | bigint):
 * - Single value: `80` → main and cross both 80 chars
 * - Single percentage: `50n` → main and cross both 50% of parent
 * - Axis shorthands: `[50n, 80]` → main 50%, cross 80 chars
 * - Binary axis: `[[40, 50n], [80, 100]]` → different start/end (unusual for span)
 * - Object: `{ main: 50n, cross: 80 }`
 *
 * @category Text Formatting
 */
export type SpanInput = AxisHand.Input<SpanValue>

/**
 * Span range constraints (min/max) using logical properties.
 *
 * @category Text Formatting
 */
export const SpanRangeSchema = S.Struct({
  /**
   * Constraints for main axis span.
   */
  main: S.optional(S.Struct({
    min: S.optional(S.Number),
    max: S.optional(S.Number),
  })),

  /**
   * Constraints for cross axis span.
   */
  cross: S.optional(S.Struct({
    min: S.optional(S.Number),
    max: S.optional(S.Number),
  })),
})

/**
 * Span range configuration type.
 *
 * @category Text Formatting
 */
export type SpanRange = typeof SpanRangeSchema.Type

/**
 * Gap configuration using logical properties.
 *
 * Defines space between array items (container property):
 * - Vertical orientation: main=newlines between items, cross=spaces between items
 * - Horizontal orientation: main=spaces between items, cross=newlines between items
 *
 * @category Text Formatting
 */
export const GapSchema = S.Struct({
  /**
   * Gap along the main axis (between items in flow direction).
   * - Vertical: newlines between stacked items
   * - Horizontal: spaces between side-by-side items
   */
  main: S.optional(S.Number),

  /**
   * Gap along the cross axis (perpendicular to flow).
   * - Vertical: spaces between items
   * - Horizontal: newlines between items
   */
  cross: S.optional(S.Number),
})

/**
 * Gap configuration type.
 *
 * @category Text Formatting
 */
export type Gap = typeof GapSchema.Type

/**
 * Gap input accepting number or object with logical properties.
 *
 * - `number`: Same gap on both axes
 * - `{ main?: number, cross?: number }`: Per-axis gaps
 *
 * @category Text Formatting
 */
export type GapInput = number | Gap

/**
 * Border style presets.
 *
 * @category Text Formatting
 */
export const BorderStyleSchema = S.Literal('single', 'double', 'rounded', 'bold', 'ascii')

/**
 * Border style preset type.
 *
 * @category Text Formatting
 */
export type BorderStyle = typeof BorderStyleSchema.Type

/**
 * Border edge characters (physical coordinates).
 *
 * @category Text Formatting
 */
export const BorderEdgesSchema = S.Struct({
  /**
   * Top edge character.
   */
  top: S.optional(S.String),

  /**
   * Right edge character.
   */
  right: S.optional(S.String),

  /**
   * Bottom edge character.
   */
  bottom: S.optional(S.String),

  /**
   * Left edge character.
   */
  left: S.optional(S.String),
})

/**
 * Border edge configuration type.
 *
 * @category Text Formatting
 */
export type BorderEdges = typeof BorderEdgesSchema.Type

/**
 * Border corner characters (physical coordinates).
 *
 * @category Text Formatting
 */
export const BorderCornersSchema = S.Struct({
  /**
   * Top-left corner character.
   */
  topLeft: S.optional(S.String),

  /**
   * Top-right corner character.
   */
  topRight: S.optional(S.String),

  /**
   * Bottom-right corner character.
   */
  bottomRight: S.optional(S.String),

  /**
   * Bottom-left corner character.
   */
  bottomLeft: S.optional(S.String),
})

/**
 * Border corner configuration type.
 *
 * @category Text Formatting
 */
export type BorderCorners = typeof BorderCornersSchema.Type

/**
 * Border edge input supporting Clockhand notation, CharStyle, and hook functions.
 *
 * Supports Clockhand patterns:
 * - Single value: `'─'` → all edges
 * - Single styled: `{ char: '─', color: { foreground: 'blue' } }` → all edges
 * - Array: `['─', '│', '─', '│']` → [top, right, bottom, left]
 * - Object: `{ top: '─', left: '│' }`
 * - Object with CharStyle: `{ top: { char: '─', color: { foreground: 'red' } } }`
 * - With hooks: `{ top: (ctx) => '─' }`
 *
 * @category Text Formatting
 */
export type BorderEdgesInput =
  | Clockhand.Value<string | CharStyle>
  | WithHooks<BorderEdges, 'border.edges'>
  | {
    [K in keyof BorderEdges]?:
      | string
      | CharStyle
      | WithHook<string | undefined, StyleCategoryMap[`border.edges.${K & string}`]>
  }

/**
 * Border corner input supporting Clockhand notation, CharStyle, and hook functions.
 *
 * Supports Clockhand patterns:
 * - Single value: `'+'` → all corners
 * - Single styled: `{ char: '+', color: { foreground: 'yellow' }, bold: true }` → all corners
 * - Array: `['┌', '┐', '┘', '└']` → [topLeft, topRight, bottomRight, bottomLeft] (clockwise)
 * - Object: `{ topLeft: '┌', topRight: '┐' }`
 * - Object with CharStyle: `{ topLeft: { char: '┌', color: { foreground: 'red' }, bold: true } }`
 * - With hooks: `{ topLeft: (ctx) => '┌' }`
 *
 * @category Text Formatting
 */
export type BorderCornersInput =
  | Clockhand.Value<string | CharStyle>
  | WithHooks<BorderCorners, 'border.corners'>
  | {
    [K in keyof BorderCorners]?:
      | string
      | CharStyle
      | WithHook<string | undefined, StyleCategoryMap[`border.corners.${K & string}`]>
  }

/**
 * Border character configuration input with nested edges/corners.
 *
 * @category Text Formatting
 */
export type BorderCharsInput = {
  edges?: BorderEdgesInput
  corners?: BorderCornersInput
}

/**
 * Border configuration.
 *
 * Can specify a preset style, custom edges, custom corners, or a combination.
 * Resolution order: style → edges override → corners override.
 *
 * @category Text Formatting
 */
export const BorderSchema = S.Struct({
  /**
   * Preset border style (provides edges and corners).
   */
  style: S.optional(BorderStyleSchema),

  /**
   * Edge characters (top, right, bottom, left).
   * Overrides edges from style if both are provided.
   */
  edges: S.optional(BorderEdgesSchema),

  /**
   * Corner characters (topLeft, topRight, bottomRight, bottomLeft).
   * Overrides corners from style if both are provided.
   */
  corners: S.optional(BorderCornersSchema),
})

/**
 * Border configuration type.
 *
 * @category Text Formatting
 */
export type Border = typeof BorderSchema.Type

/**
 * Border configuration input with hook support.
 *
 * Supports:
 * - `style`: Preset border style (provides edges and corners)
 * - `edges`: Edge characters (with Clockhand support)
 * - `corners`: Corner characters (with Clockhand support)
 *
 * Resolution order: style → edges/corners override
 *
 * @category Text Formatting
 */
export type BorderInput = {
  style?: BorderStyle
  edges?: BorderEdgesInput
  corners?: BorderCornersInput
}

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Internal Rendering
//

/**
 * Predefined border character sets using physical coordinates.
 * @internal
 */
const borderStyles: Record<BorderStyle, { edges: BorderEdges; corners: BorderCorners }> = {
  single: {
    edges: {
      top: '─',
      right: '│',
      bottom: '─',
      left: '│',
    },
    corners: {
      topLeft: '┌',
      topRight: '┐',
      bottomRight: '┘',
      bottomLeft: '└',
    },
  },
  double: {
    edges: {
      top: '═',
      right: '║',
      bottom: '═',
      left: '║',
    },
    corners: {
      topLeft: '╔',
      topRight: '╗',
      bottomRight: '╝',
      bottomLeft: '╚',
    },
  },
  rounded: {
    edges: {
      top: '─',
      right: '│',
      bottom: '─',
      left: '│',
    },
    corners: {
      topLeft: '╭',
      topRight: '╮',
      bottomRight: '╯',
      bottomLeft: '╰',
    },
  },
  bold: {
    edges: {
      top: '━',
      right: '┃',
      bottom: '━',
      left: '┃',
    },
    corners: {
      topLeft: '┏',
      topRight: '┓',
      bottomRight: '┛',
      bottomLeft: '┗',
    },
  },
  ascii: {
    edges: {
      top: '-',
      right: '|',
      bottom: '-',
      left: '|',
    },
    corners: {
      topLeft: '+',
      topRight: '+',
      bottomRight: '+',
      bottomLeft: '+',
    },
  },
}

/**
 * Maps logical properties to physical operations based on orientation.
 * @internal
 */
const getLogicalMapping = (orientation: Orientation) => {
  return orientation === 'vertical'
    ? {
      newlinesBefore: 'mainStart' as const,
      newlinesAfter: 'mainEnd' as const,
      spacesBeforeLines: 'crossStart' as const,
      spacesAfterLines: 'crossEnd' as const,
    }
    : {
      newlinesBefore: 'crossStart' as const,
      newlinesAfter: 'crossEnd' as const,
      spacesBeforeLines: 'mainStart' as const,
      spacesAfterLines: 'mainEnd' as const,
    }
}

/**
 * Rendering context passed from parent to child during nested box rendering.
 * Contains available space information for resolving percentage-based spans.
 *
 * @internal
 */
type RenderContext = {
  /**
   * Available space along the main axis (from parent box).
   * Used to resolve percentage spans (bigint values).
   */
  availableMainSpan?: number

  /**
   * Available space along the cross axis (from parent box).
   * Used to resolve percentage spans (bigint values).
   */
  availableCrossSpan?: number
}

/**
 * Resolve a span value (number or bigint) to an absolute number.
 *
 * @param value - The span value (number = chars, bigint = percentage)
 * @param availableSpan - Available space from parent
 * @returns Resolved span in characters
 *
 * @internal
 */
const resolveSpanValue = (
  value: number | bigint | undefined,
  availableSpan: number | undefined,
): number | undefined => {
  if (value === undefined) return undefined

  // Bigint = percentage of parent
  if (typeof value === 'bigint') {
    if (availableSpan === undefined) {
      // No parent context - can't resolve percentage
      return undefined
    }
    return Math.floor((availableSpan * Number(value)) / 100)
  }

  // Number = absolute size
  return value
}

/**
 * Enforce span constraints on text content.
 * Applies exact spans and min/max range constraints.
 *
 * @param text - The text content to constrain
 * @param box - The box with span/spanRange configuration
 * @param orientation - Flow direction
 * @param context - Rendering context for resolving percentages
 * @returns Text with enforced span constraints
 *
 * @internal
 */
const enforceSpan = (text: string, box: Box, orientation: Orientation, context: RenderContext): string => {
  let result = text

  // Resolve desired spans
  const desiredMainSpan = box.span ? resolveSpanValue(box.span.main, context.availableMainSpan) : undefined
  const desiredCrossSpan = box.span ? resolveSpanValue(box.span.cross, context.availableCrossSpan) : undefined

  // Get spanRange constraints
  const minMainSpan = box.spanRange?.main?.min
  const maxMainSpan = box.spanRange?.main?.max
  const minCrossSpan = box.spanRange?.cross?.min
  const maxCrossSpan = box.spanRange?.cross?.max

  // Calculate final target spans (priority: exact span → range constraints)
  const textLines = lines(result)
  const intrinsicMainSpan = textLines.length
  const intrinsicCrossSpan = textLines.length === 0 ? 0 : Math.max(...textLines.map((line) => line.length))

  // Main span (height in vertical, width in horizontal)
  let targetMainSpan = desiredMainSpan ?? intrinsicMainSpan
  if (minMainSpan !== undefined && targetMainSpan < minMainSpan) targetMainSpan = minMainSpan
  if (maxMainSpan !== undefined && targetMainSpan > maxMainSpan) targetMainSpan = maxMainSpan

  // Cross span (width in vertical, height in horizontal)
  let targetCrossSpan = desiredCrossSpan ?? intrinsicCrossSpan
  if (minCrossSpan !== undefined && targetCrossSpan < minCrossSpan) targetCrossSpan = minCrossSpan
  if (maxCrossSpan !== undefined && targetCrossSpan > maxCrossSpan) targetCrossSpan = maxCrossSpan

  // Enforce cross span (affects line length)
  if (targetCrossSpan !== intrinsicCrossSpan) {
    result = unlines(
      textLines.map((line) => {
        if (line.length > targetCrossSpan) {
          // Truncate
          return line.slice(0, targetCrossSpan)
        } else if (line.length < targetCrossSpan) {
          // Pad
          return line.padEnd(targetCrossSpan, ' ')
        }
        return line
      }),
    )
  }

  // Enforce main span (affects number of lines)
  if (targetMainSpan !== intrinsicMainSpan) {
    const currentLines = lines(result)
    if (currentLines.length > targetMainSpan) {
      // Truncate lines
      result = unlines(currentLines.slice(0, targetMainSpan))
    } else if (currentLines.length < targetMainSpan) {
      // Add empty lines
      const linesToAdd = targetMainSpan - currentLines.length
      const emptyLine = ' '.repeat(targetCrossSpan)
      result = result + Char.newline + Array(linesToAdd).fill(emptyLine).join(Char.newline)
    }
  }

  return result
}

/**
 * Apply padding to text with hook evaluation.
 * Uses logical properties (mainStart/mainEnd/crossStart/crossEnd).
 * Maps logical properties to physical coordinates based on orientation.
 * @internal
 */
const applyPadding = (text: string, padding: Padding, box: Box, orientation: Orientation): string => {
  let result = text
  const textLines = lines(text)
  const mapping = getLogicalMapping(orientation)

  // Helper to evaluate hooks for a logical property
  const evaluateHooks = (
    key: keyof Padding,
    staticValue: number | undefined,
    lineIndex?: number,
  ): number | undefined => {
    const hooks = (box as any).paddingHooks[key]
    if (!hooks || hooks.length === 0) return staticValue

    const ctx = key === 'mainStart' || key === 'mainEnd'
      ? { lineIndex: lineIndex ?? 0, totalLines: textLines.length }
      : {}

    let value = staticValue
    for (const hook of hooks) {
      const hookResult = hook(ctx)
      value = typeof hookResult === 'function' ? hookResult(value ?? 0) : hookResult
    }
    return value
  }

  // Newlines before
  const before = evaluateHooks(mapping.newlinesBefore, padding[mapping.newlinesBefore])
  if (before) result = Char.newline.repeat(before) + result

  // Spaces before lines
  const leftKey = mapping.spacesBeforeLines
  const leftHooks = (box as any).paddingHooks[leftKey]
  if (padding[leftKey] || (leftHooks && leftHooks.length > 0)) {
    result = unlines(
      lines(result).map((line, i) => {
        const left = evaluateHooks(leftKey, padding[leftKey], i)
        return left ? Char.spaceRegular.repeat(left) + line : line
      }),
    )
  }

  // Spaces after lines
  const rightKey = mapping.spacesAfterLines
  const rightHooks = (box as any).paddingHooks[rightKey]
  if (padding[rightKey] || (rightHooks && rightHooks.length > 0)) {
    result = unlines(
      lines(result).map((line, i) => {
        const right = evaluateHooks(rightKey, padding[rightKey], i)
        return right ? line + Char.spaceRegular.repeat(right) : line
      }),
    )
  }

  // Newlines after
  const after = evaluateHooks(mapping.newlinesAfter, padding[mapping.newlinesAfter])
  if (after) result = result + Char.newline.repeat(after)

  return result
}

/**
 * Apply margin to text with hook evaluation.
 * Uses logical properties (mainStart/mainEnd/crossStart/crossEnd).
 * Maps logical properties to physical coordinates based on orientation.
 * @internal
 */
const applyMargin = (text: string, margin: Margin, box: Box, orientation: Orientation): string => {
  let result = text
  const textLines = lines(text)
  const mapping = getLogicalMapping(orientation)

  // Helper to evaluate hooks for a logical property
  const evaluateHooks = (
    key: keyof Margin,
    staticValue: number | undefined,
    lineIndex?: number,
  ): number | undefined => {
    const hooks = (box as any).marginHooks[key]
    if (!hooks || hooks.length === 0) return staticValue

    const ctx = key === 'mainStart' || key === 'mainEnd'
      ? { lineIndex: lineIndex ?? 0, totalLines: textLines.length }
      : {}

    let value = staticValue
    for (const hook of hooks) {
      const hookResult = hook(ctx)
      value = typeof hookResult === 'function' ? hookResult(value ?? 0) : hookResult
    }
    return value
  }

  // Newlines before
  const before = evaluateHooks(mapping.newlinesBefore, margin[mapping.newlinesBefore])
  if (before) result = Char.newline.repeat(before) + result

  // Spaces before lines
  const leftKey = mapping.spacesBeforeLines
  const leftHooks = (box as any).marginHooks[leftKey]
  if (margin[leftKey] || (leftHooks && leftHooks.length > 0)) {
    result = unlines(
      lines(result).map((line, i) => {
        const left = evaluateHooks(leftKey, margin[leftKey], i)
        return left ? Char.spaceRegular.repeat(left) + line : line
      }),
    )
  }

  // Spaces after lines
  const rightKey = mapping.spacesAfterLines
  const rightHooks = (box as any).marginHooks[rightKey]
  if (margin[rightKey] || (rightHooks && rightHooks.length > 0)) {
    result = unlines(
      lines(result).map((line, i) => {
        const right = evaluateHooks(rightKey, margin[rightKey], i)
        return right ? line + Char.spaceRegular.repeat(right) : line
      }),
    )
  }

  // Newlines after
  const after = evaluateHooks(mapping.newlinesAfter, margin[mapping.newlinesAfter])
  if (after) result = result + Char.newline.repeat(after)

  return result
}

/**
 * Apply border to text with hook evaluation.
 * Supports partial borders - only renders sides that are specified.
 * @internal
 */
const applyBorder = (text: string, border: Border, box: Box): string => {
  // Resolve chars with priority: style → edges/corners override
  let edges: Partial<S.SimplifyMutable<BorderEdges>> = {}
  let corners: Partial<S.SimplifyMutable<BorderCorners>> = {}

  // 1. Start with style if provided (gives all edges and corners)
  if (border.style) {
    edges = { ...borderStyles[border.style].edges }
    corners = { ...borderStyles[border.style].corners }
  }

  // 2. Apply edges override if provided
  if (border.edges) {
    edges = { ...edges, ...border.edges }
  }

  // 3. Apply corners override if provided
  if (border.corners) {
    corners = { ...corners, ...border.corners }
  }

  const textLines = lines(text)
  const maxWidth = textLines.length === 0 ? 0 : Math.max(...textLines.map((line) => line.length))

  // Helper to evaluate edge hooks
  const evaluateEdgeHook = (
    key: keyof BorderEdges,
    staticValue: string | undefined,
    ctx: any,
  ): string | undefined => {
    const hooks = (box as any).borderEdgeHooks?.[key]
    if (!hooks || hooks.length === 0) return staticValue

    // Reduce hooks to get final value
    let value = staticValue
    for (const hook of hooks) {
      const result = hook(ctx)
      if (typeof result === 'function') {
        // Transformer: (ctx) => (value) => value
        value = result(value ?? '')
      } else {
        // Generator: (ctx) => value
        value = result
      }
    }
    return value
  }

  // Helper to evaluate corner hooks
  const evaluateCornerHook = (
    key: keyof BorderCorners,
    staticValue: string | undefined,
    ctx: any,
  ): string | undefined => {
    const hooks = (box as any).borderCornerHooks?.[key]
    if (!hooks || hooks.length === 0) return staticValue

    // Reduce hooks to get final value
    let value = staticValue
    for (const hook of hooks) {
      const result = hook(ctx)
      if (typeof result === 'function') {
        // Transformer: (ctx) => (value) => value
        value = result(value ?? '')
      } else {
        // Generator: (ctx) => value
        value = result
      }
    }
    return value
  }

  // Apply corner hooks
  corners.topLeft = evaluateCornerHook('topLeft', corners.topLeft, { char: corners.topLeft ?? '' })
  corners.topRight = evaluateCornerHook('topRight', corners.topRight, { char: corners.topRight ?? '' })
  corners.bottomLeft = evaluateCornerHook('bottomLeft', corners.bottomLeft, { char: corners.bottomLeft ?? '' })
  corners.bottomRight = evaluateCornerHook('bottomRight', corners.bottomRight, { char: corners.bottomRight ?? '' })

  // Determine which sides have borders
  const hasTop = edges.top !== undefined
  const hasBottom = edges.bottom !== undefined
  const hasLeft = edges.left !== undefined
  const hasRight = edges.right !== undefined

  // Build content lines with left/right borders (may be different per line if hooks exist)
  const contentLines = textLines.map((line, lineIndex) => {
    const paddedLine = line.padEnd(maxWidth, ' ')
    let result = paddedLine

    // Apply left border with hooks
    if (hasLeft || (box as any).borderEdgeHooks?.left) {
      const leftChar = evaluateEdgeHook('left', edges.left, {
        lineIndex,
        totalLines: textLines.length,
        char: edges.left ?? '',
      })
      if (leftChar) {
        const leftStyle = (box as any).borderEdgeStyles?.left
        const styledLeftChar = applyStyle(leftChar, leftStyle)
        result = styledLeftChar + result
      }
    }

    // Apply right border with hooks
    if (hasRight || (box as any).borderEdgeHooks?.right) {
      const rightChar = evaluateEdgeHook('right', edges.right, {
        lineIndex,
        totalLines: textLines.length,
        char: edges.right ?? '',
      })
      if (rightChar) {
        const rightStyle = (box as any).borderEdgeStyles?.right
        const styledRightChar = applyStyle(rightChar, rightStyle)
        result = result + styledRightChar
      }
    }

    return result
  })

  // Build top border with hooks (character may change per column)
  const topBorder = hasTop || (box as any).borderEdgeHooks?.top
    ? (() => {
      let line = ''
      // Left corner
      if ((hasLeft || (box as any).borderEdgeHooks?.left) && corners.topLeft) {
        const topLeftStyle = (box as any).borderCornerStyles?.topLeft
        const styledTopLeft = applyStyle(corners.topLeft, topLeftStyle)
        line += styledTopLeft
      }
      // Top chars (may be different per column if hooks exist)
      const topStyle = (box as any).borderEdgeStyles?.top
      for (let colIndex = 0; colIndex < maxWidth; colIndex++) {
        const topChar = evaluateEdgeHook('top', edges.top, {
          colIndex,
          totalCols: maxWidth,
          char: edges.top ?? '',
        })
        const styledTopChar = applyStyle(topChar ?? '', topStyle)
        line += styledTopChar
      }
      // Right corner
      if ((hasRight || (box as any).borderEdgeHooks?.right) && corners.topRight) {
        const topRightStyle = (box as any).borderCornerStyles?.topRight
        const styledTopRight = applyStyle(corners.topRight, topRightStyle)
        line += styledTopRight
      }
      return line || null
    })()
    : null

  // Build bottom border with hooks (character may change per column)
  const bottomBorder = hasBottom || (box as any).borderEdgeHooks?.bottom
    ? (() => {
      let line = ''
      // Left corner
      if ((hasLeft || (box as any).borderEdgeHooks?.left) && corners.bottomLeft) {
        const bottomLeftStyle = (box as any).borderCornerStyles?.bottomLeft
        const styledBottomLeft = applyStyle(corners.bottomLeft, bottomLeftStyle)
        line += styledBottomLeft
      }
      // Bottom chars (may be different per column if hooks exist)
      const bottomStyle = (box as any).borderEdgeStyles?.bottom
      for (let colIndex = 0; colIndex < maxWidth; colIndex++) {
        const bottomChar = evaluateEdgeHook('bottom', edges.bottom, {
          colIndex,
          totalCols: maxWidth,
          char: edges.bottom ?? '',
        })
        const styledBottomChar = applyStyle(bottomChar ?? '', bottomStyle)
        line += styledBottomChar
      }
      // Right corner
      if ((hasRight || (box as any).borderEdgeHooks?.right) && corners.bottomRight) {
        const bottomRightStyle = (box as any).borderCornerStyles?.bottomRight
        const styledBottomRight = applyStyle(corners.bottomRight, bottomRightStyle)
        line += styledBottomRight
      }
      return line || null
    })()
    : null

  return [topBorder, ...contentLines, bottomBorder].filter((line) => line !== null).join(Char.newline)
}

/**
 * Render content (string, styled text, or array of these/boxes) to a string.
 * @internal
 */
const renderContent = (
  content: string | StyledText | readonly (string | StyledText | Box)[],
  orientation: Orientation,
  context: RenderContext,
  gap?: Gap,
): string => {
  // If content is a string, return it directly
  if (typeof content === 'string') {
    return content
  }

  // If content is StyledText, apply styling
  if (!Array.isArray(content) && 'text' in content) {
    return applyStyle(content.text, content)
  }

  // Array of items - render each recursively
  const renderedItems = content.map((item) => {
    if (typeof item === 'string') return item
    if ('text' in item) return applyStyle(item.text, item)
    return renderBox(item, context)
  })

  // Join based on orientation
  if (orientation === 'vertical') {
    // Vertical: stack items top-to-bottom
    // gap.main = newlines between items
    const mainGap = gap?.main ?? 0
    const separator = Char.newline.repeat(1 + mainGap)
    return renderedItems.join(separator)
  } else {
    // Horizontal: place items side-by-side
    // gap.main = spaces between items
    const mainGap = gap?.main ?? 0
    const gapColumn = Char.spaceRegular.repeat(mainGap)

    // For side-by-side rendering, we need to:
    // 1. Split each item into lines
    // 2. Pad lines to equal height
    // 3. Concatenate corresponding lines horizontally (with gap)
    const itemLines = renderedItems.map((item) => lines(item))
    const maxHeight = Math.max(...itemLines.map((lines) => lines.length), 0)
    const itemWidths = itemLines.map((lines) => Math.max(...lines.map((line) => line.length), 0))

    // Build result line by line
    const resultLines: string[] = []
    for (let lineIndex = 0; lineIndex < maxHeight; lineIndex++) {
      const lineParts: string[] = []
      for (let itemIndex = 0; itemIndex < itemLines.length; itemIndex++) {
        const itemLine = itemLines[itemIndex]![lineIndex] ?? ''
        // Pad to item width for alignment
        lineParts.push(itemLine.padEnd(itemWidths[itemIndex]!, ' '))
      }
      // Join with gap
      resultLines.push(lineParts.join(gapColumn))
    }

    return unlines(resultLines)
  }
}

/**
 * Render a box structure to a string.
 * @internal
 */
const renderBox = (box: Box, context: RenderContext = {}): string => {
  // Get orientation (default to vertical)
  const orientation = box.orientation ?? 'vertical'

  // Render content (may be string or nested boxes) with gap
  let result = renderContent(box.content, orientation, context, box.gap)

  // Enforce span constraints (exact size or range constraints)
  if (box.span || box.spanRange) {
    result = enforceSpan(result, box, orientation, context)
  }

  // Apply layers from inside out: content → gap → span → padding → border → margin
  if (box.padding) {
    result = applyPadding(result, box.padding, box, orientation)
  }

  if (box.border) {
    result = applyBorder(result, box.border, box)
  }

  if (box.margin) {
    result = applyMargin(result, box.margin, box, orientation)
  }

  return result
}

//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Box Class
//

/**
 * Content type for Box - can be a string, styled text, or array of these and boxes.
 *
 * Supports:
 * - Plain strings: `'Hello'`
 * - Styled text: `{ text: 'Hello', color: { foreground: 'red' }, bold: true }`
 * - Arrays: `['Header', { text: 'Body', color: { foreground: 'green' } }, Box.make(...)]`
 *
 * @category Text Formatting
 */
export type BoxContent = string | StyledText | readonly (string | StyledText | Box)[]

/**
 * Box structure with content and optional styling.
 *
 * @category Text Formatting
 */
export class Box extends S.Class<Box>('Box')({
  /**
   * Content of the box - can be a string or array of strings/boxes for composition.
   * Schema uses S.Unknown to avoid circular reference, but TypeScript type is properly constrained.
   */
  content: S.Unknown,

  /**
   * Flow direction of the box.
   * - `vertical`: Main axis flows top-to-bottom (default)
   * - `horizontal`: Main axis flows left-to-right
   *
   * Determines how logical properties map to physical coordinates:
   * - Vertical: mainStart→top, mainEnd→bottom, crossStart→left, crossEnd→right
   * - Horizontal: mainStart→left, mainEnd→right, crossStart→top, crossEnd→bottom
   */
  orientation: S.optional(OrientationSchema),

  /**
   * Padding around the content (inside border).
   */
  padding: S.optional(PaddingSchema),

  /**
   * Border around the padded content.
   */
  border: S.optional(BorderSchema),

  /**
   * Margin around the box (outside border).
   */
  margin: S.optional(MarginSchema),

  /**
   * Exact/desired size along each axis.
   *
   * Uses logical properties (main/cross) that adapt to orientation:
   * - Vertical: main=height, cross=width
   * - Horizontal: main=width, cross=height
   *
   * Values can be absolute (number) or percentage of parent (bigint).
   */
  span: S.optional(SpanSchema),

  /**
   * Size constraints (min/max) along each axis.
   *
   * Applied after span resolution to enforce bounds.
   */
  spanRange: S.optional(SpanRangeSchema),

  /**
   * Space between array items (container property).
   *
   * Uses logical properties (main/cross):
   * - Vertical: main=newlines, cross=spaces
   * - Horizontal: main=spaces, cross=newlines
   */
  gap: S.optional(GapSchema),
}) {
  // Hook storage (private, not part of schema)
  private paddingHooks: Partial<Record<keyof Padding, Array<(ctx: any) => number | ((v: number) => number)>>> = {}
  private marginHooks: Partial<Record<keyof Margin, Array<(ctx: any) => number | ((v: number) => number)>>> = {}
  private borderEdgeHooks: Partial<Record<keyof BorderEdges, Array<(ctx: any) => string | ((v: string) => string)>>> =
    {}
  private borderCornerHooks: Partial<
    Record<keyof BorderCorners, Array<(ctx: any) => string | ((v: string) => string)>>
  > = {}
  // Style storage for CharStyle (colors/modifiers for borders)
  private borderEdgeStyles: Partial<Record<keyof BorderEdges, Style>> = {}
  private borderCornerStyles: Partial<Record<keyof BorderCorners, Style>> = {}

  /**
   * Convert box to string representation.
   *
   * @returns The formatted string
   */
  override toString(): string {
    return renderBox(this)
  }

  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Instance Methods (Mutable)
  //

  /**
   * Change the content of a box (mutates in place).
   *
   * **Mutation**: This method modifies the box and returns it for chaining.
   *
   * @param content - New content for the box (string or array of strings/boxes)
   * @returns The same box (for chaining)
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: '' })
   *   .pad$({ left: 2 })
   *   .border$({ style: 'single' })
   *
   * // Reuse style with different content
   * box.content$('Hello')
   * console.log(box.toString())
   *
   * box.content$('Goodbye')
   * console.log(box.toString())
   *
   * // Use nested boxes
   * box.content$([
   *   'Header',
   *   Box.make({ content: 'Body' }).pad$([1, 2]),
   *   'Footer'
   * ])
   * console.log(box.toString())
   * ```
   */
  content$(content: string | Array<string | Box>): this {
    // Cast to any for mutation - Box type is readonly from Schema
    ;(this as any).content = content
    return this
  }

  /**
   * Add padding to a box (mutates in place).
   *
   * **Mutation**: This method modifies the box and returns it for chaining.
   *
   * Accepts AxisHand notation or object form with logical properties:
   * - `pad$(2)` - all sides
   * - `pad$([2, 4])` - [main, cross]
   * - `pad$([[1, 2], [3, 4]])` - [[mainStart, mainEnd], [crossStart, crossEnd]]
   * - `pad$({ main: [1, 2], cross: 4 })` - object with per-axis arrays
   * - `pad$({ mainStart: 1, crossStart: 2 })` - explicit logical properties
   * - `pad$({ mainStart: (ctx) => 2 })` - with hooks
   *
   * @param padding - Padding configuration
   * @returns The same box (for chaining)
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   * box.pad$([2, 4])  // AxisHand shorthand: [main, cross]
   * box.pad$({ mainStart: (ctx) => ctx.lineIndex + 1 })  // Dynamic
   * console.log(box.toString())
   * ```
   */
  pad$(padding: PaddingInput): this {
    // Handle AxisHand notation (number or array)
    if (typeof padding === 'number' || Array.isArray(padding)) {
      // Cast to any for mutation - Box type is readonly from Schema
      ;(this as any).padding = AxisHand.parse(padding)
      return this
    }

    // Handle object form with possible hooks
    const staticValues: Partial<S.SimplifyMutable<Padding>> = {}
    for (const key of ['mainStart', 'mainEnd', 'crossStart', 'crossEnd'] as const) {
      const value = (padding as any)[key]
      if (value !== undefined) {
        if (typeof value === 'function') {
          // Store hook
          if (!this.paddingHooks[key]) this.paddingHooks[key] = []
          this.paddingHooks[key]!.push(value)
        } else {
          // Store static value
          staticValues[key] = value
        }
      }
    } // Cast to any for mutation - Box type is readonly from Schema

    ;(this as any).padding = staticValues
    return this
  }

  /**
   * Add margin to a box (mutates in place).
   *
   * **Mutation**: This method modifies the box and returns it for chaining.
   *
   * Accepts AxisHand notation (same patterns as pad$).
   * Also supports hook functions for dynamic values.
   *
   * @param margin - Margin configuration
   * @returns The same box (for chaining)
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   *   .border$({ style: 'single' })
   *   .margin$([2, 4])  // AxisHand shorthand: [main, cross]
   *   .margin$({ mainStart: (ctx) => 3 })  // Dynamic margin
   * console.log(box.toString())
   * ```
   */
  margin$(margin: MarginInput): this {
    // Handle AxisHand notation (number or array)
    if (typeof margin === 'number' || Array.isArray(margin)) {
      // Cast to any for mutation - Box type is readonly from Schema
      ;(this as any).margin = AxisHand.parse(margin)
      return this
    }

    // Handle object form with possible hooks
    const staticValues: Partial<S.SimplifyMutable<Margin>> = {}
    for (const key of ['mainStart', 'mainEnd', 'crossStart', 'crossEnd'] as const) {
      const value = (margin as any)[key]
      if (value !== undefined) {
        if (typeof value === 'function') {
          // Store hook
          if (!this.marginHooks[key]) this.marginHooks[key] = []
          this.marginHooks[key]!.push(value)
        } else {
          // Store static value
          staticValues[key] = value
        }
      }
    } // Cast to any for mutation - Box type is readonly from Schema

    ;(this as any).margin = staticValues
    return this
  }

  /**
   * Add a border to a box (mutates in place).
   *
   * **Mutation**: This method modifies the box and returns it for chaining.
   *
   * @param border - Border configuration (style, edges, corners, or combination)
   * @returns The same box (for chaining)
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   *
   * // Use a preset style
   * box.border$({ style: 'single' })
   *
   * // Use custom edges and corners
   * box.border$({
   *   edges: ['─', '│', '─', '│'],      // Clockhand: [top, right, bottom, left]
   *   corners: ['┌', '┐', '┘', '└']     // Clockhand: [topLeft, topRight, bottomRight, bottomLeft]
   * })
   *
   * // Combine style with overrides
   * box.border$({
   *   style: 'single',
   *   edges: { top: '=' },               // Override just top edge
   *   corners: { topLeft: '╔' }          // Override just top-left corner
   * })
   *
   * // Use hooks for dynamic borders
   * box.border$({
   *   style: 'single',
   *   edges: {
   *     left: (ctx) => ctx.lineIndex === 0 ? '├' : '│'
   *   }
   * })
   * ```
   */
  border$(border: BorderInput): this {
    const staticBorder: S.SimplifyMutable<Border> = {}

    // Handle style (always static)
    if (border.style) {
      staticBorder.style = border.style
    }

    // Handle edges (can be Clockhand, object with hooks, or object)
    if (border.edges !== undefined) {
      // Handle Clockhand notation (string or array)
      if (typeof border.edges === 'string' || Array.isArray(border.edges)) {
        // Clockhand returns strings or CharStyle - need to extract
        const parsed = Clockhand.parse(border.edges)
        const staticEdges: Partial<S.SimplifyMutable<BorderEdges>> = {}
        for (const key of ['top', 'right', 'bottom', 'left'] as const) {
          const value = parsed[key]
          if (value !== undefined) {
            const char = extractChar(value)
            const style = extractStyle(value)
            staticEdges[key] = char
            if (style) this.borderEdgeStyles[key] = style
          }
        }
        staticBorder.edges = staticEdges
      } else {
        // Handle object form with possible hooks or CharStyle
        const staticEdges: Partial<S.SimplifyMutable<BorderEdges>> = {}
        for (const key of ['top', 'right', 'bottom', 'left'] as const) {
          const value = (border.edges as any)[key]
          if (value !== undefined) {
            if (typeof value === 'function') {
              // Store hook
              if (!this.borderEdgeHooks[key]) this.borderEdgeHooks[key] = []
              this.borderEdgeHooks[key]!.push(value)
            } else {
              // Extract char and style (handles both string and CharStyle)
              const char = extractChar(value)
              const style = extractStyle(value)
              staticEdges[key] = char
              if (style) this.borderEdgeStyles[key] = style
            }
          }
        }
        if (Object.keys(staticEdges).length > 0) {
          staticBorder.edges = staticEdges
        }
      }
    }

    // Handle corners (can be Clockhand, object with hooks, or object)
    if (border.corners !== undefined) {
      // Handle Clockhand notation (string or array)
      if (typeof border.corners === 'string' || Array.isArray(border.corners)) {
        // Parse with Clockhand (gives top/right/bottom/left), then remap to corner names
        // Clockwise corners: topLeft, topRight, bottomRight, bottomLeft
        const parsed = Clockhand.parse(border.corners)
        const staticCorners: Partial<S.SimplifyMutable<BorderCorners>> = {}
        const cornerMap = {
          top: 'topLeft' as const,
          right: 'topRight' as const,
          bottom: 'bottomRight' as const,
          left: 'bottomLeft' as const,
        }
        for (const [clockKey, cornerKey] of Object.entries(cornerMap)) {
          const value = (parsed as any)[clockKey]
          if (value !== undefined) {
            const char = extractChar(value)
            const style = extractStyle(value)
            staticCorners[cornerKey] = char
            if (style) this.borderCornerStyles[cornerKey] = style
          }
        }
        staticBorder.corners = staticCorners
      } else {
        // Handle object form with possible hooks or CharStyle
        const staticCorners: Partial<S.SimplifyMutable<BorderCorners>> = {}
        for (const key of ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'] as const) {
          const value = (border.corners as any)[key]
          if (value !== undefined) {
            if (typeof value === 'function') {
              // Store hook
              if (!this.borderCornerHooks[key]) this.borderCornerHooks[key] = []
              this.borderCornerHooks[key]!.push(value)
            } else {
              // Extract char and style (handles both string and CharStyle)
              const char = extractChar(value)
              const style = extractStyle(value)
              staticCorners[key] = char
              if (style) this.borderCornerStyles[key] = style
            }
          }
        }
        if (Object.keys(staticCorners).length > 0) {
          staticBorder.corners = staticCorners
        }
      }
    } // Cast to any for mutation - Box type is readonly from Schema

    ;(this as any).border = staticBorder
    return this
  }

  /**
   * Set box span (exact/desired size) (mutates in place).
   *
   * **Mutation**: This method modifies the box and returns it for chaining.
   *
   * Accepts AxisHand notation with bigint support for percentages:
   * - `span$(80)` - 80 chars on both axes
   * - `span$(50n)` - 50% of parent on both axes
   * - `span$([50n, 80])` - main: 50% of parent, cross: 80 chars
   * - `span$({ main: 100, cross: 50n })` - main: 100 chars, cross: 50%
   *
   * @param span - Span configuration (number = chars, bigint = percentage)
   * @returns The same box (for chaining)
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   * box.span$([50n, 80])  // main: 50% of parent, cross: 80 chars
   * console.log(box.toString())
   * ```
   */
  span$(span: SpanInput): this {
    // Parse AxisHand notation (supports bigint)
    // Cast to any for mutation - Box type is readonly from Schema
    ;(this as any).span = AxisHand.parse<SpanValue>(span)
    return this
  }

  /**
   * Set box span range constraints (min/max) (mutates in place).
   *
   * **Mutation**: This method modifies the box and returns it for chaining.
   *
   * @param spanRange - Span range constraints per axis
   * @returns The same box (for chaining)
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   * box.spanRange$({ main: { max: 10 }, cross: { min: 5, max: 20 } })
   * console.log(box.toString())
   * ```
   */
  spanRange$(spanRange: SpanRange): this {
    // Cast to any for mutation - Box type is readonly from Schema
    ;(this as any).spanRange = spanRange
    return this
  }

  /**
   * Set gap between array items (mutates in place).
   *
   * **Mutation**: This method modifies the box and returns it for chaining.
   *
   * Gap is space between items in array content:
   * - Vertical: main=newlines, cross=spaces
   * - Horizontal: main=spaces, cross=newlines
   *
   * @param gap - Gap configuration (number or object)
   * @returns The same box (for chaining)
   *
   * @example
   * ```typescript
   * const box = Box.make({
   *   content: ['Item 1', 'Item 2', 'Item 3']
   * })
   * box.gap$(2)  // 2 newlines between items (vertical)
   * box.gap$({ main: 2 })  // Same as above
   * console.log(box.toString())
   * ```
   */
  gap$(gap: GapInput): this {
    // Handle number shorthand
    if (typeof gap === 'number') {
      // Cast to any for mutation - Box type is readonly from Schema
      ;(this as any).gap = { main: gap, cross: gap }
      return this
    } // Handle object form
    // Cast to any for mutation - Box type is readonly from Schema

    ;(this as any).gap = gap
    return this
  }

  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Static Methods (Immutable)
  //

  /**
   * Change the content of a box (returns new Box).
   *
   * **Immutable**: This method returns a new Box instance.
   *
   * @param box - The box to modify
   * @param content - New content for the box (string or array of strings/boxes)
   * @returns A new Box with the updated content
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   * const box2 = Box.content(box, 'Goodbye')
   * // box is unchanged, box2 has new content
   *
   * // Use nested boxes
   * const box3 = Box.content(box, [
   *   'Header',
   *   Box.make({ content: 'Body' }).pad$([1, 2]),
   *   'Footer'
   * ])
   * ```
   */
  static content(box: Box, content: string | Array<string | Box>): Box {
    return Box.make({
      content,
      orientation: box.orientation,
      padding: box.padding,
      border: box.border,
      margin: box.margin,
    })
  }

  /**
   * Add padding to a box (returns new Box).
   *
   * **Immutable**: This method returns a new Box instance.
   *
   * Accepts CSS clockhand notation and hooks (same as pad$).
   *
   * @param box - The box to modify
   * @param padding - Padding configuration
   * @returns A new Box with the padding applied
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   * const padded = Box.pad(box, [2, 4])
   * // box is unchanged, padded has padding
   * ```
   */
  static pad(box: Box, padding: PaddingInput): Box {
    const newBox = Box.make({
      content: box.content,
      orientation: box.orientation,
      border: box.border,
      margin: box.margin,
    })
    newBox.pad$(padding)
    return newBox
  }

  /**
   * Add margin to a box (returns new Box).
   *
   * **Immutable**: This method returns a new Box instance.
   *
   * Accepts CSS clockhand notation and hooks (same as margin$).
   *
   * @param box - The box to modify
   * @param margin - Margin configuration
   * @returns A new Box with the margin applied
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   * const margined = Box.margin(box, [2, 4])
   * // box is unchanged, margined has margin
   * ```
   */
  static margin(box: Box, margin: MarginInput): Box {
    const newBox = Box.make({
      content: box.content,
      orientation: box.orientation,
      padding: box.padding,
      border: box.border,
    })
    newBox.margin$(margin)
    return newBox
  }

  /**
   * Add a border to a box (returns new Box).
   *
   * **Immutable**: This method returns a new Box instance.
   *
   * @param box - The box to modify
   * @param border - Border configuration
   * @returns A new Box with the border applied
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   * const bordered = Box.border(box, { style: 'single' })
   * // box is unchanged, bordered has border
   * ```
   */
  static border(box: Box, border: BorderInput): Box {
    const newBox = Box.make({
      content: box.content,
      orientation: box.orientation,
      padding: box.padding,
      margin: box.margin,
    })
    newBox.border$(border)
    return newBox
  }

  /**
   * Set box span (exact/desired size) (returns new Box).
   *
   * **Immutable**: This method returns a new Box instance.
   *
   * Accepts AxisHand notation with bigint support for percentages:
   * - `span(box, 80)` - 80 chars on both axes
   * - `span(box, 50n)` - 50% of parent on both axes
   * - `span(box, [50n, 80])` - main: 50% of parent, cross: 80 chars
   * - `span(box, { main: 100, cross: 50n })` - main: 100 chars, cross: 50%
   *
   * @param box - The box to modify
   * @param span - Span configuration (number = chars, bigint = percentage)
   * @returns A new Box with the span applied
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   * const sized = Box.span(box, [50n, 80])  // main: 50% of parent, cross: 80 chars
   * // box is unchanged, sized has span
   * ```
   */
  static span(box: Box, span: SpanInput): Box {
    const newBox = Box.make({
      content: box.content,
      orientation: box.orientation,
      padding: box.padding,
      border: box.border,
      margin: box.margin,
      spanRange: box.spanRange,
      gap: box.gap,
    })
    newBox.span$(span)
    return newBox
  }

  /**
   * Set box span range constraints (min/max) (returns new Box).
   *
   * **Immutable**: This method returns a new Box instance.
   *
   * @param box - The box to modify
   * @param spanRange - Span range constraints per axis
   * @returns A new Box with the span range applied
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   * const constrained = Box.spanRange(box, { main: { max: 10 }, cross: { min: 5, max: 20 } })
   * // box is unchanged, constrained has span range
   * ```
   */
  static spanRange(box: Box, spanRange: SpanRange): Box {
    const newBox = Box.make({
      content: box.content,
      orientation: box.orientation,
      padding: box.padding,
      border: box.border,
      margin: box.margin,
      span: box.span,
      gap: box.gap,
    })
    newBox.spanRange$(spanRange)
    return newBox
  }

  /**
   * Set gap between array items (returns new Box).
   *
   * **Immutable**: This method returns a new Box instance.
   *
   * Gap is space between items in array content:
   * - Vertical: main=newlines, cross=spaces
   * - Horizontal: main=spaces, cross=newlines
   *
   * @param box - The box to modify
   * @param gap - Gap configuration (number or object)
   * @returns A new Box with the gap applied
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: ['Item 1', 'Item 2', 'Item 3'] })
   * const spaced = Box.gap(box, 2)  // 2 newlines between items (vertical)
   * // box is unchanged, spaced has gap
   * ```
   */
  static gap(box: Box, gap: GapInput): Box {
    const newBox = Box.make({
      content: box.content,
      orientation: box.orientation,
      padding: box.padding,
      border: box.border,
      margin: box.margin,
      span: box.span,
      spanRange: box.spanRange,
    })
    newBox.gap$(gap)
    return newBox
  }

  /**
   * Encode a Box to a formatted string (alias for toString).
   *
   * @param box - The box to render
   * @returns The formatted string representation
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' })
   *   .pad$({ top: 1, left: 2 })
   *   .border$({ style: 'single' })
   *
   * const result = Box.encode(box)
   * // Same as: box.toString()
   * ```
   */
  static encode(box: Box): string {
    return box.toString()
  }

  //
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ String Codec
  //

  /**
   * Schema for encoding Box to string representation.
   *
   * This is a one-way transformation - boxes can be encoded to strings,
   * but cannot be decoded from strings.
   *
   * @example
   * ```typescript
   * const box = Box.make({ content: 'Hello' }).pad$({ left: 2 })
   *
   * // Encode to string
   * const str = S.encodeSync(Box.String)(box)
   *
   * // Cannot decode from string (throws Forbidden error)
   * S.decodeSync(Box.String)('...')  // Error!
   * ```
   */
  static String = S.transformOrFail(
    Box,
    S.String,
    {
      strict: true,
      decode: (box) => ParseResult.succeed(renderBox(box as any)),
      encode: (_input, _options, ast) =>
        ParseResult.fail(
          new ParseResult.Forbidden(
            ast,
            _input,
            'Cannot encode string back to Box - decoding is one-way only',
          ),
        ),
    },
  )
}

// Override Box type to properly constrain content field
export interface Box {
  readonly content: BoxContent
}
