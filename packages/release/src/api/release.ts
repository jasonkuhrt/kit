import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Err } from '@kitz/core'
import { Env } from '@kitz/env'
import { Fs } from '@kitz/fs'
import { Git } from '@kitz/git'
import { Semver } from '@kitz/semver'
import { Effect, Option, Schema as S } from 'effect'
import { buildDependencyGraph, detect as detectCascades } from './cascade.js'
import { PreviewPrerelease, PrPrerelease } from './prerelease.js'
import type { Package } from './scanner.js'
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
  type StructuredCommit,
} from './version.js'
import { executeWorkflow, makeWorkflowRuntime } from './workflow.js'

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
  readonly packages?: readonly string[]
  /** Exclude specific packages */
  readonly exclude?: readonly string[]
}

// ============================================================================
// Stable Version (First | Increment)
// ============================================================================

/**
 * First release of a package - no previous version exists.
 */
export class StableVersionFirst extends S.Class<StableVersionFirst>('First')({
  version: Semver.SemverSchema,
}) {
  static is = S.is(StableVersionFirst)
}

/**
 * Increment from an existing version.
 */
export class StableVersionIncrement extends S.Class<StableVersionIncrement>('Increment')({
  from: Semver.SemverSchema,
  to: Semver.SemverSchema,
  bump: S.Literal('major', 'minor', 'patch'),
}) {
  static is = S.is(StableVersionIncrement)
}

/**
 * A stable version is either the first release or an increment.
 */
export type StableVersion = StableVersionFirst | StableVersionIncrement

// ============================================================================
// Planned Release (Stable | Preview | Pr)
// ============================================================================

/**
 * Common schema properties for all planned releases.
 * Note: `package` and `commits` are not Schema-encoded as they contain
 * complex runtime types (Package, StructuredCommit).
 */
const PlannedReleaseBaseFields = {
  package: S.Any as S.Schema<Package>,
  commits: S.Array(S.Any) as S.Schema<readonly StructuredCommit[]>,
}

/**
 * A stable release to npm.
 */
export class StablePlannedRelease extends S.Class<StablePlannedRelease>('Stable')({
  ...PlannedReleaseBaseFields,
  version: S.Union(StableVersionFirst, StableVersionIncrement),
}) {
  static is = S.is(StablePlannedRelease)
}

/**
 * A preview (canary) release.
 * Version format: `${baseVersion}-next.${iteration}`
 */
export class PreviewPlannedRelease extends S.Class<PreviewPlannedRelease>('Preview')({
  ...PlannedReleaseBaseFields,
  baseVersion: Semver.SemverSchema,
  prerelease: PreviewPrerelease,
}) {
  static is = S.is(PreviewPlannedRelease)
}

/**
 * A PR-specific release for testing.
 * Version format: `0.0.0-pr.${prNumber}.${iteration}.${sha}`
 */
export class PrPlannedRelease extends S.Class<PrPlannedRelease>('Pr')({
  ...PlannedReleaseBaseFields,
  prerelease: PrPrerelease,
}) {
  static is = S.is(PrPlannedRelease)
}

/**
 * A planned package release - discriminated union of release types.
 */
export type PlannedRelease = StablePlannedRelease | PreviewPlannedRelease | PrPlannedRelease

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get the next version from a stable version.
 */
const getStableVersionNext = (version: StableVersion): Semver.Semver =>
  StableVersionFirst.is(version) ? version.version : version.to

/**
 * Get the next version from a planned release.
 */
export const getNextVersion = (release: PlannedRelease): Semver.Semver => {
  if (StablePlannedRelease.is(release)) {
    return getStableVersionNext(release.version)
  }
  if (PreviewPlannedRelease.is(release)) {
    return Semver.fromString(`${release.baseVersion.version}-next.${release.prerelease.iteration}`)
  }
  return Semver.fromString(
    `0.0.0-pr.${release.prerelease.prNumber}.${release.prerelease.iteration}.${release.prerelease.sha}`,
  )
}

/**
 * Get the current version from a stable version.
 */
const getStableVersionCurrent = (version: StableVersion): Option.Option<Semver.Semver> =>
  StableVersionFirst.is(version) ? Option.none() : Option.some(version.from)

/**
 * Get the current version from a planned release (if any).
 */
export const getCurrentVersion = (release: PlannedRelease): Option.Option<Semver.Semver> => {
  if (StablePlannedRelease.is(release)) {
    return getStableVersionCurrent(release.version)
  }
  if (PreviewPlannedRelease.is(release)) {
    return Option.some(release.baseVersion)
  }
  return Option.none()
}

/**
 * Get the bump type for a stable version.
 */
const getStableVersionBump = (version: StableVersion): BumpType =>
  StableVersionFirst.is(version) ? 'minor' : version.bump

/**
 * Get the bump type for a release.
 */
export const getBumpType = (release: PlannedRelease): BumpType | undefined =>
  StablePlannedRelease.is(release) ? getStableVersionBump(release.version) : undefined

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
  readonly tags: readonly string[]
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
 *   Effect.provide(Plan.stable(ctx, { dryRun: true }), GitLive)
 * )
 * ```
 */
export const stable = (
  ctx: PlanContext,
  options?: ReleaseOptions,
): Effect.Effect<
  ReleasePlan,
  ReleaseError | Git.GitError | Git.GitParseError | PlatformError,
  Git.Git | FileSystem.FileSystem
> =>
  Effect.gen(function*() {
    const git = yield* Git.Git

    // 1. Get all tags and find the last release tag
    const tags = yield* git.getTags()
    const lastReleaseTag = findLastReleaseTag(ctx.packages, tags)

    // 2. Get commits since last release (or all commits if no releases yet)
    const commits = yield* git.getCommitsSince(lastReleaseTag)

    // 3. Parse commits and extract package impacts
    const allImpacts = yield* Effect.all(
      commits.map((c) => extractImpacts({ hash: c.hash, message: c.message })),
      { concurrency: 'unbounded' },
    )
    const impacts = allImpacts.flat()

    // 4. Aggregate by package to get highest bump per package
    const aggregated = aggregateByPackage(impacts)

    // 5. Build scope-to-package map for lookup
    const scopeToPackage = new Map(ctx.packages.map((p) => [p.scope, p]))

    // 6. Build release plan
    const releases: StablePlannedRelease[] = []

    for (const [scope, { bump, commits: structuredCommits }] of aggregated) {
      const pkg = scopeToPackage.get(scope)
      if (!pkg) continue // Scope doesn't match any known package

      // Apply package filters
      if (options?.packages && !options.packages.includes(pkg.name)) continue
      if (options?.exclude?.includes(pkg.name)) continue

      // Find current version from tags
      const currentVersion = findLatestTagVersion(pkg.name, tags)

      // Calculate next version
      const nextVersion = calculateNextVersion(currentVersion, bump)

      // Build version union
      const version: StableVersion = Option.isSome(currentVersion)
        ? StableVersionIncrement.make({ from: currentVersion.value, to: nextVersion, bump })
        : StableVersionFirst.make({ version: nextVersion })

      releases.push(StablePlannedRelease.make({
        package: pkg,
        version,
        commits: structuredCommits,
      }))
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
): PreviewPlannedRelease[] => {
  // Get standard cascades (as stable releases)
  const baseCascades = detectCascades(packages, primaryReleases, dependencyGraph, tags)

  // Convert to preview releases
  return baseCascades.map((cascade) => {
    // Get the stable version from the cascade
    const baseVersion = getNextVersion(cascade)

    // Find existing preview releases for this version
    const previewNumber = findLatestPreviewNumber(cascade.package.name, baseVersion, tags)

    return PreviewPlannedRelease.make({
      package: cascade.package,
      baseVersion,
      prerelease: PreviewPrerelease.make({ iteration: previewNumber + 1 }),
      commits: cascade.commits,
    })
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
  sha: Git.Sha.Sha,
): PrPlannedRelease[] => {
  // Get standard cascades (as stable releases)
  const baseCascades = detectCascades(packages, primaryReleases, dependencyGraph, tags)

  // Convert to PR releases
  return baseCascades.map((cascade) => {
    const prReleaseNumber = findLatestPrNumber(cascade.package.name, prNumber, tags)

    return PrPlannedRelease.make({
      package: cascade.package,
      prerelease: PrPrerelease.make({ prNumber, iteration: prReleaseNumber + 1, sha }),
      commits: cascade.commits,
    })
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
 *   Effect.provide(Plan.preview(ctx, { dryRun: true }), GitLive)
 * )
 * ```
 */
export const preview = (
  ctx: PlanContext,
  options?: ReleaseOptions,
): Effect.Effect<
  ReleasePlan,
  ReleaseError | Git.GitError | Git.GitParseError | PlatformError,
  Git.Git | FileSystem.FileSystem
> =>
  Effect.gen(function*() {
    const git = yield* Git.Git

    // 1. Get all tags and find the last release tag
    const tags = yield* git.getTags()
    const lastReleaseTag = findLastReleaseTag(ctx.packages, tags)

    // 2. Get commits since last release (or all commits if no releases yet)
    const commits = yield* git.getCommitsSince(lastReleaseTag)

    // 3. Parse commits and extract package impacts
    const allImpacts = yield* Effect.all(
      commits.map((c) => extractImpacts({ hash: c.hash, message: c.message })),
      { concurrency: 'unbounded' },
    )
    const impacts = allImpacts.flat()

    // 4. Aggregate by package to get highest bump per package
    const aggregated = aggregateByPackage(impacts)

    // 5. Build scope-to-package map for lookup
    const scopeToPackage = new Map(ctx.packages.map((p) => [p.scope, p]))

    // 6. Build release plan with preview versions
    const releases: PreviewPlannedRelease[] = []

    for (const [scope, { bump, commits: structuredCommits }] of aggregated) {
      const pkg = scopeToPackage.get(scope)
      if (!pkg) continue

      // Apply package filters
      if (options?.packages && !options.packages.includes(pkg.name)) continue
      if (options?.exclude?.includes(pkg.name)) continue

      // Find current stable version from tags
      const currentVersion = findLatestTagVersion(pkg.name, tags)

      // Calculate what the next stable version would be
      const baseVersion = calculateNextVersion(currentVersion, bump)

      // Find existing preview releases for this version
      const previewNumber = findLatestPreviewNumber(pkg.name, baseVersion, tags)

      releases.push(PreviewPlannedRelease.make({
        package: pkg,
        baseVersion,
        prerelease: PreviewPrerelease.make({ iteration: previewNumber + 1 }),
        commits: structuredCommits,
      }))
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
 *   Effect.provide(Plan.pr(ctx, { prNumber: 123 }), layer)
 * )
 * ```
 */
export const pr = (
  ctx: PlanContext,
  options?: PrReleaseOptions,
): Effect.Effect<
  ReleasePlan,
  ReleaseError | Git.GitError | Git.GitParseError | PlatformError,
  Git.Git | FileSystem.FileSystem | Env.Env
> =>
  Effect.gen(function*() {
    const git = yield* Git.Git
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
    const shaString = yield* git.getHeadSha()
    const sha = Git.Sha.make(shaString)

    // 3. Get all tags
    const tags = yield* git.getTags()
    const lastReleaseTag = findLastReleaseTag(ctx.packages, tags)

    // 4. Get commits since last release
    const commits = yield* git.getCommitsSince(lastReleaseTag)

    // 5. Parse commits and extract package impacts
    const allImpacts = yield* Effect.all(
      commits.map((c) => extractImpacts({ hash: c.hash, message: c.message })),
      { concurrency: 'unbounded' },
    )
    const impacts = allImpacts.flat()

    // 6. Aggregate by package to get highest bump per package
    const aggregated = aggregateByPackage(impacts)

    // 7. Build scope-to-package map for lookup
    const scopeToPackage = new Map(ctx.packages.map((p) => [p.scope, p]))

    // 8. Build release plan with PR versions
    const releases: PrPlannedRelease[] = []

    for (const [scope, { commits: structuredCommits }] of aggregated) {
      const pkg = scopeToPackage.get(scope)
      if (!pkg) continue

      // Apply package filters
      if (options?.packages && !options.packages.includes(pkg.name)) continue
      if (options?.exclude?.includes(pkg.name)) continue

      // Find existing PR releases for this PR
      const prReleaseNumber = findLatestPrNumber(pkg.name, prNumber, tags)

      releases.push(PrPlannedRelease.make({
        package: pkg,
        prerelease: PrPrerelease.make({ prNumber, iteration: prReleaseNumber + 1, sha }),
        commits: structuredCommits,
      }))
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
  /** Skip npm publish and git operations */
  readonly dryRun?: boolean
  /** npm dist-tag (default: 'latest') */
  readonly tag?: string
  /** npm registry URL */
  readonly registry?: string
  /** Path to workflow database (default: .release/workflow.db) */
  readonly dbPath?: string
}

/**
 * Apply a release plan.
 *
 * Uses a durable workflow backed by SQLite for resumable execution.
 * On partial failure, rerunning with the same plan will automatically
 * resume from where it left off (activities are idempotent).
 *
 * **Execution order:**
 * 1. Preflight checks (npm auth, git clean, tags don't exist)
 * 2. Publish all packages (with version injection/restoration)
 * 3. Create git tags locally
 * 4. Push all tags to remote
 *
 * @example
 * ```ts
 * // First attempt - provide workflow runtime and Git
 * const result = await Effect.runPromise(
 *   Effect.provide(
 *     apply(plan),
 *     Layer.mergeAll(makeWorkflowRuntime(), GitLive)
 *   )
 * )
 *
 * // Retry after partial failure - automatically resumes
 * const retryResult = await Effect.runPromise(
 *   Effect.provide(
 *     apply(plan),
 *     Layer.mergeAll(makeWorkflowRuntime(), GitLive)
 *   )
 * )
 * ```
 */
export const apply = (
  plan: ReleasePlan,
  options?: ApplyOptions,
) =>
  Effect.gen(function*() {
    // Combine primary releases and cascades
    const allReleases = [...plan.releases, ...plan.cascades]

    if (allReleases.length === 0) {
      return { released: [], tags: [] } as ReleaseResult
    }

    // Execute the durable workflow
    // Note: Requires workflow runtime layer to be provided by caller
    const workflowResult = yield* executeWorkflow(plan, {
      ...(options?.dryRun !== undefined && { dryRun: options.dryRun }),
      ...(options?.tag && { tag: options.tag }),
      ...(options?.registry && { registry: options.registry }),
    })

    // Build result from workflow output
    const released = allReleases.filter((r) => workflowResult.releasedPackages.includes(r.package.name))

    return {
      released,
      tags: workflowResult.createdTags,
    } as ReleaseResult
  })
