import { Str } from '#str/index.js'
import { Char } from '#str/str.js'
import { cyan, red } from 'ansis'
import { is } from './type.js'

const environmentVariableNames = {
  STACK_TRACE_COLUMNS: 'STACK_TRACE_COLUMNS',
  INDENT_COLUMNS: 'INDENT_COLUMNS',
} as const

export interface InspectOptions {
  color?: boolean
  identColumns?: number
  stackTraceColumns?: number
}

export interface InspectConfig {
  color: boolean
  identColumns: number
  stackTraceColumns: number
}

const defaultOptions: InspectOptions = {
  color: true,
  stackTraceColumns: 120,
  identColumns: 4,
}

export const formatTitle = (indent: string, text: string, options: InspectOptions) => {
  const title = `\n${indent}${text.toUpperCase()}\n`
  return options.color ? cyan(title) : title
}

// export const formatIndent = '    '

/**
 * Render an error to a string with nice formatting including causes, aggregate errors, context, and stack traces.
 */

export const inspect = (error: Error, options?: InspectOptions): string => {
  const config = { ...defaultOptions, ...options }

  const stcEnvVarValue = process.env[environmentVariableNames.STACK_TRACE_COLUMNS]

  if (stcEnvVarValue) {
    config.stackTraceColumns = parseInt(stcEnvVarValue, 10)
  }

  const indentEnvVarValue = process.env[environmentVariableNames.INDENT_COLUMNS]
  if (indentEnvVarValue) {
    config.identColumns = parseInt(indentEnvVarValue, 10)
  }

  let inspection = _inspectResursively(error, '', config)

  inspection += `\n${formatTitle('', 'Environment Variable Formatting', config)}`
  inspection += Str.indent(
    `\nYou can control formatting of this error display with the following environment variables.\n\n`,
  )
  inspection += Str.indent(
    `${environmentVariableNames.STACK_TRACE_COLUMNS} – The column count to display before truncation "${
      stcEnvVarValue !== undefined
        ? ` (currently set to ${stcEnvVarValue})`
        : ` (currently unset, defaulting to ${config.stackTraceColumns})`
    }\n`,
  )
  inspection += Str.indent(
    `${environmentVariableNames.INDENT_COLUMNS} – The column count to display before truncation "${
      indentEnvVarValue !== undefined
        ? ` (currently set to ${indentEnvVarValue})`
        : ` (currently unset, defaulting to ${config.identColumns})`
    }\n`,
  )

  return inspection
}

const _inspectResursively = (error: Error, parentIndent: string, config: InspectConfig): string => {
  const formatIndent = Char.spaceRegular.repeat(config.identColumns)
  if (!is(error)) {
    return parentIndent + String(error)
  }

  const lines: string[] = []

  // Handle AggregateError
  if (error instanceof AggregateError && error.errors.length > 0) {
    lines.push(formatTitle(parentIndent, 'errors', config))
    lines.push(...error.errors.reduce<string[]>((acc, err, index) => {
      acc.push(formatTitle(parentIndent, `[${index}]`, config))
      acc.push(_inspectResursively(err, parentIndent + formatIndent, config))
      return acc
    }, []))
    return Str.unlines(lines)
  }

  // Render the main error message
  const errorName = config.color ? red(error.name) : error.name
  lines.push(`${parentIndent}${errorName}`)
  lines.push('')
  lines.push(`${parentIndent}${formatIndent}${error.message}`)

  // Handle cause if present
  if ('cause' in error && error.cause instanceof Error) {
    lines.push(formatTitle(parentIndent, 'cause', config))
    lines.push(_inspectResursively(error.cause, parentIndent + formatIndent, config))
  }

  // Handle context property if present
  if ('context' in error && error.context !== undefined) {
    lines.push(formatTitle(parentIndent, 'context', config))
    // todo: pretty object rendering
    lines.push(String(error.context))
  }

  // Handle stack property if present
  if (error.stack) {
    const stack = Str.unlines(
      Str
        .lines(error.stack)
        // Stacks include the message by default, we already showed that above.
        .slice(1)
        .map(_ => Str.truncate(`${parentIndent}${formatIndent}${_.trim()}`, config.stackTraceColumns)),
    )
    lines.push(formatTitle(parentIndent, 'stack', config))
    lines.push(stack)
  }

  return Str.unlines(lines)
}
