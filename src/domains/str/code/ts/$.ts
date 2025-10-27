/**
 * TypeScript code generation module.
 *
 * Provides a comprehensive API for generating TypeScript code with:
 * - Universal composability - all functions accept string | TermObject | Raw | Builder
 * - Builder pattern for imperative construction
 * - Template function for declarative construction
 * - Factory pattern for reusable generators
 * - Automatic reserved keyword handling
 *
 * @module
 */

// Re-export namespaces
export * as Comment from './comment.js'
export * as Reserved from './reserved.js'
export * as TermObject from './term-object.js'

// Re-export all functions from ts.js (the main API)
export * from './ts.js'

// Re-export builder infrastructure
export * from './builder.js'
