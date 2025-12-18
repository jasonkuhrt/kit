// @ts-expect-error Duplicate identifier
export * as Mod from './__.js'

/**
 * ES Module utilities.
 *
 * Provides utilities for working with ES modules including
 * Effect-based dynamic imports with cache busting support.
 *
 * @category Domains
 */
export namespace Mod {}
