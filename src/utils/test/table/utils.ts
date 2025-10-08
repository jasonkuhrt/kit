import { Err } from '#err'
import { Str } from '#str'
import { Equal } from 'effect'
import objectInspect from 'object-inspect'
import { describe as vitestDescribe, expect } from 'vitest'

// ============================================================================
// Assertion Utilities
// ============================================================================

/**
 * Custom assertion that uses Effect's Equal.equals for equivalence checking.
 * Falls back to Vitest's toEqual for better error messages when values are not equal.
 */
export const assertEffectEqual = (actual: any, expected: any) => {
  // First try Effect's Equal.equals for proper equivalence checking
  // This handles Effect data types that implement Equal trait
  const isEqual = Equal.equals(actual, expected)

  if (!isEqual) {
    // Use toEqual for better diff output when assertion fails
    expect(actual).toEqual(expected)
  }
  // If Equal.equals returns true, assertion passes silently
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate that user context doesn't contain reserved property names.
 * Reserved names: input, output, result, comment
 */
export const validateContextKeys = (context: object, caseName: string): void => {
  const reservedKeys = ['input', 'output', 'result', 'comment']
  const contextKeys = Object.keys(context)
  const conflicts = contextKeys.filter((key) => reservedKeys.includes(key))

  if (conflicts.length > 0) {
    throw new Error(
      `Test case "${caseName}" contains reserved context keys: ${conflicts.join(', ')}. `
        + `Reserved keys are: ${reservedKeys.join(', ')}. `
        + `Please rename these properties in your test context.`,
    )
  }
}

// ============================================================================
// Describe Block Utilities
// ============================================================================

/**
 * Creates nested describe blocks from a description containing ' > ' separator.
 *
 * @example
 * ```ts
 * createNestedDescribe('Arguments > Enums', runTests)
 * // Creates: describe('Arguments', () => describe('Enums', runTests))
 * ```
 */
export const createNestedDescribe = (description: string, callback: () => void): void => {
  const parts = description.split(' > ').map(part => part.trim())

  if (parts.length === 1) {
    vitestDescribe(description, callback)
    return
  }

  // Create nested describe blocks from outer to inner
  const createNested = (index: number): void => {
    if (index === parts.length - 1) {
      vitestDescribe(parts[index]!, callback)
    } else {
      vitestDescribe(parts[index]!, () => createNested(index + 1))
    }
  }

  createNested(0)
}

// ============================================================================
// Matrix Utilities
// ============================================================================

/**
 * Generate all combinations (cartesian product) of matrix values.
 *
 * @example
 * ```ts
 * generateMatrixCombinations({ a: [1, 2], b: ['x', 'y'] })
 * // Returns: [
 * //   { a: 1, b: 'x' },
 * //   { a: 1, b: 'y' },
 * //   { a: 2, b: 'x' },
 * //   { a: 2, b: 'y' }
 * // ]
 * ```
 */
export const generateMatrixCombinations = (
  matrix: Record<string, readonly any[]>,
): Array<Record<string, any>> => {
  const keys = Object.keys(matrix)
  if (keys.length === 0) return [{}]

  const combinations: Array<Record<string, any>> = []

  const generate = (index: number, current: Record<string, any>) => {
    if (index === keys.length) {
      combinations.push({ ...current })
      return
    }

    const key = keys[index]!
    const values = matrix[key]!

    for (const value of values) {
      current[key] = value
      generate(index + 1, current)
    }
  }

  generate(0, {})
  return combinations
}

// ============================================================================
// Snapshot Utilities
// ============================================================================

/**
 * Default snapshot serializer with smart handling for different value types.
 *
 * Uses specialized formatting for specific types:
 * - **Strings**: Raw display without JSON quotes for readability
 * - **Functions**: `.toString()` representation
 * - **Errors**: `Err.inspect()` for detailed stack traces and context
 *
 * All other values use `object-inspect` which provides:
 * - **Circular reference handling**: Shows `[Circular]` instead of throwing
 * - **Special type support**: Maps, Sets, Dates, RegExp, TypedArrays, etc.
 * - **Clean formatting**: Single quotes, 2-space indentation
 * - **Type-aware output**: Distinguishes null, undefined, symbols, BigInt, etc.
 *
 * @param value - The value to serialize
 * @param _context - Test context (unused by default serializer, available for custom serializers)
 * @returns Formatted string representation
 */
export const defaultSnapshotSerializer = (value: any, _context: any): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'function') return value.toString()
  if (typeof value === 'undefined') return 'undefined'
  if (typeof value === 'symbol') return value.toString()
  if (typeof value === 'bigint') return value.toString() + 'n'
  if (value instanceof RegExp) return value.toString()
  if (value instanceof Error) return Err.inspect(value)
  return objectInspect(value, { indent: 2 })
}

/**
 * Get a human-readable type label for a value.
 */
export const getTypeLabel = (value: any): string => {
  if (value === null) return `NULL`
  if (value === undefined) return `UNDEFINED`

  const type = typeof value
  if (type === `string`) return `STRING`
  if (type === `number`) return `NUMBER`
  if (type === `boolean`) return `BOOLEAN`
  if (type === `bigint`) return `BIGINT`
  if (type === `symbol`) return `SYMBOL`
  if (type === `function`) return `FUNCTION`

  // Check for built-in types
  if (Array.isArray(value)) return `ARRAY`
  if (value instanceof RegExp) return `REGEXP`
  if (value instanceof Date) return `DATE`
  if (value instanceof Map) return `MAP`
  if (value instanceof Set) return `SET`
  if (value instanceof Promise) return `PROMISE`
  if (value instanceof Error) return value.constructor.name.toUpperCase()

  return `OBJECT`
}

/**
 * Format a snapshot with clear GIVEN/THEN sections showing arguments and return value or error.
 * Two modes:
 * - Function mode (has inputs): GIVEN ARGUMENTS → THEN RETURNS/THROWS
 * - Runner mode (no inputs): RUNNER → OUTPUTS RETURN/THROW
 */
export const formatSnapshotWithInput = (
  input: any[],
  result: any,
  error?: Error,
  runner?: Function,
  serializer: (value: any, context: any) => string = defaultSnapshotSerializer,
  context: any = {},
): string => {
  // Fixed width for all boxes
  const width = 50

  const isError = error !== undefined
  const outputStr = isError
    ? `${error.name}: ${error.message}`
    : serializer(result, context)

  const hasInput = input.length > 0

  if (hasInput) {
    // Function mode: GIVEN → THEN
    // Format all inputs
    const formattedInputs = input.map((i) => serializer(i, context))

    // Format input string
    let inputStr: string
    if (input.length === 1) {
      inputStr = formattedInputs[0]!
    } else {
      // Separator should match box border width (width + 2 for the corner characters)
      const separator = '─'.repeat(width + 2)
      inputStr = formattedInputs.join('\n' + separator + '\n')
    }

    // Box drawing with titles at the end
    const givenLabel = ' GIVEN ARGUMENTS'
    const thenLabel = isError ? ` THEN THROWS ${getTypeLabel(error)}` : ` THEN RETURNS ${getTypeLabel(result)}`

    return [
      '', // Leading newline to force opening quote on own line
      '╔' + '═'.repeat(width) + '╗' + givenLabel,
      inputStr,
      '╠' + '═'.repeat(width) + '╣' + thenLabel,
      outputStr,
      '╚' + '═'.repeat(width) + '╝',
    ].join('\n')
  } else {
    // Runner mode: Show runner function and output
    if (runner) {
      // Extract just the function body (remove first and last lines)
      const runnerLines = runner.toString().split('\n')
      const bodyLines = runnerLines.slice(1, -1)
      const bodyWithIndent = bodyLines.join('\n')
      const runnerBody = Str.stripIndent(bodyWithIndent)

      const outputLabel = isError ? ` OUTPUTS THROW ${getTypeLabel(error)}` : ` OUTPUTS RETURN ${getTypeLabel(result)}`

      return [
        '', // Leading newline to force opening quote on own line
        '╔' + '═'.repeat(width) + '╗' + ' RUNNER',
        runnerBody,
        '╠' + '═'.repeat(width) + '╣' + outputLabel,
        outputStr,
        '╚' + '═'.repeat(width) + '╝',
      ].join('\n')
    } else {
      // Fallback: no runner function available
      const outputLabel = isError ? ` OUTPUTS THROW ${getTypeLabel(error)}` : ` OUTPUTS RETURN ${getTypeLabel(result)}`

      return [
        '', // Leading newline to force opening quote on own line
        '╔' + '═'.repeat(width) + '╗' + outputLabel,
        outputStr,
        '╚' + '═'.repeat(width) + '╝',
      ].join('\n')
    }
  }
}
