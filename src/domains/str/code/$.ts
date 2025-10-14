// @ts-expect-error Duplicate identifier
export * as Md from './md/$.js'
/**
 * Markdown string utilities for code documentation.
 */
export namespace Md {}

// @ts-expect-error Duplicate identifier
export * as TSDoc from './tsdoc/$.js'
/**
 * TSDoc/JSDoc string utilities for code documentation.
 */
export namespace TSDoc {}

// @ts-expect-error Duplicate identifier
export * as TS from './ts/$.js'
/**
 * TypeScript code generation utilities.
 */
export namespace TS {}
