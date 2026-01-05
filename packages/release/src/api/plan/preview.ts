import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Git } from '@kitz/git'
import { Resource } from '@kitz/resource'
import { Effect } from 'effect'
import { buildDependencyGraph, detect as detectCascades } from '../cascade.js'
import * as Log from '../log/__.js'
import { PreviewPrerelease } from '../prerelease.js'
import type { Package } from '../scanner.js'
import { findLatestPreviewNumber } from '../version.js'
import { Preview } from './models/item-preview.js'
import type { Item } from './models/item.js'
import { Plan } from './models/plan.js'
import type { Options } from './options.js'
import type { Context } from './stable.js'

/**
 * Detect cascades for preview releases with preview version format.
 */
const detectCascadesForPreview = (
  packages: Package[],
  primaryReleases: Item[],
  dependencyGraph: Map<string, string[]>,
  tags: string[],
): Preview[] => {
  // Get standard cascades (as stable releases)
  const baseCascades = detectCascades(packages, primaryReleases, dependencyGraph, tags)

  // Convert to preview releases
  return baseCascades.map((cascade) => {
    // Get the stable version from the cascade (using getter)
    const baseVersion = cascade.nextVersion

    // Find existing preview releases for this version
    const previewNumber = findLatestPreviewNumber(cascade.package.name, baseVersion, tags)

    return Preview.make({
      package: cascade.package,
      baseVersion,
      prerelease: PreviewPrerelease.make({ iteration: previewNumber + 1 }),
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
 * const plan = yield* Plan.preview(ctx, { dryRun: true })
 * ```
 */
export const preview = (
  ctx: Context,
  options?: Options,
): Effect.Effect<
  Plan,
  Git.GitError | Git.GitParseError | PlatformError | Resource.ResourceError,
  Git.Git | FileSystem.FileSystem
> =>
  Effect.gen(function*() {
    const git = yield* Git.Git

    // 1. Get all tags (needed for cascade detection and preview numbers)
    const tags = yield* git.getTags()

    // 2. Generate logs to get per-package analysis
    const result = yield* Log.generate({
      packages: [...ctx.packages],
      tags,
      filter: options?.packages ? [...options.packages] : undefined,
    })

    // 3. Transform logs to preview planned releases
    const releases: Preview[] = []

    for (const log of result.logs) {
      // Apply exclude filter
      if (options?.exclude?.includes(log.package.name.moniker)) continue

      // Find existing preview releases for this version
      const previewNumber = findLatestPreviewNumber(log.package.name, log.nextVersion, tags)

      releases.push(Preview.make({
        package: log.package,
        baseVersion: log.nextVersion,
        prerelease: PreviewPrerelease.make({ iteration: previewNumber + 1 }),
        commits: log.commits,
      }))
    }

    // 4. Detect cascade releases
    const dependencyGraph = yield* buildDependencyGraph([...ctx.packages])
    const cascades = detectCascadesForPreview([...ctx.packages], releases, dependencyGraph, tags)

    return Plan.make({
      type: 'preview',
      timestamp: new Date().toISOString(),
      releases,
      cascades,
    })
  })
