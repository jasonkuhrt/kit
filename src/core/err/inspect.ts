import { Obj } from '#obj'
import { Str } from '#str'
import { dim, red } from 'ansis'
import { Config, Schema as S } from 'effect'
import objectInspect from 'object-inspect'
import { cleanStackWithStats } from './stack.js'
import { is } from './type.js'
import type { Context } from './types.js'

// ─────────────────────────────────────────────────────────────────────────────
// Options Schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schema for error inspection options with constructor defaults.
 *
 * @category Inspection
 */
export class InspectOptions extends S.Class<InspectOptions>('InspectOptions')({
  /** Whether to use ANSI color codes for better readability */
  color: S.Boolean.pipe(S.propertySignature, S.withConstructorDefault(() => true)),
  /** Maximum column width before truncating stack trace lines */
  stackTraceColumns: S.Number.pipe(S.propertySignature, S.withConstructorDefault(() => 120)),
  /** Number of spaces to use for indentation */
  indentColumns: S.Number.pipe(S.propertySignature, S.withConstructorDefault(() => 4)),
  /** Maximum number of stack frames to show; 0 to hide stack traces entirely */
  maxFrames: S.Number.pipe(S.propertySignature, S.withConstructorDefault(() => 10)),
  /** Whether to display the environment variable help section */
  showHelp: S.Boolean.pipe(S.propertySignature, S.withConstructorDefault(() => true)),
}) {}

/**
 * Input type for partial inspect options.
 *
 * @category Inspection
 */
export type InspectOptionsInput = Partial<typeof InspectOptions.Type>

/**
 * Effect Config spec for reading inspect options from environment variables.
 * Users apply this at app startup via:
 * ```ts
 * Object.assign(Err.inspectDefaults, Effect.runSync(Effect.config(Err.inspectConfig)))
 * ```
 *
 * @category Inspection
 */
export const inspectConfig = Config.all({
  color: Config.boolean('ERROR_DISPLAY_COLOR').pipe(Config.withDefault(true)),
  stackTraceColumns: Config.number('ERROR_DISPLAY_STACK_TRACE_COLUMNS').pipe(Config.withDefault(120)),
  indentColumns: Config.number('ERROR_DISPLAY_INDENT_COLUMNS').pipe(Config.withDefault(4)),
  maxFrames: Config.number('ERROR_DISPLAY_MAX_FRAMES').pipe(Config.withDefault(10)),
  showHelp: Config.boolean('ERROR_DISPLAY_SHOW_HELP').pipe(Config.withDefault(true)),
})

/**
 * Mutable runtime defaults for error inspection.
 * Users can override via `Object.assign(Err.inspectDefaults, ...)`.
 *
 * @example
 * ```ts
 * // Apply env config at app startup
 * Object.assign(Err.inspectDefaults, Effect.runSync(Effect.config(Err.inspectConfig)))
 *
 * // Or manually override
 * Err.inspectDefaults.color = false
 * Err.inspectDefaults.maxFrames = 5
 * ```
 *
 * @category Inspection
 */
export const inspectDefaults = InspectOptions.make({})

/**
 * Resolved configuration for error inspection (internal use).
 * @internal
 */
type InspectConfig = typeof InspectOptions.Type

/**
 * Get the prefix letter for a section.
 * @internal
 */
const getSectionPrefix = (section: 'type' | 'message' | 'stack' | 'context' | 'cause'): string => {
  const prefixes = {
    type: 'T',
    message: 'M',
    stack: 'S',
    context: 'C',
    cause: 'CAUSE',
  }
  return prefixes[section]
}

/**
 * Render an error to a string with detailed formatting.
 *
 * Features:
 * - Nested error support (causes and aggregate errors)
 * - Context object formatting
 * - Stack trace cleaning with filtering indicators
 * - Tree-like visual guides for nested structures
 * - Configurable via options or environment variables
 *
 * @param error - The error to inspect
 * @param options - Optional configuration for formatting
 * @returns A formatted string representation of the error
 *
 * @example
 * ```ts
 * // Simple error
 * const error = new Error('Something went wrong')
 * console.log(Err.inspect(error))
 *
 * // Error with context
 * const contextError = new Error('API failed')
 * contextError.context = { userId: 123, endpoint: '/api/users' }
 * console.log(Err.inspect(contextError))
 *
 * // Aggregate error with multiple failures
 * const errors = [
 *   new Error('Database connection failed'),
 *   new Error('Redis timeout')
 * ]
 * const aggregate = new AggregateError(errors, 'Multiple services failed')
 * console.log(Err.inspect(aggregate))
 *
 * // Disable help section
 * console.log(Err.inspect(error, { showHelp: false }))
 * ```
 *
 * @category Inspection
 */
export const inspect = (error: Error, options?: InspectOptionsInput): string => {
  const config: InspectConfig = { ...inspectDefaults, ...options }

  let inspection = _inspectResursively(error, '', config, { isRoot: true })

  // Only show help section if enabled
  if (config.showHelp) {
    inspection += '\n\n'
    inspection += config.color ? dim('─'.repeat(40)) : '─'.repeat(40)
    inspection += '\n'
    inspection += config.color
      ? dim('Environment Variable Configuration:')
      : 'Environment Variable Configuration:'
    inspection += '\n'

    const envVarNames = {
      color: 'ERROR_DISPLAY_COLOR',
      stackTraceColumns: 'ERROR_DISPLAY_STACK_TRACE_COLUMNS',
      indentColumns: 'ERROR_DISPLAY_INDENT_COLUMNS',
      maxFrames: 'ERROR_DISPLAY_MAX_FRAMES',
      showHelp: 'ERROR_DISPLAY_SHOW_HELP',
    } as const

    for (const [key, envVar] of Obj.entries(envVarNames)) {
      const value = config[key]
      const line = `  ${envVar} (current: ${value})`
      inspection += config.color ? dim(line) : line
      inspection += '\n'
    }
  }

  return inspection
}

/**
 * Options for recursive error inspection.
 * Used internally to track position in the error hierarchy.
 *
 * @internal
 */
interface InspectContext {
  /**
   * Whether this is the root error being inspected.
   */
  isRoot?: boolean

  /**
   * Whether this is the last item in a list.
   */
  isLast?: boolean

  /**
   * Index in aggregate error list.
   */
  index?: number
}

/**
 * Format context object for display using isomorphic inspect.
 * @internal
 */
const formatContext = (context: any): string => {
  return objectInspect(context, {
    indent: 2,
    quoteStyle: 'single',
    maxStringLength: Infinity,
    customInspect: false, // Avoid invoking custom inspect methods
    // depth: null, // No depth limit
  })
}

/**
 * Format a line with indentation.
 * @internal
 */
const formatLine = (
  content: string,
  indent: string,
  config: InspectConfig,
): string => {
  return `${indent}${content}`
}

/**
 * Format and align stack trace frames.
 * @internal
 */
const formatStackFrames = (stackLines: string[]): string[] => {
  // Parse stack frames to extract function names and locations
  const frames = stackLines.map(line => {
    const trimmed = line.trim()

    // Replace <anonymous> with <?>
    const cleaned = trimmed.replace(/<anonymous>/g, '<?>')

    // Try to match different stack frame formats
    // Format: "at functionName (file:line:col)" or "at file:line:col"
    const match = cleaned.match(/^at\s+([^(]+?)\s*\((.+)\)$/) || cleaned.match(/^at\s+(.+)$/)

    if (!match) return cleaned

    if (match[2]) {
      // Has function name and location
      const funcName = match[1]!.trim().replace('Object.', '')
      const location = match[2]!.trim()
      return { funcName, location, original: cleaned }
    } else {
      // Only location
      return { funcName: '', location: match[1]!.trim(), original: cleaned }
    }
  })

  // Find the longest function name for alignment
  let maxFuncLength = 0
  for (const frame of frames) {
    if (typeof frame === 'object' && frame.funcName) {
      maxFuncLength = Math.max(maxFuncLength, frame.funcName.length)
    }
  }

  // Format with alignment
  return frames.map(frame => {
    if (typeof frame === 'string') return frame

    if (frame.funcName) {
      const paddedFunc = frame.funcName.padEnd(maxFuncLength)
      return `@ ${paddedFunc} ${frame.location}`
    } else {
      return `@ ${' '.repeat(maxFuncLength)} ${frame.location}`
    }
  })
}

const _inspectResursively = (
  error: Error,
  parentIndent: string,
  config: InspectConfig,
  context: InspectContext = {},
): string => {
  if (!is(error)) {
    return parentIndent + String(error)
  }

  const lines: string[] = []
  const isAggregateError = error instanceof AggregateError && error.errors.length > 0
  const isNested = !context.isRoot

  // For nested errors in aggregate, use tree structure
  if (isNested && context.index !== undefined) {
    // Always use ├─ for aggregate error items, the closing └ is separate
    const treeChar = '├─'

    // Dedent the number by 2 spaces if we have enough indentation
    let numberIndent = parentIndent
    let contentIndent = parentIndent
    if (parentIndent.length >= 2) {
      numberIndent = parentIndent.slice(0, -2) // Remove 2 spaces for the number
      contentIndent = parentIndent // Keep full indent for content alignment
    }

    const indexPrefix = config.color ? dim(`${context.index} ${treeChar}`) : `${context.index} ${treeChar}`
    const errorName = config.color ? red(error.name) : error.name
    const errorLine = error.message ? `${errorName}: ${error.message}` : errorName
    lines.push(`${numberIndent}${indexPrefix} ${errorLine}`)

    // The continuation aligns with the original indent
    // Always use │ for continuation since we're using ├─ for all items
    const continuation = '│  '
    const contPrefix = config.color ? dim(continuation) : continuation
    const childIndent = contentIndent + contPrefix

    // Stack (compact)
    if (config.maxFrames > 0 && error.stack) {
      const cleanResult = cleanStackWithStats(error.stack, {
        removeInternal: true,
        maxFrames: Math.min(config.maxFrames, 3),
        filterPatterns: ['node_modules', 'node:internal'],
      })
      const stackLines = Str.Text.lines(cleanResult.stack).slice(1)
      if (stackLines.length > 0) {
        const formattedFrames = formatStackFrames(stackLines)
        for (const line of formattedFrames) {
          lines.push(`${childIndent}${line}`)
        }
      }
    }

    // Context (inline)
    if ('context' in error && error.context !== undefined) {
      const context = (error as Error & { context: Context }).context
      const jsonString = formatContext(context)
      const jsonLines = Str.Text.lines(jsonString)
      for (let i = 0; i < jsonLines.length; i++) {
        const line = jsonLines[i]!
        // Don't add extra indent for JSON lines that already have indent from JSON.stringify
        lines.push(`${childIndent}${line}`)
      }
    }

    // If this nested error is itself an AggregateError, show its children
    if (isAggregateError) {
      const aggregateError = error as AggregateError
      if (aggregateError.errors.length > 0) {
        // Add a visual separator
        lines.push(`${childIndent}${config.color ? dim('↓') : '↓'}`)

        // Render child errors
        aggregateError.errors.forEach((err, idx) => {
          const isLastChild = idx === aggregateError.errors.length - 1
          const childTreeChar = isLastChild ? '└─' : '├─'
          const childPrefix = config.color ? dim(`  ${childTreeChar}`) : `  ${childTreeChar}`

          const childErrorName = config.color ? red(err.name) : err.name
          const childErrorLine = err.message ? `${childErrorName}: ${err.message}` : childErrorName
          lines.push(`${childIndent}${childPrefix} ${childErrorLine}`)

          // Need to account for "  " (indent) + tree char width
          const childCont = isLastChild ? '   ' : '  │'
          const nestedIndent = childIndent + (config.color ? dim(childCont) : childCont)

          if (config.maxFrames > 0 && err.stack) {
            const cleanResult = cleanStackWithStats(err.stack, {
              removeInternal: true,
              maxFrames: Math.min(config.maxFrames, 1),
              filterPatterns: ['node_modules', 'node:internal'],
            })
            const stackLines = Str.Text.lines(cleanResult.stack).slice(1)
            if (stackLines.length > 0) {
              const formattedFrames = formatStackFrames(stackLines)
              lines.push(`${nestedIndent}${formattedFrames[0]}`)
            }
          }

          // If this is also an AggregateError, show indicator
          if (err instanceof AggregateError && err.errors.length > 0) {
            lines.push(`${nestedIndent}[contains ${err.errors.length} error${err.errors.length > 1 ? 's' : ''}]`)
          }
        })
      }
    }

    return Str.Text.unlines(lines)
  }

  // Root or non-aggregate nested error
  // Type and Message on same line
  const errorName = config.color ? red(error.name) : error.name
  const errorLine = error.message ? `${errorName}: ${error.message}` : errorName
  lines.push(formatLine(errorLine, parentIndent, config))

  // Stack - no indentation
  if (config.maxFrames > 0 && error.stack) {
    const cleanResult = cleanStackWithStats(error.stack, {
      removeInternal: true,
      maxFrames: config.maxFrames,
      filterPatterns: ['node_modules', 'node:internal'],
    })

    const stackLines = Str.Text.lines(cleanResult.stack).slice(1)
    if (cleanResult.stats.shownFrames === 0) {
      const frameWord = cleanResult.stats.totalFrames === 1 ? 'frame' : 'frames'
      const paddedLocation = '...'.padEnd(15)
      lines.push(
        formatLine(
          `@ ${paddedLocation} all ${cleanResult.stats.totalFrames} ${frameWord} elided`,
          parentIndent,
          config,
        ),
      )
    } else {
      const formattedFrames = formatStackFrames(stackLines)

      // Calculate the max function length from formatted frames to maintain alignment
      let maxFuncLength = 0
      for (const frame of formattedFrames) {
        const match = frame.match(/^@\s+(\S+)/)
        if (match && match[1]) {
          maxFuncLength = Math.max(maxFuncLength, match[1].length)
        }
      }

      for (let i = 0; i < formattedFrames.length; i++) {
        lines.push(formatLine(formattedFrames[i]!, parentIndent, config))
      }
      if (cleanResult.stats.filteredFrames > 0) {
        const frameWord = cleanResult.stats.filteredFrames === 1 ? 'frame' : 'frames'
        // Format like a stack frame with padding to align with file paths
        const paddedFunc = '...'.padEnd(maxFuncLength)
        lines.push(
          formatLine(`@ ${paddedFunc} elided ${cleanResult.stats.filteredFrames} ${frameWord}`, parentIndent, config),
        )
      }
    }
  }

  // Context - no indentation
  if ('context' in error && error.context !== undefined) {
    const context = (error as Error & { context: Context }).context
    const jsonString = formatContext(context)
    const jsonLines = Str.Text.lines(jsonString)

    for (let i = 0; i < jsonLines.length; i++) {
      lines.push(formatLine(jsonLines[i]!, parentIndent, config))
    }
  }

  // Cause - indented progressively
  if ('cause' in error && error.cause instanceof Error) {
    lines.push(formatLine('  ↓', parentIndent, config))
    lines.push(_inspectResursively(error.cause, `${parentIndent}  `, config, { isRoot: false }))
  }

  // Aggregate errors
  if (isAggregateError) {
    const aggregateError = error as AggregateError
    if (aggregateError.errors.length > 0) {
      // Visual separator - indented by 4 spaces to align with tree continuation
      const separator1 = config.color ? dim('    ↓') : '    ↓'
      const separator2 = config.color ? dim('    │') : '    │'
      lines.push(`${parentIndent}${separator1}`)
      lines.push(`${parentIndent}${separator2}`)

      // Render each error with tree structure, indented under parent
      const childIndent = parentIndent + '    ' // 4 spaces for child indentation
      aggregateError.errors.forEach((err, index) => {
        const isLastError = index === aggregateError.errors.length - 1
        lines.push(_inspectResursively(err, childIndent, config, {
          isRoot: false,
          isLast: isLastError,
          index,
        }))
        if (!isLastError) {
          // Separator aligns with the content, not the dedented number
          const separator = config.color ? dim('│') : '│'
          lines.push(`${childIndent}${separator}`)
        }
      })

      // Add closing tree character aligned with tree structure
      const closingLine = config.color ? dim('    └') : '    └'
      lines.push(`${closingLine}`)
    }
  }

  return Str.Text.unlines(lines)
}
