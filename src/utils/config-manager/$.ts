// @ts-expect-error Duplicate identifier
export * as ConfigManager from './$$.js'

/**
 * Configuration manager utilities.
 *
 * Provides utilities for managing nested configuration objects with type-safe
 * path operations, merging strategies, and default value handling.
 *
 * @category Utils
 */
export namespace ConfigManager {}
