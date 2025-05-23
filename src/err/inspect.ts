import { cyan, red } from 'ansis'
import { Str } from '../str/index.js'
import { is } from './type.js'

export interface InspectOptions {
  color?: boolean
  truncateLength?: number
}

const defaultOptions: InspectOptions = {
  color: true,
  truncateLength: 120,
}

export const formatTitle = (indent: string, text: string, options: InspectOptions) => {
  const title = `\n${indent}${text.toUpperCase()}\n`
  return options.color ? cyan(title) : title
}

export const formatIndent = '    '

/**
 * Render an error to a string with nice formatting including causes, aggregate errors, context, and stack traces.
 */

export const inspect = (error: Error, options?: InspectOptions): string => {
  const opts = { ...defaultOptions, ...options }
  return _inspect(error, '', opts)
}
const _inspect = (error: Error, parentIndent: string, options: InspectOptions): string => {
  if (!is(error)) {
    return parentIndent + String(error)
  }

  const lines: string[] = []

  // Handle AggregateError
  if (error instanceof AggregateError && error.errors.length > 0) {
    lines.push(formatTitle(parentIndent, 'errors', options))
    lines.push(...error.errors.reduce<string[]>((acc, err, index) => {
      acc.push(formatTitle(parentIndent, `[${index}]`, options))
      acc.push(_inspect(err, parentIndent + formatIndent, options))
      return acc
    }, []))
    return Str.unlines(lines)
  }

  // Render the main error message
  const errorName = options.color ? red(error.name) : error.name
  lines.push(`${parentIndent}${errorName}`)
  lines.push('')
  lines.push(`${parentIndent}${formatIndent}${error.message}`)

  // Handle cause if present
  if ('cause' in error && error.cause instanceof Error) {
    lines.push(formatTitle(parentIndent, 'cause', options))
    lines.push(_inspect(error.cause, parentIndent + formatIndent, options))
  }

  // Handle context property if present
  if ('context' in error && error.context !== undefined) {
    lines.push(formatTitle(parentIndent, 'context', options))
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
        .map(_ => Str.truncate(`${parentIndent}${formatIndent}${_.trim()}`, options.truncateLength)),
    )
    lines.push(formatTitle(parentIndent, 'stack', options))
    lines.push(stack)
  }

  return Str.unlines(lines)
}
