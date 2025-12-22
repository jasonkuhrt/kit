// @ts-expect-error Duplicate identifier
export * as Pat from './__.js'

/**
 * Pattern matching utilities for declarative value matching.
 *
 * Provides a DSL for matching values against patterns including literals,
 * regex, constraints, and combinators. Compiles to Effect Schemas.
 *
 * @category Domains
 */
export namespace Pat {}
