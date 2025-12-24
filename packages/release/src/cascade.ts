import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Fs } from '@kitz/fs'
import { Effect } from 'effect'
import type { Package } from './discovery.js'
import type { PlannedRelease } from './release.js'
import { calculateNextVersion, findLatestTagVersion } from './version.js'

/**
 * Dependency graph: package name -> list of packages that depend on it.
 */
export type DependencyGraph = Map<string, string[]>

/**
 * Build a reverse dependency graph from package.json files.
 *
 * Maps each package name to the list of packages that depend on it.
 * Uses Effect's FileSystem service for testability.
 */
// Shared typed path for package.json
const packageJsonRelFile = Fs.Path.RelFile.fromString('./package.json')

export const buildDependencyGraph = (
  packages: Package[],
): Effect.Effect<DependencyGraph, PlatformError, FileSystem.FileSystem> =>
  Effect.gen(function*() {
    const fs = yield* FileSystem.FileSystem
    const graph: DependencyGraph = new Map()
    const packageNames = new Set(packages.map((p) => p.name))

    // Initialize all packages with empty dependents
    for (const name of packageNames) {
      graph.set(name, [])
    }

    for (const pkg of packages) {
      const packageJsonPath = Fs.Path.join(pkg.path, packageJsonRelFile)
      const packageJsonPathStr = Fs.Path.toString(packageJsonPath)

      // Check if file exists
      const exists = yield* fs.exists(packageJsonPathStr)
      if (!exists) continue

      // Read and parse package.json
      const contentResult = yield* Effect.either(
        fs.readFileString(packageJsonPathStr).pipe(
          Effect.map((content) =>
            JSON.parse(content) as {
              dependencies?: Record<string, string>
              devDependencies?: Record<string, string>
              peerDependencies?: Record<string, string>
            }
          ),
        ),
      )

      if (contentResult._tag === 'Left') {
        // Skip packages with invalid package.json
        continue
      }

      const content = contentResult.right

      // Check all dependency types
      const allDeps = {
        ...content.dependencies,
        ...content.devDependencies,
        ...content.peerDependencies,
      }

      for (const depName of Object.keys(allDeps)) {
        // Only track workspace dependencies
        if (!packageNames.has(depName)) continue

        const dependents = graph.get(depName) ?? []
        dependents.push(pkg.name)
        graph.set(depName, dependents)
      }
    }

    return graph
  })

/**
 * Find all packages that need cascade releases.
 *
 * A package needs a cascade release if:
 * 1. It depends on a package being released
 * 2. It's not already in the primary releases list
 *
 * Cascade releases propagate recursively - if A depends on B and B depends on C,
 * and C is released, both B and A get cascade releases.
 */
export const detectCascades = (
  packages: Package[],
  primaryReleases: PlannedRelease[],
  dependencyGraph: DependencyGraph,
  tags: string[],
): PlannedRelease[] => {
  // Set of packages already getting released
  const releasing = new Set(primaryReleases.map((r) => r.package.name))

  // Set of packages that need cascade releases
  const needsCascade = new Set<string>()

  // Queue for BFS traversal
  const queue = [...releasing]

  while (queue.length > 0) {
    const pkgName = queue.shift()!
    const dependents = dependencyGraph.get(pkgName) ?? []

    for (const dependent of dependents) {
      // Skip if already releasing or already queued for cascade
      if (releasing.has(dependent) || needsCascade.has(dependent)) continue

      needsCascade.add(dependent)
      queue.push(dependent) // Propagate cascades
    }
  }

  // Build cascade releases
  const nameToPackage = new Map(packages.map((p) => [p.name, p]))
  const cascades: PlannedRelease[] = []

  for (const name of needsCascade) {
    const pkg = nameToPackage.get(name)
    if (!pkg) continue

    const currentVersion = findLatestTagVersion(name, tags)
    const nextVersion = calculateNextVersion(currentVersion, 'patch')

    // Find which primary release(s) triggered this cascade
    const triggers: string[] = []
    const deps = dependencyGraph.get(name)
    if (deps) {
      for (const primary of primaryReleases) {
        if (deps.includes(primary.package.name)) {
          triggers.push(`Depends on ${primary.package.name}@${primary.nextVersion}`)
        }
      }
    }

    cascades.push({
      package: pkg,
      currentVersion,
      nextVersion,
      bump: 'patch',
      commits: triggers.length > 0 ? triggers : ['Cascade release'],
    })
  }

  return cascades
}
