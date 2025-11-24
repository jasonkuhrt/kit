// @ts-expect-error Duplicate identifier
export * as Md from './md/_.js'
/**
 * Markdown string utilities for code documentation.
 *
 * Provides functions for generating markdown elements like inline code,
 * links, and tables.
 */
export namespace Md {}

// @ts-expect-error Duplicate identifier
export * as TSDoc from './tsdoc/_.js'
/**
 * TSDoc/JSDoc string utilities for code documentation.
 *
 * Provides safe JSDoc generation with automatic escaping, builder API,
 * and structured tag helpers.
 */
export namespace TSDoc {}

// @ts-expect-error Duplicate identifier
export * as TS from './ts/_.js'
/**
 * TypeScript code generation utilities.
 *
 * Provides functions for generating TypeScript syntax elements like
 * types, interfaces, imports, and exports.
 */
export namespace TS {}
