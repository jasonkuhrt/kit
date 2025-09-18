import { Str } from '#str'
import type { Context } from './types.js'

/**
 * Options for cleaning and formatting stack traces.
 */
export interface StackOptions {
  /**
   * Remove internal library frames from the stack trace.
   * @default true
   */
  removeInternal?: boolean

  /**
   * Patterns to filter out from stack traces.
   * @default ['node_modules', 'node:internal']
   */
  filterPatterns?: string[]

  /**
   * Maximum number of frames to show.
   * @default 10
   */
  maxFrames?: number

  /**
   * Include source code context around error location.
   * @default false
   */
  includeSource?: boolean

  /**
   * Number of source lines to show before and after error.
   * @default 2
   */
  sourceContext?: number
}

/**
 * Parsed stack frame information.
 */
export interface StackFrame {
  /**
   * Function name or <anonymous>
   */
  function: string

  /**
   * File path
   */
  file: string

  /**
   * Line number
   */
  line: number

  /**
   * Column number
   */
  column: number

  /**
   * Whether this is internal to the library
   */
  isInternal: boolean

  /**
   * Whether this is a native V8 frame
   */
  isNative: boolean

  /**
   * Raw frame string
   */
  raw: string
}

/**
 * Parse a stack trace string into structured frames.
 */
export const parseStack = (stack: string): StackFrame[] => {
  const lines = Str.lines(stack)
  const frames: StackFrame[] = []

  // Skip first line (error message)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!.trim()
    if (!line.startsWith('at ')) continue

    // Parse different stack frame formats:
    // at functionName (file:line:col)
    // at file:line:col
    // at async functionName (file:line:col)
    // at new ClassName (file:line:col)

    // First try to match with function name
    let match = line.match(/at\s+(?:async\s+)?(?:new\s+)?([^\s(]+)\s+\((.*?):(\d+):(\d+)\)/)

    if (match) {
      const [, fnName, file, lineStr, colStr] = match
      frames.push({
        function: fnName!,
        file: file!,
        line: parseInt(lineStr!, 10),
        column: parseInt(colStr!, 10),
        isInternal: isInternalFrame(file!),
        isNative: file!.includes('[native code]') || file!.startsWith('node:'),
        raw: line,
      })
      continue
    }

    // Try to match without function name (anonymous)
    match = line.match(/at\s+(.*?):(\d+):(\d+)/)
    if (match) {
      const [, file, lineStr, colStr] = match
      frames.push({
        function: '<anonymous>',
        file: file!,
        line: parseInt(lineStr!, 10),
        column: parseInt(colStr!, 10),
        isInternal: isInternalFrame(file!),
        isNative: file!.includes('[native code]') || file!.startsWith('node:'),
        raw: line,
      })
    }
  }

  return frames
}

/**
 * Check if a frame is internal to our library.
 */
const isInternalFrame = (file: string): boolean => {
  // Frames from our error handling utilities
  const internalPatterns = [
    '/err/wrap.',
    '/err/try.',
    '/err/stack.',
    '/fn/curry.', // Our curry utilities used by wrapWith
  ]

  return internalPatterns.some(pattern => file.includes(pattern))
}

/**
 * Clean a stack trace by removing internal frames and applying filters.
 */
export const cleanStack = (stack: string, options?: StackOptions): string => {
  const opts = {
    removeInternal: true,
    filterPatterns: ['node_modules', 'node:internal'],
    maxFrames: 10,
    includeSource: false,
    sourceContext: 2,
    ...options,
  }

  const frames = parseStack(stack)

  let filteredFrames = frames

  // Remove internal frames
  if (opts.removeInternal) {
    filteredFrames = filteredFrames.filter(frame => !frame.isInternal)
  }

  // Apply custom filters
  if (opts.filterPatterns.length > 0) {
    filteredFrames = filteredFrames.filter(frame => !opts.filterPatterns.some(pattern => frame.file.includes(pattern)))
  }

  // Limit frames
  if (opts.maxFrames > 0) {
    filteredFrames = filteredFrames.slice(0, opts.maxFrames)
  }

  // Reconstruct stack trace
  const cleanedLines = filteredFrames.map(frame => frame.raw)

  // Get the error message (first line)
  const firstLine = Str.lines(stack)[0] || 'Error'

  return [firstLine, ...cleanedLines].join('\n')
}

/**
 * Format a stack frame for better readability.
 */
export const formatFrame = (frame: StackFrame): string => {
  const location = `${frame.file}:${frame.line}:${frame.column}`
  const func = frame.function === '<anonymous>' ? '' : `${frame.function} `

  return `at ${func}(${location})`
}

/**
 * Enhanced Error class that automatically cleans stack traces.
 */
export class CleanError extends Error {
  /**
   * Original uncleaned stack trace.
   */
  originalStack?: string

  /**
   * Additional context for the error.
   */
  context?: Context

  constructor(message: string, options?: ErrorOptions & { context?: Context; stackOptions?: StackOptions }) {
    super(message, options)
    this.name = this.constructor.name

    if (options?.context) {
      this.context = options.context
    }

    // Clean the stack trace
    if (this.stack) {
      this.originalStack = this.stack
      this.stack = cleanStack(this.stack, options?.stackOptions)
    }

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Merge stack traces from multiple errors (useful for wrapped errors).
 * This preserves the full error chain while removing duplicates.
 */
export const mergeStacks = (wrapper: Error, cause: Error): string => {
  if (!wrapper.stack || !cause.stack) {
    return wrapper.stack || cause.stack || ''
  }

  const wrapperFrames = parseStack(wrapper.stack)
  const causeFrames = parseStack(cause.stack)

  // Find where the wrapper's stack ends (usually at our wrap functions)
  const wrapperEndIndex = wrapperFrames.findIndex(frame => frame.isInternal)

  // Take wrapper frames up to the internal boundary
  const relevantWrapperFrames = wrapperEndIndex >= 0
    ? wrapperFrames.slice(0, wrapperEndIndex)
    : wrapperFrames

  // Combine: wrapper's user frames + all cause frames
  const combined = [...relevantWrapperFrames, ...causeFrames]

  // Remove duplicates (same file:line:col)
  const seen = new Set<string>()
  const unique = combined.filter(frame => {
    const key = `${frame.file}:${frame.line}:${frame.column}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Get error messages
  const wrapperMessage = Str.lines(wrapper.stack)[0]!
  const causeMessage = Str.lines(cause.stack)[0]!

  // Build merged stack
  const frames = unique.map(frame => frame.raw)

  return [
    wrapperMessage,
    ...frames,
    '',
    'Caused by:',
    causeMessage,
  ].join('\n')
}

/**
 * Capture the current stack trace at a specific point.
 * Useful for adding trace information without throwing.
 */
export const captureStackTrace = (message = 'Captured stack'): string => {
  const obj = { stack: '' }
  Error.captureStackTrace(obj, captureStackTrace)
  return `${message}\n${obj.stack}`
}

/**
 * Get the caller information from the current stack.
 */
export const getCaller = (depth = 1): StackFrame | undefined => {
  const obj = { stack: '' }
  Error.captureStackTrace(obj, getCaller)
  const frames = parseStack(obj.stack)
  return frames[depth]
}
