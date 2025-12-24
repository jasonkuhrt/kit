import { Effect, Layer } from 'effect'
import { describe, expect, test } from 'vitest'
import { GitTest } from '@kitz/git/__'
import { Memory } from '@kitz/fs/__'
import { planStable, apply, type ReleasePlan } from './release.js'
import type { Package } from './discovery.js'

/**
 * Integration tests for the release pipeline.
 *
 * These tests verify the complete flow from commit analysis to release
 * execution using in-memory Git and FileSystem implementations.
 */

const mockPackages: Package[] = [
  { name: '@kitz/core', scope: 'core', path: '/repo/packages/core' },
  { name: '@kitz/cli', scope: 'cli', path: '/repo/packages/cli' },
  { name: '@kitz/utils', scope: 'utils', path: '/repo/packages/utils' },
]

/**
 * Create a combined layer with GitTest and Memory FileSystem.
 */
const makeTestLayer = (
  gitConfig: Parameters<typeof GitTest.make>[0],
  diskLayout: Memory.DiskLayout = {},
) => Layer.merge(GitTest.make(gitConfig), Memory.layer(diskLayout))

/**
 * Create package.json content with dependencies.
 */
const makePackageJson = (
  name: string,
  version: string,
  dependencies?: Record<string, string>,
) =>
  JSON.stringify(
    {
      name,
      version,
      ...(dependencies && { dependencies }),
    },
    null,
    2,
  )

describe('planStable integration', () => {
  test('no releases when no commits since last tag', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [], // No new commits
    })

    const result = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(0)
    expect(result.cascades).toHaveLength(0)
  })

  test('detects minor bump from feat commit', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [
        GitTest.commit('feat(core): add new feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]?.package.name).toBe('@kitz/core')
    expect(result.releases[0]?.bump).toBe('minor')
    expect(result.releases[0]?.currentVersion).toBe('1.0.0')
    expect(result.releases[0]?.nextVersion).toBe('1.1.0')
  })

  test('detects major bump from breaking change', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/cli@2.0.0'],
      commits: [
        GitTest.commit('feat(cli)!: breaking API change'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]?.package.name).toBe('@kitz/cli')
    expect(result.releases[0]?.bump).toBe('major')
    expect(result.releases[0]?.nextVersion).toBe('3.0.0')
  })

  test('aggregates multiple commits to highest bump', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [
        GitTest.commit('fix(core): bug fix 1'),
        GitTest.commit('fix(core): bug fix 2'),
        GitTest.commit('feat(core): new feature'),
        GitTest.commit('fix(core): bug fix 3'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    // Should be minor (feat beats fix)
    expect(result.releases[0]?.bump).toBe('minor')
    expect(result.releases[0]?.commits).toHaveLength(4)
  })

  test('handles multiple packages in single plan', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0', '@kitz/cli@2.0.0'],
      commits: [
        GitTest.commit('feat(core): core feature'),
        GitTest.commit('fix(cli): cli fix'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(2)

    const coreRelease = result.releases.find((r) => r.package.name === '@kitz/core')
    const cliRelease = result.releases.find((r) => r.package.name === '@kitz/cli')

    expect(coreRelease?.bump).toBe('minor')
    expect(coreRelease?.nextVersion).toBe('1.1.0')

    expect(cliRelease?.bump).toBe('patch')
    expect(cliRelease?.nextVersion).toBe('2.0.1')
  })

  test('first release starts at 0.1.0 for feat', async () => {
    const layer = makeTestLayer({
      tags: [], // No existing tags
      commits: [
        GitTest.commit('feat(utils): initial feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }),
        layer,
      ),
    )

    const utilsRelease = result.releases.find((r) => r.package.name === '@kitz/utils')
    expect(utilsRelease?.currentVersion).toBeNull()
    expect(utilsRelease?.nextVersion).toBe('0.1.0')
  })

  test('respects package filter option', async () => {
    const layer = makeTestLayer({
      tags: [],
      commits: [
        GitTest.commit('feat(core): core feature'),
        GitTest.commit('feat(cli): cli feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }, { packages: ['@kitz/core'] }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]?.package.name).toBe('@kitz/core')
  })

  test('respects exclude filter option', async () => {
    const layer = makeTestLayer({
      tags: [],
      commits: [
        GitTest.commit('feat(core): core feature'),
        GitTest.commit('feat(cli): cli feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }, { exclude: ['@kitz/cli'] }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]?.package.name).toBe('@kitz/core')
  })
})

describe('apply integration (dry-run)', () => {
  test('creates git tags for each release', async () => {
    const diskLayout: Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
    }

    const { layer: gitLayer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [GitTest.commit('feat(core): new feature')],
      }),
    )

    const layer = Layer.merge(gitLayer, Memory.layer(diskLayout))

    const plan = await Effect.runPromise(
      Effect.provide(planStable({ packages: mockPackages }), layer),
    )

    const result = await Effect.runPromise(
      Effect.provide(
        apply(plan, { dryRun: true }),
        layer,
      ),
    )

    expect(result.released).toHaveLength(1)
    expect(result.tags).toHaveLength(1)
    expect(result.tags[0]).toBe('@kitz/core@1.1.0')
  })

  test('includes cascades in result', async () => {
    // Set up a dependency: cli depends on core
    const diskLayout: Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
      '/repo/packages/cli/package.json': makePackageJson('@kitz/cli', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
    }

    const { layer: gitLayer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0'],
        commits: [GitTest.commit('feat(core): new API')],
      }),
    )

    const layer = Layer.merge(gitLayer, Memory.layer(diskLayout))

    const plan = await Effect.runPromise(
      Effect.provide(planStable({ packages: mockPackages }), layer),
    )

    // Primary release should be core
    expect(plan.releases).toHaveLength(1)
    expect(plan.releases[0]?.package.name).toBe('@kitz/core')

    // Cascade should include cli (depends on core)
    expect(plan.cascades).toHaveLength(1)
    expect(plan.cascades[0]?.package.name).toBe('@kitz/cli')
    expect(plan.cascades[0]?.bump).toBe('patch')
  })

  test('returns empty result for empty plan', async () => {
    const plan: ReleasePlan = {
      releases: [],
      cascades: [],
    }

    const layer = makeTestLayer({})

    const result = await Effect.runPromise(
      Effect.provide(
        apply(plan, { dryRun: true }),
        layer,
      ),
    )

    expect(result.released).toHaveLength(0)
    expect(result.tags).toHaveLength(0)
  })
})

describe('end-to-end pipeline', () => {
  test('complete plan and apply workflow', async () => {
    const diskLayout: Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
    }

    const { layer: gitLayer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [
          GitTest.commit('feat(core): awesome new feature'),
        ],
      }),
    )

    const layer = Layer.merge(gitLayer, Memory.layer(diskLayout))

    // Step 1: Plan
    const plan = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }),
        layer,
      ),
    )

    expect(plan.releases).toHaveLength(1)
    expect(plan.releases[0]?.nextVersion).toBe('1.1.0')
    expect(plan.releases[0]?.bump).toBe('minor')
    expect(plan.releases[0]?.package.name).toBe('@kitz/core')

    // Step 2: Apply (dry-run)
    const result = await Effect.runPromise(
      Effect.provide(
        apply(plan, { dryRun: true }),
        layer,
      ),
    )

    expect(result.released).toHaveLength(1)
    expect(result.tags).toContain('@kitz/core@1.1.0')
  })

  test('full cascade scenario', async () => {
    // Set up dependency graph: cli -> core, utils -> core
    const diskLayout: Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
      '/repo/packages/cli/package.json': makePackageJson('@kitz/cli', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
      '/repo/packages/utils/package.json': makePackageJson('@kitz/utils', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
    }

    const { layer: gitLayer, state } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0', '@kitz/utils@1.0.0'],
        commits: [
          GitTest.commit('feat(core): new API'),
        ],
      }),
    )

    const layer = Layer.merge(gitLayer, Memory.layer(diskLayout))

    const plan = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }),
        layer,
      ),
    )

    // Primary release
    expect(plan.releases).toHaveLength(1)
    expect(plan.releases[0]?.package.name).toBe('@kitz/core')
    expect(plan.releases[0]?.bump).toBe('minor')

    // Cascade releases (cli and utils both depend on core)
    expect(plan.cascades).toHaveLength(2)
    const cascadeNames = plan.cascades.map((c) => c.package.name)
    expect(cascadeNames).toContain('@kitz/cli')
    expect(cascadeNames).toContain('@kitz/utils')

    // Apply and verify
    const result = await Effect.runPromise(
      Effect.provide(
        apply(plan, { dryRun: true }),
        layer,
      ),
    )

    expect(result.released).toHaveLength(3)
    expect(result.tags).toContain('@kitz/core@1.1.0')
    expect(result.tags).toContain('@kitz/cli@1.0.1')
    expect(result.tags).toContain('@kitz/utils@1.0.1')
  })
})
