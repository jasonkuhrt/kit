/**
 * Name of a trait (e.g., 'Eq', 'Ord', 'Show').
 * Traits define polymorphic interfaces across domains.
 */
export type TraitName = string

/**
 * Name of a method within a trait (e.g., 'is', 'compare').
 */
export type MethodName = string

/**
 * Generic method signature for trait methods.
 * Used for type constraints when more specific types aren't known.
 */
export interface Method<Args extends any[] = any[], Return = any> {
  (...args: Args): Return
}
