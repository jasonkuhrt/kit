import type { Item } from '../../plan/models/item.js'

/**
 * Result of executing a release.
 */
export interface Result {
  readonly released: Item[]
  readonly tags: readonly string[]
}
