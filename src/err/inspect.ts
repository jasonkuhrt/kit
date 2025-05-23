import { Str } from '../str/index.js'
import { is } from './type.js'

export const formatTitle = (indent: string, text: string) => `\n${indent}${text.toUpperCase()}\n`

export const formatIndent = '    '

/**
 * Render an error to a string with nice formatting including causes, aggregate errors, context, and stack traces.
 */

export const inspect = (error: Error): string => {
  return _inspect(error, '')
}
const _inspect = (error: Error, parentIndent: string): string => {
  if (!is(error)) {
    return parentIndent + String(error)
  }

  const lines: string[] = []

  // Handle AggregateError
  if (error instanceof AggregateError && error.errors.length > 0) {
    lines.push(formatTitle(parentIndent, 'errors'))
    lines.push(...error.errors.reduce<string[]>((acc, err, index) => {
      acc.push(formatTitle(parentIndent, `[${index}]`))
      acc.push(_inspect(err, parentIndent + formatIndent))
      return acc
    }, []))
    return Str.unlines(lines)
  }

  // Render the main error message
  lines.push(`${parentIndent}${error.name}`)
  lines.push('')
  lines.push(`${parentIndent}${formatIndent}${error.message}`)

  // Handle cause if present
  if ('cause' in error && error.cause instanceof Error) {
    lines.push(formatTitle(parentIndent, 'cause'))
    lines.push(_inspect(error.cause, parentIndent + formatIndent))
  }

  // Handle context property if present
  if ('context' in error && error.context !== undefined) {
    lines.push(formatTitle(parentIndent, 'context'))
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
        .map(_ => Str.truncate(`${parentIndent}${formatIndent}${_.trim()}`)),
    )
    lines.push(formatTitle(parentIndent, 'stack'))
    lines.push(stack)
  }

  return Str.unlines(lines)
}
