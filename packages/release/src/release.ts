import { Data, Effect } from 'effect'
import { Git, type GitError } from '@kitz/git/__'
import type { Package } from './discovery.js'
import {
  extractImpacts,
  aggregateByPackage,
  calculateNextVersion,
  findLatestTagVersion,
  type BumpType,
} from './version.js'

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
  readonly bump: BumpType
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
 * Context required for planning releases.
 */
export interface PlanContext {
  readonly packages: Package[]
}

/**
 * Find the most recent release tag across all packages.
 * Used to determine which commits to analyze.
 */
const findLastReleaseTag = (
  packages: Package[],
  tags: string[],
): string | undefined => {
  // Find tags that match our package pattern: @scope/name@version
  const releaseTagPattern = /^(@[^@]+\/[^@]+|[^@]+)@\d+\.\d+\.\d+/
  const releaseTags = tags.filter((t) => releaseTagPattern.test(t))

  // Filter to only tags for our packages
  const packageNames = new Set(packages.map((p) => p.name))
  const ourTags = releaseTags.filter((tag) => {
    const atIndex = tag.lastIndexOf('@')
    if (atIndex <= 0) return false
    const name = tag.slice(0, atIndex)
    return packageNames.has(name)
  })

  // Return the most recent one (last in array, assuming git returns in order)
  return ourTags[ourTags.length - 1]
}

/**
 * Plan a stable release.
 *
 * Analyzes commits since last release and determines version bumps.
 *
 * @example
 * ```ts
 * const plan = await Effect.runPromise(
 *   Effect.provide(planStable(ctx, { dryRun: true }), GitLive)
 * )
 * ```
 */
export const planStable = (
  ctx: PlanContext,
  options?: ReleaseOptions,
): Effect.Effect<ReleasePlan, ReleaseError | GitError, Git> =>
  Effect.gen(function* () {
    const git = yield* Git

    // 1. Get all tags and find the last release tag
    const tags = yield* git.getTags()
    const lastReleaseTag = findLastReleaseTag(ctx.packages, tags)

    // 2. Get commits since last release (or all commits if no releases yet)
    const commits = yield* git.getCommitsSince(lastReleaseTag)

    // 3. Parse commits and extract package impacts
    const allImpacts = yield* Effect.all(
      commits.map((c) => extractImpacts(c.message)),
      { concurrency: 'unbounded' },
    )
    const impacts = allImpacts.flat()

    // 4. Aggregate by package to get highest bump per package
    const aggregated = aggregateByPackage(impacts)

    // 5. Build scope-to-package map for lookup
    const scopeToPackage = new Map(ctx.packages.map((p) => [p.scope, p]))

    // 6. Build release plan
    const releases: PlannedRelease[] = []

    for (const [scope, { bump, commits: commitMessages }] of aggregated) {
      const pkg = scopeToPackage.get(scope)
      if (!pkg) continue // Scope doesn't match any known package

      // Apply package filters
      if (options?.packages && !options.packages.includes(pkg.name)) continue
      if (options?.exclude?.includes(pkg.name)) continue

      // Find current version from tags
      const currentVersion = findLatestTagVersion(pkg.name, tags)

      // Calculate next version
      const nextVersion = calculateNextVersion(currentVersion, bump)

      releases.push({
        package: pkg,
        currentVersion,
        nextVersion,
        bump,
        commits: commitMessages,
      })
    }

    // TODO: Detect cascade releases (packages that depend on released packages)
    const cascades: PlannedRelease[] = []

    return { releases, cascades }
  })

/**
 * Plan a preview (canary) release.
 *
 * Creates pre-release versions for unreleased changes.
 *
 * @example
 * ```ts
 * const plan = await Effect.runPromise(
 *   Effect.provide(planPreview(ctx, { dryRun: true }), GitLive)
 * )
 * ```
 */
export const planPreview = (
  _ctx: PlanContext,
  _options?: ReleaseOptions,
): Effect.Effect<ReleasePlan, ReleaseError | GitError, Git> =>
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
 *   Effect.provide(planPr(ctx, { dryRun: true }), GitLive)
 * )
 * ```
 */
export const planPr = (
  _ctx: PlanContext,
  _options?: ReleaseOptions,
): Effect.Effect<ReleasePlan, ReleaseError | GitError, Git> =>
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
