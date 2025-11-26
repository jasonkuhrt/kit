/**
 * Color conversion utilities for transforming between different color formats.
 *
 * Supports conversions between hex, RGB, and HSL color spaces.
 *
 * @see https://en.wikipedia.org/wiki/Web_colors - Overview of web color formats
 * @see https://www.w3.org/TR/css-color-4/ - CSS Color Module Level 4 specification
 * @category Color
 */

import type { ColorRgb } from './named-colors.js'

/**
 * Convert a hex color string to RGB.
 *
 * Hex colors use base-16 (hexadecimal) notation where each pair of digits
 * represents the red, green, and blue components respectively.
 *
 * @param hex - Hex color string with or without # prefix (e.g., '#FF5733' or 'FF5733')
 * @returns RGB color object with r, g, b values (0-255)
 *
 * @example
 * ```typescript
 * hexToRgb('#FF5733')  // { r: 255, g: 87, b: 51 }
 * hexToRgb('FF5733')   // { r: 255, g: 87, b: 51 }
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Web_colors#Hex_triplet - Hex color notation
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color - MDN hex color reference
 */
export const hexToRgb = (hex: string): ColorRgb => {
  // Remove # prefix if present
  const cleanHex = hex.startsWith(`#`) ? hex.slice(1) : hex

  // Parse hex string to RGB values
  const r = Number.parseInt(cleanHex.slice(0, 2), 16)
  const g = Number.parseInt(cleanHex.slice(2, 4), 16)
  const b = Number.parseInt(cleanHex.slice(4, 6), 16)

  return { r, g, b }
}

/**
 * Convert HSL color values to RGB.
 *
 * HSL (Hue, Saturation, Lightness) is a cylindrical color model that describes
 * colors in terms of their hue angle, saturation percentage, and lightness percentage.
 * This is often more intuitive for color manipulation than RGB.
 *
 * Uses the standard HSL to RGB conversion algorithm as specified in CSS Color Module Level 4.
 *
 * @param h - Hue (0-360 degrees) - Color angle on the color wheel
 * @param s - Saturation (0-100 percent) - Color intensity (0 = gray, 100 = full color)
 * @param l - Lightness (0-100 percent) - Brightness (0 = black, 50 = pure color, 100 = white)
 * @returns RGB color object with r, g, b values (0-255)
 *
 * @example
 * ```typescript
 * hslToRgb(0, 100, 50)    // { r: 255, g: 0, b: 0 } (red)
 * hslToRgb(120, 100, 50)  // { r: 0, g: 255, b: 0 } (green)
 * hslToRgb(240, 100, 50)  // { r: 0, g: 0, b: 255 } (blue)
 * ```
 *
 * @see https://en.wikipedia.org/wiki/HSL_and_HSV - HSL color model explanation
 * @see https://www.w3.org/TR/css-color-4/#hsl-to-rgb - W3C HSL to RGB algorithm
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl - MDN HSL reference
 */
export const hslToRgb = (h: number, s: number, l: number): ColorRgb => {
  // Normalize values to 0-1 range
  const hNorm = h / 360
  const sNorm = s / 100
  const lNorm = l / 100

  // Calculate RGB using standard HSL conversion algorithm
  const hueToRgb = (p: number, q: number, t: number): number => {
    let tNorm = t
    if (tNorm < 0) tNorm += 1
    if (tNorm > 1) tNorm -= 1
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm
    if (tNorm < 1 / 2) return q
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6
    return p
  }

  let r: number
  let g: number
  let b: number

  if (sNorm === 0) {
    // Achromatic (gray)
    r = g = b = lNorm
  } else {
    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm
    const p = 2 * lNorm - q
    r = hueToRgb(p, q, hNorm + 1 / 3)
    g = hueToRgb(p, q, hNorm)
    b = hueToRgb(p, q, hNorm - 1 / 3)
  }

  // Convert to 0-255 range and round
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}
