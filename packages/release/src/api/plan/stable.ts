import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Git } from '@kitz/git'
import { Resource } from '@kitz/resource'
import { Effect, Option } from 'effect'
import { buildDependencyGraph, detect as detectCascades } from '../cascade.js'
import * as Log from '../log/__.js'
import { Stable } from './models/item-stable.js'
import { Plan } from './models/plan.js'
import type { StableVersion } from './models/stable-version.js'
import { StableVersionFirst, StableVersionIncrement } from './models/stable-version.js'
import type { Options } from './options.js'

/**
 * Context required for planning.
 */
export interface Context {
  readonly packages: readonly import('../scanner.js').Package[]
}

/**
 * Plan a stable release.
 *
 * Analyzes commits since last release and determines version bumps.
 *
 * @example
 * ```ts
 * const plan = yield* Plan.stable(ctx, { dryRun: true })
 * ```
 */
export const stable = (
  ctx: Context,
  options?: Options,
): Effect.Effect<
  Plan,
  Git.GitError | Git.GitParseError | PlatformError | Resource.ResourceError,
  Git.Git | FileSystem.FileSystem
> =>
  Effect.gen(function*() {
    const git = yield* Git.Git

    // 1. Get all tags (needed for cascade detection)
    const tags = yield* git.getTags()

    // 2. Generate logs to get per-package analysis
    const result = yield* Log.generate({
      packages: [...ctx.packages],
      tags,
      filter: options?.packages ? [...options.packages] : undefined,
    })

    // 3. Transform logs to planned releases
    const releases: Stable[] = []

    for (const log of result.logs) {
      // Apply exclude filter
      if (options?.exclude?.includes(log.package.name.moniker)) continue

      // Build version union
      const version: StableVersion = Option.isSome(log.currentVersion)
        ? StableVersionIncrement.make({ from: log.currentVersion.value, to: log.nextVersion, bump: log.bump })
        : StableVersionFirst.make({ version: log.nextVersion })

      releases.push(Stable.make({
        package: log.package,
        version,
        commits: log.commits,
      }))
    }

    // 4. Detect cascade releases (packages that depend on released packages)
    const dependencyGraph = yield* buildDependencyGraph([...ctx.packages])
    const cascades = detectCascades([...ctx.packages], releases, dependencyGraph, tags)

    return Plan.make({
      type: 'stable',
      timestamp: new Date().toISOString(),
      releases,
      cascades,
    })
  })
