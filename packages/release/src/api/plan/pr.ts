import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Env } from '@kitz/env'
import { Git } from '@kitz/git'
import { Resource } from '@kitz/resource'
import { Effect } from 'effect'
import { buildDependencyGraph, detect as detectCascades } from '../cascade.js'
import * as Log from '../log/__.js'
import { PrPrerelease } from '../prerelease.js'
import { ReleaseError } from '../release/models/error.js'
import type { Package } from '../scanner.js'
import { findLatestPrNumber } from '../version.js'
import { detectPrNumber } from './helpers.js'
import { Pr } from './models/item-pr.js'
import type { Item } from './models/item.js'
import { Plan } from './models/plan.js'
import type { PrOptions } from './options.js'
import type { Context } from './stable.js'

/**
 * Detect cascades for PR releases with PR version format.
 */
const detectCascadesForPr = (
  packages: Package[],
  primaryReleases: Item[],
  dependencyGraph: Map<string, string[]>,
  tags: string[],
  prNumber: number,
  sha: Git.Sha.Sha,
): Pr[] => {
  // Get standard cascades (as stable releases)
  const baseCascades = detectCascades(packages, primaryReleases, dependencyGraph, tags)

  // Convert to PR releases
  return baseCascades.map((cascade) => {
    const prReleaseNumber = findLatestPrNumber(cascade.package.name, prNumber, tags)

    return Pr.make({
      package: cascade.package,
      prerelease: PrPrerelease.make({ prNumber, iteration: prReleaseNumber + 1, sha }),
      commits: cascade.commits,
    })
  })
}

/**
 * Plan a PR release.
 *
 * Creates PR-specific versions for testing.
 * PR versions follow the pattern: `0.0.0-pr.${prNumber}.${n}.${sha}`
 *
 * @example
 * ```ts
 * const plan = yield* Plan.pr(ctx, { prNumber: 123 })
 * ```
 */
export const pr = (
  ctx: Context,
  options?: PrOptions,
): Effect.Effect<
  Plan,
  ReleaseError | Git.GitError | Git.GitParseError | PlatformError | Resource.ResourceError,
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

    // 3. Get all tags (needed for cascade detection and PR numbers)
    const tags = yield* git.getTags()

    // 4. Generate logs to get per-package analysis
    const result = yield* Log.generate({
      packages: [...ctx.packages],
      tags,
      filter: options?.packages ? [...options.packages] : undefined,
    })

    // 5. Transform logs to PR planned releases
    const releases: Pr[] = []

    for (const log of result.logs) {
      // Apply exclude filter
      if (options?.exclude?.includes(log.package.name.moniker)) continue

      // Find existing PR releases for this PR
      const prReleaseNumber = findLatestPrNumber(log.package.name, prNumber, tags)

      releases.push(Pr.make({
        package: log.package,
        prerelease: PrPrerelease.make({ prNumber, iteration: prReleaseNumber + 1, sha }),
        commits: log.commits,
      }))
    }

    // 6. Detect cascade releases
    const dependencyGraph = yield* buildDependencyGraph([...ctx.packages])
    const cascades = detectCascadesForPr([...ctx.packages], releases, dependencyGraph, tags, prNumber, sha)

    return Plan.make({
      type: 'pr',
      timestamp: new Date().toISOString(),
      releases,
      cascades,
    })
  })
