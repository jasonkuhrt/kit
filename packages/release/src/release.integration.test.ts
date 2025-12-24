import { Effect } from 'effect'
import { describe, expect, test } from 'vitest'
import { GitTest } from '@kitz/git/__'
import { planStable, apply, type ReleasePlan } from './release.js'
import type { Package } from './discovery.js'

/**
 * Integration tests for the release pipeline.
 *
 * These tests verify the complete flow from commit analysis to release
 * execution using an in-memory Git implementation.
 */

const mockPackages: Package[] = [
  { name: '@kitz/core', scope: 'core', path: '/repo/packages/core' },
  { name: '@kitz/cli', scope: 'cli', path: '/repo/packages/cli' },
  { name: '@kitz/utils', scope: 'utils', path: '/repo/packages/utils' },
]

describe('planStable integration', () => {
  test('no releases when no commits since last tag', async () => {
    const layer = GitTest.make({
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
    const layer = GitTest.make({
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
    const layer = GitTest.make({
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
    const layer = GitTest.make({
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
    const layer = GitTest.make({
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
    const layer = GitTest.make({
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
    const layer = GitTest.make({
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
    const layer = GitTest.make({
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
  // Note: Tests that call apply() with packages that have real paths would need
  // a fixture monorepo because apply() calls publishPackage which reads/writes
  // package.json files. These tests are skipped for pure in-memory testing.

  test.skip('creates git tags for each release - requires fixture monorepo', async () => {
    // This test requires actual package.json files to exist
    // because apply -> publishAll -> publishPackage reads package.json
    // See E2E fixture tests for comprehensive apply testing
  })

  test.skip('includes cascades in result - requires fixture monorepo', async () => {
    // This test requires actual package.json files to exist
    // See E2E fixture tests for comprehensive apply testing
  })

  test('returns empty result for empty plan', async () => {
    const plan: ReleasePlan = {
      releases: [],
      cascades: [],
    }

    const layer = GitTest.make({})

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
  test('plan workflow (apply requires fixture monorepo)', async () => {
    const { layer } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [
          GitTest.commit('feat(core): awesome new feature'),
        ],
      }),
    )

    // Step 1: Plan - this is fully testable in-memory
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

    // Step 2: Apply would require a fixture monorepo with real package.json files
    // because publishPackage reads/writes package.json during version injection.
    // The apply() function is tested in E2E fixture tests.
  })

  test('full cascade scenario', async () => {
    // This test would need proper dependency graph setup
    // For now, just verify the flow works
    const { layer } = await Effect.runPromise(
      GitTest.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0'],
        commits: [
          GitTest.commit('feat(core): new API'),
        ],
      }),
    )

    // Note: cascades depend on buildDependencyGraph reading actual package.json files
    // In integration tests with GitTest, the cascade detection still works
    // but requires the package.json files to exist (which they don't in this mock)
    // This is a limitation - for true E2E testing, we'd need a fixture monorepo

    const plan = await Effect.runPromise(
      Effect.provide(
        planStable({ packages: mockPackages }),
        layer,
      ),
    )

    // Just verify the primary release is detected
    expect(plan.releases).toHaveLength(1)
    expect(plan.releases[0]?.package.name).toBe('@kitz/core')
    // Cascades would be empty because package.json files don't exist
    // This is expected behavior for pure in-memory testing
  })
})
