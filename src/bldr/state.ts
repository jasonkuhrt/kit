/**
 * Base state interface for immutable builders.
 *
 * @category Builder State
 */
export interface State {}

/**
 * Symbol used for passing state between nested builders.
 *
 * @example
 * ```ts
 * const nestedBuilder = {
 *   [StateSymbol]: internalState,
 *   method: () => ...
 * }
 * ```
 *
 * @category Builder State
 */
export const StateSymbol = Symbol('BuilderState')

/**
 * Type representing the StateSymbol.
 *
 * @category Builder State
 */
export type StateSymbol = typeof StateSymbol
