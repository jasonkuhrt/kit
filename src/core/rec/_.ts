// @ts-expect-error Duplicate identifier
export * as Rec from './__.js'

/**
 * Record utilities for working with plain JavaScript objects as dictionaries.
 *
 * Provides type-safe operations for records (objects with PropertyKey indexes)
 * including type guards, merging, creation, and index signature manipulation.
 * Strictly validates plain objects, rejecting arrays and class instances.
 *
 * @category Domains
 */
export namespace Rec {}
