/**
 * AxisHand provides a logical, orientation-aware coordinate system for box model properties.
 *
 * Unlike physical coordinates (top/left/etc), AxisHand uses logical properties relative to flow direction:
 * - **main axis**: The primary flow direction (set by orientation)
 * - **cross axis**: Perpendicular to the main axis
 *
 * Each axis has **start** and **end** positions, creating a coordinate system that adapts to orientation.
 *
 * @example
 * ```typescript
 * // Global number - all sides
 * AxisHand.parse(2)
 * // → { mainStart: 2, mainEnd: 2, crossStart: 2, crossEnd: 2 }
 *
 * // Axis shorthands
 * AxisHand.parse([2, 4])
 * // → { mainStart: 2, mainEnd: 2, crossStart: 4, crossEnd: 4 }
 *
 * // Binary axis - nested arrays
 * AxisHand.parse([[1, 2], [3, 4]])
 * // → { mainStart: 1, mainEnd: 2, crossStart: 3, crossEnd: 4 }
 *
 * // Per-axis array with shorthand
 * AxisHand.parse([[1, 2], 4])
 * // → { mainStart: 1, mainEnd: 2, crossStart: 4, crossEnd: 4 }
 *
 * // Object syntax
 * AxisHand.parse({ main: [1, 2], cross: 4 })
 * // → { mainStart: 1, mainEnd: 2, crossStart: 4, crossEnd: 4 }
 *
 * // Sparse values
 * AxisHand.parse([[2], [, 4]])
 * // → { mainStart: 2, crossEnd: 4 }
 * ```
 */

/**
 * Logical properties for box model positioning.
 *
 * These properties are flow-relative and adapt to the orientation:
 * - In vertical orientation: mainStart=top, mainEnd=bottom, crossStart=left, crossEnd=right
 * - In horizontal orientation: mainStart=left, mainEnd=right, crossStart=top, crossEnd=bottom
 *
 * @typeParam $value - The value type (e.g., number, number | bigint)
 */
export type Logical<$value = number> = {
  mainStart?: $value
  mainEnd?: $value
  crossStart?: $value
  crossEnd?: $value
}

/**
 * Value specification for a single axis.
 *
 * Can be:
 * - A value (shorthand for both start and end)
 * - An array `[start, end]` or sparse `[start]`, `[, end]`
 * - An object with explicit `start` and `end` properties
 *
 * @typeParam $value - The value type (e.g., number, number | bigint)
 */
export type AxisValue<$value = number> =
  | $value // shorthand: both sides
  | [$value] // [start]
  | [$value, $value] // [start, end]
  | [$value, undefined] // [start only]
  | [undefined, $value] // [end only]
  | { start?: $value; end?: $value } // explicit object

/**
 * Input format for AxisHand.
 *
 * Supports multiple syntaxes for progressive complexity:
 * 1. Global value: `2` → all sides
 * 2. Axis shorthands: `[2, 4]` → [main, cross]
 * 3. Binary axis: `[[1, 2], [3, 4]]` → [[main], [cross]]
 * 4. Sparse binary: `[[2]]` → main only
 * 5. Object syntax: `{ main: [1, 2], cross: 4 }`
 * 6. Explicit logical: `{ mainStart: 1, mainEnd: 2, ... }`
 *
 * @typeParam $value - The value type (e.g., number, number | bigint)
 */
export type Input<$value = number> =
  | $value // all sides
  | [$value, $value] // [main, cross] - axis shorthands
  | [AxisValue<$value>, AxisValue<$value>] // [[main...], [cross...]] - binary axis
  | [AxisValue<$value>] // [[main...]] - main axis only
  | { main?: AxisValue<$value>; cross?: AxisValue<$value> } // object with axes
  | Logical<$value> // explicit logical properties

/**
 * Parse AxisHand input into logical properties.
 *
 * Handles all input formats and returns a partial Logical object with only the specified properties.
 *
 * @typeParam $value - The value type (e.g., number, number | bigint)
 * @param input - AxisHand input in any supported format
 * @returns Partial logical properties
 */
export const parse = <$value = number>(input: Input<$value>): Partial<Logical<$value>> => {
  // Handle primitive value (number, bigint, etc.)
  if (typeof input === `number` || typeof input === `bigint`) {
    return { mainStart: input, mainEnd: input, crossStart: input, crossEnd: input }
  }

  // Handle object
  if (!Array.isArray(input)) {
    // Cast to object for property checking (we know it's an object type at this point)
    const inputObj = input as Record<string, any>
    // Object with main/cross properties
    if (`main` in inputObj || `cross` in inputObj) {
      const result: Partial<Logical<$value>> = {}
      const mainResult = parseAxis(`main`, inputObj[`main`] as AxisValue<$value> | undefined)
      const crossResult = parseAxis(`cross`, inputObj[`cross`] as AxisValue<$value> | undefined)
      if (mainResult.mainStart !== undefined) result.mainStart = mainResult.mainStart
      if (mainResult.mainEnd !== undefined) result.mainEnd = mainResult.mainEnd
      if (crossResult.crossStart !== undefined) result.crossStart = crossResult.crossStart
      if (crossResult.crossEnd !== undefined) result.crossEnd = crossResult.crossEnd
      return result
    }
    // Already logical properties
    return input as Logical<$value>
  }

  // Handle arrays
  const firstElement = input[0]
  const secondElement = input[1]

  // Detect if this is [main, cross] shorthands (both are primitive values)
  if (
    input.length === 2
    && (typeof firstElement === `number` || typeof firstElement === `bigint`)
    && (typeof secondElement === `number` || typeof secondElement === `bigint`)
  ) {
    // [main, cross] shorthands
    return {
      mainStart: firstElement as $value,
      mainEnd: firstElement as $value,
      crossStart: secondElement as $value,
      crossEnd: secondElement as $value,
    }
  }

  // Binary axis: [[main...], [cross...]] or [[main...]]
  const mainAxis = firstElement as AxisValue<$value>
  const crossAxis = secondElement as AxisValue<$value> | undefined

  return {
    ...parseAxis(`main`, mainAxis),
    ...parseAxis(`cross`, crossAxis),
  } as Partial<Logical<$value>>
}

/**
 * Parse a single axis value into logical properties.
 *
 * @typeParam $value - The value type
 * @param axis - Which axis (main or cross)
 * @param value - The axis value specification
 * @returns Partial logical properties for this axis
 */
const parseAxis = <$value = number>(
  axis: 'main' | 'cross',
  value?: AxisValue<$value>,
): Partial<Logical<$value>> => {
  if (value === undefined) return {}

  const startKey = axis === `main` ? `mainStart` : `crossStart`
  const endKey = axis === `main` ? `mainEnd` : `crossEnd`

  // Primitive value shorthand (number, bigint, etc.)
  if (typeof value === `number` || typeof value === `bigint`) {
    return { [startKey]: value, [endKey]: value } as Partial<Logical<$value>>
  }

  // Array
  if (Array.isArray(value)) {
    const [start, end] = value
    return {
      ...(start !== undefined ? { [startKey]: start } : {}),
      ...(end !== undefined ? { [endKey]: end } : {}),
    } as Partial<Logical<$value>>
  }

  // Object - cast to access properties
  const valueObj = value as { start?: $value; end?: $value }
  return {
    ...(valueObj.start !== undefined ? { [startKey]: valueObj.start } : {}),
    ...(valueObj.end !== undefined ? { [endKey]: valueObj.end } : {}),
  } as Partial<Logical<$value>>
}
