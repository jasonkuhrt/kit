import { Data, Effect } from 'effect'
import * as Fs from 'node:fs'
import * as Path from 'node:path'

/**
 * Error discovering packages.
 */
export class DiscoveryError extends Data.TaggedError('DiscoveryError')<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * A discovered package in the monorepo.
 */
export interface Package {
  /** Directory name (used as scope in commits) */
  readonly scope: string
  /** Full package name from package.json */
  readonly name: string
  /** Absolute path to package directory */
  readonly path: string
}

/**
 * Scope to package name mapping.
 */
export type PackageMap = Record<string, string>

/**
 * Discover packages in the monorepo.
 *
 * Scans `packages/` directory for package.json files and builds
 * a scope-to-package mapping.
 *
 * @example
 * ```ts
 * const packages = await Effect.runPromise(discover('/path/to/repo'))
 * // [{ scope: 'core', name: '@kitz/core', path: '/path/to/repo/packages/core' }]
 * ```
 */
export const discover = (cwd: string): Effect.Effect<Package[], DiscoveryError> =>
  Effect.gen(function* () {
    const packagesDir = Path.join(cwd, 'packages')

    if (!Fs.existsSync(packagesDir)) {
      return []
    }

    const entries = yield* Effect.try({
      try: () => Fs.readdirSync(packagesDir, { withFileTypes: true }),
      catch: (error) =>
        new DiscoveryError({
          message: `Failed to read packages directory`,
          cause: error,
        }),
    })

    const packages: Package[] = []

    for (const entry of entries) {
      if (!entry.isDirectory()) continue

      const packageJsonPath = Path.join(packagesDir, entry.name, 'package.json')
      if (!Fs.existsSync(packageJsonPath)) continue

      const packageJson = yield* Effect.try({
        try: () => JSON.parse(Fs.readFileSync(packageJsonPath, 'utf-8')) as { name?: string },
        catch: (error) =>
          new DiscoveryError({
            message: `Failed to parse ${packageJsonPath}`,
            cause: error,
          }),
      })

      if (!packageJson.name) continue

      packages.push({
        scope: entry.name,
        name: packageJson.name,
        path: Path.join(packagesDir, entry.name),
      })
    }

    return packages
  })

/**
 * Build a scope-to-package-name map from discovered packages.
 *
 * @example
 * ```ts
 * const map = toPackageMap(packages)
 * // { core: '@kitz/core', kitz: 'kitz' }
 * ```
 */
export const toPackageMap = (packages: Package[]): PackageMap => {
  const map: PackageMap = {}
  for (const pkg of packages) {
    map[pkg.scope] = pkg.name
  }
  return map
}

/**
 * Resolve config packages with discovery fallback.
 *
 * If config.packages is empty, auto-discovers packages.
 * Otherwise uses the config values directly.
 */
export const resolvePackages = (
  cwd: string,
  configPackages: PackageMap,
): Effect.Effect<Package[], DiscoveryError> =>
  Effect.gen(function* () {
    // If config explicitly provides packages, use those
    if (Object.keys(configPackages).length > 0) {
      return Object.entries(configPackages).map(([scope, name]) => ({
        scope,
        name,
        path: Path.join(cwd, 'packages', scope),
      }))
    }

    // Otherwise discover from filesystem
    return yield* discover(cwd)
  })
