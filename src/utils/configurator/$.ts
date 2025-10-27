// @ts-expect-error Duplicate identifier
export * as Configurator from './$$.js'

/**
 * Configurator builder utilities.
 *
 * Provides a builder pattern for creating type-safe configuration systems with
 * input normalization, defaults, and custom merge strategies.
 *
 * @category Utils
 */
export namespace Configurator {}
