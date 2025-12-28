import { Env } from '@kitz/env'
import { Fs } from '@kitz/fs'
import { Git } from '@kitz/git'
import { Semver } from '@kitz/semver'
import { Effect, Layer, Option } from 'effect'
import { describe, expect, test } from 'vitest'
import { Plan, type Workspace } from './__.js'
import { makeTestWorkflowRuntime } from './workflow.js'

/** Helper to compare Semver values */
const expectVersion = (actual: Semver.Semver | null | undefined, expected: string) => {
  if (actual === null || actual === undefined) {
    expect(actual).toBe(expected)
  } else {
    expect(Semver.equivalence(actual, Semver.fromString(expected))).toBe(true)
  }
}

/** Helper to compare Option<Semver> values */
const expectOptionVersion = (actual: Option.Option<Semver.Semver> | undefined, expected: string) => {
  if (actual === undefined) {
    expect(actual).toBe(expected)
  } else if (Option.isNone(actual)) {
    expect.fail(`Expected version ${expected} but got Option.None`)
  } else {
    expect(Semver.equivalence(actual.value, Semver.fromString(expected))).toBe(true)
  }
}

/**
 * Integration tests for the release pipeline.
 *
 * These tests verify the complete flow from commit analysis to release
 * execution using in-memory Git and FileSystem implementations.
 */

const mockPackages: Workspace.Package[] = [
  { name: '@kitz/core', scope: 'core', path: Fs.Path.AbsDir.fromString('/repo/packages/core/') },
  { name: '@kitz/cli', scope: 'cli', path: Fs.Path.AbsDir.fromString('/repo/packages/cli/') },
  { name: '@kitz/utils', scope: 'utils', path: Fs.Path.AbsDir.fromString('/repo/packages/utils/') },
]

// Test env layer with /repo/ as cwd
const testEnv = Env.Test({ cwd: Fs.Path.AbsDir.fromString('/repo/') })

// In-memory workflow runtime for tests
const testWorkflowRuntime = makeTestWorkflowRuntime()

/**
 * Create a combined layer with Git.Test, Memory FileSystem, and Env.
 */
const makeTestLayer = (
  gitConfig: Parameters<typeof Git.Test.make>[0],
  diskLayout: Fs.Memory.DiskLayout = {},
) => Layer.mergeAll(Git.Test.make(gitConfig), Fs.Memory.layer(diskLayout), testEnv)

/**
 * Create a test layer that includes workflow runtime for apply() tests.
 */
const makeApplyTestLayer = (
  gitConfig: Parameters<typeof Git.Test.make>[0],
  diskLayout: Fs.Memory.DiskLayout = {},
) =>
  Layer.provideMerge(
    makeTestLayer(gitConfig, diskLayout),
    testWorkflowRuntime,
  )

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
        Plan.stable({ packages: mockPackages }),
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
        Git.Test.commit('feat(core): add new feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.stable({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]?.package.name).toBe('@kitz/core')
    expect(result.releases[0]?.bump).toBe('minor')
    expectOptionVersion(result.releases[0]?.currentVersion, '1.0.0')
    expectVersion(result.releases[0]?.nextVersion, '1.1.0')
  })

  test('detects major bump from breaking change', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/cli@2.0.0'],
      commits: [
        Git.Test.commit('feat(cli)!: breaking API change'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.stable({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]?.package.name).toBe('@kitz/cli')
    expect(result.releases[0]?.bump).toBe('major')
    expectVersion(result.releases[0]?.nextVersion, '3.0.0')
  })

  test('aggregates multiple commits to highest bump', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [
        Git.Test.commit('fix(core): bug fix 1'),
        Git.Test.commit('fix(core): bug fix 2'),
        Git.Test.commit('feat(core): new feature'),
        Git.Test.commit('fix(core): bug fix 3'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.stable({ packages: mockPackages }),
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
        Git.Test.commit('feat(core): core feature'),
        Git.Test.commit('fix(cli): cli fix'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.stable({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(2)

    const coreRelease = result.releases.find((r) => r.package.name === '@kitz/core')
    const cliRelease = result.releases.find((r) => r.package.name === '@kitz/cli')

    expect(coreRelease?.bump).toBe('minor')
    expectVersion(coreRelease?.nextVersion, '1.1.0')

    expect(cliRelease?.bump).toBe('patch')
    expectVersion(cliRelease?.nextVersion, '2.0.1')
  })

  test('first release starts at 0.1.0 for feat', async () => {
    const layer = makeTestLayer({
      tags: [], // No existing tags
      commits: [
        Git.Test.commit('feat(utils): initial feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.stable({ packages: mockPackages }),
        layer,
      ),
    )

    const utilsRelease = result.releases.find((r) => r.package.name === '@kitz/utils')
    expect(utilsRelease?.currentVersion).toBeDefined()
    expect(Option.isNone(utilsRelease!.currentVersion)).toBe(true)
    expectVersion(utilsRelease?.nextVersion, '0.1.0')
  })

  test('respects package filter option', async () => {
    const layer = makeTestLayer({
      tags: [],
      commits: [
        Git.Test.commit('feat(core): core feature'),
        Git.Test.commit('feat(cli): cli feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.stable({ packages: mockPackages }, { packages: ['@kitz/core'] }),
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
        Git.Test.commit('feat(core): core feature'),
        Git.Test.commit('feat(cli): cli feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.stable({ packages: mockPackages }, { exclude: ['@kitz/cli'] }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]?.package.name).toBe('@kitz/core')
  })
})

describe('apply integration (dry-run)', () => {
  test('creates git tags for each release', async () => {
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
    }

    const { layer: gitLayer } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [Git.Test.commit('feat(core): new feature')],
      }),
    )

    const baseLayer = Layer.mergeAll(gitLayer, Fs.Memory.layer(diskLayout), testEnv)
    const layer = Layer.provideMerge(testWorkflowRuntime, baseLayer)

    const plan = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), baseLayer),
    )

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.apply(plan, { dryRun: true }),
        layer,
      ),
    )

    expect(result.released).toHaveLength(1)
    expect(result.tags).toHaveLength(1)
    expect(result.tags[0]).toBe('@kitz/core@1.1.0')
  })

  test('includes cascades in result', async () => {
    // Set up a dependency: cli depends on core
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
      '/repo/packages/cli/package.json': makePackageJson('@kitz/cli', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
    }

    const { layer: gitLayer } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0'],
        commits: [Git.Test.commit('feat(core): new API')],
      }),
    )

    const layer = Layer.mergeAll(gitLayer, Fs.Memory.layer(diskLayout), testEnv)

    const plan = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), layer),
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
    const plan: Plan.ReleasePlan = {
      releases: [],
      cascades: [],
    }

    const layer = makeTestLayer({})

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.apply(plan, { dryRun: true }),
        layer,
      ),
    )

    expect(result.released).toHaveLength(0)
    expect(result.tags).toHaveLength(0)
  })
})

describe('workflow durability', () => {
  test('idempotent execution returns same result', async () => {
    // The workflow uses an idempotency key based on releases.
    // Executing the same workflow twice should return consistent results.
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
    }

    const { layer: gitLayer } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [Git.Test.commit('feat(core): new feature')],
      }),
    )

    const baseLayer = Layer.mergeAll(gitLayer, Fs.Memory.layer(diskLayout), testEnv)
    const layer = Layer.provideMerge(testWorkflowRuntime, baseLayer)

    const plan = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), baseLayer),
    )

    // First execution
    const result1 = await Effect.runPromise(
      Effect.provide(
        Plan.apply(plan, { dryRun: true }),
        layer,
      ),
    )

    // Second execution with same plan (same idempotency key)
    const result2 = await Effect.runPromise(
      Effect.provide(
        Plan.apply(plan, { dryRun: true }),
        layer,
      ),
    )

    // Both should return the same result
    expect(result1.released).toHaveLength(1)
    expect(result2.released).toHaveLength(1)
    expect(result1.tags).toEqual(result2.tags)
    expect(result1.released.map((r) => r.package.name)).toEqual(
      result2.released.map((r) => r.package.name),
    )
  })

  test('workflow with multiple packages tracks all activities', async () => {
    // This verifies the workflow engine properly tracks completion
    // of multiple activities (one per package)
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
      '/repo/packages/cli/package.json': makePackageJson('@kitz/cli', '1.0.0'),
    }

    const { layer: gitLayer } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0'],
        commits: [
          Git.Test.commit('feat(core): core feature'),
          Git.Test.commit('fix(cli): cli fix'),
        ],
      }),
    )

    const baseLayer = Layer.mergeAll(gitLayer, Fs.Memory.layer(diskLayout), testEnv)
    const layer = Layer.provideMerge(testWorkflowRuntime, baseLayer)

    const plan = await Effect.runPromise(
      Effect.provide(Plan.stable({ packages: mockPackages }), baseLayer),
    )

    expect(plan.releases).toHaveLength(2)

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.apply(plan, { dryRun: true }),
        layer,
      ),
    )

    // All packages should be released with their own tags
    expect(result.released).toHaveLength(2)
    expect(result.tags).toContain('@kitz/core@1.1.0')
    expect(result.tags).toContain('@kitz/cli@1.0.1')
  })
})

describe('end-to-end pipeline', () => {
  test('complete plan and apply workflow', async () => {
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
    }

    const { layer: gitLayer } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0'],
        commits: [
          Git.Test.commit('feat(core): awesome new feature'),
        ],
      }),
    )

    const baseLayer = Layer.mergeAll(gitLayer, Fs.Memory.layer(diskLayout), testEnv)
    const layer = Layer.provideMerge(testWorkflowRuntime, baseLayer)

    // Step 1: Plan
    const plan = await Effect.runPromise(
      Effect.provide(
        Plan.stable({ packages: mockPackages }),
        baseLayer,
      ),
    )

    expect(plan.releases).toHaveLength(1)
    expectVersion(plan.releases[0]?.nextVersion, '1.1.0')
    expect(plan.releases[0]?.bump).toBe('minor')
    expect(plan.releases[0]?.package.name).toBe('@kitz/core')

    // Step 2: Apply (dry-run)
    const result = await Effect.runPromise(
      Effect.provide(
        Plan.apply(plan, { dryRun: true }),
        layer,
      ),
    )

    expect(result.released).toHaveLength(1)
    expect(result.tags).toContain('@kitz/core@1.1.0')
  })

  test('full cascade scenario', async () => {
    // Set up dependency graph: cli -> core, utils -> core
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
      '/repo/packages/cli/package.json': makePackageJson('@kitz/cli', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
      '/repo/packages/utils/package.json': makePackageJson('@kitz/utils', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
    }

    const { layer: gitLayer } = await Effect.runPromise(
      Git.Test.makeWithState({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0', '@kitz/utils@1.0.0'],
        commits: [
          Git.Test.commit('feat(core): new API'),
        ],
      }),
    )

    const baseLayer = Layer.mergeAll(gitLayer, Fs.Memory.layer(diskLayout), testEnv)
    const layer = Layer.provideMerge(testWorkflowRuntime, baseLayer)

    const plan = await Effect.runPromise(
      Effect.provide(
        Plan.stable({ packages: mockPackages }),
        baseLayer,
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
        Plan.apply(plan, { dryRun: true }),
        layer,
      ),
    )

    expect(result.released).toHaveLength(3)
    expect(result.tags).toContain('@kitz/core@1.1.0')
    expect(result.tags).toContain('@kitz/cli@1.0.1')
    expect(result.tags).toContain('@kitz/utils@1.0.1')
  })
})

describe('planPreview integration', () => {
  test('generates preview version from feat commit', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [
        Git.Test.commit('feat(core): add new feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.preview({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]?.package.name).toBe('@kitz/core')
    expect(result.releases[0]?.bump).toBe('minor')
    // Preview version: nextStable-next.N
    expectVersion(result.releases[0]?.nextVersion, '1.1.0-next.1')
  })

  test('increments preview number for existing previews', async () => {
    const layer = makeTestLayer({
      tags: [
        '@kitz/core@1.0.0',
        '@kitz/core@1.1.0-next.1',
        '@kitz/core@1.1.0-next.2',
      ],
      commits: [
        Git.Test.commit('feat(core): add new feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.preview({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    // Should be next.3 since next.1 and next.2 already exist
    expectVersion(result.releases[0]?.nextVersion, '1.1.0-next.3')
  })

  test('first preview release starts at next.1', async () => {
    const layer = makeTestLayer({
      tags: [], // No existing tags
      commits: [
        Git.Test.commit('feat(core): initial feature'),
      ],
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.preview({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    // First release at 0.1.0, preview version 0.1.0-next.1
    expectVersion(result.releases[0]?.nextVersion, '0.1.0-next.1')
  })

  test('generates preview cascades with preview versions', async () => {
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
      '/repo/packages/cli/package.json': makePackageJson('@kitz/cli', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
    }

    const layer = Layer.mergeAll(
      Git.Test.make({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0'],
        commits: [Git.Test.commit('feat(core): new API')],
      }),
      Fs.Memory.layer(diskLayout),
      testEnv,
    )

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.preview({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expectVersion(result.releases[0]?.nextVersion, '1.1.0-next.1')

    expect(result.cascades).toHaveLength(1)
    expect(result.cascades[0]?.package.name).toBe('@kitz/cli')
    // Cascade gets preview version too
    expectVersion(result.cascades[0]?.nextVersion, '1.0.1-next.1')
  })
})

describe('planPr integration', () => {
  test('generates PR version with explicit prNumber', async () => {
    const layer = makeTestLayer({
      tags: ['@kitz/core@1.0.0'],
      commits: [
        Git.Test.commit('feat(core): add new feature'),
      ],
      headSha: 'abc1234',
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.pr({ packages: mockPackages }, { prNumber: 42 }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expect(result.releases[0]?.package.name).toBe('@kitz/core')
    // PR version: 0.0.0-pr.PR.N.SHA
    expectVersion(result.releases[0]?.nextVersion, '0.0.0-pr.42.1.abc1234')
  })

  test('increments PR release number for existing PR releases', async () => {
    const layer = makeTestLayer({
      tags: [
        '@kitz/core@1.0.0',
        '@kitz/core@0.0.0-pr.42.1.def5678',
        '@kitz/core@0.0.0-pr.42.2.abc9012',
      ],
      commits: [
        Git.Test.commit('feat(core): add new feature'),
      ],
      headSha: 'abc1234',
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.pr({ packages: mockPackages }, { prNumber: 42 }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    // Should be .3 since .1 and .2 already exist for this PR
    expectVersion(result.releases[0]?.nextVersion, '0.0.0-pr.42.3.abc1234')
  })

  test('different PRs have independent numbering', async () => {
    const layer = makeTestLayer({
      tags: [
        '@kitz/core@1.0.0',
        '@kitz/core@0.0.0-pr.42.1.def5678',
        '@kitz/core@0.0.0-pr.42.2.abc9012',
      ],
      commits: [
        Git.Test.commit('feat(core): add new feature'),
      ],
      headSha: 'abc1234',
    })

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.pr({ packages: mockPackages }, { prNumber: 99 }), // Different PR
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    // Should be .1 since PR 99 has no existing releases
    expectVersion(result.releases[0]?.nextVersion, '0.0.0-pr.99.1.abc1234')
  })

  test('detects PR number from environment', async () => {
    const envWithPr = Env.Test({
      cwd: Fs.Path.AbsDir.fromString('/repo/'),
      vars: { PR_NUMBER: '123' },
    })

    const layer = Layer.mergeAll(
      Git.Test.make({
        tags: ['@kitz/core@1.0.0'],
        commits: [Git.Test.commit('feat(core): add new feature')],
        headSha: 'def7890',
      }),
      Fs.Memory.layer({}),
      envWithPr,
    )

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.pr({ packages: mockPackages }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expectVersion(result.releases[0]?.nextVersion, '0.0.0-pr.123.1.def7890')
  })

  test('fails when PR number cannot be detected', async () => {
    const envWithoutPr = Env.Test({
      cwd: Fs.Path.AbsDir.fromString('/repo/'),
      vars: {}, // No PR env vars
    })

    const layer = Layer.mergeAll(
      Git.Test.make({
        tags: ['@kitz/core@1.0.0'],
        commits: [Git.Test.commit('feat(core): add new feature')],
      }),
      Fs.Memory.layer({}),
      envWithoutPr,
    )

    await expect(
      Effect.runPromise(
        Effect.provide(
          Plan.pr({ packages: mockPackages }),
          layer,
        ),
      ),
    ).rejects.toThrow('Could not detect PR number')
  })

  test('generates PR cascades with PR versions', async () => {
    const diskLayout: Fs.Memory.DiskLayout = {
      '/repo/packages/core/package.json': makePackageJson('@kitz/core', '1.0.0'),
      '/repo/packages/cli/package.json': makePackageJson('@kitz/cli', '1.0.0', {
        '@kitz/core': 'workspace:*',
      }),
    }

    const layer = Layer.mergeAll(
      Git.Test.make({
        tags: ['@kitz/core@1.0.0', '@kitz/cli@1.0.0'],
        commits: [Git.Test.commit('feat(core): new API')],
        headSha: 'aaa1234',
      }),
      Fs.Memory.layer(diskLayout),
      testEnv,
    )

    const result = await Effect.runPromise(
      Effect.provide(
        Plan.pr({ packages: mockPackages }, { prNumber: 55 }),
        layer,
      ),
    )

    expect(result.releases).toHaveLength(1)
    expectVersion(result.releases[0]?.nextVersion, '0.0.0-pr.55.1.aaa1234')

    expect(result.cascades).toHaveLength(1)
    expect(result.cascades[0]?.package.name).toBe('@kitz/cli')
    // Cascade gets PR version too
    expectVersion(result.cascades[0]?.nextVersion, '0.0.0-pr.55.1.aaa1234')
  })
})
