// @ts-expect-error Duplicate identifier
export * as Err from './$$.js'

/**
 * Error handling utilities for robust error management.
 *
 * Provides utilities for error inspection, stack trace manipulation, try-catch wrappers,
 * type guards, and null safety. Features formatted error logging and error wrapping utilities.
 *
 * @category Domains
 */
export namespace Err {}
