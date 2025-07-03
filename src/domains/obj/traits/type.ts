import { Traitor } from '#traitor'
import { Type as TypeTrait } from '../../../traits/type.ts'
import { domain } from '../domain.ts'

export const Type = Traitor.implement(TypeTrait, domain, {
  is(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  },
})
