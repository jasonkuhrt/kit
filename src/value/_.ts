// @ts-expect-error Duplicate identifier
export * as Value from './__.js'

/**
 * General value utilities for common JavaScript values and patterns.
 *
 * Provides utilities for lazy values, type guards for symbols and dates,
 * identity proxies, and lazy value resolution. Includes helpers for working
 * with deferred computations and value type checking.
 *
 * @category Utils
 */
export namespace Value {}
