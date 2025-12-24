import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Err } from '@kitz/core'
import { Env } from '@kitz/env'
import { Git, type GitError } from '@kitz/git/__'
import { Effect } from 'effect'
import { buildDependencyGraph, detectCascades } from './cascade.js'
import type { Package } from './discovery.js'
import { publishAll, PublishError } from './publish.js'
import {
  aggregateByPackage,
  type BumpType,
  calculateNextVersion,
  calculatePreviewVersion,
  calculatePrVersion,
  extractImpacts,
  findLatestPreviewNumber,
  findLatestPrNumber,
  findLatestTagVersion,
} from './version.js'

/**
 * Error during release process.
 */
export const ReleaseError = Err.TaggedContextualError('ReleaseError').constrain<{
  readonly operation: 'plan' | 'apply' | 'tag'
  readonly detail?: string
}>({
  message: (ctx) =>
    ctx.detail ? `Failed to ${ctx.operation} release: ${ctx.detail}` : `Failed to ${ctx.operation} release`,
})

export type ReleaseError = InstanceType<typeof ReleaseError>

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
): Effect.Effect<ReleasePlan, ReleaseError | GitError | PlatformError, Git | FileSystem.FileSystem> =>
  Effect.gen(function*() {
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

    // 7. Detect cascade releases (packages that depend on released packages)
    const dependencyGraph = yield* buildDependencyGraph(ctx.packages)
    const cascades = detectCascades(ctx.packages, releases, dependencyGraph, tags)

    return { releases, cascades }
  })

/**
 * Detect cascades for preview releases with preview version format.
 */
const detectCascadesForPreview = (
  packages: Package[],
  primaryReleases: PlannedRelease[],
  dependencyGraph: Map<string, string[]>,
  tags: string[],
): PlannedRelease[] => {
  // Get standard cascades
  const baseCascades = detectCascades(packages, primaryReleases, dependencyGraph, tags)

  // Convert to preview versions
  return baseCascades.map((cascade) => {
    // The nextVersion from detectCascades is a stable version (e.g., 1.0.1)
    // We need to convert it to a preview version
    const previewNumber = findLatestPreviewNumber(cascade.package.name, cascade.nextVersion, tags)
    const previewVersion = calculatePreviewVersion(cascade.nextVersion, previewNumber)

    return {
      ...cascade,
      nextVersion: previewVersion,
    }
  })
}

/**
 * Detect cascades for PR releases with PR version format.
 */
const detectCascadesForPr = (
  packages: Package[],
  primaryReleases: PlannedRelease[],
  dependencyGraph: Map<string, string[]>,
  tags: string[],
  prNumber: number,
  sha: string,
): PlannedRelease[] => {
  // Get standard cascades
  const baseCascades = detectCascades(packages, primaryReleases, dependencyGraph, tags)

  // Convert to PR versions
  return baseCascades.map((cascade) => {
    const prReleaseNumber = findLatestPrNumber(cascade.package.name, prNumber, tags)
    const prVersion = calculatePrVersion(prNumber, prReleaseNumber, sha)

    return {
      ...cascade,
      nextVersion: prVersion,
    }
  })
}

/**
 * Plan a preview (canary) release.
 *
 * Creates pre-release versions for unreleased changes.
 * Preview versions follow the pattern: `${nextStable}-next.${n}`
 *
 * @example
 * ```ts
 * const plan = await Effect.runPromise(
 *   Effect.provide(planPreview(ctx, { dryRun: true }), GitLive)
 * )
 * ```
 */
export const planPreview = (
  ctx: PlanContext,
  options?: ReleaseOptions,
): Effect.Effect<ReleasePlan, ReleaseError | GitError | PlatformError, Git | FileSystem.FileSystem> =>
  Effect.gen(function*() {
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

    // 6. Build release plan with preview versions
    const releases: PlannedRelease[] = []

    for (const [scope, { bump, commits: commitMessages }] of aggregated) {
      const pkg = scopeToPackage.get(scope)
      if (!pkg) continue

      // Apply package filters
      if (options?.packages && !options.packages.includes(pkg.name)) continue
      if (options?.exclude?.includes(pkg.name)) continue

      // Find current stable version from tags
      const currentVersion = findLatestTagVersion(pkg.name, tags)

      // Calculate what the next stable version would be
      const nextStableVersion = calculateNextVersion(currentVersion, bump)

      // Find existing preview releases for this version
      const previewNumber = findLatestPreviewNumber(pkg.name, nextStableVersion, tags)

      // Calculate preview version
      const nextVersion = calculatePreviewVersion(nextStableVersion, previewNumber)

      releases.push({
        package: pkg,
        currentVersion,
        nextVersion,
        bump,
        commits: commitMessages,
      })
    }

    // 7. Detect cascade releases
    const dependencyGraph = yield* buildDependencyGraph(ctx.packages)
    const cascades = detectCascadesForPreview(ctx.packages, releases, dependencyGraph, tags)

    return { releases, cascades }
  })

/**
 * Options for PR release planning.
 */
export interface PrReleaseOptions extends ReleaseOptions {
  /**
   * PR number. If not provided, will attempt to detect from environment variables:
   * - GITHUB_PR_NUMBER (GitHub Actions)
   * - PR_NUMBER (generic CI)
   * - CI_PULL_REQUEST (CircleCI - extracts number from URL)
   */
  readonly prNumber?: number
}

/**
 * Plan a PR release.
 *
 * Creates PR-specific versions for testing.
 * PR versions follow the pattern: `0.0.0-pr.${prNumber}.${n}.${sha}`
 *
 * @example
 * ```ts
 * const plan = await Effect.runPromise(
 *   Effect.provide(planPr(ctx, { prNumber: 123 }), layer)
 * )
 * ```
 */
export const planPr = (
  ctx: PlanContext,
  options?: PrReleaseOptions,
): Effect.Effect<ReleasePlan, ReleaseError | GitError | PlatformError, Git | FileSystem.FileSystem | Env.Env> =>
  Effect.gen(function*() {
    const git = yield* Git
    const env = yield* Env.Env

    // 1. Detect PR number
    const prNumber = options?.prNumber ?? detectPrNumber(env.vars)
    if (prNumber === null) {
      return yield* Effect.fail(
        new ReleaseError({
          context: {
            operation: 'plan',
            detail:
              'Could not detect PR number. Set PR_NUMBER or GITHUB_PR_NUMBER environment variable, or pass prNumber option.',
          },
        }),
      )
    }

    // 2. Get HEAD SHA
    const sha = yield* git.getHeadSha()

    // 3. Get all tags
    const tags = yield* git.getTags()
    const lastReleaseTag = findLastReleaseTag(ctx.packages, tags)

    // 4. Get commits since last release
    const commits = yield* git.getCommitsSince(lastReleaseTag)

    // 5. Parse commits and extract package impacts
    const allImpacts = yield* Effect.all(
      commits.map((c) => extractImpacts(c.message)),
      { concurrency: 'unbounded' },
    )
    const impacts = allImpacts.flat()

    // 6. Aggregate by package to get highest bump per package
    const aggregated = aggregateByPackage(impacts)

    // 7. Build scope-to-package map for lookup
    const scopeToPackage = new Map(ctx.packages.map((p) => [p.scope, p]))

    // 8. Build release plan with PR versions
    const releases: PlannedRelease[] = []

    for (const [scope, { bump, commits: commitMessages }] of aggregated) {
      const pkg = scopeToPackage.get(scope)
      if (!pkg) continue

      // Apply package filters
      if (options?.packages && !options.packages.includes(pkg.name)) continue
      if (options?.exclude?.includes(pkg.name)) continue

      // Find current stable version from tags
      const currentVersion = findLatestTagVersion(pkg.name, tags)

      // Find existing PR releases for this PR
      const prReleaseNumber = findLatestPrNumber(pkg.name, prNumber, tags)

      // Calculate PR version
      const nextVersion = calculatePrVersion(prNumber, prReleaseNumber, sha)

      releases.push({
        package: pkg,
        currentVersion,
        nextVersion,
        bump,
        commits: commitMessages,
      })
    }

    // 9. Detect cascade releases
    const dependencyGraph = yield* buildDependencyGraph(ctx.packages)
    const cascades = detectCascadesForPr(ctx.packages, releases, dependencyGraph, tags, prNumber, sha)

    return { releases, cascades }
  })

/**
 * Detect PR number from environment variables.
 */
const detectPrNumber = (vars: Record<string, string | undefined>): number | null => {
  // GitHub Actions
  if (vars['GITHUB_PR_NUMBER']) {
    const num = parseInt(vars['GITHUB_PR_NUMBER'], 10)
    if (!isNaN(num)) return num
  }

  // Generic CI
  if (vars['PR_NUMBER']) {
    const num = parseInt(vars['PR_NUMBER'], 10)
    if (!isNaN(num)) return num
  }

  // CircleCI (URL format: https://github.com/org/repo/pull/123)
  if (vars['CI_PULL_REQUEST']) {
    const match = vars['CI_PULL_REQUEST'].match(/\/pull\/(\d+)/)
    if (match) {
      const num = parseInt(match[1]!, 10)
      if (!isNaN(num)) return num
    }
  }

  return null
}

/**
 * Options for applying a release plan.
 */
export interface ApplyOptions {
  /** Skip npm publish */
  readonly dryRun?: boolean
  /** npm dist-tag (default: 'latest') */
  readonly tag?: string
  /** npm registry URL */
  readonly registry?: string
}

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
  plan: ReleasePlan,
  options?: ApplyOptions,
): Effect.Effect<ReleaseResult, ReleaseError | GitError | PublishError, Git | FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const git = yield* Git

    // Combine primary releases and cascades
    const allReleases = [...plan.releases, ...plan.cascades]

    if (allReleases.length === 0) {
      return { released: [], tags: [] }
    }

    // 1. Publish all packages (version injection/restoration handled internally)
    yield* publishAll(allReleases, options)

    // 2. Create git tags for each release
    const tags: string[] = []
    for (const release of allReleases) {
      const tag = `${release.package.name}@${release.nextVersion}`
      tags.push(tag)

      if (options?.dryRun) {
        yield* Effect.log(`[dry-run] Would create tag: ${tag}`)
      } else {
        yield* git.createTag(tag, `Release ${release.package.name}@${release.nextVersion}`)
      }
    }

    return { released: allReleases, tags }
  })
