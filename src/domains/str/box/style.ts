/**
 * Color and style types for Box terminal output.
 *
 * Provides ANSI color and style modifier support for Box borders and content.
 * Colors are declarative (data, not functions) for serializability, but can
 * be computed dynamically via hooks.
 *
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#SGR - ANSI SGR codes
 * @category Text Formatting
 */

import { ColorInput as ColorInputSchema } from '#color/color'

/**
 * Color input type - string (named, hex, rgb, hsl) or RGB object.
 * Uses the Encoded type to accept input formats (string | RGB object).
 */
type ColorInput = typeof ColorInputSchema.Encoded

/**
 * ANSI color targets for terminal output.
 *
 * Standard SGR (Select Graphic Rendition) color codes support three color targets:
 * - foreground: Text color
 * - background: Background color behind text
 * - underlineColor: Underline color (when underline style is active)
 *
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#Colors - ANSI color codes
 * @category Text Formatting
 */
export interface ColorTargets {
  /**
   * Text foreground color.
   * Standard ANSI SGR codes 30-37 (8 colors), 90-97 (bright), or 38;5;n/38;2;r;g;b (extended).
   */
  foreground?: ColorInput

  /**
   * Text background color.
   * Standard ANSI SGR codes 40-47 (8 colors), 100-107 (bright), or 48;5;n/48;2;r;g;b (extended).
   */
  background?: ColorInput

  /**
   * Underline color (when underline is active).
   * Modern terminal feature, may not be supported everywhere.
   * Uses ANSI SGR code 58;2;r;g;b or 58;5;n.
   */
  underlineColor?: ColorInput
}

/**
 * ANSI style modifiers for text appearance.
 *
 * These are boolean flags that enable various text styling effects.
 * Support varies by terminal - modern terminals support most, but some
 * (like blink) are rarely implemented.
 *
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#SGR - ANSI SGR codes
 * @category Text Formatting
 */
export interface StyleModifiers {
  /**
   * Bold or bright text (SGR code 1).
   * Often rendered as brighter colors on some terminals.
   */
  bold?: boolean

  /**
   * Dimmed or faint text (SGR code 2).
   * Reduces color intensity.
   */
  dim?: boolean

  /**
   * Italic text (SGR code 3).
   * May be rendered as inverse or underline on terminals without italic support.
   */
  italic?: boolean

  /**
   * Underlined text (SGR code 4).
   * Single underline beneath text.
   */
  underline?: boolean

  /**
   * Strikethrough text (SGR code 9).
   * Line through the middle of text.
   */
  strikethrough?: boolean

  /**
   * Blinking text (SGR code 5 or 6).
   * Rarely supported in modern terminals.
   */
  blink?: boolean

  /**
   * Inverted colors (SGR code 7).
   * Swaps foreground and background colors.
   */
  inverse?: boolean

  /**
   * Hidden text (SGR code 8).
   * Makes text invisible (same color as background).
   * Useful for passwords or masking.
   */
  hidden?: boolean
}

/**
 * Combined color and style configuration.
 *
 * This is the base for both character styling (borders) and text styling (content).
 * Combines color targets with style modifiers.
 *
 * @category Text Formatting
 */
export interface Style extends StyleModifiers {
  /**
   * Color configuration for foreground, background, and underline.
   */
  color?: ColorTargets
}

/**
 * A styled character for borders.
 *
 * Extends a single character with optional color and style modifiers.
 * Used for border edges and corners to enable colored, styled borders.
 *
 * @example
 * ```typescript
 * // Simple colored border character
 * const edge: CharStyle = {
 *   char: '─',
 *   color: { foreground: 'blue' }
 * }
 *
 * // Bold colored corner
 * const corner: CharStyle = {
 *   char: '┌',
 *   color: { foreground: 'red' },
 *   bold: true
 * }
 * ```
 *
 * @category Text Formatting
 */
export interface CharStyle extends Style {
  /**
   * The character to render.
   */
  char: string
}

/**
 * Styled text content.
 *
 * Extends a text string with optional color and style modifiers.
 * Used for Box content to enable colored, styled text.
 *
 * @example
 * ```typescript
 * // Simple colored text
 * const text: StyledText = {
 *   text: 'Hello World',
 *   color: { foreground: 'green' }
 * }
 *
 * // Bold error message
 * const error: StyledText = {
 *   text: 'Error: File not found',
 *   color: { foreground: 'red' },
 *   bold: true
 * }
 * ```
 *
 * @category Text Formatting
 */
export interface StyledText extends Style {
  /**
   * The text content to render.
   */
  text: string
}

/**
 * Border edge value - string (character only) or CharStyle (with colors/styles).
 *
 * Backwards compatible with existing string-based borders.
 *
 * @category Text Formatting
 */
export type BorderEdgeValue = string | CharStyle

/**
 * Border corner value - string (character only) or CharStyle (with colors/styles).
 *
 * Backwards compatible with existing string-based borders.
 *
 * @category Text Formatting
 */
export type BorderCornerValue = string | CharStyle
