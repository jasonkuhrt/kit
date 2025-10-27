// @ts-expect-error Duplicate identifier
export * as Ware from './$$.js'

/**
 * Anyware (middleware) utilities for building extensible pipelines.
 *
 * Provides a complete middleware system with pipeline definitions, interceptors,
 * extensions, and step-based execution flow. Supports building complex request/response
 * processing pipelines with type-safe hooks and transformations.
 *
 * @category Utils
 */
export namespace Ware {}
