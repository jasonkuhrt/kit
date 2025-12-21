/**
 * Runtime parser for color strings and objects.
 *
 * Provides format detection and conversion of various color representations to RGB.
 * This is a lightweight parser focused on common web color formats.
 *
 * Supported input formats:
 * - Hex: `#FF5733` or `FF5733` (6 hex digits, case-insensitive)
 * - RGB space-separated: `rgb 255 87 51` (values 0-255)
 * - RGB CSS function: `rgb(255, 87, 51)` (CSS-style with commas)
 * - HSL space-separated: `hsl 120 100 50` (hue 0-360, saturation/lightness 0-100)
 * - HSL CSS function: `hsl(120, 100, 50)` (CSS-style with commas)
 * - Named colors: `red`, `blue`, etc. (147 CSS Level 4 named colors, case-insensitive)
 * - Object: `{ r: 255, g: 87, b: 51 }` (direct RGB object)
 *
 * @see https://www.w3.org/TR/css-color-4/ - CSS Color Module Level 4 specification
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value - MDN color value reference
 * @category Color
 */

import { hexToRgb, hslToRgb } from './conversions.js'
import type { ColorRgb } from './named-colors.js'
import { namedColors } from './named-colors.js'

export type ColorInput = string | ColorRgb

/**
 * Parse a color input to RGB format.
 *
 * Attempts to parse the input as various color formats in order:
 * hex → RGB space → RGB func → HSL space → HSL func → named color.
 * Returns null if the input doesn't match any supported format.
 *
 * Note: This parser validates format structure but has lenient value validation.
 * For strict validation with branded types, use {@link Color.String} schema instead.
 *
 * @param input - Color in various formats (hex, RGB, HSL, named, or object)
 * @returns RGB color object with integer values 0-255, or null if parsing fails
 *
 * @example
 * ```typescript
 * parse('#FF5733')              // { r: 255, g: 87, b: 51 }
 * parse('rgb 255 87 51')        // { r: 255, g: 87, b: 51 }
 * parse('rgb(255, 87, 51)')     // { r: 255, g: 87, b: 51 }
 * parse('hsl 120 100 50')       // { r: 0, g: 255, b: 0 }
 * parse('hsl(120, 100, 50)')    // { r: 0, g: 255, b: 0 }
 * parse('red')                  // { r: 255, g: 0, b: 0 }
 * parse({ r: 255, g: 87, b: 51 })  // { r: 255, g: 87, b: 51 }
 * parse('invalid')              // null
 * ```
 *
 * @see https://www.w3.org/TR/css-color-4/#color-syntax - CSS color syntax specification
 */
export const parse = (input: ColorInput): ColorRgb | null => {
  // Object format
  if (typeof input === `object`) {
    return input
  }

  const trimmed = input.trim()

  // Hex format: #FF5733 or FF5733
  const hexMatch = trimmed.match(/^#?([0-9A-Fa-f]{6})$/)
  if (hexMatch) {
    return hexToRgb(trimmed)
  }

  // RGB space-separated: rgb 255 87 51
  const rgbSpaceMatch = trimmed.match(/^rgb\s+(\d+)\s+(\d+)\s+(\d+)$/)
  if (rgbSpaceMatch) {
    const r = Number.parseInt(rgbSpaceMatch[1]!, 10)
    const g = Number.parseInt(rgbSpaceMatch[2]!, 10)
    const b = Number.parseInt(rgbSpaceMatch[3]!, 10)
    // Validate RGB range (0-255)
    if (r > 255 || g > 255 || b > 255) return null
    return { r, g, b }
  }

  // RGB CSS function: rgb(255, 87, 51)
  const rgbFuncMatch = trimmed.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/)
  if (rgbFuncMatch) {
    const r = Number.parseInt(rgbFuncMatch[1]!, 10)
    const g = Number.parseInt(rgbFuncMatch[2]!, 10)
    const b = Number.parseInt(rgbFuncMatch[3]!, 10)
    // Validate RGB range (0-255)
    if (r > 255 || g > 255 || b > 255) return null
    return { r, g, b }
  }

  // HSL space-separated: hsl 120 100 50
  const hslSpaceMatch = trimmed.match(/^hsl\s+(\d+)\s+(\d+)\s+(\d+)$/)
  if (hslSpaceMatch) {
    const h = Number.parseInt(hslSpaceMatch[1]!, 10)
    const s = Number.parseInt(hslSpaceMatch[2]!, 10)
    const l = Number.parseInt(hslSpaceMatch[3]!, 10)
    return hslToRgb(h, s, l)
  }

  // HSL CSS function: hsl(120, 100, 50)
  const hslFuncMatch = trimmed.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/)
  if (hslFuncMatch) {
    const h = Number.parseInt(hslFuncMatch[1]!, 10)
    const s = Number.parseInt(hslFuncMatch[2]!, 10)
    const l = Number.parseInt(hslFuncMatch[3]!, 10)
    return hslToRgb(h, s, l)
  }

  // Named color
  const lowerName = trimmed.toLowerCase()
  if (lowerName in namedColors) {
    return namedColors[lowerName as keyof typeof namedColors]
  }

  // Unknown format
  return null
}
