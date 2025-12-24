import { Data, Effect } from 'effect'
import { Git } from '@kitz/git/__'
import type { Package } from './discovery.js'

/**
 * Error during release process.
 */
export class ReleaseError extends Data.TaggedError('ReleaseError')<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Options for release operations.
 */
export interface ReleaseOptions {
  /** Skip npm publish */
  readonly dryRun?: boolean
  /** Only include specific packages */
  readonly packages?: string[]
  /** Exclude specific packages */
  readonly exclude?: string[]
}

/**
 * A planned package release.
 */
export interface PlannedRelease {
  readonly package: Package
  readonly currentVersion: string | null
  readonly nextVersion: string
  readonly bump: 'major' | 'minor' | 'patch'
  readonly commits: readonly string[]
}

/**
 * Release plan result.
 */
export interface ReleasePlan {
  readonly releases: PlannedRelease[]
  readonly cascades: PlannedRelease[]
}

/**
 * Result of executing a release.
 */
export interface ReleaseResult {
  readonly released: PlannedRelease[]
  readonly tags: string[]
}

/**
 * Plan a stable release.
 *
 * Analyzes commits since last release and determines version bumps.
 *
 * @example
 * ```ts
 * const plan = await Effect.runPromise(
 *   Effect.provide(planStable({ dryRun: true }), GitLive)
 * )
 * ```
 */
export const planStable = (
  _options?: ReleaseOptions,
): Effect.Effect<ReleasePlan, ReleaseError, Git> =>
  Effect.gen(function* () {
    const _git = yield* Git

    // TODO: Implement stable release planning
    // 1. Get commits since last release tag
    // 2. Parse conventional commits
    // 3. Determine version bumps
    // 4. Detect cascade releases

    return {
      releases: [],
      cascades: [],
    }
  })

/**
 * Plan a preview (canary) release.
 *
 * Creates pre-release versions for unreleased changes.
 *
 * @example
 * ```ts
 * const plan = await Effect.runPromise(
 *   Effect.provide(planPreview({ dryRun: true }), GitLive)
 * )
 * ```
 */
export const planPreview = (
  _options?: ReleaseOptions,
): Effect.Effect<ReleasePlan, ReleaseError, Git> =>
  Effect.gen(function* () {
    const _git = yield* Git

    // TODO: Implement preview release planning
    // 1. Get commits since last release tag
    // 2. Calculate next-N version

    return {
      releases: [],
      cascades: [],
    }
  })

/**
 * Plan a PR release.
 *
 * Creates PR-specific versions for testing.
 *
 * @example
 * ```ts
 * const plan = await Effect.runPromise(
 *   Effect.provide(planPr({ dryRun: true }), GitLive)
 * )
 * ```
 */
export const planPr = (
  _options?: ReleaseOptions,
): Effect.Effect<ReleasePlan, ReleaseError, Git> =>
  Effect.gen(function* () {
    const _git = yield* Git

    // TODO: Implement PR release planning
    // 1. Detect PR number from environment
    // 2. Generate 0.0.0-pr.N.M.SHA version

    return {
      releases: [],
      cascades: [],
    }
  })

/**
 * Apply a release plan.
 *
 * Publishes packages and creates git tags.
 *
 * @example
 * ```ts
 * const result = await Effect.runPromise(
 *   Effect.provide(apply(plan, { dryRun: false }), GitLive)
 * )
 * ```
 */
export const apply = (
  _plan: ReleasePlan,
  _options?: { dryRun?: boolean },
): Effect.Effect<ReleaseResult, ReleaseError, Git> =>
  Effect.gen(function* () {
    const _git = yield* Git

    // TODO: Implement release apply
    // 1. Inject versions into package.json
    // 2. Run npm publish
    // 3. Create git tags
    // 4. Create GitHub releases
    // 5. Restore package.json

    return {
      released: [],
      tags: [],
    }
  })
