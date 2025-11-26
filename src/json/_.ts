// @ts-expect-error Duplicate identifier
export * as Json from './__.js'

/**
 * JSON utilities with Effect Schema integration.
 *
 * Provides type-safe JSON operations including type guards, parsing, encoding,
 * and validation using Effect Schema. Supports JSON primitives, objects, and
 * recursive value structures with comprehensive error handling.
 *
 * @category Domains
 */
export namespace Json {}
