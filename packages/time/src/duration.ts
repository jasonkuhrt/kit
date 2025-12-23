/**
 * Time duration utilities for formatting and converting time values.
 *
 * @category Time
 */

/**
 * Time unit for duration formatting.
 *
 * @category Time
 */
export type Unit = 'ms' | 's' | 'm' | 'h' | 'd'

/**
 * Formatted duration with value and unit.
 *
 * @category Time
 */
export type Formatted = {
  /**
   * The numeric value in the chosen unit.
   */
  value: number
  /**
   * The time unit (ms, s, m, h, d).
   */
  unit: Unit | 'max'
}

/**
 * Format milliseconds into a human-readable duration with automatic unit scaling.
 *
 * Automatically selects the most appropriate time unit based on magnitude:
 * - < 10s: milliseconds
 * - 10s - 100s: seconds
 * - 100s - 60m: minutes
 * - 1h - 24h: hours
 * - 1d - 10d: days
 * - >= 10d: 'max'
 *
 * @category Time
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted duration with value and unit
 *
 * @example
 * ```typescript
 * format(500)           // { value: 500, unit: 'ms' }
 * format(5000)          // { value: 5000, unit: 'ms' }
 * format(15000)         // { value: 15, unit: 's' }
 * format(120000)        // { value: 2, unit: 'm' }
 * format(7200000)       // { value: 2, unit: 'h' }
 * format(172800000)     // { value: 2, unit: 'd' }
 * format(864000000)     // { value: Infinity, unit: 'max' }
 * ```
 */
export const format = (milliseconds: number): Formatted => {
  let value = milliseconds
  let unit: Unit | 'max'

  // <10s
  if (value < 1000 * 10) {
    unit = `ms`
  } // 10s-100s (exclusive)
  else if (value >= 1000 * 10 && value < 1000 * 100) {
    value = Math.round(value / 1000)
    unit = `s`
  } // 100s-60m (exclusive)
  else if (value >= 1000 * 100 && value < 1000 * 60 * 60) {
    value = Math.round(value / 1000 / 60)
    unit = `m`
  } // 1h-24h (exclusive)
  else if (value >= 1000 * 60 * 60 && value < 1000 * 60 * 60 * 24) {
    value = Math.round(value / 1000 / 60 / 60)
    unit = `h`
  } // 1d-10d (exclusive)
  else if (value >= 1000 * 60 * 60 * 24 && value < 1000 * 60 * 60 * 24 * 10) {
    value = Math.round(value / 1000 / 60 / 60 / 24)
    unit = `d`
  } else {
    value = Infinity
    unit = `max`
  }

  return { value, unit }
}

/**
 * Display handler for Date type.
 * @internal
 */
declare global {
  namespace KITZ.Traits.Display {
    interface Handlers<$Type> {
      _date: $Type extends Date ? 'Date' : never
    }
  }
}
