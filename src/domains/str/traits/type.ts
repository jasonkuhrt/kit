import { Type as TypeTrait } from '#Type'
import { domain } from '../domain.ts'

//
//
//
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ • Registration
//
//

declare global {
  interface TRAITOR_DOMAINS_Type {
    Str: typeof Type
  }
}

/**
 * Register the String Type implementation with the global trait registry.
 * This enables polymorphic type checking to dispatch to this implementation
 * when checking string values.
 */
export const Type = TypeTrait.$.implement(domain, {
  is(value) {
    return typeof value === 'string'
  },
})
