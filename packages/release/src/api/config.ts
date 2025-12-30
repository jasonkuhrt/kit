import { Data, Effect, Schema } from 'effect'
import * as Fs from 'node:fs'
import * as Path from 'node:path'

/**
 * Error loading release configuration.
 */
export class ConfigError extends Data.TaggedError('ConfigError')<{
  readonly message: string
  readonly cause?: unknown
}> {}

/**
 * Release configuration schema.
 */
export class ReleaseConfig extends Schema.Class<ReleaseConfig>('ReleaseConfig')({
  /** Main branch name (default: 'main') */
  trunk: Schema.optionalWith(Schema.String, { default: () => 'main' }),
  /** Dist-tag for stable releases (default: 'latest') */
  npmTag: Schema.optionalWith(Schema.String, { default: () => 'latest' }),
  /** Dist-tag for preview releases (default: 'next') */
  previewTag: Schema.optionalWith(Schema.String, { default: () => 'next' }),
  /** Skip npm publish (dry run) */
  skipNpm: Schema.optionalWith(Schema.Boolean, { default: () => false }),
  /** Scope to package name mapping (auto-scanned if not provided) */
  packages: Schema.optionalWith(
    Schema.Record({ key: Schema.String, value: Schema.String }),
    { default: () => ({}) },
  ),
}) {}

/**
 * Define release configuration with type safety.
 *
 * @example
 * ```ts
 * // release.config.ts
 * import { defineConfig } from '@kitz/release'
 *
 * export default defineConfig({
 *   trunk: 'main',
 *   packages: {
 *     core: '@kitz/core',
 *     kitz: 'kitz',
 *   },
 * })
 * ```
 */
export const defineConfig = (config: Partial<typeof ReleaseConfig.Type>): typeof ReleaseConfig.Type =>
  ReleaseConfig.make({
    trunk: config.trunk ?? 'main',
    npmTag: config.npmTag ?? 'latest',
    previewTag: config.previewTag ?? 'next',
    skipNpm: config.skipNpm ?? false,
    packages: config.packages ?? {},
  })

/**
 * Load configuration from release.config.ts or use defaults.
 */
export const load = (cwd: string): Effect.Effect<typeof ReleaseConfig.Type, ConfigError> =>
  Effect.gen(function*() {
    const configPath = Path.join(cwd, 'release.config.ts')

    if (!Fs.existsSync(configPath)) {
      return ReleaseConfig.make({})
    }

    // Dynamic import for config file
    const imported = yield* Effect.tryPromise({
      try: async () => {
        const module = await import(configPath)
        return module.default as typeof ReleaseConfig.Type
      },
      catch: (error) =>
        new ConfigError({
          message: `Failed to load config from ${configPath}`,
          cause: error,
        }),
    })

    return imported
  })
