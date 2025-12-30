/**
 * Options for applying a release plan.
 */
export interface ApplyOptions {
  /** Skip npm publish and git operations */
  readonly dryRun?: boolean
  /** npm dist-tag (default: 'latest') */
  readonly tag?: string
  /** npm registry URL */
  readonly registry?: string
  /** Path to workflow database (default: .release/workflow.db) */
  readonly dbPath?: string
}
