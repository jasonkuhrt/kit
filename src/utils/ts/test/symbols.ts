/**
 * Unicode symbols for type-level error messages.
 *
 * These symbols provide visual cues in TypeScript error displays to quickly
 * communicate the nature of type mismatches without relying on emoji.
 *
 * All symbols are text-based Unicode characters that render consistently
 * across different environments and editors.
 */

/**
 * Cross mark - indicates an error or type mismatch occurred.
 * Used in error messages to denote failures or incompatibilities.
 */
export const CROSS = `✕`

/**
 * Warning sign - indicates a potential issue or cautionary note.
 * Used when types are equivalent but not structurally exact.
 */
export const WARNING = `⚠`

/**
 * Lightning bolt - indicates type coercion or transformation.
 * Used when automatic type conversions occur.
 */
export const LIGHTNING = `⚡`

/**
 * Exclusion symbol - indicates type exclusion or prohibition.
 * Used when certain types are explicitly not allowed.
 */
export const EXCLUSION = `⊘`

/**
 * Empty set - indicates an empty type or no valid values.
 * Used when a type has no inhabitants (like never in certain contexts).
 */
export const EMPTY_SET = `∅`
