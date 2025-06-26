import { Traitor } from '#traitor'

/**
 * Global singleton traitor instance for trait registration and dispatch.
 *
 * @example
 * ```ts
 * import { traitor } from '#global'
 *
 * const traitResult = traitor.trait('Eq', (dispatch) => ({
 *   is: (a, b) => dispatch('is', a, b),
 * }))
 * ```
 */
export const traitor = Traitor.create()
