// @ts-expect-error Duplicate identifier
export * as Color from './$$.js'

/**
 * Color utilities for terminal output.
 *
 * Provides comprehensive color support for CLI applications including:
 * - **140 CSS Level 4 named colors** (red, blue, etc.)
 * - **Multiple input formats**: hex, RGB, HSL, CSS functions, and objects
 * - **RGB (24-bit true color)** as canonical format
 * - **Effect Schema validation** with branded types
 * - **Type-level parser** for compile-time hints
 * - **Color conversions** between formats
 *
 * ## Supported Formats
 *
 * - Hex: `#FF5733` or `FF5733`
 * - RGB space-separated: `rgb 255 87 51`
 * - RGB CSS function: `rgb(255, 87, 51)`
 * - HSL space-separated: `hsl 120 100 50`
 * - HSL CSS function: `hsl(120, 100, 50)`
 * - Named colors: `red`, `blue`, `green`, etc. (140 colors)
 * - Object: `{ r: 255, g: 87, b: 51 }`
 *
 * ## Color Properties
 *
 * Colors can be applied to three targets:
 * - **foreground**: Text color
 * - **background**: Background color
 * - **underlineColor**: Underline color (when used with underline modifier)
 *
 * ## Usage
 *
 * @example
 * ```typescript
 * import { Color } from '@wollybeard/kit/color'
 *
 * // Parse various formats
 * const red = Color.fromString('red')
 * const blue = Color.fromString('#0000FF')
 * const green = Color.fromString('rgb 0 255 0')
 * const yellow = Color.fromString('hsl(60, 100, 50)')
 *
 * // Convert to hex
 * red.toHex()  // '#FF0000'
 *
 * // Use in schemas
 * const ConfigSchema = S.Struct({
 *   primaryColor: Color.String,
 *   secondaryColor: ColorInput
 * })
 * ```
 *
 * @category Color
 */
export namespace Color {}
