import { FileSystem } from '@effect/platform'
import type { PlatformError } from '@effect/platform/Error'
import { Err } from '@kitz/core'
import { Env } from '@kitz/env'
import { Fs } from '@kitz/fs'
import { Effect } from 'effect'

/**
 * Error discovering packages.
 */
export const DiscoveryError = Err.TaggedContextualError('DiscoveryError').constrain<{
  readonly file: Fs.Path.AbsFile
  readonly operation: 'parse'
}>({
  message: (ctx) => `Failed to ${ctx.operation} ${Fs.Path.toString(ctx.file)}`,
})

export type DiscoveryError = InstanceType<typeof DiscoveryError>

/**
 * A discovered package in the monorepo.
 */
export interface Package {
  /** Directory name (used as scope in commits) */
  readonly scope: string
  /** Full package name from package.json */
  readonly name: string
  /** Absolute path to package directory */
  readonly path: Fs.Path.AbsDir
}

/**
 * Scope to package name mapping.
 */
export type PackageMap = Record<string, string>

// Shared typed paths for reuse
const packagesRelDir = Fs.Path.RelDir.fromString('./packages/')
const packageJsonRelFile = Fs.Path.RelFile.fromString('./package.json')

/**
 * Discover packages in the monorepo.
 *
 * Scans `packages/` directory for package.json files and builds
 * a scope-to-package mapping.
 *
 * @example
 * ```ts
 * const packages = await Effect.runPromise(
 *   Effect.provide(discover, Layer.mergeAll(Env.Live, NodeFileSystem.layer))
 * )
 * // [{ scope: 'core', name: '@kitz/core', path: AbsDir('/path/to/repo/packages/core/') }]
 * ```
 */
export const discover: Effect.Effect<
  Package[],
  DiscoveryError | PlatformError,
  FileSystem.FileSystem | Env.Env
> = Effect.gen(function*() {
  const fs = yield* FileSystem.FileSystem
  const env = yield* Env.Env

  // Get cwd from Env service (already typed as AbsDir), join with packages/
  const packagesDir = Fs.Path.join(env.cwd, packagesRelDir)

  const exists = yield* fs.exists(Fs.Path.toString(packagesDir))
  if (!exists) {
    return []
  }

  const entries = yield* fs.readDirectory(Fs.Path.toString(packagesDir))

  const packages: Package[] = []

  for (const entry of entries) {
    // Create a RelDir for the package scope and join with packagesDir
    const scope = entry.replace(/\/$/, '') // Normalize: remove trailing slash if present
    const scopeRelDir = Fs.Path.RelDir.fromString(`./${scope}/`)
    const entryDir = Fs.Path.join(packagesDir, scopeRelDir)

    const info = yield* fs.stat(Fs.Path.toString(entryDir))
    if (info.type !== 'Directory') continue

    // Join with package.json RelFile to get absolute path
    const packageJsonPath = Fs.Path.join(entryDir, packageJsonRelFile)
    const packageJsonPathStr = Fs.Path.toString(packageJsonPath)

    const packageJsonExists = yield* fs.exists(packageJsonPathStr)
    if (!packageJsonExists) continue

    const content = yield* fs.readFileString(packageJsonPathStr)
    const packageJson = yield* Effect.try({
      try: () => JSON.parse(content) as { name?: string },
      catch: (cause) =>
        new DiscoveryError({
          context: { file: packageJsonPath, operation: 'parse' },
          cause: cause instanceof Error ? cause : new Error(String(cause)),
        }),
    })

    if (!packageJson.name) continue

    packages.push({
      scope,
      name: packageJson.name,
      path: entryDir,
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
  configPackages: PackageMap,
): Effect.Effect<Package[], DiscoveryError | PlatformError, FileSystem.FileSystem | Env.Env> =>
  Effect.gen(function*() {
    // If config explicitly provides packages, use those
    if (Object.keys(configPackages).length > 0) {
      const env = yield* Env.Env
      const packagesDir = Fs.Path.join(env.cwd, packagesRelDir)

      return Object.entries(configPackages).map(([scope, name]) => {
        const scopeRelDir = Fs.Path.RelDir.fromString(`./${scope}/`)
        const scopeDir = Fs.Path.join(packagesDir, scopeRelDir)
        return {
          scope,
          name,
          path: scopeDir,
        }
      })
    }

    // Otherwise discover from filesystem
    return yield* discover
  })
