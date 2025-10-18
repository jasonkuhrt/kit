// @ts-expect-error Duplicate identifier
export * as Prom from './$$.js'

/**
 * Promise utilities for asynchronous operations.
 *
 * Provides utilities for working with Promises including deferred promise
 * creation, promise combinators, and async control flow patterns.
 *
 * @category Domains
 */
export namespace Prom {}
