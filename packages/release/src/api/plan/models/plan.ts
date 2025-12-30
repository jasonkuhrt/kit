import { Schema as S } from 'effect'
import { ItemSchema } from './item.js'

/**
 * Release plan - the unified schema for both domain model and file format.
 *
 * The plan is persisted to `.release/plan.json` and contains all data needed
 * to execute releases. Commit metadata (author, date, full CC structure)
 * is preserved; flattening for changelogs happens lazily at generation time.
 */
export class Plan extends S.TaggedClass<Plan>()('Plan', {
  type: S.Literal('stable', 'preview', 'pr'),
  timestamp: S.String,
  releases: S.Array(ItemSchema),
  cascades: S.Array(ItemSchema),
}) {
  static is = S.is(Plan)

  /**
   * Empty plan for resource initialization.
   */
  static empty = Plan.make({
    type: 'stable',
    timestamp: '',
    releases: [],
    cascades: [],
  })
}

/**
 * Release type literal.
 */
export type ReleaseType = 'stable' | 'preview' | 'pr'

/**
 * Create a plan from releases and cascades.
 */
export const make = (
  type: ReleaseType,
  releases: Plan['releases'],
  cascades: Plan['cascades'],
): Plan =>
  Plan.make({
    type,
    timestamp: new Date().toISOString(),
    releases: [...releases],
    cascades: [...cascades],
  })
