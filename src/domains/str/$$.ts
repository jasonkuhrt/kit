export * from './box/$.js'
export * from './builder.js'
export * from './case/$.js'
export * from './char/$.js'
export * from './length.js'
export * from './match.js'
export * from './misc.js'
export * from './nat/$.js'
export * from './replace.js'
export * from './split.js'
export * from './table.js'
export * from './template.js'
export * from './tpl/$.js'
export { Arb } from './traits/arb.js'
export { Eq } from './traits/eq.js'
export { Type } from './traits/type.js'
export type * from './type-level.js'
export { Empty, isEmpty } from './type.js'

// @ts-expect-error Duplicate identifier
export * as Code from './code/$$.js'
/**
 * Code generation and documentation utilities.
 *
 * Provides tools for generating markdown, TSDoc/JSDoc, and TypeScript code.
 * Includes safe JSDoc generation with escaping, builder API, and structured tag helpers.
 *
 * @category Code Generation
 */
export namespace Code {}

// @ts-expect-error Duplicate identifier
export * as Text from './text.js'
/**
 * Multi-line text formatting and layout utilities.
 *
 * Provides functions specifically for working with multi-line strings treated as text content:
 * - **Line operations**: Split into lines, join lines, map transformations per line
 * - **Indentation**: Add/remove indentation, strip common leading whitespace
 * - **Alignment**: Pad text, span to width, fit to exact width
 * - **Block formatting**: Format blocks with prefixes, styled borders
 *
 * **Use Text for**: Operations that treat strings as multi-line content with visual layout
 * (indentation, padding for tables, line-by-line transformations).
 *
 * **Use root Str for**: Primitive string operations (split, join, replace, match, trim)
 * that work on strings as atomic values.
 *
 * @category Text Formatting
 */
export namespace Text {}

// @ts-expect-error Duplicate identifier
export * as Visual from './visual.js'
/**
 * Visual-aware string utilities that handle ANSI escape codes and grapheme clusters.
 *
 * These functions measure and manipulate strings based on their visual appearance,
 * not raw character count. Useful for terminal output, tables, and formatted text.
 *
 * @category Text Formatting
 */
export namespace Visual {}
